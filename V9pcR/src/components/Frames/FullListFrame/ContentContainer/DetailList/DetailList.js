import { CSearch, NormalSearchSelect } from '@/components/common/BasicWidgets';
import CMessage from '@/components/common/BasicWidgets/Widgets/CMessage/CMessage';
import CTable from '@/components/common/BasicWidgets/Widgets/CTable/CTable';
import LabelTip from '@/components/common/LabelTip/LabelTip';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import DataSelectList from '@/components/Frames/LeftListFrame/ContentContainer/DataSelectList/NormalSearchSelect';
import { arrayClassify, reduceArrObj } from '@/components/Frames/LeftListFrame/method';
import SeniorFilter from '@/components/Frames/TreeFrame/ContentContainer/SeniorFilter/SeniorFilter';
import {
  BASETYPE_IN_EDIT_COL,
  BTN_ELEMENT_TYPE,
  BTN_IN_EDIT_LIST,
  BTN_IN_LIST_COL,
  HIDE_IN_LIST_ELEMENT_TYPE,
  NO_SUBMIT_ELEMENT_TYPE,
  NUMBER_COLUMN_TYPE,
  SEARCH_SELECT_TYPE,
  SELECT_IN_LIST,
  TIME_FORMATE_TYPES,
} from '@/constants/element';
import { BaseContext, SPECIAL_CHARACTERS } from '@/constants/global';
import { getCheckBoxSearchDetail, getNormalSearchDetail } from '@/services/frame';
import { del, getList, handleSave, updateMore } from '@/services/leftListFrame';
import {
  compoundArithmetic,
  getDefaultConfirmProps,
  getValueFromGlobalVariables,
  matchGlobalFunctionParam,
  parseDecimal,
  validTriggerMatch,
  jsonParse,
  reducerVariableToArray,
  multiDataComparison,
  stringToArrayObject,
} from '@/utils/common';
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popover,
  Radio,
  Row,
  Select,
  Tooltip,
  Tag, Pagination,
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Zmage from 'react-zmage';
import Styles from './DetailList.less';

const InputGroup = Input.Group;
const { Option } = Select;
const initQueryParams = {
  pageNum: 1,
  pageSize: 10,
};
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

// 编辑单元格
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = (eleObj = '') => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        // todo 后续可以做级联操作
        // eleObj 能获取都对应的控件信息，更新控件是下拉框并且是级联的条件进行请求接口获取数据
        if (eleObj && SELECT_IN_LIST.concat([1, 10]).includes(eleObj.basetype)) {
          this.input.focus();
        }
      }
    });
  };
  // 获取某行中某列的字段
  getValueFromCurrentTableColumn = (varName, record) => {
    if (!varName) return varName;
    const { tabInfo, elementMap, userInfo, activeTreeNode, tabList } = this.props;
    const elementList = elementMap[tabInfo.id];
    if (
      getValueFromGlobalVariables({
        globalVar: varName,
        userInfo,
      })
    ) {
      return getValueFromGlobalVariables({
        globalVar: varName,
        userInfo,
      });
    }
    // 加减乘除四则混合运算@@CompoundArithmetic
    if (varName.indexOf('@@CompoundArithmetic') > -1) {
      return compoundArithmetic({
        asqValue: varName,
        getValueFromCurrentTabData: this.getValueFromCurrentTableColumn,
        CMessage,
        otherParams: { varName, record, type: 'listEidt' },
      });
    }
    let currentEle = elementList && elementList.find(item => item.parameter === varName);
    if (!currentEle) return varName;
    const { valueFieldType } = currentEle;
    const lastData = JSON.parse(record[currentEle.id]);

    if (valueFieldType === 2) {
      return lastData.name;
    } else {
      return lastData.id;
    }
  };
  // js触发器转化参数名称及值
  getJsTriggerParmValues = (eleObj, record) => {
    const { triggerMap } = this.props;
    const { id: eleId, basetype: eleType } = eleObj;
    const triggerList = triggerMap[eleId] || [];
    const triggers = triggerList.filter(item => item.triggerType === 4 && item.basetype === 5);
    if (!triggers.length) return false;
    const result = {};
    triggers.forEach(trigger => {
      const { jsFunctionList } = trigger;
      if (!jsFunctionList || !jsFunctionList.length) return;
      jsFunctionList.forEach(jsFunObj => {
        const { valueType, param, paramValue } = jsFunObj;
        if (valueType === 2) {
          result[param] = this.getValueFromCurrentTableColumn(paramValue, record);
        } else {
          result[param] = paramValue;
        }
      });
    });
    return result;
  };
  // 根据控件类型来渲染对应的控件
  setElementToWidget = (eleObj, record, form) => {
    const {
      id,
      defaultValue,
      selectListTabId,
      relationColumnType,
      basetype,
      readonly,
      mainTableName,
      mainColumnName,
      relationTableName,
      relationTabId,
      visiabled,
      placeholderText,
      elementFormat,
    } = eleObj;
    const { filterMap } = this.props;
    if (basetype === 1 || basetype === 10) {
      // 数字输入框
      if (NUMBER_COLUMN_TYPE.includes(relationColumnType)) {
        const jsTriggerParamObj = this.getJsTriggerParmValues(eleObj, record);
        const _props = {};
        if (jsTriggerParamObj) {
          // 有js触发器的计算属性
          const { max, min } = jsTriggerParamObj;
          if (max !== '' && !isNaN(Number(max))) _props.max = +max;
          if (min !== '' && !isNaN(Number(min))) _props.min = +min;
        }
        return (
          <InputNumber
            {..._props}
            ref={node => (this.input = node)}
            onPressEnter={e => this.save(e, eleObj)}
            onBlur={e => this.save(e, eleObj)}
          />
        );
      }
      return (
        // 输入框
        <Input
          ref={node => (this.input = node)}
          onPressEnter={e => this.save(e, eleObj)}
          onBlur={e => this.save(e, eleObj)}
        />
      );
    } else if (SELECT_IN_LIST.includes(basetype)) {
      return (
        <Select
          className={Styles.cellSelect}
          onBlur={() => this.toggleEdit()}
          onChange={(e, option) => this.selectSave(e, option, eleObj)}
          ref={node => (this.input = node)}
        >
          {this.props.tabdropdowndata[id] &&
          this.props.tabdropdowndata[id].map(item => (
            <Option key={item.id} value={`${item.id}`} data={item}>
              {item.name}
            </Option>
          ))}
        </Select>
      );
    } else if (basetype === 3) {
      if (selectListTabId) {
        return (
          // 数据选择框
          <DataSelectList
            {...this.props}
            eleObj={eleObj}
            filterMap={filterMap}
            form={form}
            toggleEdit={() => this.toggleEdit()}
            mainTableName={mainTableName}
            mainColumnName={mainColumnName}
            setSelected={selecteds => this.handleSetSelectSearchValue(selecteds, eleObj)}
            handleClickValue={() => relationTabId && this.props.setPopupTabInfo(eleObj, record)}
            doSearchList={() => selectListTabId && this.props.setPopupTabInfo1(eleObj, record)}
            // getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
          />
        );
      } else {
        return (
          // 数据选择框
          <NormalSearchSelect
            toggleEdit={() => this.toggleEdit()}
            eleObj={eleObj}
            className={Styles.cellNormalSelect}
            filterMap={filterMap}
            form={form}
            ref={node => (this.input = node)}
            valueObj={
              JSON.stringify(record) !== '{}' &&
              record[`${eleObj.id}`] &&
              JSON.stringify(record[`${eleObj.id}`]) !== '{}'
                ? JSON.parse(record[`${eleObj.id}`])
                : {}
            }
            mainTableName={mainTableName}
            mainColumnName={mainColumnName}
            setSelected={selecteds => this.handleSetSelectSearchValue(selecteds, eleObj)}
            // handleClickValue={() => relationTabId && this.props.setPopupTabInfo(eleObj, record)}
            // getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
          />
        );
      }
    } else if (basetype === 9) {
      const _props = {
        format: TIME_FORMATE_TYPES[elementFormat || 1],
        showTime: elementFormat !== 2,
      };
      return (
        <DatePicker
          {..._props}
          className={Styles.cellInput}
          onMouseLeave={() => this.toggleEdit()}
          onChange={value => this.changeTime(value, eleObj)}
          ref={node => (this.input = node)}
        />
      );
    }
  };
  handleSetSelectSearchValue = (selecteds, eleObj) => {
    let { record, dataIndex } = this.props;
    const { relationColumnName, id, mainColumnName } = eleObj;
    const selecctedData = selecteds[0] || {};
    let data = {
      [dataIndex]: JSON.stringify({ id: selecctedData.id, name: selecctedData[mainColumnName] }),
      [`a${dataIndex}`]: selecctedData[mainColumnName],
    };
    record = { ...record, ...data };
    this.updateFormDataList(record, eleObj, selecctedData.id, selecctedData);
    this.toggleEdit();
  };
  // 更新列表中的数据
  updateFormDataList = (record, eleObj, value, selecctedData) => {
    let { updataState, formData, idObj } = this.props;
    const { id } = idObj;
    const { datalist, ...rest } = formData;
    let index = datalist.findIndex(item => JSON.parse(item[id]).id === record[`a${id}`]);
    let newDataList = [...datalist];
    newDataList.splice(index, 1, record);
    let newFormData = {
      datalist: [...newDataList],
      ...rest,
    };
    updataState({ data: { ...newFormData } }, () => {
      if (!eleObj && !value) return;
      const { basetype } = eleObj;
      if (BTN_IN_LIST_COL.includes(basetype)) {
        this.handleChange(record, eleObj, value);
      } else if (basetype === 3) {
        this.handleChange(record, eleObj, value, selecctedData);
      }
    });
  };
  // 判断触发值是否是变量，如果是变量变成对应的值
  reducevVariableToData = (arr, record) => {
    if (!arr.length) return;
    let newData = [];
    arr.forEach(item => {
      if (
        item.endTriggerNum &&
        item.endTriggerNum.indexOf('@@') > -1 &&
        item.endTriggerNum.split('@@').length < 3
      ) {
        item.endTriggerNum = this.getValueFromCurrentTableColumn(item.endTriggerNum, record);
      }
      newData.push(item);
    });
    return newData;
  };
  handleChange = (record, eleObj, value, selecctedData) => {
    const { id, relationColumnType, basetype: originEleBaseType } = eleObj;
    if (relationColumnType === 4) {
      value = parseDecimal(value + '');
    }
    const { triggerMap, tabInfo, elementMap } = this.props;
    const elementList = elementMap[tabInfo.id] || [];
    const triggerData =
      (triggerMap[id] &&
        triggerMap[id].filter(item => item.basetype !== 4 && item.triggerType === 1)) ||
      [];
    let eventType = arrayClassify(triggerData, 'elementEvent') || []; // 处理出来有几种前端触发器事件
    if (!eventType.length) return;
    let reduceEventType = reduceArrObj(
      eventType,
      'endTriggerNum',
      'conditionType',
      'eventBasepriority',
      'methodType',
    );
    let triggerList = this.reducevVariableToData(reduceEventType, record); // 默认值处理成值
    const getValueFromCurrentTableColumn = varName => {
      if (!varName) return;
      const { tabInfo, elementMap, userInfo, activeTreeNode, tabList } = this.props;
      const elementList = elementMap[tabInfo.id];
      if (
        getValueFromGlobalVariables({
          globalVar: varName,
          userInfo,
        })
      ) {
        return getValueFromGlobalVariables({
          globalVar: varName,
          userInfo,
        });
      }
      let currentEle = elementList && elementList.find(item => item.parameter === varName);
      if (!currentEle) return varName;
      const { valueFieldType } = currentEle;
      const lastData = JSON.parse(record[currentEle.id]);
      if (valueFieldType === 2) {
        return lastData.name;
      } else {
        return lastData.id;
      }
    };
    let list =
      triggerList.filter(item => {
        const { endTriggerNum } = item;
        return validTriggerMatch(item, value, endTriggerNum, getValueFromCurrentTableColumn);
      }) || []; // 过滤出符合条件的事件
    if (!list.length) return;
    list.sort((a, b) => {
      return a.eventBasepriority - b.eventBasepriority;
    }); // 排序
    let newList = [];
    list.forEach(item => {
      newList.push(item.list);
    });
    let lastList = newList.reduce((a, b) => {
      return a.concat(b);
    });
    if (!lastList.length) return;
    lastList.forEach(item => {
      let {
        endTriggerNum,
        relationElementId,
        relationElementRequisite,
        relationElementReadonly,
        relationElementVisible,
        relationElementValue,
        canModifyValue,
      } = item;
      const element = elementList.find(item => item.id === relationElementId);
      if (!element) {
        console.warn(item + '控件不存在');
        return;
      }
      if (BTN_IN_EDIT_LIST.includes(element.basetype)) {
        // 如果是按钮，只会有true和false
        record[element.id] = !!relationElementVisible;
      }
      let value = relationElementValue;
      const paramValue = matchGlobalFunctionParam(relationElementValue);
      if (paramValue) {
        value = selecctedData[paramValue];
      }
      if (BTN_IN_LIST_COL.includes(element.basetype)) {
        // 如果时候可下拉框，输入框，时间选择框，则直接填值，不会再继续触发下一层
        if (SELECT_IN_LIST.includes(element.basetype)) {
          // 如果是下拉框，需要找到下拉框中的名称显示
          let optionData = this.props.tabdropdowndata[element.id].find(item => item.id === +value);
          if (!optionData) {
            record[element.id] = JSON.stringify({ id: '', name: '' });
            record[`a${element.id}`] = '';
          } else {
            record[element.id] = JSON.stringify({ id: optionData.id, name: optionData.name });
            record[`a${element.id}`] = optionData.name;
          }
        } else {
          if (relationElementValue === '@@Null') {
            record[element.id] = JSON.stringify({ id: '', name: '' });
            value = '';
          } else if (relationElementValue && relationElementValue.indexOf('@@') > -1) {
            value = this.getValueFromCurrentTableColumn(relationElementValue, record);
            record[element.id] = JSON.stringify({ id: value, name: value });
          } else {
            record[element.id] = JSON.stringify({ id: value, name: value });
          }
          record[`a${element.id}`] = value;
        }
      }
      if (SEARCH_SELECT_TYPE.includes(element.basetype)) {
        if (
          SEARCH_SELECT_TYPE.concat([17]).includes(element.basetype) &&
          !!value &&
          (!isNaN(Number(value)) || !!Number(value))
        ) {
          if (element.basetype === 17 && element.valueFieldType === 2) {
            record[element.id] = JSON.stringify({ id: value, name: value });
            record[`a${element.id}`] = value;
            return;
          }

          this.fetchDetailById(element, +value, record);
        } else {
          record[element.id] = JSON.stringify({ id: '', name: '' });
          record[`a${element.id}`] = '';
        }
      }
    });
    this.updateFormDataList(record);
  };

  // 数据选择框 根据id获取详情
  fetchDetailById = (eleObj, id, record) => {
    const { mainTableName: tabSource, mainColumnName, id: eleId, basetype, triggerSign } = eleObj;
    const api = basetype === 45 ? getCheckBoxSearchDetail : getNormalSearchDetail;
    const params = {
      [basetype === 45 ? 'tableName' : 'tabSource']: tabSource,
      [basetype === 45 ? 'ids' : 'id']: id,
    };
    api(params).then(res => {
      let resData =
        basetype === 45
          ? {
            id: res.map(item => item.id).join(','),
            name: res.map(item => item[mainColumnName]).join(','),
          }
          : {
            id: res.id || '',
            name: res[mainColumnName] || '',
          };
      record[eleId] = JSON.stringify(resData);
      record[`a${eleId}`] = resData.name;
      this.updateFormDataList(record, eleObj, res.id, res);
    });
  };
  // 修改时间
  changeTime = (time, eleObj) => {
    const { elementFormat } = eleObj;
    let timeValue = time ? moment(time).format(TIME_FORMATE_TYPES[elementFormat || 1]) : '';
    let { record, dataIndex } = this.props;
    let data = {
      [dataIndex]: JSON.stringify({ id: timeValue, name: timeValue }),
      [`a${dataIndex}`]: timeValue,
    };
    record = { ...record, ...data };
    this.updateFormDataList(record, eleObj, timeValue);
    this.toggleEdit();
  };

  // 输入框中的值进行修改
  save = (e, eleObj) => {
    let { record, dataIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      const eleValue = `${values[dataIndex] === null ? '' : values[dataIndex]}`;
      let data = {
        [dataIndex]: JSON.stringify({ id: eleValue, name: eleValue }),
        [`a${dataIndex}`]: eleValue,
      };
      record = { ...record, ...data };
      this.updateFormDataList(record, eleObj, eleValue);
    });
  };
  // 下拉框中的值进行修改
  selectSave = (val, option, eleObj) => {
    const {
      props: { value, children },
    } = option;
    let { record, dataIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      let data = {
        [dataIndex]: JSON.stringify({ id: value, name: children }),
        [`a${dataIndex}`]: children,
      };
      record = { ...record, ...data };
      this.updateFormDataList(record, eleObj, value);
    });
  };

  // 编辑单元格
  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title, eleObj } = this.props;
    const { editing } = this.state;
    const { basetype } = eleObj;
    const recordData = record[dataIndex] ? JSON.parse(record[dataIndex]) : {};

    return editing && BASETYPE_IN_EDIT_COL.includes(basetype) ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(`${dataIndex}`, {
          rules: [
            {
              required: false,
              message: `${title} is required.`,
            },
          ],
          initialValue:
            basetype === 9
              ? recordData.name
              ? moment(recordData.name)
              : ''
              : `${recordData.name || ''}`,
        })(this.setElementToWidget(eleObj, record, form))}
      </Form.Item>
    ) : (
      <div className={Styles.cellHeight} onClick={() => this.toggleEdit(eleObj)}>
        {children}
      </div>
    );
  };

  render() {
    const { editable, dataIndex, title, record, index, children, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class DetailList extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      popoverValue: 1,
      totalCount: {},
      visible: false,
      elementMap: [],
      tabInfo: [],
      tabList: [],
      tabDataM: {},
      loading: false,
      params: {},
      ele: {},
      record: {},
      selectedRows: [], // 弹框选择的数据
      selected: [], // 关联面板选择的数据
      editType: false, // 点击编辑弹出编辑页面
      data: {}, // 点编辑时获取到 的原始数据,
      queryParams: initQueryParams,
      keywords: '', // 关键词
      selectValue: '', // 模糊搜索条件
      basicData: [], // 初始数据
      formData: {}, // 获取面板的数据
      sortName: '',
      sorter: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      formData: nextProps.formData,
      basicData: nextProps.formData,
    });
  }

  componentDidMount() {
    const {
      tabInfo: { id, calculationOperationBar },
      multiSelectedListArr,
    } = this.props;
    this.setState({
      selected: multiSelectedListArr,
    });
    if (!calculationOperationBar) return;
    if (
      document.querySelectorAll(`.list_${id} .ant-table-body`) &&
      document.querySelectorAll(`.list_${id} .ant-table-body`)[0]
    ) {
      document
        .querySelectorAll(`.list_${id} .ant-table-body`)[0]
        .addEventListener('scroll', this.scrollCount);
    }
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

  doSearch = () => {
    const { updataState } = this.props;
    updataState(
      {
        pageIndex: 1,
        seniorFilter: {},
      },
      () => {
        this.props.updataPageIndexOrSize();
      },
    );
  };

  // 计算宽度
  conutWidth = () => {
    const { tabInfo, elementMap } = this.props;
    let totalWidth = 0;
    let realDomWidth = this.refs.getContentWidth && this.refs.getContentWidth.clientWidth;
    let elementObj = elementMap[tabInfo.id];
    let tableColumes =
      elementObj.filter(item => {
        return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype) && item.visiabled;
      }) || [];
    tableColumes.forEach(item => {
      if (item.columnSpan && item.columnSpan > 100) {
        totalWidth += ((Number(item.columnSpan) % 100) / 100) * realDomWidth;
      } else {
        totalWidth += 100;
      }
    });
    return totalWidth;
  };

  // 解析条件
  getConditions = ({ record, tableColumes, conditionjsonconfig }) => {
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
        let newCondition = reducerVariableToArray(normalArr, record, tableColumes, '', userInfo);
        if (multiDataComparison(newCondition)) {
          return rest;
        }
      }
    } catch (e) {
      obj = {};
    }
    return obj;
  };
  onChange = (pagination, filters, sorter, extra) => {
    this.setState({
      sortName: 'a' + sorter.columnKey,
      sorter,
    });
  };

  // 生成可编辑表头
  getEditTableColumns = () => {
    const { tabInfo, elementMap, functionData } = this.props;
    const { canmodify } = functionData.attributes;
    if (JSON.stringify(elementMap) === '{}') return;
    let elementObj = elementMap[tabInfo.id] || [];
    let realDomWidth = (this.refs.getContentWidth && this.refs.getContentWidth.clientWidth) || 0;
    let tableList =
      elementObj.filter(item => {
        return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype);
      }) || [];
    let tableColumes =
      tableList.filter(item => {
        return !HIDE_IN_LIST_ELEMENT_TYPE.includes(item.basetype) && item.visiabled;
      }) || [];
    let columns = tableColumes.map((item, index) => {
      const {
        jumpMenuList,
        jumpType,
        relationTabId,
        id,
        relationColumnName,
        defaultValue,
        readonly,
        basetype,
        elementFormat,
        conditionjsonconfig = '[]',
      } = item;
      const width =
        item.columnSpan && item.columnSpan > 100
          ? ((item.columnSpan % 100) / 100) * realDomWidth + 'px'
          : '140px';
      return {
        zid: index,
        eleObj: item,
        title:
          tabInfo.canLineEdit === 1 && !!!readonly ? (
            <span>
              <span className='custom-color iconEdit iconfont' />
              <LabelTip eleObj={item} />
            </span>
          ) : (
            <LabelTip eleObj={item} />
          ),
        dataIndex: item.id,
        key: item.id,
        editable: tabInfo.canLineEdit === 1 && !!!readonly,
        width: width,
        sorter: (a, b) => {},
        render: (text, record, index) => {
          const obj = this.getConditions({ record, tableColumes: tableList, conditionjsonconfig });
          const { color: resultColor, bgColor } = obj;
          const resultStyles = {
            color: resultColor,
            backgroundColor: bgColor,
            padding: bgColor ? '0 5px' : 0,
          };
          const content =
            record[`a${id}`] && record[`a${id}`].indexOf('1970-01-01') > -1
              ? ''
              : parseDecimal(record[`a${id}`]) || defaultValue;
          // 有关联弹出面板的控件
          if (
            (relationTabId && (jumpType === 1 || !jumpType)) ||
            (jumpType === 2 && !!jumpMenuList && jumpMenuList.length)
          ) {
            return (
              <a
                style={{ width: width }}
                className={Styles.contentClass}
                title={content}
                onClick={e => this.props.setPopupTabInfo(item, record)}
              >
                <div className={Styles.contentTitle} style={resultStyles}>{content}</div>
              </a>
            );
          }
          if (basetype === 8 && elementFormat === 2 && content) {
            const splitIndex = content.indexOf('_');
            const fileUrl = content.substring(splitIndex + 1, content.length);
            return (
              <div style={{ width: '86px', height: '86px', display: 'flex', alignItems: 'center' }}>
                <Zmage style={{ width: '100%' }} src={fileUrl} />
              </div>
            );
          }
          const color = (record[id] && JSON.parse(record[id]).color) || '';
          return (
            <div style={{ width: width }} className={Styles.contentClass}>
              {!!color && <span className={Styles.stateClass} style={{ backgroundColor: color }} />}
              <span className={Styles.contentTitle} title={content} style={{ ...resultStyles }}>{content}</span>
            </div>
          );
        },
      };
    });
    let multiJumpBtn = elementObj.find(item => item.basetype === 43); // 多菜单跳转
    let multiTabBtn = elementObj.find(item => item.basetype === 44); // 多面板
    let saveBtn = elementObj.find(item => item.basetype === 7);
    const { multiJump, multiTabJump, saveInListBtn } = this.props;
    let btnColums = {
      title: <FormattedMessage id='global.operator' />,
      dataIndex: 'operatorcheck',
      key: 'operatorcheck',
      width: tabInfo.canLineEdit === 1 ? 120 : 100,
      render: (text, record) => {
        return (
          <div className='custom-color'>
            {canmodify && !!multiJumpBtn ? (
              <Tooltip placement='leftTop' title={multiJumpBtn.displayName}>
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
              <Tooltip placement='leftTop' title={multiTabBtn.displayName}>
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
              <Tooltip placement='leftTop' title={saveBtn.displayName}>
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
    if (!multiJumpBtn && !multiTabBtn && !saveBtn) return columns;
    columns.push(btnColums);
    return columns;
  };

  btnClick = ele => {
    const { basetype } = ele;
    switch (basetype) {
      case 4:
        return this.add(ele);
      case 5:
        return this.eddit(ele);
      case 6:
        return this.delete(ele);
      case 18:
        return this.relationTable(ele);
      default:
        return null;
    }
  };
  // 编辑
  eddit = ele => {
    const { langLib } = this.context;
    let { record, tabInfo } = this.state;
    let tabData = this.props.tabData || [];
    let arr = tabData.datalist || [];
    let current = arr.find(item => {
      return item.id === record.id;
    });
    let newTabInfo = JSON.parse(JSON.stringify(tabInfo));
    newTabInfo.showType = 2;
    let obj = this.reduceData(current);
    if (JSON.stringify(record) === '{}') {
      CMessage(langLib['message.please.choose'], 'error');
    } else {
      this.setState({
        ele,
        editType: true,
        visible: true,
        data: obj,
        tabInfo: newTabInfo,
      });
    }
  };
  // 删除
  delete = ele => {
    const { langLib } = this.context;
    const { selected, tabInfo, tabList } = this.state;
    const { relationTableName } = ele;
    let that = this;
    if (selected.length) {
      let { close } = ModalBox.confirm({
        ...getDefaultConfirmProps(langLib),
        content: '',
        onOk() {
          let params = {
            tableName: relationTableName,
            ids: selected.map(item => JSON.parse(item.id).name).join(','),
          };
          del(params).then(res => {
            that.props.updataPageIndexOrSize(1, 10);
            that.setState({
              selected: [],
              record: {},
            });
            closeModal();
          });
        },
        onCancel: () => closeModal(),
      });
      const closeModal = () => {
        close();
      };
    } else {
      CMessage(langLib['message.please.choose'], 'error');
    }
  };
  // 点击按钮弹框选择数据
  relationTable = ele => {
    const { relationTabId } = ele;
    if (relationTabId) {
      // 关联了面板
      const { elementMap, tabList } = this.props;
      let relationTab = elementMap[relationTabId];
      let tabInfo = tabList.find(item => item.id === relationTabId);
      const elementList = relationTab
        .filter(item => !BTN_ELEMENT_TYPE.includes(item.basetype))
        .map(item => {
          if (item.basetype === 9) {
            return {
              name: item.relationColumnName,
              baseType: item.basetype,
              relationColumnType: item.relationColumnType,
              elementFormat: item.elementFormat,
              mainColumnName: item.mainColumnName,
              mainTableName: item.mainTableName,
              elementId: item.id,
              elementMultiRelation: item.elementMultiRelation,
            };
          } else {
            return {
              relationColumnName: item.relationColumnName,
              relationTableName: item.relationTableName,
              name: item.relationColumnName,
              relationColumnType: item.relationColumnType,
              baseType: item.basetype,
              mainColumnName: item.mainColumnName,
              mainTableName: item.mainTableName,
              elementId: item.id,
              elementMultiRelation: item.elementMultiRelation,
            };
          }
        });
      if (!elementList || !elementList.length) return;
      const params = {
        tabSource: tabInfo.relationTableName,
        tabId: relationTabId,
        elementList,
        pageNum: 1,
        pageSize: 10,
      };
      this.setState({
        loading: true,
      });
      getList(params).then(
        res => {
          this.setState({ tabDataM: res, loading: false, record: {} });
        },
        err => {
          this.setState({ loading: false });
        },
      );
      this.setState({ relationTab, visible: true, elementMap, tabList, tabInfo, params, ele });
    }
  };
  // 数据处理
  reduceData = (objRes = {}) => {
    const { tabInfo, elementMap, triggerMap, form } = this.props;
    let { formData } = this.state;
    const elementList = elementMap[tabInfo.id] || [];
    let data = {};
    for (let key in objRes) {
      if (Number(key).toString() !== 'NaN') {
        let obj = elementList.find(value => {
          return value.id === Number(key);
        });
        let newKey = 'a' + key;
        data[newKey] = objRes[key];
      } else {
        let control = elementList.find(item => item.relationColumnName === key);
        if (control) {
          let newKey = 'a' + control.id;
          data[newKey] = objRes[key];
        }
      }
    }
    return data;
  };
  // 新增
  add = ele => {
    const { relationTabId } = ele;
    let tabInfo = this.props.tabList.find(item => item.id === relationTabId);
    this.setState({
      visible: true,
      editType: false,
      tabInfo,
    });
  };
  handleSave = () => {
    const { ele, selectedRows, editType } = this.state;
    const { tabId } = ele;
    const { activeTreeNode, elementMap, tabList } = this.props;
    let table = tabList.find(item => item.id === tabId);
    if (editType) {
      let param = this.props.form.getFieldsValue();
      let elementList =
        elementMap[tabId] &&
        elementMap[tabId].filter(item => !NO_SUBMIT_ELEMENT_TYPE.includes(item.basetype));

      let data = {};
      elementList.forEach(item => {
        data[item.relationColumnName] = param['a' + item.id];
      });
      let params = {
        ...data,
        static_tableName: ele.relationTableName,
      };
      handleSave(params).then(res => {
        this.setState(
          {
            editType: false,
            visible: false,
          },
          () => {
            this.props.updataPageIndexOrSize(1, 10);
          },
        );
      });
    } else {
      let activeRelationColumn = table.relationColumn;
      let relationColumnName = ele.relationColumnName;
      let arr = selectedRows.map(item => {
        let obj = {
          [relationColumnName]: item.id,
          static_tableName: ele.relationTableName,
          [activeRelationColumn]: JSON.parse(activeTreeNode.id).name,
          // ...item,
        };
        delete obj.id;
        return obj;
      });
      let params = {
        static_list: arr,
      };
      updateMore(JSON.stringify(params)).then(res => {
        this.setState({ visible: false, editType: false }, () => {
          this.props.updataPageIndexOrSize(1, 10);
        });
      });
    }
  };
  // onClickRow = (record, selectedRows) => {
  //   this.props.updataState({ selectedArr: selectedRows });
  // };
  onClickRowAll = (record, selectedRows, changeRows) => {
    let { tabInfo } = this.props;
    const { selected = [] } = this.state;
    let elementObj = this.props.elementMap[tabInfo.id];
    let idEle = elementObj.find(item => item.relationColumnName === 'id');
    changeRows.forEach(obj => {
      if (record) {
        if (!selected.find(item => item[idEle.id] === obj[idEle.id])) {
          selected.push(obj);
        }
      } else {
        if (selected.find(item => item[idEle.id] === obj[idEle.id])) {
          selected.splice(selected.findIndex(item => item[idEle.id] === obj[idEle.id]), 1);
        }
      }
    });
    this.setState({
      selected: selected,
    });
    this.props.updataState({ selectedArr: selected });
  };
  onClickRow = (record, selectedRows) => {
    let { tabInfo } = this.props;
    const { selected = [] } = this.state;
    if (this.props.checkboxType === 'radio') {
      this.setState({
        selected: [record],
      });
      this.props.updataState({ selectedArr: [record] });
    } else {
      let elementObj = this.props.elementMap[tabInfo.id];
      let idEle = elementObj.find(item => item.relationColumnName === 'id');
      if (selected.find(item => item[idEle.id] === record[idEle.id])) {
        selected.splice(selected.findIndex(item => item[idEle.id] === record[idEle.id]), 1);
      } else {
        selected.push(record);
      }
      this.setState({
        selected: selected,
      });
      this.props.updataState({ selectedArr: selected });
    }
  };
  clickRow = record => {
    return {
      onClick: () => {
        if (this.props.checkboxType === 'radio') {
          this.setState({
            selected: [record],
          });
          this.props.updataState({ selectedArr: [record] });
        } else {
          let { tabInfo } = this.props;
          const { selected = [] } = this.state;
          let elementObj = this.props.elementMap[tabInfo.id];
          let idEle = elementObj.find(item => item.relationColumnName === 'id');
          if (selected.find(item => item[idEle.id] === record[idEle.id])) {
            selected.splice(selected.findIndex(item => item[idEle.id] === record[idEle.id]), 1);
          } else {
            selected.push(record);
          }
          this.setState({
            selected,
          });
          this.props.updataState({ selectedArr: selected });
        }
      },
    };
  };
  // 数据处理
  dataProcessing = (arr = []) => {
    let formData = this.props.formData || [];
    let { total, pageNum, pageSize } = new Object(formData);
    const { tabInfo, elementMap } = this.props;
    const { id } = tabInfo;
    let elementList = elementMap[id];
    let newDataSource = [];
    arr.forEach((item, index) => {
      let newItem = JSON.parse(JSON.stringify(item));
      for (let key in item) {
        if (Number(key).toString() !== 'NaN') {
          newItem[`a${key}`] = JSON.parse(item[key]).name;
          newItem.zindex = (pageNum - 1) * pageSize + index;
        } else {
          let obj = elementList.find(value => {
            return value.relationColumnName === key;
          });
          if (obj) {
            newItem[`a${obj.id}`] = JSON.parse(item[key]).name;
            newItem.zindex = (pageNum - 1) * pageSize + index;
          }
        }
        if (key === 'id') {
          newItem.id = JSON.parse(item[key]).name;
        }
      }
      let data = {
        ...item,
        ...newItem,
      };
      newDataSource.push(data);
    });
    return newDataSource;
    // return arr
  };
  // 重置模糊查询的条件
  doRestSearchList = () => {
    this.props.updataState({
      searchSelected: '',
      searchVal: '',
      pageIndex: 1,
    });
  };
  onChange1 = (e, id) => {
    // 更新选择状态
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
    const { totalCount } = this.state;
    const { selectedListArr = [], formData, elementComputedObj } = this.props;
    let datalist = new Object(formData).datalist;
    let dataSource = this.dataProcessing(datalist) || [];
    const getCount = (total, dataSource) =>
      dataSource.reduce((total, item) => {
        // 求和
        const v = item[`a${id}`];
        const n = Number(v);
        if (!isNaN(n)) return parseFloat((total + n).toFixed(10));
        return total;
      }, 0);
    const numberArray = dataSource =>
      dataSource.map(item => {
        const v = item[`a${id}`];
        const n = Number(v);
        if (!isNaN(n)) return n;
        return 0;
      });
    if (dataSource.length) {
      // 全部
      let result = null,
        name = null;
      const isTrue = elementComputedObj[id] !== 2;
      if (t === 1) {
        // 求和
        result = getCount(0, isTrue ? dataSource : selectedListArr);
        name = '求和：';
      }
      if (t === 2) {
        // 求和
        const count = getCount(0, isTrue ? dataSource : selectedListArr);
        const n = isTrue ? dataSource.length : selectedListArr.length;
        result = n ? (count / n).toFixed(2) : 0;
        name = '平均值：';
      }
      if (t === 3) {
        const arr = numberArray(isTrue ? dataSource : selectedListArr);
        result = arr.length ? Math.max(...arr) : 0;
        name = '最大值：';
      }
      if (t === 4) {
        const arr = numberArray(isTrue ? dataSource : selectedListArr);
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
  renderFooter = (newColumns = []) => {
    const { tabInfo, elementComputedObj } = this.props;
    const {
      tabInfo: { calculationOperationBar, showcolumnselectionbox },
    } = this.props;
    if (!calculationOperationBar) return null;
    const otherWidth = !!showcolumnselectionbox ? 50 : 0;
    let totalWidth = this.conutWidth() + otherWidth;
    const { totalCount } = this.state;
    const dom = newColumns.map(item => {
      const { eleObj, width } = item;
      if (!eleObj) return '';
      const { id } = eleObj;
      const content = (
        <div style={{ width: '180px' }}>
          <p style={{ color: '#9e9e9e', fontSize: '12px', padding: '15px 10px 5px 10px' }}>
            选择统计方式
          </p>
          <div className={Styles.countSelectWrap}>
            <Radio.Group
              onChange={(e) => this.onChange1(e, id)}
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
          key={item.dataIndex}
          trigger='click'
          getPopupContainer={() => document.getElementById('main-container')}
        >
          <div style={{ width }} key={item.dataIndex}>
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
        <div style={{ width: `${totalWidth}px` }} className={Styles.tableFooter}>
          {dom}
        </div>
      </div>
    );
  };

  // 渲染标签
  renderTagList = nameEle => {
    const { eleObj = {}, selectedListArr = [] } = this.props;
    const { readonly } = eleObj;
    const checkCls = classNames({
      checkTag: true,
    });
    return selectedListArr.map((obj, index) => (
      <Tag
        className={checkCls}
        key={JSON.parse(obj[nameEle.id]).id + index}
        closable={!readonly}
        onClose={() => this.deleteTag(index)}
      >
        {JSON.parse(obj[nameEle.id]).name}
      </Tag>
    ));
  };
  // 删除标签
  deleteTag = index => {
    const { selectedListArr = [] } = this.props;
    let selectedRows = [].concat(selectedListArr);
    selectedRows.splice(index, 1);
    this.setState({
      selected: selectedRows,
    });
    this.props.updataState({ selectedArr: selectedRows });
  };
  sortChinese = (arr, dataLeven) => {
    return arr.sort((item1, item2) => {
      const v1 = this.getValue(item1, dataLeven),
        v2 = this.getValue(item2, dataLeven);
      if (isNaN(v1) || isNaN(v2)) {
        return v1.localeCompare(v2, 'zh-CN');
      }
      return Number(v1 || 0) - Number(v2 || 0);
    });
    // 参数：arr 排序的数组; dataLeven 数组内的需要比较的元素属性
    return arr.sort((item1, item2) => {
      return this.getValue(item1, dataLeven).localeCompare(
        this.getValue(item2, dataLeven),
        'zh-CN',
      );
    });
  };
  /* 获取数组元素内需要比较的值 */
  getValue = (option, dataLeven) => {
    // 参数： option 数组元素
    if (!dataLeven) return option;
    var data = option;
    dataLeven.split('.').filter(function(item) {
      data = data[item];
    });
    return data + '';
  };
  sortNumber = (arr, dataLeven) => {
    arr.sort((a, b) => {
      return a[dataLeven] - b[dataLeven];
    });
  };

  render() {
    let totalWidth = this.conutWidth();
    let formData = this.props.formData;
    const {
      filterMap,
      tabDropDownData,
      getAdvancedFilter,
      functionData,
      triggerMap,
      tabInfo,
      form,
      btnGroups,
      selectedListArr = [],
      elementMap,
      loading,
      hasPagination = false,
      userInfo,
      updataState,
      updataPageIndexOrSize,
      pageSizeOptions,
      valueObj,
      multiSelectedListArr = [],
      fromSource = 'tab',
    } = this.props;
    const { tabList } = this.state;
    // let columns = tabInfo.canLineEdit === 1 ? this.getEditTableColumns() : this.getTableColumns();
    let columns = this.getEditTableColumns() || [];
    let datalist = new Object(formData).datalist;
    const { canview } = functionData.attributes;
    let { total = 0, pageNum = 1, pageSize = 10 } = new Object(formData);
    let dataSource = this.dataProcessing(datalist) || [];
    const { sortName, sorter } = this.state;
    if (dataSource && sortName) {
      if (sorter.order === 'ascend') {
        dataSource = this.sortChinese(Array.from(dataSource), sortName);
      } else if (sorter.order === 'descend') {
        dataSource = this.sortChinese(Array.from(dataSource), sortName).reverse();
      } else {
        dataSource = this.dataProcessing(datalist);
      }
    }
    let elementObj = (tabInfo && elementMap[tabInfo.id]) || [];
    let btnArr =
      elementObj.filter(item => {
        return BTN_ELEMENT_TYPE.includes(item.basetype) && item.visiabled;
      }) || [];
    let searchArr =
      elementObj.filter(item => {
        return item.basetype === 14 && item.visiabled;
      }) || [];
    const seniorFilterEle = elementObj.find(item => item.basetype === 33); // 高级筛选
    let idEle = elementObj.find(item => item.relationColumnName === 'id');
    let nameEle = elementObj.find(item => item.relationColumnName === 'name');
    if (!idEle) return '';
    const cellProps = { tabInfo, elementMap, userInfo, tabList, triggerMap, ...this.props }; // 行编辑的props
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
          dataIndex: col.dataIndex,
          title: col.title,
          updataState: this.props.updataState,
          formData: formData,
          idObj: idEle,
          eleObj: col.eleObj,
          tabdropdowndata: tabDropDownData,
        }),
      };
    });
    const pagination = {
      total,
      current: pageNum,
      pageSize,
      showSizeChanger: true,
      pageSizeOptions,
      onShowSizeChange: (current, size) => {
        this.props.updataState(
          {
            // selectedArr: [],
            pageIndex: 1,
            pageSize: size,
          },
          () => {
            updataPageIndexOrSize();
          },
        );
      },
      onChange: (pageNum, newPageSize) => {
        this.props.updataState(
          {
            // selectedArr: [],
            pageIndex: pageNum,
            pageSize: newPageSize,
          },
          () => {
            updataPageIndexOrSize();
          },
        );
      },
      showTotal: (total, range) => {
        return (
          <div>
            <FormattedMessage id='global.total' />
            {total}
          </div>
        );
      },
    };
    const checkboxType = this.props.checkboxType;
    const rowSelection = {
      type: this.props.checkboxType || 'checkbox',
      selectedRowKeys: selectedListArr.map(item => item[idEle.id]),
      defaultSelectedRowKeys: multiSelectedListArr.map(item => item[idEle.id]),
      onSelectAll: (record, selectedRows, changeRows, nativeEvent) => {
        this.onClickRowAll(record, selectedRows, changeRows);
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRow(record, selectedRows);
      },
      onChange: (record, selected, selectedRows, nativeEvent) => {
        // this.onClickRow(record, selectedRows);
      },
    };
    let quickQuerySelect = elementObj
      .filter(item => {
        return item.quickQuery === 1;
      })
      .map(items => {
        return (
          <Option key={items.id} value={items.id}>
            {items.displayName}
          </Option>
        );
      });
    let fiterBtn = elementObj.find(item => item.basetype === 33 && item.visiabled && canview);
    // 查找按钮
    const searchCls = classNames({
      [Styles.searchBox1]: this.props.checkboxType === 'radio',
      [Styles.searchBox]: this.props.checkboxType !== 'radio',
    });
    const components = {
      // 可编辑
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const { calculationOperationBar, showcolumnselectionbox } = tabInfo;
    let cTableCls = null;
    if (btnArr.length || searchArr.length || fiterBtn) {
      if (this.props.checkboxType === 'radio') {
        if (!!selectedListArr.length && fromSource === 'modal' && nameEle && btnArr.length) {
          cTableCls = Styles.tableHeight52;
        } else {
          cTableCls = Styles.tableHeight5;
        }
      } else {
        if (!calculationOperationBar) {
          if (!!selectedListArr.length && fromSource === 'modal' && nameEle && btnArr.length) {
            cTableCls = Styles.tableHeight32;
          } else {
            cTableCls = Styles.tableHeight3;
          }
        } else {
          if (!!selectedListArr.length && fromSource === 'modal' && nameEle && btnArr.length) {
            cTableCls = Styles.tableHeight02;
          } else {
            cTableCls = Styles.tableHeight;
          }
        }
      }
    } else {
      if (!calculationOperationBar) {
        if (!!selectedListArr.length && fromSource === 'modal' && nameEle) {
          cTableCls = Styles.tableHeight42;
        } else {
          cTableCls = Styles.tableHeight4;
        }
      } else {
        if (!!selectedListArr.length && fromSource === 'modal' && nameEle) {
          cTableCls = Styles.tableHeight22;
        } else {
          cTableCls = Styles.tableHeight2;
        }
      }
    }
    let tagsCls = {
      'checkTagsRow': true,
    };
    if (!searchArr.length || btnArr.length) {
      tagsCls = {
        'checkTagsRow2': true,
      };
    }
    if (!showcolumnselectionbox) {
      cTableCls = `${cTableCls} ${Styles.tableNoSelectCls}`;
    }
    return (
      <div style={{ height: 'calc(100%)' }} ref='getContentWidth' className={`list_${tabInfo.id}`}>
        {!!selectedListArr.length && nameEle ? (
          <Row className={tagsCls}>
          <Col span={btnArr.length ? 24 : 15}>
            <div className="checkTags">
              <div className="label">
                <span>已选择</span>
                {checkboxType === 'checkbox' && (
                  <Popover
                    overlayClassName="popoverWrap"
                    content={this.renderTagList(nameEle)}
                    placement="bottomRight"
                    title=""
                    trigger="hover"
                  >
                    <span className="ellipsis">{selectedListArr.length}</span>
                  </Popover>
                )}
                {checkboxType !== 'checkbox' && (
                  <span className="ellipsis">{selectedListArr.length}</span>
                )}
                条：
              </div>
              <span className="tags">
                {this.renderTagList(nameEle)}
              </span>
            </div>
          </Col>
        </Row>
        ) : null}
        <Row style={{ padding: '0 10px 0 10px' }}>
          <Col span={15}>{btnGroups}</Col>
          <Col span={9}>
            {searchArr.length ? (
              <div className={searchCls}>
                <InputGroup compact>
                  <Select
                    defaultValue=''
                    style={{ width: '34%' }}
                    onChange={value => this.props.updataState({ searchSelected: value })}
                  >
                    <Option key={''} value=''>
                      <FormattedMessage id='role.table.all' />
                    </Option>
                    {quickQuerySelect}
                  </Select>
                  <CSearch
                    style={{ width: '66%' }}
                    onSearch={value => this.doSearch()}
                    onChange={e => {
                      this.props.updataState({ searchVal: e.target.value.replace(SPECIAL_CHARACTERS, '') });
                    }}
                  />
                </InputGroup>
              </div>
            ) : null}
            {fiterBtn ? (
              <div className={Styles.filterBox}>
                <SeniorFilter
                  entryEleObj={seniorFilterEle}
                  elementList={elementObj}
                  filterMap={filterMap}
                  fetchListData={updataPageIndexOrSize}
                  setContainerState={updataState}
                  restSearchParams={this.doRestSearchList}
                />
              </div>
            ) : null}
          </Col>
        </Row>
        <CTable
          className={cTableCls}
          dataSource={dataSource}
          components={components}
          columns={newColumns}
          loading={loading}
          rowSelection={showcolumnselectionbox ? rowSelection : null}
          pagination={hasPagination ? pagination : false}
          rowKey={record => idEle && record[idEle.id]}
          onRow={tabInfo.canLineEdit === 1 ? () => {
          } : this.clickRow}
          onChange={this.onChange}
          scroll={{ x: totalWidth >= 1000 ? totalWidth : 'max-content', y: 92 }}
          footer={calculationOperationBar ? () => this.renderFooter(newColumns) : null}
        />
        <Pagination style={{ marginTop: '18px', marginLeft: '10px' }} size="small" showQuickJumper showSizeChanger {...pagination} />
      </div>
    );
  }
}

export default DetailList;
