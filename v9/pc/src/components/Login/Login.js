import { CMessage } from '@/components/common/BasicWidgets';
import CreateModal from '@/components/common/CreateModal/CreateModal';
import { BaseContext, DB_LANG_TYPE_TO_FRONT, THEME_COLOR } from '@/constants/global';
import query from '@/constants/query';
import secret from '@/constants/secret';
import styles from '@/layouts/BasicHeader/Language/LanguageSelect.less';
import { getVariableValue } from '@/services/globalcenter';
import { getLanguagesPage } from '@/services/language';
import { getUrl, login } from '@/services/login';
import { updatePassword } from '@/services/user';
import { Form, Icon, message, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Locale from '../../layouts/Locale/Locale';
import Styles from './Login.less';
import Internet from './loginStyle/Internet';
import Simple from './loginStyle/Simple';
import SecuritySetting from './SecuritySetting';

@connect(state => ({
  theme: state.global.theme,
  langLib: state.global.langLib,
}))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false, // 记住密码
      hasVerifyCode: false, // 是否需要验证码
      isEncryption: false, // 是否加密
      disabled: true,
      configObj: {}, // 配置集合
      loading: false,
      banners: [],
      infoEmptyTip: false,
      infoErrorTip: false,
      list: [], // 语言类型
      languageType: '',
      passwordValidity: '', // 密码有效期
      visibleShow: false,
      passwordLevel: '', // 密码等级
      loadingSave: false,
      userInfo: {},
      isDingTalkGovScan: -1,
      clientId: '',
      redirectUrl: '',
      qrCodeUrl: '',
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    this.getUrlMethod();
  }

  componentDidMount() {
    let isChecked = localStorage.getItem('checked') || 'false';
    let checked = isChecked === 'false' ? false : true;
    this.setState({
      checked,
    });
    this.setCode();
    this.getGolbalValue();
    getLanguagesPage({ pageSize: 99999, pageNum: 1 }).then(res => {
      let languageType = localStorage.getItem('language');
      this.setState({
        list: res.list || [],
        languageType: languageType || (res.list.length && res.list[0].keycode) || 'zh_CN',
      });
    });
  }

  getDefaultData = () => {
    let data = {};
    let isChecked = localStorage.getItem('checked') || 'false';
    let checked = isChecked === 'false' ? false : true;
    if (checked) {
      let account = secret.decrypt(localStorage.getItem('account'));
      let password = secret.decrypt(localStorage.getItem('password'));
      data = {
        username: account,
        password,
      };
    } else {
      data = {
        username: '',
        password: '',
      };
    }
    return data;
  };
  // 渲染语种
  renderList = () => {
    const { list } = this.state;
    return list.map(item => {
      return (
        <div
          className={styles.list}
          onClick={() => {
            this.chooseItem(item);
          }}
          key={item.id}
        >
          {item.name}
        </div>
      );
    });
  };
  // Popover 显示隐藏
  watchChange = visible => {
    this.setState({ visible });
  };
  // 选中多语言
  chooseItem = item => {
    const { keycode } = item;
    this.setState({ visible: false, languageType: keycode });
    localStorage.setItem('language', keycode);
    const { dispatch } = this.props;
    // 中英文
    dispatch({
      type: 'global/updateLang',
      payload: {
        lang: DB_LANG_TYPE_TO_FRONT[keycode] || 'zh',
      },
    });
  };
  // 显示选中的语言
  showLanguage = () => {
    const { list, languageType } = this.state;
    let langaugeName = list.find(item => item.keycode === languageType);
    return langaugeName ? langaugeName.name : '中文';
    return langaugeName ? langaugeName.name : <FormattedMessage id="locale.zh" />;
  };

  // 获取配置的背景图
  getUrlMethod = () => {
    getUrl({}).then(res => {
      let banners = [];
      // eslint-disable-next-line eqeqeq
      res.pcRotationChartOne != 0 && banners.push(res.pcRotationChartOne);
      // eslint-disable-next-line eqeqeq
      res.pcRotationChartTwo != 0 && banners.push(res.pcRotationChartTwo);
      // eslint-disable-next-line eqeqeq
      res.pcRotationChartThree != 0 && banners.push(res.pcRotationChartThree);
      this.setState(
        {
          configObj: res,
          banners,
        },
        () => {
          this.setTheme();
        },
      );
    });
  };
  setTheme = () => {
    const { configObj } = this.state;
    const { dispatch } = this.props;
    let themeType = THEME_COLOR.find(item => item.id === configObj.themeColor) || {};
    let theme = themeType.type || 'blue';
    dispatch({
      type: 'global/updateTheme',
      payload: {
        theme,
      },
    });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 0);
  };

  // 获取全局变量中的配置 是否加密，是否需要验证码
  getGolbalValue = () => {
    Promise.all([
      getVariableValue({ variableName: 'PasswrodEncrypted' }),
      getVariableValue({ variableName: 'VerifyCode' }),
      getVariableValue({ variableName: 'passwordValidity' }),
      getVariableValue({ variableName: 'isDingTalkGovScan' }),
      getVariableValue({ variableName: 'clientId' }),
      getVariableValue({ variableName: 'redirectUrl' }),
      getVariableValue({ variableName: 'qrCodeUrl' }),
    ])
      .then(res => {
        console.log(res);
        this.setState({
          isEncryption: res[0] === '0' ? false : true,
          hasVerifyCode: res[1] === '0' ? false : true,
          passwordValidity: res[2],
          isDingTalkGovScan: res[3],
          clientId: res[4],
          redirectUrl: res[5],
          qrCodeUrl: res[6],
          disabled: false,
        });
      })
      .catch(err => {
        this.setState({
          disabled: true,
        });
        err && err.msg && message.error(err.msg);
      });
  };

  handleSubmit = (err, values) => {
    // e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    if (!!!values.password || !!!values.username) {
      this.setState({
        infoEmptyTip: true,
        infoErrorTip: false,
      });
      return;
    }
    if (!err) {
      const { checked, isEncryption, hasVerifyCode, languageType, passwordValidity } = this.state;
      let newParams = {
        ...values,
        username: isEncryption ? secret.encrypt(values.username) : values.username,
        password: isEncryption ? secret.encrypt(values.password) : values.password,
        tag: 'PC',
        isValidate: hasVerifyCode ? 1 : 0,
        language: languageType,
      };
      this.setState({
        infoEmptyTip: false,
        infoErrorTip: false,
      });
      !hasVerifyCode && delete newParams.isValidate;
      login(newParams).then(
        res => {
          // window.location.href = `${URL_PREFIX}/`;
          // router.push(`${URL_PREFIX}/`);
          const { origin, pathname } = window.location;
          if (this.renturnIsTrue(passwordValidity, res)) {
            this.setCookie('token', res.token, 2);
            this.setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(res))), 2);
            if (checked) {
              localStorage.setItem('account', secret.encrypt(values.username));
              localStorage.setItem('password', secret.encrypt(values.password));
              localStorage.setItem('checked', checked);
            } else {
              localStorage.setItem('account', '');
              localStorage.setItem('password', '');
              localStorage.setItem('checked', checked);
            }
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
        },
        err => {
          this.setState({
            infoErrorTip: true,
            infoEmptyTip: false,
          });
          this.setCode();
          // message.error(err.data.msg);
        },
      );
    }
    // });
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
  setCode = () => {
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.open('get', query.GETCODE, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.onload = function(e) {
      if (this.status === 200) {
        let imageType = xhr.getResponseHeader('Content-Type');
        let blob = new Blob([this.response], { type: imageType });
        let url = (window.URL || window.webkitURL).createObjectURL(blob);
        that.setState({ url });
      }
    };
    xhr.send();
  };
  keepPassword = e => {
    this.setState({
      checked: e.target.checked,
    });
  };
  // 获取cookie
  getCookie = key => {
    if (document.cookie.length > 0) {
      var start = document.cookie.indexOf(key + '=');
      if (start !== -1) {
        start = start + key.length + 1;
        var end = document.cookie.indexOf(';', start);
        if (end === -1) end = document.cookie.length;
        return unescape(document.cookie.substring(start, end));
      }
    }
    return '';
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

  handleChange = value => {
    this.setState({ langType: value, open: false });
  };

  handleSave = () => {
    const { form, langLib } = this.props;
    const { userInfo } = this.state;
    form.validateFields((errs, values) => {
      if (errs) return;
      this.setState({ loadingSave: true });
      let params = {};
      Object.keys(values).forEach(items => {
        params[items] = secret.encrypt(values[items]);
      });
      params = {
        ...params,
        headers: {
          token: userInfo.token,
        },
      };
      updatePassword(params).then(
        res => {
          CMessage(langLib['validPwd.restPassword1']);
          this.setState({ loadingSave: false, visibleShow: false });
        },
        err => this.setState({ loadingSave: false }),
      );
    });
  };

  render() {
    const {
      checked,
      hasVerifyCode,
      disabled,
      configObj,
      loading,
      infoErrorTip,
      infoEmptyTip,
      banners,
      url,
      visible,
      visibleShow,
      passwordLevel,
      loadingSave,
      isDingTalkGovScan,
      clientId,
      redirectUrl,
      qrCodeUrl,
    } = this.state;
    const { pcLoginStyle } = configObj;
    if (loading) {
      return <div />;
    }
    const formData = this.getDefaultData();
    const loginConfigs = {
      checked,
      hasVerifyCode,
      disabled,
      configObj,
      loading,
      infoErrorTip,
      infoEmptyTip,
      banners,
      formData,
      pcLoginStyle,
      url,
      isDingTalkGovScan,
      setCode: this.setCode,
      keepPassword: this.keepPassword,
      handleSubmit: this.handleSubmit,
      // scanCodeSrc: `${qrCodeUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=get_user_info&authType=QRCODE&embedMode=true`, // 专有钉钉地址
      scanCodeSrc: `${qrCodeUrl}?APP_NAME=${clientId}&protocolKey=01a2c046-d485-4cca-a94d-3877c73e89d4&protocol=oauth2&BACK_URL=${redirectUrl}&embedMode=true&scope=get_user_info&state=`, // 浙政钉地址
    };
    // const scanCodeSrc = `https://login-pro.ding.zj.gov.cn/qrlogin/webAppLogin.htm?APP_NAME=ywsw_apiot_dingoa&protocolKey=01a2c046-d485-4cca-a94d-3877c73e89d4&protocol=oauth2&BACK_URL=${
    //   currentUrl.split('/#/')[0]
    // }&embedMode=true&scope=get_user_info&state=`;
    const { langLib, theme, dispatch } = this.props;
    const modalProps = {
      confirmLoading: loadingSave,
      visible: visibleShow,
      title: '',
      onCancel: () => this.setState({ visibleShow: false }),
      className: `${Styles.modal}`,
      onOk: this.handleSave,
      okText: <FormattedMessage id="sure.password" />,
      getContainer: document.getElementById('root'), // 挂载的html节点
    };
    const { form } = this.props;
    return (
      <BaseContext.Provider value={{ langLib, theme, dispatch }}>
        <Locale>
          <div className={Styles.loginWrap}>
            <div className={Styles.changeColor}>
              <Popover
                content={this.renderList()}
                placement="bottom"
                visible={visible}
                onVisibleChange={value => {
                  this.watchChange(value);
                }}
              >
                <div className={Styles.languageName}>
                  {this.showLanguage()} {!visible ? <Icon type="down" /> : <Icon type="up" />}
                </div>
              </Popover>
            </div>
            {pcLoginStyle === 2 ? <Internet {...loginConfigs} /> : <Simple {...loginConfigs} />}
          </div>
          <CreateModal {...modalProps}>
            <div className={Styles.name}>
              <p>
                <span className={`icon-update-password iconfont ${Styles.icon}`} />
                <FormattedMessage id="Password.invalid" />
              </p>
              <div>
                <FormattedMessage id={`validPwd.pattern${passwordLevel}`} />
              </div>
            </div>
            <Form>
              <SecuritySetting form={form} passwordLevel={passwordLevel} />
            </Form>
          </CreateModal>
        </Locale>
      </BaseContext.Provider>
    );
  }
}

export default Form.create()(Login);
