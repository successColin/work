/*
 * @Author: Fus
 * @Date:   2019-08-06 10:30:44
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-18 11:03:45
 * @Desc: 搜索选择框的内容容器
 */
import { Fragment } from 'react';
import ContentList from '../ContentList/ContentList';
import styles from './ModalContent.less';
import TagSet from './TagSet/TagSet';

const ModalContent = ({ sourceSelectedRows, ...rest }) => {
  const renderTags = () => {
    const { selectedRows } = rest;
    return selectedRows.length ? <TagSet {...rest} /> : null;
  };
  const { eleObj, multiple = false, selectedRows } = rest;
  const contentStyles =
    multiple && selectedRows.length ? styles.contentWrapMultiple : styles.contentWrap;
  return (
    <Fragment>
      {renderTags()}
      <div className={contentStyles}>
        <ContentList {...rest} />
      </div>
    </Fragment>
  );
};
export default ModalContent;
