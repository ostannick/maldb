<?php

namespace App\Http\Controllers;
use Storage;
use Auth;
//For running processes like python scripts
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Proteome;
use App\Models\BasePeptide;
use Illuminate\Http\Request;


class ProteomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      return view('proteomes');
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

      //File validation
      //...

      //File names
      $fileNameFasta;
      $fileNameDigest;

      //User's storage path
      $storagePath = '../storage/app/' . Auth::user()->id . '/proteomes/';

      //Create a new proteome model for entry into the proteomes table
      $proteome = new Proteome;

      //Check if the user already has a proteome with this name
      //...return error if so

      //If the file exists, store it, and set the proteome properties
      if($request->hasFile('file'))
      {
        $fileName = time().'_'.$request->file->getClientOriginalName();
        $fileNameNoExt = explode('.', $fileName)[0];
        $filePath = $request->file('file')->storeAs(Auth::user()->id.'/proteomes', $fileName);

        $proteome->name = $request->input('name');
        $proteome->path = $filePath;
        $proteome->description = $request->input('description');
        $proteome->organism = $request->input('organism');
        $proteome->user_id = Auth::user()->id;

        $proteome->save();
      }
      else
      {
        return 'The file did not make it onto the server.';
      }

      return 'Proteome uploaded!';

      //Name the table something unique for the user and the proteome
      $tableName = Auth::user()->id . '_' . $proteome->id . '_' . 'trypsin' . '_' . 'collection';

      //create a proteome table
      Schema::create($tableName, function(Blueprint $table){
        $table->increments('id');
        $table->string('name');
        $table->text('sequence');
      });

      //create a base peptide digest table
      Schema::create($tableName . '_dig', function(Blueprint $table){
          $table->increments('id');
          $table->string('parent')->nullable();
          $table->string('sequence')->nullable();
          $table->decimal('mz1_average')->nullable();
          $table->decimal('mz1_monoisotopic')->nullable();
          $table->integer('missed_cleavages')->nullable();
          $table->integer('met_ox_count')->nullable();
      });

      //Associate the proteome with its new table
      $proteome->table = $tableName;
      $proteome->save();


      $command = 'py '.                                                                             //python executable
      '../python/fasta_to_json.py '.                                                                //script name
      '../storage/app/proteomes/' . Auth::user()->id .'/'. $fileName . ' ' .                        //path to fasta
      '../storage/app/proteomes/' . Auth::user()->id .'/'. $fileNameNoExt . '_digest.json' . ' ' .  //path to digest output
      '../storage/app/proteomes/' . Auth::user()->id .'/'. $fileNameNoExt . '_ids.json'. ' ' .      //path to relational database
      'trypsin ';                                                                                   //enzyme to cleave with

      shell_exec($command);


      //Open filestreams
      $stream = fopen('../storage/app/proteomes/' . Auth::user()->id .'/'. $fileNameNoExt . '_digest.json', 'r');
      $stream2 = fopen('../storage/app/proteomes/' . Auth::user()->id .'/'. $fileNameNoExt . '_ids.json', 'r');
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
          $parents[$pep['seq_id']]['name'],
          $pep['seq'],
          $pep['mz1'],
          $pep['avg'],
          $pep['mc'],
        ]);

      }

      return back()
      ->with('success', 'Proteome uploaded.')
      ->with('file', $fileName);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Proteome  $proteome
     * @return \Illuminate\Http\Response
     */
    public function show(Proteome $proteome)
    {

    }

    public function list()
    {
      return json_encode(Proteome::where('user_id', Auth::user()->id)->get());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Proteome  $proteome
     * @return \Illuminate\Http\Response
     */
    public function edit(Proteome $proteome)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Proteome  $proteome
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Proteome $proteome)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Proteome  $proteome
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        //Delete the model object in the database
        $proteome = Proteome::findOrFail($id);

        if($proteome && $proteome->user_id == Auth::user()->id)
        {
          //Delete the file
          Storage::delete($proteome->path);
          //Delete the database entry
          $proteome->delete();
          //Delete the table
          Schema::dropIfExists($proteome->table);

          return back()->with('success', 'Protein collection successfully deleted.');
        }
        else{
          return back()->with('failure', 'Something went wrong!');
        }

    }
}
