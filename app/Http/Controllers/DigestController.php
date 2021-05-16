<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

use App\Models\Proteome;
use App\Models\Digest;
use App\Models\Process;
use App\Models\Status;

use App\Jobs\ProcessDigest;

use Auth;

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
      //Dispatch the job to the default queue;
      ProcessDigest::dispatch($request->all(), Auth::user()->id);

      return 'Digest job was dispatched';
    }

    public function poll(Request $request)
    {
      $digest = Digest::where('id', $request->input('digest_id'))->first();
      $status = Process::where('id', $digest->process_id)->first()->status();
      $data = [
        'digest' => $digest,
        'status' => $status
      ];
      return json_encode($data);
    }

    public function sort(Request $request)
    {
      $enzyme = $request->input('enzyme');
      $mc = $request->input('mc');

      $tables = Digest::where([
          ['user_id', Auth::user()->id],
          ['enzyme', $enzyme],
          ['max_mc', '>=', $mc],
          ['status', 'ready']
        ])->get();

      return json_encode($tables);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $peptides = \DB::table(Digest::find($id)->table_name)->select('*')->limit(1000)->get();

        return view('digests/table')->with([
          'peptides' => $peptides
        ]);
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
