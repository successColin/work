import Vue from 'vue';

// 读取所有的文件，第二个参数表示是否深度遍历
const files = require.context('../globalComponents/', true, /index\.vue$/);
console.log(files.keys());
files.keys().forEach((key) => {
  console.log(key);
  // 组件实例
  const reqCom = files(key);
  // 截取路径作为组件名
  const arr = key.split('/');
  const reqComName = arr[arr.length - 2];
  // 组件挂载
  Vue.component(reqComName, reqCom.default || reqCom);
});
