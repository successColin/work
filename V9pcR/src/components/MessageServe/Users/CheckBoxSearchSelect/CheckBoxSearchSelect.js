/*
 * @Author: jwk
 * @Date:   2020-07-18 11:32:39
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-14 15:58:44
 */

import { CButton, CSearch } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import { BaseContext } from '@/constants/global';
import { stringToArrayObject } from '@/utils/common';
import { Tag } from 'antd';
import classNames from 'classnames';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { ResizableBox } from 'react-resizable';
import styles from './CheckBoxSearchSelect.less';
import ModalContent from './ModalContent/ModalContent';

class CheckBoxSearchSelect extends Component {
  static contextType = BaseContext;
  static defaultProps = {
    rowKey: 'id',
    disabled: false,
    onOpen: null, // 点击搜索打开modal
    selectConfig: {
      // 选择数据配置
      keyName: 'tableName', // 选择的key字段名
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (props.fixUser.receiver !== state.inputVal) {
      let selectedRows = [],
        sourceSelectedRows = [];
      selectedRows = props.fixUser.receiver
        ? stringToArrayObject(props.fixUser.receiver, props.fixUser.receiverName, '|')
        : [];
      sourceSelectedRows = props.fixUser.receiver
        ? stringToArrayObject(props.fixUser.receiver, props.fixUser.receiverName, '|')
        : [];
      return {
        sourceSelectedRows,
        selectedRows,
        inputVal: props.fixUser.receiver,
      };
    }
    return null;
  }

  state = {
    inputVal: '', // 接收人id
    showType: 'tree', // 显示类型 list-列表 tree-树
    visible: false, // modal是否显示
    selectedRows: [], // 已选择的数据
    headerKeywords: null, // 头部搜索内容
    loadingSave: false, // 保存按钮loading
    type: '', // 用于控制数据，如果type是edit类型的，数据删除完之后不允许恢复，是其他类型的允许
  };
  // 点击确定
  handleOk = () => {
    const { selectedRows } = this.state;
    this.setState({ visible: false, sourceSelectedRows: selectedRows });
    this.props.setSelected(selectedRows);
  };
  // 点击取消
  handleCancel = callback => {
    this.setState({ visible: false, inputVal: '' });
  };
  // 点击清除
  handleClear = () => {
    this.setState({ selectedRows: [] }, () => {
      this.handleOk();
    });
  };
  // 点击搜索框，弹框出现前
  handleClickSearch = () => {
    this.setState({ visible: true });
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
    const { selectedRows = [] } = this.state;
    let newSelectedRows = [...selectedRows];
    newSelectedRows.splice(index, 1); // 将删掉的标签从数组中去除
    // console.log(newSelectedRows, 'render', 'newSelectedRows');
    this.setState({ selectedRows: newSelectedRows });
    this.props.deleteTag(newSelectedRows);
  };
  // 渲染标签
  renderTagList = () => {
    const { sourceSelectedRows = [] } = this.state;
    return sourceSelectedRows.map((item, index) => (
      <Tag key={item.id} closable={true} onClose={() => this.deleteTag(index)}>
        {item.name}
      </Tag>
    ));
  };

  render() {
    let {
      visible,
      sourceSelectedRows,
      selectedRows = [],
      showType,
      inputVal,
      loadingSave,
      headerKeywords,
    } = this.state;
    // console.log(selectedRows, 'render');
    const modalSearchCls = classNames({
      [styles.modalSearch]: true,
      [styles.showInput]: true,
    });
    // 标题
    const title = (
      <Fragment>
        <FormattedMessage id="normalSearchSelect.title" values={{ name: '人员' }} />
        {selectedRows.length ? (
          <span className={styles.subName}>
            （<FormattedMessage id="global.active.name" values={{ name: selectedRows[0].name }} />）
          </span>
        ) : null}
        <CSearch
          allowClear={false}
          className={modalSearchCls}
          onSearch={this.handleSearch}
          onChange={e => !e.target.value && this.setState({ headerKeywords: null })}
        />
      </Fragment>
    );
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
      title,
      footer,
      className: styles.modal,
    };
    if (showType === 'tree') {
      // 数据处理，如果是展示树形的，就根据实体表和id拼接处nodeKey,用于数据直接在树上勾选
      selectedRows = selectedRows.map(item => {
        return { id: item.id, name: item.name, nodeKey: `${item.id}-USER` };
      });
    }
    const contentProps = {
      showType,
      selectedRows,
      headerKeywords,
      setWrapState: this.setWrapState,
    };
    return (
      <ResizableBox
        className={styles['custom-resizable-box']}
        axis="y"
        height={64}
        minheight={64}
        resizeHandles={['se']}
      >
        <div className={`${styles.searchWrap} system__lineBorder`}>
          {
            <CButton
              onClick={this.handleClickSearch}
              className={styles.cbutton}
              type="default"
              size="small"
            >
              <span className={`${styles.addIcon} ${styles.addCommon}`}>+</span>
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

export default CheckBoxSearchSelect;
