<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use App\Models\Proteome;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/test', function() {

  $myJob = App\Jobs\ProcessProteome::dispatch();

  return 'No error here.';
});

Route::get('/', function () {
    return view('home');
});

Route::get('/proteomes/list', function(){
  return json_encode(Proteome::where('user_id', Auth::user()->id)->get());
});

Route::post('/submit', function(Request $request) {

  //Set up the data from the axios call
  $enzyme             = $request->input('enzyme');
  $missedCleavages    = $request->input('missedCleavages');
  $tolerance          = $request->input('tolerance');
  $massList           = $request->input('massList');
  $massMods           = $request->input('massMods');
  $tables             = $request->input('tables');

  //Concatenate a string. Refactor this later.
  $fixed_mods_string = '';
  foreach($massMods as $mod)
  {
    if($mod['type'] == 'fixed')
    {
      $fixed_mods_string = $fixed_mods_string . ' + (`' . $mod['resi'] . '` * ' . $mod['mass'] . ')';
    }
  }

  //Parse the mass list and cast to floats
  $massList = preg_split('/\s+/', $massList);
  $num_masses = count($massList);
  for($i = 0; $i < $num_masses; $i++)
  {
    $massList[$i] = (float)$massList[$i];
  }

  //Query the appropriate table with the appropriate modifications
  $merged = new Collection();
  foreach($massList as $mass)
  {
    /*foreach table...*/

    $peptides = DB::select(DB::raw('select id, parent FROM `ecolik12_2_1` where `missed_cleavages` = 0 AND ABS(`mz1_monoisotopic`' . $fixed_mods_string . " - $mass) <= $tolerance"));

    //Continually merge the results
    $merged = $merged->merge(collect($peptides));
  }

  //DB::select returns an array, so we create a Collection object out of the array using the collect() helper method
  $results = $merged->groupBy('parent')->sortByDesc(function($item){
    return count($item);
  });

  //Get the theoretical results
  //$theoretical = DB::select(DB::raw('select * FROM `k12_142_1` WHERE `parent` = ' . '\'' . $match . '\''));

  $match_counts = [];
  foreach($results as $row)
  {
    array_push($match_counts, count($row));
  }
  $stdev = stats_standard_deviation($match_counts);
  $mean = collect($match_counts)->average();

  //Package up the info
  $json_results = [
    'peak_count' => $num_masses,
    'mean' => $mean,
    'stdev' => $stdev,
    'hits' => $results->take(10),
  ];

  //Drop the table (clean up)
  Schema::dropIfExists("DUMMY_TABLE");

  //Return the JSON object
  return json_encode($json_results);
});

Route::post('/analysis', function(Request $request) {
  $match = $request->input('protein');

  $peptides = DB::select(DB::raw('select * FROM `ecolik12_2_1` WHERE `parent` = ' . '\'' . $match . '\' AND `missed_cleavages` = 0'));

  return json_encode($peptides);
});

Route::get('/maldb', function(Request $request) {
  $proteomes = Proteome::all();

  return view('search')
    ->with('proteomes', $proteomes);
});

Route::resource('/proteomes', ProteomeController::class);

Route::resource('/digest', DigestController::class);

Route::post('/proteomes/digest', 'DigestController@digest'); //Digests a proteome
Route::post('/digest/list', 'DigestController@list');         //Gets a list of a proteome's digest tables

Route::get('login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

Route::get('register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);

Route::get('password/reset', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('password/email', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('password/reset/{token}', [App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('password/reset', [App\Http\Controllers\Auth\ResetPasswordController::class, 'reset'])->name('password.update');

Route::get('password/confirm', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'showConfirmForm'])->name('password.confirm');
Route::post('password/confirm', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'confirm']);

Route::get('email/verify', [App\Http\Controllers\Auth\VerificationController::class, 'show'])->name('verification.notice');
Route::get('email/verify/{id}/{hash}', [App\Http\Controllers\Auth\VerificationController::class, 'verify'])->name('verification.verify');
Route::post('email/resend', [App\Http\Controllers\Auth\VerificationController::class, 'resend'])->name('verification.resend');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

Route::get('register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);

Route::get('password/reset', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('password/email', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('password/reset/{token}', [App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('password/reset', [App\Http\Controllers\Auth\ResetPasswordController::class, 'reset'])->name('password.update');

Route::get('password/confirm', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'showConfirmForm'])->name('password.confirm');
Route::post('password/confirm', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'confirm']);

Route::get('email/verify', [App\Http\Controllers\Auth\VerificationController::class, 'show'])->name('verification.notice');
Route::get('email/verify/{id}/{hash}', [App\Http\Controllers\Auth\VerificationController::class, 'verify'])->name('verification.verify');
Route::post('email/resend', [App\Http\Controllers\Auth\VerificationController::class, 'resend'])->name('verification.resend');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::post('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

Route::get('register', [App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('register', [App\Http\Controllers\Auth\RegisterController::class, 'register']);

Route::get('password/reset', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('password/email', [App\Http\Controllers\Auth\ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('password/reset/{token}', [App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('password/reset', [App\Http\Controllers\Auth\ResetPasswordController::class, 'reset'])->name('password.update');

Route::get('password/confirm', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'showConfirmForm'])->name('password.confirm');
Route::post('password/confirm', [App\Http\Controllers\Auth\ConfirmPasswordController::class, 'confirm']);

Route::get('email/verify', [App\Http\Controllers\Auth\VerificationController::class, 'show'])->name('verification.notice');
Route::get('email/verify/{id}/{hash}', [App\Http\Controllers\Auth\VerificationController::class, 'verify'])->name('verification.verify');
Route::post('email/resend', [App\Http\Controllers\Auth\VerificationController::class, 'resend'])->name('verification.resend');

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
