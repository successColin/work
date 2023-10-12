import vue from '@vitejs/plugin-vue';
import path from "path";
// import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig, loadEnv } from 'vite';
import styleImport, { VantResolve } from 'vite-plugin-style-import';
import vuesetupExtend from 'vite-plugin-vue-setup-extend';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// 检查process.cwd()路径下.env.develeport.local、.env.development、.env.local、.env这四个环境文件
	const config = loadEnv(mode, process.cwd());
	return {

		// 静态资源基础路径 base: './' || '',
		base: config.VITE_BASE_URL,

		resolve: {
			alias: {
				// 配置src目录
				"@": path.resolve(__dirname, "src"),
				// 导入其他目录
				"components": path.resolve(__dirname, "_C")
			}
		},
		plugins: [
			vue(),
			// 配置后，Vant各组件才生效、按需引入样式
			styleImport({
				resolves: [VantResolve()],
			}),
			// script name 语法糖
			vuesetupExtend(),
			// 自动引入
			AutoImport({
				imports: ['vue'], // , 'vue-router', '@vueuse/core'
				dts: 'src/auto-import.d.ts',
			}),
			// 分析
			// visualizer({
			// 	open: true
			// })
		],

		css: {
			preprocessorOptions: {
				scss: {
						charset: false
				}
			},
		},
		// 跨域代理
		server: {
			host: '0.0.0.0',
			port: 8088,
			open: false,
			https: false,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			overlay: {
				warnings: false,
				errors: true,
			}, // 错误在页面弹出、警告不在页面弹出
			proxy: {
				'/api': {
					// target: 'http://192.168.0.27:8080', // 陈珑本地
					target: 'http://116.62.194.222:85', // 泸州老窖
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/api/, '') // 将匹配到的api替换成''
					pathRewrite: {
						'^/api': '/api',
					},
				}
			}
		},
		//打包前先清空原有打包文件
    build: {
			emptyOutDir: true,
			outDir: 'webviewApp' // 打包文件的输出目录
		}
	};
});
