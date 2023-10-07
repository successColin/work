//  * @Descripttion: 关联用户
//  * @Author: ytx
//  * @Date: 2022-06-22 16:45:10
//  * @Last Modified by: ytx
//  * @Last Modified time: 2022-06-22 16:45:10
import { CButton } from '@/components/common/BasicWidgets';
import CInput from '@/components/common/BasicWidgets/Widgets/CInput/CInput';
import secret from '@/constants/secret';
import { getVariableValue } from '@/services/globalcenter';
import { getLanguagesPage } from '@/services/language';
import { getUrl, login } from '@/services/login';
import { Form, Input, message } from 'antd';
import moment from 'moment';
import { Component } from 'react';
import styles from './index.less';

class AssociatedUser extends Component {
  state = {
    formData: {
      username: '',
      password: '',
    },
    code: '',
    isEncryption: false, // 是否加密
    passwordValidity: '', // 密码有效期
    list: [], // 语言类型
    languageType: '',
    configObj: {}, // 配置集合
  };

  componentDidMount() {
    this.getGolbalValue();
  }
  // setTheme = () => {
  //   const { configObj } = this.state;
  //   let themeType = THEME_COLOR.find(item => item.id === configObj.themeColor) || {};
  //   let theme = themeType.type || 'blue';
  //   this.context.dispatch({
  //     type: 'global/updateTheme',
  //     payload: {
  //       theme,
  //     },
  //   });
  // };

  // 获取全局变量中的配置 是否加密，是否需要验证码
  getGolbalValue = () => {
    message.error('您还未与系统账号进行绑定');
    const code = localStorage.getItem('DingDingCode');
    this.setState({
      code,
    });

    getUrl({}).then(res => {
      let banners = [];
      res.pcRotationChartOne !== 0 && banners.push(res.pcRotationChartOne);
      res.pcRotationChartTwo !== 0 && banners.push(res.pcRotationChartTwo);
      res.pcRotationChartThree !== 0 && banners.push(res.pcRotationChartThree);
      this.setState(
        {
          configObj: res,
          banners,
        },
        () => {
          // this.setTheme();
        },
      );
    });

    Promise.all([
      getVariableValue({ variableName: 'PasswrodEncrypted' }),
      getVariableValue({ variableName: 'passwordValidity' }),
    ])
      .then(res => {
        this.setState({
          isEncryption: res[0] === '0' ? false : true,
          passwordValidity: res[1],
        });
      })
      .catch(err => {
        err && err.msg && message.error(err.msg);
      });

    getLanguagesPage({ pageSize: 99999, pageNum: 1, keyWords: '' }).then(res => {
      let languageType = localStorage.getItem('language');
      this.setState({
        list: res.list || [],
        languageType: languageType || (res.list.length && res.list[0].keycode) || 'zh_CN',
      });
    });
  };

  // 判断帐号密码有没有在有效期内，如果在有效期内，则正常登录
  renturnIsTrue = (value = '', userInfo = {}) => {
    if (value === '0' || !value) return true;
    const { passwordValidity, ResponseSysDate } = userInfo;
    const lastDay = moment(passwordValidity).format('YYYY-MM-DD');
    const currentDay = moment(new Date(ResponseSysDate)).format('YYYY-MM-DD');
    const diff = moment(currentDay).diff(moment(lastDay), 'days');
    const diffType = Number(value);
    if (diff <= diffType) {
      // 如果当前时间期差小于密码有效期，则是在正常范围内
      return true;
    }
    return false;
  };

  // 保存cookie
  setCookie = (cName, value, expiredays) => {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
      cName +
      '=' +
      decodeURIComponent(value) +
      (expiredays == null ? '' : ';expires=' + exdate.toGMTString());
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { password, username } = values;
      if (!!!password && !!!username) {
        return;
      }
      if (!err) {
        const { isEncryption, languageType, passwordValidity, code } = this.state;
        let newParams = {
          username: isEncryption ? secret.encrypt(username) : username,
          password: isEncryption ? secret.encrypt(password) : password,
          tag: 'PC',
          language: languageType,
          zwddBindCode: code,
        };
        login(newParams).then(res => {
          const { origin, pathname } = window.location;
          if (this.renturnIsTrue(passwordValidity, res)) {
            this.setCookie('token', res.token, 2);
            this.setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(res))), 2);

            localStorage.setItem('account', secret.encrypt(values.username));
            localStorage.setItem('password', secret.encrypt(values.password));
            localStorage.setItem('checked', true);

            const { configObj } = this.state;
            localStorage.setItem('isNormalLogin', 1); // 是否正常登录，1-正常登录；0-需要走其他逻辑
            localStorage.setItem('sss', configObj.systemLogo || ''); // 系统logourl
            localStorage.setItem('ttt', configObj.themeColor); // 系统色
            localStorage.setItem('topt', configObj.headerStyle); // 顶部颜色
            localStorage.setItem('hhh', configObj.systemLogoHeight || 25); // logo高度
            localStorage.setItem('ccc', true); // 设置次数，用于提示授权到期提醒
            window.location.href = `${origin}${pathname}`;
            localStorage.setItem('passwordUnUser', true); // 系统logourl
          } else {
            getVariableValue({ variableName: 'PasswordLevel' }).then(passwordLevel => {
              this.setState({
                passwordLevel,
                visibleShow: true,
                userInfo: res,
              });
            });
          }
        });
      }
    });
  };

  render() {
    const { formData } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.associatedUser}>
        <div className={styles.associatedUser__box}>
          <section>
            <div>
              <i className={`iconfont icon-trigger-filter ${styles.iconfont}`} />
              请关联您的账号密码
            </div>
            <div>为了数据同步，扫码需关联工作账号和密码，下次登录无需再绑定！</div>
            <Form>
              <Form.Item label="账号">
                {getFieldDecorator('username', {
                  initialValue: formData.username,
                  rules: [{ required: true, message: '请输入用户名' }],
                })(<CInput placeholder="请输入用户名" />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  initialValue: formData.password,
                  rules: [{ required: true, message: '请输入密码' }],
                })(<Input.Password placeholder="请输入密码" />)}
              </Form.Item>
            </Form>
          </section>
          <footer>
            <CButton className={styles.button1} type="primary" onClick={this.handleSubmit}>
              确定关联
            </CButton>
            {/* <CButton className={styles.button2}>取消</CButton> */}
          </footer>
        </div>
      </div>
    );
  }
}

export default Form.create()(AssociatedUser);
