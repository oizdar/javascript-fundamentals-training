const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        rep_log: './web/assets/js/rep_log.js',
        login: './web/assets/js/login.js',
        layout: './web/assets/js/layout.js'
    },
    output: {
        path: path.resolve(__dirname, 'web', 'build'),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
        }),
    ]
}
