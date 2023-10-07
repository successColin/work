/*
 * @Author: Fus
 * @Date:   2019-09-10 21:29:48
 * @Desc: 新增组
 */

import { CButton } from '@/components/common/BasicWidgets';
import CInput from '@/components/common/BasicWidgets/Widgets/CInput/CInput';
import CMessage from '@/components/common/BasicWidgets/Widgets/CMessage/CMessage';
import FormItems from '@/components/common/FormItems/FormItems';
import { BaseContext, BOOL_TYPE, BOOL_VALUE_MAP } from '@/constants/global';
import { APP_SCROLL_TYPE } from '@/constants/pageConfig';
import { updateAppNotice } from '@/services/appLibrary';
import { Radio, Select } from 'antd';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './ConsultationForm.less';

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
class ConsultationForm extends Component {
  static contextType = BaseContext;
  state = {
    loading: false,
    visible: false,
  };

  componentDidMount() {}

  // 更新组数据
  updateGroupDetail = (key, value) => {
    const { consultationDetails, updateState } = this.props;
    console.log(value);
    updateState({
      consultationDetails: {
        ...consultationDetails,
        [key]: value,
      },
    });
  };
  getFormConfigs = () => {
    const { consultationDetails, updateState } = this.props;
    return [
      {
        key: 'enabled',
        label: <FormattedMessage id="appHomeConfig.group.information" />,
        config: {
          initialValue: consultationDetails.enabled,
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
        key: 'name',
        label: <FormattedMessage id="appHomeConfig.group.information.tit" />,
        config: {
          initialValue: consultationDetails.name || '行业资讯',
        },
        colSpan: 24,
        itemLayout,
        component: <CInput onChange={val => this.updateGroupDetail('name', val.target.value)} />,
      },
    ];
  };
  // 保存
  handleSave = () => {
    const { langLib } = this.context;
    this.props.form.validateFieldsAndScroll((errs, values) => {
      if (errs) return;
      console.log(values, '保存资讯');
      const { appData = {} } = this.props.appHomeConfig;
      const { id: appId } = appData;
      const { info = {} } = this.state;
      const { id } = info;
      let params = {
        ...values,
        id,
        appId,
        typeId: 2,
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
          <p className={`${styles.tit} system__fontColor--must system__lineBorder--bottom`}>
            <FormattedMessage id="appHomeConfig.sys.information" />
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

export default ConsultationForm;
