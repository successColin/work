/*
 * @Author: ytx
 * @Date:   2020-02-07 09:24:06
 * @Desc: 版本配置
 */
import { Component } from 'react';
import styles from './TreeiconConfig.less';
import VersionList from './VersionList/VersionList';

class VersionConfig extends Component {
  render() {
    return (
      <div className={`${styles.wrap} system__contentbkgd`}>
        <div className={styles.contentWrap}>
          <VersionList />
        </div>
      </div>
    );
  }
}
export default VersionConfig;
