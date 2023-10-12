/*
 * @Author: jwk
 * @Date:   2020-07-18 11:32:39
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-24 11:54:35
 */

import { CButton } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import { BaseContext } from '@/constants/global';
import { Tag } from 'antd';
import classNames from 'classnames';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { ResizableBox } from 'react-resizable';
import styles from './CheckboxContent.less';
import ModalContent from './ModalContent/ModalContent';

class CheckboxContent extends Component {
  static contextType = BaseContext;
  static defaultProps = {
    filterMap: {}, // 过滤器信息
    getGlobalVarValues: null, // 全局变量转值函数
    rowKey: 'id',
    disabled: false,
    handleClickValue: null, // 点击值时触发（默认用于点击打开弹出面板）
    selectConfig: {
      // 选择数据配置
      keyName: 'tableName', // 选择的key字段名
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.inputVal) {
      // 设置已选的数据
      let selectedRows = [],
        sourceSelectedRows = [];
      const { value, name } = props;
      const valueArr = value && value.split(',');
      const nameArr = name && name.split(',');
      for (let i = 0; i < valueArr.length; i++) {
        const id = valueArr && valueArr[i];
        const name = nameArr && nameArr[i];
        selectedRows.push({
          id,
          name,
        });
        sourceSelectedRows.push({
          id,
          name,
        });
      }
      return {
        inputVal: props.value || '',
        selectedRows,
        sourceSelectedRows,
      };
    }
    return null;
  }

  state = {
    inputVal: '',
    valueObj: {}, // 表单该字段值对象{id: '', name: ''}
    treeNodeType: 2, // 节点显示格式
    visible: false, // modal是否显示
    selectedRows: [], // 已选择的数据
    sourceSelectedRows: [], // 源数据
    headerKeywords: null, // 头部搜索内容
    loadingSave: false, // 保存按钮loading
  };
  // 点击确定
  handleOk = () => {
    const { selectedRows } = this.state;
    const { handelChangeData, fieldId, fieldName, record, currentIndex, isTree } = this.props;
    // 没有选择数据
    console.log(selectedRows, this.props);
    if (isTree) {
      record[fieldId] = selectedRows.map(item => item.id).join(',');
      record[fieldName] = selectedRows.map(item => item.name).join(',');
      handelChangeData({
        record,
        index: currentIndex,
      });
    } else {
      handelChangeData(fieldId, selectedRows.map(item => item.id).join(','));
      handelChangeData(fieldName, selectedRows.map(item => item.name).join(','));
    }

    this.handleCancel();
  };
  // 点击取消
  handleCancel = callback => {
    this.setState(
      {
        visible: false,
        selectedRows: [],
        headerKeywords: null,
        inputVal: '',
      },
      () => {
        callback && callback();
      },
    );
  };
  // 点击清除
  handleClear = () => {
    this.setState({ selectedRows: [] }, () => {
      this.handleOk();
    });
  };
  // 点击搜索框，弹框出现前
  handleClickSearch = () => {
    const { isReadOnly, disabled } = this.props;
    if (!isReadOnly && !disabled) {
      this.setState({ visible: true });
    }
  };
  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  // 搜索
  handleSearch = headerKeywords => {
    this.setState({ headerKeywords });
  };
  // 重新更新状态
  setWrapState = (itemObj, callback) => {
    this.setState(itemObj, () => callback && callback());
  };
  // 删除标签
  deleteTag = index => {
    const { selectedRows } = this.state;
    const { handelChangeData, fieldId, fieldName, record, currentIndex, isTree } = this.props;
    const id = selectedRows.map(item => item.id);
    const name = selectedRows.map(item => item.name);
    id.splice(index, 1);
    name.splice(index, 1);
    console.log(selectedRows, this.props);
    if (isTree) {
      record[fieldId] = id.join(',');
      record[fieldName] = name.join(',');
      handelChangeData({
        key: fieldId,
        value: id.join(','),
        record,
        index: currentIndex,
      });
    } else {
      handelChangeData(fieldId, id.join(','));
      handelChangeData(fieldName, name.join(','));
    }
    this.handleCancel();
  };
  // 渲染标签
  renderTagList = () => {
    const { sourceSelectedRows = [] } = this.state;
    return sourceSelectedRows.map((item, index) => (
      <Tag key={item.id} closable onClose={() => this.deleteTag(index)}>
        {item.name}
      </Tag>
    ));
  };

  render() {
    const {
      multiple = true,
      isReadOnly,
      rowKey,
      disabled,
      handleClickValue,
      filterMap,
      getGlobalVarValues,
      valueObj = {},
      isChangeClass,
    } = this.props;
    let {
      visible,
      selectedRows = [],
      loadingSave,
      headerKeywords,
      treeNodeType,
      sourceSelectedRows,
    } = this.state;
    const modalSearchCls = classNames({
      [styles.modalSearch]: true,
      [styles.showInput]: true,
    });
    // 底部栏按钮
    const footer = (
      <Fragment>
        <CButton onClick={this.handleClear}>
          <FormattedMessage id="global.clear" />
        </CButton>
        <CButton onClick={() => this.handleCancel()}>
          <FormattedMessage id="global.cancel" />
        </CButton>
        <CButton type="primary" onClick={this.handleOk} loading={loadingSave}>
          <FormattedMessage id="global.ok" />
        </CButton>
      </Fragment>
    );
    const modalProps = {
      visible,
      onCancel: () => this.handleCancel(),
      title: '选择树图标',
      footer,
      className: styles.modal,
    };
    const contentProps = {
      rowKey,
      valueObj,
      selectedRows,
      treeNodeType,
      headerKeywords,
      filterMap,
      getGlobalVarValues,
      sourceSelectedRows,
      multiple,
      setWrapState: this.setWrapState,
    };
    const onlyLine = isChangeClass ? 'onlyLine' : '';
    return (
      <ResizableBox
        className={`${styles['custom-resizable-box']} ${onlyLine}`}
        axis="y"
        height={34}
        minheight={34}
        resizeHandles={['se']}
      >
        {/* 添加按钮 */}
        <div className={`${styles.searchWrap} system__lineBorder ${onlyLine}`}>
          {
            <CButton
              onClick={this.handleClickSearch}
              className={`${styles.cbutton} system__defaultButton`}
              type="default"
              size="small"
            >
              <span className={`${styles.addIcon} ${styles.addCommon} system__addButton--icon`}>
                +
              </span>
              <span className={styles.addCommon}>
                <FormattedMessage id="global.add.more" />
              </span>
            </CButton>
          }
          {this.renderTagList()}
        </div>
        <CreateModal {...modalProps}>
          <ModalContent {...contentProps} />
        </CreateModal>
      </ResizableBox>
    );
  }
}

export default CheckboxContent;
