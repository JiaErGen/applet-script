const { fork } = require('child_process');
const path = require('path');
const chokidar = require('chokidar');

const processCwd = process.cwd();
const mockPath = path.join(processCwd, 'mock');

const startService = (() => {
  let child;
  return (message) => {
    if (child) {
      child.send('exit');
    }
    child = fork(path.join(__dirname, 'service.js'), {
      stdio: 'inherit',
    });
    if (message === 'listen') {
      child.send('listen');
    }
  };
})();

startService('listen');

chokidar.watch(mockPath).on('change', (event, path) => {
  startService();
  console.log('mock 数据修改成功');
});
