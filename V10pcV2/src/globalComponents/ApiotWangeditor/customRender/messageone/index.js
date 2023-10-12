import { Boot } from '@wangeditor/editor';
import { meaasgeToHtmlConf } from './elem-to-html';
import { parseMeaasgeHtmlConf } from './parse-elem-html';
import withBreak from './plugin';
import { renderMessageConf } from './render-elem';

const WangEditorModule = {
  editorPlugin: withBreak,
  renderElems: [renderMessageConf],
  elemsToHtml: [meaasgeToHtmlConf],
  parseElemsHtml: [parseMeaasgeHtmlConf],
};

Boot.registerModule(WangEditorModule);
