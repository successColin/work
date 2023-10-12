/*
 * @Author: Fus
 * @Date:   2020-02-07 10:18:18
 * @Desc: 版本详情
 */
import {
  CButton,
  CInput,
  ColorPicker,
  CTable,
  SearchSelect,
} from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import { VALID_REQUIRED_MESSAGE } from '@/constants/global';
import { Component } from 'react';
import styles from './DetailForm.less';

class DetailForm extends Component {
  getFormConfigs = () => {
    const { activeDetail = {}, listChildData } = this.props;
    console.log(listChildData);
    return [
      {
        key: 'name',
        label: '名称',
        config: {
          initialValue: activeDetail.name,
          rules: [
            {
              required: true,
              message: VALID_REQUIRED_MESSAGE,
            },
          ],
        },
        colSpan: 12,
        component: <CInput />,
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
      },
      {
        key: 'tableName',
        label: '表名',
        config: {
          initialValue: activeDetail.tableName,
          rules: [
            {
              required: true,
              message: VALID_REQUIRED_MESSAGE,
            },
          ],
        },
        colSpan: 12,
        component: (
          <SearchSelect
            modalContentType="relateTable"
            showType="list"
            setSelected={this.setRelateTables}
          />
        ),
      },
      {
        key: 'columnName',
        label: '字段',
        config: {
          initialValue: activeDetail.columnName,
          rules: [
            {
              required: true,
              message: VALID_REQUIRED_MESSAGE,
            },
          ],
        },
        colSpan: 12,
        component: (
          <SearchSelect
            modalContentType="tableColumn"
            showType="list"
            otherQueryParams={{ tableName: activeDetail.tableName }}
            selectConfig={{
              isMulti: false,
              keyName: 'columnName',
            }}
            setSelected={this.setRelateColumn}
          />
        ),
      },
    ];
  };
  // 添加数据
  handleAdd = () => {
    const { listChildData, changeDate } = this.props;
    console.log(listChildData, changeDate);
    listChildData.push({
      value: '',
      iconName: '',
      iconColor: '',
      fontColor: '',
    });
    changeDate({
      listChildData,
    });
  };
  // 表名
  setRelateTables = selected => {
    const { changeDate, activeDetail } = this.props;
    const { tableName = '' } = selected[0] || {};
    activeDetail.tableName = tableName;
    activeDetail.columnName = '';
    changeDate(activeDetail);
  };
  setRelateColumn = selected => {
    const { changeDate, activeDetail } = this.props;
    const { columnName = '' } = selected[0] || {};
    activeDetail.columnName = columnName;
    changeDate(activeDetail);
  };
  // 删除数据
  handleDelete = index => {
    const { listChildData, changeDate } = this.props;
    listChildData.splice(index, 1);
    changeDate({ listChildData });
  };
  // 选择图标
  setIcon = selected => {
    const { index, record, selectedRows, key } = selected;
    const { name } = selectedRows[0] || {};
    this.setRowData({
      key,
      value: name,
      record,
      index,
    });
  };
  // 更新数据行
  setRowData = ({ key, value, record, index }) => {
    console.log(key, value, record, index);
    const { listChildData, changeDate } = this.props;
    const arr = [...listChildData];
    arr[index] = {
      ...record,
      [key]: value,
    };
    changeDate({ listChildData: arr });
  };
  getColumns = () => {
    return [
      {
        title: '序号',
        width: 60,
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: '值',
        dataIndex: 'value',
        width: 150,
        render: (text, record, index) => (
          <CInput
            onChange={e =>
              this.setRowData({
                key: 'value',
                value: e.target.value,
                record,
                index,
              })
            }
            value={text}
          />
        ),
      },
      {
        title: '图标',
        dataIndex: 'iconName',
        width: 180,
        render: (text, record, index) => (
          <SearchSelect
            modalContentType="icon"
            showType="icon"
            setSelected={this.setIcon}
            value={text}
            otherParam={{
              key: 'iconName',
              record,
              index,
            }}
          />
        ),
      },
      {
        title: '图标颜色',
        dataIndex: 'iconColor',
        render: (text, record, index) => (
          <ColorPicker
            placement="right"
            color={text || ''}
            handleSaveColor={value =>
              this.setRowData({
                key: 'iconColor',
                value,
                record,
                index,
              })
            }
          >
            <CInput
              value={text || ''}
              onChange={e =>
                this.setRowData({
                  key: 'iconColor',
                  value: e.target.value,
                  record,
                  index,
                })
              }
            />
          </ColorPicker>
        ),
      },
      {
        title: '字体颜色',
        dataIndex: 'fontColor',
        render: (text, record, index) => (
          <ColorPicker
            placement="right"
            color={text || ''}
            handleSaveColor={value =>
              this.setRowData({
                key: 'fontColor',
                value,
                record: record,
                index: index,
              })
            }
          >
            <CInput
              value={text || ''}
              onChange={e =>
                this.setRowData({
                  key: 'fontColor',
                  value: e.target.value,
                  record: record,
                  index: index,
                })
              }
            />
          </ColorPicker>
        ),
      },
      {
        title: '操作',
        width: 50,
        render: (text, record, index) => (
          <span key={index}>
            <i
              className="iconfont icondelete custom-color"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.handleDelete(index);
              }}
            />
          </span>
        ),
      },
    ];
  };
  render() {
    const { form, loadingGetDetail, listChildData } = this.props;
    return (
      <div style={{ marginTop: 20 }}>
        {/* 表单内容 */}
        <FormItems formConfigs={this.getFormConfigs()} form={form} loading={loadingGetDetail} />
        {/* 按钮 */}
        <section className={styles.box}>
          <CButton onClick={this.handleAdd} isDefault={true}>
            <i className={`iconfont icondelete custom-color ${styles.iconfont}`} />
            新增
          </CButton>
          <CTable
            className={styles.tableClass}
            columns={this.getColumns()}
            dataSource={listChildData}
            pagination={false}
          />
        </section>
      </div>
    );
  }
}
export default DetailForm;
