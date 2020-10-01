<?php

namespace App\Http\Controllers;
use Storage;
use Auth;
//For running processes like python scripts
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
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
      return view('proteomes', [
        'proteomes' => $this->FetchProteomes(),

      ]);
    }

    public function FetchProteomes()
    {
      return Proteome::all();
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
      /*
      $request->validate([
      'file' => 'required|mimes:txt,fa,fasta|max:2048'
      ]);
      */

      //File names
      $fileNameFasta;
      $fileNameDigest;

      //User's storage path
      $storagePath = '../storage/app/proteomes/' . Auth::user()->id . '/';

      //Create a new proteome model for entry into the proteomes table
      $proteome = new Proteome;

      //If the file exists, store it, and set the proteome properties
      if($request->file())
      {
        $fileName = time().'_'.$request->file->getClientOriginalName();
        $filePath = $request->file('file')->storeAs('proteomes/'.Auth::user()->id, $fileName);

        $proteome->name = $request->input('name');
        $proteome->path = $filePath;
        $proteome->description = $request->input('description');
        $proteome->organism = $request->input('organism');
        $proteome->user_id = Auth::user()->id;

        $proteome->save();


      }
      else
      {
        return back()->with('failure', 'File not uploaded.');
      }

      //Name the table something unique for the user and the proteome
      $tableName = $request->name .'_'. $proteome->id .'_'. Auth::user()->name;

      //create a base peptide table
      Schema::create($tableName, function(Blueprint $table){
          $table->increments('id');
          $table->timestamps();
          $table->string('parent');
          $table->string('sequence');
          $table->decimal('mz1_average');
          $table->decimal('mz1_monoisotopic');
          $table->string('enzyme');

          $table->integer('C');
          $table->integer('D');
          $table->integer('E');
          $table->integer('F');
          $table->integer('G');
          $table->integer('H');
          $table->integer('I');
          $table->integer('K');
          $table->integer('L');
          $table->integer('M');
          $table->integer('N');
          $table->integer('P');
          $table->integer('Q');
          $table->integer('R');
          $table->integer('S');
          $table->integer('T');
          $table->integer('V');
          $table->integer('W');
          $table->integer('Y');

      });

      //Associate the proteome with its new table
      $proteome->table = $tableName;
      $proteome->save();


      $command = 'python '.
      '../python/malDB_peptide_generator.py '.
      '../storage/app/proteomes/' . Auth::user()->id .'/'. $fileName . ' ' .
      'trypsin ' .
      '../storage/app/proteomes/' . Auth::user()->id .'/'. $fileName . '_digest.json';


      $output = shell_exec($command);


      $stream = fopen('../storage/app/proteomes/' . Auth::user()->id .'/'. $fileName . '_digest.json', 'r');
      $listener = new \JsonStreamingParser\Listener\InMemoryListener();
      try {
        $parser = new \JsonStreamingParser\Parser($stream, $listener);
        $parser->parse();
        fclose($stream);
      } catch (Exception $e) {
        fclose($stream);
        throw $e;
      }

      $proteins = $listener->getJson();

      //dd($proteins);

      foreach ($proteins as $protein) {

        foreach($protein as $peptide)
        {
          $basePeptide = new BasePeptide();

          $basePeptide->parent            = $peptide['parent'];
          $basePeptide->sequence          = $peptide['sequence'];
          //$basePeptide->mz1_average       = $peptide['mz1_average'];
          $basePeptide->mz1_monoisotopic  = $peptide['mz1'];
          //$basePeptide->enzyme            = $peptide['enzyme'];

          //$basePeptide->C                 = $peptide['C'];


        }

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
        //
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
          return back()->with('success', 'Protein collection successfully deleted.');
        }
        else{
          return back()->with('failure', 'Something went wrong!');
        }

    }
}
