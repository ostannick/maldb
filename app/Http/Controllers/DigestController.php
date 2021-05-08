<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

use Auth;

use App\Models\Proteome;
use App\Models\Digest;

class DigestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function list(Request $request)
    {
      return Proteome::find($request->proteome_id)->digests();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      //Get the proteome of interest.
      $proteome = Proteome::find($request->input('proteome_id'));
      $enzyme = $request->input('opt_enzyme');
      $max_mc = $request->input('opt_mc');

      //Name the table something unique for the user and the proteome
      $tableName        = Auth::user()->id . '_' . $proteome->name;
      $tableNameDigest  = Auth::user()->id . '_' . $proteome->name . '_' . $enzyme . '_' . 'dig';

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


      return 'Made the table';

      $command = 'py '.                                                                             //python executable
      '../python/fasta_to_json.py '.                                                                //script name
      '../storage/app/' . $proteome->path . ' ' .                                                   //path to fasta
      '../storage/app/' . $proteome->path .'/digests/'. $fileNameNoExt . '_digest.json' . ' ' .     //path to digest output
      '../storage/app/' . $proteome->path .'/digests/'. $fileNameNoExt . '_ids.json'. ' ' .         //path to relational database
      'trypsin ';                                                                                   //enzyme to cleave with

      shell_exec($command);

      //Open filestreams
      $stream = fopen('../storage/app/proteomes/' . Auth::user()->id .'/'. $fileNameNoExt . '_digest.json', 'r');
      $stream2 = fopen('../storage/app/' . $proteome->path .'/digests/'. $fileNameNoExt . '_ids.json', 'r');
      $listener = new \JsonStreamingParser\Listener\InMemoryListener();
      try {
        $parser = new \JsonStreamingParser\Parser($stream, $listener);
        $parser->parse();
        fclose($stream);
      } catch (Exception $e) {
        fclose($stream);
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

      //Place in memory
      $peptides = $listener->getJson();
      $parents = $listener2->getJson();

      //Insert into the table
      foreach ($peptides as $pep) {

        DB::insert('insert into ' . $tableName . '(parent, sequence, mz1_monoisotopic, mz1_average, missed_cleavages, met_ox_count) values (?, ?, ?, ?, ?, ?)',
        [
          $pep['seq_id'],
          $pep['seq'],
          $pep['mz1'],
          $pep['avg'],
          $pep['mc'],
        ]);

        //Add a status update every 500 peptides

      }

      return 'Success!';
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
