import { downloadFile } from '@/api/menuConfig.js';
import { saveAs } from '@/utils';

// 获取文件的后缀
const downloadFileFun = async function({ url, name, isAddPrefix = true }) {
  const file = await downloadFile(url, isAddPrefix);
  saveAs(file, name);
};

// 下载
export default {
  downloadFileFun,
};
