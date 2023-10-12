/**
 * @description:持续定位，只支持app（ios和安卓）；安卓如果退出进程者无法定位,支持高德地图
 */

class Location {
  constructor() {
    this.reportLocation = null; // 汇报位置
    this.watchLocation = null; // 监视位置变化
    this.locationPool = []; // 位置池
    this.oldLocation = null;
    this.currentInfo = {};
    // 当前的位置
    this.currentLocation = {
      latitude: null, // 纬度
      longitude: null, // 经度
      speed: null, // 速度
    };
    this.apiConfig = {
      intervalTime: 30, // 间隔时间
    }; // 基础配置信息

    // 微信小程序如果需要定位，需要开启权限
    // #ifdef MP-WEIXIN
    wx.getSetting({
      success(res) {
        console.log(res.authSetting);
        const setting = res.authSetting;
        if (!setting['scope.userLocation']) {
          wx.authorize({ scope: 'scope.userLocation' });
        }

        // 后台定位
        if (!setting['scope.userLocationBackground']) {
          wx.authorize({ scope: 'scope.userLocationBackground' });
        }
      },
    });
    // #endif
  }

  /**
   * 返回秒的时间戳 number
   */
  static getTimeInt() {
    const date = new Date();
    let timeInt = date.getTime();
    timeInt = (timeInt - (timeInt % 1000)) / 1000;
    return timeInt;
  }

  /**
   * 开启定位
   * @param {Object} options
   *        {Boolean} isRealTime 是否实时定位
   *        {Number} intervalTime 间隔 以秒为单位，默认30s
   *        {Function} handleFunc 回调，在间隔时间进行回调，输出参数：当前位置、位置变化
   *
   */
  openLocation(options = {}) {
    console.log('openLocation===============================');
    // #ifdef MP-WEIXIN
    wx.startLocationUpdate(); // 开启前台定位
    wx.startLocationUpdateBackground(); // 开启后台定位
    // #endif
    const { isRealTime = false, intervalTime = 30, handleFunc } = options;

    this.apiConfig.intervalTime = intervalTime;
    this.apiConfig.handleFunc = handleFunc;

    this.getCurrentLocation();

    // 如果需要实时定位，需要监测位置变化，安卓如果进入后台将监听不到信息
    if (isRealTime) {
      this.reportLocationHandle();
      // #ifdef APP-PLUS
      this.setWatchPositionApp();
      // #endif
      // #ifdef MP-WEIXIN
      this.setWatchPositionWX();
      // #endif
      // #ifdef MP-ALIPAY
      this.setWatchPositionDing();
      // #endif
      console.info(isRealTime);
    }

    return this;
  }

  // 关闭定位
  closeLocation() {
    if (this.reportLocation) {
      window.clearInterval(this.reportLocation);
      this.reportLocation = null;
    }
    if (this.watchLocation) {
      // #ifdef APP-PLUS
      plus.geolocation.clearWatch(this.watchLocation);
      // #endif
      // #ifdef MP-WEIXIN
      wx.stopLocationUpdate();
      // #endif
      this.watchLocation = null;
    }
    this.locationPool = [];
  }

  // 获取当前位置
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      console.log('getCurrentLocation========================================');
      uni.getLocation({
        type: 'gcj02',
        success: (position) => {
          console.log(
            'getCurrentLocation========================================wewrett'
          );
          this.locationPool.push(position);
          this.currentLocation = { ...position };
          this.locationHandle();
          console.log(this.currentInfo);
          resolve(this.currentInfo);
        },
        fail(error) {
          console.log(
            'getCurrentLocation========================================wewrett1'
          );
          console.log(error);
          reject(error);
        },
      });
    });
  }

  // 设置位置监听，只支持app
  setWatchPositionApp() {
    if (this.watchLocation) {
      plus.geolocation.clearWatch(this.watchLocation);
      this.reportLocation = null;
    }

    // 监听配置信息
    const locationParams = {
      enableHighAccuracy: true, // 高精度
      maximumAge: this.apiConfig.intervalTime, // 每次间隔时间
    };

    let phpTimeInt = this.getTimeInt();

    this.watchLocation = plus.geolocation.watchPosition(
      (position) => {
        console.log(position);
        const { coords, timestamp } = position;
        const difference = timestamp / 1000 - phpTimeInt;
        if (
          coords.latitude > 0.00000001 &&
          coords.longitude > 0.00000001 &&
          difference > 1
        ) {
          phpTimeInt = position.timestamp / 1000;
          this.locationPool.push(position);
          this.currentLocation = { ...coords };
        }
      },
      () => {},
      locationParams
    );
  }

  // 设置位置监听，只支持微信小程序
  setWatchPositionWX() {
    if (this.watchLocation) {
      wx.stopLocationUpdate();
      this.reportLocation = null;
    }

    this.watchLocation = true;
    wx.onLocationChange((position) => {
      console.log(position);
      if (position.latitude > 0.00000001 && position.longitude > 0.00000001) {
        this.locationPool.push(position);
      }
    });
  }

  // 设置监听，只支持钉钉小程序
  setWatchPositionDing() {
    this.watchLocation = window.setInterval(() => {
      this.getCurrentLocation();
    }, this.apiConfig.intervalTime * 1000);
  }

  // 定时返回内容
  reportLocationHandle() {
    if (this.reportLocation) window.clearInterval(this.reportLocation);

    this.reportLocation = window.setInterval(() => {
      // 如果有监视器并且位置池不为空，者默认取位置池中的数据
      if (this.watchLocation && this.locationPool.length > 0) {
        this.locationHandle();
      } else this.getCurrentLocation();
    }, this.apiConfig.intervalTime * 1000);
  }

  // 定位信息处理
  locationHandle() {
    // 需要判断是需要实时的定位信息还是一段时间内位置的变化
    const { currentLocation, oldLocation, locationPool, apiConfig } = this;

    // 如果当前地址和之前的地址一致，就进行发送地址
    if (JSON.stringify(oldLocation) === JSON.stringify(currentLocation)) {
      return false;
    }

    const h = {}; // 定义一个hash表1
    const arr = []; // 定义一个临时数组

    for (let i = 0; i < locationPool.length; i += 1) {
      // 循环遍历当前数组
      // 对元素进行判断，看是否已经存在表中，如果存在则跳过，否则存入临时数组
      if (!h[JSON.stringify(locationPool[i])]) {
        // 存入hash表
        h[JSON.stringify(locationPool[i])] = true;
        // 把当前数组元素存入到临时数组中
        arr.push(locationPool[i]);
      }
    }

    this.oldLocation = { ...currentLocation };

    const position = { currentLocation, locations: arr };
    if (apiConfig.handleFunc) apiConfig.handleFunc(position);

    this.currentInfo = { ...position };
    return position;
  }
}

export default new Location();
