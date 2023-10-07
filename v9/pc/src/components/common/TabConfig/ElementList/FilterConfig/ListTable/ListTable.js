/*
 * @Author: Fus
 * @Date:   2019-11-05 09:07:18
 * @Desc: 过滤器列表
 */
import {
  CButton,
  CInput,
  CSelect,
  CTable,
  CTextArea,
  SearchSelect,
} from '@/components/common/BasicWidgets';
import { FILTER_CONFIG_VALUE_TYPE, TAB_FILTER_COND_TYPES } from '@/constants/pageConfig';
import { Select } from 'antd';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './ListTable.less';

const { Option } = Select;
// 值类型下拉选项
const valueTypeOptions = Object.keys(FILTER_CONFIG_VALUE_TYPE).map(item => (
  <Option key={item} value={+item}>
    <FormattedMessage id={FILTER_CONFIG_VALUE_TYPE[item]} />
  </Option>
));
// 关系下拉选项
const condTypeOptions = TAB_FILTER_COND_TYPES.map(item => (
  <Option key={item} value={item}>
    {item}
  </Option>
));

class ListTable extends Component {
  // 更新数据行
  setRowData = ({ key, value, index, record }) => {
    const { listData = [] } = this.props;
    const newList = [...listData];
    newList.splice(index, 1, {
      ...record,
      [key]: value,
    });
    this.updateState(newList);
  };
  // 设置字段名
  setColumnName = (selectedRows, record, index) => {
    const selected = (selectedRows[0] && selectedRows[0]) || {};
    const { listData = [] } = this.props;
    const newList = [...listData];
    newList.splice(index, 1, {
      ...record,
      asqlColumnName: selected.columnName || '',
      relationColumnType: selected.columnType,
    });
    this.updateState(newList);
  };
  // 新增数据
  handleAddRow = index => {
    const { listData = [] } = this.props;
    const newList = [...listData];
    newList.splice(newList.length, 0, {
      index: newList.length,
      asqlWholeCondition: 'test',
    });
    this.updateState(newList);
  };
  // 删除数据
  handleMinusRow = index => {
    const { listData = [] } = this.props;
    const newList = [...listData];
    newList.splice(index, 1);
    this.updateState(newList);
  };
  // 更新state
  updateState = listData => {
    this.props.updateWrapState({ listData });
  };
  getColumns = () => {
    const { elementData } = this.props;
    return [
      {
        dataIndex: 'asqlLeftParenTheses',
        key: 'asqlLeftParenTheses',
        title: <FormattedMessage id="tab.filterCond.leftBracket" />,
        width: 100,
        render: (text, record, index) => (
          <CInput
            value={text}
            onChange={e =>
              this.setRowData({
                key: 'asqlLeftParenTheses',
                value: e.target.value.trim(),
                record,
                index,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'asqlColumnName',
        key: 'asqlColumnName',
        title: <FormattedMessage id="tab.filterCond.columnName" />,
        width: 150,
        render: (text, record, index) => (
          <SearchSelect
            value={text}
            modalContentType="tableColumn"
            showType="list"
            otherQueryParams={{ tableName: elementData.mainTableName }}
            selectConfig={{
              isMulti: false,
              keyName: 'columnName',
            }}
            setSelected={selectedRows => this.setColumnName(selectedRows, record, index)}
          />
        ),
      },
      {
        dataIndex: 'asqlDecisionOperator',
        title: <FormattedMessage id="tab.filterCond.cond" />,
        width: 100,
        render: (text, record, index) => (
          <CInput
            value={text}
            onChange={e =>
              this.setRowData({
                key: 'asqlDecisionOperator',
                value: e.target.value.trim(),
                record,
                index,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'asqlValueType',
        title: <FormattedMessage id="tab.filterCond.valueType" />,
        width: 100,
        render: (text, record, index) => (
          <CSelect
            value={text}
            style={{ width: '100%' }}
            onChange={value =>
              this.setRowData({
                key: 'asqlValueType',
                value: +value,
                record,
                index,
              })
            }
          >
            {valueTypeOptions}
          </CSelect>
        ),
      },
      {
        dataIndex: 'asqlValue',
        title: <FormattedMessage id="tab.filterCond.value" />,
        width: 200,
        render: (text, record, index) => {
          return record.asqlValueType === 3 ? (
            <CTextArea
              value={text}
              onChange={e =>
                this.setRowData({
                  key: 'asqlValue',
                  value: e.target.value,
                  record,
                  index,
                })
              }
            />
          ) : (
            <CInput
              value={text}
              onChange={e =>
                this.setRowData({
                  key: 'asqlValue',
                  value: e.target.value,
                  record,
                  index,
                })
              }
            />
          );
        },
      },
      {
        dataIndex: 'asqlRightParenTheses',
        title: <FormattedMessage id="tab.filterCond.rightBracket" />,
        width: 100,

        render: (text, record, index) => (
          <CInput
            value={text}
            onChange={e =>
              this.setRowData({
                key: 'asqlRightParenTheses',
                value: e.target.value.trim(),
                record,
                index,
              })
            }
          />
        ),
      },
      {
        dataIndex: 'asqlRelationalOperator',
        title: <FormattedMessage id="tab.filterCond.relation" />,
        width: 100,
        render: (text, record, index) => (
          <CSelect
            value={text}
            style={{ width: '100%' }}
            onChange={value =>
              this.setRowData({
                key: 'asqlRelationalOperator',
                value,
                record,
                index,
              })
            }
          >
            <Option value="">
              <FormattedMessage id="global.null" />
            </Option>
            {condTypeOptions}
          </CSelect>
        ),
      },
      {
        dataIndex: 'operator',
        title: <FormattedMessage id="global.operator" />,
        width: 100,
        render: (text, record, index) => (
          <div className={styles.operator}>
            {/* <span onClick={() => this.handleAddRow(index)} className="iconfont icon-add-border custom-color" /> */}
            <span
              onClick={() => this.handleMinusRow(index)}
              className="iconfont icon-minus-border custom-color"
            />
          </div>
        ),
      },
    ];
  };

  render() {
    const { listData } = this.props;
    return (
      <div className={styles.wrap}>
        <CButton className={styles.addBtn} onClick={this.handleAddRow}>
          <i className="iconfont icon-add-border custom-color" />
          <FormattedMessage id="global.add" />
        </CButton>
        <CTable
          columns={this.getColumns()}
          dataSource={listData}
          className={`${styles.table} system__lineBorder`}
          pagination={false}
          rowKey="index"
        />
      </div>
    );
  }
}

export default ListTable;
