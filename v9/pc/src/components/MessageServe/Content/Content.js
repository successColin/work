import { CInput, SplitLine } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import Template from '@/components/MessageServe/Content/Template/Template';
import Users from '@/components/MessageServe/Users/Users';
import { VALID_REQUIRED_MESSAGE } from '@/constants/global';
import { getCron, getInfo, getReceiver, getServe } from '@/services/message';
import { Select } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import SqlEdit from './Sql/Sql';

const { Option } = Select;

class Content extends Component {
  static getDerivedStateFromProps(props, state) {
    const { activeId, chooseData } = props;
    if (activeId !== state.activeId) {
      return { activeId, userInfo: [] };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      info: {}, // 消息模板详情
      serverList: [], // 服务列表
      cronList: [], // cron列表
      activeId: '', // 详情id
      loading: false,
      userInfo: [], // 接收人参数
      metaUserData: [], // 用户源数据
      showTag: [],
    };
  }

  componentDidMount() {
    this.fetchCron();
    this.fetchMore();
    this.fetchList();
  }

  componentDidUpdate(preState) {
    if (preState.activeId !== this.state.activeId) {
      this.fetchMore();
      this.fetchList();
    }
  }

  // 获取联系人
  fetchList = () => {
    const { activeId } = this.state;
    if (!activeId) {
      this.setState({
        userInfo: [],
        metaUserData: [],
      });
      return;
    }
    getReceiver({ id: activeId }).then(res => {
      this.setState({ userInfo: res, metaUserData: JSON.parse(JSON.stringify(res)) });
    });
  };
  // 获取详情
  fetchMore = () => {
    const { activeId } = this.state;
    this.setState({ loading: true });
    if (!activeId) {
      this.setState({
        info: {},
        loading: false,
      });
      this.fetchServer();
      return;
    }
    const { form } = this.props;
    form.resetFields();
    getInfo({ id: activeId }).then(res => {
      this.setState({
        info: res,
        loading: false,
      });
      this.fetchServer(res.basetype || 1);
    });
  };

  // 获取crom列表
  fetchCron = () => {
    getCron({}).then(res => {
      this.setState({ cronList: res });
    });
  };
  // 获取服务类型
  fetchServer = (basetype = 1) => {
    getServe({ basetype }).then(res => {
      this.setState({ serverList: res });
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
  };

  // 获取列名
  getColumnList = sqlValue => {
    if (!sqlValue) return;
    sqlValue = sqlValue.toLowerCase();
    const sql = sqlValue.split('from');
    const getValue = sql[0].toLowerCase();
    const newSql = getValue + ',';
    let sqlList = newSql.match(/\sas\s([\s\S]*?),/g);
    let list = [];
    sqlList.forEach(item => {
      let str = item
        .replace('as', '')
        .replace(',', '')
        .trim();
      list.push(str);
    });
    const { info } = this.state;
    this.setState({
      info: {
        ...info,
        columns: list.join('|'),
      },
    });
  };

  // 配置
  getFormConfigs = () => {
    const { serverList, cronList, info, userInfo, metaUserData } = this.state;
    const makeOptions = optionlist => {
      return optionlist.map(item => {
        return (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        );
      });
    };
    const serverOption = makeOptions(serverList); // 服务下拉选项
    const cronOption = makeOptions(cronList); // 服务下拉选项
    const basicLine = {
      // 基本信息
      key: 'basicLine-base',
      comType: 'static',
      colSpan: 24,
      component: <SplitLine title={<FormattedMessage id="splitLine.title.basic" />} />,
    };
    const basicLine1 = {
      // 模板信息
      key: 'basicLine-base1',
      comType: 'static',
      colSpan: 24,
      component: <SplitLine title={<FormattedMessage id="message.server.template" />} />,
    };
    const name = {
      // 基本信息
      key: 'name',
      colSpan: 8,
      label: <FormattedMessage id="element.name" />,
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
    const type = {
      // 类型
      key: 'basetype',
      colSpan: 8,
      label: <FormattedMessage id="global.type" />,
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.basetype || 1,
      },
      component: (
        <Select
          onChange={basetype => {
            this.update({ basetype });
            this.fetchServer(basetype);
          }}
        >
          <Option value={1}>
            <FormattedMessage id="user.form.email" />
          </Option>
          <Option value={3}>
            <FormattedMessage id="user.form.mail" />
          </Option>
          <Option value={5}>
            <FormattedMessage id="user.form.wxmail" />
          </Option>
          <Option value={7}>
            <FormattedMessage id="user.form.zhezhengPush" />
          </Option>
          <Option value={8}>
            <FormattedMessage id="user.form.dingding" />
          </Option>
        </Select>
      ),
    };
    const method = {
      // 发送服务
      key: 'messageServerId',
      colSpan: 8,
      label: <FormattedMessage id="message.server.method" />,
      ignore: info.basetype === 3,
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.messageServerId,
      },
      component: (
        <Select onChange={messageServerId => this.update({ messageServerId })}>
          {serverOption}
        </Select>
      ),
    };
    const limit = {
      // 限制
      key: 'repeatable',
      colSpan: 8,
      label: <FormattedMessage id="message.server.limit" />,
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.repeatable || 1,
      },
      component: (
        <Select
          disabled={info.timingType === 2 ? true : false}
          onChange={repeatable => this.update({ repeatable })}
        >
          <Option value={2}>
            <FormattedMessage id="message.server.limit1" />
          </Option>
          <Option value={1}>
            <FormattedMessage id="message.server.limit2" />
          </Option>
        </Select>
      ),
    };
    const timeType = {
      // 发送时间
      key: 'timingType',
      colSpan: 8,
      label: <FormattedMessage id="message.server.timingType" />,
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.timingType || 1,
      },
      component: (
        <Select
          onChange={timingType =>
            this.update(timingType === 2 ? { timingType, repeatable: 2 } : { timingType })
          }
        >
          <Option value={1}>
            <FormattedMessage id="message.server.timetype1" />
          </Option>
          <Option value={2}>
            <FormattedMessage id="message.server.timetype2" />
          </Option>
        </Select>
      ),
    };
    const circle = {
      // cron表达式
      key: 'cronId',
      colSpan: 8,
      label: <FormattedMessage id="message.server.circle" />,
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.cronId,
      },
      component: <Select onChange={cronId => this.update({ cronId })}>{cronOption}</Select>,
    };
    const sql = {
      // sql
      key: 'sqlContent',
      colSpan: 24,
      label: <FormattedMessage id="message.server.sql" />,
      config: {
        rules: [
          {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.sqlContent,
      },
      component: (
        <SqlEdit
          info={info}
          doSplit={this.getColumnList}
          rowKey="sqlContent"
          onChange={this.update}
        />
      ),
    };
    const users = {
      // sql
      key: 'user',
      colSpan: 24,
      label: <FormattedMessage id="message.server.users" />,
      config: {
        rules: [
          {
            required: false,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: '',
      },
      component: (
        <Users
          userInfo={userInfo}
          metaUserData={metaUserData}
          updateState={this.updateState}
          info={info}
        />
      ),
    };
    const template = {
      // 消息模板
      key: 'template',
      colSpan: 24,
      label: <FormattedMessage id="message.template" />,
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
    const success = {
      // 成功的回调
      key: 'successCallbackSql',
      colSpan: 24,
      label: <FormattedMessage id="message.server.success" />,
      config: {
        rules: [
          {
            required: false,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.successCallbackSql,
      },
      component: <CInput disabled />,
    };
    const error = {
      // 失败的回调
      key: 'failCallbackSql',
      colSpan: 24,
      label: <FormattedMessage id="message.server.error" />,
      config: {
        rules: [
          {
            required: false,
            message: VALID_REQUIRED_MESSAGE,
          },
        ],
        initialValue: info.failCallbackSql,
      },
      component: <CInput disabled />,
    };
    let configs = [
      basicLine,
      name,
      type,
      method,
      timeType,
      limit,
      basicLine1,
      sql,
      users,
      template,
    ];
    if (!info.timingType || info.timingType === 1) {
      configs.splice(6, 0, circle);
    }
    return configs;
  };
  updateState = (obj, callback) => {
    this.setState({ ...obj }, () => {
      callback && callback();
    });
  };

  render() {
    const { loading } = this.state;
    const { form } = this.props;
    return <FormItems formConfigs={this.getFormConfigs()} form={form} loading={loading} />;
  }
}

export default Content;
