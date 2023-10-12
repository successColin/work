import FetchData from '@/utils/request'
/**
 * 获取数据
 */
export function listData(data) {
	return FetchData.request({
		url: '/lzlj/custom/listInfo',
		method: 'post',
		data,
		headers: {
      'content-type': 'application/json',
    },
	})
}

/**
 * 修改数据
 */
export const updatePrintInfo = (data) => {
	return FetchData.request({
		url: '/lzlj/custom/updatePrintInfo',
		method: 'post',
		data,
		headers: {
      'content-type': 'application/json',
    },
	})
}
