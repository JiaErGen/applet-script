module.exports = {
  entry: 'src', // 项目入口目录
  output: 'dist', // 项目打包存放目录
  targets: { // babel 编译生成的版本 https://babeljs.io/docs/en/babel-preset-env#targets
    chrome: "58",
  },
  keep: /(node_modules)|(\.mini-ide)|(mini\.project\.json)/, // 打包时不删除的文件 https://webpack.docschina.org/configuration/output/#outputclean
  mockPort: false, // mock 数据端口 http://localhost:7000
  webpackConfig: {}, // 你的 webpack 配置
}
