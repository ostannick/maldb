<?php

namespace App\Http\Controllers;

use App\Models\Modification;
use Illuminate\Http\Request;

use Auth;

class ModificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('modifications');
    }

    public function list()
    {
        return Modification::where('user_id', Auth::user()->id)->get();
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Modification  $modification
     * @return \Illuminate\Http\Response
     */
    public function show(Modification $modification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Modification  $modification
     * @return \Illuminate\Http\Response
     */
    public function edit(Modification $modification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Modification  $modification
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Modification $modification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Modification  $modification
     * @return \Illuminate\Http\Response
     */
    public function destroy(Modification $modification)
    {
        //
    }
}
