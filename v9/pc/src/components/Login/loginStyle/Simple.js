import zhezhendingImg from '@/assets/zhezhending.svg';
import CButton from '@/components/common/BasicWidgets/Widgets/CButton/CButton';
import CInput from '@/components/common/BasicWidgets/Widgets/CInput/CInput';
import { BaseContext } from '@/constants/global';
import { sweepLoginCode } from '@/services/login';
import themes from '@/themes';
import { setCookie } from '@/utils/common';
import { Checkbox, Col, Form, Icon, Row, Spin } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import adLogo from '../../../assets/adlogo.png';
import login_bg from '../../../assets/login_bg.jpg';
import Styles from '../Login.less';

@connect(state => ({
  theme: state.global.theme,
}))
class Simple extends Component {
  static contextType = BaseContext;
  constructor(props) {
    super(props);
    this.state = {
      switchScan: false,
    };
  }

  componentWillMount() {}

  /** 组件销毁后必要的清理*/
  componentWillUnmount() {
    window.removeEventListener('message', this.scanCode);
  }

  componentDidMount() {}

  scanCode = e => {
    const code = e.data && e.data.code;
    if (code) {
      localStorage.setItem('DingDingCode', code);
      sweepLoginCode({
        code: code,
      }).then(res => {
        setCookie('token', res.token, 2);
        setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(res))), 2);
        window.location.href = '/';
      });
      // .catch(err => {
      //   const { origin } = window.location;
      //   window.location.href = `${origin}/#/associatedUser`;
      //   return;
      // });
    }
  };

  handleSubmit = e => {
    const { handleSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      handleSubmit(err, values);
    });
  };

  handleSwitchScan = () => {
    this.setState({ switchScan: true }, () => {
      window.addEventListener('message', this.scanCode);
    });
  };

  handleBack = () => {
    this.setState({ switchScan: false }, () => {
      window.removeEventListener('message', this.scanCode);
    });
  };

  handleJump = () => {
    window.open('https://www.ding.zj.gov.cn/pc/index.html#/');
  };

  render() {
    const {
      theme,
      form,
      checked,
      hasVerifyCode,
      disabled,
      configObj,
      loading,
      keepPassword,
      formData,
      setCode,
      url,
      isDingTalkGovScan,
      scanCodeSrc,
    } = this.props;
    const { switchScan } = this.state;

    const { getFieldDecorator } = form;
    const activeTheme = themes[theme];
    const wrapCls = `theme-${theme}`;
    let isChecked = localStorage.getItem('checked') || 'false';
    // const { checked, hasVerifyCode, disabled, configObj, loading } = this.state;
    if (loading) {
      return <div />;
    }
    const wrapLayoutCls = classNames({
      [activeTheme[wrapCls]]: true,
      [Styles.box]: true,
    });
    const style = {
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url("${configObj.loginBackGroupURL || login_bg}")`,
    };
    const { langLib } = this.context;
    return (
      <div className={`${wrapLayoutCls} container`} style={style}>
        {/*    style={{ 'width': '200px', 'position': 'absolute', 'top': '27px', 'left': '61px', 'zIndex': 1 }}/>*/}
        <div className={Styles.loginForm}>
          <div className={`${Styles.formLeft} ${configObj.loginLogoURL ? Styles.formLeftBg : ''}`}>
            <div>
              <img className={Styles.adLogin} src={configObj.loginLogoURL || adLogo} alt="" />
            </div>
          </div>
          {isDingTalkGovScan === '3' ? (
            <div className={Styles.scanCodeContent}>
              <div className={Styles.scanCodeContentTitle}>
                <img src={zhezhendingImg} style={{ width: '25px', marginRight: '7px' }} />
                浙政钉扫码登录
              </div>
              {/* 二维码登录 */}
              <div className={Styles.scanCode}>
                <Spin className={Styles.scanCode__loading} spinning={true} />
                <iframe
                  className={Styles.scanCode__iframe}
                  src={scanCodeSrc}
                  frameBorder={0}
                  width="210"
                  height="280"
                  scrolling="no"
                />
              </div>
              <div className={Styles.scanCodeContentDec}>
                请使用
                <span className={Styles.scanCodeContentDecVal} onClick={this.handleJump}>
                  {' '}
                  浙政钉APP{' '}
                </span>
                扫码登录
              </div>
            </div>
          ) : switchScan ? (
            <div className={Styles.scanCodeContent}>
              <div className={Styles.scanCodeContentTitle}>
                <img src={zhezhendingImg} style={{ width: '25px', marginRight: '7px' }} />
                浙政钉扫码登录
              </div>
              {/* 二维码登录 */}
              <div className={Styles.scanCode}>
                <Spin className={Styles.scanCode__loading} spinning={true} />
                <iframe
                  className={Styles.scanCode__iframe}
                  src={scanCodeSrc}
                  frameBorder={0}
                  width="210"
                  height="280"
                  scrolling="no"
                />
              </div>
              <div className={Styles.scanCodeContentDec}>
                请使用
                <span className={Styles.scanCodeContentDecVal} onClick={this.handleJump}>
                  {' '}
                  浙政钉APP{' '}
                </span>
                扫码登录
              </div>
              <div className={Styles.scanCodeContentBack} onClick={this.handleBack}>
                <Icon type="left" className={Styles.scanCodeContentBackIcon} />
                返回账号密码登录
              </div>
            </div>
          ) : (
            <div className={Styles.formRight}>
              <p className={`${Styles.loginName} custom-color`}>Login</p>

              <Form className={Styles.FormDetial} onSubmit={this.handleSubmit}>
                <Form.Item>
                  {getFieldDecorator('username', {
                    initialValue: formData.username,
                    rules: [{ required: true, message: langLib['login.placeholder.enter'] }],
                  })(
                    <CInput
                      className={hasVerifyCode ? Styles.commonInput1 : Styles.commonInput}
                      prefix={<Icon type="user" className={`${Styles.iconSty} custom-color`} />}
                      placeholder={langLib['login.placeholder.enter']}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    initialValue: formData.password,
                    rules: [
                      { required: true, message: langLib['login.form.password'] },
                      // {
                      //   pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#%_*])[\da-zA-Z~!@#%_*]{8,}$/,
                      //   message: '大小写字母、数字和特殊字符(~!@#%_*)8位以上',
                      // },
                    ],
                  })(
                    <CInput
                      className={hasVerifyCode ? Styles.commonInput1 : Styles.commonInput}
                      prefix={<Icon type="lock" className={`${Styles.iconSty} custom-color`} />}
                      type="password"
                      placeholder={langLib['login.form.password']}
                    />,
                  )}
                </Form.Item>
                {hasVerifyCode ? (
                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: langLib['login.placeholder.code'] }],
                        })(
                          <CInput
                            className={hasVerifyCode ? Styles.commonInput1 : Styles.commonInput}
                            prefix={
                              <Icon type="safety" className={`${Styles.iconSty} custom-color`} />
                            }
                            placeholder={langLib['login.placeholder.code']}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <img onClick={() => setCode()} className={Styles.imgSafe} src={url} alt="" />
                    </Col>
                  </Row>
                ) : null}
                <Form.Item>
                  <Row className={Styles.forget}>
                    <Col span={12} className={Styles.forgetLeft}>
                      <Checkbox
                        checked={checked}
                        onChange={keepPassword}
                        className={Styles.chekboxSty}
                      />
                      <FormattedMessage id="login.form.isRemeber" />
                    </Col>
                    {isDingTalkGovScan === '2' ? (
                      <Col span={12} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <span className={Styles.scanCodeContainer} onClick={this.handleSwitchScan}>
                          <img src={zhezhendingImg} style={{ width: '18px', marginRight: '7px' }} />
                          浙政钉扫码登录
                        </span>
                      </Col>
                    ) : (
                      ''
                    )}

                    {/* <Col span={12} className={Styles.forgetRight}>忘记密码?</Col>*/}
                  </Row>
                  <Row className={Styles.forget}>
                    <Col span={24} className="loginBtn custom-color">
                      <CButton disabled={disabled} htmlType="submit" onClick={this.handleSubmit}>
                        <FormattedMessage id="login.log.in" />
                      </CButton>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>

        <div className={Styles.RecordNumber}>
          <a href={'http://beian.miit.gov.cn'} target={'_black'}>
            {configObj.recordCode || ''}
          </a>
        </div>
      </div>
    );
  }
}

export default Form.create()(Simple);
