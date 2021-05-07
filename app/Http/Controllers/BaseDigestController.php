<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BaseDigestController extends Controller
{
    public function digest(Request $request)
    {
      return 'Digested!';
    }
}
