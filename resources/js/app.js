
window.bootstrap = require('./bootstrap');


require('./components/Job');
require('./components/Toast');
require('./components/Proteomes/ProteomeManager');

//Enable settings modal
$('.open-settings').on('mousedown', function () {
  $('#settings-modal').modal();
})

$('.mass-mods').on('click', function () {
  $('#mass-mods-modal').modal();
})

$('.search-help').on('click', function () {
  $('#help-modal').modal();
})

//Enable all tooltips app-wide
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
