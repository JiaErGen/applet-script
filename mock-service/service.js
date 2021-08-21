const processCwd = process.cwd();
const express = require('express')
const path = require('path');
const scriptConfig = require('../scriptConfig');

const app = express();
const port = scriptConfig.mockPort || 7000;

try {
  const mockPath = path.join(processCwd, 'mock');
  require(mockPath)(app);
} catch (e) {
  console.log('mock文件有误，请检查');
}

app.listen(port);

process.on('message', (data) => {
  if (data === 'listen') {
    console.log('\t');
    console.log(`✔ Mock服务端口 http://localhost:${port}`)
  }
  if (data === 'exit') {
    process.exit(0);
  }
});
