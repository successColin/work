/*
 * @Author: Fus
 * @Date:   2019-09-04 14:06:40
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-03-16 10:53:41
 * @Desc: 标准数据选择框的树组件
 */
import { Component } from 'react';
import { Tree } from 'antd';
import classNames from 'classnames';
import { CSpin } from '@/components/common/BasicWidgets';
import { getUserGroup } from '@/services/userManager';
import styles from './ContentTree.less';

const { TreeNode } = Tree;

class ContentTree extends Component {
  static defaultProps = {
    eleObj: {}, // 控件对象
  };
  state = {
    treeData: [], // 树数据
    // firstLoad: true, // 是否为第一次加载且默认展开第一个节点
    expandedKeys: [], // 展开的节点
    selectedKeys: [],
    loadedKeys: [], // 异步已加载的节点
    // activeNode: {}, // 当前节点TreeNode
    activeNodeData: {}, // 当前节点数据
    loading: false, // 加载状态
    loadingParents: false, // 加载父节点
    keyWords: '', // 关键字
    parentsNodeKeys: [], // 已选数据的所有父节点key
  };

  static getDerivedStateFromProps(props, state) {
    // 关键字搜索
    if (props.headerKeywords !== state.keyWords) {
      return {
        keyWords: props.headerKeywords,
      };
    }
    // // 默认展开第一个节点
    // if (state.treeData.length && state.expandedKeys.length === 0 && state.firstLoad) {
    //   return {
    //     expandedKeys: [state.treeData[0].nodeKey],
    //     firstLoad: false,
    //   };
    // }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.keyWords !== this.state.keyWords) {
      this.setState({ loading: true });
      this.fetchTree({ isRoot: true });
    }
  }

  componentDidMount() {
    const { valueObj, multiple = false } = this.props;
    this.setState({ loading: true });
    this.fetchTree({ isRoot: true });
  }


  // 获取已选数据的父节点数据
  doLoopFetchNode = ({
                       levelNodeList = [],
                     }) => {
    const { expandedKeys, parentsNodeKeys } = this.state;
    const parentsLen = parentsNodeKeys.length;
    const targetNodeKey = parentsNodeKeys.find(key => !expandedKeys.includes(key));
    const targetNode = levelNodeList.find(item => item.nodeKey === targetNodeKey);
    if (!levelNodeList.length || (!targetNodeKey && !targetNode)) {
      this.setState({ loadingParents: false });
      return;
    }
    // 当前父节点不在树上，跳过，执行下一个父节点
    if (targetNodeKey && !targetNode) {
      this.setState({ expandedKeys: [...expandedKeys, targetNodeKey] }, () => {
        this.doLoopFetchNode({
          levelNodeList,
        });
      });
      return;
    }
    // 当前节点为已选节点
    if (targetNodeKey === parentsNodeKeys[parentsLen - 1]) {
      const { setWrapState } = this.props;
      setWrapState({ selectedRows: [targetNode] });
      this.setState({ loadingParents: false });
      return;
    }
    this.handleLoadData(targetNode, ({ levelNodeList: nodeList }) => {
      this.doLoopFetchNode({
        levelNodeList: nodeList,
      });
    });
  };
  // 获取树单节点数据
  fetchTree = ({ isRoot = false, treeNodeData = {}, callback }) => {
    const { keyWords: keywords } = this.state;
    const { isGroup, id, type } = treeNodeData;

    let params = keywords ? { keywords } : { groupId: 0, rootpath: '' };
    // 搜索时使用全树
    getUserGroup(params).then(res => {
      let newTreeData = res;
      // 搜索时使用全树
      const expandedKeys = keywords && this.getSearchNodeKey(res);
      this.setState({
        treeData: newTreeData,
        loading: false,
        expandedKeys: keywords ? this.getSearchNodeKey(res) : [],
      });
    }, err => {
    });
  };
  // 搜索结果所有节点打开
  getSearchNodeKey = (treeData) => {
    const expandedKeys = [];
    const loopGetNodeKey = dataList => {
      dataList.forEach(item => {
        expandedKeys.push(item.nodeKey);
        if (item.children) {
          loopGetNodeKey(item.children);
        }
      });
    };
    loopGetNodeKey(treeData);
    return expandedKeys;
  };
  // 展开、折叠节点
  handleExpand = (nodeData) => {
    const { expandedKeys, keyWords } = this.state;
    const activeExpandKeyId = nodeData.nodeKey;
    const activeExpandKeyIndex = expandedKeys.indexOf(activeExpandKeyId);
    let newExpandKeys = [...expandedKeys];
    if (activeExpandKeyIndex === -1) {
      newExpandKeys.push(activeExpandKeyId);
    } else {
      newExpandKeys.splice(activeExpandKeyIndex, 1);
    }
    this.setState({
      expandedKeys: newExpandKeys,
      activeNodeData: nodeData,
    }, () => {
      // (!nodeData.children || !nodeData.children.length) && !keyWords && this.handleLoadData(node);
    });
  };
  // 选择节点
  handleSelectNode = (e, needExpand = true) => {
    // 设置复选框选中状态(只允许选中非组节点)
    const isChecked = e.selected || e.checked;
    const { setWrapState, multiple = true, selectedRows } = this.props;
    const { node } = e;
    const { nodeData } = node.props;
    let newSelectedKeys = [...selectedRows];
    if (!nodeData.isGroup) {
      if (multiple) {
        let index = newSelectedKeys.findIndex(item => item.nodeKey === nodeData.nodeKey);
        if (index !== -1) {
          newSelectedKeys.splice(index, 1);
        } else {
          newSelectedKeys.push(nodeData);
        }
        setWrapState({ selectedRows: newSelectedKeys, type: 'edit' });
      } else {
        setWrapState({ selectedRows: isChecked ? [nodeData] : [] });
      }
    }
    needExpand && this.handleExpand(nodeData);
  };
  // 单个树节点获取数据
  handleLoadData = (treeNode = {}, callback) => {
    const { keyWords, loadedKeys, expandedKeys } = this.state;
    // const { nodeData } = treeNode.props;
    const { nodeKey } = treeNode;
    return new Promise(resolve => {
      if (keyWords || treeNode.props.children) {
        resolve();
        return;
      }
      const { isGroup, id, rootpath } = treeNode.props.nodeData;
      let params = isGroup ? { groupId: id, rootpath } : { rootId: id, rootpath };
      getUserGroup(params).then(res => {
        treeNode.props.nodeData.children = res;
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      });
    });
  };
  // 遍历生成树节点
  loopNode = (data) => {
    const { keyWords } = this.state;
    const { treeNodeType } = this.props;
    return data && data.map(item => {
      const {
        isGroup,
        rootpath, // 显示层级结构 （/A1/B1 ）
        name,
        nodeKey,
        childCount,
        children = [],
        keyCode = '',
      } = item;
      const level = rootpath && rootpath.match(/\//g).length || 1;
      // 节点前缀图标样式
      const nodeIconCls = classNames({
        [styles.elementIcon]: !!!isGroup,
        'iconfont': true,
        'icon-file': !!isGroup, // 组图标
        'icon-line-tree': !!!isGroup, // 非组图标
      });
      // 节点样式
      const nodeCls = classNames({
        [styles.groupTit]: !!isGroup,
        [styles.eleTit]: !!!isGroup,
        [styles[`level-${level}`]]: true,
      });
      // 节点名称格式
      const nodeName = (function() {
        switch (treeNodeType) {
          case 1:
            return name;
          case 2:
            return `${keyCode}_${name}`;
          case 3:
            return `${name}_${keyCode}`;
          case 4:
            return keyCode;
          default:
            return name;
        }
      }());
      const nodeProps = {
        className: nodeCls,
        title: <span title={nodeName}>{nodeName}</span>,
        icon: <span className={nodeIconCls}/>,
        nodeData: item,
        checkable: !isGroup, // 只有非组时可以选择
        isLeaf: (keyWords && children) ? !children.length : !childCount,
      };
      if (children) {
        return (
          <TreeNode key={nodeKey} {...nodeProps}>
            {children && this.loopNode(children)}
          </TreeNode>
        );
      }
      return <TreeNode key={nodeKey} {...nodeProps} />;
    });
  };

  render() {
    const { loading, expandedKeys, treeData, loadedKeys, loadingParents } = this.state;
    const { selectedRows = [], eleObj = {} } = this.props;
    const { mainTableName = '' } = eleObj;
    const checkedKeys = selectedRows.map(item => item.nodeKey);
    return (
      <div className={styles.wrap}>
        <CSpin spinning={loading || loadingParents}>
          <Tree
            showIcon
            checkable={true}
            checkStrictly={true}
            // blockNode={true}
            className={styles.treeWrap}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            defaultExpandAll={true}
            onExpand={(expandedKeys, { expanded, node }) => this.handleExpand(node.props.nodeData)}
            onSelect={(selectedKeys, e) => this.handleSelectNode(e)}
            onCheck={(checkedKeys, e) => this.handleSelectNode(e, false)}
            loadData={this.handleLoadData}
            loadedKeys={loadedKeys}
          >
            {this.loopNode(treeData)}
          </Tree>
        </CSpin>
      </div>
    );
  }
}

export default ContentTree;
