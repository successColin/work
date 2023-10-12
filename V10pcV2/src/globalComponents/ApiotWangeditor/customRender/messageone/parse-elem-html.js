import $dom7 from 'dom7';

function parseMeaasgeHtml($elem, children) {
  // 返回 slate elem ，链接类型
  return {
    type: 'messageVar',
    vartype: $dom7($elem).attr('vartype') || '1',
    children,
  };
}
// eslint-disable-next-line import/prefer-default-export
export const parseMeaasgeHtmlConf = {
  selector: 'messageVar', // CSS 选择器，以匹配“链接”的 html tag
  parseElemHtml: parseMeaasgeHtml,
};
