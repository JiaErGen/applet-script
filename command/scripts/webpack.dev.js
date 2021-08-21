const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common');
const scriptConfig = require('../../scriptConfig');

common().then((webpackConfig) => {
  const config = merge(webpackConfig, {
    // cache 不稳定
    // cache: {
    //   type: 'filesystem',
    //   allowCollectingMemory: true,
    //   buildDependencies: {
    //     config: [__filename],
    //   },
    // },
    mode: 'development',
    plugins: [
      new ESLintPlugin({ // 配置eslint
        extensions: ['js', 'ts'],
        exclude: '/node_modules/',
        formatter: 'codeframe',
      }),
      new StylelintPlugin({
        files: '**/*.(s(c|a)ss|css|less)',
      }),
    ],
  }, scriptConfig.webpackConfig || {});

  webpack(config).watch({
    // aggregateTimeout: 300,
    ignored: '**/node_modules',
    poll: undefined,
  }, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stats.hasErrors() || stats.hasWarnings()) {
      console.log(stats.toString('errors-warnings'));
    }
  });
});
