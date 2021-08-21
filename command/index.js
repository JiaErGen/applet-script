const { spawn } = require('cross-spawn');
const { fork } = require('child_process');
const path = require('path');
const scriptConfig = require('../scriptConfig');

module.exports = (bin) => {
  const bins = {
    dev() {
      process.env.NODE_ENV = 'development';
      if (scriptConfig.mockPort) {
        fork(path.join(__dirname, '../', 'mock-service/index.js'), {
          stdio: 'inherit',
        });
      }
      fork(path.join(__dirname, './scripts/webpack.dev.js'), {
        stdio: 'inherit',
      });
    },
    build() {
      process.env.NODE_ENV = 'production';
      fork(path.join(__dirname, './scripts/webpack.prod.js'), {
        stdio: 'inherit',
      });
    },
    'eslint-fix': () => {
      spawn('node', ['./node_modules/.bin/eslint', '--fix', './src'], {
        stdio: 'inherit',
      });
    },
    'stylelint-fix': () => {
      spawn('node', ['./node_modules/.bin/stylelint', '--fix', 'src/**/*.(less|sass|scss|css)'], {
        stdio: 'inherit',
      });
    },
  };
  if(bins[bin]) {
    bins[bin]?.();
  }
};
