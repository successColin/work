/*
 * @Author: Fus
 * @Date:   2019-09-16 09:43:32
 * @Desc: 界面配置
 */
import { CSpin } from '@/components/common/BasicWidgets';
import MobileTabPaneContainer from '@/components/MobileTabPaneContainer/MobileTabPaneConTainer';
import { connect } from 'dva';
import { Component } from 'react';
import styles from './PageConfig.less';
import UserDesignerTabs from './UserDesignerTabs/UserDesignerTabs';

@connect(state => ({
  bundleConfig: state.bundleConfig,
}))
class PageConfig extends Component {
  state = {
    loadingFrame: false,
  };
  setPageConfigState = itemObj => {
    this.setState(itemObj);
  };
  render() {
    const { frameDetail } = this.props.bundleConfig;
    const { loadingFrame } = this.state;
    return (
      <div className={`${styles.wrap} system__lineBorder`}>
        <div className={`${styles.leftWrap} system__lineBorder--right`}>
          <UserDesignerTabs setPageConfigState={this.setPageConfigState} />
        </div>
        <div className={styles.container}>
          {frameDetail.id && (
            <CSpin spinning={loadingFrame}>
              <MobileTabPaneContainer fromType="pageConfig" />
            </CSpin>
          )}
        </div>
      </div>
    );
  }
}
export default PageConfig;
