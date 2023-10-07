import React, { Component } from 'react';
import { Card } from 'antd';
import { FormattedMessage } from 'react-intl';
import List from './List/List';
import Styles from './VideoManagement.less';

const tabList = [
  {
    key: 'list',
    tab: <FormattedMessage id="video.spectacle.equipment"/>,
  },
  {
    key: 'history',
    tab: <FormattedMessage id="video.conference.history"/>,
  },
];

class VideoManagement extends Component {
  constructor() {
    super();
    this.state = {
      activeKey: 'list',
    };
  }

  // 切换选项卡
  changeTabKey = (activeKey) => {
    console.log(typeof activeKey, activeKey);
    this.setState({ activeKey });
  };

  render() {
    // const { activeKey } = this.state;
    // const content = this.getContent(activeKey);
    return (<div id="videoContent" className={`videoContentWrap ${Styles.videoContentWrap}`}>
      <List/>
      {/*<Card*/}
      {/*  className="videoCard"*/}
      {/*  tabList={tabList}*/}
      {/*  activeTabKey={activeKey}*/}
      {/*  onTabChange={key => {*/}
      {/*    this.changeTabKey(key, 'key');*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {content}*/}
      {/*</Card>*/}
    </div>);
  }
}

export default VideoManagement;
