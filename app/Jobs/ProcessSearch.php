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

class ProcessSearch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $metadata;
    public $timeout = 3600; 



    public function __construct($metadata_file)
    {
        $this->metadata = json_decode(Storage::get($metadata_file));
    }



    public function handle()
    {
        //Get the settings
        $settings = $this->metadata;

        //Create a new process
        $process = Process::find($settings->process_id);
        
        //Creates an array with the table names the user wants to search
        $tables = get_tables($settings->tables);

        //Construct the mass list array
        $masses = [1170.260461, 1228.382739, 1375.483557, 1653.520751, 1752.469679, 1765.517257, 1849.43973, 2105.47983, 2128.467221, 2178.484802, 2211.44009, 2222.209515, 2389.285925, 2424.412107, 2551.361535, 2668.518994, 2855.366387];
        //mass_list_to_array($mass_list);

        //Get missed cleavages
        $missed_cleavages = $settings->mc;

        //Construct the fixed mass modifications string
        $fixed_mods_string = fixed_mods_string(get_mods($settings->modifications->fixed));

        //Get the tolerance setting
        //$tolerance = UserSetting::where('user_id', $settings->user_id)->where('name', 'mass_tolerance')->first()->value; //This will return a string, you need to cast it.
        $tolerance = 1.2;

        //Create the set of expanded tables
        $temp_tables = [];
        foreach($tables as $t)
        {
            //Name the tables
            $temp_table_name = 'TEMP_' . $t . time();
            
            //Store the table
            array_push($temp_tables, $temp_table_name);

            //Run the expansion query
            \DB::select(expand_table_query($temp_table_name, $t, $fixed_mods_string));
        }

        //Create a new collection to continually append to
        $merged = new Collection();

        foreach($temp_tables as $t)
        {
            $matches = \DB::select(base_query($t, $tolerance));

            $merged = $merged->merge(collect($matches));
        }

        Log::debug('Logging the merged results...');
        Log::debug($merged);
        
        //Group peptides by the table they're from, then the parent they belong to.
        //Somehow sort the nested array, and then limit it to top 5
        
        $results = $merged
                        //Group them so that the results from separate tables are not merged, altering statistical scores
                        ->groupBy(['parent'])
                        //Flatten the collection (array) to remove the source (table) grouping, allowing easy access to the nested array for sorting.
                        //->flatten(1)
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
                            return $item->put("score", calculate_maldb_score($tolerance, 4000-650, $item['theos'], $item['matches']));
                        })
                        ->sortByDesc('score')
                        ->values();
                        //Determine significance
                        
        

        $response = [
            'code'          => 'results',
            'message'       => 'A toast to the people',
            'tables'        => $tables,
            #'mods'          => $mass_mods,
            'massList'      => $masses,
            'results'       => $results,
        ];

        Log::debug($response);

        foreach($temp_tables as $t)
        {
            Schema::dropIfExists($t);
        }



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
                mz1_monoisotopic < 3600 AND mz1_monoisotopic > 500
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

function construct_search_rowset($rowset_name)
{
    return(
        ""
    );
}

function base_query(string $expanded_table_name, string $search_rowset_name, float $tolerance)
{
    return(
       "SELECT id, parent, sequence, mz1_monoisotopic, err FROM (
            SELECT 
              d.id,
              d.parent,
              d.sequence,
              d.missed_cleavages,
              d.mz1_monoisotopic,
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