/*
 * @Author: Fus
 * @Date:   2019-09-10 21:29:48
 * @Desc: 新增组
 */

import { CButton } from '@/components/common/BasicWidgets';
import CMessage from '@/components/common/BasicWidgets/Widgets/CMessage/CMessage';
import FormItems from '@/components/common/FormItems/FormItems';
import { BaseContext, BOOL_TYPE, BOOL_VALUE_MAP } from '@/constants/global';
import { APP_SCROLL_TYPE } from '@/constants/pageConfig';
import { getAppNotice, updateAppNotice } from '@/services/appLibrary';
import { Radio, Select } from 'antd';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './NoticeeForm.less';

const itemLayout = {
  labelCol: {
    sm: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 24 },
  },
};
const { Option } = Select;
// 是否的选择项
const boolOptions = BOOL_TYPE.map(item => (
  <Radio value={BOOL_VALUE_MAP[item]} key={`bool_${BOOL_VALUE_MAP[item]}`}>
    <FormattedMessage id={item} />
  </Radio>
));

// 风格选项
const styleOptions = Object.keys(APP_SCROLL_TYPE).map(item => (
  <Option key={`style_${item}`} value={+item}>
    <FormattedMessage id={APP_SCROLL_TYPE[item]} />
  </Option>
));

@connect(state => ({
  appHomeConfig: state.appHomeConfig,
  functionData: state.tabs.activeTabData.functionData,
}))
class NoticeForm extends Component {
  static contextType = BaseContext;
  state = {
    loading: false,
    info: {},
    visible: false,
  };

  componentDidMount() {
    this.fetchInfo();
  }

  fetchInfo = () => {
    const { appData = {} } = this.props.appHomeConfig;
    const { id: appId } = appData;
    getAppNotice({ id: appId, typeId: 1 }).then(res => {
      this.setState({ info: res });
    });
  };
  // 更新组数据
  updateGroupDetail = (key, value) => {
    const { info } = this.state;
    this.setState({
      info: {
        ...info,
        [key]: value,
      },
    });
  };
  getFormConfigs = () => {
    const { info = {} } = this.state;
    return [
      {
        key: 'enabled',
        label: <FormattedMessage id="appHomeConfig.group.announcement" />,
        config: {
          initialValue: info.enabled,
        },
        colSpan: 24,
        itemLayout,
        // ignore: isUserCenter,
        component: (
          <Radio.Group onChange={e => this.updateGroupDetail('enabled', e.target.value)}>
            {boolOptions}
          </Radio.Group>
        ),
      },
      {
        key: 'basetype',
        label: <FormattedMessage id="appHomeConfig.group.scroll.type" />,
        config: {
          initialValue: info.basetype || 1,
        },
        colSpan: 24,
        itemLayout,
        component: (
          <Select onChange={val => this.updateGroupDetail('basetype', val)}>{styleOptions}</Select>
        ),
      },
    ];
  };
  // 保存
  handleSave = () => {
    const { langLib } = this.context;
    this.props.form.validateFieldsAndScroll((errs, values) => {
      if (errs) return;
      const { appData = {} } = this.props.appHomeConfig;
      const { id: appId } = appData;
      const { info = {} } = this.state;
      const { id } = info;
      let params = {
        ...values,
        id,
        appId,
        typeId: 1,
      };
      this.setState({ loading: true });
      updateAppNotice(params).then(
        res => {
          CMessage(langLib['message.save.success']);
          this.setState({ loading: false });
        },
        err => this.setState({ loading: false }),
      );
    });
  };

  render() {
    const { form, functionData } = this.props;
    const { loading } = this.state;

    const { canmodify } = functionData.attributes;
    return (
      <div className={styles.wrap}>
        <div className={styles.content}>
          <p className={`${styles.tit} system__lineBorder--bottom system__fontColor--must`}>
            <FormattedMessage id="appHomeConfig.sys.notice" />
          </p>
          <FormItems formConfigs={this.getFormConfigs()} form={form} loading={false} />
        </div>
        <div className={`${styles.footer} system__lineBorder--top`}>
          {canmodify ? (
            <CButton type="primary" onClick={() => this.handleSave()} loading={loading}>
              <FormattedMessage id="global.save" />
            </CButton>
          ) : null}
        </div>
      </div>
    );
  }
}

export default NoticeForm;
