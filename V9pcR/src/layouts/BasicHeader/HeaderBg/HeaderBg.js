/*
 * @Author: Fus
 * @Date:   2019-06-18 09:45:41
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-21 16:00:50
 * @Desc: 头部的动态背景存放
 */
import classNames from 'classnames';
import styles from './HeaderBg.less';

const HeaderBg = () => {
  const getIconCls = (iconType, index) =>
    classNames({
      iconfont: true,
      [`icon-gear${iconType}`]: true,
      [styles.gear]: true,
      [styles[`gear${index}`]]: true,
    });
  return (
    <div className={`${styles.wrap} system__headerTop`}>
      <span className={getIconCls(1, 1)} />
      <span className={getIconCls(2, 2)} />
      <span className={getIconCls(1, 3)} />
      <span className={getIconCls(3, 4)} />
      <span className={getIconCls(2, 5)} />
    </div>
  );
};

export default HeaderBg;
