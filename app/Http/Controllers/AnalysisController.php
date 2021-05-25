<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Ionizer;
use App\Models\Digest;

use Auth;

class AnalysisController extends Controller
{

    public function get_seqview(Request $request)
    {
        //Put the request data into a collection
        $data = collect($request->input('data'));

        //Get a dummy peptide we can check properties of
        $dummy = $data->first();

        $parent = $dummy['parent'];     //Parent
        $table = $dummy['source'];      //Digest table name
        $parent_table = Digest::where('table_name', $table)->first()->parent_table_name;

        $sequence = \DB::table($parent_table)->where('id', $parent)->first()->sequence;

        //Get the peptides from the database
        $peptides = \DB::table($table)->whereIn('id', $data->pluck('id'))->get()->filter();

        //Initialize array of length sequence and fill with 'false' to indicate that amino acid was not observed.
        $coordinates = array_fill(0, strlen($sequence), false);

        //
        $peptides->each(function($item) use (&$coordinates){
            for($i = $item->start; $i <= $item->end; $i++)
            {
                $coordinates[$i] = true;
            }
        });

        $boundaries = [];
        $currentObs = $coordinates[0];
        $lastCheckpoint = 0;

        for($i = 0; $i < count($coordinates); $i++)
        {
            if($coordinates[$i] != $currentObs)
            {
                $arr = [
                    'bound' => [$lastCheckpoint, $i],
                    'obs'   => $currentObs
                ];

                array_push($boundaries, $arr);
                $currentObs = !$currentObs;
                $lastCheckpoint = $i;


                
            }
        }

        $seqview = [];
        foreach($boundaries as $b)
        {
            $arr = [
                'seq' => substr($sequence, $b['bound'][0], $b['bound'][1] - $b['bound'][0]),
                'obs' => $b['obs']
            ];
            array_push($seqview, $arr);
        }

        return $seqview;
    }

    public function get_table(Request $request)
    {
        $data = collect($request->input('data'));

        $parent = $data->first()['parent'];
        $table = $data->first()['source'];
        
        //This gets a plain array of ID values corresponding to the observed peptides as per the search results. Passing filter with no callback removes nulls by default.
        $observed = $data->pluck('id')->filter();


        $all_peptides = \DB::table($table)
                                ->where([
                                        ['parent', $parent],            //Find all peptides with this parent
                                        ['missed_cleavages', '<=', 1],  //Optional configuration to declutter search results
                                        ['met_ox_count', '<=', 9]       //Optional configuration to declutter search results
                                    ])
                                ->get()                  
                                ->map(function($item) use(&$observed)
                                {   
                                    $observed->contains($item->id) ? $item->observed = true : $item->observed = false;
                                    return $item;
                                })
                                ->sortBy(
                                    [
                                        ['observed', 'desc'],
                                        ['id', 'asc']
                                    ])
                                ->values();

        return $all_peptides;
    }

    public function append_to_nntrain(Request $request)
    {
        //Recollect the hit data
        $data = collect($request->input('data'));

        //Get the table name and parent ID off the first hit.
        $table      = $data->first()['source'];
        $parent_id  = $data->first()['parent'];
        $parent_name= $data['parent_name'];
        $observed   = $data->pluck('id')->filter();

        $mass_filter_lower = 650;
        $mass_filter_upper = 4000;

        //Get the MSO = 0, MC = 0 peptides. Let's start with these and modify as appropriate.
        \DB::table($table)
            ->where([

                ['parent', '=', $parent_id],
                ['missed_cleavages', '=', 0],
                ['met_ox_count', '=', 0]

            ])
            ->get()
            //Mark each peptide as observed or not
            ->map(function ($item) use (&$observed) {
                $observed->contains($item->id) ? $item->observed = true : $item->observed = false;
                return $item;
            })
            //Remove peptides we would not see anyways given our silly detector.
            ->filter(function ($item) use (&$mass_filter_lower, &$mass_filter_upper){
                return ($item->mz1_monoisotopic >= $mass_filter_lower && $item->mz1_monoisotopic <= $mass_filter_upper);
            })
            //I should include a function in here that filters out common contaminants like trypsin autolysis products
            //This will increase the quality of the training set.

            //Add to the database
            ->each(function ($item) use (&$parent_name){
                Ionizer::create([
                    'user_id' => Auth::user()->id,
                    'parent_name' => $parent_name,
                    'sequence' => $item->sequence,
                    'ionized' => $item->observed
                ])->save();
            });

        return 'success';
    }
}
