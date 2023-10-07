import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import copy from 'copy-to-clipboard';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import { Tooltip, Icon, Select } from 'antd';
import {
  CMessage,
  CButton,
  CTextArea,
  CTable,
  ColorPicker
} from '@/components/common/BasicWidgets';
import { BaseContext } from '@/constants/global';
import { JSON_TEMPLATE_CONDITION } from '@/constants/triggerState';
import styles from './FieldColorConfig.less';

class FieldColorConfig extends Component {
  static contextType = BaseContext;

  static getDerivedStateFromProps(nextProps, state) {
    const { conditionJsonConfig = '[]' } = nextProps;
    if (conditionJsonConfig && conditionJsonConfig !== state.prevPropsConfig) {
      return {
        elementConfig: JSON.parse(conditionJsonConfig),
        prevPropsConfig: conditionJsonConfig
      };
    }
    return null;
  }

  state = {
    visibleHelpConfig: false, // 默认弹框隐藏
    elementConfig: [], // 帮助配置
    prevPropsConfig: '[]',
    loading: false,
  };

  setModalShow = () => {
    this.setState({
      visibleHelpConfig: true,
    });
  };
  // 复制模板
  handleCopyTemplate = (template) => {
    const { langLib } = this.context;
    if (copy(template)) {
      CMessage(langLib['message.copy.success']);
    } else {
      CMessage(langLib['message.copy.error']);
    }
  };

  // 删除数据
  handleMinusRow = (index) => {
    const { elementConfig } = this.state;
    const newList = [...elementConfig];
    newList.splice(index, 1);
    this.setState({ elementConfig: newList });
  };

  // 新增数据
  handleAddRow = () => {
    const { elementConfig } = this.state;
    const newList = [...elementConfig];
    newList.push({
      preconditions: '',
      bgColor: '#4689f5',
      color: '#fff',
      sno: newList.length + 1
    });
    this.setState({
      elementConfig: newList
    }, () => {
      console.log(this.state.elementConfig);
    })
  };
  // 更新数据
  setRowData = ({ key, value, index, subKey, subValue }) => {
    const { elementConfig } = this.state;
    const newList = [...elementConfig];
    newList[index] = {
      ...newList[index],
      [key]: value,
      [subKey]: subValue,
    };
    this.setState({
      elementConfig: newList
    });
  };

  handleSave = (v, index, key) => {
    const { elementConfig } = this.state;
    const newList = [...elementConfig];
    newList[index] = {
      ...newList[index],
      [key]: v
    };
    this.setState({
      elementConfig: newList
    });
  }
  // 关联菜单表头
  getMenuColumns = () => {
    return [
      {
        dataIndex: 'preconditions',
        title: <Fragment>
          <Tooltip
            title={(
              <Fragment>
                <FormattedMessage id="global.template"/>
                <span className={styles.copyEntry} onClick={() => this.handleCopyTemplate(JSON_TEMPLATE_CONDITION)}>
                  <FormattedMessage id="global.clickToCopy"/>
                </span>
                {JSON_TEMPLATE_CONDITION}
              </Fragment>
            )}
          >
            <div>
              <span>颜色显示条件</span>
              <Icon type="question-circle" className={styles.tip}/>
            </div>
          </Tooltip>
        </Fragment>,
        width: '45%',
        render: (text, record, index) => {
          return <CTextArea value={text} onChange={(e) => {
            this.setRowData({
              key: 'preconditions',
              value: e.target.value,
              index,
            });
          }}></CTextArea>;
        },
      },
      {
        dataIndex: 'bgColor',
        title: <Fragment>背景色</Fragment>,
        render: (text, record, index) => {
          return (
            <ColorPicker
              handleSaveColor={(v) => this.handleSave(v, index, 'bgColor')}
            >
              <div className={styles.colorBorder}>
                <div
                  className={styles.colorWrap}
                  style={{ backgroundColor: record.bgColor}}></div>
              </div>
            </ColorPicker>
          )
        },
      },{
        dataIndex: 'color',
        title: <Fragment>颜色值</Fragment>,
        render: (text, record, index) => {
          return (
            <ColorPicker
              handleSaveColor={(v) => this.handleSave(v, index, 'color')}
            >
              <div className={styles.colorBorder}>
                <div
                  className={styles.colorWrap}
                  style={{ backgroundColor: record.color}}></div>
              </div>
            </ColorPicker>
          )
        },
      }, {
        dataIndex: 'ignore-operator',
        title: <FormattedMessage id="global.operator"/>,
        render: (text, record, index) => (
          <div className={styles.operator}>
            <span
              onClick={() => this.handleMinusRow(index)}
              className="iconfont icon-minus-border custom-color"
            />
          </div>
        ),
      },
    ];
  };
  handleOk = () => {
    const { elementConfig = [] } = this.state;
    const { setRowData, record, index} = this.props;
    setRowData({
      key: 'conditionjsonconfig',
      value: JSON.stringify(elementConfig),
      record,
      index,
    });
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      visibleHelpConfig: false,
      elementConfig: [], // 帮助配置
      prevPropsConfig: '[]',
    })
  }

  render() {
    const { visibleHelpConfig, elementConfig, loading } = this.state;
    const { form } = this.props;
    const boxWrap = {
      width: '100%',
      height: '100%',
      overflowY: 'scroll',
      paddingTop: '20px',
    };
    return <CreateModal // 帮助信息设置
      visible={visibleHelpConfig}
      destroyOnClose={true}
      onCancel={() => this.handleCancel()}
      footer={[
        <CButton key='cancel' type='default'
                 onClick={() => this.handleCancel()}>
          <FormattedMessage id='global.cancel' />
        </CButton>, <CButton key='submit' loading={loading} type='primary' onClick={() => this.handleOk()}>
          <FormattedMessage id='global.ok' />
        </CButton>]}
      title='颜色配置'
    >
      <div className={styles.wrap}>
        <CButton className={styles.addBtn} onClick={this.handleAddRow}>
          <FormattedMessage id='global.addData' />
        </CButton>
        <div className={styles.tableWrap}>
          <CTable
            columns={this.getMenuColumns()}
            dataSource={elementConfig}
            loading={loading}
            pagination={false}
            rowKey='sno'
          />
        </div>
      </div>
    </CreateModal>;
  }
}

export default FieldColorConfig;
