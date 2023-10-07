import { CButton, CInput, CMessage } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import CheckBoxSearchSelect from '@/components/MessageServe/Users/CheckBoxSearchSelect/CheckBoxSearchSelect';
import { Checkbox, Select, Tag } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Styles from './Users.less';

const { Option } = Select;

class Users extends Component {
  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(props.info) !== JSON.stringify(state.info)) {
      return { info: props.info };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      info: {},
    };
  }

  changeEmail = (value, basetype) => {
    const {
      info: { id },
    } = this.state;
    const { userInfo, updateState, metaUserData } = this.props;
    let newList = [...userInfo];
    let obj = newList.find(item => item.basetype === basetype);
    if (obj) {
      obj.receiver = value;
    } else {
      newList.push({
        receiver: value,
        basetype,
        messageTaskId: id,
      });
    }
    updateState({ userInfo: [...newList] });
  };
  // 修改
  change = (value, basetype) => {
    const {
      info: { id },
    } = this.state;
    const { userInfo, updateState } = this.props;
    let newList = [...userInfo];
    let flag = value ? 1 : 0;
    let obj = newList.find(item => item.basetype === basetype);
    if (obj) {
      obj.enabled = flag;
    } else {
      newList.push({
        enabled: flag,
        basetype,
        messageTaskId: id,
      });
    }
    updateState({ userInfo: [...newList] });
  };
  changeSelect = (value, basetype) => {
    const {
      info: { id },
    } = this.state;
    const { userInfo, updateState } = this.props;
    let newList = [...userInfo];
    let obj = newList.find(item => item.basetype === basetype);
    if (obj) {
      obj.receiver = value.join('|');
    } else {
      newList.push({
        receiver: value.join('|'),
        basetype,
        messageTaskId: id,
      });
    }
    updateState({ userInfo: [...newList] });
  };
  // 选择确定
  handleSetChecBoxValue = (selecteds, basetype) => {
    const {
      info: { id },
    } = this.state;
    const { userInfo, updateState } = this.props;
    let newList = [...userInfo];
    let obj = newList.find(item => item.basetype === basetype);
    const receiver = selecteds.map(item => item.id).join('|');
    const receiverName = selecteds.map(item => item.name).join('|');
    if (obj) {
      obj.receiver = receiver;
      obj.receiverName = receiverName;
    } else {
      newList.push({
        receiver,
        receiverName,
        basetype,
        messageTaskId: id,
      });
    }
    updateState({ userInfo: [...newList] });
  };
  // 获取配置
  getFormItems = () => {
    const { info } = this.state;
    const { userInfo } = this.props;
    const { columns } = info;
    let optionArr = null;
    if (columns) {
      let arr = columns.split('|');
      optionArr = arr.map((item, index) => {
        return (
          <Option value={item} key={index}>
            {item}
          </Option>
        );
      });
    }
    const user = userInfo.find(item => item.basetype === 5) || {};
    const fixUser = userInfo.find(item => item.basetype === 1) || {};
    const fixEmail = userInfo.find(item => item.basetype === 4) || {};
    let config = [
      {
        ignore: false,
        component: (
          <Checkbox checked={user.enabled} onChange={e => this.change(e.target.checked, 5)}>
            数据源接收人
          </Checkbox>
        ),
      },
      {
        ignore: false,
        component: (
          <Select
            value={user.receiver ? user.receiver.split('|') : []}
            onChange={e => this.changeSelect(e, 5)}
            style={{ width: '100%' }}
            mode="multiple"
          >
            {optionArr}
          </Select>
        ),
      },
      {
        ignore: false,
        component: (
          <Checkbox
            checked={fixUser.enabled}
            onChange={e => this.change(e.target.checked, 1, 'email')}
          >
            固定人员ID
          </Checkbox>
        ),
      },
      {
        ignore: false,
        component: (
          <CheckBoxSearchSelect
            fixUser={fixUser}
            deleteTag={data => this.handleSetChecBoxValue(data, 1)}
            setSelected={selecteds => this.handleSetChecBoxValue(selecteds, 1)}
          />
        ),
      },
      {
        ignore: [3, 5, 7].includes(info.basetype),
        component: (
          <Checkbox checked={fixEmail.enabled} onChange={e => this.change(e.target.checked, 4)}>
            固定邮箱
          </Checkbox>
        ),
      },
      {
        ignore: [3, 5, 7].includes(info.basetype),
        component: (
          <CInput
            value={fixEmail.receiver}
            onChange={e => this.changeEmail(e.target.value, 4)}
            placeholder="多个邮箱时以 | 分隔"
          />
        ),
      },
    ];
    return config.map((item, i) => {
      if (item.ignore) return null;
      return (
        <div className={Styles.itemForms} key={i}>
          {item.component}
        </div>
      );
    });
  };
  // 点击设置
  open = () => {
    this.setState({ visible: true });
  };
  // 渲染标签
  renderShowTag = () => {
    const { userInfo } = this.props;
    const tagList = [
      { id: 5, name: '数据源接收人' },
      { id: 1, name: '固定人员ID' },
      { id: 4, name: '固定邮箱' },
    ];
    let showArr = [];
    tagList.forEach(item => {
      if (userInfo.find(items => items.basetype === item.id && items.enabled === 1)) {
        showArr.push(item);
      }
    });
    return showArr.map(item => {
      return <Tag key={item.id}>{item.name}</Tag>;
    });
  };
  // 点击保存的时候对邮箱进行校验
  handleOk = () => {
    const { userInfo, metaUserData, updateState } = this.props;
    const fixEmail = userInfo.find(item => item.basetype === 4) || {};
    const email = fixEmail.receiver;
    if (email) {
      let reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
      let isFlag = true,
        emailArr = email.split('|');
      emailArr.forEach(item => {
        if (!reg.test(item)) isFlag = false;
      });
      if (!isFlag) {
        CMessage('请检测邮箱是否填写正确！', 'error');
        return;
      }
    }
    updateState({ metaUserData: JSON.parse(JSON.stringify(userInfo)) });
    this.setState({ visible: false });
  };
  // 取消的时候数据重置
  handleCancel = () => {
    const { userInfo, metaUserData, updateState } = this.props;
    updateState({ userInfo: JSON.parse(JSON.stringify(metaUserData)) });
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    return (
      <div className={Styles.wrap}>
        <CButton
          onClick={() => {
            this.open();
          }}
          isDefault={true}
        >
          <span className={`iconfont icon-layer-setting custom-color ${Styles.fontSize}`} />
          <span className={Styles.vNormal}>
            <FormattedMessage id="global.setting" />
          </span>
        </CButton>
        <div className={Styles.tagWrap}>{this.renderShowTag()}</div>
        <CreateModal
          title={'接收人参数设置'}
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          bodyStyle={{ padding: '30px 30px 0 50px' }}
        >
          {this.getFormItems()}
        </CreateModal>
      </div>
    );
  }
}

export default Users;
