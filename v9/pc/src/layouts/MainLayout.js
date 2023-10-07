/*
 * @Author: Fus
 * @Date:   2019-04-24 14:16:46
 * @Last Modified by: ytx
 * @Last Modified time: 2022-11-28 13:21:46
 * @Desc: 主体layout 包括Header/Sidebar/Footer
 */
import secret from '@/constants/secret';
import { getVariableValue } from '@/services/globalcenter';
import { getUrl, ssoByAccount, zwdingtalkLogin } from '@/services/login';
import { getCookie, setCookie } from '@/utils/common';
import { getDingDingCode } from '@/utils/dingding/index';
import { Layout, message } from 'antd';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'dva';
import { Component } from 'react';
import router from 'umi/router';
import { BaseContext, THEME_COLOR, URL_PREFIX } from '../constants/global';
import themes from '../themes';
import BasicHeader from './BasicHeader/BasicHeader';
import ConTainer from './Container/Container';
import Locale from './Locale/Locale';
import styles from './MainLayout.less';
import Sidebar from './Sidebar/Sidebar';

const { Content } = Layout;

@connect(state => ({
  theme: state.global.theme,
  langLib: state.global.langLib,
  showSidebar: state.global.showSidebar,
  mainPageConfig: state.global.mainPageConfig,
}))
class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSsoByAccount: true,
    };
  }

  componentWillMount() {
    let ttt = localStorage.getItem('ttt');
    getUrl().then(
      res => {
        ttt = res.themeColor || 2;
        localStorage.setItem('ttt', ttt);
        localStorage.setItem('topt', res.headerStyle);
        localStorage.setItem('systemStyle', res.systemStyle);
        localStorage.setItem('hhh', res.systemLogoHeight || 25); // logo高度
        localStorage.setItem('sss', res.systemLogo || '');
        this.setTheme(ttt);
      },
      err => {
        this.setTheme(ttt);
      },
    );
    // !!ttt && this.setTheme(ttt);
    this.ssoByAccount();
  }

  setTheme = (ttt = 2) => {
    const { dispatch } = this.props;
    let themeType = THEME_COLOR.find(item => item.id === Number(ttt)) || {};
    let theme = themeType.type || 'blue';
    dispatch({
      type: 'global/updateTheme',
      payload: {
        theme,
      },
    });
  };

  ssoByAccount = () => {
    // 上海电器单点登录
    getVariableValue({ variableName: 'useSsoPc' }).then(
      res => {
        console.log(res, '33333333333333');
        setCookie('useSsoPc', res, 2);
        const eam_info = getCookie('eaminfo');
        if (res === '1') {
          const url2 = window.location.href;
          const temp2 = url2.split('?')[1];
          const pram2 = new URLSearchParams('?' + temp2);
          const singleSignOnToken = pram2.get('uid');
          if (!singleSignOnToken) {
            message.error('没有找到uid登录信息！');
            this.setState({
              isSsoByAccount: true,
            });
            return;
          }
          this.setState({
            isSsoByAccount: true,
          });
          const params = {
            tag: 'PC',
            language: 'zh_CN',
            accessToken: singleSignOnToken,
          };
          axios({
            method: 'post',
            url: '/eam/ssoCommon/getUserInfoByToken',
            data: params,
            headers: {
              'content-type': 'application/json;charset=UTF-8',
              // 'Authorization': `Basic ${base64Encode('ITSYS:ITSYS2AUTH:Gt54rfvb')}`,
            },
          })
            .then(res => {
              const data = res.data;
              if (data.success) {
                const response = data.data;
                setCookie('token', response.token, 2);
                setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(response))), 2);
                this.setState({
                  isSsoByAccount: false,
                });
              } else {
                message.error(data.message || '请求失败');
                this.setState({
                  isSsoByAccount: true,
                });
                return;
              }
            })
            .catch(err => {
              message.error(res.message || '请求失败');
              this.setState({
                isSsoByAccount: true,
              });
              return;
            });
        } else if (res === '3') {
          const pathname = this.props.location.pathname;
          const LtpaToken = getCookie('LtpaToken');
          if (pathname === '/' && LtpaToken) {
            this.setState({
              isSsoByAccount: true,
            });
            const params = {
              itToken: LtpaToken,
              // "userCode": "",
              // "password": "",
              hasCompanyInfo: true, // 是否需要包含组织结构信息
              hasAuthInfo: true, // 是否需要包含权限数据
            };
            axios({
              method: 'post',
              url: '/eam/itSso/getAccount',
              data: params,
              headers: {
                'content-type': 'application/json;charset=UTF-8',
                // 'Authorization': `Basic ${base64Encode('ITSYS:ITSYS2AUTH:Gt54rfvb')}`,
              },
            }).then(
              data => {
                const res = data.data;
                if (res && res.account && res.account.code) {
                  let newParams = {
                    account: secret.encrypt(res.account.code),
                    tag: 'PC',
                    language: '',
                  };
                  ssoByAccount(newParams).then(
                    res => {
                      const _this = this;
                      setTimeout(() => {
                        _this.setState({
                          isSsoByAccount: false,
                        });
                      }, 100);
                      setCookie('token', res.token, 2);
                      setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(res))), 2);
                      localStorage.setItem('sss', res.systemLogo || ''); // 系统logourl
                      localStorage.setItem('ttt', res.themeColor); // 系统色
                      localStorage.setItem('ccc', true); // 设置次数，用于提示授权到期提醒
                    },
                    err => {
                      this.layout();
                      message.error(err || '请求失败');
                      // this.setState({
                      //   isSsoByAccount: false,
                      // });
                    },
                  );
                } else {
                  message.error(res.message || '请求失败');
                }
              },
              err => {
                this.layout();
                //   // this.setState({
                //   //   isSsoByAccount: false,
                //   // });
              },
            );
          } else if (!LtpaToken) {
            message.error('获取不到LtpaToken');
            this.setState({
              isSsoByAccount: false,
            });
          } else {
            this.setState({
              isSsoByAccount: false,
            });
          }
        } else if (+res === 4) {
          localStorage.setItem('DingDingCode', '');
          getDingDingCode().then(code => {
            const token = getCookie('token');
            if (token) {
              this.setState({
                isSsoByAccount: false,
              });
              return;
            }
            if (!code) {
              message.error('没有找到code登录信息！');
              this.setState({
                isSsoByAccount: true,
              });
              return;
            }
            localStorage.setItem('DingDingCode', code);
            try {
              zwdingtalkLogin({ code }).then(res => {
                setCookie('token', res.token, 2);
                setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(res))), 2);
                this.setState({
                  isSsoByAccount: false,
                });
                const { origin, pathname } = window.location;
                window.location.href = `${origin}${pathname}`;
              });
            } catch (error) {
              message.error(error.message || '请求失败');
              this.setState({
                isSsoByAccount: true,
              });
            }
          });
          // 浙政钉单点登录
          this.setState({
            isSsoByAccount: true,
          });
        } else if (res === '5') {
          // 华润化学单点登录
          const url = window.location.href;
          let obj = {};
          if (url.indexOf('?') !== -1) {
            const arr = url.split('?')[1].split('&');
            arr.forEach(ele => {
              const item = ele.split('=');
              obj[item[0]] = item[1];
            });
          }
          if (obj.code) {
            let code = obj.code;
            if (obj.code.indexOf('#') !== -1) {
              code = obj.code.split('#')[0];
            }
            this.setState({
              isSsoByAccount: true,
            });
            axios({
              method: 'post',
              url: `/eam/idaas/loginIDaas?code=${code}`,
            }).then(
              data => {
                const res = data.data;
                if (res.success) {
                  setTimeout(() => {
                    this.setState({
                      isSsoByAccount: false,
                    });
                  }, 100);
                  setCookie('token', res.data.token, 2);
                  setCookie('eaminfo', encodeURIComponent(escape(JSON.stringify(res.data))), 2);
                  localStorage.setItem('sss', res.data.systemLogo || ''); // 系统logourl
                  localStorage.setItem('ttt', res.data.themeColor); // 系统色
                  // localStorage.setItem('ccc', true); // 设置次数，用于提示授权到期提醒
                } else {
                  message.error(res.message || '请求失败');
                }
              },
              err => {
                this.layout();
              },
            );
          } else {
            this.layout();
            this.setState({
              isSsoByAccount: false,
            });
          }
        } else {
          this.setState({
            isSsoByAccount: false,
          });
        }
      },
      err => {
        this.setState({
          isSsoByAccount: false,
        });
      },
    );
  };

  layout = () => {
    getVariableValue({ variableName: 'LoginOUTURL' }).then(res => {
      if (res) {
        const useSsoPc = getCookie('useSsoPc');
        if (useSsoPc === '5') {
          // const url = window.location.href;
          // const http = url.split('?')[0];
          // 逗号前为退出域名，后为跳转地址
          const arr = res.split(',');
          window.location.href = `${arr[0]}/oauth/authorize?response_type=code&client_id=EAM_9&redirect_uri=${arr[1]}`;
          // window.location.href = `${res}/oauth/authorize?response_type=code&client_id=EAM_9&redirect_uri=${http}`;
        } else {
          window.location.href = res;
        }
      } else {
        // window.location.href = `${URL_PREFIX}/login`;
        router.push(`${URL_PREFIX}/login`);
      }
    });
  };

  render() {
    const { theme, dispatch, langLib, showSidebar, mainPageConfig } = this.props;
    console.log(themes, theme);
    const { isSsoByAccount } = this.state;
    const { basicData = {} } = mainPageConfig;
    const { menuStyle } = basicData;
    const activeTheme = themes[theme];
    console.log(activeTheme);
    const wrapCls = `theme-${theme}`;
    let systemStyle = Number(localStorage.getItem('systemStyle') || 1);
    console.log(systemStyle);
    const wrapLayoutCls = classNames({
      [activeTheme[wrapCls]]: true,
      [themes['systemDarkBlue']['system-darkBlue']]: systemStyle === 2,
      [styles.wrap]: true,
    });
    const contentWrapCls = classNames({
      [styles.contentWrap]: true,
      mainLayout: true,
      [styles.menuCenterContentWrap]: menuStyle === 3,
      system__menuColor: true,
    });
    const contentCls = classNames({
      [styles.showSidebar]: showSidebar,
    });
    if (isSsoByAccount) return null;
    return (
      <BaseContext.Provider value={{ langLib, theme, dispatch }}>
        <Locale>
          <Layout className={wrapLayoutCls} id="main-container">
            <BasicHeader showSidebar={showSidebar} />
            <Layout className={contentWrapCls}>
              <Sidebar />
              <Content className={contentCls}>
                <ConTainer />
              </Content>
            </Layout>
          </Layout>
        </Locale>
      </BaseContext.Provider>
    );
  }
}

export default MainLayout;
