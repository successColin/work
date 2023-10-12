import { config } from '@/config';
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 通过Vite的import.meta.glob()方法实现自动化导入路由
// const mainRouterModules = import.meta.glob('../layout/*.vue')
const viewRouterModules = import.meta.glob('../views/**/*.vue')

// // 子路由
// const childRoutes = Object.keys(viewRouterModules).map((path)=>{	
// 	const childName = path.match(/\.\.\/views\/(.*)\.vue$/)[1].split('/')[1];
// 	return {
// 		path: `/${childName.toLowerCase()}`,
// 		name: childName,
// 		component: viewRouterModules[path]
// 	} 
// })

// 根路由
const rootRoutes = Object.keys(viewRouterModules).map((path) => {
	const name = path.match(/\.\.\/views\/(.*)\.vue$/)[1].split('/')[0];
	return {
		path: `/${name.toLowerCase()}`,
		name,
		component: viewRouterModules[path]
	};
})

const routes: Array<RouteRecordRaw> = rootRoutes
console.log(routes)
const router = createRouter({
    history: createWebHistory(config.baseUrl),
    routes,
});

export default router







