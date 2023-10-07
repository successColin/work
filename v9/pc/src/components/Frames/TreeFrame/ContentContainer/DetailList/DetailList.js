/*
 * @Author: Fus
 * @Date:   2019-09-23 09:49:39
 * @Desc: 列表展示类型
 */
import { CButton, CTable } from '@/components/common/BasicWidgets';
import LabelTip from '@/components/common/LabelTip/LabelTip';
import Styles from '@/components/Frames/LeftListFrame/ContentContainer/DetailList/DetailList.less';
import { HIDE_IN_LIST_ELEMENT_TYPE } from '@/constants/element';
import { BaseContext } from '@/constants/global';
import { getCheckBoxSearchDetail, getNormalSearchDetail } from '@/services/frame';
import { parseDecimal,
  jsonParse,
  reducerVariableToArray,
  multiDataComparison } from '@/utils/common';
import { Popover, Radio, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Zmage from 'react-zmage';
import components from '../EditRow/EditRow';
import SearchQuery from '../SearchQuery/SearchQuery';
import SeniorFilter from '../SeniorFilter/SeniorFilter';
import styles from './DetailList.less';

let tableWidth = 0;

class DetailList extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.tabWrapRef = React.createRef();
    this.state = {
      popoverValue: 1,
      totalCount: {},
      BtnLine: null, // 按钮栏
      loadingSaveCustomSelectList: false, // 自定义选择框列表保存状态
      searchList: [], // 查找条件
    };
  }

  componentDidMount() {
    tableWidth = this.tabWrapRef.current.clientWidth;
    // window.addEventListener('resize', () => {
    //   tableWidth = document.getElementById('tableWrap').clientWidth;
    // });
    const {
      tabInfo: { id, calculationOperationBar },
    } = this.props;
    if (!calculationOperationBar) return;
    document
      .querySelectorAll(`.list_${id} .ant-table-body`)[0]
      .addEventListener('scroll', this.scrollCount);
  }

  componentWillUnmount() {
    const {
      tabInfo: { id, calculationOperationBar },
    } = this.props;
    if (!calculationOperationBar) return;
    if (
      document.querySelectorAll(`.list_${id} .ant-table-body`) &&
      document.querySelectorAll(`.list_${id} .ant-table-body`)[0]
    ) {
      document
        .querySelectorAll(`.list_${id} .ant-table-body`)[0]
        .removeEventListener('scroll', this.scrollCount);
    }
  }

  scrollCount = e => {
    const {
      tabInfo: { id, calculationOperationBar },
    } = this.props;
    if (!calculationOperationBar) return;
    const left = e.target.scrollLeft;
    document.querySelectorAll(`.list_${id} .list_footer_${id}`)[0].scrollLeft = left;
  };

  // 保存选择框弹出列表选中数据
  handleSaveSearchSelectRowList = () => {
    const {
      listSelectedRows,
      afterSave,
      tabInfo,
      elementMap,
      prevTabInfo,
      setPrevContainerState,
      handleSetPrevCustomSelectList,
      selectType,
    } = this.props;
    if (!listSelectedRows.length) {
      afterSave && afterSave(true);
      return;
    }
    const idObj = listSelectedRows[0].id;
    if (!idObj) return;
    this.setState({ loadingSaveCustomSelectList: true });
    if (selectType === 'radio') {
      getNormalSearchDetail({
        tabSource: tabInfo.relationTableName,
        id: idObj.id,
      }).then(
        res => {
          handleSetPrevCustomSelectList && handleSetPrevCustomSelectList([res]);
          afterSave && afterSave(false);
          this.setState({ loadingSaveCustomSelectList: false });
        },
        err => this.setState({ loadingSaveCustomSelectList: false }),
      );
    }
    if (selectType === 'checkbox') {
      getCheckBoxSearchDetail({
        tableName: tabInfo.relationTableName,
        ids: listSelectedRows.map(item => item.id.id).join(','),
      }).then(
        res => {
          handleSetPrevCustomSelectList && handleSetPrevCustomSelectList([...res]);
          afterSave && afterSave(false);
          this.setState({ loadingSaveCustomSelectList: false });
        },
        err => this.setState({ loadingSaveCustomSelectList: false }),
      );
    }
  };
  // 选择框弹出列表的按钮
  renderSearchSelectListBtn = () => {
    const { tabInfo, afterSave } = this.props;
    const { loadingSaveCustomSelectList } = this.state;
    // 选择框弹出列表
    if (tabInfo.basetype === 7) {
      return (
        <div className={styles.selectListBtnWrap}>
          <CButton className={styles.cancelBtn} onClick={() => afterSave && afterSave(false)}>
            <FormattedMessage id="global.cancel" />
          </CButton>
          <CButton
            type="primary"
            onClick={this.handleSaveSearchSelectRowList}
            loading={loadingSaveCustomSelectList}
          >
            <FormattedMessage id="global.ok" />
          </CButton>
        </div>
      );
    }
    return null;
  };
  // 点击行
  onClickRow = record => {
    const { setSelected, listSelectedRows, selectType } = this.props;
    let newSelecteds = [...listSelectedRows];
    const selectedKeys = listSelectedRows.map(item => item.id);
    const curIndex = selectedKeys.findIndex(item => item.id === record.id.id);
    if (curIndex !== -1) {
      newSelecteds.splice(curIndex, 1);
    } else {
      if (selectType === 'radio') {
        newSelecteds = [record];
      } else {
        newSelecteds.push(record);
      }
    }
    setSelected && setSelected(newSelecteds, record);
  };
  // 全选
  onClickRowAll = (record, selectedRows, changeRows) => {
    let { listSelectedRows = [], setSelected } = this.props;
    const arr = [...listSelectedRows];
    // if (record) {
    changeRows.forEach(obj => {
      if (record) {
        if (!arr.find(item => item.id.id === obj.id.id)) {
          arr.push(obj);
        }
      } else {
        if (arr.find(item => item.id.id === obj.id.id)) {
          arr.splice(arr.findIndex(item => item.id.id === obj.id.id), 1);
        }
      }
    });
    setSelected(arr);
  };

  // 获取列名
  getColumns = () => {
    const { elementMap, tabInfo, getGlobalVarValues } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    const filteredElementList = elementList.filter(
      item => !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype) && item.visiabled,
    );
    let widthTotal = 60; // 选择列的宽度
    const columns = filteredElementList.map((eleObj, index) => {
      const { id, displayName, columnSpan } = eleObj;
      // 默认取15%
      let colWidth = columnSpan <= 100 ? 115 : columnSpan;
      const width =tableWidth * ((colWidth % 100) / 100);
      widthTotal += width;
      return {
        title: displayName,
        dataIndex: id,
        width,
        render: (text = {}, record) => {
          const { relationTabId, defaultValue, basetype, elementFormat } = eleObj;
          const content =
            text.name ||
            getGlobalVarValues({
              varName: defaultValue,
              type: 'defaultValue',
              eleObj,
              listActiveRowData: record,
            });
          const renderContent = <span title={content}>{content}</span>;
          // 有关联弹出面板的控件
          if (relationTabId) {
            return (
              <a onClick={() => this.props.setPopupTabInfo({ eleObj, listRowData: record })}>
                {renderContent}
              </a>
            );
          }
          // 图片base64的直接在列表中展示
          if (basetype === 8 && elementFormat === 2 && text.id) {
            const url = text.id;
            const splitIndex = url.indexOf('_');
            const fileUrl = url.substring(splitIndex + 1, url.length);
            return (
              <div className={styles.imgWrap}>
                <Zmage style={{ width: '100%' }} src={fileUrl} />
              </div>
            );
          }
          return renderContent;
        },
      };
    });

    return { columns, widthTotal };
  };
  getColumns = () => {
    const { elementMap, tabInfo, getGlobalVarValues } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    // const filteredElementList = elementList.filter(item => !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype) && item.visiabled);
    let filteredElementList =
      elementList.filter(item => {
        return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype) && item.visiabled;
      }) || [];
    let widthTotal = 60; // 选择列的宽度
    const columns = filteredElementList.map((eleObj, index) => {
      const { id, displayName, columnSpan } = eleObj;
      // 默认取15%
      let colWidth = columnSpan <= 100 ? 115 : columnSpan;
      const width = Math.ceil(tableWidth * ((colWidth % 100) / 100));
      // const width = (columnSpan > 100 && index !== filteredElementList.length - 1) ? `${columnSpan % 100}%` : '';
      widthTotal += width;
      return {
        title: displayName,
        dataIndex: id,
        key: id,
        width,
        render: (text = {}, record, index) => {
          const { relationTabId, defaultValue, basetype, elementFormat, readonly } = eleObj;
          const content =
            text.name ||
            getGlobalVarValues({
              varName: defaultValue,
              type: 'defaultValue',
              eleObj,
              listActiveRowData: record,
            });
          const renderContent = <span title={content}>{content}</span>;
          // 有关联弹出面板的控件
          if (relationTabId) {
            return (
              <a onClick={() => this.props.setPopupTabInfo({ eleObj, listRowData: record })}>
                {renderContent}
              </a>
            );
          }
          // 图片base64的直接在列表中展示
          if (basetype === 8 && elementFormat === 2 && text.id) {
            const url = text.id;
            const splitIndex = url.indexOf('_');
            const fileUrl = url.substring(splitIndex + 1, url.length);
            return (
              <div className={styles.imgWrap}>
                <Zmage style={{ width: '100%' }} src={fileUrl} />
              </div>
            );
          }
          return renderContent;
        },
      };
    });
    let multiJumpBtn = elementList.find(item => item.basetype === 43 && item.visiabled); // 多菜单跳转
    let multiTabBtn = elementList.find(item => item.basetype === 44 && item.visiabled); // 多面板跳转
    const { multiJump, multiTabJump } = this.props;
    let btnColums = {
      title: <FormattedMessage id="global.operator" />,
      dataIndex: 'operatorcheck',
      key: 'operatorcheck',
      width: 300,
      render: (text, record) => {
        return (
          <div className="custom-color">
            {!!multiJumpBtn && (
              <span
                className={styles.columsSpan}
                onClick={() => {
                  multiJump(multiJumpBtn, record);
                }}
              >
                {multiJumpBtn.displayName}{' '}
              </span>
            )}
            {!!multiTabBtn && (
              <span
                className={styles.columsSpan}
                onClick={() => {
                  multiTabJump(multiTabBtn, record);
                }}
              >
                {multiTabBtn.displayName}{' '}
              </span>
            )}
          </div>
        );
      },
    };
    if (!multiJumpBtn && !multiTabBtn) return { columns, widthTotal };
    columns.push(btnColums);
    widthTotal += 400;
    return { columns, widthTotal };
  };

  // 解析条件
  getConditions = ({record, tableColumes, conditionjsonconfig}) => {
    if (!conditionjsonconfig) return {};
    let obj = {};
    try {
      const arr = JSON.parse(conditionjsonconfig);
      for (let n = 0; n < arr.length; n++) {
        const { preconditions, ...rest } = arr[n];
        if (!preconditions) {
          return rest;
        }
        let normalArr = jsonParse(preconditions, 'array') || [];
        const { userInfo } = this.props;
        let newCondition = reducerVariableToArray(normalArr, record, tableColumes, 'tree', userInfo);
        if (multiDataComparison(newCondition)) {
          return rest;
        }
      }
    } catch (e) {
      obj = {};
    }
    return obj;
  }

  // 获取可编辑列名
  getEditColumns = () => {
    const { elementMap, tabInfo, getGlobalVarValues, functionData } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    const { canmodify } = functionData.attributes;
    let elementArr =  elementList.filter(item => {
      return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype);
    }) || [];
    let filteredElementList =
      elementArr.filter(item => {
        return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype) && item.visiabled;
      }) || [];
    let widthTotal = 0; // 选择列的宽度
    const columns = filteredElementList.map((eleObj, index) => {
      const { id, displayName, columnSpan, readonly } = eleObj;
      // 默认取15%
      let colWidth = columnSpan <= 100 ? 115 : columnSpan;
      const width = tableWidth * ((colWidth % 100) / 100);
      widthTotal += width;
      return {
        title:
          tabInfo.canLineEdit === 1 && !!!readonly ? (
            <span>
              <span className="custom-color iconEdit iconfont" />
              <LabelTip eleObj={eleObj} />
            </span>
          ) : (
            <LabelTip eleObj={eleObj} />
          ),
        dataIndex: id,
        key: id,
        width,
        eleObj,
        editable: tabInfo.canLineEdit === 1 && !!!readonly,
        render: (text = {}, record, index) => {
          const {
            jumpMenuList,
            jumpType,
            relationTabId,
            defaultValue,
            basetype,
            elementFormat,
            readonly,
            conditionjsonconfig
          } = eleObj;
          const obj = this.getConditions({record, tableColumes:elementArr, conditionjsonconfig});
          const { color: resultColor, bgColor} = obj;
          const resultStyles = {
            color: resultColor,
            backgroundColor: bgColor,
            padding: bgColor ? '0 5px' : 0,
          }
          let content =
            text.name ||
            getGlobalVarValues({
              varName: defaultValue,
              type: 'defaultValue',
              eleObj,
              listActiveRowData: record,
            });
          content = parseDecimal(content + '');
          const color = (record[id] && record[id].color) || '';
          const renderContent = (
            <div style={{ width: width }} className={styles.contentClass}>
              {!!color && <span className={styles.stateClass} style={{ backgroundColor: color }} />}
              <span className={styles.contentTitle} title={content} style={{...resultStyles}}>{content}</span>
            </div>
          );
          // 有关联弹出面板的控件
          if (
            (relationTabId && (jumpType === 1 || !jumpType)) ||
            (jumpType === 2 && !!jumpMenuList && jumpMenuList.length)
          ) {
            return (
              <a onClick={() => this.props.setPopupTabInfo({ eleObj, listRowData: record })}>
                {renderContent}
              </a>
            );
          }
          // 图片base64的直接在列表中展示
          if (basetype === 8 && elementFormat === 2 && text.id) {
            const url = text.id;
            const splitIndex = url.indexOf('_');
            const fileUrl = url.substring(splitIndex + 1, url.length);
            return (
              <div className={styles.imgWrap}>
                <Zmage style={{ width: '100%' }} src={fileUrl} />
              </div>
            );
          }
          return renderContent;
        },
      };
    });
    let multiJumpBtn = elementList.find(item => item.basetype === 43); // 多菜单跳转
    let multiTabBtn = elementList.find(item => item.basetype === 44); // 多面板
    let saveBtn = elementList.find(item => item.basetype === 7);
    const { multiJump, multiTabJump, saveInListBtn } = this.props;
    let btnColums = {
      title: <FormattedMessage id="global.operator" />,
      dataIndex: 'operatorcheck',
      key: 'operatorcheck',
      width: tabInfo.canLineEdit === 1 ? 120 : 100,
      render: (text, record) => {
        return (
          <div className="custom-color">
            {canmodify && !!multiJumpBtn ? (
              <Tooltip placement="leftTop" title={multiJumpBtn.displayName}>
                <span
                  className={`${Styles.columsSpan} iconfont icon-multiJumpBtn`}
                  onClick={() => {
                    multiJump(multiJumpBtn, record);
                  }}
                >
                  {' '}
                </span>
              </Tooltip>
            ) : null}
            {canmodify && !!multiTabBtn ? (
              <Tooltip placement="leftTop" title={multiTabBtn.displayName}>
                <span
                  className={`${Styles.columsSpan} iconfont icon-multiTabBtn`}
                  onClick={() => {
                    multiTabJump(multiTabBtn, record);
                  }}
                >
                  {' '}
                </span>
              </Tooltip>
            ) : null}
            {tabInfo.canLineEdit === 1 && canmodify && !!saveBtn && record[saveBtn.id] ? (
              <Tooltip placement="leftTop" title={saveBtn.displayName}>
                <span
                  className={`${Styles.columsSpan} iconfont icon-saveBtn`}
                  onClick={() => {
                    saveInListBtn(saveBtn, record);
                  }}
                />
              </Tooltip>
            ) : null}
          </div>
        );
      },
    };
    if (!saveBtn && !multiJumpBtn && !multiTabBtn) return { columns, widthTotal };
    columns.push(btnColums);
    widthTotal += 120;
    return { columns, widthTotal };
  };
  // 状态更新
  updataState = (obj = {}, callback) => {
    this.setState(
      {
        ...obj,
      },
      () => {
        if (callback) {
          callback();
        }
      },
    );
  };
  // 重置模糊查询的数据
  doRestSearchList = () => {
    this.updataState({ searchList: [] });
  };
  handllePopoverVisible = (v, obj) => {
    // Popover显示隐藏都要更新选择状态
    this.setState({ popoverValue: 1 });
  };
  onChange = (e, id) => {
    const { elementComputedObj } = this.props;
    const { dispatch } = this.context;
    dispatch({
      type: 'listCalculation/updateState',
      payload: {
        elementComputedObj: {
          ...elementComputedObj,
          [id]: e.target.value,
        },
      },
    });
  };
  handleCount = (t, eleObj) => {
    const { id } = eleObj;
    const { popoverValue, totalCount } = this.state;
    const { listSelectedRows = [], listDataObj, elementComputedObj } = this.props;
    let datalist = new Object(listDataObj).datalist;
    const getCount = (total, dataSource) =>
      dataSource.reduce((total, item) => {
        // 求和
        const v = (item[`${id}`] && item[`${id}`].name) || undefined;
        const n = Number(v);
        if (!isNaN(n)) return parseFloat((total + n).toFixed(10));
        return total;
      }, 0);
    const numberArray = dataSource =>
      dataSource.map(item => {
        const v = (item[`${id}`] && item[`${id}`].name) || undefined;
        const n = Number(v);
        if (!isNaN(n)) return n;
        return 0;
      });
    if (datalist.length) {
      // 全部
      let result = null,
        name = null;
      const isTrue = elementComputedObj[id] !== 2;
      if (t === 1) {
        // 求和
        result = getCount(0, isTrue ? datalist : listSelectedRows);
        name = '求和：';
      }
      if (t === 2) {
        // 求和
        const count = getCount(0, isTrue ? datalist : listSelectedRows);
        const n = isTrue ? datalist.length : listSelectedRows.length;
        result = n ? (count / n).toFixed(2) : 0;
        name = '平均值：';
      }
      if (t === 3) {
        const arr = numberArray(isTrue ? datalist : listSelectedRows);
        result = arr.length ? Math.max(...arr) : 0;
        name = '最大值：';
      }
      if (t === 4) {
        const arr = numberArray(isTrue ? datalist : listSelectedRows);
        result = arr.length ? Math.min(...arr) : 0;
        name = '最小值：';
      }
      this.setState({
        totalCount: {
          ...totalCount,
          [id]: {
            name,
            result: parseDecimal(result) || result,
          },
        },
      });
    }
  };
  renderFooter = (newColumns = [], widthTotal) => {
    const { tabInfo } = this.props;
    const {
      tabInfo: { calculationOperationBar, showcolumnselectionbox },
      elementComputedObj,
    } = this.props;
    if (!calculationOperationBar) return null;
    const { totalCount } = this.state;
    const dom = newColumns.map(item => {
      const { eleObj, width } = item;
      if (!eleObj) return '';
      const { id } = eleObj;
      if (!id) return;
      const content = (
        <div style={{ width: '180px' }}>
          <p style={{ color: '#9e9e9e', fontSize: '12px', padding: '15px 10px 5px 10px' }}>
            选择统计方式
          </p>
          <div className={Styles.countSelectWrap}>
            <Radio.Group
              onChange={(e) => this.onChange(e, id)}
              value={elementComputedObj[id] || 1}
            >
              <Radio value={1}>全部</Radio>
              <Radio value={2}>选中数据</Radio>
            </Radio.Group>
          </div>
          <p className={Styles.countItem} onClick={() => this.handleCount(1, eleObj)}>
            求和
          </p>
          <p className={Styles.countItem} onClick={() => this.handleCount(2, eleObj)}>
            平均值
          </p>
          <p className={Styles.countItem} onClick={() => this.handleCount(3, eleObj)}>
            最大值
          </p>
          <p className={Styles.countItem} onClick={() => this.handleCount(4, eleObj)}>
            最小值
          </p>
        </div>
      );
      return (
        <Popover
          content={content}
          trigger="click"
          key={item.dataIndex}
          getPopupContainer={() => document.getElementById('main-container')}
        >
          <div style={{ width: width + 6 }} key={item.dataIndex}>
            <span style={{ color: '#9e9e9e' }}>{totalCount[id] && totalCount[id].name}</span>
            {totalCount[id] && totalCount[id].result}
          </div>
        </Popover>
      );
    });
    return (
      <div
        className={`${Styles.tableFooterWrap} list_footer_${tabInfo.id}`}
        style={!showcolumnselectionbox ? { padding: '0 0 0 6px' } : {}}
      >
        <div style={{ width: `${widthTotal}px` }} className={Styles.tableFooter}>
          {dom}
        </div>
      </div>
    );
  };

  chooseMuchCancleFun = () => {
    const { setContainerState } = this.props;
    setContainerState({
      listSelectedRows: [],
    });
  };

  render() {
    const {
      pageSizeOptions,
      tabDropDownData,
      userInfo,
      treeNodeData,
      tabList,
      triggerMap,
      fromType,
      elementMap,
      tabInfo,
      fetchListData,
      loading,
      listQueryParams,
      listSelectedRows,
      BtnLine,
      selectType = 'checkbox',
      setContainerState,
      setSelected,
      listDataObj,
      filterMap,
    } = this.props;
    const { visiblePopup, searchList } = this.state;
    const selectedRowKeys = listSelectedRows.map(item => item.id);
    const { total = 0 } = listDataObj;
    const { pageNum, pageSize } = listQueryParams;
    const elementList = elementMap[tabInfo.id] || [];
    // let dataSource = this.reduceDataSource() || [];
    let dataSource = listDataObj.datalist || [];
    const rowSelection = {
      type: selectType,
      selectedRowKeys: selectedRowKeys.map(item => item.id),
      // onSelectAll: (selected, selectedRows) => {
      //   setSelected && setSelected(selectedRows);
      // },
      onSelectAll: (record, selectedRows, changeRows, nativeEvent) => {
        this.onClickRowAll(record, selectedRows, changeRows);
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRow(record);
      },
      // onChange: (record, selected, selectedRows, nativeEvent) => {
      //   console.log(record, selected, selectedRows, nativeEvent,'record2')
      //   this.onClickRow(record);
      // },
    };
    const pagination = {
      total,
      current: pageNum,
      pageSize,
      onChange: (pageNum, newPageSize) => {
        // this.props.setSelected && this.props.setSelected([]);
        this.props.setContainerState(
          {
            listQueryParams: {
              ...listQueryParams,
              pageNum,
              pageSize: newPageSize,
            },
          },
          () => {
            fetchListData({ searchQueryList: searchList });
          },
        );
      },
      pageSizeOptions,
    };
    const quickQueryLen = elementList.filter(item => item.quickQuery).length;
    const searchBox = elementList.find(item => item.basetype === 14) || {}; // 模糊搜索框
    const seniorFilterEle = elementList.find(item => item.basetype === 33) || {}; // 高级筛选
    const hasSearchQuery = !!(quickQueryLen && searchBox && searchBox.visiabled);
    const hasSeniorFilter = !!(seniorFilterEle && seniorFilterEle.visiabled);
    const { calculationOperationBar, showcolumnselectionbox } = tabInfo;
    const tableCls = classNames({
      [styles.table1]: !calculationOperationBar,
      [styles.positonLeftClass]: fromType === 'inPopup' && rowSelection && rowSelection.selectedRowKeys.length === 0,
      [styles.positonCenterClass]: tabInfo.basetype === 7 && fromType === 'inPopup' && rowSelection && rowSelection.selectedRowKeys.length > 0,
      [styles.table]: !!calculationOperationBar,
      [styles.normalTableCls]: !showcolumnselectionbox,
      [styles[fromType]]: true,
      [this.props.tableCls]: !!this.props.tableCls,
      [styles.hasSearchQuery]: hasSearchQuery || hasSeniorFilter,
      [styles.searchSelectList]: tabInfo.basetype === 7,
      [styles.radioTableCls]: selectType === 'radio' && showcolumnselectionbox,
    });
    const headerCls = classNames({
      [styles.headerWrap]: true,
      [styles.hasSearchQuery]: hasSearchQuery || hasSeniorFilter,
      'system__button--top': true,
    });
    const columnsData = this.getEditColumns() || [];
    let { columns, widthTotal } = columnsData;
    let idobj = elementList.find(item => item.relationColumnName === 'id'); // id控件
    const cellProps = {
      ...this.props,
      tabinfo: tabInfo,
      elementmap: elementMap,
      userinfo: userInfo,
      activetreenode: treeNodeData,
      tablist: tabList,
      triggermap: triggerMap,
    }; // 行编辑的props
    const newColumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          ...cellProps,
          record,
          editable: col.editable,
          dataindex: col.dataIndex,
          title: col.title,
          updatastate: this.props.setContainerState,
          formdata: listDataObj,
          idobj: idobj,
          eleobj: col.eleObj,
          tabdropdowndata: tabDropDownData,
        }),
      };
    });
    return (
      <div ref={this.tabWrapRef} className={`list_${tabInfo.id} ${styles.wrap}`}>
        <div className={headerCls}>
          {BtnLine && BtnLine}
          {hasSearchQuery && (
            <div className={styles.queryLine}>
              <SearchQuery
                listQueryParams={listQueryParams}
                elementList={elementList}
                updataState={this.updataState}
                fetchListData={fetchListData}
                setContainerState={setContainerState}
              />
            </div>
          )}
          {hasSeniorFilter && (
            <div className={styles.queryLine}>
              <SeniorFilter
                entryEleObj={seniorFilterEle}
                elementList={elementList}
                filterMap={filterMap}
                fetchListData={fetchListData}
                pageSize={pageSize}
                setContainerState={setContainerState}
                restSearchParams={this.doRestSearchList}
              />
            </div>
          )}
        </div>
        <CTable
          className={tableCls}
          columns={newColumns}
          components={components}
          dataSource={dataSource}
          rowSelection={showcolumnselectionbox ? rowSelection : null}
          pagination={pagination}
          onClickRow={tabInfo.canLineEdit === 1 ? null : this.onClickRow}
          loading={loading}
          scroll={{ x: widthTotal, y: 100 }}
          rowKey={record => record.id && record.id.id}
          footer={calculationOperationBar ? () => this.renderFooter(newColumns, widthTotal) : null}
        />

        {/* showcolumnselectionbox ? rowSelection  */}
        {rowSelection && rowSelection.selectedRowKeys.length > 0 && (
          <div className={styles.chooseMuch}>
            已选 {rowSelection.selectedRowKeys.length} 项
            <span className={styles.chooseMuch__cancle} onClick={() => this.chooseMuchCancleFun()}>
              取消
            </span>
          </div>
        )}
        {this.renderSearchSelectListBtn()}
      </div>
    );
  }
}

export default DetailList;
