/*
 * @Author: ytx
 * @Date: 2021-03-21 9:20:23
 * @Desc: 资讯管理
 */
import { CButton, CMessage, CSearch, CTable } from '@/components/common/BasicWidgets';
import CModal from '@/components/common/CreateModal/CreateModal';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import {
  addConsulting,
  deleteConsulting,
  editorConsulting,
  enabledApi,
  getList,
  topApi,
} from '@/services/consultingManagement';
import { getDefaultConfirmProps } from '@/utils/common';
import { Button, Form, Pagination, Switch } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './ConsultingManagement.less';
import FormData from './FormData/FormData';

const initQueryParams = {
  pageNum: 1,
  pageSize: 10,
};

class ConsultingManagement extends Component {
  static contextType = BaseContext;
  state = {
    listData: [], // 数据源
    total: 0,
    loading: false,
    queryParams: initQueryParams, // 获取列表的传参
    keywords: '', // 关键字
    selected: [], // 选中的行
    selectedObj: {}, // 选中的行

    visible: false, // 弹框
    modalTitle: '', // 弹框名字
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {}

  // 获取列表数据
  fetchData = () => {
    const { queryParams, keywords } = this.state;
    const reqParams = {
      ...queryParams,
      keywords,
    };
    this.setState({ loading: true });
    getList(reqParams).then(
      res => {
        console.log(res);
        const { list, total } = res;
        this.setState({ listData: list, total, loading: false });
      },
      err => this.setState({ loading: false }),
    );
  };

  // 新增
  handleAdd = () => {
    this.setState({
      visible: true,
      selectedObj: {},
      modalTitle: '新增资讯',
    });
  };

  // 编辑
  handleEditor = () => {
    const { selected } = this.state;
    console.log('22222', selected);
    if (selected.length !== 1) {
      CMessage('请选择数据', 'error');
      return;
    }
    this.setState({
      visible: true,
      selectedObj: selected[0],
      modalTitle: '编辑资讯',
    });
  };

  // 删除
  handleDelete = () => {
    console.log('删除', this.state.selected);
    const { selected } = this.state;
    const arr = [];
    selected.forEach(item => {
      arr.push(item.id);
    });
    console.log(arr);
    if (arr.length <= 0) {
      CMessage('请选择数据', 'error');
      return;
    }
    const { langLib } = this.context;
    console.log('handleDelete', langLib);
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      onOk: () => {
        deleteConsulting({ ids: arr.join(',') }).then(res => {
          CMessage(langLib['message.del.success']);
          closeModal();
          this.setState({
            queryParams: initQueryParams,
            selected: [],
          });
          this.fetchData();
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };

  setSearchValue = (tableName, pageSize) => {
    console.log(this.state);
    // const { pageSize } = this.state;
    this.setState(
      {
        queryParams: {
          pageNum: 1,
          pageSize,
        },
        keywords: tableName,
      },
      () => {
        this.fetchData();
      },
    );
  };

  // 切页
  changePage = (page, pageSize) => {
    console.log(page, pageSize);
    this.setState(
      {
        queryParams: {
          pageNum: page,
          pageSize,
        },
      },
      () => {
        this.fetchData();
      },
    );
  };

  // 单选
  onClickRow = (record, selectedRows) => {
    let { selected } = this.state;
    if (selectedRows) {
      if (selected.findIndex(item => item.id === record.id) !== -1) {
        selected.splice(selected.findIndex(item => item.id === record.id), 1);
      } else {
        selected.push(record);
      }
      this.setState({
        selected: [...selected],
      });
    }
  };

  // 全选或者反选
  onClickRowAll = (record, selectedRows, arr) => {
    let { selected } = this.state;
    if (record) {
      selectedRows.forEach(item => {
        let index = selected.findIndex(items => items.id === item.id);
        if (index === -1) {
          selected.push(item);
        }
      });
      this.setState({
        selected: [...selected],
      });
    } else {
      arr.forEach(item => {
        let index = selected.findIndex(items => items.id === item.id);
        if (index !== -1) {
          selected.splice(index, 1);
        }
      });
      this.setState({
        selected: [...selected],
      });
    }
  };

  // 确认
  confirmFunction = e => {
    const { form } = this.props;
    const { selectedObj } = this.state;
    let param = form.getFieldsValue();
    console.log('params===>', param);
    const { coverurljson, html, id, keyword } = selectedObj;
    form.validateFields((errs, values) => {
      if (errs) return;
      const params = {
        coverurljson: coverurljson,
        html: html,
        id: id,
        keyword: keyword,
        style: values.style,
        text: (html && html.replace(/<[^>]+>/g, '')) || '', // 去掉所有的html标记
        title: values.title,
      };
      console.log(params, values, selectedObj);
      console.log('确定', params);
      if (params.id) {
        editorConsulting(params).then(res => {
          if (res) {
            this.fetchData();
            this.setState({
              selected: [],
            });
            CMessage('编辑成功');
            this.setState({
              visible: false,
            });
          }
        });
      } else {
        addConsulting(params).then(res => {
          if (res) {
            this.fetchData();
            CMessage('新增成功');
            this.setState({
              visible: false,
            });
          }
        });
      }
    });
  };

  // 是否置顶
  handleChangeIstop = (v, obj) => {
    console.log(v, obj);
    const params = {
      id: obj.id,
      isTop: v === true ? 1 : 2,
    };
    topApi(params).then(res => {
      this.fetchData();
    });
  };

  // 是否启用和停用
  handleChangeEnabled = (v, obj) => {
    console.log(v, obj);
    const params = {
      id: obj.id,
      isEnabled: v === true ? 1 : 2,
    };
    enabledApi(params).then(res => {
      // console.log(res);
      // this.fetchData();
    });
  };

  // 关联模板时选择的字段
  handleSetState = item => {
    this.setState(item);
  };

  render() {
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 80,
      },
      {
        title: '展示风格',
        dataIndex: 'style',
        key: 'style',
        width: 80,
        render: (text, record) => {
          return text === 1 ? '大图展示' : text === 2 ? '右侧图片' : '三张图展示';
        },
      },
      {
        title: '关键字',
        dataIndex: 'keyword',
        key: 'keyword',
        width: 100,
        render: (text, record) => {
          const arr = (text && text.split(',')) || [];
          return arr.map((item, i) => {
            return (
              <span
                key={i}
                style={{
                  background: '#FFEDE1',
                  borderRadius: '4px',
                  padding: '5px 8px',
                  marginLeft: '4px',
                  fontSize: '14px',
                  color: '#FA6400',
                  display: 'inline-block',
                  marginTop: '3px',
                }}
              >
                {item}
              </span>
            );
          });
        },
      },
      // {
      //   title: '正文',
      //   dataIndex: 'text',
      //   key: 'text',
      //   width: 130,
      // },
      {
        title: '发布人',
        dataIndex: 'publisuser',
        key: 'publisuser',
        width: 80,
      },
      {
        title: '发布时间',
        dataIndex: 'publishtime',
        key: 'publishtime',
        width: 120,
      },
      {
        title: '是否置顶',
        dataIndex: 'istop',
        key: 'istop',
        width: 80,
        render: (text, record) => {
          return (
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={text === 1 ? true : false}
              onChange={e => {
                this.handleChangeIstop(e, record);
              }}
            />
          );
        },
      },
      {
        title: '启用',
        dataIndex: 'enabled',
        key: 'enabled',
        width: 60,
        render: (text, record) => {
          return (
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={text === 1 ? true : false}
              onChange={e => {
                this.handleChangeEnabled(e, record);
              }}
            />
          );
        },
      },
    ];

    const {
      listData,
      loading,
      total,
      queryParams,
      selected,
      visible,
      modalTitle,
      selectedObj,
    } = this.state;
    const { pageNum, pageSize } = queryParams;

    console.log(queryParams);

    const rowSelection = {
      type: 'checkbox',
      columnWidth: '50px',
      selectedRowKeys: selected.map(item => item.id),
      onSelectAll: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRowAll(record, selected, selectedRows);
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRow(record, selectedRows);
      },
      onChange: (record, selected, selectedRows, nativeEvent) => {
        this.onClickRow(record, selectedRows);
      },
    };
    const { form } = this.props;
    return (
      <div className={`${styles.content} system__contentbkgd`}>
        <header>
          <div>
            <CButton
              onClick={() => this.handleAdd()}
              className={styles.headerButton}
              isDefault={true}
            >
              <i className={`iconfont icon-add-border custom-color ${styles.iconClass}`} />
              新增
            </CButton>
            <CButton
              onClick={() => this.handleEditor()}
              className={styles.headerButton}
              isDefault={true}
            >
              <i className={`iconfont icon-batch-update custom-color ${styles.iconClass}`} />
              编辑
            </CButton>
            <CButton
              onClick={() => this.handleDelete()}
              className={styles.headerButton}
              isDefault={true}
            >
              <i className={`iconfont icon-del custom-color ${styles.iconClass}`} />
              删除
            </CButton>
          </div>
          <div>
            <CSearch
              placeholder="输入关键字"
              onSearch={value => this.setSearchValue(value, pageSize)}
            />
          </div>
        </header>
        <CTable
          className={styles.tableClass}
          columns={columns}
          rowKey="id"
          dataSource={listData}
          loading={loading}
          pagination={false}
          onClickRow={this.onClickRow}
          rowSelection={rowSelection}
        />
        <footer className={`${styles.footer} footerClass system__contentbkgd`}>
          <Pagination
            pageSize={pageSize}
            current={pageNum}
            onChange={this.changePage}
            showSizeChanger
            total={total}
            pageSizeOptions={['10', '20', '50', '100', '200', '500', '1000']}
            showTotal={(total, range) => {
              return (
                <div>
                  <FormattedMessage id="global.total" />
                  {total}
                </div>
              );
            }}
            onShowSizeChange={this.changePage}
          />
        </footer>
        <CModal
          title={modalTitle}
          visible={visible}
          destroyOnClose={true}
          footer={[
            <Button
              key="cancel"
              type="default"
              onClick={() =>
                this.setState({
                  visible: false,
                })
              }
            >
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => this.confirmFunction()}>
              确定
            </Button>,
          ]}
          bodyStyle={{ padding: '20px 0' }}
          onCancel={() => {
            this.setState({ modalTitle: '', visible: false });
          }}
        >
          <FormData form={form} selectedObj={selectedObj} handleSetState={this.handleSetState} />
        </CModal>
      </div>
    );
  }
}

export default Form.create()(ConsultingManagement);
