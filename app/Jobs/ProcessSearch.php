<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

use App\Models\Process;
use App\Models\Status;
use App\Models\UserSetting;
use App\Models\Digest;
use App\Models\Search;

class ProcessSearch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    //Metadata variable is a standard object holding all the search parameters and data.
    protected $metadata;

    //No search job should run for longer than 10min. If it does, I haven't done my job optimizing well enough.
    public $timeout = 3600; 

    //Constructor decodes the metadata file, and creates a stdObject.
    public function __construct($metadata_file)
    {
        $this->metadata = json_decode(Storage::get($metadata_file));
    }

    //The method that runs when the job is initiated.
    public function handle()
    {
        //Get the settings
        $settings = $this->metadata;

        //Create a new process
        $process = Process::find($settings->process_id);
        
        //Creates an array with the table names the user wants to search
        $tables = get_tables($settings->tables);

        //Construct the mass list array
        $masses = $settings->data->mass_list;

        //Get missed cleavages
        $missed_cleavages = $settings->mc;

        //Construct the fixed mass modifications string
        $fixed_mods_string = fixed_mods_string(get_mods($settings->modifications->fixed));

        //Get the tolerance setting
        //$tolerance = UserSetting::where('user_id', $settings->user_id)->where('name', 'mass_tolerance')->first()->value; //This will return a string, you need to cast it.
        $tolerance = 1.2;

        update_status($process->id, 0.2, 'Expanding base tables.');
        //Create the set of expanded tables
        $table_sets = [];
        foreach($tables as $t)
        {
            //Name the tables
            $temp_table_name = 'TEMP_' . $t . time();
            
            //Store the table beside its cognate base table
            array_push($table_sets, [
                'base' => $t,
                'temp' => $temp_table_name
            ]);

            //Run the expansion query
            \DB::select(expand_table_query($temp_table_name, $t, $fixed_mods_string));
        }
        
        //Name the search rowset 
        $rowset_name = 'tmp_search_' . time();

        //Create the rowset
        construct_search_rowset($rowset_name, $masses);

        //Create a new collection to continually append to
        $merged = new Collection();

        update_status($process->id, 0.5, 'Searching expanded tables.');
        //Perform the search
        foreach($table_sets as $t)
        {
            $matches = \DB::select(base_query($t['base'], $t['temp'], $rowset_name, $tolerance));

            $merged = $merged->merge(collect($matches));
        }
        
        //Group peptides by the table they're from, then the parent they belong to.
        //Somehow sort the nested array, and then limit it to top 5
        
        Log::debug($merged->take(10));

        update_status($process->id, 0.75, 'Scoring matches.');
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
                        ->each(function ($item) {
                            return $item->put("parent_name", \DB::table(Digest::where('table_name', $item[0]->source)->first()->parent_table_name)->find($item[0]->parent)->name);
                        })
                        //Calculate the score for each hit
                        ->each(function($item) use(&$tolerance){
                            return $item->put("score", calculate_maldb_score($tolerance, 3600-650, $item['theos'], $item['matches']));
                        })
                        ->sortByDesc('score')
                        ->values();
                        //Determine significance
                        
        $final = [
            'results' => $results,
        ];

        update_status($process->id, 0.8, 'Cleaning Up.');
        //Clean up all of the temporary tables
        foreach($table_sets as $t)
        {
            Schema::dropIfExists($t['temp']);
        }

        update_status($process->id, 0.9, 'Writing results to file.');

        //Mark the job as completed
        update_status($process->id, 1, 'Complete');

        //Set a path for the results file
        Log::debug("Looking for a job with name $settings->job_string ...");

        $results_file = \DB::table('searches')->where('name', $settings->job_string)->first()->results_file;

        //Write to file
        Storage::put($results_file, json_encode($final));

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

function expand_table_query(string $table_name, string $target_table_name, string $fixed_mods_string)
{
    return(
       "CREATE TABLE $table_name
        WITH RECURSIVE 
        expanded(id, parent, sequence, mz1_monoisotopic, missed_cleavages, MSO) AS
        (
        SELECT 
                id,
                parent,
                sequence, 
                (mz1_monoisotopic $fixed_mods_string) as mz1_monoisotopic,  
                missed_cleavages,
                0 AS MSO
        FROM 
                $target_table_name 
        WHERE
                mz1_monoisotopic < 3600 AND mz1_monoisotopic > 650
        UNION ALL
        SELECT 
                id,
                parent,
                sequence,
                `mz1_monoisotopic` + 15.999 AS `mz1_monoisotopic`,
                missed_cleavages,
                MSO + 1
        FROM 
                expanded 
        WHERE 
                MSO < (CHAR_LENGTH(sequence) - CHAR_LENGTH(REPLACE( sequence, 'M', '')))
        )
        SELECT * FROM expanded
        "
        
    );
}

function construct_search_rowset($rowset_name, $mass_list)
{
    $table_query = 
    "DROP TABLE IF EXISTS $rowset_name;
    CREATE TABLE $rowset_name (
      mz1_monoisotopic DECIMAL(10,2)
    );
    ";
    
    \DB::unprepared($table_query);

    $fill_query = "";

    foreach($mass_list as $m)
    {
        $fill_query .= "INSERT INTO $rowset_name VALUES ($m);";
    }

    \DB::unprepared($fill_query);
    
}

function base_query(string $base_table_name, string $expanded_table_name, string $search_rowset_name, float $tolerance)
{
    return(
       "SELECT id, parent, sequence, mz1_monoisotopic, missed_cleavages, source, err FROM (
            SELECT 
              d.id,
              d.parent,
              d.sequence,
              d.missed_cleavages,
              d.mz1_monoisotopic,
              '$base_table_name' source,
              ABS(d.mz1_monoisotopic - s.mz1_monoisotopic) err,
              ROW_NUMBER() over (
                PARTITION BY s.mz1_monoisotopic, d.parent
                ORDER BY ABS(d.mz1_monoisotopic - s.mz1_monoisotopic), id
              ) rn
            FROM
              $expanded_table_name d
              INNER JOIN $search_rowset_name s ON
                d.mz1_monoisotopic BETWEEN s.mz1_monoisotopic - $tolerance AND s.mz1_monoisotopic + $tolerance
          ) result WHERE rn = 1;
        "
    );
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

function parse_spectral_input(string $input_data)
{

}

function get_mods(array $mods)
{
    $m = [];

    foreach(\DB::table('modifications')->whereIn('name', $mods)->get() as $mod)
    {
        array_push($m, [
            'mass' => $mod->mass,
            'resi' => $mod->target
        ]);
    }

    return $m;
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