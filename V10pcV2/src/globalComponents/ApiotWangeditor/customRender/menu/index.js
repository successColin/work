import { Boot } from '@wangeditor/editor';
import dataMenuConf from './dataMenu';
import pageNumConf from './pageNum';
import timeMenuConf from './timeMenu';
import uploadFile from './uploadFile';

const WangEditorModule = {
  menus: [dataMenuConf, timeMenuConf, pageNumConf, uploadFile],
};

Boot.registerModule(WangEditorModule);
