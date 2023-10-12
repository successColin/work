/*
 * @Author: Fus
 * @Date:   2019-10-17 10:33:53
 * @Desc: 报表框架
 */
import { getPageConfig } from '@/services/frame';
import { connect } from 'dva';
import { Component } from 'react';
import styles from './ReportFrame.less';
import TabPaneContainer from './TabPaneContainer/TabPaneContainer';

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
}))
class ReportFrame extends Component {
  state = {
    pageConfig: {}, // 配置信息
    loadingStatus: {
      page: false, // 页面元素
    },
  };
  componentDidMount() {
    this.fetchPageConfig();
  }
  // 获取页面的配置信息
  fetchPageConfig = () => {
    const { functionData } = this.props;
    this.setLoadingStatus('page', true);
    getPageConfig({ functionId: functionData.id }).then(
      pageConfig => {
        this.setState({ pageConfig });
        this.setLoadingStatus('page', false);
      },
      err => this.setLoadingStatus('page', false),
    );
  };
  // 更新loading状态
  setLoadingStatus = (type, loading) => {
    const { loadingStatus } = this.state;
    this.setState({
      loadingStatus: {
        ...loadingStatus,
        [type]: loading,
      },
    });
  };
  render() {
    const { pageConfig } = this.state;
    const tabProps = {
      pageConfig,
    };
    return (
      <div className={`${styles.wrap} system__contentbkgd`}>
        <TabPaneContainer {...tabProps} />
      </div>
    );
  }
}

export default ReportFrame;
