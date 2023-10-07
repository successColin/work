/*
 * @Author: jwk
 * @Date:   2021-03-21 9:20:23
 * @Desc: 消息发送列表
 */
import { CButton, CTable } from '@/components/common/BasicWidgets';
import CMessage from '@/components/common/BasicWidgets/Widgets/CMessage/CMessage';
import CModal from '@/components/common/CreateModal/CreateModal';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import styles from '@/components/VideoManagement/History/History.less';
import { BaseContext } from '@/constants/global';
import {
  deleteMessages,
  fetAllMessages,
  getMessagesByFilter,
  resendMessages,
} from '@/services/messageHistory';
import { getDefaultConfirmProps } from '@/utils/common';
import { Form, Input, message, Pagination } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import HighFilter from './HighFilter/HighFilter';

const InputGroup = Input.Group;
const { Search } = Input;

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
}))
class MessageHistory extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super();
    this.state = {
      list: [],
      count: 0, // 列表数量
      visible: false, // 新增弹框
      text: '', // 内容区域
      pageSize: 10, // 默认分页10
      keyWords: '',
      pageNum: 1, // 默认第一页
      loading: false,
      selected: [], // 选中的行
      selectedRowKeys: [], // 勾选中的行
      selectedItems: [], // 勾选中的下拉框
      filterVisible: false, // 高级筛选
      searchValue: { name: '', receiver: '' },
      highFilter: {},
      type: 1, // 查询类型1：模糊查询，2：高级筛选
    };
    this.player = null;
  }

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    this.player = null;
  }

  // 获取数据
  getList = () => {
    const { pageSize, pageNum, searchValue, sortedInfo = {}, type, highFilter } = this.state;
    this.setState({ loading: true });
    const { orderBy } = sortedInfo;
    let idDesc = 1;
    const api = type === 1 ? fetAllMessages : getMessagesByFilter;
    let params =
      type === 1
        ? {
            pageSize,
            pageNum,
            ...searchValue,
            idDesc,
          }
        : {
            name: highFilter.name,
            baseType: highFilter.baseType,
            stateId: highFilter.stateId || 0,
            startTime:
              highFilter.time && highFilter.time[0]
                ? moment(highFilter.time[0]).format('YYYY-MM-DD HH:mm:ss')
                : null,
            endTime:
              highFilter.time && highFilter.time[1]
                ? moment(highFilter.time[1]).format('YYYY-MM-DD HH:mm:ss')
                : null,
            idDesc,
            pageSize,
            pageNum,
          };
    api(params).then(
      (res = {}) => {
        this.setState({ loading: false, list: res.list || [], count: res.total });
      },
      err => {
        this.setState({ loading: false });
      },
    );
  };

  // 关联
  add = () => {
    const { selected = [] } = this.state;
    if (!selected.length) {
      const { langLib } = this.context;
      CMessage(langLib['message.please.choose'], 'error');
      return;
    }
    let ids = selected.map(item => item.id);
    this.deReSendMessage({ msgIds: ids.join(',') });
  };

  del = () => {
    const { selected = [] } = this.state;
    if (!selected.length) {
      const { langLib } = this.context;
      CMessage(langLib['message.please.choose'], 'error');
      return;
    }
    let ids = selected.map(item => item.id);
    const { langLib } = this.context;
    const that = this;
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      content: '',
      onOk() {
        deleteMessages({ msgIds: ids.join(',') }).then(
          res => {
            that.setState({ pageNum: 1, selected: [] }, () => {
              that.getList();
            });
            message.success(langLib['message.check.success']);
            closeModal();
          },
          err => {
            closeModal();
          },
        );
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
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
  // 进行筛选
  Change = (pagination, filters, sorter) => {
    this.setState(
      {
        filteredInfo: filters,
        sortedInfo: sorter,
        pageNum: 1, // 默认第一页
      },
      () => {
        this.getList();
      },
    );
  };
  // 点击行
  clickRow = record => {
    return {
      onClick: () => {
        if (record.success) return;
        let { selected } = this.state;
        if (selected.find(item => item.id === record.id)) {
          selected.splice(selected.findIndex(item => item.id === record.id), 1);
        } else {
          selected.push(record);
        }
        this.setState({
          selected: [...selected],
        });
      },
    };
  };

  // 切页
  changePage = (page, pageSize) => {
    this.setState(
      {
        pageNum: page,
        pageSize,
      },
      () => {
        this.getList();
      },
    );
  };
  // 关联模板时选择的字段
  handleChange = selectedItems => {
    this.setState({
      selectedItems,
    });
  };

  // 更新状态
  updateState = (obj, callback) => {
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
  // 根据类型渲染值
  basetypeName = basetype => {
    if (basetype === 1) {
      return '邮件';
    } else if (basetype === 3) {
      return '站内信';
    } else if (basetype === 5) {
      return '企业微信推送';
    }
  };
  // 去掉文案中的标签
  matchReg = str => {
    if (!str) return '';
    let reg = /<[^>]+>/g;
    return str.replace(reg, '');
  };
  // 显示文本
  showHtml = text => {
    this.setState({ text, visible: true });
  };
  // 重发
  doReSend = item => {
    const { id } = item;
    this.deReSendMessage({ msgIds: id });
  };
  deReSendMessage = params => {
    const { langLib } = this.context;
    const that = this;
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      content: '',
      title: langLib['message.history.resend'],
      onOk() {
        resendMessages(params).then(
          res => {
            that.setState({ pageNum: 1, selected: [] }, () => {
              that.getList();
            });
            message.success(langLib['message.check.success']);
            closeModal();
          },
          err => {
            closeModal();
          },
        );
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };
  // 重置
  handleClear = () => {
    this.setState({
      highFilter: {},
    });
    this.props.form.resetFields();
  };
  // 高级筛选
  doHighFilter = () => {
    this.props.form.validateFields((errs, values) => {
      if (errs) return;
      this.setState(
        {
          pageNum: 1,
          filterVisible: false,
          highFilter: values,
          type: 2,
        },
        () => {
          this.getList();
        },
      );
    });
  };

  render() {
    const {
      list,
      visible,
      pageSize,
      count,
      pageNum,
      loading,
      selected,
      title,
      sortedInfo = {},
      filterVisible,
      highFilter,
    } = this.state;
    const { langLib } = this.context;
    const { form, functionData } = this.props;
    const { canmodify, candelete } = functionData.attributes;
    const columns = [
      {
        title: <FormattedMessage id="message.history.name" />,
        dataIndex: 'title',
        width: 150,
        render: (text, record) => {
          return (
            <div className={styles.nameWrap} title={text}>
              {text}
            </div>
          );
        },
      },
      {
        title: <FormattedMessage id="message.history.time" />,
        dataIndex: 'createDate',
        width: 150,
      },
      {
        title: <FormattedMessage id="message.history.basetype" />,
        dataIndex: 'basetype',
        width: 100,
        render: (text, record) => {
          return this.basetypeName(record.basetype);
        },
      },
      {
        title: <FormattedMessage id="message.history.stateid" />,
        dataIndex: 'success',
        width: 100,
        render: (text, record) => {
          const dom = !record.success ? (
            <div>
              <span className={styles.failWrap} />
              <FormattedMessage id="tasks.destruction" />
            </div>
          ) : (
            <div>
              <span className={styles.stateWrap} />
              <FormattedMessage id="tasks.success" />
            </div>
          );
          return dom;
        },
      },
      {
        title: <FormattedMessage id="message.history.content" />,
        dataIndex: 'content',
        render: (text, record) => {
          const html = this.matchReg(text);
          return (
            <div
              onClick={() => {
                this.showHtml(text);
              }}
              title={html}
              className={styles.contentWrap}
            >
              {html}
            </div>
          );
        },
        width: 250,
      },
      {
        title: <FormattedMessage id="message.history.fail" />,
        dataIndex: 'resultmessage',
        width: 250,
        render: (text, record) => {
          return (
            <div className={styles.contentWrap} title={text}>
              {text}
            </div>
          );
        },
      },
      {
        title: <FormattedMessage id="message.history.user" />,
        dataIndex: 'receiver',
        width: 150,
        render: (text, record) => {
          return (
            <div>
              {record.username}-{record.account}
            </div>
          );
        },
      },
      {
        title: <FormattedMessage id="global.operator" />,
        dataIndex: 'placeholdertext',
        render: (text, record) => {
          let dom = record.success ? null : (
            <div
              className={styles.resend}
              onClick={() => {
                this.doReSend(record);
              }}
            >
              <FormattedMessage id="message.history.resend" />
            </div>
          );
          return dom;
        },
      },
    ];
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
      getCheckboxProps: record => ({
        disabled: record.success,
      }),
    };
    const footer = (
      <Fragment>
        <CButton onClick={() => this.handleClear()}>
          <FormattedMessage id="global.reset" />
        </CButton>
        <CButton
          onClick={() => this.setState({ filterVisible: false, selectedItems: [], selected: [] })}
        >
          <FormattedMessage id="global.cancel" />
        </CButton>
        <CButton type="primary" onClick={() => this.doHighFilter()}>
          <FormattedMessage id="global.ok" />
        </CButton>
      </Fragment>
    );
    const filterProps = {
      title: <FormattedMessage id="element.type.seniorFilter" />,
      visible: filterVisible,
      className: styles.filterModal,
      onCancel: () => {
        this.setState({ filterVisible: false, selectedItems: [], selected: [] });
      },
      footer,
    };
    return (
      <div className={`${styles.box} boxClass system__contentbkgd`}>
        <div className={`${styles.headerForm} headerFormClass system__lineBorder--bottom`} style={{display: 'block'}}>
          {canmodify ? (
            <div
              className={`${styles.addNewBtn} globalAddNewBtn system__defaultButton`}
              onClick={() => this.add()}
            >
              <span className={`${styles.addnewBtnIco} icon-last-filter iconfont custom-color`} />
              <FormattedMessage id="message.history.resend" />
            </div>
          ) : null}
          <InputGroup compact className={styles.highSearch}>
            <Search
              placeholder={langLib['form.placeholder.keywords']}
              onSearch={value => {
                this.setState({ pageNum: 1, searchValue: { name: value }, type: 1 }, () => {
                  this.getList();
                });
              }}
              onChange={e => {
                let value = e.target.value;
                this.setState({ searchValue: { name: value } });
              }}
              style={{ width: 200 }}
            />
          </InputGroup>
          <div
            className={`${styles.filterSearch} globalAddNewBtn system__defaultButton`}
            onClick={() => this.setState({ filterVisible: true })}
          >
            <span className="icon-high_filter iconfont custom-color" />
            <FormattedMessage id="element.type.seniorFilter" />
          </div>
        </div>
        <div style={{ height: 'calc(100% - 47px - 50px)' }}>
          <CTable
            className={styles.table}
            columns={columns}
            rowKey={record => record.id}
            dataSource={list}
            scroll={{ y: 'calc(100% - 42px)' }}
            pagination={false}
            onRow={this.clickRow}
            loading={loading}
            rowSelection={rowSelection}
            onChange={this.Change}
          />
        </div>
        <div className={`${styles.footer} footerClass system__contentbkgd`}>
          <Pagination
            pageSize={pageSize}
            current={pageNum}
            onChange={this.changePage}
            showSizeChanger
            // defaultCurrent={pageNum}
            // current={currentPage}
            total={count}
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
        </div>
        <CModal
          title="消息内容"
          visible={visible}
          destroyOnClose={true}
          footer={null}
          onCancel={() => {
            this.setState({ text: '', visible: false });
          }}
          bodyStyle={{ padding: '10px' }}
        >
          <div dangerouslySetInnerHTML={{ __html: this.state.text }} />
        </CModal>
        <CModal {...filterProps}>
          <HighFilter highFilter={highFilter} form={form} />
        </CModal>
      </div>
    );
  }
}

export default Form.create()(MessageHistory);
