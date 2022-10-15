import { Boot } from '@wangeditor/editor';
import dataMenuConf from './dataMenu';
import pageNumConf from './pageNum';
import timeMenuConf from './timeMenu';

const module = {
  menus: [dataMenuConf, timeMenuConf, pageNumConf],
};

Boot.registerModule(module);
