/*
 * @Author: Shishans
 * @Date: 20200311
 * @Desc: 常用方法
*/
/**
 * 小数后几位抹0
 * @param {string} num 值
 */
export const COMMON_FORMAT_DECIMAL = num => {
	if(!num) return ""
	const str = num + ''
	const regexp = /(?:\.0*|(\.\d+?)0+)$/;
	const result = str.replace(regexp, '$1');
	return result;
}