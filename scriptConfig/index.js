const path = require('path');
const processCwd = process.cwd();
const defaultScriptConfig = require('./default-script-config.js');

// 获取配置
const scriptConfig = (() => {
  let config;
  try {
    config = require(path.join(processCwd, 'script-config.js'));
  } catch (e) {
    config = {};
  }
  return { ...defaultScriptConfig, ...config };
})();

module.exports = scriptConfig;
