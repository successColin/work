import { defineStore } from 'pinia';

export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		name: '张三',
		age: 18
	}),
	// computed 修饰一些值
	getters: {
		fullName: (state) => state.name + '丰'
	},
	// methods 可以做同步 异步都可以做 提交state
	actions: {
		updateAge() { 
			this.age++;
		},
		updateState(data: any) {
			this.$state = data
			this.updateAppConfig()
		},
	},
	// 开启数据缓存
	persist: {
		key: 'user',
		storage: window.localStorage,
		paths: ['name'],
	}
})


export const usePiniaState = defineStore('pinia', ()=>{
	const userName = ref('hello')
	const getUserNmae = (data) => {
			userName.value = data
	}
	return { userName, getUserNmae}
})
