/*
 * @Author: Fus
 * @Date:   2020-02-07 09:38:36
 * @Desc: 版本列表
 */
import { CButton, CMessage, CTable } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import {
  deleteSystemTreeIcon,
  getSystemTreeIconDetail,
  getSystemTreeIconList,
  saveSystemTreeIcon,
} from '@/services/treeIconConfig';
import { getDefaultConfirmProps } from '@/utils/common';
import { Form } from 'antd';
import { connect } from 'dva';
import { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import DetailForm from '../DetailForm/DetailForm';
import styles from './VersionList.less';

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
}))
class VersionList extends Component {
  static contextType = BaseContext;
  state = {
    visibleDetail: false, // 详情框是否显示
    listData: [], // 列表数据
    loadingGetDetail: false, // 获取详情
    loadingSaveDetail: false, // 保存详情
    loadingList: false, // 加载列表
    activeDetail: {}, // 当前行数据
    selectedRows: [], // 选中的数据
    total: 0, // 总数据
    queryParam: {
      pageSize: 10,
      pageNum: 1,
    },
    listChildData: [],
  };

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表数据
  fetchList = () => {
    const { queryParam } = this.state;
    this.setState({ loadingList: true });
    getSystemTreeIconList({ ...queryParam }).then(res => {
      const { list = [], total = 0 } = res;
      const listData = list.map((item, index) => ({ ...item, sno: index + 1 }));
      this.setState({
        loadingList: false,
        listData,
        total,
      });
    });
  };
  // 点击编辑
  handleClickEdit = () => {
    const { selectedRows } = this.state;
    const { langLib } = this.context;
    const selectedLength = selectedRows.length;
    if (selectedLength === 0) {
      CMessage(langLib['message.error.noSelected'], 'error');
      return;
    } else if (selectedLength > 1) {
      CMessage(langLib['message.error.onlyOne'], 'error');
      return;
    }
    const { id } = selectedRows[0];
    this.setState({ loadingGetDetail: true, visibleDetail: true });
    getSystemTreeIconDetail({ id }).then(
      res => {
        const { jsonInfo } = res;
        this.setState({
          activeDetail: res,
          loadingGetDetail: false,
          listChildData: jsonInfo ? JSON.parse(jsonInfo) : [],
        });
      },
      err => this.setState({ loadingGetDetail: false }),
    );
  };
  // 点击删除
  handleClickDel = () => {
    const { langLib } = this.context;
    const { selectedRows } = this.state;
    const ids = selectedRows.map(item => item.id).join(',');
    if (!selectedRows.length) {
      CMessage(langLib['message.error.noSelected'], 'error');
      return;
    }
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      onOk: () => {
        return deleteSystemTreeIcon({ ids }).then(res => {
          CMessage(langLib['message.del.success']);
          this.fetchList();
          closeModal();
          this.setState({ selectedRows: [] });
        });
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };
  // 保存弹框内容
  handleSave = () => {
    const { listChildData } = this.state;
    const { langLib, dispatch } = this.context;
    const { activeDetail } = this.state;
    this.props.form.validateFields((errs, values) => {
      if (errs) return;
      const params = {
        ...activeDetail,
        ...values,
        jsonInfo: JSON.stringify(listChildData),
      };
      this.setState({ loadingSaveDetail: true });
      saveSystemTreeIcon(params).then(
        res => {
          CMessage(langLib['message.save.success'], 'success');
          this.setState({
            loadingSaveDetail: false,
            visibleDetail: false,
            activeDetail: {},
            listChildData: [],
          });
          this.fetchList();
        },
        err => this.setState({ loadingSaveDetail: false }),
      );
    });
  };
  // 点击行
  onClickRow = record => {
    const { selectedRows } = this.state;
    let newSelectedRows = [...selectedRows];
    const recordIndex = selectedRows.findIndex(item => item.id === record.id);
    if (recordIndex === -1) {
      newSelectedRows.push(record);
    } else {
      newSelectedRows.splice(recordIndex, 1);
    }
    this.setState({ selectedRows: newSelectedRows });
  };
  // 关闭弹框
  handleCancelModal = () => {
    this.setState({
      visibleDetail: false,
      activeDetail: {},
      listChildData: [],
    });
  };
  getColumns = () => {
    const renderTitText = text => <span title={text}>{text}</span>;
    return [
      // {
      //   title: '编码',
      //   dataIndex: 'sno',
      //   render: text => renderTitText(text),
      // },
      {
        title: '名称',
        dataIndex: 'name',
        width: '30%',
        render: text => renderTitText(text),
      },
      {
        title: '表名',
        dataIndex: 'tableName',
        width: '30%',
        render: text => renderTitText(text),
      },
      {
        title: '字段',
        dataIndex: 'columnName',
        render: text => renderTitText(text),
      },
    ];
  };

  changeDate = data => {
    this.setState(data);
  };

  render() {
    const {
      visibleDetail,
      listData,
      activeDetail,
      loadingSaveDetail,
      loadingList,
      loadingGetDetail,
      selectedRows,
      total,
      queryParam,
      listChildData,
    } = this.state;
    const { form, functionData } = this.props;
    const { canmodify, canadd, candelete } = functionData.attributes;
    const { pageNum, pageSize } = queryParam;
    const selectedRowKeys = selectedRows.map(item => item.id);
    const rowSelection = {
      selectedRowKeys,
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.setState({ selectedRows });
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        this.setState({ selectedRows });
      },
      onChange: (record, selected, selectedRows, nativeEvent) => {
        this.setState({ selectedRows });
      },
    };
    const pagination = {
      total,
      current: pageNum,
      pageSize,
      onChange: (pageNum, newPageSize) => {
        this.setState(
          {
            selectedRows: [],
            queryParam: {
              ...queryParam,
              pageNum,
              pageSize: newPageSize,
            },
          },
          () => this.fetchList(),
        );
      },
    };
    return (
      <div className={styles.wrap}>
        <div className={styles.btnWrap}>
          {canadd ? (
            <CButton onClick={() => this.setState({ visibleDetail: true })} isDefault={true}>
              <i className="iconfont icon-add-border custom-color" />
              <FormattedMessage id="global.add" />
            </CButton>
          ) : null}
          {canmodify ? (
            <CButton onClick={this.handleClickEdit} isDefault={true}>
              <i className="iconfont iconEdit custom-color" />
              <FormattedMessage id="global.edit" />
            </CButton>
          ) : null}
          {candelete ? (
            <CButton onClick={this.handleClickDel} isDefault={true}>
              <i className="iconfont icondelete custom-color" />
              <FormattedMessage id="global.del" />
            </CButton>
          ) : null}
        </div>
        <CTable
          className={styles.table}
          columns={this.getColumns()}
          pagination={pagination}
          dataSource={listData}
          loading={loadingList}
          rowSelection={rowSelection}
          onClickRow={this.onClickRow}
          rowKey="id"
        />
        <CreateModal
          visible={visibleDetail}
          title={
            <Fragment>
              <FormattedMessage id={`global.${activeDetail.id ? 'edit' : 'new'}`} />
              树图标
            </Fragment>
          }
          onOk={this.handleSave}
          onCancel={this.handleCancelModal}
          confirmLoading={loadingSaveDetail}
          destroyOnClose={true}
        >
          <Form>
            <DetailForm
              form={form}
              activeDetail={activeDetail}
              loadingGetDetail={loadingGetDetail}
              listChildData={listChildData}
              changeDate={this.changeDate}
            />
          </Form>
        </CreateModal>
      </div>
    );
  }
}

export default Form.create()(VersionList);
