/*
 * @Author: Fus
 * @Date:   2019-09-16 09:43:32
 * @Desc: 界面配置
 */
import { CSpin } from '@/components/common/BasicWidgets';
import { Tree } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import styles from './FileDownload.less';
// import {
//   getRelationFiles
// } from '@/services/relationFileTab';
const { TreeNode } = Tree;

@connect(state => ({
  bundleConfig: state.bundleConfig,
}))
class FileDownload extends Component {
  // 树节点
  renderTreeNodes = data => {
    console.log(data);
    return data.map(item => {
      const { fileType } = item;
      // 节点前缀图标样式
      const isGroup = fileType === 1;
      const nodeIconCls = classNames({
        iconfont: true,
        'icon-file-yellow': isGroup, // 组图标
        'icon-export-docx': !isGroup, // 非组图标
        [styles.groupIcon]: isGroup,
        [styles.nogroupIcon]: !isGroup,
      });
      const nodeProps = {
        title: item.title,
        dataRef: item,
        icon: <span className={nodeIconCls} />,
        ...item,
      };
      if (item.childList) {
        return (
          <TreeNode key={item.key} {...nodeProps}>
            {this.renderTreeNodes(item.childList)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...nodeProps} />;
    });
  };

  onSelectNode = e => {
    console.log(e);
    const { setStatus, expandedKeys } = this.props;
    const value = String(e.node.props.dataRef.key);
    let arr = [...expandedKeys];
    if (arr.indexOf(value) !== -1) {
      arr = arr.filter(item => {
        return item !== value;
      });
    } else {
      arr.push(value);
    }
    setStatus({
      expandedKeys: arr,
    });
  };

  render() {
    const { treeData, treeLoading, expandedKeys, onCheckNode } = this.props;
    console.log(treeData);
    return (
      <div className={`${styles.wrap} system__lineBorder`}>
        <CSpin spinning={treeLoading}>
          <Tree
            showIcon
            checkable={true}
            blockNode={true}
            onSelect={(selectedKeys, e) => this.onSelectNode(e)}
            onCheck={(selectedKeys, e) => onCheckNode(e)}
            onExpand={(expandedKeys, e) => this.onSelectNode(e)}
            expandedKeys={expandedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </CSpin>
      </div>
    );
  }
}
export default FileDownload;
