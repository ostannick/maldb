<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class AnalysisController extends Controller
{
    public function get_table(Request $request)
    {
        $data = collect($request->input('data'));

        $parent = $data->first()['parent'];
        $table = $data->first()['source'];
        
        //This gets a plain array of ID values corresponding to the observed peptides as per the search results.
        $observed = $data->pluck('id')->filter(function ($value){ return $value != null;});


        $all_peptides = \DB::table($table)
                                ->where([
                                        ['parent', $parent],            //Find all peptides with this parent
                                        ['missed_cleavages', '<=', 9],  //Optional configuration to declutter search results
                                        ['met_ox_count', '<=', 9]       //Optiona configuration to declutter search results
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
}
