/*
 * @Author: Fus
 * @Date:   2019-04-24 14:16:13
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-22 12:48:56
 * @Desc: 头部模块
 *      包含：logo、帮助文档、个人中心等
 */
import avatar from '@/assets/avatar.png';
import logo from '@/assets/logo.png';
import { BaseContext, DB_LANG_TYPE_TO_FRONT } from '@/constants/global';
import secret from '@/constants/secret';
import Message from '@/layouts/BasicHeader/Message/Message';
import { getVariableValue } from '@/services/globalcenter';
import { getCookie, matchGlobalVars } from '@/utils/common';
import { Input, Layout, notification, Popover, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './BasicHeader.less';
import HeaderBg from './HeaderBg/HeaderBg';
import HelpDocs from './HelpDocs/HelpDocs';
import LanguageSelect from './Language/LanguageSelect.js';
import QBList from './Qrcode/Qrcode';
import UserCenter from './UserCenter/UserCenter';
import VersionInfo from './VersionInfo/VersionInfo';
import sublogo from '../../assets/sub_logo.png';

// import VideoModal from './VideoModal/VideoModal';

const { Header } = Layout;
const { Search } = Input;
const { Option } = Select;

// 头部搜索分类
// const searchOptions = Object.keys(HEADER_SEARCH_TYPE).map(item => <Option value={item} key={item}>{<FormattedMessage
//   id={HEADER_SEARCH_TYPE[item]}
// />}</Option>);

@connect(state => ({
  showMenuCenter: state.global.showMenuCenter,
  showSidebar: state.global.showSidebar,
  userInfo: state.user.userInfo,
  avatarInfo: state.user.avatarInfo,
  mainPageConfig: state.global.mainPageConfig,
}))
class BasicHeader extends React.Component {
  static contextType = BaseContext;
  state = {
    visibleBrief: false, // 个人中心简要
    visibleHelpDoc: false, // 帮助文档
    visibleVisionInfo: false, // 版本信息
    isFullScreen: false, // 全屏
    visibleTell: false, // 呼叫弹框
  };

  componentDidMount() {
    const eam_info = getCookie('eaminfo');
    const userInfo = eam_info ? JSON.parse(decodeURIComponent(unescape(eam_info))) : {};
    const { currentLanguage, token, passwordValidity } = userInfo;
    const { dispatch } = this.context;
    localStorage.setItem('token', token);
    let ccc = localStorage.getItem('ccc') === 'true' ? true : false;
    // 中英文
    dispatch({
      type: 'global/updateLang',
      payload: {
        lang: DB_LANG_TYPE_TO_FRONT[currentLanguage] || 'zh',
      },
    });
    dispatch({
      type: 'user/updateState',
      payload: {
        userInfo,
        avatarInfo: userInfo.picpath || avatar,
      },
    });
    // 获取个人头像
    // dispatch({
    //   type: 'user/getUserAvatar',
    //   payload: {
    //     userId: userInfo.id,
    //   },
    // });
    // 获取个人资质文件
    dispatch({
      type: 'user/getPersonalPua',
      payload: {
        userId: userInfo.id,
      },
    });
    let that = this;
    document.addEventListener('fullscreenchange', function(e) {
      if (document.fullscreenElement) {
        console.log('进入全屏');
        that.setState({ isFullScreen: true });
      } else {
        console.log('退出全屏');
        that.setState({ isFullScreen: false });
      }
    });
    if (userInfo.remindGoingExpire && ccc) this.dueReminder(userInfo);
    dispatch({ type: 'global/getReportDomain' }); // 报表域名
    dispatch({ type: 'global/getMainPageBasicConfig' }); // 主页配置基本信息
    dispatch({ type: 'global/getMainPageThirdLink' }); // 三方链接
    dispatch({ type: 'global/getMainPageHelpDoc' }); // 帮助文档
    dispatch({ type: 'global/getSystemVersion' }); // 版本信息
    dispatch({ type: 'global/getQBlists' }); // app二维码
    dispatch({ type: 'global/getSystemPagesize' }); // 列表条数
    getVariableValue({ variableName: 'passwordValidity' }).then(res => {
      if (res === '0' || !res) return;
      const lastDay = moment(passwordValidity).format('YYYY-MM-DD');
      const currentDay = moment(new Date()).format('YYYY-MM-DD');
      const diff = moment(currentDay).diff(moment(lastDay), 'days');
      const diffType = Number(res);
      if (diffType - diff <= 7) {
        const { langLib } = this.context;
        const passDate = moment(passwordValidity)
          .add(Number(res), 'days')
          .format('YYYY-MM-DD');
        const a = localStorage.getItem('passwordUnUser');
        a &&
          notification.warning({
            message: langLib['global.tip'],
            description: langLib['global.passwordMaturity'](passDate),
            placement: 'topRight',
          });
        setTimeout(() => {
          localStorage.removeItem('passwordUnUser');
        }, 100);
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', function(e) {});
  }

  // 判断是否现在授权到期提示
  dueReminder = userInfo => {
    const { langLib } = this.context;
    const { licenseExpireDate } = userInfo;
    let passDate = moment(licenseExpireDate).format('YYYY-MM-DD');
    notification.warning({
      message: langLib['global.tip'],
      description: langLib['global.maturity'](passDate),
      placement: 'topRight',
    });
    localStorage.setItem('ccc', false);
  };

  // 全屏
  handleFullScreen = () => {
    var element = document.documentElement;
    let isFullscreen =
      document.fullscreenEnabled ||
      window.fullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenEnabled;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
    this.setState({ isFullScreen: true });
  };

  // 退出全屏
  handleExitFullscreen = () => {
    let isFullscreen =
      document.fullscreenEnabled ||
      window.fullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenEnabled;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    this.setState({ isFullScreen: false });
  };
  // 切换主题
  changeTheme = () => {
    this.context.dispatch({
      type: 'global/updateTheme',
      payload: {
        theme: 'red',
      },
    });
  };
  // 切换语言
  changeLang = () => {
    this.context.dispatch({
      type: 'global/updateLang',
      payload: {
        lang: 'en',
      },
    });
  };
  // 切换sidebar
  onTriggerSidebar = () => {
    this.context.dispatch({
      type: 'global/updateShowSidebar',
      payload: {
        showSidebar: !this.props.showSidebar,
      },
    });
  };
  // 渲染第三方链接
  setThirdLink = () => {
    const { visibleVisionInfo } = this.state;
    const { thirdLink = [], basicData } = this.props.mainPageConfig;
    const links = thirdLink.map(item => {
      const { name, url, id } = item;
      const newUrl = url.replace(/\{.*?\}/g, (text) => {
        const result = this.getValueFromFilter(text);
        return result;
      });
      return (
        <span className={styles.entry} key={`thirdLink-${id}`}>
          <a href={newUrl} target="_blank">
            {name}
          </a>
        </span>
      );
    });
    return links;
  };
  // 筛选默认值
  getValueFromFilter = (varName) => {
    let token = getCookie('token');
    const { userInfo } = this.props;
    switch (varName) {
      // 当前时间
      case '{@@CurrentDateTime}':
        return moment(new Date());
      // 当前用户
      case '{@@CurrentUserID}':
        return userInfo.id;
      // 当前登录token
      case '{@@CurrentToken}':
        return token;
      // todo 当前用户组织
      case '{@@orgList}':
        return userInfo.orgList;
      // 当前用户公司id
      case '@@CurrentCompanyID':
        return userInfo.companyId;
      default:
        return '';
    }
  };
  updateWrapState = itemObj => {
    this.setState(itemObj);
  }

  render() {
    const {
      showMenuCenter,
      showSidebar,
      avatarInfo,
      mainPageConfig,
      userInfo,
      videoVisible,
    } = this.props;
    const {
      visibleBrief,
      visibleHelpDoc,
      isFullScreen,
      visibleVisionInfo,
      visibleTell,
    } = this.state;
    let systemUrl = localStorage.getItem('sss') || '';
    let headerStyle = Number(localStorage.getItem('topt') || '');
    let logoHeight = Number(localStorage.getItem('hhh') || '');
    const { basicData } = mainPageConfig;
    const { langLib } = this.context;
    const wrapCls = classNames({
      'custom-header-bg': !(headerStyle === 1),
      [styles.wrap]: true,
      [styles.showMenuCenter]: showMenuCenter,
      'darker-header-bg': headerStyle === 1 || headerStyle === 3,
      'technology-header-bg': headerStyle === 3,
    });
    const triggerCls = classNames({
      iconfont: true,
      'icon-menu-fold': true,
      'icon-menu-unfold': !!!showSidebar,
      [styles.trigger]: true,
    });
    const fullScreenIcon = isFullScreen ? (
      <Tooltip title={<FormattedMessage id="header.exitFullScreen" />}>
        <span className="iconfont icon-exitFullScreen-bold" onClick={this.handleExitFullscreen} />
      </Tooltip>
    ) : (
      <Tooltip title={<FormattedMessage id="header.fullScreen" />}>
        <span className="iconfont icon-fullScreen-bold" onClick={this.handleFullScreen} />
      </Tooltip>
    );
    const info = {
      companyKey: userInfo.companyKey,
      account: userInfo.account,
    };
    let token = getCookie('token');
    // const feedbackUrl = 'http://www.apiot.cloud/#/?userInfo=' + secret.encrypt(JSON.stringify(info))
    const feedbackUrl =
      'http://121.196.97.165/feedbackCenter/#/?userInfo=' + secret.encrypt(JSON.stringify(info));
    const cmsUrl = '/cms/?token=' + secret.encrypt(token);
    return (
      <Header className={wrapCls}>
        <HeaderBg />
        <div className={`${styles.contentWrap}`}>
          {/* <div className={`${styles.triggerWrap} ${styles.item}`}>
            <span
              className={triggerCls}
              onClick={this.onTriggerSidebar}
            />
          </div> */}
          <a onClick={() => window.location.reload()}>
            <img
              src={systemUrl || basicData.systemLogo || logo}
              className={styles.logo}
              style={{ height: `${logoHeight || basicData.systemLogoHeight}px` }}
            />
            {/*<img src={sublogo} className={styles.logo}/>*/}
          </a>
          <div className={styles.entryWrap}>
            {!!basicData.enabledThirdPartyLinks && (
              <div className={styles.thirdLinkWrap}>{this.setThirdLink()}</div>
            )}
            {!!(basicData.feedback === 1) && (
              <div className={styles.thirdLinkWrap}>
                <span className={styles.entry}>
                  <a href={feedbackUrl} target="_blank">
                    <FormattedMessage id="header.feedback" />
                  </a>
                </span>
              </div>
            )}
            {/* cms */}
            {/* {!!(basicData.enabledCms === 1) && (
              <div className={styles.thirdLinkWrap}>
                <span className={styles.entry}>
                  <a href={cmsUrl} target="_blank">
                    <FormattedMessage id="header.cms" />
                  </a>
                </span>
              </div>
            )} */}
            {!!basicData.enabledSystemVersion && (
              <Popover
                content={<VersionInfo updateWrapState={this.updateWrapState} />}
                // trigger="click"
                placement="bottomRight"
                arrowPointAtCenter={true}
                visible={visibleVisionInfo}
                onVisibleChange={visibleVisionInfo => this.setState({ visibleVisionInfo })}
                getPopupContainer={() => document.getElementById('main-container')}
              >
                <div className={styles.versionWrap}>
                  <span className={styles.entry}>
                    <FormattedMessage id="header.versionInfo" />
                  </span>
                </div>
              </Popover>
            )}
            {/* <span className={styles.entry}>
              <FormattedMessage id="header.helpDoc" />
            </span> */}
            <span className={styles.line}>|</span>
            {!!basicData.openPcMail && <Message userInfo={userInfo} />}
            {!!basicData.enabledAppDownload && (
              <Popover placement="topRight" content={<QBList />}>
                <div className={styles.iconWrap}>
                  <span className="iconfont icon-download-app-bold" />
                </div>
              </Popover>
            )}
            {!!basicData.enabledHelpDocument && (
              <Popover
                content={<HelpDocs />}
                // trigger="click"
                placement="bottomRight"
                arrowPointAtCenter={true}
                visible={visibleHelpDoc}
                onVisibleChange={visibleHelpDoc => this.setState({ visibleHelpDoc })}
                getPopupContainer={() => document.getElementById('main-container')}
              >
                <div className={styles.iconWrap}>
                  <span className="iconfont icon-help-bold" />
                </div>
              </Popover>
            )}
            {!!basicData.enabledFullScreenButton && (
              <div className={`${styles.fullScreenWrap} ${styles.iconWrap}`}>{fullScreenIcon}</div>
            )}
            {!!basicData.enabledLanguageSwitchButton && (
              <div className={styles.iconWrap}>
                <span className={styles.lang}>
                  {/*<FormattedMessage id="locale.zh"/>*/}
                  <LanguageSelect />
                </span>
              </div>
            )}
            <Popover
              content={<UserCenter updateWrapState={this.updateWrapState} />}
              // trigger="click"
              placement="bottomRight"
              visible={visibleBrief}
              onVisibleChange={visibleBrief => this.setState({ visibleBrief })}
              getPopupContainer={() => document.getElementById('main-container')}
            >
              <span className={`${styles.avatar} userHeaderInfo`}>
                <img src={avatarInfo} alt="avatar" />
                <span className={styles.userName}>{userInfo.username}</span>
              </span>
            </Popover>
          </div>
        </div>
         {/*<VideoModal /> */}
      </Header>
    );
  }
}

export default BasicHeader;
