const path = require('path')

const ENV = process.env.NODE_ENV
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: './server/src/server.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@server': path.resolve(__dirname, 'server/src'),
    },
  },
  output: {
    path:
      ENV === 'production' ? '/app/server/dist' : path.resolve('server/dist'),
    filename: 'server.js',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  externals: [nodeExternals()],
}
