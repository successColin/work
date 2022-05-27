// 授权界面样式
const baseUniverifyStyle = {
  fullScreen: false, // 是否全屏显示，默认值： false
  phoneNum: {
    color: '#333333', // 手机号文字颜色 默认值：#202020
  },
  slogan: {
    color: '#808080', //  slogan 字体颜色 默认值：#BBBBBB
  },
  authButton: {
    normalColor: '#3479f5', // 授权按钮正常状态背景颜色 默认值：#3479f5
    highlightColor: '#2861c5', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
    disabledColor: '#73aaf5', // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
    textColor: '#ffffff', // 授权按钮文字颜色 默认值：#ffffff
    title: '本机号码一键登录', // 授权按钮文案 默认值：“本机号码一键登录”
    borderRadius: '48px', // 授权按钮圆角 默认值："24px" （按钮高度的一半）
  },
  otherLoginButton: {
    visible: false, // 是否显示其他登录按钮，默认值：true
  },
  privacyTerms: {
    defaultCheckBoxState: true, // 条款勾选框初始状态 默认值： true
    uncheckedImage: '', // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
    checkedImage: '', // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
    textColor: '#AAAAAA', // 文字颜色 默认值：#BBBBBB
    termsColor: '#333333', //  协议文字颜色 默认值： #5496E3
    prefix: '我已阅读并同意', // 条款前的文案 默认值：“我已阅读并同意”
    suffix: '并使用本机号码登录', // 条款后的文案 默认值：“并使用本机号码登录”
    privacyItems: [
      // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
      {
        url: 'https://', // 点击跳转的协议详情页面
        title: '用户服务协议', // 协议名称
      },
    ],
  },
};

// 一键登录
export default function univerifyLogin(univerifystyle = {}) {
  const univerifyStyle = { ...baseUniverifyStyle, ...univerifystyle };
  // 获取app权限
  return new Promise((resolve, reject) => {
    uni.getProvider({
      service: 'oauth',
      success: (res) => {
        console.log(res);
        // 权限中有一键登录
        if (res.provider.indexOf('univerify') !== -1) {
          uni.login({
            provider: 'univerify',
            univerifyStyle,
            success: (univerifyInfo) => {
              console.log(univerifyInfo);
              // eslint-disable-next-line no-undef
              uniCloud.callFunction({
                name: 'loginByUniverify',
                data: univerifyInfo.authResult,
                success: (e) => {
                  const { result } = e;
                  if (result.success) resolve(result.phoneNumber);
                  else reject(result);
                },
              });
            },
            fail: (err) => {
              console.log('guanb');
              // 关闭登录
              if (err.code === 30003) {
                uni.closeAuthView();
              } else {
                reject(err.errMsg);
              }
            },
          });
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
