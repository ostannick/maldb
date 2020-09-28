<?php

namespace App\Http\Controllers;

use App\Models\Proteome;
use Illuminate\Http\Request;
use Auth;

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
      /*
      $request->validate([
      'file' => 'required|mimes:txt,fa,fasta|max:2048'
      ]);
      */

      $proteome = new Proteome;

      if($request->file())
      {
        $fileName = time().'_'.$request->file->getClientOriginalName();
        $filePath = $request->file('file')->storeAs('proteomes/'.Auth::user()->id.'/', $fileName);

        $proteome->name = $request->input('name');
        $proteome->path = '/storage/' . $filePath;
        $proteome->description = $request->input('description');
        $proteome->organism = $request->input('organism');
        $proteome->user_id = Auth::user()->id;

        $proteome->save();

        return back()
        ->with('success', 'Proteome uploaded.')
        ->with('file', $fileName);
      }

      return back()->with('failure', 'Something went wrong.');
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
    public function destroy(Proteome $proteome)
    {
        //
    }
}
