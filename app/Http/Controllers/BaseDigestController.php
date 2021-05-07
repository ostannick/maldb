<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BaseDigestController extends Controller
{
    public function digest(Request $request)
    {
      //Find and load fasta file into memory from request proteome id

      //Digest it using Dave's script

      //Add an entry to 'processes' table to indicate its being digested

      //Create the digest table

      //Loop thru digest file and add a StatusUpdate every 500 peptides

      //Once finished, set the
      return 'Digested!';
    }
}
