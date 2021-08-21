## 概述

用于支付宝小程序编译
- less
- sass
- es6+
- ts
- 代码压缩
- 本地 mock

#### script-config 配置文件
```js
module.exports = {
  entry: 'src', // 项目入口目录
  output: 'dist', // 项目打包存放目录
  targets: { // babel 编译生成的版本 https://babeljs.io/docs/en/babel-preset-env#targets
    chrome: "58",
  },
  keep: /(node_modules)|(\.mini-ide)|(mini\.project\.json)/, // 打包时不删除的文件 https://webpack.docschina.org/configuration/output/#outputclean
  mockPort: false, // 默认设置为false关闭mock， 如果设置为mock: 7000 那么 http://localhost:7000 可以访问到mock数据
  webpackConfig: {}, // 你的 webpack 配置
}
```

#### mock
###### 读取 mock/index.js 文件内容产生mock，端口号读取配置，默认关闭。
###### mock/index.js 内容如下
###### 参考 https://www.expressjs.com.cn/starter/hello-world.html
```js
module.exports = (app) => {
  app.post('/home', (req, res) => {
    res.json({
      test: 'home'
    });
  })

  app.get('/', (req, res) => {
    res.json({
      test: 'hello'
    });
  })
};
```

```text
run dev // 启动编译，eslint检测，不压缩样式和js
run build // 代码压缩
```

脚手架生成
https://www.npmjs.com/package/min-app-pack
