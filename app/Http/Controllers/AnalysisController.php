<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Ionizer;

use Auth;

class AnalysisController extends Controller
{
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
                                        ['missed_cleavages', '<=', 9],  //Optional configuration to declutter search results
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
        $observed   = $data->pluck('id')->filter();

        $mass_filter_lower = 650;
        $mass_filter_upper = 4000;

        //Get the MSO = 0, MC = 0 peptides. Let's start with these and modify as appropriate.
        $all_peptides_stringent = \DB::table($table)
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
                                        ->each(function ($item){
                                            Ionizer::create([
                                                'user_id' => Auth::user()->id,
                                                'parent_name' => 'placeHolder',
                                                'sequence' => $item->sequence,
                                                'ionized' => $item->observed
                                            ])->save();
                                        });

        return 'success';
    }
}
