/**
 * @name: config
 * @author: DELL
 * @date: 2021/8/5 19:59
 * @description：config
 * @update: 2021/8/5 19:59
 */

const state = {
  list: [], // 控件集合
  bgConfig: {
    title: '', // 大屏标题
    width: 1920, // 大屏默认宽度
    height: 1080, // 大屏默认高度
    bgImage: '', // 背景图片
    bgColor: '#131E45', // 背景颜色
    gridSize: 24, // 栅格大小
    enable: true, // 是否启用栅格，默认启用，值为true
    thumbnail: '' // 缩略图
  } //大屏背景配置
};


const mutations = {
  UPDATE_LIST(state, newList) {
    window.localStorage.setItem('list', JSON.stringify(newList));
    state.list = newList;
  },
  SET_CONFIG(state, configObj) {
    state.list.push(configObj);
  },
  SET_BG_CONFIG(state, config) {
    state.bgConfig = config;
    window.localStorage.setItem('bg', JSON.stringify(state.bgConfig));
  }
};

const actions = {
  setConfig({commit}, configObj) { // 拖入组件
    commit('SET_CONFIG', configObj);
  },
  setBgConfig({commit}, configObj) { // 设置大屏信息
    commit('SET_BG_CONFIG', configObj);
  },
  updateComponentList({commit}, list) { // 更新控件上的数据
    commit('UPDATE_LIST', list);
  },
  putTop({commit}, {list,activeComponent}) { // 置顶
    let max = Math.max.apply(Math, list.map(function (o) {
      return o.stylesObj.zIndex;
    }))
    const obj = {...activeComponent};
    if (max === obj.stylesObj.zIndex) {return;}
    obj.stylesObj.zIndex = max + 1;
    const index = list.findIndex((item) => item.componentId === activeComponent.componentId);
    const newlist = [...list];
    newlist.splice(index, 1, activeComponent);
    commit('UPDATE_LIST', newlist);
  },
  putBottom({commit}, {list,activeComponent}) { // 置底
    let mix = Math.min.apply(Math, list.map(function (o) {
      return o.stylesObj.zIndex;
    }))
    const obj = {...activeComponent};
    obj.stylesObj.zIndex = mix - 1;
    const index = list.findIndex((item) => item.componentId === activeComponent.componentId);
    const newlist = [...list];
    newlist.splice(index, 1, activeComponent);
    commit('UPDATE_LIST', newlist);
  },
  bringForward({commit}, {list,activeComponent}) { // 上移一层
    const index = list.findIndex((item) => item.componentId === activeComponent.componentId);
    if (index === 0) {return;}
    const {stylesObj: {zIndex}} = list[index - 1];
    const obj = {...activeComponent};
    obj.stylesObj.zIndex = zIndex + 1;
    const newlist = [...list];
    newlist.splice(index, 1, obj);
    commit('UPDATE_LIST', newlist);
  },
  sendBackward({commit}, {list,activeComponent}) { // 下移一层
    const index = list.findIndex((item) => item.componentId === activeComponent.componentId);
    if (index === list.length - 1) {return;}
    const {stylesObj: {zIndex}} = list[index + 1];
    const obj = {...activeComponent};
    obj.stylesObj.zIndex = zIndex - 1;
    const newlist = [...list];
    newlist.splice(index, 1, obj);
    commit('UPDATE_LIST', newlist);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
