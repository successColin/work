/*
 * @Author: Fus
 * @Date:   2019-06-18 19:22:22
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-18 14:20:07
 * @Desc: 分割线组件，可带标题
 */
import { Icon } from 'antd';
import classNames from 'classnames';
import styles from './SplitLine.less';

const SplitLine = ({ title = '', segmentationstyle }) => {
  const lineCls = classNames({
    'system__lineBorder--bottom': true,
    [styles.line]: true,
    [styles.noTit]: !title,
  });

  console.log(22222222, segmentationstyle);

  if (segmentationstyle === 3) {
    // 格式三
    return (
      <div className={`${styles.wrap} dividerStyle`}>
        <div className={`${styles.title3} title3`}>
          {/* 样式 */}
          <div />
          <div />
          <div />
          <div />
          {title}
        </div>
        <div className={styles.line3} />
      </div>
    );
  } else if (segmentationstyle === 2) {
    // 格式二
    return (
      <div className={`${styles.wrap} dividerStyle`}>
        <div className={`${styles.title2} title2`}>
          {/* 四个三角形 */}
          <div />
          <div />
          <div />
          <div />
          {/* 两个菱形 */}
          <div />
          <div />
          {title}
        </div>
        <div className={styles.line2} />
      </div>
    );
  } else {
    // 格式一
    return (
      <div className={styles.wrap}>
        <Icon type="caret-right" className="custom-color" />
        <span className={`${styles.title} system__whiteColor`}>{title}</span>
        <div className={lineCls} />
      </div>
    );
  }
};

export default SplitLine;
