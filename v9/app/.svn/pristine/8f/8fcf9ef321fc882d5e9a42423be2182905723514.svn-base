// #ifdef H5
import * as dd from 'dingtalk-jsapi';
import ZheZhengdd from 'gdt-jsapi';
// #endif

// 钉钉设置 title
export function ChangePageTitle(title) {
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('dingtalk') > -1) {
    dd.biz.navigation.hideBar({
      hidden: true, // true：隐藏，false：显示
    });
  }
  // #endif
}

// 浙政钉获取 code
export async function getDingDingCode(callback) {
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase();
  let getCode = '';
  if (ua.indexOf('saas') > -1) {
    ZheZhengdd.hideTitleBar();
    await ZheZhengdd.getAuthCode({}).then((result) => {
      const code = result.code;
      if (code) {
        getCode = code;
      }
    });
  }
  return getCode;
  // #endif
}

// 浙政钉隐藏 title
export async function hidddleDingDingTitle(callback) {
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('saas') > -1) {
    ZheZhengdd.hideTitleBar();
  }
  // #endif
}

/**
 * 页面流量分析代码-埋点
 * @param {Object} sapp_id
 * @param {Object} sapp_name
 * @param {Object} 页面id
 * @param {Object} 页面名称
 * @param {Object} 页面地址
 * @param {Object} 用户id
 */
/**
 * 埋点统一代码 (除了个别参数，整体格式也是比较固定)
 * 以下代码不可拆分，否则可能导致埋点只有部分成功
 * meta 和 dingUser 是业务参数，每个人各不相同，根据你自己的项目来决定
 * */
export function set_MD(meta, dingUser) {
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('saas') > -1) {
    const { nickName, userId } = dingUser;
    const { pagePath, name } = meta;

    // 如采集用户信息是异步行为需要先执行这个BLOCK埋点
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['_hold', 'BLOCK'],
    });

    // 单页应用 或 “单个页面”需异步补充PV日志参数还需进行如下埋点：
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['aplus-waiting', 'MAN'],
    });
    // 单页应用路由切换后 或 在异步获取到pv日志所需的参数后再执行sendPV：
    aplus_queue.push({
      action: 'aplus.sendPV',
      arguments: [
        {
          is_auto: false,
        },
        {
          // 当前你的应用信息，此两行请勿修改
          sapp_id: 'sapp_id上架申请通过后官方人员会发',
          sapp_name: 'sapp_name上架申请通过后官方人员会发',
          page_id: 'https://sbgl.yiwuwater.com:7443/h5/#' + pagePath,
          page_name: name,
          page_url: pagePath,
        },
      ],
    });

    // 设置会员昵称
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['_user_nick', nickName],
    });
    // 设置会员ID
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['_user_id', userId],
    });

    // 如采集用户信息是异步行为，需要先设置完用户信息后再执行这个START埋点
    // 此时被block住的日志会携带上用户信息逐条发出
    aplus_queue.push({
      action: 'aplus.setMetaInfo',
      arguments: ['_hold', 'START'],
    });
  }
  // #endif
}
// 切记需要保证上面代码执行时page_id、page_name、page_url、nickName、userId五个参数不是空的
