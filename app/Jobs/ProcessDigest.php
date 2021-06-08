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

class ProcessDigest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $req;
    protected $user_id;
    public $timeout = 99999999;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($req, $user_id)
    {
        $this->req = $req;
        $this->user_id = $user_id;
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
      $process->user_id = $this->user_id;
      

      //Get the proteome of interest.
      $proteome = Proteome::find($this->req['proteome_id']);
      $enzyme = $this->req['opt_enzyme'];
      $max_mc = $this->req['opt_mc'];

      //Name the table something unique for the user and the proteome
      $tableName        = $this->user_id . '_' . $proteome->name;
      $tableNameDigest  = $this->user_id . '_' . $proteome->name . '_' . $enzyme . '_' . 'dig';

      //
      $process->description = "Digesting " . $proteome->name . " with " . $enzyme;
      $process->save();
      update_status($process->id, 0.01, 'Process initialized...');

      //No need to remake the parent table for subsequent digests.
      update_status($process->id, 0.03, 'Creating parent table.');
      if(!Schema::hasTable($tableName))
      {
        //create a proteome table
        Schema::create($tableName, function(Blueprint $table){
          $table->integer('id');
          $table->string('name');
          $table->text('sequence');
        });
      }
      else{
        \DB::table($tableName)->truncate();
      }

      $already_exists = False;
      update_status($process->id, 0.05, 'Creating digest table.');
      if(!Schema::hasTable($tableNameDigest))
      {
        //create a base peptide digest table
        Schema::create($tableNameDigest, function(Blueprint $table){
            $table->increments('id');
            $table->string('parent')->nullable();
            $table->string('sequence')->nullable();
            $table->integer('start');
            $table->integer('end');
            $table->decimal('mz1_average')->index('mz1_average');;
            $table->decimal('mz1_monoisotopic')->index('mz1_monoisotopic');;
            $table->integer('missed_cleavages')->index('missed_cleavages');
            $table->integer('met_ox_count')->nullable();
        });
      }
      else
      {
        //Clear aka truncate the table
        $already_exists = True; //Redundant assignment
        \DB::table($tableNameDigest)->truncate();
        
        //Delete the table
        //Schema::dropIfExists($tableNameDigest);
      }

      //Create the entry in the digests table
      $digest;
      if(!$already_exists)
      {
        $digest = Digest::create([
          'user_id' => $this->user_id,
          'proteome_id' => $proteome->id,
          'parent_table_name' => $tableName,
          'table_name' => $tableNameDigest,
          'enzyme' => $enzyme,
          'max_mc' => $max_mc,
          'status' => 'processing',
          'process_id' => $process->id,
        ]);
      }
      else
      {
        $digest = Digest::where('table_name', $tableNameDigest)->first();
        $digest->process_id = $process->id;
        $digest->status = 'processing';
        $digest->save();
      }

      update_status($process->id, 0.1, 'Digesting the proteome. This may take a while.');
      //Run the digest script (PYTHON):
      $file_fasta = 'storage/app/' . $proteome->path;
      $file_parents = 'storage/app/' . $this->user_id . '/proteomes/' . $tableName . '.json';
      $file_digest  = 'storage/app/' . $this->user_id . '/proteomes/' . $tableNameDigest . '.json';

      $command = implode(' ', [
        'python',
        'python/digest_proteome.py',
        $file_fasta,
        $file_digest,
        $file_parents,
        $enzyme
      ]);

      //Queues execute commands from the root directory C:/maldb/
      shell_exec($command);

      //UX Status update
      update_status($process->id, 0.16, 'Loading proteomes into memory.');

      //PARENTS/////////////////////////////////////////
      $resource_parents = fopen($file_parents, 'r');
      while (($line = fgets($resource_parents)) !== false) {

        //Parse the line into PHP objects
        $parents = json_decode($line, true);

        //Create an empty batch
        $batch = [];

        //Loop through the parents in this line
        for($i = 0; $i < count($parents); $i++)
        {
          
          $p = [
            'id'        => $parents[$i]['seq_id'],
            'name'      => $parents[$i]['name'],
            'sequence'  => $parents[$i]['seq'],
          ];

          array_push($batch, $p);

          //Make a DB query every 1000 sequences
          if($i % 1000 == 0 || $i == count($parents) - 1)
          {
            \DB::table($tableName)->insert($batch);
          }
        }
      }

      //PEPTIDES/////////////////////////////////////////
      $resource_peptides = fopen($file_digest, 'r');
      while (($line = fgets($resource_peptides)) !== false) {

        //Load the line into memory (5000 peptides)
        $peptides = json_decode($line, true);

        //Create an empty batch
        $batch = [];

        for($i = 0; $i < count($peptides); $i++)
        {
          $p = [
            'parent'            => $peptides[$i]['seq_id'],
            'sequence'          => $peptides[$i]['seq'],
            'start'             => $peptides[$i]['start'],
            'end'               => $peptides[$i]['end'],
            'mz1_monoisotopic'  => $peptides[$i]['mz1'],
            'mz1_average'       => $peptides[$i]['avg'],
            'missed_cleavages'  => $peptides[$i]['mc'],
            'met_ox_count'      => $peptides[$i]['mso']
          ];

          array_push($batch, $p);
          
        }

        //Run the batch insert query
        \DB::table($tableNameDigest)->insert($batch);

      }
      
      

      //Set the process to complete.
      complete_process($process->id);
      $digest->status = 'ready';
      $digest->size = \DB::table($tableNameDigest)->select(\DB::raw('count(*) as peptides'))->first()->peptides;
      $digest->save();
    }
}
