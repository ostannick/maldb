<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

use App\Models\Process;
use App\Models\Status;
use App\Models\Proteome;
use App\Models\Digest;

use Auth;

class ProcessDigest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $req;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($req)
    {
        $this->req = $req;

        //Create a new process
        $process = new Process();
        $process->user_id = Auth::user()->id;

        //Get the proteome of interest.
        $proteome = Proteome::find($this->req['proteome_id']);
        $enzyme = $this->req['opt_enzyme'];
        $max_mc = $this->req['opt_mc'];

        //Name the table something unique for the user and the proteome
        $tableName        = Auth::user()->id . '_' . $proteome->name;
        $tableNameDigest  = Auth::user()->id . '_' . $proteome->name . '_' . $enzyme . '_' . 'dig';

        //
        $process->description = "Digesting " . $proteome->name . " with " . $enzyme;
        $process->save();

        //Has a sequence table already been generated for this proteome? If not, we need to make one.
        if(!Schema::hasTable($tableName))
        {
          //create a proteome table
          Schema::create($tableName, function(Blueprint $table){
            $table->increments('id');
            $table->string('name');
            $table->text('sequence');
          });
        }

        if(Schema::hasTable($tableNameDigest))
        {
          //A digest table already exists with this name... lets erase it under the assumption the user has provided new parameters.
          Schema::drop($tableNameDigest);
        }

        //create a base peptide digest table
        Schema::create($tableNameDigest, function(Blueprint $table){
            $table->increments('id');
            $table->string('parent')->nullable();
            $table->string('sequence')->nullable();
            $table->decimal('mz1_average')->nullable();
            $table->decimal('mz1_monoisotopic')->nullable();
            $table->integer('missed_cleavages')->nullable();
            $table->integer('met_ox_count')->nullable();
        });

        //Create the entry in the digests table
        Digest::create([
          'user_id' => Auth::user()->id,
          'proteome_id' => $proteome->id,
          'table_name' => $tableNameDigest,
          'enzyme' => $enzyme,
          'max_mc' => $max_mc,
          'status' => 'Empty'
        ]);

        //Run the digest script (PYTHON):

        $command = implode(' ', [
          'py',
          '../python/fasta_to_json.py',
          '../storage/app/' . $proteome->path,
          '../storage/app/' . Auth::user()->id . '/proteomes/' . $tableNameDigest . '.json',
          '../storage/app/' . Auth::user()->id . '/proteomes/' . $tableName . '.json',
          $enzyme
        ]);

        shell_exec($command);

        /*

          for($i = 0; $i < 15; $i++)
          {
            sleep(1);

            update_status($process->id, $i/15, 'Added a bunch of peptides...');
          }

          complete_process($process->id);

        */

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
    }
}
