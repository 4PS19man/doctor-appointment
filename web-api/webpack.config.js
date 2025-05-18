const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  target: 'node', 
  mode: 'production', 
  entry: './src/main.ts', 
  output: {
    path: join(__dirname, 'dist'), 
    filename: 'main.js',           
  },
  resolve: {
    extensions: ['.ts', '.js'], 
  },
  module: {
    rules: [] 
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc', 
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    })
  ]
};
