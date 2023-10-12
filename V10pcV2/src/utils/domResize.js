/**
 * Created by mapbar_front on 2018/10/19
 */
const elList = [];
// eslint-disable-next-line no-unused-vars
let timer = 0;

function getStyle(ele, attr) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(ele, null)[attr];
  }
  return ele.currentStyle[attr];
}

function isEqul(obj1, obj2) {
  let isFlag = true;
  // eslint-disable-next-line no-restricted-syntax
  for (const i in obj1) {
    if (obj1[i] !== obj2[i]) {
      isFlag = false;
    }
  }
  return isFlag;
}

function bind(el, next) {
  const obj = {
    el,
    callback: next,
    style: {
      width: getStyle(el, 'width'),
      height: getStyle(el, 'height'),
    }
  };
  elList.push(obj);
}

function remove(el) {
  elList.splice(elList.indexOf(el));
  if (elList.indexOf(el) !== -1) {
    elList.splice(elList.indexOf(el), 1);
  }
}

timer = setInterval(() => {
  for (let i = 0; i < elList.length; i += 1) {
    const dom = elList[i].el;
    const style = {
      width: getStyle(dom, 'width'),
      height: getStyle(dom, 'height'),
    };
    if (!isEqul(style, elList[i].style)) {
      elList[i].style = {
        width: style.width,
        height: style.height,
      };
      // eslint-disable-next-line no-unused-expressions
      elList[i].callback && elList[i].callback();
    }
  }
}, 200);

function destroy() {
  timer = 0;
}

export default {
  bind,
  remove,
  destroy,
};
