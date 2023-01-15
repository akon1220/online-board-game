const path = require('path')
const fs = require('fs')

const ENV = process.env.NODE_ENV

const plugins = []

if (ENV !== 'production') {
  const BitBarWebpackProgressPlugin = require('bitbar-webpack-progress-plugin')
  const bitBarWebpackProgressPlugin = new BitBarWebpackProgressPlugin()
  plugins.push(bitBarWebpackProgressPlugin)
}

const gameNames = fs.readdirSync(
  path.resolve(__dirname, 'client/socket_app/games')
)
const gameEntries = {}
for (const gameName of gameNames) {
  gameEntries[gameName] = path.resolve(
    __dirname,
    'client/socket_app/games',
    gameName,
    'index.tsx'
  )
}

module.exports = {
  mode: 'development',
  entry: {
    main: './client/index.tsx',
    ...gameEntries,
  },
  devtool: ENV === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'client/'),
      '@client': path.resolve(__dirname, 'client/'),
    },
  },
  output: {
    path: ENV === 'production' ? '/app/public' : path.resolve('public'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.css$/,
        include: [path.join(__dirname, 'client/'), /node_modules/],
        use: ['style-loader', 'css-loader', 'resolve-url-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        use: ['source-map-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.(gif|jpg|png)$/,
        loaders: 'url-loader',
      },
    ],
  },
  plugins,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'pixi.js': 'PIXI',
  },
}
