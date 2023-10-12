/*
 * @Author: Fus
 * @Date:   2019-05-24 11:57:34
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-16 11:48:35
 * @Desc: tab的容器
 */
import ConferenceHistory from '@/components/ConferenceHistory/index.js';
import AppLibrary from '@/components/AppLibrary/AppLibrary';
import BatchLanguageSetting from '@/components/BatchLanguageSetting/BatchLanguageSetting';
import BundleConfig from '@/components/BundleConfig/BundleConfig';
import CodingManger from '@/components/CodingManager/CodingManger';
import CodingConfig from '@/components/CodingSettings/CodingConfig';
import ConsultingManagement from '@/components/ConsultingManagement/ConsultingManagement';
import ElementConfig from '@/components/ElementConfig/ElementConfig';
import ErrorCode from '@/components/ErrorCode/ErrorCode';
import Explorer from '@/components/Explorer/Explorer';
import ExternalLinks from '@/components/ExternalLinks/ExternalLinks';
import FileManger from '@/components/FileManage/FileConfig';
import FramePageConfig from '@/components/FramePageConfig/FramePageConfig';
import BoardFrame from '@/components/Frames/BoardFrame/BoardFrameRoute';
import ExplorerFrame from '@/components/Frames/ExplorerFrame/ExplorerFrame';
import FullListFrame from '@/components/Frames/FullListFrame/FullListFrame';
import HomeChartFrame from '@/components/Frames/HomeChartFrame/HomeChartFrame';
import LeftListFrame from '@/components/Frames/LeftListFrame/LeftListFrame';
import OutlookFrame from '@/components/Frames/OutlookFrame/OutlookFrame';
import ReportFrame from '@/components/Frames/ReportFrame/ReportFrame';
import TreeFrame from '@/components/Frames/TreeFrame/TreeFrame';
import GlobalCenter from '@/components/GlobalCenter/GlobalCenter';
import ImportTemplate from '@/components/ImportTemplate/ImportTemplate';
import JavaBean from '@/components/JavaBean/javaBean';
import KnowledgeBase from '@/components/knowledgeBase/knowledgeBase';
import LanguageGroupType from '@/components/LanguageGroupType/LanguageGroupType';
import Languages from '@/components/Languages/Languages';
import LicenseManager from '@/components/LicenseManager/LicenseManager';
import MainPageConfig from '@/components/MainPageConfig/MainPageConfig';
import MenuManger from '@/components/MenuManager/index/MenuManager';
import MessageHistory from '@/components/MessageHistory/MessageHistory';
import MessageServe from '@/components/MessageServe/MessageServe';
import MobilePageConfig from '@/components/MobilePageConfig/MobilePageConfig';
import OrganizationFile from '@/components/OrganizationFile/OrganizationFile';
import PageConfig from '@/components/PageConfig/PageConfig';
import PriorityManager from '@/components/PriorityManager/PriorityConfig';
import RoleManger from '@/components/RoleManager/RoleConfig';
import SanjiuReport from '@/components/SanjiuReport/SanjiuReport';
import ScheduledTasks from '@/components/ScheduledTasks/ScheduledTasks';
import StateManager from '@/components/StateManager/StateConfig';
import SystemAnnouncement from '@/components/SystemAnnouncement/SystemAnnouncement';
import TemplateFiles from '@/components/TemplateFiles/TemplateFiles';
import Test from '@/components/Test/Test';
import TreeiconConfig from '@/components/TreeiconConfig/TreeiconConfig';
import TypeManager from '@/components/TypeManager/TypeConfig';
import UserDesigner from '@/components/UserDesigner/UserDesigner';
import UserManager from '@/components/userManager/userConfig';
import VersionConfig from '@/components/VersionConfig/VersionConfig';
import VideoManagement from '@/components/VideoManagement/VideoManagement';
import VisualMap from '@/components/VisualMap/VisualMap';
import VisualMapConfig from '@/components/VisualMapConfig/VisualMapConfig';
import { BaseContext, NEED_CLEAR_SATATE_TABS } from '@/constants/global';
import { Tabs } from 'antd';
import { connect } from 'dva';
import React from 'react';
import styles from './TabContainer.less';

const { TabPane } = Tabs;

@connect(state => ({
  tabs: state.tabs,
  theme: state.global.theme,
  functionList: state.user.functionList, // 所有菜单数据
}))
class TabContainer extends React.Component {
  static contextType = BaseContext;
  state = {};
  onChange = activeTabKey => {
    this.context.dispatch({
      type: 'tabs/setActiveTabKey',
      payload: {
        activeTabKey,
      },
    });
  };
  onEdit = (targetKey, action) => {
    // 关闭tab
    if (action === 'remove') {
      this.removeTab(targetKey);
    }
  };
  // 根据comKey获取tab内容组件
  getTabContentComponnet = comKey => {
    const baseProps = {};
    if (comKey.indexOf('http://') > -1 || comKey.indexOf('https://') > -1) {
      return <ExternalLinks {...baseProps} url={comKey} />;
    }

    switch (comKey) {
      case 'VideoHistory':
        return <ConferenceHistory />;
      case 'MessageHistory':
        return <MessageHistory />;
      case 'VideoManagement':
        return <VideoManagement />;
      case 'ScheduledTasks':
        return <ScheduledTasks />;
      case 'LanguageGroupType':
        return <LanguageGroupType />;
      case 'BatchLanguageSetting':
        return <BatchLanguageSetting />;
      case 'Languages':
        return <Languages />;
      case 'SanjiuReport':
        return <SanjiuReport />;
      case 'MainPageConfig':
        return <MainPageConfig />;
      case 'VersionConfig':
        return <VersionConfig />;
      case 'TreeiconConfig':
        return <TreeiconConfig />;
      case 'ExplorerFrame':
        return <ExplorerFrame />;
      case 'BoardFrame':
        return <BoardFrame />;
      case 'OutlookFrame':
        return <OutlookFrame />;
      case 'TreeFrame':
        return <TreeFrame />;
      case 'HomeChartFrame':
        return <HomeChartFrame />;
      case 'ReportFrame':
        return <ReportFrame />;
      case 'ListFrame':
        return <LeftListFrame />;
      case 'FullListFrame':
        return <FullListFrame {...baseProps} />;
      case 'MobilePageConfig':
        return <MobilePageConfig />;
      case 'BundleConfig':
        return <BundleConfig />;
      case 'AppLibrary':
        return <AppLibrary />;
      case 'UserDesigner':
        return <UserDesigner />;
      case 'PageConfig':
        return <PageConfig />;
      case 'MenuManager':
        return <MenuManger {...baseProps} />;
      case 'JavaBean':
        return <JavaBean {...baseProps} />;
      case 'FramePageConfig':
        return <FramePageConfig {...baseProps} />;
      case 'FileManage':
        return <FileManger {...baseProps} />;
      case 'RoleManager':
        return <RoleManger {...baseProps} />;
      case 'UserManager':
        return <UserManager {...baseProps} />;
      case 'CodingManager':
        return <CodingManger {...baseProps} />;
      case 'CodingSettings':
        return <CodingConfig {...baseProps} />;
      case 'TemplateFiles':
        return <TemplateFiles {...baseProps} />;
      case 'ImportTemplate':
        return <ImportTemplate {...baseProps} />;
      case 'GlobalCenter':
        return <GlobalCenter {...baseProps} />;
      case 'ElementConfig':
        return <ElementConfig {...baseProps} />;
      case 'HomePage':
        return <HomeChartFrame {...baseProps} />;
      case 'KnowledgeBase':
        return <KnowledgeBase {...baseProps} />;
      case 'Explorer':
        return <Explorer {...baseProps} />;
      case 'StateManager':
        return <StateManager {...baseProps} />;
      case 'TypeManager':
        return <TypeManager {...baseProps} />;
      case 'PriorityManager':
        return <PriorityManager {...baseProps} />;
      case 'LicenseManager':
        return <LicenseManager {...baseProps} />;
      case 'OrganizationFile':
        return <OrganizationFile {...baseProps} />;
      case 'ErrorCode':
        return <ErrorCode {...baseProps} />;
      case 'Test':
        return <Test {...baseProps} />;
      case 'VisualMap':
        return <VisualMap />;
      case 'VisualMapConfig':
        return <VisualMapConfig />;
      case 'MessageServe':
        return <MessageServe />;
      case 'SystemAnnouncement':
        return <SystemAnnouncement />;
      case 'ConsultingManagement':
        return <ConsultingManagement />;
      default:
        return null;
    }
  };
  removeTab = tabKey => {
    this.context.dispatch({
      type: 'tabs/removeTab',
      payload: {
        tabKey,
      },
    });
    // 若有对应绑定model数据，则清空model里的状态数据
    const comName = tabKey.split('_')[0];
    const modelName = NEED_CLEAR_SATATE_TABS[comName];
    modelName &&
      this.context.dispatch({
        type: `${modelName}/clearState`,
      });
  };
  handleRefresh = ({ tabKey }) => {
    this.context.dispatch({
      type: 'tabs/updateTabInfo',
      payload: {
        tabKey,
        isRefreshing: true,
      },
    });
  };

  getCrumbPath = tab => {
    const { langLib } = this.context;
    const { tabs = {}, functionList } = this.props;
    const { functionData } = tab;
    let activeName = functionData.id && functionData.name;
    if (tabs.activeTabKey === 'HomePage') {
      // 主页
      activeName = langLib['tab.HomePage'];
    }
    const result = activeName ? [activeName] : [];
    // 找到父节点名称
    const findPidName = (list, data) => {
      list.forEach(item => {
        if (item.nodeKey === data.pid) {
          result.unshift(item.name);
          return;
        } else if (item.children) {
          findPidName(item.children, item);
        }
      });
    };
    findPidName(functionList, functionData);
    return result;
  };

  render() {
    const { openedTabs, activeTabKey } = this.props.tabs;
    const { langLib } = this.context;
    console.log(openedTabs);
    return (
      <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={activeTabKey}
        onEdit={this.onEdit}
        type="editable-card"
        className={`custom-main-tab ${styles.wrap}`}
      >
        {openedTabs.map(tab => {
          const crumbPath =
            tab.tabKey === 'HomePage' ? langLib['tab.HomePage'] : this.getCrumbPath(tab).join('/');
          const path = langLib['global.crumbPath'] + crumbPath;
          const title = tab.tabKey === 'HomePage' ? langLib['tab.HomePage'] : tab.title;
          return (
            <TabPane
              tab={
                tab.tabKey === 'HomePage' ? (
                  <span className="iconfont icon-homepage" title={path} />
                ) : (
                  <div>
                    <span className={styles.tabTitle} title={path}>
                      {title}
                    </span>
                    <span className="iconfont icon-close" />
                  </div>
                )
              }
              closable={tab.closable}
              // closable={false}
              key={tab.tabKey}
            >
              {!tab.isRefreshing && this.getTabContentComponnet(tab.comKey)}
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

export default TabContainer;
