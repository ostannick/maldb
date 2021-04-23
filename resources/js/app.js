/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./components/Job');
require('./components/SearchForm');
require('./components/Chart');


require('./components/Example');



//Enable settings modal
$('.open-settings').on('mousedown', function () {
  $('#settings-modal').modal();
})

$('.search-help').on('click', function () {
  $('#help-modal').modal();
})

//Enable all tooltips app-wide
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
