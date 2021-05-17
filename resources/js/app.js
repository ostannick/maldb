window.bootstrap = require('./bootstrap');

require('./components/Job');
require('./components/Toast');
require('./components/Proteomes/ProteomeManager');

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})