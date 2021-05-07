
require('./bootstrap');


require('./components/Job');
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

$('.peptide').css('cursor', 'pointer');

//Enable all tooltips app-wide
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
