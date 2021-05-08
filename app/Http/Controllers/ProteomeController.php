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
