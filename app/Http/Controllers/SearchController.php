<?php

namespace App\Http\Controllers;

use App\Models\Search;
use App\Models\Digest;
use Illuminate\Http\Request;

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
        //Search logic goes here... dispatch a search job.

        $missed_cleavages   = $request->input('missedCleavages');
        $tolerance          = $request->input('tolerance');
        $mass_list          = $request->input('massList');
        $mass_mods          = $request->input('massMods');
        $selected_tables    = $request->input('selectedTables');
        $match_limit        = $request->input('matchLimit');


        //Creates an array with the table names the user wants to search
        $tables = get_tables($selected_tables);

        //Construct the mass list array
        $masses = mass_list_to_array($mass_list);

        //Construct the fixed mass modifications string
        $fixed_mods_string = fixed_mods_string($mass_mods);

        //Create a new collection to continually append to
        $merged = new Collection();

        foreach($masses as $mass)
        {
            //Create the query strings for each table
            $queries = [];
            foreach($tables as $t)
            {
                array_push($queries, base_query_string($t, $missed_cleavages, $mass, $tolerance, $fixed_mods_string));
            }
            $query = query_unioner($queries);

            //Execute the query
            $matches = \DB::select($query);

            //Merge with collection
            $merged = $merged->merge(collect($matches));
        }
        
        //Group peptides by the table they're from, then the parent they belong to.
        //Somehow sort the nested array, and then limit it to top 5
        
        $results = $merged
                        //Group them so that the results from separate tables are not merged, altering statistical scores
                        ->groupBy(['source', 'parent'])
                        //Flatten the collection (array) to remove the source (table) grouping, allowing easy access to the nested array for sorting.
                        ->flatten(1)
                        //Count the number of children eat hit (parent) has, and order descending so top hits are at the top of list
                        ->sortByDesc(function($item){
                            return count($item);
                        })
                        //This is necessary to call for some reason after using sortByDesc. Maybe something with immutability
                        ->values()
                        //Take the top 20 hits. This is likely unnecessary, only need 5-10
                        ->take(10)
                        //Make an entry for match count.
                        ->each(function($item){
                            return $item->put("matches", count($item));
                        })
                        //Make an entry for theoretical peaks in this spectra count based on the user's defined search space.
                        ->each(function($item) use(&$missed_cleavages){

                            $theos = \DB::table($item[0]->source)->where([
                                ['parent', '=', $item[0]->parent],
                                ['missed_cleavages', '=', 0],
                            ])->get()->count();

                            return $item->put("theos", $theos);
                        })
                        //Into each hit, grab the name of the parent instead of just the ID.
                        ->each(function($item){
                            return $item->put("parent_name", \DB::table(Digest::where('table_name', $item[0]->source)->first()->parent_table_name)->find($item[0]->parent)->name);
                        })
                        //Calculate the score for each hit
                        ->each(function($item) use(&$tolerance){
                            return $item->put("score", calculate_maldb_score($tolerance, 4000-650, $item['theos'], $item['matches']));
                        })
                        ->sortByDesc('score')
                        ->values();
                        //Determine significance
                        
        

        $response = [
            'code'          => 'results',
            'message'       => 'A toast to the people',
            'tables'        => $tables,
            'mods'          => $mass_mods,
            'results'       => $results,
        ];

        return json_encode($response);
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

function base_query_string(string $table_name, int $missed_cleavages, float $mz1, float $tolerance, string $fixed_mods_string)
{
    return("SELECT `id`, `parent`, `met_ox_count`, '$table_name' AS `source` FROM `$table_name` WHERE `missed_cleavages` <= $missed_cleavages AND ABS(`mz1_monoisotopic` $fixed_mods_string - $mz1) < $tolerance");
}

function fixed_mods_string(array $modifications)
{

    $s = '';
    
    foreach($modifications as $m)
    {
        //Create a mod object. Probably not necessary but I wanna try using PHP objects.
        $mod = new Mod($m['mass'], $m['resi']);

        //Append/concatenate the string.
        //This string looks in the sequence column and calculates the number of a particular amino acid by subtracrting the preg_replaced string length with the original string length.
        $s .= " + ($mod->mass * (CHAR_LENGTH(`sequence`) - CHAR_LENGTH( REPLACE (`sequence`, '$mod->aa', ''))))";
    }

    //Return the string.
    return $s;
}

function query_unioner(array $queries): string
{
    return implode(' UNION ', $queries);
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
