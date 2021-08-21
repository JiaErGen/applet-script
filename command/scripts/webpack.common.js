const processCwd = process.cwd();
const path = require('path');
const pkgPath = path.join(processCwd, 'package.json');
const fs = require('fs');
const WebpackBar = require('webpackbar');
const DeleteAssetsWebpackPlugin = require('delete-assets-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');
const copyNodeModules = require('copy-node-modules');
const pkg = require(pkgPath);
const scriptConfig = require('../../scriptConfig');

// 文件存放
function useFiles() {
  return {
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
      outputPath: (url) => {
        if (url.startsWith('_/')) {
          return url.substr(2);
        }
        return url;
      },
    },
  };
}

// 递归获取入口文件，全文件 entry
function getEntry(dir, list = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((item) => {
    const pathName = path.join(dir, item.name);
    if (item.isDirectory()) {
      getEntry(pathName, list);
    } else {
      list.push(pathName);
    }
  });
  return list;
}

const webpackConfig = {
  // devServer: { // 浏览器显示错误信息
  //   overlay: true,
  // },
  // bail: true, // 在第一个错误出现时抛出失败结果
  context: path.join(processCwd, scriptConfig.entry),
  entry: () => getEntry(path.join(processCwd, scriptConfig.entry)).concat(pkgPath),
  output: {
    clean: {
      keep: scriptConfig.keep,
    },
    path: path.join(processCwd, scriptConfig.output),
  },
  resolve: {
    preferAbsolute: true,
    roots: [path.join(processCwd, scriptConfig.entry), processCwd],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].acss',
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                plugins: [].concat(
                  // less 压缩判断
                  process.env.NODE_ENV === 'production' ? new CleanCSSPlugin({ advanced: true }) : []
                ),
              },
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].acss',
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: useFiles(),
      },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].js',
            },
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    "targets": scriptConfig.targets,
                  }
                ],
                '@babel/preset-typescript'
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|md|axml|acss|sjs|wxs|wxml|wxss)$/i,
        use: useFiles(),
      },
    ],
  },
  plugins: [
    new DeleteAssetsWebpackPlugin(['main.js']), // 删除 main.js
    new WebpackBar(), // 进度条
  ],
};

function copyModules() {
  if (pkg.dependencies === undefined || Object.keys(pkg.dependencies).length === 0) {
    return;
  }
  const src = path.join(processCwd);
  const target = path.join(processCwd, scriptConfig.output);
  return new Promise((resolve, reject) => {
    copyNodeModules(src, target, { devDependencies: false }, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}

module.exports = async () => {
  await copyModules();
  return webpackConfig;
};
