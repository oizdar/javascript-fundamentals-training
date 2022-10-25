const RepLogApp = require('./Components/RepLogApp');
const $ = require('jquery');

$(document).ready(() => {
    let $wrapper = $('.js-rep-log-table');

    let repLogApp = new RepLogApp($wrapper)
})
