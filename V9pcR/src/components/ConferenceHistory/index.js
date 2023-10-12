/**
 * @name: index
 * @author: DELL
 * @date: 2022/1/13 10:06
 * @description：index
 * @update: 2022/1/13 10:06
 */
import React, { Component } from 'react';
import Historty from '@/components/VideoManagement/History/History';
import Styles from '@/components/VideoManagement/VideoManagement.less';


class VideoHistorty extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (<div id='videoContent' className={`videoContentWrap ${Styles.videoContentWrap}`}>
      <Historty />
    </div>);
  }
}

export default VideoHistorty;
