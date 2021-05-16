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

      //No need to remake the parent table for subsequent digests.
      if(!Schema::hasTable($tableName))
      {
        //create a proteome table
        Schema::create($tableName, function(Blueprint $table){
          $table->increments('id');
          $table->string('name');
          $table->text('sequence');
        });
      }
      else{
        \DB::table($tableName)->truncate();
      }

      $already_exists = False;
      if(!Schema::hasTable($tableNameDigest))
      {
        //create a base peptide digest table
        Schema::create($tableNameDigest, function(Blueprint $table){
            $table->increments('id');
            $table->string('parent')->nullable();
            $table->string('sequence')->nullable();
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
      }

      //Create the entry in the digests table
      $digest;
      if(!$already_exists)
      {
        $digest = Digest::create([
          'user_id' => $this->user_id,
          'proteome_id' => $proteome->id,
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

      //Run the digest script (PYTHON):
      $file_fasta = 'storage/app/' . $proteome->path;
      $file_parents = 'storage/app/' . $this->user_id . '/proteomes/' . $tableName . '.json';
      $file_digest  = 'storage/app/' . $this->user_id . '/proteomes/' . $tableNameDigest . '.json';

      $command = implode(' ', [
        'py',
        'python/digest_proteome.py',
        $file_fasta,
        $file_digest,
        $file_parents,
        $enzyme
      ]);

      //Queues execute commands from the root directory C:/maldb/
      shell_exec($command);

      //Load the json files into memory (array of associative arrays)
      $stream1 = fopen($file_parents, 'r');
      $stream2 = fopen($file_digest,  'r');

      $listener1 = new \JsonStreamingParser\Listener\InMemoryListener();
      try {
        $parser = new \JsonStreamingParser\Parser($stream1, $listener1);
        $parser->parse();
        fclose($stream1);
      } catch (Exception $e) {
        fclose($stream1);
        throw $e;
      }

      $listener2 = new \JsonStreamingParser\Listener\InMemoryListener();
      try {
        $parser2 = new \JsonStreamingParser\Parser($stream2, $listener2);
        $parser2->parse();
        fclose($stream2);
      } catch (Exception $e) {
        fclose($stream2);
        throw $e;
      }

      //Load them into variables
      $parents  = $listener1->getJson();
      $peptides = $listener2->getJson();

      for($i = 0; $i < count($parents); $i++)
      {
        \DB::insert('insert into ' . $tableName . '(name, sequence) values (?, ?)',
        [
          $parents[$i]['name'],
          'placeholderSequence',
        ]);

        if($i % 500 == 0)
        {
          $progress = $i/count($parents);
          $description = 'Processed ' . $i . ' of ' . count($parents) . ' parent sequences';
          update_status($process->id, $progress, $description);
        }
      }

      //Iterate through and log the progress
      for($i = 0; $i < count($peptides); $i++)
      {
        \DB::insert('insert into ' . $tableNameDigest . '(parent, sequence, mz1_monoisotopic, mz1_average, missed_cleavages, met_ox_count) values (?, ?, ?, ?, ?, ?)',
        [
          $peptides[$i]['seq_id'],
          $peptides[$i]['seq'],
          $peptides[$i]['mz1'],
          $peptides[$i]['avg'],
          $peptides[$i]['mc'],
          0
        ]);

        //Insert a status update into the database for the user every 500 peptides. This will be long-polled to fill a progress bar.
        if($i % 500 == 0)
        {
          $progress = $i/count($peptides);
          $description = 'Processed ' . $i . ' of ' . count($peptides) . ' peptides';
          update_status($process->id, $progress, $description);
        }
      }

      //Set the process to complete.
      complete_process($process->id);
      $digest->status = 'ready';
      $digest->size = \DB::table($tableNameDigest)->select(\DB::raw('count(*) as peptides'))->first()->peptides;
      $digest->save();
    }
}
