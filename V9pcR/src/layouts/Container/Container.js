/*
 * @Author: Fus
 * @Date:   2019-06-18 15:39:00
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-12 11:25:45
 * @Desc: tab列表及面包屑
 */
import styles from './Container.less';
import Crumb from './Crumb/Crumb';
import TabContainer from './TabContainer/TabContainer';

const Container = () => {
  return (
    <div className={styles.wrap}>
      <Crumb />
      <TabContainer />
    </div>
  );
};

export default Container;
