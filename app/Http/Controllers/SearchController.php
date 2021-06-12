<?php

namespace App\Http\Controllers;

use App\Models\Search;
use App\Models\Digest;
use Illuminate\Http\Request;
use App\Jobs\ProcessSearch;
use Auth;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Process;

use Illuminate\Support\Collection;

class SearchController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('search');
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
        $mass_list          = $request->input('massList');
        $missed_cleavages   = $request->input('missedCleavages');
        $mass_mods          = $request->input('massMods');
        $selected_tables    = $request->input('selectedTables');
        $match_limit        = $request->input('matchLimit');


        //Creates an array with the table names the user wants to search
        $tables = get_tables($selected_tables);

        //Construct the mass list array
        $masses = mass_list_to_array($mass_list);

        //Extract the parameters into variables
        $missed_cleavages   = $request->input('missedCleavages');
        $tolerance          = 1.2; //Set this to the user's account settings later
        $mass_list          = $request->input('massList');
        $enzyme             = $request->input('enzyme');
        $mass_mods          = $request->input('massMods');
        $selected_tables    = $request->input('selectedTables');

        //Create a job name
        $str = Str::random(16);
        $job_name = Auth::user()->id . '_search_' . $str;

        //Create a new process
        $process = new Process();
        $process->user_id = Auth::user()->id;
        $process->description = 'Running a generative search...';
        $process->save();

        //Create a metadata object so this job can be re-run
        $metadata = [
            'user_id'       =>  Auth::user()->id,
            'user_name'     =>  User::find(Auth::user()->id)->username,
            'job_string'    =>  $str,
            'job_name'      =>  $job_name,
            'process_id'    =>  $process->id,
            'type'          =>  'generative',
            'data'          =>  [
                'spectra'       => 0,
                'mass_list'     => $masses,
            ],
            'enzyme'        =>  $enzyme,
            'mc'            =>  $missed_cleavages,
            'tables'        =>  $selected_tables,
            'modifications' =>  [
                'fixed'             => [
                    ['Cys_CAM']
                ],
                'variable'          => [
                    ['Met_MSO']
                ],
            ],
        ];

        //Save the metadata files
        $metadata_path = Auth::user()->id . "/searches/$str/search.json";
        $results_path  = Auth::user()->id . "/searches/$str/results.json";
        Storage::put($metadata_path, json_encode($metadata));

        //Dispatch the job to the default queue with the path to the metadata file.
        ProcessSearch::dispatch($metadata_path);
        update_status($process->id, 0.00, 'Waiting for job to start.');

        //Log the job in the database
        Search::create([
            'user_id'       => Auth::user()->id,
            'name'          => $str,
            'process_id'    => $process->id,
            'metadata_file' => $metadata_path,
            'results_file'  => $results_path
        ]);

        return $metadata;

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function show(Search $search)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function edit(Search $search)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Search $search)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Search  $search
     * @return \Illuminate\Http\Response
     */
    public function destroy(Search $search)
    {
        //
    }

    
}

function get_tables(array $table_ids): array
{
    //Get an array of the table names.
    $tables = [];
    foreach($table_ids as $t)
    {
        array_push($tables, strtolower(Digest::find($t)['table_name']));
    }
    return $tables;
}


function mass_list_to_array(string $mass_list): array
{
    //Parse the mass list. This can be expanded on later if we want to include intensities or have more robust parsing.
    $mass_list = preg_split('/\s+/', $mass_list);

    //Loop through and cast. Currently they are strings, need them as floats.
    for($i = 0; $i < count($mass_list); $i++)
    {
        $mass_list[$i] = (float)$mass_list[$i];
    }

    //Return the array.
    return $mass_list;
}

class Mod
{
    public function __construct(
        public float $mass,
        public string $aa
    )
    {   
        //Property promotion takes care of everything apparently. Thanks PHP8!
    }
}
