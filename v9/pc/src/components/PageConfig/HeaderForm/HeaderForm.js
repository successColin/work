/*
 * @Author: Fus
 * @Date:   2019-08-07 14:24:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-20 08:52:30
 * @Desc: 头部表单
 */
import { CInput, CSelect, SearchSelect } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import { PAGE_TAB_TYPE } from '@/constants/pageConfig';
import { Button, Select } from 'antd';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './HeaderForm.less';

const { Option } = Select;
// 面板类型下拉项
const pageTabTypeOptions = Object.keys(PAGE_TAB_TYPE).map(item => (
  <Option key={`tabType-${item}`} value={+item}>
    <FormattedMessage id={PAGE_TAB_TYPE[item]} />
  </Option>
));

class HeaderForm extends Component {
  // 根据选择的关联表，回填
  setRelateTables = selected => {
    const { tableName } = selected[0] || {};
    this.props.form.setFieldsValue({
      relationTableName: tableName,
    });
    this.setTabInfo('relationTableName', tableName);
  };
  // 更新数据
  setTabInfo = (key, value) => {
    this.props.updateFrameState({
      activeDetail: {
        ...this.props.activeDetail,
        [key]: value,
      },
    });
  };
  // 生成表单配置文件
  getFormConfigs = () => {
    const { activeDetail: data = {} } = this.props;
    this.props.form.resetFields();
    return [
      {
        key: 'name',
        label: <FormattedMessage id="pageConfig.tab.name" />,
        colSpan: 8,
        config: {
          // rules: [{
          //   required: true,
          //   message: VALID_REQUIRED_MESSAGE,
          // }, {
          //   whitespace: true,
          //   message: getValidateMessage('whitespace'),
          // }],
          initialValue: data.name,
        },
        component: <CInput onChange={e => this.setTabInfo('name', e.target.value)} />,
      },
      {
        key: 'basetype',
        label: <FormattedMessage id="pageConfig.tab.type" />,
        colSpan: 8,
        config: {
          initialValue: +data.basetype || '',
        },
        component: (
          <CSelect onChange={val => this.setTabInfo('basetype', val)}>{pageTabTypeOptions}</CSelect>
        ),
      },
      {
        key: 'relationTableName',
        label: <FormattedMessage id="pageConfig.tab.originData" />,
        colSpan: 8,
        config: {
          initialValue: data.relationTableName,
        },
        component: (
          <SearchSelect
            modalContentType="relateTable"
            showType="list"
            otherQueryParams={{ initialData: 0 }}
            setSelected={selected =>
              this.setTabInfo('relationTableName', selected.length ? selected[0].tableName : '')
            }
          />
        ),
      },
    ];
  };
  render() {
    const { form, setContentState } = this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.leftForm}>
          <FormItems formConfigs={this.getFormConfigs()} form={form} loading={false} />
        </div>
        <div className={`${styles.rightWrap}`}>
          <Button
            onClick={() => setContentState({ visibleDrawer: true })}
            className="custom-btn system__defaultButton"
          >
            <span className="iconfont icon-to-open" />
            <FormattedMessage id="to.open.eleLib" />
          </Button>
        </div>
      </div>
    );
  }
}
export default HeaderForm;
