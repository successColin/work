import { CButton, CMessage, CTextArea } from '@/components/common/BasicWidgets';
import { checkSql } from '@/services/message';
import { Icon } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Styles from './Sql.less';

class SqlEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  // 确定操作
  handleOk = sqlValue => {
    checkSql({ checkSql: sqlValue }).then(
      res => {
        CMessage('sql校验通过！', 'success');
        const { doSplit } = this.props;
        doSplit && doSplit(sqlValue);
      },
      err => {
        CMessage('sql错误,请校验sql', 'error');
      },
    );
  };
  onchange = value => {
    const { onChange, rowKey } = this.props;
    onChange && onChange({ [rowKey]: value });
  };

  render() {
    const { info, rowKey } = this.props;
    return (
      <div className={Styles.boxWrap}>
        <CTextArea value={info[rowKey]} onChange={e => this.onchange(e.target.value)} />
        <CButton
          className={Styles.wrap}
          onClick={() => this.handleOk(info[rowKey])}
          isDefault={true}
        >
          <Icon className="custom-color" type="check-circle" />
          <FormattedMessage id="global.ok" />
        </CButton>
      </div>
    );
  }
}

export default SqlEdit;
