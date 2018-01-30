var webpack = require('webpack');
var path = require('path');


var HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const ExtractCSS = new ExtractTextPlugin({
  filename: 'css.css',
  allChunks: true
});
const ExtractLESS = new ExtractTextPlugin({
  filename: 'less.css',
  allChunks: true
});

var entry = {};
entry['app'] = ['./src'];

if (process.env.NODE_ENV === 'development') {
  var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000';
  entry['app'].push(hotMiddlewareScript);
}

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          plugins: ['transform-decorators-legacy'],
          presets: [
            'es2015',
            'react',
            'stage-0'
          ]
        }
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'url-loader?limit=10000&name="[name]-[hash].[ext]"',
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader?limit=10000&name="[name]-[hash].[ext]"',
      },

      {
        test: /\.css$/,
        use: ExtractCSS.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractLESS.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader?modules=true&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]" // translates CSS into CommonJS
          }, {
            loader: "less-loader" // compiles Less to CSS
          }]
        })
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".less", ".scss"]
  },

  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    inline: true,
    open: true,
    port: 5000,
    proxy: {
      // mock server url
      "/": "http://localhost:8000/"
    }
  },

  plugins: [
    ExtractCSS,
    ExtractLESS,

    new HtmlWebpackPlugin({
      chunks: entry,
      template: "./src/index.html",
      inject: true,
      filename: "./index.html",
    }),

    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),

    // new MockjsWebpackPlugin({
    //   // mock data folder path
    //   path: path.join(__dirname, "./mock"),
    //   // mock server port, avoid collision with application port
    //   port: 3000
    // })

  ]
};
