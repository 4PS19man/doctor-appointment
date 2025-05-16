const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  target: 'node', // Ensure Node.js build
  mode: 'production', // Optional: can be overridden via CLI
  entry: './src/main.ts', // Entry point of your app
  output: {
    path: join(__dirname, 'dist'), // Output folder
    filename: 'main.js',           // ✅ Output file will be dist/main.js
  },
  resolve: {
    extensions: ['.ts', '.js'], // So Webpack resolves TS and JS files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    })
  ]
};
