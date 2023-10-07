/*
 * @Author: Fus
 * @Date:   2019-09-10 21:05:53
 * @Desc: APP主页配置
 */
import { CSpin } from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import { getAppHomePage, getAppNotice } from '@/services/appLibrary';
import { Form } from 'antd';
import { connect } from 'dva';
import { Component } from 'react';
import styles from './AppHomeConfig.less';
import BannerConfig from './BannerConfig/BannerConfig';
import BundleDetail from './BundleDetail/BundleDetail';
import ConsultationForm from './ConsultationForm/ConsultationForm';
import GroupForm from './GroupForm/GroupForm';
import HomeModel from './HomeModel/HomeModel';
import ModuleLib from './ModuleLib/ModuleLib';
import NoticeForm from './NoticeForm/NoticeForm';
import UserCenterStaticBlock from './UserCenterStaticBlock/UserCenterStaticBlock';

@connect(state => ({
  appHomeConfig: state.appHomeConfig,
  functionData: state.tabs.activeTabData.functionData,
}))
class AppHomeConfig extends Component {
  static contextType = BaseContext;
  state = {
    loading: false,
    consultationDetails: {}, // 行业资讯配置
  };

  async componentDidMount() {
    await this.fetchAppData();
    await this.fetchNotice();
  }
  // 获取行业质讯
  fetchNotice = async () => {
    const { appData, appHomeConfig } = this.props;
    console.log(this.props);
    const { id: appId } = appData;
    getAppNotice({ id: appId, typeId: 2 }).then(res => {
      this.setState({ consultationDetails: res });
    });
  };

  // 获取APP数据
  fetchAppData = () => {
    const { appData, appHomeConfig } = this.props;
    const { groupData: oldGroupData, mainTabKey } = appHomeConfig;
    this.setState({ loading: true });
    getAppHomePage({ appId: appData.id, basetype: mainTabKey }).then(
      res => {
        const {
          leftList,
          rightList,
          topCoreList,
          workSpaceList,
          myWorkSpaceList,
          bottomList,
          figureList,
        } = res;
        this.setState({ loading: false });
        let spacList = mainTabKey === 1 ? workSpaceList : myWorkSpaceList;
        let groupData = oldGroupData.id
          ? spacList.find(item => item.id === oldGroupData.id) || {}
          : {};
        this.context.dispatch({
          type: 'appHomeConfig/updateState',
          payload: {
            appData,
            groupData,
            leftList,
            rightList,
            topCoreList,
            workSpaceList,
            bottomList,
            figureList,
            myWorkSpaceList,
          },
        });
      },
      err => this.setState({ loading: false }),
    );
  };
  hideDropDown = () => {
    this.refs && this.refs.homeModel.hideChangeGroup();
  };
  updateState = (obj, callback) => {
    this.setState(obj, () => {
      callback && callback();
    });
  };

  render() {
    const { form, appHomeConfig, functionData } = this.props;
    const { loading, consultationDetails } = this.state;
    const { actionType, areaCode } = appHomeConfig;
    const publicProps = {
      fetchAppData: this.fetchAppData,
      form,
      functionData,
      appHomeConfig,
    };
    const renderDetailForm = () => {
      if (areaCode === 'banner') {
        // banner区域
        return <BannerConfig />;
      } else if (areaCode === 'staticBlock') {
        // 个人中心的固定模块
        return <UserCenterStaticBlock />;
      } else if (actionType === 'editGroup' || actionType === 'addGroup') {
        return <GroupForm {...publicProps} />;
      } else if (actionType === 'bundleDetail') {
        return <BundleDetail {...publicProps} />;
      } else if (areaCode === 'notice') {
        return <NoticeForm {...publicProps} />;
      } else if (areaCode === 'consultation') {
        // 资讯配置
        return (
          <ConsultationForm
            {...publicProps}
            updateState={this.updateState}
            consultationDetails={consultationDetails}
          />
        );
      }
    };
    return (
      <div className={styles.wrap}>
        <div
          className={`${styles.borderWrap} system__lineBorder`}
          onClick={() => this.hideDropDown()}
        >
          <Form layout="vertical">
            <CSpin spinning={loading}>
              <div className={styles.moduleWrap}>
                <ModuleLib {...publicProps} />
              </div>
              <div
                className={`${
                  styles.showWrap
                } system__lineBorder--left system__lineBorder--right system__contentbkgd`}
              >
                <HomeModel
                  ref="homeModel"
                  {...publicProps}
                  consultationDetails={consultationDetails}
                />
              </div>
              <div className={styles.detailWrap}>{renderDetailForm()}</div>
            </CSpin>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(AppHomeConfig);
