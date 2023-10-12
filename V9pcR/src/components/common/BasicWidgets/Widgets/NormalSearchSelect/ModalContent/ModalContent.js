/*
 * @Author: Fus
 * @Date:   2019-08-06 10:30:44
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-27 11:34:02
 * @Desc: 搜索选择框的内容容器
 */
import { Fragment } from 'react';
import ContentList from '../ContentList/ContentList';
import ContentTree from '../ContentTree/ContentTree';
import HeaderFilter from './HeaderFilter/HeaderFilter';
import styles from './ModalContent.less';

const ModalContent = ({ showType, ...rest }) => {
  const renderContent = () => {
    switch (showType) {
      case 'list':
        return <ContentList {...rest} />;
      case 'tree':
        return <ContentTree {...rest} />;
      default:
        return null;
    }
  };
  const { eleObj } = rest;
  return (
    <Fragment>
      <HeaderFilter
        showType={showType}
        eleObj={eleObj}
        setWrapState={rest.setWrapState}
        treeNodeType={rest.treeNodeType}
      />
      <div className={styles.contentWrap}>{renderContent()}</div>
    </Fragment>
  );
};
export default ModalContent;
