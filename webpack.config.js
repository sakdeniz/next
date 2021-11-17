var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var browserTargets = [
  '> 1%',
  'iOS >= 8.0',
  'Android >= 4.4',
  'Chrome >= 30',
  'Safari >= 9',
  'Firefox ESR',
  'Opera 12.1'
];

module.exports = {
  watch: process.env.WEBPACK_WATCH === 'true',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
          test: /\.vue$/,
          loader: 'vue-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      }      
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyPlugin({
            patterns: [
                {
                    from: "static/",
                    to: "static/"
                }
            ],
        }),
  ],
  "node": {
    "fs": "empty",
    "process": "mock"
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      //// For development:
      // 'vue-onsenui/esm': path.join(__dirname, '..', 'OnsenUI', 'bindings', 'vue', 'esm'),
      // 'vue-onsenui$': path.join(__dirname, '..', 'OnsenUI', 'bindings', 'vue', 'dist', 'vue-onsenui'),
      // 'onsenui$': path.join(__dirname, '..', 'OnsenUI', 'build', 'js', 'onsenui'),
      // 'onsenui': path.join(__dirname, '..', 'OnsenUI', 'build'),
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
new UglifyJsPlugin({
            "uglifyOptions":
                {
                    compress: {
                        warnings: false
                    },
                    sourceMap: true
                }
        }
    ),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
