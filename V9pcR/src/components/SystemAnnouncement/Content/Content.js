import { CInput, SplitLine } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import Template from '@/components/SystemAnnouncement/Content/Template/Template';
import { VALID_REQUIRED_MESSAGE } from '@/constants/global';
import { getBulletinOneList } from '@/services/systemAnnouncement';
import { Select } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;

class Content extends Component {
  static getDerivedStateFromProps(props, state) {
    const { activeId } = props;
    if (activeId !== state.activeId) {
      return { activeId };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      info: {}, // 消息模板详情
      activeId: '', // 详情id
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchMore();
  }

  componentDidUpdate(preState) {
    if (preState.activeId !== this.state.activeId) {
      this.fetchMore();
    }
  }

  // 获取详情
  fetchMore = () => {
    const { activeId } = this.state;
    this.setState({ loading: true });
    if (!activeId) {
      this.setState({
        info: {},
        loading: false,
      });
      return;
    }
    const { form } = this.props;
    form.resetFields();
    getBulletinOneList({ id: activeId }).then(res => {
      this.setState({
        info: res,
        loading: false,
      });
    });
  };

  // 更新
  update = Obj => {
    const { info } = this.state;
    const { form } = this.props;
    form.resetFields();
    this.setState({
      info: {
        ...info,
        ...Obj,
      },
    });
    console.log(this.state);
  };

  // 配置
  getFormConfigs = () => {
    const { info } = this.state;
    const basicLine = {
      // 基本信息
      key: 'basicLine-base',
      comType: 'static',
      colSpan: 24,
      component: <SplitLine title={<FormattedMessage id="splitLine.title.basic" />} />,
    };
    // 模板信息
    const basicLine1 = {
      key: 'basicLine-base1',
      comType: 'static',
      colSpan: 24,
      component: <SplitLine title={<FormattedMessage id="message.server.template" />} />,
    };
    // 基本信息
    const name = {
      key: 'name',
      colSpan: 12,
      label: '公告标题',
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.name || '',
      },
      component: <CInput onChange={e => this.update({ name: e.target.value })} />,
    };
    // 状态：启动 和 未启动
    const type = {
      key: 'enabled',
      colSpan: 12,
      label: '状态',
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.enabled === 0 ? 0 : 1,
      },
      component: (
        <Select
          onChange={enabled => {
            this.update({ enabled });
          }}
        >
          <Option value={1}>
            启动
            {/* <FormattedMessage id="启动" /> */}
          </Option>
          <Option value={0}>
            停用
            {/* <FormattedMessage id="未启动" /> */}
          </Option>
        </Select>
      ),
    };
    // 消息模板：内容
    const template = {
      key: 'content',
      colSpan: 24,
      label: '内容',
      config: {
        rules: [
          {
            required: false,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: '',
      },
      component: <Template content={info.content} info={info} onChange={this.update} />,
    };
    let configs = [basicLine, name, type, basicLine1, template];
    return configs;
  };

  render() {
    const { loading } = this.state;
    const { form } = this.props;
    return <FormItems formConfigs={this.getFormConfigs()} form={form} loading={loading} />;
  }
}

export default Content;
