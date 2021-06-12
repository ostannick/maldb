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

  return DB::table('1_TestProteome_trypsin_dig')->select(DB::raw('count(*) as peptides'))->first()->peptides;
});

Route::get('/', function () {
    return view('home');
});

Route::get('/maldb', function() {
    return view('spa');
});

Route::get('/settings', function() {

  $settings = [1,2,3,4,5,6];

  return $settings;
});

Route::get('/queue', function () {

    $jobs = \DB::table('jobs')->get();
    
    foreach($jobs as $j)
    {
      $j->payload = json_decode($j->payload);
    }
    
    $failed_jobs = \DB::table('failed_jobs')->orderBy('failed_at', 'desc')->limit(10)->get();

    foreach($failed_jobs as $j)
    {
      $j->payload = json_decode($j->payload);
      $j->exception = preg_split("/\\r\\n|\\r|\\n/", $j->exception);
    }

    $data = [
      'jobs' => $jobs,
      'failed_jobs' => $failed_jobs,
    ];

    return $data;
});
Route::post('/jobs/delete', function(Request $request){

  DB::table('jobs')->where('id', $request->input('id'))->delete();

  return 'Job canceled.';

});
Route::post('/jobs/failed/delete', function(Request $request){

  DB::table('failed_jobs')->truncate();

  return 'Failed jobs table cleared';

});

Route::get('/learn', function () {

  return view('learn');
});

Route::get('/proteomes/list', function(){
  return json_encode(Proteome::where('user_id', Auth::user()->id)->get());
});

Route::post('/analysis', function(Request $request) {
  $match = $request->input('protein');

  $peptides = DB::select(DB::raw('select * FROM `ecolik12_2_1` WHERE `parent` = ' . '\'' . $match . '\' AND `missed_cleavages` = 0'));

  return json_encode($peptides);
});

Route::resource('/proteomes', ProteomeController::class);

Route::resource('/digest', DigestController::class);

Route::resource('/search', SearchController::class);

Route::resource('/modifications', ModificationController::class);

Route::resource('/usersettings', UserSettingsController::class);
Route::post('/usersettings/reset', 'UserSettingsController@factory_reset');

Route::post('/proteomes/digest', 'DigestController@digest');  //Digests a proteome
Route::post('/proteomes/delete', 'ProteomeController@delete');

Route::post('/digest/list', 'DigestController@list');         //Gets a list of a proteome's digest tables
Route::post('/digest/poll', 'DigestController@poll');
Route::post('/digest/sort', 'DigestController@sort');

Route::post('/analysis/results', 'AnalysisController@results');             //Send a metadata object
Route::post('/analysis/results/name', 'AnalysisController@results_by_name'); //Just send the job name
Route::post('/analysis/seqview', 'AnalysisController@get_seqview');
Route::post('/analysis/table', 'AnalysisController@get_table');
Route::post('/analysis/appendnn', 'AnalysisController@append_to_nntrain');
Route::post('/analysis/fingerprint', 'AnalysisController@get_fingerprints');
Route::post('/analysis/drawspectra', 'AnalysisController@draw_spectra');
Route::post('/analysis/rdm_fingerprint', 'AnalysisController@get_random_fingerprint');
Route::post('/analysis/rdm_spectra', 'AnalysisController@get_random_spectra');

Route::post('/history/searches', 'AnalysisController@get_history');


Route::post('/modifications/list', 'ModificationController@list');

Route::post('/process/status', 'ProcessController@status');



Route::get('login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::get('logout', [App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');

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
