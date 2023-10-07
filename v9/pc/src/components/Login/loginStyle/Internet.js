import zhezhendingImg from '@/assets/zhezhending.svg';
import CButton from '@/components/common/BasicWidgets/Widgets/CButton/CButton';
import CInput from '@/components/common/BasicWidgets/Widgets/CInput/CInput';
// import LanguageSelect from './Language/LanguageSelect.js';
import { BaseContext } from '@/constants/global';
import { sweepLoginCode } from '@/services/login';
import themes from '@/themes';
import { setCookie } from '@/utils/common';
import { Checkbox, Col, Form, Icon, Input, Row, Spin } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Styles from '../Internet.less';

@connect(state => ({
  theme: state.global.theme,
}))
class Internet extends Component {
  static contextType = BaseContext;

  constructor(props) {
    super(props);
    this.state = {
      currentBanner: 0,
      prevBanner: null,
      switchScan: false,
    };
  }

  componentWillMount() {
    // setTimeout(function(){
    var uAgent = window.navigator.userAgent;
    var isIOS = uAgent.match(/iphone/i);
    var deviceWidth = document.body.clientWidth || document.documentElement.clientWidth;
    document.documentElement.style.fontSize = deviceWidth / 14.4 + 'px';
    // },500)
    // 加了这个 setState 无效
    // this.setState = (state, callback) => {
    //   return;
    // };
  }

  componentDidMount() {
    const { banners } = this.props;
    if (banners.length > 1) {
      setInterval(() => {
        this.carouselBanner();
      }, 3000);
    }
  }

  handleSubmit = e => {
    const { handleSubmit } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      handleSubmit(err, values);
    });
  };
  // 生成banner图
  getBannerList = () => {
    const { prevBanner, currentBanner } = this.state;
    const { banners } = this.props;
    let bannerList = [];
    banners.forEach((item, index) => {
      const bannerCls = classNames({
        [Styles.bannerItem]: true,
        [Styles.prevBanner]: prevBanner === index,
        [Styles.currentBanner]: currentBanner === index,
      });
      bannerList.push(<div className={bannerCls} style={{ backgroundImage: `url("${item}")` }} />);
    });
    return bannerList;
  };
  // 轮播
  carouselBanner = () => {
    const { prevBanner, currentBanner } = this.state;
    const { banners } = this.props;
    const len = banners.length;
    let prev, current;
    if (currentBanner === len - 1) {
      current = 0;
      prev = len - 1;
    } else {
      current = currentBanner + 1;
      prev = currentBanner;
    }
    this.setState({
      currentBanner: current,
      prevBanner: prev,
    });
    setTimeout(() => {
      this.setState({
        prevBanner: null,
      });
    }, 1000);
  };

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

  /** 组件销毁后必要的清理*/
  componentWillUnmount() {
    window.removeEventListener('message', this.scanCode);
  }

  render() {
    const {
      theme,
      form,
      checked,
      hasVerifyCode,
      disabled,
      configObj,
      loading,
      infoErrorTip,
      infoEmptyTip,
      banners,
      keepPassword,
      formData,
      setCode,
      url,
      isDingTalkGovScan,
      scanCodeSrc,
    } = this.props;
    const { switchScan } = this.state;

    const { currentBanner } = this.state;
    const { getFieldDecorator } = form;
    const activeTheme = themes[theme];
    const wrapCls = `theme-${theme}`;
    const wrapLayoutCls = classNames({
      [activeTheme[wrapCls]]: true,
      [Styles.box]: true,
    });
    let isChecked = localStorage.getItem('checked') || 'false';
    if (loading) {
      return <div />;
    }
    const { langLib } = this.context;
    return (
      <div className={wrapLayoutCls}>
        <div className={Styles.loginWrap}>
          <div className={Styles.loginLeftWrap}>
            <div className={Styles.loginBanner}>{banners.length && this.getBannerList()}</div>
            <ul className={Styles.spotList}>
              {banners.length &&
                banners.map((item, index) => {
                  return (
                    <li
                      className={`${currentBanner === index ? Styles.currentSpot : ''}`}
                      key={index}
                    />
                  );
                })}
            </ul>
            {configObj.pcLoginLogo && (
              <img className={Styles.pcLoginLogo} src={configObj.pcLoginLogo} alt="" />
            )}
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
            <div className={Styles.loginRightWrap}>
              {/* <div className={Styles.langWrap}>
                <LanguageSelect/>
            </div> */}
              <div className={Styles.formRight}>
                <p className={`${Styles.loginName}`}>Login</p>
                <p
                  className={Styles.hello}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
                >
                  <FormattedMessage id="login.welcome" />
                  {/* <Col span={12}>
                    </Col> */}
                  {isDingTalkGovScan === '2' ? (
                    // <Col span={12} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    // </Col>
                    <span
                      className={Styles.scanCodeContainer}
                      onClick={this.handleSwitchScan}
                      style={{ position: 'relative', top: '-8px' }}
                    >
                      <img src={zhezhendingImg} style={{ width: '18px', marginRight: '7px' }} />
                      浙政钉扫码登录
                    </span>
                  ) : (
                    ''
                  )}
                </p>
                {infoEmptyTip && (
                  <p className={Styles.infoEmptyTip}>
                    <FormattedMessage id="login.please" />
                  </p>
                )}
                {infoErrorTip && (
                  <p className={Styles.infoErrorTip}>
                    <FormattedMessage id="login.please" />
                  </p>
                )}
                <Form className={Styles.FormDetial} onSubmit={this.handleSubmit}>
                  <Form.Item label={langLib['login.form.account']}>
                    {getFieldDecorator('username', {
                      initialValue: formData.username,
                      labelCol: { span: 24 },
                      // rules: [{ required: true, message: '' }],
                    })(
                      // <div>
                      // <p className={Styles.loginLabel}>账号</p>
                      <CInput
                        className={hasVerifyCode ? Styles.commonInput1 : Styles.commonInput}
                        // prefix={<Icon type="user" className={`${Styles.iconSty} custom-color`}/>}
                        placeholder={langLib['login.placeholder.enter']}
                      />,
                      // </div>
                    )}
                  </Form.Item>
                  <Form.Item label={langLib['login.form.password']}>
                    {getFieldDecorator('password', {
                      initialValue: formData.password,
                      rules: [
                        // { required: true,  },
                        // {
                        //   pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#%_*])[\da-zA-Z~!@#%_*]{8,}$/,
                        //   message: '大小写字母、数字和特殊字符(~!@#%_*)8位以上',
                        // },
                      ],
                    })(
                      // <div>
                      // <p className={Styles.loginLabel}>密码</p>

                      <Input.Password
                        className={hasVerifyCode ? Styles.commonInput1 : Styles.commonInput}
                        placeholder={langLib['login.placeholder.enterPassword']}
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
                              // prefix={<Icon type="safety" className={`${Styles.iconSty} custom-color`}/>}
                              placeholder={langLib['login.placeholder.code']}
                            />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <img
                          onClick={() => setCode()}
                          className={Styles.imgSafe}
                          src={url}
                          alt=""
                        />
                      </Col>
                    </Row>
                  ) : null}
                  <Form.Item>
                    <Row className={Styles.forget}>
                      <Col span={12} className={Styles.forgetLeft}>
                        <Checkbox
                          checked={checked}
                          onChange={keepPassword}
                          className={`${Styles.chekboxSty} rememberPassword`}
                        />
                        <FormattedMessage id="login.form.isRemeber" />
                      </Col>
                      {/* <Col span={12} className={Styles.forgetRight}>忘记密码?</Col> */}
                    </Row>
                    <Row className={Styles.forget}>
                      <Col span={24} className={`${Styles.loginBtn} internetBtnDefault`}>
                        <CButton disabled={disabled} htmlType="submit" onClick={this.handleSubmit}>
                          <FormattedMessage id="login.log.in" />
                        </CButton>
                      </Col>
                    </Row>
                    {/* <Row className={Styles.forget}>
                    <Col span={24} className={Styles.register}>
                      还没账号?<span>立即注册</span>
                    </Col>
                  </Row> */}
                  </Form.Item>
                </Form>
              </div>

              <div className={Styles.RecordNumber}>
                <a href={'http://beian.miit.gov.cn'} target={'_black'}>
                  {configObj.recordCode || '浙江公网安备：浙B2-20080101'}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create()(Internet);
