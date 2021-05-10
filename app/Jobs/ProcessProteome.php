<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Auth;

use App\Models\Proteome;
use App\Models\Digest;
use App\Models\Process;
use App\Models\Status;

class ProcessProteome implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {

      //Create a new process
      $process = new Process();

      //Get the proteome of interest.
      $proteome = Proteome::find($this->request['proteome_id']);
      $enzyme = $this->request['opt_enzyme'];
      $max_mc = $this->request['opt_mc'];

      //Name the table something unique for the user and the proteome
      $tableName        = Auth::user()->id . '_' . $proteome->name;
      $tableNameDigest  = Auth::user()->id . '_' . $proteome->name . '_' . $enzyme . '_' . 'dig';

      //
      $process->description = "Digesting " . $proteome . " with " . $enzyme;

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

        for($i = 0; $i < 10; $i++)
        {
          sleep(1);

          $status = new Status();
          $status->process_id = $process->id;
          $status->progress = $i / 10;
          $status->description = "Sleeping at " . $i;
        }
    }
}
