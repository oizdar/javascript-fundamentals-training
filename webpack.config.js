const path = require('path');

module.exports = {
    entry: {
        rep_log: './web/assets/js/rep_log.js',
        login: './web/assets/js/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'web', 'build'),
        filename: "[name].js",
    }
}
