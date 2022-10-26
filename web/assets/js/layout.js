'use strict';
const $ = require('jquery');
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('../css/main.css');
require('font-awesome/css/font-awesome.css');

//include this on every page to make sure Promise exists
require('babel-polyfill');

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

