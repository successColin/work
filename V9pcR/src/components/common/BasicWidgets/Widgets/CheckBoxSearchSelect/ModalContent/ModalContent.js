/*
 * @Author: Fus
 * @Date:   2019-08-06 10:30:44
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-27 11:33:40
 * @Desc: 搜索选择框的内容容器
 */
import { Fragment } from 'react';
import ContentList from '../../NormalSearchSelect/ContentList/ContentList';
import ContentTree from '../../NormalSearchSelect/ContentTree/ContentTree';
import HeaderFilter from './HeaderFilter/HeaderFilter';
import styles from './ModalContent.less';
import TagSet from './TagSet/TagSet';

const ModalContent = ({ showType, sourceSelectedRows, ...rest }) => {
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
  const renderTags = () => {
    const { selectedRows } = rest;
    return selectedRows.length ? <TagSet {...rest} /> : null;
  };
  const { eleObj, multiple = false, selectedRows } = rest;
  const contentStyles =
    multiple && selectedRows.length ? styles.contentWrapMultiple : styles.contentWrap;
  return (
    <Fragment>
      <HeaderFilter
        sourceSelectedRows={sourceSelectedRows}
        showType={showType}
        eleObj={eleObj}
        setWrapState={rest.setWrapState}
        treeNodeType={rest.treeNodeType}
      />
      {renderTags()}
      <div className={contentStyles}>{renderContent()}</div>
    </Fragment>
  );
};
export default ModalContent;
