/*
 * @Author: Fus
 * @Date:   2019-07-01 08:52:39
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-14 17:14:33
 * @Desc: 【业务框架】中使用的【标准数据选择框】，由一个InputSearch和Modal组成
 */

import { CButton, CSearch } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import { BaseContext } from '@/constants/global';
import classNames from 'classnames';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import ModalContent from './ModalContent/ModalContent';
import styles from './NormalSearchSelect.less';

class NormalSearchSelect extends Component {
  static contextType = BaseContext;
  static defaultProps = {
    eleObj: {}, // 控件对象信息
    rowKey: 'id',
    disabled: false,
    selectConfig: {
      // 选择数据配置
      isMulti: false, // 是否多选
      keyName: 'tableName', // 选择的key字段名
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      showType: 'tree', // 显示类型 list-列表 tree-树
      treeNodeType: 1, // 节点显示格式
      visible: false, // modal是否显示
      selectedRows: [], // 已选择的数据
      headerKeywords: null, // 头部搜索内容
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.inputVal) {
      // 设置已选的数据
      const { form, value, currentId, currentKey } = props;
      const selectedRows = [{ id: currentId, nodeKey: currentKey }];
      return {
        inputVal: props.value || '',
        selectedRows,
      };
    }
    return null;
  }

  // 点击确定
  handleOk = () => {
    const { selectedRows } = this.state;
    if (!selectedRows.length) return;
    this.props.setSelected(selectedRows);
    this.handleCancel();
  };
  // 点击取消
  handleCancel = () => {
    this.setState({
      visible: false,
      showType: 'tree',
      selectedRows: [],
      headerKeywords: null,
    });
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
    !isReadOnly && !disabled && this.setState({ visible: true });
  };
  handleInputChange = e => {
    const inputVal = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ inputVal });
    }
    this.triggerChange({ inputVal });
  };
  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };
  // 搜索
  handleSearch = headerKeywords => {
    // 避免相同的关键字点击多次不会走接口
    // this.setState({ headerKeywords: '' }, () => {
    this.setState({ headerKeywords });
    // });
  };
  setWrapState = (itemObj, callback) => {
    this.setState(itemObj, () => callback && callback());
  };

  render() {
    const { eleObj, isReadOnly, rowKey, disabled, type } = this.props;

    const {
      visible,
      selectedRows = [],
      showType,
      inputVal,
      loadingSave,
      headerKeywords,
      treeNodeType,
    } = this.state;
    const { displayName } = eleObj;
    const modalSearchCls = classNames({
      [styles.modalSearch]: true,
      // [styles.showInput]: !!headerKeywords,
      [styles.showInput]: true,
    });
    // 标题
    const title =
      type === 'position' ? (
        '位置'
      ) : (
        <Fragment>
          <FormattedMessage id="normalSearchSelect.title" values={{ name: displayName }} />
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
        {/*<CButton onClick={this.handleClear}>*/}
        {/*  <FormattedMessage id="global.clear" />*/}
        {/*</CButton>*/}
        <CButton onClick={this.handleCancel}>
          <FormattedMessage id="global.cancel" />
        </CButton>
        <CButton type="primary" onClick={this.handleOk} loading={loadingSave}>
          <FormattedMessage id="global.ok" />
        </CButton>
      </Fragment>
    );
    const modalProps = {
      visible,
      onCancel: this.handleCancel,
      title,
      footer,
      className: styles.modal,
    };
    const contentProps = {
      showType,
      rowKey,
      type,
      selectedRows,
      treeNodeType,
      headerKeywords,
      setWrapState: this.setWrapState,
    };
    const searchCls = classNames({
      [styles.search]: true,
      [styles.readOnly]: !!isReadOnly,
      [styles.disabled]: disabled,
      system__contentbkgd: true,
    });
    return (
      <div>
        <CSearch
          value={inputVal}
          onSearch={this.handleClickSearch}
          onChange={this.handleInputChange}
          className={searchCls}
          allowClear={false}
          disabled
        />
        <CreateModal {...modalProps}>
          <ModalContent {...contentProps} />
        </CreateModal>
      </div>
    );
  }
}

export default NormalSearchSelect;
