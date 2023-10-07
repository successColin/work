/*
 * @Author: Fus
 * @Date:   2019-10-17 10:54:01
 * @Desc: 筛选过滤条件
 */
import {
  CButton,
  CDatePicker,
  CheckBoxSearchSelect,
  CInput,
  CSelect,
  CTextArea,
  NormalSearchSelect,
} from '@/components/common/BasicWidgets';
import formStyles from '@/components/common/FormItems/FormItems.less';
import {
  BTN_ELEMENT_TYPE,
  EMPTY_ITEM,
  HIDDEN_ELEMENT_TYPE,
  IGNORE_FORM_ITEM,
  SELECT_ELEMETN_TYPE,
  TIME_FORMATE_TYPES,
} from '@/constants/element';
import { getNormalSearchDetail, getPageSelectOptions, getCheckBoxSearchDetail } from '@/services/frame';
import {
  filterHiddenFormData,
  getValueFromGlobalVariables,
  isGlobalOrCustomVar,
  setElementToValue,
} from '@/utils/common';
import { Col, Form, Row, Select } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './SearchFilter.less';

const { Option } = Select;

@connect(state => ({
  tabs: state.tabs,
  userInfo: state.user.userInfo,
}))
class SearchFilter extends Component {
  state = {
    tabDropDownList: {}, // 下拉框
    formData: {}, // 多选框的值
  };

  componentDidMount() {
    this.fetchCascadeOptions();
    setTimeout(() => {
      // 如果是通过菜单跳转过来的，，把值显示出来
      this.getDefaultValueFromAllElements();
      this.renderFormData();
    }, 0);
  }

  // 将菜单中的参数渲染到查询条件中
  renderFormData = () => {
    const { pageConfig, tabInfo, tabs, form } = this.props;
    const { fileData } = tabs.activeTabData;
    const { elementMap = {} } = pageConfig;
    const elementList = elementMap[tabInfo.id];
    if (!fileData) return;
    let fileDateLen = fileData && Object.keys(fileData).length;
    if (fileDateLen) {
      elementList.forEach(item => {
        const { parameter, basetype, id } = item;
        if (fileData[`@@${parameter}`]) {
          const itemData = fileData[`@@${parameter}`];
          if (basetype !== 3) {
            form.setFieldsValue({
              [parameter]: itemData.value,
            });
          } else if (basetype === 3 && itemData.value && !isNaN(Number(itemData.value))) {
            this.fetchDetailById(item, itemData.value);
          }
        }
      });
    }
  };
  // 数据选择框 根据id获取详情
  fetchDetailById = (eleObj, id) => {
    const { mainTableName: tabSource, mainColumnName, id: eleId, basetype, triggerSign } = eleObj;
    getNormalSearchDetail({
      tabSource,
      id,
    }).then(res => {
      this.handleSetSelectSearchValue([res], eleObj);
    });
  };

  // 动态获取级联下拉数据
  fetchCascadeOptions = () => {
    const { setContainerState, formData, tabDropDownData, tabInfo, pageConfig } = this.props;
    const { filterMap, elementMap } = pageConfig;
    const elementList = elementMap[tabInfo.id];
    // 下拉框控件列表
    const dropDownList = elementList
      .filter(item => SELECT_ELEMETN_TYPE.includes(item.basetype) && !!item.mainTableName)
      .map(item => ({
        dataSource: item.mainTableName,
        elementId: item.id,
        columnName: item.mainColumnName,
      }));
    if (!dropDownList.length) return;
    const globalMap = {};
    getPageSelectOptions({ dropDownList, globalMap }).then(res => {
      this.setState({
        tabDropDownList: res,
      });
    });
  };
  // 设置多选框的数据
  handleSetChecBoxValue = (selecteds = [], eleObj) => {
    if (!selecteds.length) return;
    const { form } = this.props;
    const { relationColumnName, id, mainColumnName, parameter, mainTableName } = eleObj;
    const { formData } = this.state;
    let data = {
      id: selecteds.map(item => item.id).join(','),
      name: selecteds.map(item => item[mainColumnName]).join(','),
    };
    // 显示的表单项key
    let hiddenItemKey = parameter || relationColumnName || `${EMPTY_ITEM}_${id}`;
    // 有实体表的就使用id（因为getpageData时返回的key就是id）
    if (mainTableName) {
      hiddenItemKey = parameter || `${relationColumnName}_${id}`;
    }
    this.setState({
      formData: {
        ...formData,
        [relationColumnName]: data,
      },
    });
    form.setFieldsValue({
      [`${IGNORE_FORM_ITEM}${id}`]: selecteds.map(item => item[mainColumnName]).join(','),
      [hiddenItemKey]: selecteds.map(item => item.id).join(','),
    });
  };
  // 获取所有空间的默认值,只对于表单的中的控件
  // 判断全局变量是否有值，如果没有值，在去看是否是数据选择框，如果不是，直接取默认值
  getDefaultValueFromAllElements(element = []) {
    const { pageConfig, tabInfo, tabs, form } = this.props;
    const { elementMap = {} } = pageConfig;
    const elementList = elementMap[tabInfo.id];
    if (!elementList.length) return;
    let formElement = elementList.filter(item => !BTN_ELEMENT_TYPE.includes(item.basetype)) || [];
    formElement.map((item) => {
    // for (const item of formElement) {
      let {
        id,
        basetype,
        defaultValue,
        mainColumnName,
        mainTableName,
        relationTableName,
        relationColumnName,
        parameter,
      } = item;
      if (defaultValue) {
        if (
          (basetype === 3 && !isNaN(Number(defaultValue)))
        ) {
          let mainId = defaultValue;
          getNormalSearchDetail({
            tabSource: mainTableName,
            id: mainId,
          }).then(res => {
            // 显示的表单项key
            const showItemKey = `${IGNORE_FORM_ITEM}${id}`;
            // 显示的表单项key
            let hiddenItemKey = parameter || relationColumnName || `${EMPTY_ITEM}_${id}`;
            // 有实体表的就使用id（因为getpageData时返回的key就是id）
            if (mainTableName) {
              hiddenItemKey = parameter || `${relationColumnName}_${id}`;
            }
            form.setFieldsValue({
              [showItemKey]: res[mainColumnName] || '',
              [hiddenItemKey]: res.id || '',
            });
          });
        } else if (defaultValue && basetype === 45) {
          getCheckBoxSearchDetail({ tableName: mainTableName, ids: defaultValue }).then(
            res => {
              this.handleSetChecBoxValue(res, item);
            },
          );
        }
      }
      return item;
    });
  }
  // 直接删除多选便签
  deletteSetChecBoxValue = (selecteds, eleObj) => {
    const { form } = this.props;
    const {
      mainTableName: tabSource,
      relationColumnName,
      id,
      mainColumnName,
      mainTableName,
      parameter,
    } = eleObj;
    const { formData } = this.state;
    // 显示的表单项key
    let hiddenItemKey = parameter || relationColumnName || `${EMPTY_ITEM}_${id}`;
    // 有实体表的就使用id（因为getpageData时返回的key就是id）
    if (mainTableName) {
      hiddenItemKey = parameter || `${relationColumnName}_${id}`;
    }
    form.setFieldsValue({
      [`${IGNORE_FORM_ITEM}${id}`]: selecteds.name || '',
      [hiddenItemKey]: selecteds.id || '',
    });
    this.setState({
      formData: {
        ...formData,
        [relationColumnName]: selecteds,
      },
    });
  };
  // 根据控件类型生成对应控件
  setElementToWidget = eleObj => {
    const { functionData = {}, form, pageConfig } = this.props;
    const { formData } = this.state;
    const { filterMap } = pageConfig;
    const { basetype, readonly, mainTableName, mainColumnName, elementFormat, id, relationColumnType, defaultValue } = eleObj;
    const baseProps = {
      key: `${eleObj.relationColumnName}_${eleObj.id}`,
      disabled: !!readonly,
    };
    switch (basetype) {
      case 1:
        return (
          // 输入框
          <CInput {...baseProps} />
        );
      case 2:
        return (
          // 下拉框
          <CSelect {...baseProps}>{this.getOptions(eleObj)}</CSelect>
        );
      case 3:
        return (
          // 数据选择框
          <NormalSearchSelect
            {...baseProps}
            eleObj={eleObj}
            form={form}
            mainTableName={mainTableName}
            mainColumnName={mainColumnName}
            setSelected={selecteds => this.handleSetSelectSearchValue(selecteds, eleObj)}
          />
        );
      case 9:
        return (
          // 日期选择框
          <CDatePicker
            {...baseProps}
            format={TIME_FORMATE_TYPES[elementFormat || 1]}
            showTime={elementFormat !== 2}
            onChange={date => this.setHiddenValue(eleObj, date)}
          />
        );
      case 10:
        return (
          // 多行文本
          <CTextArea {...baseProps} />
        );
      case 17:
        return (
          // label
          <CInput {...baseProps} disabled={true} />
        );
      case 45:
        return (
          <CheckBoxSearchSelect
            isChangeClass={true}
            {...baseProps}
            eleObj={eleObj}
            filterMap={filterMap}
            form={form}
            multiple={true}
            valueObj={
              JSON.stringify(formData) !== '{}' && formData[eleObj.relationColumnName]
                ? formData[eleObj.relationColumnName]
                : {}
            }
            // handleClickValue={() => relationTabId && this.props.setPopupTabInfo(eleObj, formData)}
            // getGlobalVarValues={varName => getValueFromCurrentTabData(varName)}
            mainTableName={mainTableName}
            mainColumnName={mainColumnName}
            deleteTag={data => this.deletteSetChecBoxValue(data, eleObj)}
            setSelected={selecteds => this.handleSetChecBoxValue(selecteds, eleObj)}
          />
        );
      default:
        return <CInput {...baseProps} />;
    }
  };
  // 设置数据选择框的值
  handleSetSelectSearchValue = (selecteds = [], eleObj) => {
    const { form } = this.props;
    const selecctedData = selecteds[0] || {};
    const { relationColumnName, id, parameter, mainTableName, mainColumnName } = eleObj;
    // 显示的表单项key
    const showItemKey = `${IGNORE_FORM_ITEM}${id}`;
    // 显示的表单项key
    let hiddenItemKey = parameter || relationColumnName || `${EMPTY_ITEM}_${id}`;
    // 有实体表的就使用id（因为getpageData时返回的key就是id）
    if (mainTableName) {
      hiddenItemKey = parameter || `${relationColumnName}_${id}`;
    }
    form.setFieldsValue({
      [showItemKey]: selecctedData[mainColumnName] || '',
      [hiddenItemKey]: selecctedData.id || '',
    });
  };
  // 获取下拉框数据
  getOptions = eleObj => {
    const { tabDropDownList } = this.state;
    const { id } = eleObj;
    const optionData = tabDropDownList[id] || [];
    // 只显示下拉数据有id和name的项，否则不显示
    return optionData
      .filter(item => item.name && item.id)
      .map(item => (
        <Option value={item.id} key={`select_option_${item.id}`}>
          {item.name}
        </Option>
      ));
  };
  // 修改表象控件时对应修改隐藏真实值的控件
  setHiddenValue = (eleObj, eleValue) => {
    const { relationColumnName, parameter, mainTableName, id } = eleObj;
    const value = setElementToValue(eleObj, eleValue);
    // 显示的表单项key
    let hiddenItemKey = parameter || relationColumnName || `${EMPTY_ITEM}_${id}`;
    // 有实体表的就使用id（因为getpageData时返回的key就是id）
    if (mainTableName) {
      hiddenItemKey = parameter || `${relationColumnName}_${id}`;
    }
    this.props.form.setFieldsValue({
      [hiddenItemKey]: value,
    });
  };
  // 生成隐藏表单项
  setHiddenItem = eleObj => {
    const { form, userInfo, formData } = this.props;
    const { getFieldDecorator } = form;
    const {
      relationColumnName,
      mainTableName,
      displayName,
      requisite,
      id,
      parameter,
      defaultValue,
      basetype,
    } = eleObj;
    // 显示的表单项key
    let showItemKey = relationColumnName
      ? `${IGNORE_FORM_ITEM}${relationColumnName}`
      : `${EMPTY_ITEM}_${id}`;
    let hiddenItemKey = parameter || relationColumnName || `${EMPTY_ITEM}_${id}`;
    // 有实体表的就使用id（因为getpageData时返回的key就是id）
    if (mainTableName) {
      showItemKey = `${IGNORE_FORM_ITEM}${id}`;
      hiddenItemKey = parameter || `${relationColumnName}_${id}`;
    }

    const initialValue =
      getValueFromGlobalVariables({
        globalVar: defaultValue,
        eleObj,
        treeNodeData: '',
        isRealValue: false,
        userInfo,
      }) || '';
    console.log(userInfo);
    return (
      <Fragment>
        <Form.Item // 显示的控件
          label={displayName}
        >
          {getFieldDecorator(showItemKey, {
            initialValue: initialValue,
            rules: [
              {
                required: !!requisite,
                message: <FormattedMessage id="global.required" />,
              },
            ],
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
        <div className="hide">
          {/* <div> */}
          <Form.Item // 隐藏的实际值控件
            label={displayName}
          >
            {getFieldDecorator(hiddenItemKey, {
              initialValue:
                getValueFromGlobalVariables({
                  globalVar: defaultValue,
                  treeNodeData: '',
                  eleObj,
                  userInfo,
                }) ||
                defaultValue ||
                '',
              rules: [
                {
                  required: !!requisite,
                  message: <FormattedMessage id="global.required" />,
                },
              ],
            })(<CInput />)}
          </Form.Item>
        </div>
      </Fragment>
    );
  };
  // 根据类型生成表单项
  setItem = eleObj => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      relationColumnName,
      parameter,
      displayName,
      columnSpan,
      requisite,
      basetype,
      id,
      visiabled,
      defaultValue,
      mainTableName,
      mainColumnName,
    } = eleObj;
    let SingleItem = null;
    if (HIDDEN_ELEMENT_TYPE.includes(basetype)) {
      // 需要生成隐藏表单项的控件
      SingleItem = this.setHiddenItem(eleObj);
    } else {
      const { form, userInfo } = this.props;
      const initialValue =
      getValueFromGlobalVariables({
        globalVar: defaultValue,
        eleObj,
        treeNodeData: '',
        userInfo,
        isRealValue: false,
      }) || defaultValue;
      SingleItem = (
        <Form.Item label={displayName}>
          {getFieldDecorator(parameter || relationColumnName || `${id}`, {
            initialValue,
            rules: [
              {
                required: !!requisite,
                message: <FormattedMessage id="global.required" />,
              },
            ],
          })(this.setElementToWidget(eleObj))}
        </Form.Item>
      );
    }
    const span = (columnSpan && columnSpan > 100) || !columnSpan ? 8 : columnSpan;
    return (
      <Col span={span} key={relationColumnName} className={visiabled ? '' : 'hide'}>
        {SingleItem}
      </Col>
    );
  };
  // 生成表单项
  getFormItem = () => {
    const { pageConfig = {}, tabInfo = {} } = this.props;
    const { elementMap = {} } = pageConfig;
    if (!tabInfo.id) return;
    const elementList = elementMap[tabInfo.id] || [];
    return elementList
      .filter(item => !BTN_ELEMENT_TYPE.includes(item.basetype))
      .map(item => {
        return this.setItem(item);
      });
  };
  // 生成查询按钮
  renderSearchBtn = () => {
    const { pageConfig = {}, tabInfo = {} } = this.props;
    const { elementMap = {} } = pageConfig;
    if (!tabInfo.id) return;
    const elementList = elementMap[tabInfo.id] || [];
    const searchBtn = elementList.find(item => item.basetype === 23);
    if (!searchBtn) return null;
    return (
      <CButton type="primary" onClick={this.handleSearch}>
        {searchBtn.displayName}
      </CButton>
    );
  };
  // 查询
  handleSearch = () => {
    const { form, setSearchResult, tabInfo, pageConfig = {}, userInfo } = this.props;

    const { elementMap = {} } = pageConfig;
    const elementList = elementMap[tabInfo.id] || [];

    form.validateFieldsAndScroll((errs, values) => {
      if (errs) return;
      const params = filterHiddenFormData(values);

      elementList.forEach(item => {
        const { defaultValue, parameter } = item;
        if (item.defaultValue && isGlobalOrCustomVar(item.defaultValue)) {
          params[parameter] = getValueFromGlobalVariables({
            userInfo,
            globalVar: defaultValue,
          });
        }
      });

      const result = {};
      Object.keys(params).forEach(item => {
        if (params[item] !== undefined) {
          result[item] = params[item];
        }
      });
      setSearchResult(tabInfo, result);
    });
  };

  render() {
    const formCls = classNames({
      [formStyles.wrap]: true,
      [styles.formWrap]: true,
    });
    return (
      <div className={styles.rootWrap}>
        <div className={formCls}>
          <Form colon={false}>
            <Row>{this.getFormItem()}</Row>
          </Form>
        </div>
        <div className={styles.searchWrap}>{this.renderSearchBtn()}</div>
      </div>
    );
  }
}

export default Form.create()(SearchFilter);
