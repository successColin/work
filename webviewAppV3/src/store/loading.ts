import { defineStore } from 'pinia';

export const useLoadingStore = defineStore({
	id: 'loading',
	state: () => ({
		show: true
	}),
	// methods 可以做同步 异步都可以做 提交state
	actions: {
		openLoading() { 
			this.show = true
		},
		closeLoading() {
			this.show = false
		},
	},
})
