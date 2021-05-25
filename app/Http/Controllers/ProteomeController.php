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
      $fileNameFasta = '';
      $fileNameDigest = '';

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
        $proteome->organism = $request->input('organism');
        $proteome->user_id = Auth::user()->id;
        $proteome->table = Auth::user()->id . '_' . $request->input('name');

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
      return('awhaa');
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
      
      $fasta = file_get_contents('../storage/app/' . $proteome->path);

        return view('proteome/edit')->with([
          'proteome' => $proteome,
          'fasta' => $fasta,
        ]);
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
        file_put_contents('../storage/app/' . $proteome->path, $request->input('fasta'));

        return back()->with([
          'success' => 'Proteome FASTA file saved.',
          'warning' => 'You now need to re-digest this proteome to include your changes in your search!' 
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Proteome  $proteome
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->delete($request);
    }

    public function delete(Request $request)
    {
      //Get the proteome model
      $proteome = Proteome::findOrFail($request->input('proteome_id'));

      if ($proteome && $proteome->user_id == Auth::user()->id) {
        //Delete the fasta
        Storage::delete($proteome->path);

        //Delete the digests and digest tables.
        $digests = $proteome->digests();
        foreach ($digests as $d) {
          $d->delete_everything();
        }

        //Delete the table
        Schema::dropIfExists($proteome->table);

        //Delete the database entry
        $proteome->delete();

        return 'Proteome successfully deleted.';
      }
    }
}
