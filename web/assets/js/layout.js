'use strict';
const $ = require('jquery');
require('bootstrap');
require('../css/main.css');

//include this on every page to make sure Promise exists
require('babel-polyfill');

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

