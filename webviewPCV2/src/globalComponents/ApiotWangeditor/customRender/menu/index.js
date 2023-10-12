import { Boot } from '@wangeditor/editor';
import dataMenuConf from './dataMenu';
import pageNumConf from './pageNum';
import timeMenuConf from './timeMenu';

const WangEditorModule = {
  menus: [dataMenuConf, timeMenuConf, pageNumConf],
};

Boot.registerModule(WangEditorModule);
