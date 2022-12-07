module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 8081,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    }, // 错误在页面弹出、警告不在页面弹出
    proxy: {
      '/api': {
        // target: 'http://47.118.76.70:8080/', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        // target: 'http://192.168.0.37:8080', // cl
        // target: 'http://192.168.0.136:8080', // lf
        // target: 'https://smrz.ywsoft.vip', // lf
        // target: 'http://192.168.0.136:8080', // zs
        // target: 'http://192.168.0.37:8080', // lf
        // target: 'http://192.168.0.28:8080', // zs
        // target: 'http://192.168.0.23:8080', // jh
        // target: 'http://47.99.87.62:84/',
        target: 'http://47.99.87.62:93/',
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  },

  transpileDependencies: ['uview-ui'],

  chainWebpack(config) {
    config
      .plugin('ScriptExtHtmlWebpackPlugin')
      .after('html')
      .use('script-ext-html-webpack-plugin', [
        {
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/,
        },
      ])
      .end();

    if (process.env.use_analyzer) {
      // 分析
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end();
    }

    config.when(process.env.NODE_ENV !== 'development', (curConfig) => {
      // 发行或运行时启用了压缩时会生效
      curConfig.optimization.minimizer('terser').tap((args) => {
        const { compress } = args[0].terserOptions;
        // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
        compress.drop_console = true;
        compress.pure_funcs = [
          '__f__', // App 平台 vue 移除日志代码
          // 'console.debug' // 可移除指定的 console 方法
        ];
        return args;
      });
    });
    // 处理woff
    config.module
      .rule('woff')
      .test(/\.woff$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'static/fonts/[name].[hash:8].[ext]',
      })
      .end();
  },
};
