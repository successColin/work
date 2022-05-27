import { h } from 'snabbdom';

function renderMessageVar(elem) {
  // elem 即当前节点
  // children 是下级节点
  // editor 即编辑器实例
  const { vartype, children } = elem;
  let text = '';
  if (children && children.length > 0) text = children[0].text;
  const vnodeChild = [
    h(
      'div',
      {
        props: {
          contentEditable: false,
          className: `custom__varible type_${vartype}`,
        },
        on: {
          mousedown: (event) => event.preventDefault(),
        },
      },
      [h('span', {}, text)]
    ),
  ];
  const vnode = h('messageVar', {}, vnodeChild);

  return vnode;
}

// 渲染配置
// eslint-disable-next-line import/prefer-default-export
export const renderMessageConf = {
  type: 'messageVar', // 节点 type ，重要！！！
  renderElem: renderMessageVar,
};
