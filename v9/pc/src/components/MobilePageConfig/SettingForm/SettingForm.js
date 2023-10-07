/*
 * @Author: Fus
 * @Date:   2019-08-08 11:45:17
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-12 16:57:49
 * @Desc: 高级设置的表单
 */
import { CInput, CSelect, SearchSelect } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
// import TriggerConfig from '@/components/common/TriggerConfig/TriggerConfig';
import { ELEMENT_DETAIL_CONFIG, RELATION_COLUMN_TYPE } from '@/constants/element';
import { BOOL_TYPE, BOOL_VALUE_MAP } from '@/constants/global';
import { Radio, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import styles from './SettingForm.less';

const RadioGroup = Radio.Group;
const { Option } = Select;
// 是否的选择项
const boolOptions = BOOL_TYPE.map(item => (
  <Radio value={BOOL_VALUE_MAP[item]} key={`bool_${BOOL_VALUE_MAP[item]}`}>
    <FormattedMessage id={item} />
  </Radio>
));
// 字段值类型
const relationColumnTypeOptions = Object.keys(RELATION_COLUMN_TYPE).map(item => (
  <Option value={+item} key={`columnType_${RELATION_COLUMN_TYPE[item]}`}>
    {RELATION_COLUMN_TYPE[item]}
  </Option>
));

class SettingForm extends FormItems {
  static defaultProps = {
    fromType: 'pageConfig', // 调用处类型  pageConfig预设界面  framePageConfig设计组菜单
  };
  // 业务表字段修改
  handleChangeRelationColumnName = selectedRows => {
    const { setRowData, activeRowIndex, activeRow = {} } = this.props;
    const selected = (selectedRows[0] && selectedRows[0]) || {};
    setRowData({
      key: 'relationColumnName',
      value: selected.columnName || '',
      record: activeRow,
      index: activeRowIndex,
    });
    // 设置业务表字段类型
    setRowData({
      key: 'relationColumnType',
      value: selected.columnType || '',
      record: {
        ...activeRow,
        relationColumnName: selected.columnName || '',
      },
      index: activeRowIndex,
    });
  };
  getFormConfigs = () => {
    const {
      setRowData,
      activeRowIndex,
      activeRow = {},
      tabInfo,
      form,
      doSaveFrameTab,
      fromType = 'pageConfig',
    } = this.props;
    const triggerDisabled = fromType === 'pageConfig';
    const { basetype } = activeRow;
    return [
      {
        key: 'ignore-defaultValue',
        label: <FormattedMessage id="settingForm.defaultValue" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.defaultValue || '',
        },
        component: (
          <CInput
            onChange={e =>
              setRowData({
                key: 'defaultValue',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-placeholderText',
        label: <FormattedMessage id="settingForm.placeholderText" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.placeholderText || '',
        },
        component: (
          <CInput
            onChange={e =>
              setRowData({
                key: 'placeholderText',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-tooltipText',
        label: <FormattedMessage id="settingForm.tooltipText" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.tooltipText || '',
        },
        component: (
          <CInput
            onChange={e =>
              setRowData({
                key: 'tooltipText',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-mainTableName',
        label: <FormattedMessage id="settingForm.mainTableName" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.mainTableName || '',
        },
        ignore: ELEMENT_DETAIL_CONFIG.hasMainTable.indexOf(basetype) === -1,
        component: (
          <SearchSelect
            modalContentType="relateTable"
            showType="list"
            setSelected={selectedRows =>
              setRowData({
                key: 'mainTableName',
                value: (selectedRows[0] && selectedRows[0].tableName) || '',
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-mainColumnName',
        label: <FormattedMessage id="settingForm.mainColumnName" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.mainColumnName || '',
        },
        ignore: ELEMENT_DETAIL_CONFIG.hasMainTable.indexOf(basetype) === -1,
        component: (
          <SearchSelect
            modalContentType="tableColumn"
            showType="list"
            otherQueryParams={{ tableName: activeRow.mainTableName }}
            selectConfig={{
              isMulti: false,
              keyName: 'columnName',
            }}
            setSelected={selectedRows =>
              setRowData({
                key: 'mainColumnName',
                value: (selectedRows[0] && selectedRows[0].columnName) || '',
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-relationTableName',
        label: <FormattedMessage id="settingForm.relationTableName" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.relationTableName || '',
        },
        component: (
          <SearchSelect
            modalContentType="relateTable"
            showType="list"
            otherQueryParams={{ initialData: 0 }}
            setSelected={selectedRows =>
              setRowData({
                key: 'relationTableName',
                value: (selectedRows[0] && selectedRows[0].tableName) || '',
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-relationColumnName',
        label: <FormattedMessage id="settingForm.relationColumnName" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.relationColumnName || '',
        },
        ignore: ELEMENT_DETAIL_CONFIG.noRelationColumnName.indexOf(basetype) !== -1,
        component: (
          <SearchSelect
            modalContentType="tableColumn"
            showType="list"
            otherQueryParams={{ tableName: activeRow.relationTableName }}
            selectConfig={{
              isMulti: false,
              keyName: 'columnName',
            }}
            setSelected={this.handleChangeRelationColumnName}
          />
        ),
      },
      {
        key: 'relationColumnType',
        label: <FormattedMessage id="settingForm.relationColumnType" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.relationColumnType || '',
        },
        ignore: ELEMENT_DETAIL_CONFIG.noRelationColumnName.indexOf(basetype) !== -1,
        component: (
          <CSelect
            disabled
            // onChange={value => setRowData({
            //   key: 'relationColumnType',
            //   value,
            //   record: activeRow,
            //   index: activeRowIndex,
            // })}
          >
            {relationColumnTypeOptions}
          </CSelect>
        ),
      },
      {
        key: 'ignore-relationTabId',
        label: <FormattedMessage id="settingForm.relationTabId" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.relationTabId || '',
        },
        ignore:
          tabInfo.showType === 1 || tabInfo.showType === 4
            ? false
            : ELEMENT_DETAIL_CONFIG.hasRelationTab.indexOf(basetype) === -1,
        component: (
          <SearchSelect
            modalContentType="relateTable"
            isReadOnly={true}
            showType="list"
            setSelected={selectedRows =>
              setRowData({
                key: 'relationTabId',
                value: (selectedRows[0] && selectedRows[0].tableName) || '',
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
      {
        key: 'ignore-quickQuery',
        label: <FormattedMessage id="settingForm.quickQuery" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.quickQuery,
        },
        component: (
          <RadioGroup
            onChange={e =>
              setRowData({
                key: 'quickQuery',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          >
            {boolOptions}
          </RadioGroup>
        ),
      },
      {
        key: 'ignore-advancedQuery',
        label: <FormattedMessage id="settingForm.advancedQuery" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.advancedQuery,
        },
        component: (
          <RadioGroup
            onChange={e =>
              setRowData({
                key: 'advancedQuery',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          >
            {boolOptions}
          </RadioGroup>
        ),
      },
      {
        key: 'canDisplayName',
        label: <FormattedMessage id="settingForm.canDisplayName" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.canDisplayName,
        },
        component: (
          <RadioGroup
            onChange={e =>
              setRowData({
                key: 'canDisplayName',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          >
            {boolOptions}
          </RadioGroup>
        ),
      },
      {
        key: 'ignore-parameter',
        label: <FormattedMessage id="settingForm.parameter" />,
        colSpan: 8,
        config: {
          initialValue: activeRow.parameter || '',
        },
        component: (
          <CInput
            onBlur={e =>
              setRowData({
                key: 'parameter',
                value: e.target.value,
                record: activeRow,
                index: activeRowIndex,
              })
            }
          />
        ),
      },
    ];
  };
  render() {
    const { activeRow = {}, tabInfo, form, doSaveFrameTab } = this.props;
    return (
      <div className={styles.wrap}>
        <FormItems formConfigs={this.getFormConfigs()} form={form} loading={false} />
        <div className={`${styles.triggerWrap} system__lineBorder--top`}>
          <div className={`${styles.trigger} ${styles.disabled}`}>
            <span className="iconfont icon-trigger-blocker" />
            <FormattedMessage id="settingForm.interceptorId" />
          </div>
          <div className={`${styles.trigger} ${styles.disabled}`}>
            <span className="iconfont icon-trigger-filter" />
            <FormattedMessage id="settingForm.filterId" />
          </div>
          <div className={`${styles.trigger} ${styles.disabled}`}>
            <span className="iconfont icon-trigger-watcher" />
            <FormattedMessage id="settingForm.watcherId" />
          </div>
          {/* <TriggerConfig
            readOnly={true}
            elementData={activeRow}
            tabInfo={tabInfo}
            doSaveFrameTab={doSaveFrameTab}
          > */}
          <div className={`${styles.trigger} ${styles.disabled}`}>
            <span className="iconfont icon-trigger-strike" />
            <FormattedMessage id="settingForm.triggerId" />
          </div>
          {/* </TriggerConfig> */}
        </div>
      </div>
    );
  }
}

export default SettingForm;
