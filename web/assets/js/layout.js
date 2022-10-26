'use strict';
const $ = require('jquery');
require('bootstrap');

//include this on every page to make sure Promise exists
require('babel-polyfill');

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

