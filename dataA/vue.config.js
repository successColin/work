// eslint-disable-next-line no-undef
const path = require('path'); //path模块
const webpack = require('webpack');
const argvs = process.argv.slice(2);
const { baseUrl } = require('./src/constants/config');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
  // eslint-disable-next-line no-undef
  return path.join(__dirname, dir)
}

function getParams(arr) {
  if (!arr.length) return '';
  if (process.env.NODE_ENV === 'development') return '';
  const path = arr[0].replace('--', '');
  return path
}
const params = getParams(argvs.slice(1));

// 项目的主要配置文件
// eslint-disable-next-line no-undef
module.exports = {
  productionSourceMap: false, //去除打包后js的map文件
  'publicPath':
    process.env.NODE_ENV === 'production' ? baseUrl : '/',
  assetsDir: 'static',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/css/base.scss";'
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({ GLOBAL_PATH: JSON.stringify(params) }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
        generateStatsFile: process.env.NODE_ENV === 'production' ? false : false // 是否生成stats.json文件
      }),
      new webpack.DefinePlugin({
        'process.env': {
          GLOBAL_PREFIX: JSON.stringify(params)
        }
      })
    ],
    resolve: { extensions: ['.js', 'css', 'scss', '.vue'] }
  },

  //set第一个参数：设置的别名，第二个参数：设置的路径
  chainWebpack: (config) => {
    // 第三方库的分离打包
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        vue: {
          name: 'chunk-Vue',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?vue(.*)/
        },
        elementUi: {
          name: 'chunk-elementUi',
          priority: 25,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src'),
          minChunks: 3,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    });

    config.when(process.env.NODE_ENV !== 'development', (curConfig) => {
      curConfig.optimization.minimizer('terser').tap((options) => {
        // 去除注释
        options[0].extractComments = false;
        options[0].terserOptions.format = {
          comments: false
        };
        // 去除console
        options[0].terserOptions.compress.drop_console = true;
        return options;
      });
    });
    config.plugins.delete('prefetch');
    // 移除 preload 插件
    config.plugins.delete('preload');
    // 处理woff
    config.module
      .rule('woff')
      .test(/\.woff$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'static/fonts/[name].[hash:8].[ext]'
      })
      .end();
    //修改文件引入自定义路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'));
    config.module.rule('eslint')
      .test(/\.(js|vue)$/)
      .use('eslint')
      .loader('eslint-loader')
      // eslint-disable-next-line no-undef
      .options({formatter: require('eslint-friendly-formatter')})
      .end()
  },
  devServer: {
    port: '8888', // 设置端口号
    proxy: {
      '/api': {
        // target: 'http://192.168.0.136:8081', // lf
        target: 'http://47.110.141.124/',
        // ws: true, //代理websockets
        changeOrigin: true, // 是否跨域，虚拟的站点需要更管origin
        pathRewrite: {
          // '^/api'是一个正则表达式，表示要匹配请求的url中，全部'http://localhost:8081/api' 转接为 http://localhost:8081/
          '^/api': '/api'
        }
      }
    }
  }
}
