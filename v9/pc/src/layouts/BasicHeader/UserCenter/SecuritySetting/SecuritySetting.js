/*
 * @Author: Fus
 * @Date:   2019-09-23 15:13:26
 * @Desc: 修改密码
 */
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'dva';
import { Row, Col, Input } from 'antd';
import { getVariableValue } from '@/services/globalcenter';
import FormItems from '@/components/common/FormItems/FormItems';
import { BaseContext, VALID_REQUIRED_MESSAGE } from '@/constants/global';

@connect(state => ({
  userInfo: state.user.userInfo,
}))
class SecuritySetting extends Component {
  static contextType = BaseContext;
  state = {
    passwordLevel: '', // 密码等级
  };

  componentDidMount() {
    getVariableValue({ variableName: 'PasswordLevel' }).then(passwordLevel => {
      this.setState({
        passwordLevel,
      });
    });
  }

  getRules = () => {
    const { passwordLevel = '1' } = this.state;
    if (passwordLevel === '3') {
      return /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#%_*]).{8,100}/;
    } else if (passwordLevel === '2') {
      return /^(?=.*[0-9].*)(?=.*[A-Z].*)|(?=.*[a-z].*).{8,100}$/;
    } else {
      return /^[A-Za-z0-9]*.{8,100}$/;
    }
  };

  validPwd = (rule, value, callback) => {
    const newPwd = this.props.form.getFieldValue('newPassWord');
    if (newPwd !== value) {
      callback(<FormattedMessage id="validPwd.checkDiff" />);
      return;
    }
    this.validPwdStart(rule, value, callback);
  };
  validPwdStart = (rule, value, callback) => {
    const { passwordLevel = '1' } = this.state;
    const rules = this.getRules();
    if (!value) callback();
    if ( passwordLevel === '1' || passwordLevel === '2') {
      if (rules.test(value)) {
        let flag = new RegExp('[`$^&()=|{}\':;\',\\[\\].<>《》/?~！￥……&（）——|{}【】‘；：”“\'。，、？ ]');
        if (flag.test(value)) { // 如果包含特殊字符返回false
          callback('只允许~!@#%_*特殊符号');
          return;
        }
        callback();
      } else {
        callback(<FormattedMessage id={`validPwd.pattern${passwordLevel}`} />);
        return;
      };
    }
    if (passwordLevel === '3') {
      if (!(rules.test(value))) {
        callback(<FormattedMessage id={`validPwd.pattern${passwordLevel}`} />);
        return;
      }
      callback();
    }
    callback();
  }
  getFormConfigs = () => {
    const { langLib } = this.context;
    const { passwordLevel = '1' } = this.state;
    return [
      {
        key: 'oldPassWord',
        label: <FormattedMessage id='userCenter.oldPassWord' />,
        colSpan: 24,
        config: {
          rules: [{
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          }],
        },
        component: <Input.Password placeholder={langLib['userCenter.placeholder.oldPwd']} />,
      },
      {
        key: 'newPassWord',
        label: <FormattedMessage id='userCenter.newPassWord' />,
        colSpan: 24,
        config: {
          rules: [{
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
            // {
            //   min: 8,
            //   message: <FormattedMessage id='validPwd.minLength' />,
            //   // pattern: this.getRules(),
            //   // pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#%_*])[\da-zA-Z~!@#%_*]{8,}$/,
            //   // message: <FormattedMessage id={`validPwd.pattern${passwordLevel}`} />,
            // },
            {
              validator: this.validPwdStart,
            },
          ],
        },
        component: <Input.Password placeholder={langLib['userCenter.placeholder.newPwd']} />,
      },
      {
        key: 'checkPassWord',
        label: <FormattedMessage id='userCenter.newPassWord' />,
        colSpan: 24,
        config: {
          rules: [
            {
            required: true,
            message: VALID_REQUIRED_MESSAGE,
          },
            //   {
            //   pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#%_*])[\da-zA-Z~!@#%_*]{8,}$/,
            //   message: <FormattedMessage id="validPwd.pattern"/>,
            // },
            // {
            //   min: 8,
            //   message: <FormattedMessage id='validPwd.minLength' />,
            //   // pattern: this.getRules(),
            //   // message: <FormattedMessage id={`validPwd.pattern${passwordLevel}`} />,
            // },
            {
              validator: this.validPwd,
            }],
        },
        component: <Input.Password placeholder={langLib['userCenter.placeholder.checkNewPwd']} />,
      }];
  };

  render() {
    const { form } = this.props;
    return (
      <div>
        <Row>
          <Col span={12}>
            <FormItems
              formConfigs={this.getFormConfigs()}
              loading={false}
              form={form}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SecuritySetting;
