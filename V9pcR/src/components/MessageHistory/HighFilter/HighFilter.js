import { CInput } from '@/components/common/BasicWidgets';
import FormItems from '@/components/common/FormItems/FormItems';
import { DatePicker, Radio, Select } from 'antd';
import moment from 'moment';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;
const { RangePicker } = DatePicker;

class HighFilter extends Component {
  constructor(props) {
    super();
  }

  getValue = key => {
    const { form } = this.props;
    let values = form.getFieldValue(`${key}`);
    console.log(values);
    if (!values) return '';
    console.log(values, 2, moment(values));
    return moment(values).format('YYYY-MM-DD HH:mm:ss');
  };

  getFormConfigs = () => {
    const { highFilter } = this.props;
    const publicConfig = [
      {
        key: 'name',
        colon: false,
        colSpan: 12,
        label: <FormattedMessage id="message.history.name" />,
        config: {
          requre: false,
          initialValue: highFilter.name || '',
        },
        component: <CInput />,
      },
      {
        key: 'baseType',
        colon: false,
        colSpan: 12,
        label: <FormattedMessage id="message.history.basetype" />,
        config: {
          requre: false,
          initialValue: highFilter.baseType || '',
        },
        component: (
          <Select>
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
          </Select>
        ),
      },
      {
        key: 'time',
        colon: false,
        colSpan: 12,
        label: <FormattedMessage id="message.history.time" />,
        config: {
          requre: false,
          initialValue: highFilter.time,
        },
        component: <RangePicker style={{ width: '100%' }} showTime />,
      },
      {
        key: 'stateId',
        colon: false,
        colSpan: 12,
        label: <FormattedMessage id="message.history.stateid" />,
        config: {
          requre: false,
          initialValue: highFilter.stateId,
        },
        component: (
          <Radio.Group>
            <Radio value={2}>
              <FormattedMessage id="tasks.destruction" />
            </Radio>
            <Radio value={1}>
              <FormattedMessage id="tasks.success" />
            </Radio>
          </Radio.Group>
        ),
      },
    ];
    return publicConfig;
  };

  render() {
    const { form } = this.props;
    return <FormItems formConfigs={this.getFormConfigs()} form={form} loading={false} />;
  }
}

export default HighFilter;
