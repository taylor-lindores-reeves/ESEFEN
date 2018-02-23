const path = require('path');
const webpack = require('webpack');

const javascript = {
    test: /\.(js)$/,
    use: [{
        loader: 'babel-loader',
        options: { 
            presets: ['env'],
            ignore: '/node_modules/'
        }
    }],
};

let config = {
    entry: path.resolve(__dirname, './public/js/app.js'),
    output: {
        path: path.resolve(__dirname, 'temp', 'scripts'),
        filename: '[name].bundle.js'
    },
    mode: 'production',
    module: {
        rules: [javascript]
    }
};

process.noDeprecation = true;

module.exports = config;