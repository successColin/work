// 生成 html 的函数
function meaasgeToHtml(elem) {
  const { vartype, children } = elem;
  let text = '';
  if (children && children.length > 0) text = children[0].text;
  if (!text) return '<span></span>';
  return `<messageVar vartype=${vartype}>${text}</messageVar>`;
}

// 配置
// eslint-disable-next-line import/prefer-default-export
export const meaasgeToHtmlConf = {
  type: 'messageVar', // 节点 type ，重要！！！
  elemToHtml: meaasgeToHtml,
};
