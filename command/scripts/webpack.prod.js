const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');
const scriptConfig = require('../../scriptConfig');

common().then((webpackConfig) => {
  const config = merge(webpackConfig, {
    mode: 'production',
  }, scriptConfig.webpackConfig || {});

  const compiler = webpack(config);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stats.hasErrors() || stats.hasWarnings()) {
      console.log(stats.toString('errors-warnings'));
    }
    compiler.close((closeErr) => {
      closeErr && console.log(closeErr);
    });
  });
});
