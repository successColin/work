import { CMessage } from '@/components/common/BasicWidgets';
import FooterButton from '@/components/common/FooterButton/FooterButton';
import ModalBox from '@/components/common/ReminderBox/ReminderBox';
import { BaseContext } from '@/constants/global';
import {
  addBulletin,
  deleteBulletin,
  getBulletinList,
  updateBulletin,
} from '@/services/systemAnnouncement';
import { getDefaultConfirmProps } from '@/utils/common';
import { Form, message } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import DefaultFrame from '../Frames/DefaultFrame/DefaultFrame';
import Content from './Content/Content';
import LeftList from './LeftList/LeftList';

const QueryParams = {
  pageNum: 1,
  pageSize: 10,
};

@connect(state => ({
  functionData: state.tabs.activeTabData.functionData,
  userInfo: state.user.userInfo,
  tabs: state.tabs,
  user: state.user,
}))
class MessageServe extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      loadingStatus: {},
      listQueryParams: {
        ...QueryParams,
      },
      chooseData: '', // 选中的数据
      hasMore: false, // 是否更多
      activeId: '', // 选中的消息列表详情
      listLoading: false,
      messageList: [], // 获取服务列表
      type: '', // add为新增
    };
  }

  componentDidMount() {
    this.fetchMessageList();
  }

  // 获取消息模板列表
  fetchMessageList = () => {
    let { listQueryParams, keywords, activeId } = this.state;
    this.setState({ listLoading: true });
    getBulletinList({ ...listQueryParams, keywords }).then(res => {
      const { list, total } = res;
      if (list.length && !activeId) {
        activeId = list[0].id;
      }
      this.setState({
        hasMore: total > list.length,
        messageList: list,
        listLoading: false,
        activeId: activeId,
        chooseData: list.length ? list[0] : '',
        type: '',
      });
    });
  };

  // 滚动
  scrollFetchMessage = () => {
    const { listQueryParams, keywords, messageList } = this.state;
    getBulletinList({ ...listQueryParams, keywords }).then(res => {
      const { list, total } = res;
      let newList = messageList.concat(list);
      this.setState({
        messageList: newList,
        hasMore: total > newList.length,
        listLoading: false,
        type: '',
      });
    });
  };

  // 更新状态
  updateState = (item, callback) => {
    this.setState({ ...item }, () => {
      callback && callback();
    });
  };

  // 提交
  onSubmit = () => {
    const { form } = this.props;
    const { type, activeId } = this.state;
    form.validateFields((errs, values) => {
      if (errs) return false;
      const { info } = this.content.state;
      const { enabled, name } = values;
      let params = { enabled, name, content: info.content };

      console.log(info, values);

      this.setLoadingStatus('saveBtn', true);

      if (type === 'add') {
        addBulletin(params)
          .then(res => {
            CMessage('操作成功');
            this.setLoadingStatus('saveBtn', false);
            this.setState({ listQueryParams: QueryParams }, () => {
              this.fetchMessageList();
            });
          })
          .catch(err => {
            this.setLoadingStatus('saveBtn', false);
          });
      } else {
        params.id = activeId;
        updateBulletin(params)
          .then(res => {
            CMessage('操作成功');
            this.setLoadingStatus('saveBtn', false);
            this.setState({ listQueryParams: QueryParams }, () => {
              this.fetchMessageList();
            });
          })
          .catch(err => {
            this.setLoadingStatus('saveBtn', false);
          });
      }
    });
  };

  // 更新loading状态
  setLoadingStatus = (type, loading) => {
    const { loadingStatus } = this.state;
    this.setState({
      loadingStatus: {
        ...loadingStatus,
        [type]: loading,
      },
    });
  };

  // 删除
  onDelete = () => {
    const { langLib } = this.context;
    console.log(langLib);
    const that = this;
    let { close } = ModalBox.confirm({
      ...getDefaultConfirmProps(langLib),
      title: langLib['confirm.del.default'],
      content: '',
      onOk() {
        const { activeId } = that.state;
        that.setLoadingStatus('delBtn', true);
        deleteBulletin({ id: activeId }).then(
          res => {
            message.success(langLib['message.del.success']);
            that.setState(
              {
                activeId: '',
                chooseData: '',
                listQueryParams: {
                  ...QueryParams,
                },
                type: '',
              },
              () => {
                that.fetchMessageList();
              },
            );
            that.setLoadingStatus('delBtn', false);
            closeModal();
          },
          err => {
            closeModal();
            that.setLoadingStatus('delBtn', false);
          },
        );
      },
      onCancel: () => closeModal(),
    });
    const closeModal = () => {
      close();
    };
  };

  render() {
    const { functionData, form } = this.props;
    const {
      chooseData,
      hasMore,
      loadingStatus,
      messageList,
      listQueryParams,
      listLoading,
      activeId,
      type,
    } = this.state;
    // 按钮配置
    let btnConfigs = [
      {
        type: 'default',
        onClick: this.onDelete,
        text: 'global.del',
        loading: loadingStatus.delBtn,
      },
      {
        type: 'primary',
        onClick: this.onSubmit,
        loading: loadingStatus.saveBtn,
      },
    ];
    const listProps = {
      form,
      functionData,
      messageList,
      listQueryParams,
      listLoading,
      activeId,
      hasMore,
      updateState: this.updateState,
      fetchMessage: this.scrollFetchMessage,
    };
    const sider = <LeftList {...listProps} />;
    const contentProps = { chooseData, type, form, activeId, ref: ref => (this.content = ref) };
    let content = !!messageList.length && <Content {...contentProps} />;
    let footer = null;

    if (type === 'add') {
      content = <Content {...contentProps} />;
      btnConfigs = [
        {
          type: 'primary',
          onClick: this.onSubmit,
          loading: loadingStatus.saveBtn,
        },
      ];
      footer = <FooterButton btnConfigs={btnConfigs} />;
    } else {
      footer = !!messageList.length && <FooterButton btnConfigs={btnConfigs} />;
    }
    return (
      <DefaultFrame
        sider={sider}
        content={content}
        footer={footer}
        config={{
          handleSearch: keywords =>
            this.setState(
              {
                keywords,
                listQueryParams: QueryParams,
              },
              () => this.fetchMessageList(),
            ),
        }}
      />
    );
    // </div>;
  }
}

export default Form.create()(MessageServe);
