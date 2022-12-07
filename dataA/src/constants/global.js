/**
 * @name: global
 * @author: DELL
 * @date: 2021/8/21 16:50
 * @description：global
 * @update: 2021/8/21 16:50
 */
const bulletCommonConfig = {
  url: '', // 超链接地址
  enableOpenNewWindow: false, // 是否打开新地址
  interactionMode: 1, // 交互方式 1、没有 2、弹框 3、跳转链接 4、下载
  bulletType: 1, // 1、默认弹框  2、自定义弹框位置 3、 随鼠标位置
  bulletWidth: 600, // 弹框宽度
  bulletHeight: 400, // 弹框高度
  bulletUrl: '' // 弹框地址
}

const markLineConfig = { // 标记及标线配置
  enableMarkMax: false, // 标记最大值
  enableMarkMin: false, // 标记最小值
  markBgColor: '#4689F5', // 标记背景颜色
  markerColor: '#fff', // 标记字体颜色
  symbolIcon: 'pin', // 标记图标
  symbolSize: 50, // 标记大小
  enableMean: false, // 是否启用均值线
  meanColor: '#4689F5', // 均值线颜色
  meanType: 'dashed', // 均值线类型
  enableMeanLabel: true, // 是否显示标签
  meanLabelColor: '#ffffff', // 均值线标签颜色
  meanLabelSize: 12, // 均值线标签字体大小
  meanLabelPosition: 'end' // 均值线标签位置
}

// 大屏属性配置
export const screenConfig = {
  title: '', // 大屏标题
  width: 1920, // 大屏默认宽度
  height: 1080, // 大屏默认高度
  bgImage: '', // 背景图片
  bgColor: '#131E45', // 背景颜色
  gridSize: 24, // 栅格大小
  enable: true, // 是否启用栅格，默认启用，值为true
  thumbnail: '', // 缩略图
  showType: 1 // 展示类型， 默认按高低比例展示，1， 屏幕宽高展示； 2、 按屏幕宽比例展示； 3、按屏幕高比例展示； 4、 按根据设计图真实比例展示
};

// app大屏属性配置
export const screenAppConfig = {
  title: '', // 大屏标题
  width: 360, // 大屏默认宽度
  height: 640, // 大屏默认高度
  bgImage: '', // 背景图片
  bgColor: '#131E45', // 背景颜色
  gridSize: 20, // 栅格大小
  enable: true, // 是否启用栅格，默认启用，值为true
  thumbnail: '', // 缩略图
  showType: 2 // 展示类型， 默认按高低比例展示，1， 屏幕宽高展示； 2、 按屏幕宽比例展示； 3、按屏幕高比例展示； 4、 按根据设计图真实比例展示
};

export const apiDataConfig = {
  apiUrl: '', // 接口地址
  // apiType: 1, // 1：直连，2：代理
  requestType: 1, // get,post
  requestParams: '{}', // 接口的请求参数
  enableApiFilter: false, // 接口获取过滤器
  enableApiAutoUpdate: false, // 接口是否需要自动更新
  apiUpdateTime: 1, // 接口自动更新1s
  apiResponse: '{}', // 接口返回值
  apiEffect: '', // 接口生效字段
  requestHeader: '{}', // 接口请求头部
  apiDataFilterId: null, // 数据过滤器id
  apiFilterResponse: '{}' // 数据库过滤后的数据
}

export const SqlDataConfig = {
  SQL: 'select * from table1', // sql
  enableSQLFilter: false, // sql 是否需要过滤器
  SQLDataFilterId: null, // 数据过滤器id
  enableSQLAutoUpdate: false, // sql是否需要自动更新
  SQLResponse: '{}', // sql返回值
  SQLFilterResponse: '{}', // 数据库过滤后的数据
  SQLFilterFun: null, // 过滤器函数
  SQLEffect: '', // SQL生效字段
  SQLUpdateTime: 1, // SQL自动更新1s
  enableDataManage: false, // 是否启用变量管理
  variableConfig: [] // 变量数组
}

export const tabStylesConfig = {
  cFontFamily: '微软雅黑', // 未激活状态字体
  cFontWeight: 'normal', // 未激活状态文字粗细
  cFontSize: 28, // 未激活状态文字大小
  cPaddingTopAndBottom: 10, // 未激活状态上下内边距
  cPaddingRightAndLeft: 10, // 未激活状态左右内边距
  cColor: '#fff', // 未激活状态左右内边距
  cHoverColor: '#4689F5', // 未激活状态左右内边距
  cBgUrl: '', // 背景图片
  cHoverBgUrl: '', // 悬浮时的背景图片
  cBgColor: '#fff', // 背景颜色
  cHoverBgColor: '#fff', // 悬浮时的背景颜色
  borderWidth: 1, // 边框大小
  borderColor: '#fff', // 边框颜色
  borderRadius: 0 // 边框倒角
}

// 取色器默认颜色
export const predefineColors = [
  '#4689F5',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]

export const attributeCollection = { // 组件属性集合
  PopCloseButton: { // 弹窗关闭按钮
    componentName: 'PopCloseButton',
    thumbnail: require('@/assets/config/closeBtn.svg'),
    name: '弹窗关闭按钮',
    width: 80,
    height: 80,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      fontSize: 16, // 大小
      color: '#ffffff', // 颜色
      content: 'X', // 内容
      bgColor: '', // 背景颜色
      borderWidth: 0, // 边框宽度
      borderColor: '', // 边框颜色
      backgroundImage: '', // 背景路径
      borderStyle: 'solid',
      borderRadius: 0 // 倒角
    }
  },
  Video: { // 视频
    componentName: 'Video',
    thumbnail: require('@/assets/config/video.svg'),
    name: '视频',
    width: 800,
    height: 400,
    minHeight: 50,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 2：接口获取；3：SQL获取
    stylesObj: {
      autoplay: false, // 是否自动播放
      loop: false, // 是否循环播放
      controls: true, // 是否显示进度条
      preload: 'auto', // 页面加载就开始加载视频
      // 'auto'
      // 立即开始加载视频（如果浏览器支持）。一些移动设备不会预加载视频以保护其用户的带宽/数据使用。这就是为什么该值被称为“自动”而不是像'true'.
      // 这往往是最常见和推荐的值，因为它允许浏览器选择最佳行为。
      // 'metadata'
      // 仅加载视频的元数据，其中包括视频的时长和尺寸等信息。有时，会通过下载几帧视频来加载元数据。
      // 'none'
      // 不要预加载任何数据。浏览器将等到用户点击“播放”开始下载。
      isDefaultPoster: 1, // 是否是默认海报，1 不是；2 是
      poster: '', // 视频海报
      url: '', // 视频地址
      urlName: '', // 视频名称
      playbackRates: true, // 视频速度控制器
      isfullScreen: true, // 视频全屏按钮
      zIndex: 1,
      supportParameters: 3 // 支持的参数， 1.路径参数，可以直接使用 2、变量参数，用于sql查询获取url 3、无
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  DataSwitching: { // 数据切换
    componentName: 'DataSwitching',
    thumbnail: require('@/assets/config/dataswitch.svg'),
    name: '数据切换',
    width: 120,
    height: 100,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    controlledChart: [], // 受控图标
    stylesObj: {
      zIndex: 1
    },
    beforeConfig: { // 初始化数据
      content: '初始化',
      ...tabStylesConfig,
      cHoverBgColor: 'rgba(144, 240, 144, 1)', // 悬浮时的背景颜色
      cBgColor: 'rgba(144, 240, 144, 0.5)' // 背景颜色
    },
    afterConfig: { // 切换后数据
      content: '切换后',
      ...tabStylesConfig,
      cBgColor: 'rgba(144, 240, 144, 0.7)', // 背景颜色
      cHoverBgColor: 'rgba(144, 240, 144, 1)' // 悬浮时的背景颜色
    },
    beforeParamsConfig: [], // 初始化时的参数传递
    afterParamsConfig: [] // 切换后的参数传统
  },
  FullScreenBtn: { // 全屏按钮
    componentName: 'FullScreenBtn',
    thumbnail: require('@/assets/config/fullscreen.svg'),
    name: '全屏按钮',
    width: 40,
    height: 40,
    minHeight: 100,
    minWidth: 100,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      fontSize: 16,
      color: '#ffffff'
    }
  },
  CanvasDrawing: {
    componentName: 'CanvasDrawing',
    thumbnail: require('@/assets/config/canvas.svg'),
    name: 'Canvas 绘图',
    width: 800,
    height: 800,
    minHeight: 100,
    minWidth: 100,
    left: 0,
    top: 0,
    content: 'Canvas 绘图',
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    isFixed: false, // 是否固定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableAutoUpdate: false, // 是否自动更新
    stylesObj: {
      zIndex: 1,
      backgroundImage: '', // 画布背景
      drawType: null, // 热区类型
      drawUrl: '', // 热区图片路径
      type: 1,
      updateTime: 15
    },
    designObject: '' // canvas配置
  },
  SingleLineText: {
    componentName: 'SingleLineText',
    thumbnail: require('@/assets/config/text.svg'),
    name: '文本',
    width: 300,
    height: 50,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    content: '单行文本组件',
    gradientType: 1, // 渐变色类型
    enableBackground: false,
    enableEllipsis: true,
    ...bulletCommonConfig,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      fontFamily: 'Arial,苹方,微软雅黑',
      textAlign: 'center',
      fontSize: 30,
      color1: '#ffffff',
      color2: '#ffffff',
      fontWeight: 'normal',
      hShadow: 0,
      vShadow: 0,
      blur: 0,
      shadowColor: '',
      zIndex: 1,
      letterSpacing: 0,
      backgroundColor: null,
      borderRadius: 0,
      borderColor: '#4689F5',
      borderWidth: 1,
      borderStyle: 'solid'
    },
    dataConfig: {
      staticValue: '{"text":"文本组件","value":"文本组件2"}', // 静态值
      takeEffect: 'text' // 生效字段
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  Marquee: {
    componentName: 'Marquee',
    thumbnail: require('@/assets/config/marquee.svg'),
    name: '跑马灯',
    width: 300,
    height: 50,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    gradientType: 1, // 渐变色类型
    enableBackground: false,
    field: '', // 回调字段
    param: '', // 回调变量
    url: '', // 超链接地址
    enableOpenNewWindow: false, // 是否打开新地址
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      fontFamily: 'Arial,苹方,微软雅黑',
      textAlign: 'center',
      fontSize: 30,
      speed: 0.5,
      color1: '#ffffff',
      color2: '#ffffff',
      fontWeight: 'normal',
      hShadow: 0,
      vShadow: 0,
      blur: 0,
      shadowColor: '',
      zIndex: 1,
      letterSpacing: 0,
      backgroundColor: null,
      borderRadius: 0,
      borderColor: '#4689F5',
      borderWidth: 1,
      borderStyle: 'solid'
    },
    dataConfig: {
      staticValue: '[{"text":"文本一"},{"text":"文本二"},{"text":"文本三"}]', // 静态值
      takeEffect: 'text' // 生效字段
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  RealTime: {
    componentName: 'RealTime',
    thumbnail: require('@/assets/config/reallyTime.svg'),
    name: '实时时间',
    width: 300,
    height: 50,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    gradientType: 1, // 渐变色类型
    enableBackground: false,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      FontFamily: 'Arial,苹方,微软雅黑',
      FontSize: 16,
      Color: '#ffffff',
      FontWeight: 'normal',
      zIndex: 1,
      showType: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  BackgroundBox: {
    componentName: 'BackgroundBox',
    thumbnail: require('@/assets/config/bg.svg'),
    name: '背景框',
    width: 300,
    height: 300,
    minHeight: 300,
    minWidth: 300,
    left: 0,
    top: 0,
    bgType: 'bgColor', // 背景类型
    gradientType: 1, // 渐变色类型
    horizontalMirror: false, // 水平镜像
    verticalMirror: false, // 垂直镜像
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    stylesObj: {
      backgroundImage: '',
      borderRadius: 0,
      color1: '',
      color2: '',
      opacity: 1,
      zIndex: 1,
      borderColor: '#4689F5',
      borderWidth: 1,
      borderStyle: 'solid',
      rotationAngle: 0
    }
  },
  ImageBox: {
    componentName: 'ImageBox',
    thumbnail: require('@/assets/config/image.svg'),
    name: '图片',
    width: 300,
    height: 300,
    minHeight: 50,
    minWidth: 50,
    left: 0,
    top: 0,
    horizontalMirror: false, // 水平镜像
    verticalMirror: false, // 垂直镜像
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 2：接口获取；3：SQL获取
    stylesObj: {
      backgroundImage: '',
      opacity: 1,
      rotationAngle: 0,
      zIndex: 1,
      supportParameters: 3 // 支持的参数， 1.路径参数，可以直接使用 2、变量参数，用于sql查询获取url 3、无
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  AuxiliaryLine: {
    componentName: 'AuxiliaryLine',
    thumbnail: require('@/assets/config/line.svg'),
    name: '线条',
    width: 300,
    height: 100,
    minHeight: 50,
    minWidth: 50,
    left: 0,
    top: 0,
    horizontalMirror: false, // 水平镜像
    verticalMirror: false, // 垂直镜像
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    stylesObj: {
      lineStyleType: 'solid',
      opacity: 100,
      rotationAngle: 0,
      height: 1,
      color: '#43DBFF',
      color1: '#43DBFF',
      zIndex: 1
    }
  },
  GeneralTable: {
    componentName: 'GeneralTable',
    thumbnail: require('@/assets/config/list.svg'),
    name: '基础列表',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLinesHighlighted: true, // 启用高亮
    enableHeader: true, // 是否启用表头
    enableSno: true, // 是否启用序号
    stylesObj: {
      zIndex: 1,
      rows: 10, // 列表行数
      loop: true, // 是否轮播
      animationTypes: 2, // 动画类型
      loopTime: 5, // 轮播间隔时间
      autoHighlight: true, // 依次高亮
      speHighlight: '3,4', // 指定第几行数高亮
      highlightFontFamily: '微软雅黑', // 图例字体
      highlightFontWeight: 'normal', // 图例文字粗细
      highlightFontSize: 12, // 图例文字大小
      highlightColor: '#FFF', // 图例字体颜色
      highlightBgColor: 'rgb(178, 232, 51)', // 高亮背景色
      snoFontFamily: '微软雅黑', // 序号字体
      snoFontWeight: 'normal', // 序号文字粗细
      snoFontSize: 12, // 序号文字大小
      snoColor: '#FFF', // 序号字体颜色
      theadHeight: 20, // 表头高度
      theadBgColor: '#4689F5', // 表头背景色
      theadFontFamily: '微软雅黑', // 表头字体
      theadFontWeight: 'normal', // 表头文字粗细
      theadFontSize: 16, // 表头文字大小
      theadColor: '#FFF', // 表头字体颜色
      theadTextAlign: 'center', // 表头字体对齐方式
      oddBgColor: '#2F437F', // 奇数行背景色
      evenBgColor: '#192757' // 偶数行背景色
    },
    columnConfig: [
      {
        index: 0,
        title: '列1',
        field: 'name',
        fieldWidth: 20,
        fieldName: '名称',
        fieldFontFamily: '微软雅黑',
        fieldFontWeight: 'normal',
        fieldFontSize: 16,
        fieldColor: '#fff',
        fieldTextAlign: 'center',
        fieldPrefix: '', // 文字前缀
        fieldPrefixWidth: 20, // 文字前缀宽度
        fieldPrefixHeight: 20, // 文字前缀高度
        isEllipsis: true, // 默认开启省略
        enableConditions: false, // 是否启用字段条件
        fieldRelColor: '#fff', // 配置了启用条件及条件满足，则该字段生效
        isApplyPicture: false, // 是否应用与图片
        conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
        ...bulletCommonConfig, // 弹框或者url跳转配置
        callbackFields: '' // 回调字段集合
      },
      {
        index: 1,
        title: '列2',
        field: 'area',
        fieldWidth: 20,
        fieldName: '省份',
        fieldFontFamily: '微软雅黑',
        fieldFontWeight: 'normal',
        fieldFontSize: 16,
        fieldColor: '#fff',
        fieldTextAlign: 'center',
        fieldPrefix: '',
        isEllipsis: true, // 默认开启省略
        isApplyPicture: false, // 是否应用与图片
        enableConditions: false, // 是否启用字段条件
        fieldRelColor: '#fff', // 配置了启用条件及条件满足，则该字段生效
        conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
        ...bulletCommonConfig, // 弹框或者url跳转配置
        callbackFields: '' // 回调字段集合
      }
    ],// 自定义列表配置
    dataConfig: {
      staticValue: '[{"name":"1","area":"上海市"},{"name":"2","area":"杭州市"},{"name":"3","area":"上海市"},{"name":"4","area":"杭州市"},{"name":"5","area":"上海市"},{"name":"6","area":"杭州市"},{"name":"7","area":"上海市"},{"name":"8","area":"杭州市"},{"name":"9","area":"上海市"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  RadarChart: {
    componentName: 'RadarChart',
    thumbnail: require('@/assets/config/radarChart.svg'),
    name: '雷达图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    enableDimension: true, // 是否启用维度
    enableGlobalAxisLine: true, // 是否启用坐标轴轴线相关设置
    enableGlobalAxisTick: false, // 是否启用坐标轴刻度相关设置
    enableGlobalAxisLabel: false, // 是否显示坐标标签
    enableGlobalSplitLine: true, // 区域中的分隔线
    enableGlobalSplitArea: true, // 区域中的填充色
    stylesObj: {
      zIndex: 1,
      centerX: 50, // 水平中心点
      centerY: 50, // 垂直中心点
      radius: 75, // 雷达图半径
      nameGap: 15, // 指示器名称和指示器轴的距离。
      splitNumber: 5, // 指示器轴的分割段数。
      shape: 'polygon', // 雷达图绘制类型
      legendPosition: 'lt', // 图例位置
      legendFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      // legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
      // 轴线
      axisColor: '#333', // 坐标轴线颜色
      axisWidth: 1, // 坐标轴线线宽。
      axisType: 'solid', // 线的类型

      axisTickLength: 5, // 刻度长度
      axisTickColor: '#333', // 刻度颜色
      axisTickWidth: 1, // 刻度线宽。
      axisTickType: 'solid', // 线的类型

      axisLabelRotate: 0, // 标签旋转角度
      axisLabelMargin: 8, // 刻度标签与轴线之间的距离。
      axisLabelColor: '#fff', // 刻度标签文字的颜色
      axisLabelFontWeight: 'normal', // 文字字体的粗细
      axisLabelFontFamily: 'sans-serif', // 文字的字体系列
      axisLabelFontSize: 12, // 文字的字体大小。

      splitLineColor: [], // 分割线颜色
      splitLineWidth: 1, // 分割线线宽。
      splitLineType: 'solid', // 分割线的类型

      axisNameColor: 'rgba(255, 255, 255, 0.7)', // 标注字体颜色
      axisNameFontSize: 12, // 图例文字大小
      axisNameFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      axisNameFontWeight: 'normal', // 图例文字粗细
      dataField: 'type', // 维度数据字段
      colorArr: [{c1: 'rgba(250,250,250,0.3)'}, {c1: 'rgba(200,200,200,0.3)'}] // 区域填充色
    },
    customStyle: [], // 自定义样式
    indicator: [
      {name: '数学', max: 100, enable: true, fieldValue: 1},
      {name: '语文', max: 100, enable: true, fieldValue: 2},
      {name: '英语', max: 100, enable: true, fieldValue: 3},
      {name: '物理', max: 100, enable: true, fieldValue: 4},
      {name: '化学', max: 100, enable: true, fieldValue: 5},
      {name: '其他', max: 100, enable: true, fieldValue: 6}
    ], // 维度配置
    dataConfig: {
      staticValue: '[\n' +
        '  { "x": "小明", "value":  98, "type": 1},\n' +
        '  { "x": "小明", "value":  68, "type": 2},\n' +
        '  { "x": "小明", "value":  76, "type": 3},\n' +
        '  { "x": "小明", "value":  88, "type": 4},\n' +
        '  { "x": "小明", "value":  92, "type": 5},\n' +
        '  { "x": "小明", "value":  99, "type": 6},\n' +
        '  { "x": "小张", "value":  97, "type": 1},\n' +
        '  { "x": "小张", "value":  88, "type": 2},\n' +
        '  { "x": "小张", "value":  86, "type": 3},\n' +
        '  { "x": "小张", "value":  89, "type": 4},\n' +
        '  { "x": "小张", "value":  95, "type": 5},\n' +
        '  { "x": "小张", "value":  79, "type": 6}\n' +
        ']' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  FunnelChart: {
    componentName: 'FunnelChart',
    thumbnail: require('@/assets/config/fun.svg'),
    name: '漏斗图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    enableLegend: true, // 是否启用图例
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      legendPosition: 'lt', // 图例位置
      legendFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
      colorArr: [{c1: '#7381F8'}, {c1: '#4689F5'}, {c1: '#43DBFF'}] // 区域颜色
    },
    dataConfig: {
      staticValue: '[{"value":60,"name":"访问","title":"网站用户行为统计"},{"value":40,"name":"咨询","title":"网站用户行为统计"},{"value":20,"name":"订单","title":"网站用户行为统计"},{"value":80,"name":"点击","title":"网站用户行为统计"},{"value":100,"name":"展现","title":"网站用户行为统计"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    },
    funnelsConfig: [
      {
        width: 50, // 宽
        height: 80, // 高
        top: 10, // 上边距
        left: 25, // 左边距
        sort: 'descending', // 排序
        orient: 'vertical', // 漏斗图朝向
        funnelAlign: 'center',
        gap: 0, // 图形间距
        fieldName: '配置1',
        isShowLabel: true, // 是否显示文本标签
        isShowTooltip: true, // 是否显示悬浮
        labelFontFamily: '微软雅黑',
        labelFontWeight: 'normal',
        labelFontSize: 16,
        labelColor: '#fff',
        labelTextAlign: 'center',
        labelPosition: 'inside', // 标签位置

        itemBorderColor: '#000', // 图形的描边颜色
        itemBorderWidth: 0, // 图形的描边宽度
        itemBorderType: 'solid', // 描边类型
        itemShadowBlur: 0, // 图形阴影的模糊大小
        itemShadowColor: '', // 阴影颜色
        itemShadowOffsetX: 0, // 阴影水平方向上的偏移距离
        itemShadowOffsetY: 0, // 阴影垂直方向上的偏移距离
        opacity: 1 // 透明的
      }
    ] // 漏斗图配置
  },
  RoseChart: {
    componentName: 'RoseChart',
    thumbnail: require('@/assets/config/rose.svg'),
    name: '南丁格尔玫瑰图',
    width: 500,
    height: 300,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    stylesObj: {
      zIndex: 1,
      legendPosition: 'lt', // 图例位置
      legendFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
      labelPosition: 'inside', // 标注位置，内部外部
      labelColor: 'rgba(255, 255, 255, 0.7)', // 标注字体颜色
      labelShowType: 'type', // 标注显示值
      labelValueType: 1, // 标注值类型
      labelFontSize: 12, // 图例文字大小
      labelFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      labelFontWeight: 'normal', // 图例文字粗细
      outerCircle: 0, // 外圆半径
      InnerCircle: 100, // 内圆半径
      pieHorizontal: 50, // 水平位置
      pieVertical: 50, // 竖向位置
      borderRadius: 18, // 扇形倒角
      roseType: 'radius',
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}] // 扇形区域颜色
    },
    dataConfig: {
      staticValue: '[{"value":1048,"name":"类型一"},{"value":735,"name":"类型二"},{"value":580,"name":"类型三"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  Liquidfill: {
    componentName: 'Liquidfill',
    thumbnail: require('@/assets/config/Sankey.svg'),
    name: '水球图',
    width: 500,
    height: 300,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      animationDuration: 'right', // 动画方向left, right

      waveNum: 1, // 波浪个数
      waveLength: 500, // 波浪宽度
      amplitude: 50, // 波浪整幅
      radius: 50, // 图表大小
      shape: 'circle', // 形状 circle， rect，roundRect，triangle， diamond，pin， arrow
      waveAnimation: true, // 动画
      outlineShow: false, // 显示外边框
      borderDistance: 2, // Distance between border and inner circle.
      borderColor: '', // 边框颜色
      borderWidth: 5, // 边框宽度
      shadowColor: '', // 阴影颜色
      shadowBlur: 0, // 阴影距离

      bgColor: '', // 内部背景颜色
      bgBorderColor: '#fff', // 内部背景边框颜色
      bgBorderWidth: 5, // 内部背景边框宽度
      bgShadowColor: '', // 背景阴影颜色
      bgShadowBlur: 0, // 背景阴影距离

      labelPosition: 'inside', // 文字位置inside， left， right， top，bottom
      labelFontSize: 30, // 文字大小
      labelFontWeight: 'normal', // 文字
      labelColor: '#fff', // 文字颜色
      labelShow: true, // 是否显示文字

      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}] // 扇形区域颜色
    },
    dataConfig: {
      staticValue: '{"value":0.6}' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  Sankey: {
    componentName: 'Sankey',
    thumbnail: require('@/assets/config/Liquidfill.svg'),
    name: '桑基图',
    width: 500,
    height: 300,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      backgroundColor: 'rgba(255, 69, 0, 0)',
      left: 5, // sankey组件离容器左侧的距离。
      top: 5, // sankey组件离容器上侧的距离。
      right: 20, // sankey组件离容器右侧的距离。
      bottom: 5, // sankey组件离容器下侧的距离。
      width: 90, // sankey组件的宽度。
      height: 90, // sankey组件的高度
      nodeWidth: 20, // 桑基图中每个矩形节点的宽度。
      nodeGap: 8, // 桑基图中每一列任意两个矩形节点之间的间隔。
      nodeAlign: 'justify', // justify, left, right
      orient: 'horizontal', // horizontal, vertical
      draggable: true,
      colorArr: [{c1: '#7381F8'}, {c1: '#4689F5'}, {c1: '#43DBFF'}] // 扇形区域颜色
    },
    levels: [{
      align: 'center', // left、center、right
      verticalAlign: 'middle', // 'top''middle''bottom'
      isShowLabel: true, // 是否显示文本标签
      labelFontFamily: '微软雅黑',
      labelFontWeight: 'normal',
      labelFontSize: 16,
      labelColor: '#fff',
      distance: 5,
      rotate: 0,
      labelPosition: 'inside', // top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight

      itemBorderColor: '', // 图形的描边颜色
      itemBorderWidth: 0, // 图形的描边宽度
      itemBorderType: 'solid', // 描边类型
      itemShadowBlur: 0, // 图形阴影的模糊大小
      itemShadowColor: '', // 阴影颜色
      itemShadowOffsetX: 0, // 阴影水平方向上的偏移距离
      itemShadowOffsetY: 0, // 阴影垂直方向上的偏移距离
      opacity: 1, // 透明的

      lineStyleColor: 'rgba(222, 17, 144, 1)', // 线条颜色
      lineStyleOpacity: 0.2, // 线条透明度
      curveness: 0.5
    }, {
      align: 'center', // left、center、right
      verticalAlign: 'middle', // 'top''middle''bottom'
      isShowLabel: true, // 是否显示文本标签
      labelFontFamily: '微软雅黑',
      labelFontWeight: 'normal',
      labelFontSize: 16,
      labelColor: '#fff',
      distance: 5,
      rotate: 0,
      labelPosition: 'inside', // top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight

      itemBorderColor: '', // 图形的描边颜色
      itemBorderWidth: 0, // 图形的描边宽度
      itemBorderType: 'solid', // 描边类型
      itemShadowBlur: 0, // 图形阴影的模糊大小
      itemShadowColor: '', // 阴影颜色
      itemShadowOffsetX: 0, // 阴影水平方向上的偏移距离
      itemShadowOffsetY: 0, // 阴影垂直方向上的偏移距离
      opacity: 1, // 透明的

      lineStyleColor: 'rgba(222, 17, 144, 1)', // 线条颜色
      lineStyleOpacity: 0.2, // 线条透明度
      curveness: 0.5
    }, {
      align: 'center', // left、center、right
      verticalAlign: 'middle', // 'top''middle''bottom'
      isShowLabel: true, // 是否显示文本标签
      labelFontFamily: '微软雅黑',
      labelFontWeight: 'normal',
      labelFontSize: 16,
      labelColor: '#fff',
      distance: 5,
      rotate: 0,
      labelPosition: 'inside', // top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight

      itemBorderColor: '', // 图形的描边颜色
      itemBorderWidth: 0, // 图形的描边宽度
      itemBorderType: 'solid', // 描边类型
      itemShadowBlur: 0, // 图形阴影的模糊大小
      itemShadowColor: '', // 阴影颜色
      itemShadowOffsetX: 0, // 阴影水平方向上的偏移距离
      itemShadowOffsetY: 0, // 阴影垂直方向上的偏移距离
      opacity: 1, // 透明的

      lineStyleColor: 'rgba(222, 17, 144, 1)', // 线条颜色
      lineStyleOpacity: 0.2, // 线条透明度
      curveness: 0.5
    }],
    dataConfig: {
      staticValue: '[{"source":"a","target":"a1","value":5},{"source":"a","target":"a2","value":3},{"source":"b","target":"b1","value":8},{"source":"a","target":"b1","value":3},{"source":"b1","target":"a1","value":1},{"source":"b1","target":"c","value":2}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  BasicPieChart: {
    componentName: 'BasicPieChart',
    thumbnail: require('@/assets/config/pie.svg'),
    name: '基础饼图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    stylesObj: {
      zIndex: 1,
      legendPosition: 'lt', // 图例位置
      legendFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
      labelPosition: 'inside', // 标注位置，内部外部
      labelColor: 'rgba(255, 255, 255, 0.7)', // 标注字体颜色
      labelShowType: 'type', // 标注显示值
      labelValueType: 1, // 标注值类型
      labelFontSize: 12, // 图例文字大小
      labelFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      labelFontWeight: 'normal', // 图例文字粗细
      outerCircle: 70, // 外圆半径
      InnerCircle: 0, // 内圆半径
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}] // 扇形区域颜色
    },
    dataConfig: {
      staticValue: '[{"value":1048,"name":"类型一"},{"value":735,"name":"类型二"},{"value":580,"name":"类型三"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  BasicBarChart: {
    componentName: 'BasicBarChart',
    thumbnail: require('@/assets/config/bar.svg'),
    name: '基础柱状图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    enableLabel: true, // 是否启用标注
    enableGrid: false, // 是否启用容器布局
    enableXAxis: true, // 启用x轴样式
    enableYAxis: true, // 启用y轴样式
    enableData: false, // 启用海量数据
    dimension: 'x', // 默认以x字段作为x轴为主，也可以用s字段作为x轴
    stylesObj: {
      zIndex: 1,
      gridLeft: 30, // 距离容器左边
      gridTop: 30, // 距离容器顶部
      gridRight: 30, // 距离容器右边
      gridBottom: 30, // 距离容器底部
      groupDisplay: 'group', // 柱状图分组展示， group， stack
      innerGroupSpace: 10, // 组内间距， 只有分组时才生效
      interGroupSpace: 30, // 组间间距， 柱子和其他柱子的间隔
      barWidth: 25, // 柱子宽度
      borderRadius: 0, // 柱子顶部倒角
      legendPosition: 'tc', // 图例位置
      legendFontFamily: '微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      labelField: 'y', // 标注字段
      labelPrefix: '', // 标注前缀
      labelSuffix: '', // 标注后缀
      labelFontFamily: '微软雅黑', // 标注字体
      labelFontWeight: 'normal', // 标注文字粗细
      labelFontSize: 12, // 标注文字大小
      labelColor: '#FFF', // 标注字体颜色
      labelPosition: 'top', // 标注位置，顶部， 内部，底部
      XLineColor: '#fff', // x轴轴颜色
      XDataType: 'category', // 轴类型
      XName: '', // X轴 标题名称
      XFontFamily: '微软雅黑', // x轴字体
      XFontWeight: 'normal', // x轴文字粗细
      XFontSize: 12, // x轴文字大小
      XColor: '#FFF', // x轴字体颜色
      XTickEnable: false, // x轴刻度
      XTickColor: '#fff', // x轴刻度颜色
      XTickLabelFontFamily: '微软雅黑', // x轴字体
      XTickLabelFontWeight: 'normal', // x轴文字粗细
      XTickLabelFontSize: 12, // x轴文字大小
      XTickLabelColor: '#FFF', // x轴字体颜色
      XTickLabelRotate: 0, // x轴字体旋转角度
      YLineColor: '#fff', // x轴轴颜色
      YDataType: 'value',
      YName: '', // X轴 标题名称
      YFontFamily: '微软雅黑', // x轴字体
      YFontWeight: 'normal', // x轴文字粗细
      YFontSize: 12, // x轴文字大小
      YColor: '#FFF', // x轴字体颜色
      YTickEnable: false, // x轴刻度
      YTickColor: '#fff', // x轴刻度颜色
      YTickLabelFontFamily: '微软雅黑', // x轴字体
      YTickLabelFontWeight: 'normal', // x轴文字粗细
      YTickLabelFontSize: 12, // x轴文字大小
      YTickLabelColor: '#FFF', // x轴字体颜色
      YTickLabelRotate: 0, // Y轴字体旋转角度
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}], // 区域颜色
      ...markLineConfig
    },
    markLineConfig: [],
    dataConfig: {
      staticValue: '[{"x":"项目一","y":98,"s":"系列一"},{"x":"项目二","y":86,"s":"系列一"},{"x":"项目三","y":90,"s":"系列一"},{"x":"项目一","y":91,"s":"系列二"},{"x":"项目二","y":97,"s":"系列二"},{"x":"项目三","y":95,"s":"系列二"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  TransverseBarChart: {
    componentName: 'TransverseBarChart',
    thumbnail: require('@/assets/config/transverseBarChart.svg'),
    name: '横向柱状图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    enableGrid: false, // 是否启用容器布局
    enableXAxis: true, // 启用x轴样式
    enableYAxis: true, // 启用y轴样式
    enableData: false, // 启用海量数据
    dimension: 'x', // 默认以x字段作为x轴为主，也可以用s字段作为x轴
    stylesObj: {
      zIndex: 1,
      gridLeft: 30, // 距离容器左边
      gridTop: 30, // 距离容器顶部
      gridRight: 30, // 距离容器右边
      gridBottom: 30, // 距离容器底部
      groupDisplay: 'group', // 柱状图分组展示， group， stack
      innerGroupSpace: 10, // 组内间距， 只有分组时才生效
      interGroupSpace: 30, // 组间间距， 柱子和其他柱子的间隔
      barWidth: 25, // 柱子宽度
      borderRadius: 0, // 柱子顶部倒角
      legendPosition: 'tc', // 图例位置
      legendFontFamily: '微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      labelField: 'y', // 标注字段
      labelPrefix: '', // 标注前缀
      labelSuffix: '', // 标注后缀
      labelFontFamily: '微软雅黑', // 标注字体
      labelFontWeight: 'normal', // 标注文字粗细
      labelFontSize: 12, // 标注文字大小
      labelColor: '#FFF', // 标注字体颜色
      labelPosition: 'top', // 标注位置，顶部， 内部，底部
      XLineColor: '#fff', // x轴轴颜色
      XDataType: 'value', // 轴类型
      XName: '', // X轴 标题名称
      XFontFamily: '微软雅黑', // x轴字体
      XFontWeight: 'normal', // x轴文字粗细
      XFontSize: 12, // x轴文字大小
      XColor: '#FFF', // x轴字体颜色
      XTickEnable: false, // x轴刻度
      XTickColor: '#fff', // x轴刻度颜色
      XTickLabelFontFamily: '微软雅黑', // x轴字体
      XTickLabelFontWeight: 'normal', // x轴文字粗细
      XTickLabelFontSize: 12, // x轴文字大小
      XTickLabelColor: '#FFF', // x轴字体颜色
      YLineColor: '#fff', // x轴轴颜色
      XTickLabelRotate: 0, // x轴字体旋转角度
      YDataType: 'category',
      YName: '', // X轴 标题名称
      YFontFamily: '微软雅黑', // x轴字体
      YFontWeight: 'normal', // x轴文字粗细
      YFontSize: 12, // x轴文字大小
      YColor: '#FFF', // x轴字体颜色
      YTickEnable: false, // x轴刻度
      YTickColor: '#fff', // x轴刻度颜色
      YTickLabelFontFamily: '微软雅黑', // x轴字体
      YTickLabelFontWeight: 'normal', // x轴文字粗细
      YTickLabelFontSize: 12, // x轴文字大小
      YTickLabelColor: '#FFF', // x轴字体颜色
      YTickLabelRotate: 0, // Y轴字体旋转角度
      ...markLineConfig,
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}] // 区域颜色
    },
    markLineConfig: [],
    dataConfig: {
      staticValue: '[{"x":"项目一","y":98,"s":"系列一"},{"x":"项目二","y":86,"s":"系列一"},{"x":"项目三","y":90,"s":"系列一"},{"x":"项目一","y":91,"s":"系列二"},{"x":"项目二","y":97,"s":"系列二"},{"x":"项目三","y":95,"s":"系列二"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  HorizontalProgressBar: {
    componentName: 'HorizontalProgressBar',
    imgUrl: require('@/assets/config/HorizontalProgressBar.svg'),
    name: '横向进度条',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableGrid: false, // 是否启用容器布局
    enableLabel: true, // 是否显示标注
    enableTitle: true, // 是否显示标题
    stylesObj: {
      zIndex: 1,
      gridLeft: 30, // 距离容器左边
      gridTop: 30, // 距离容器顶部
      gridRight: 30, // 距离容器右边
      gridBottom: 30, // 距离容器底部
      barWidth: 20, // 柱子宽度
      borderRadius: 10, // 柱子顶部倒角
      barBgColor: 'rgba(255,255,255,.2)', // 进度条背景色
      XFontFamily: '微软雅黑',
      XFontWeight: 'normal',
      XFontSize: 14,
      XColor: 'rgba(255,255,255,.7)',
      labelField: 'x', // 标注字段
      labelPrefix: '', // 标注前缀
      labelSuffix: '', // 标注后缀
      labelFontFamily: '微软雅黑', // 标注字体
      labelFontWeight: 'normal', // 标注文字粗细
      labelFontSize: 12, // 标注文字大小
      labelColor: '#fff', // 标注字体颜色
      labelPosition: 'insideRight', // 标注位置，顶部， 内部，底部
      labelOffset: 20, // 文字偏移
      colorArr: [
        {c1: '#7381F8', c2: '#7381F8'},
        {c1: '#4689F5', c2: '#4689F5'},
        {c1: '#43DBFF', c2: '#43DBFF'}
      ] // 区域颜色
    },
    dataConfig: {
      staticValue: '[{"x":"新创建","y":98,"s": 100},{"x":"进行中","y":86,"s": 100},{"x":"已完成","y":90,"s":100}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  BasicLineChart: {
    componentName: 'BasicLineChart',
    thumbnail: require('@/assets/config/baseLine.svg'),
    name: '基础折线图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    enableGrid: false, // 是否启用容器布局
    enableXAxis: true, // 启用x轴样式
    enableYAxis: true, // 启用y轴样式
    enableData: false, // 启用海量数据
    dimension: 'x', // 默认以x字段作为x轴为主，也可以用s字段作为x轴
    enableFullArea: false, // 是否填充折线区域
    stylesObj: {
      zIndex: 1,
      gridLeft: 30, // 距离容器左边
      gridTop: 30, // 距离容器顶部
      gridRight: 30, // 距离容器右边
      gridBottom: 30, // 距离容器底部
      groupDisplay: 'normal', // 柱状图分组展示， normal， curve，trapezoid
      lineStyleType: 'solid', // 折线类型，solid = 实线； 虚线=dashed；点线=dotted
      lineWidth: 2, // 线粗细
      symbolSize: 3, // 线标记大小
      symbol: 'none', // 线标记
      legendPosition: 'tc', // 图例位置
      legendFontFamily: '微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      labelField: 'y', // 标注字段
      labelPrefix: '', // 标注前缀
      labelSuffix: '', // 标注后缀
      labelFontFamily: '微软雅黑', // 标注字体
      labelFontWeight: 'normal', // 标注文字粗细
      labelFontSize: 12, // 标注文字大小
      labelColor: '#FFF', // 标注字体颜色
      labelPosition: 'top', // 标注位置，顶部， 内部，底部
      XLineColor: '#fff', // x轴轴颜色
      XDataType: 'category', // 轴类型
      XName: '', // X轴 标题名称
      XFontFamily: '微软雅黑', // x轴字体
      XFontWeight: 'normal', // x轴文字粗细
      XFontSize: 12, // x轴文字大小
      XColor: '#FFF', // x轴字体颜色
      XTickEnable: false, // x轴刻度
      XTickColor: '#fff', // x轴刻度颜色
      XTickLabelFontFamily: '微软雅黑', // x轴字体
      XTickLabelFontWeight: 'normal', // x轴文字粗细
      XTickLabelFontSize: 12, // x轴文字大小
      XTickLabelColor: '#FFF', // x轴字体颜色
      XTickLabelRotate: 0, // x轴字体旋转角度
      YLineColor: '#fff', // x轴轴颜色
      YDataType: 'value',
      YName: '', // X轴 标题名称
      YFontFamily: '微软雅黑', // x轴字体
      YFontWeight: 'normal', // x轴文字粗细
      YFontSize: 12, // x轴文字大小
      YColor: '#FFF', // x轴字体颜色
      YTickEnable: false, // x轴刻度
      YTickColor: '#fff', // x轴刻度颜色
      YTickLabelFontFamily: '微软雅黑', // x轴字体
      YTickLabelFontWeight: 'normal', // x轴文字粗细
      YTickLabelFontSize: 12, // y轴文字大小
      YTickLabelColor: '#FFF', // y轴字体颜色
      YTickLabelRotate: 0, // Y轴字体旋转角度
      ...markLineConfig,
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}] // 区域颜色
    },
    markLineConfig: [],
    dataConfig: {
      staticValue: '[{"x":"周一","y":98,"s":"系列一"},{"x":"周二","y":86,"s":"系列一"},{"x":"周三","y":90,"s":"系列一"},{"x":"周四","y":48,"s":"系列一"},{"x":"周五","y":78,"s":"系列一"},{"x":"周一","y":91,"s":"系列二"},{"x":"周二","y":97,"s":"系列二"},{"x":"周三","y":95,"s":"系列二"},{"x":"周四","y":67,"s":"系列二"},{"x":"周五","y":69,"s":"系列二"}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  CircleProgressBar: {
    componentName: 'CircleProgressBar',
    thumbnail: require('@/assets/config/CircleProgressBar.svg'),
    name: '环形进度条',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用标题
    stylesObj: {
      zIndex: 1,
      legendName: '环形进度条', // 标题名称
      legendPosition: 'lt', // 标题位置
      legendFontFamily: 'Arial,苹方,微软雅黑', // 标题字体
      legendFontWeight: 'normal', // 标题文字粗细
      legendFontSize: 16, // 标题文字大小
      legendColor: '#FFF', // 标题字体颜色
      legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直

      labelPosition: 1, // 显示内容， 1、默认；2、自定义1；3、自定义2
      labelColor: 'rgba(255, 255, 255, 0.7)', // 标注字体颜色
      labelFontSize: 16, // 文字大小
      labelFontFamily: 'Arial,苹方,微软雅黑', // 字体
      labelFontWeight: 'normal', // 文字粗细

      label1Color: 'rgba(255, 255, 255, 0.7)', // 自定义1字体颜色
      label1FontSize: 16, // 自定义1文字大小
      label1FontFamily: 'Arial,苹方,微软雅黑', // 自定义1字体
      label1FontWeight: 'normal', // 自定义1文字粗细
      label1Prefix: '', // 前缀
      label1Suffix: '', // 后缀

      label2Color: 'rgba(255, 255, 255, 0.7)', // 自定义2字体颜色
      label2FontSize: 16, // 自定义2文字大小
      label2FontFamily: 'Arial,苹方,微软雅黑', // 自定义2字体
      label2FontWeight: 'normal', // 自定义2文字粗细
      label2Prefix: '', // 自定义2前缀
      label2Suffix: '', // 自定义2后缀

      outerCircle: 40, // 外圆半径
      InnerCircle: 50, // 内圆半径
      barColor: '#24CBFF', // 进度条颜色
      barBgColor: 'rgba(255,255,255,0.1)', // 进度条背景色
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}] // 扇形区域颜色
    },
    dataConfig: {
      staticValue: '{"total": 100,"value":88}' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  ColumnLineMix: {
    componentName: 'ColumnLineMix',
    thumbnail: require('@/assets/config/lineChart.svg'),
    name: '柱线混合图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    enableGrid: false, // 是否启用容器布局
    enableXAxis: true, // 启用x轴样式
    enableYAxis: true, // 启用y轴样式
    enableY1Axis: true, // 启用y轴样式
    enableData: false, // 启用海量数据
    dimension: 'x', // 默认以x字段作为x轴为主，也可以用s字段作为x轴
    enableFullArea: false, // 是否填充折线区域
    enableLabel: true, // 柱状标注
    stylesObj: {

      // 通用
      zIndex: 1,
      gridLeft: 30, // 距离容器左边
      gridTop: 30, // 距离容器顶部
      gridRight: 30, // 距离容器右边
      gridBottom: 30, // 距离容器底部
      legendPosition: 'tc', // 图例位置
      legendFontFamily: '微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 12, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      colorArr: [{c1: '#7381F8', c2: '#7381F8'}, {c1: '#4689F5', c2: '#4689F5'}, {c1: '#43DBFF', c2: '#43DBFF'}], // 区域颜色
      XLineColor: '#fff', // x轴轴颜色
      XDataType: 'category', // 轴类型
      XName: '', // X轴 标题名称
      XFontFamily: '微软雅黑', // x轴字体
      XFontWeight: 'normal', // x轴文字粗细
      XFontSize: 12, // x轴文字大小
      XColor: '#FFF', // x轴字体颜色
      XTickEnable: false, // x轴刻度
      XTickColor: '#fff', // x轴刻度颜色
      XTickLabelFontFamily: '微软雅黑', // x轴字体
      XTickLabelFontWeight: 'normal', // x轴文字粗细
      XTickLabelFontSize: 12, // x轴文字大小
      XTickLabelColor: '#FFF', // x轴字体颜色
      XTickLabelRotate: 0, // x轴字体旋转角度

      groupDisplay: 'normal', // 折线图展示， normal， curve，trapezoid
      lineStyleType: 'solid', // 折线类型，solid = 实线； 虚线=dashed；点线=dotted
      lineWidth: 2, // 线粗细
      symbolSize: 3, // 线标记大小
      symbol: 'none', // 线标记

      barGroupDisplay: 'group', // 柱状图分组展示， group， stack
      innerGroupSpace: 10, // 组内间距， 只有分组时才生效
      interGroupSpace: 30, // 组间间距， 柱子和其他柱子的间隔
      barWidth: 25, // 柱子宽度
      borderRadius: 0, // 柱子顶部倒角

      labelField: 'y', // 标注字段
      labelPrefix: '', // 标注前缀
      labelSuffix: '', // 标注后缀
      labelFontFamily: '微软雅黑', // 标注字体
      labelFontWeight: 'normal', // 标注文字粗细
      labelFontSize: 12, // 标注文字大小
      labelColor: '#FFF', // 标注字体颜色
      labelPosition: 'top', // 标注位置，顶部， 内部，底部

      labelBarField: 'y', // 标注字段
      labelBarPrefix: '', // 标注前缀
      labelBarSuffix: '', // 标注后缀
      labelBarFontFamily: '微软雅黑', // 标注字体
      labelBarFontWeight: 'normal', // 标注文字粗细
      labelBarFontSize: 12, // 标注文字大小
      labelBarColor: '#FFF', // 标注字体颜色
      labelBarPosition: 'top', // 标注位置，顶部， 内部，底部

      YLineColor: '#fff', // Y轴轴颜色
      YDataType: 'value',
      YName: '', // Y轴 标题名称
      YFontFamily: '微软雅黑', // Y轴字体
      YFontWeight: 'normal', // Y轴文字粗细
      YFontSize: 12, // Y轴文字大小
      YColor: '#FFF', // Y轴字体颜色
      YTickEnable: false, // Y轴刻度
      YTickColor: '#fff', // Y轴刻度颜色
      YTickLabelFontFamily: '微软雅黑', // Y轴字体
      YTickLabelFontWeight: 'normal', // Y轴文字粗细
      YTickLabelFontSize: 12, // Y轴文字大小
      YTickLabelColor: '#FFF', // Y轴字体颜色
      YTickLabelRotate: 0, // Y轴字体旋转角度
      Y1LineColor: '#fff', // Y轴轴颜色
      Y1DataType: 'value',
      Y1Name: '', // Y轴 标题名称
      Y1FontFamily: '微软雅黑', // Y轴字体
      Y1FontWeight: 'normal', // Y轴文字粗细
      Y1FontSize: 12, // Y轴文字大小
      Y1Color: '#FFF', // Y轴字体颜色
      Y1TickEnable: false, // Y轴刻度
      Y1TickColor: '#fff', // Y轴刻度颜色
      Y1TickLabelFontFamily: '微软雅黑', // Y轴字体
      Y1TickLabelFontWeight: 'normal', // Y轴文字粗细
      Y1TickLabelFontSize: 12, // Y轴文字大小
      Y1TickLabelColor: '#FFF', // Y轴字体颜色
      Y1TickLabelRotate: 0, // Y轴字体旋转角度
      ...markLineConfig
    },
    markLineConfig: [],
    dataConfig: {
      staticValue: '{"list":[{"name":"营业额","data":[4033,2340,2743,3903,5899,6382,8630],"yAxisIndex":0,"type":"bar"},{"name":"支出","data":[4233,4335,3424,6345,7542,4522,9654],"yAxisIndex":0,"type":"bar"},{"name":"盈利占比","data":[-4.72,-46.02,-19.89,-38.49,-25.89,41.13,10.6],"yAxisIndex":1,"type":"line"}],"xAxis":["周一","周二","周三","周四","周五","周六","周日"]}' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  Dashboard: {
    componentName: 'Dashboard',
    thumbnail: require('@/assets/config/board.svg'),
    name: '仪表图',
    width: 500,
    height: 280,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableLegend: true, // 是否启用图例
    axisLine: true, // 是否启用仪表盘轴线
    progress: true, // 是否启用展示当前进度
    splitLine: true, // 是否启用分割线
    axisTick: true, // 是否启用刻度样式
    axisLabel: true, // 是否启用刻度标签
    pointer: true, // 是否启用指针
    anchor: true, // 指针圆心
    detail: true,
    boardConfig: [],
    stylesObj: {
      zIndex: 1,
      legendName: '仪表盘', // 标题
      legendPosition: 'lt', // 图例位置
      legendFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
      legendFontWeight: 'normal', // 图例文字粗细
      legendFontSize: 16, // 图例文字大小
      legendColor: '#FFF', // 图例字体颜色
      startAngle: 180, //起始角度
      endAngle: 0, // 结束角度
      radius: 100, // 仪表盘半价
      max: 180, // 刻度最大值
      min: 0, // 刻度最小值
      splitNumber: 5, // 刻度分割段数
      roundCap: true, // 两端启用圆角
      axisLineWidth: 10, // 轴线宽度
      axisLineColorConfig: [{name: 1, value: '#E6EBF8'}], // 轴线颜色
      progressRoundCap: true, // 进度条
      progressWidth: 10, // 进度条宽度
      progressColor: '#58D9F9', // 进度条颜色
      splitLineLength: 10, // 分割线长度
      splitLineDistance: 10, // 分割线离轴线的距离
      splitLineColor: '#fff', // 分割线颜色
      splitLineWidth: 2, // 分割线宽度
      splitLineType: 'solid', // 分割线类型， 实现，虚线，点线
      axisTickSplitNumber: 5, // 分隔线之间分割的刻度数
      axisTickLength: 10, // 刻度线长
      axisTickDistance: 0, // 刻度线与轴线的距离
      axisTickColor: '#fff', // 刻度线颜色
      axisTickWidth: 2, //刻度线宽度
      axisTickType: 'solid', // 刻度线类型， 实现，虚线，点线
      axisLabelDistance: 10, // 标签与刻度线的距离
      axisLabelFontFamily: 'Arial,苹方,微软雅黑', //标签字体
      axisLabelFontWeight: 'normal', //标签文字粗细
      axisLabelFontSize: 16, // 标签文字大小
      axisLabelColor: '#FFF', // 标签文字颜色
      icon: '', // 指针图标， 默认
      pointerLength: 60, // 指针长度
      pointerWidth: 5, // 指针宽度
      pointerColor: '#58D9F9', // 制作颜色
      anchorIcon: 'none', // 指针圆心图标， 默认
      anchorSize: 6, // 指针圆心大小
      anchorColor: '#000', // 指针圆心颜色
      horizontalOffset: 0, // 水平方向偏移
      verticalOffset: 35, // 垂直方向偏移
      detailFontFamily: 'Arial,苹方,微软雅黑',
      detailFontWeight: 'normal',
      detailFontSize: 16,
      detailColor: '#FFF',
      detailPrefix: '', // 值前缀
      detailSuffix: '' // 值后缀
    },
    dataConfig: {
      staticValue: '{"value":80}' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  TabComponent: { // tab组件
    componentName: 'TabComponent',
    thumbnail: require('@/assets/config/Tab.svg'),
    name: 'tab组件',
    width: 500,
    height: 180,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      stylesType: 'styleOne',
      tabMarginLeftAndRight: 10, // tab外边距
      defaultShowTab: 'tab1_0', // 默认选中的tab
      paramName: '' // 传递参数名称
    },
    styleOne: {
      activeConfig: {
        ...tabStylesConfig,
        cColor: '#4689F5' // 激活状态
      },
      unActiveConfig: {
        ...tabStylesConfig
      }
    },
    styleTwo: {
      activeConfig: {
        ...tabStylesConfig,
        cColor: '#4689F5' // 激活状态
      },
      unActiveConfig: {
        ...tabStylesConfig
      }
    },
    styleThree: {
      activeConfig: {
        ...tabStylesConfig,
        cColor: '#fff', // 激活状态
        cBgColor: '#4689F5', // 背景颜色
        borderColor: '#4689F5', // 边框颜色
        cHoverBgColor: '#4689F5', // 悬浮时的背景颜色
        cHoverColor: '#fff' // 未激活状态左右内边距
      },
      unActiveConfig: {
        ...tabStylesConfig,
        cColor: 'rgba(255, 255, 255, 0.7)', // 激活状态
        cBgColor: '#05103A', // 背景颜色
        borderColor: '#2F437F', // 边框颜色
        cHoverBgColor: '#4689F5', // 悬浮时的背景颜色
        cHoverColor: '#fff' // 未激活状态左右内边距
      }
    },
    tabConfig: [
      {
        key: 1,
        name: 'tab1', // tab名称
        displayChartArray: [], // tab关联显示的图表，是空数组默认不处理
        activeIcon: '', // tab激活状态下的图标
        unActiveIcon: '', // tab非激活状态下的图标
        value: '', // 当前tab代表的参数，用于更新图标
        geChartArray: [] // 当前tab需要更新哪几个图表，配合value字段使用
      },
      {
        key: 2,
        name: 'tab2', // tab名称
        displayChartArray: [], // tab关联显示的图表，是空数组默认不处理
        activeIcon: '', // tab激活状态下的图标
        unActiveIcon: '', // tab非激活状态下的图标
        value: '', // 当前tab代表的参数，用于更新图标
        geChartArray: [] // 当前tab需要更新哪几个图表，配合value字段使用
      },
      {
        key: 3,
        name: 'tab3', // tab名称
        displayChartArray: [], // tab关联显示的图表，是空数组默认不处理
        activeIcon: '', // tab激活状态下的图标
        unActiveIcon: '', // tab非激活状态下的图标
        value: '', // 当前tab代表的参数，用于更新图标
        geChartArray: [] // 当前tab需要更新哪几个图表，配合value字段使用
      }]
  },
  TimeFiltering: { // 时间过滤
    componentName: 'TimeFiltering',
    thumbnail: require('@/assets/config/timeFilter.svg'),
    name: '时间过滤',
    width: 500,
    height: 80,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      bgColor: '#192757', // 控件背景颜色
      borderColor: '#2F437F', // 控件边框颜色
      iconColor: '#4689F5', // 图标颜色
      fontColor: '#FFFFFF', // 控件字体颜色
      checkedTimes: [2], // 时间类型选用
      defaultCheckedTimeType: '', // 默认时间类型选用
      updateChart: [], // 关联更新图表
      timeTypeFiled: '', // 时间类型字段
      timeValueFiled: '', // 时间值字段
      checkedTimesOthers: [] // 时间扩展操作
    }
  },
  DropdownBox: { // 下拉框
    componentName: 'DropdownBox',
    thumbnail: require('@/assets/config/select.svg'),
    name: '下拉过滤',
    width: 300,
    height: 80,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      bgColor: '#192757', // 控件背景颜色
      borderColor: '#2F437F', // 控件边框颜色
      iconColor: '#4689F5', // 图标颜色
      fontColor: '#FFFFFF', // 控件字体颜色
      defaultCheckedTimeType: '', // 默认时间类型选用
      updateChart: [], // 关联更新图表
      paramsFiled: '', // 参数字段
      selectOptions: [
        {
          label: '时间',
          value: '1'
        }, {
          label: '组织',
          value: '2'
        }, {
          label: '人员',
          value: '3'
        }]
    }
  },
  DocExportBtn: {
    componentName: 'DocExportBtn',
    thumbnail: require('@/assets/config/Export.svg'),
    name: '文档导出按钮',
    width: 300,
    height: 80,
    minHeight: 20,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    stylesObj: {
      zIndex: 1,
      content: '下载资料',
      normalFSize: 16, // 正常字体大小
      normalColor: '#fff', // 正常字体颜色
      normalBorderRadius: 4, // 正常倒角
      normalBColor: '#fff', // 正常边框颜色
      normalBWidth: 0, // 正常边框宽度
      normalBStyle: 'solid', // 正常边框颜色
      normalBgColor: '#4689F5', // 正常背景颜色
      activeFSize: 16, // 悬浮字体大小
      activeColor: '#fff', // 悬浮字体颜色
      activeBorderRadius: 4, // 悬浮边框倒角
      activeBColor: '#fff', // 悬浮边框颜色
      activeBWidth: 0, // 悬浮边框宽度
      activeBStyle: 'solid', // 悬浮边框颜色
      activeBgColor: '#6CA3FD' // 悬浮背景颜色
    },
    config: [] // excel sheet配置
  },
  BasicMap: {
    componentName: 'BasicMap',
    thumbnail: require('@/assets/config/basicMap.svg'),
    name: '基础地图',
    width: 1000,
    height: 600,
    minHeight: 100,
    minWidth: 100,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableTooltip: true, // 是否启用悬浮提示
    isFixed: false,
    stylesObj: {
      mapCenterPoint: '116.404, 39.915', // 地图中心点
      initLevel: 4, // 初始化地图层级
      enableScrollWheelZoom: true, // 是否开起鼠标滚轮缩放
      zIndex: 1,
      // 地图风格配置
      typeConfig: 1, // 类型配置， 1、默认 2、使用地图风格 3、自定义
      mapStyleType: 1,
      // 自定义颜色配置
      landColor: '', // 陆地颜色
      waterColor: '', // 水系颜色
      vegetationColor: '', // 植被颜色
      buildingColor: '', // 建筑物颜色
      enableWaterName: 'on', // 是否启用水系名称
      waterNameColor: '', // 水系名称颜色
      waterNameFontSize: 16, // 水系名称字体大小
      enableRoadName: 'on', // 是否启用道路
      roadColor: '', // 道路颜色
      roadNameColor: '', // 道路名称颜色
      roadNameFontSize: 16, // 道路名称字体大小
      enableRailwayName: 'on', // 是否启用铁路
      railwayNameColor: '', // 铁路名称颜色
      railwayNameFontSize: 16, // 铁路名称字体大小

      enableAdminName: 'on', // 是否启用行政名称
      adminNameColor: '', // 行政名称颜色
      adminNameFontSize: 16, // 行政名称字体大小

      // 展示类型
      displayType: 1, // 1、散点图  2、热力图  3、自定义
      scatterBorder: 0, // 散点边框大小
      dataMappingField: 'type', // 数据映射字段
      scatterConfig: [
        {
          'fieldValue': '1',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(255, 140, 0, 1)',
          'scatterHighlightColor': 'rgba(255, 215, 0, 1)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        },
        {
          'fieldValue': '2',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(0, 186, 189, 1)',
          'scatterHighlightColor': 'rgba(31, 147, 255, 0.73)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        },
        {
          'fieldValue': '3',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(255, 0, 234, 1)',
          'scatterHighlightColor': 'rgba(179, 73, 193, 1)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        },
        {
          'fieldValue': '4',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(20, 234, 45, 1)',
          'scatterHighlightColor': 'rgba(52, 220, 105, 1)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        }
      ], // 散点图点样式配置集合
      pointSize: 100, // 权重最大值
      dotBlurSize: 15, // 半径大小
      hotDataColor: [{c1: 'rgba(255, 69, 0, 0.68)'}, {c1: 'rgba(199, 21, 133, 0.46)'}, {c1: 'rgba(144, 240, 144, 0.5)'}], // 热力图颜色

      minPellucidity: 20, // 最小透明度
      maxPellucidity: 100, // 最大透明度

      imageWidth: 32, //  图片宽度
      imageHeight: 32, // 图片高度
      customDataMappingField: 'type', // 数据映射字段
      customDisplay: [], // 自定义展示
      // tooltip配置
      showInfoType: 2, // 悬浮类型
      customTipInfo: '{name}类型是{type}', // 自定义悬浮类型信息
      infoConfig: [{name: 'name', value: '名称'}], // 自定义悬浮信息
      // 交互设置
      enableMouseover: false, // 启用鼠标移入
      overBulletWidth: 600, // 悬浮时的弹框宽度
      overBulletHeight: 400, // 悬浮时的弹框高度
      overBulletUrl: '', // 悬浮时的弹框地址
      enableMouseClick: false, // 启用鼠标点击
      interactionMode: 1, // 交互方式
      clickBulletWidth: 600, // 点击时的弹框宽度
      clickBulletHeight: 400, // 点击时的弹框高度
      clickBulletUrl: '', // 点击时的弹框地址
      url: '', // 跳转地址
      enableOpenNewWindow: true, // 新弹窗
      updateChart: [], // 关联的组件
      paramsFieldsConfig: [] // 给关联的组件传参数
    },
    dataConfig: {
      staticValue: '[{"name": "海门","type": 1,"value": [121.15, 31.89, 9]}, {"name": "鄂尔多斯","type": 1,"value": [109.781327, 39.608266, 12]}, {"name": "招远","type": 2,"value": [120.38, 37.35, 12]}, {"name": "舟山","type": 3,"value": [122.207216, 29.985295, 12]}, {"name": "齐齐哈尔","type": 2, "value": [123.97, 47.33, 14]}, {"name": "盐城","type": 1, "value": [120.13, 33.38, 15]}, {"name": "赤峰","type": 1, "value": [118.87, 42.28, 16]}, {"name": "青岛","type": 2, "value": [120.33, 36.07, 18]}, {"name": "廊坊","type": 3, "value": [116.7, 39.53, 193]}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  NationalProvinceMap: {
    componentName: 'NationalProvinceMap',
    thumbnail: require('@/assets/config/npm.svg'),
    name: '全国省份地图',
    width: 1000,
    height: 600,
    minHeight: 100,
    minWidth: 100,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 1：静态；2：接口获取；3：SQL获取
    enableTooltip: true, // 是否启用悬浮提示
    isFixed: false,
    stylesObj: {
      roam: false, // 禁止拖动
      zoom: 1, // 地图层级
      center: '108.953723,34.341248', // 中心点，只有全国才有用
      bgColor1: '',
      bgColor2: '',
      areaType: 1, // 区域类型 ，1，全国带省份 2、全国带城市，3、省份 4、城市 5、自定义
      provinceCode: '110000',
      cityCode: '110100',
      geoJSONUrl: '', // geoJSON文件地址
      zIndex: 1,
      // 地图自定义区域样式

      adminBoundaryColor: '#3B5077', // 行政区域边界颜色
      adminBoundaryBorderWidth: 1, // 行政边界宽度
      adminBoundaryShadowColor: 'b1cbf5', // 行政区边界阴影色
      adminBoundaryShadowSize: 1, // 行政区边界阴影大小
      shadowHorizontalOffset: 0, // 阴影水平偏移
      shadowVerticalOffset: 0, //  阴影垂直偏移
      areaDefaultColor: '#031525', // 默认区域颜色
      areaHighlightColor: '#0f2c70', // 区域高亮颜色
      enableShow: false, // 是否显示文字
      textColor: '#ffffff', // 文字颜色
      highlightTextColor: '#ffffff', // 文字高亮颜色

      // 展示类型
      displayType: 1, // 1、散点图  2、热力图  3、自定义
      scatterBorder: 0, // 散点边框大小
      scatterIcon: 'circle', // 散点图标
      dataMappingField: 'type', // 数据映射字段
      enableShowLabel: true,
      labelColor: '#ffffff',
      labelSize: 12,
      labelPosition: 'right', // 右边
      labelShowType: 1, // 1、显示名称 2、显示值
      scatterConfig: [
        {
          'fieldValue': '1',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(255, 140, 0, 1)',
          'scatterHighlightColor': 'rgba(255, 215, 0, 1)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        },
        {
          'fieldValue': '2',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(0, 186, 189, 1)',
          'scatterHighlightColor': 'rgba(31, 147, 255, 0.73)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        },
        {
          'fieldValue': '3',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(255, 0, 234, 1)',
          'scatterHighlightColor': 'rgba(179, 73, 193, 1)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        },
        {
          'fieldValue': '4',
          'scatterSize': 15,
          'scatterHighlightSize': 15,
          'scatterColor': 'rgba(20, 234, 45, 1)',
          'scatterHighlightColor': 'rgba(52, 220, 105, 1)',
          'scatterBorderColor': '',
          'scatterBorderHighlight': ''
        }
      ], // 散点图点样式配置集合
      pointSize: 100, // 权重最大值
      dotBlurSize: 15, // 半径大小
      hotDataColor: [], // 热力图颜色

      minPellucidity: 20, // 最小透明度
      maxPellucidity: 100, // 最大透明度

      imageWidth: 32, //  图片宽度
      imageHeight: 32, // 图片高度
      customDataMappingField: 'type', // 数据映射字段
      customDisplay: [], // 自定义展示
      // tooltip配置
      showInfoType: 2, // 悬浮类型
      customTipInfo: '{name}类型是{type}', // 自定义悬浮类型信息
      infoConfig: [{name: 'name', value: '名称'}], // 自定义悬浮信息
      // 交互设置
      enableMouseover: false, // 启用鼠标移入
      overBulletWidth: 600, // 悬浮时的弹框宽度
      overBulletHeight: 400, // 悬浮时的弹框高度
      overBulletUrl: '', // 悬浮时的弹框地址
      enableMouseClick: false, // 启用鼠标点击
      interactionMode: 1, // 交互方式
      clickBulletWidth: 600, // 点击时的弹框宽度
      clickBulletHeight: 400, // 点击时的弹框高度
      clickBulletUrl: '', // 点击时的弹框地址
      url: '', // 跳转地址
      enableOpenNewWindow: true, // 新弹窗
      updateChart: [], // 关联的组件
      paramsFieldsConfig: [], // 给关联的组件传参数
      areaCallbackField: '', // 地图区域回调字段
      dataCallbackFieldConfig: [], // 地图数据回调字段
      dataEndField: '', // 地图结束标识
      geoJsonConfig: [], // 文件关联
      fetchGeoJsonType: 1 // 1区域编码 2.geoJson url地址
    },
    dataConfig: {
      staticValue: '[{"name": "海门","type": 1, "value": 9, "lon": 121.15, "lat": 31.89 }, {"name": "鄂尔多斯","type": 1, "lon": 109.781327, "lat": 39.608266, "value": 12}, {"name": "招远","type": 2, "lon": 120.38, "lat": 37.35, "value": 12 }, {"name": "舟山","type": 3,  "lon": 122.207216, "lat": 29.985295,  "value": 12 }, {"name": "齐齐哈尔","type": 2, "lon": 123.97, "lat": 47.33, "value": 14 }, {"name": "盐城","type": 1,"lon": 120.13, "lat": 33.38, "value": 15}, {"name": "赤峰","type": 1, "lon": 118.87, "lat": 42.28, "value": 16}, {"name": "青岛","type": 2, "lon": 120.33, "lat":36.07, "value":18}, {"name": "廊坊","type": 3, "lon": 116.7, "lat":39.53, "value": 193}]' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  },
  InfoPresentation: {
    componentName: 'InfoPresentation',
    thumbnail: require('@/assets/config/npm.svg'),
    name: '信息展示',
    width: 800,
    height: 600,
    minHeight: 50,
    minWidth: 50,
    left: 0,
    top: 0,
    isShow: true, // 是否显示，用于图层控制组件显示与否
    isLock: false, // 是否锁定
    dataType: 1, // 2：接口获取；3：SQL获取
    stylesObj: {
      // 布局
      labelPosition: 'left', // 对齐方式, left, right, top
      labelWidth: 80, // 标签宽度
      // 字段配置
      labelConfig: [{
        col: 12,
        field: 'name',
        labelName: '地区名称',
        labelDefaultName: '北京',
        labelFontFamily: 'Arial,苹方,微软雅黑', //标签字体
        labelFontWeight: 'normal', //标签文字粗细
        labelFontSize: 16, // 标签文字大小
        labelColor: '#FFF', // 标签文字颜色
        isEllipsis: true, // 默认开启省略
        isApplyToPictures: false, // 是否应用于图片
        imgWidth: 50, // 图片宽度
        imgHeight: 50, // 图片高度
        isNeedBg: false, // 是否需要背景色
        bgColor: 'rgba(31, 147, 255, 0.73)', // 背景色
        borderRadius: 5 // 背景倒角
      },
      {
        col: 12, // 比例， 24 = 1：1； 12 = 1:2; 8 = 1:3; 6 = 1:4;
        field: 'areaCode', // 字段名称
        labelName: '行政编码', // 标签名称
        labelDefaultName: '110000', // 字段值为空时显示的内容
        labelFontFamily: 'Arial,苹方,微软雅黑', //标签字体
        labelFontWeight: 'normal', //标签文字粗细
        labelFontSize: 16, // 标签文字大小
        labelColor: '#FFF', // 标签文字颜色
        isEllipsis: true, // 默认开启省略
        isApplyToPictures: false, // 是否应用于图片
        imgWidth: 50, // 图片宽度
        imgHeight: 50, // 图片高度
        isNeedBg: false, // 是否需要背景色
        bgColor: '', // 背景色
        borderRadius: 5 // 背景倒角
      }],
      zIndex: 1
    },
    dataConfig: {
      staticValue: '{"name":"北京","areaCode":"110000"}' // 静态值
    },
    apiDataConfig: {
      ...apiDataConfig
    },
    SqlDataConfig: {
      ...SqlDataConfig
    }
  }
}
// 控件分组配置
export const configGroup = [
  {name: '基础', id: 1, baseType: 1, icon: 'icon-jichu'},
  {name: '图表', id: 2, baseType: 2, icon: 'icon-tubiao'},
  {name: '地图', id: 3, baseType: 3, icon: 'icon-ditu'},
  {name: '高级', id: 4, baseType: 4, icon: 'icon-gaoji'},
  {name: '辅助', id: 5, baseType: 5, icon: 'icon-gaoji'}
]

// 允许导出图片的组件
export const allowExportPictures = [
  'BasicPieChart', 'BasicBarChart', 'BasicLineChart', 'TransverseBarChart', 'CircleProgressBar', 'HorizontalProgressBar',
  'ColumnLineMix', 'Dashboard', 'RadarChart'
];

// 允许导出数据列表的组件
export const allowExportData = [...allowExportPictures, 'GeneralTable'];

// 允许导出汇总的组件
export const allowExportsummaryData = ['SingleLineText'];

// 组件配置
export const componentConfigs = [
  {
    name: '文本',
    componentName: 'SingleLineText',
    url: require('@/assets/config/text.svg'),
    relationId: 1 //  关联分组
  },
  {
    name: '图片',
    componentName: 'ImageBox',
    url: require('@/assets/config/image.svg'),
    relationId: 1
  },
  {
    name: '视频',
    componentName: 'Video',
    url: require('@/assets/config/video.svg'),
    relationId: 1
  },
  {
    name: '表格',
    componentName: 'GeneralTable',
    url: require('@/assets/config/list.svg'),
    relationId: 1
  },
  {
    name: '背景框',
    componentName: 'BackgroundBox',
    url: require('@/assets/config/bg.svg'),
    relationId: 1
  },
  {
    name: '线条',
    componentName: 'AuxiliaryLine',
    relationId: 5,
    url: require('@/assets/config/line.svg')
  },
  {
    name: '实时时间',
    componentName: 'RealTime',
    relationId: 5,
    url: require('@/assets/config/reallyTime.svg')
  },
  {
    name: '跑马灯',
    componentName: 'Marquee',
    relationId: 1,
    url: require('@/assets/config/marquee.svg')
  },
  {
    name: '基础饼图',
    componentName: 'BasicPieChart',
    relationId: 2,
    url: require('@/assets/config/pie.svg')
  },
  {
    name: '南丁格尔玫瑰图',
    componentName: 'RoseChart',
    relationId: 2,
    url: require('@/assets/config/rose.svg')
  },
  {
    name: '基础柱状图',
    componentName: 'BasicBarChart',
    relationId: 2,
    url: require('@/assets/config/bar.svg')
  },
  {
    name: '基础折线图',
    componentName: 'BasicLineChart',
    relationId: 2,
    url: require('@/assets/config/baseLine.svg')
  },
  {
    name: '横向柱状图',
    componentName: 'TransverseBarChart',
    relationId: 2,
    url: require('@/assets/config/transverseBarChart.svg')
  },
  {
    name: '环形进度条',
    componentName: 'CircleProgressBar',
    relationId: 2,
    url: require('@/assets/config/CircleProgressBar.svg')
  },
  {
    name: '横向进度条',
    componentName: 'HorizontalProgressBar',
    relationId: 2,
    url: require('@/assets/config/HorizontalProgressBar.svg')
  },
  {
    name: '柱线混合图',
    componentName: 'ColumnLineMix',
    relationId: 2,
    url: require('@/assets/config/lineChart.svg')
  },
  {
    name: '仪表盘',
    componentName: 'Dashboard',
    relationId: 2,
    url: require('@/assets/config/board.svg')
  },
  {
    name: '雷达图',
    componentName: 'RadarChart',
    relationId: 2,
    url: require('@/assets/config/radarChart.svg')
  },
  {
    name: '漏斗图',
    componentName: 'FunnelChart',
    relationId: 2,
    url: require('@/assets/config/fun.svg')
  },
  {
    name: '水球图',
    componentName: 'Liquidfill',
    relationId: 2,
    url: require('@/assets/config/Sankey.svg')
  },
  {
    name: '桑基图',
    componentName: 'Sankey',
    relationId: 2,
    url: require('@/assets/config/Liquidfill.svg')
  },
  {
    name: 'tab组件',
    componentName: 'TabComponent',
    relationId: 4,
    url: require('@/assets/config/Tab.svg')
  },
  {
    name: '时间过滤',
    componentName: 'TimeFiltering',
    relationId: 4,
    url: require('@/assets/config/timeFilter.svg')
  },
  {
    name: '下拉过滤',
    componentName: 'DropdownBox',
    relationId: 4,
    url: require('@/assets/config/select.svg')
  },
  {
    name: 'Canvas 绘图',
    componentName: 'CanvasDrawing',
    relationId: 4,
    url: require('@/assets/config/canvas.svg')
  },
  {
    name: '全屏缩放按钮',
    componentName: 'FullScreenBtn',
    relationId: 5,
    url: require('@/assets/config/fullscreen.svg')
  },
  {
    name: '数据切换',
    componentName: 'DataSwitching',
    relationId: 4,
    url: require('@/assets/config/dataswitch.svg')
  },
  {
    name: '弹窗关闭按钮',
    componentName: 'PopCloseButton',
    relationId: 5,
    url: require('@/assets/config/closeBtn.svg')
  },
  {
    name: '文档导出按钮',
    componentName: 'DocExportBtn',
    relationId: 5,
    url: require('@/assets/config/Export.svg')
  },
  {
    name: '基础地图',
    componentName: 'BasicMap',
    relationId: 3,
    url: require('@/assets/config/basicMap.svg')
  },
  {
    name: '全国省份地图',
    componentName: 'NationalProvinceMap',
    relationId: 3,
    url: require('@/assets/config/npm.svg')
  },
  {
    name: '信息展示',
    componentName: 'InfoPresentation',
    relationId: 1,
    url: require('@/assets/config/npm.svg')
  }
];

export const defaultChartColor = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#131E45'];

export const requestOptions = [{ // 请求方法类型设置
  label: 'GET',
  value: 1
}, {
  label: 'POST',
  value: 2
}]

// 文字位置
export const labelPosition = [
  {
    label: '顶部',
    value: 'top'
  }, {
    label: '左边',
    value: 'left'
  }, {
    label: '右边',
    value: 'right'
  }, {
    label: '底部',
    value: 'bottom'
  }, {
    label: '内部',
    value: 'inside'
  }, {
    label: '内左侧',
    value: 'insideLeft'
  }, {
    label: '内右侧',
    value: 'insideRight'
  }, {
    label: '内顶部',
    value: 'insideTop'
  }, {
    label: '内底部',
    value: 'insideBottom'
  },
  {
    label: '内左上方',
    value: 'insideTopLeft'
  },
  {
    label: '内左下方',
    value: 'insideBottomLeft'
  },
  {
    label: '内右上方',
    value: 'insideTopRight'
  },
  {
    label: '内右下方',
    value: 'insideBottomRight'
  }
];

// 线标记
export const symbolOptions = [
  {
    label: '无',
    value: 'none'
  },
  {
    label: '空心圆',
    value: 'emptyCircle'
  }, {
    label: '实心圆',
    value: 'circle'
  }, {
    label: '正方形',
    value: 'rect'
  }, {
    label: '三角形',
    value: 'triangle'
  }, {
    label: '菱形',
    value: 'diamond'
  }, {
    label: '气泡',
    value: 'pin'
  }, {
    label: '箭头',
    value: 'arrow'
  }
];

// 需要处理过滤条件的控件
export const NEED_FILTER_PARAMS = ['TabComponent'];

// 时间类型
export const TIME_TYPE = [
  // {
  //   label: '时间',
  //   value: 1
  // },
  {
    label: '时间日期',
    value: 3
  },
  {
    label: '日',
    value: 2
  }, {
    label: '周',
    value: 4
  }, {
    label: '月',
    value: 5
  }, {
    label: '年',
    value: 6
  }
];

// 线类型
export const Line_TYPE = [
  {
    label: '实线',
    value: 'solid'
  },
  {
    label: '虚线',
    value: 'dashed'
  }, {
    label: '点线',
    value: 'dotted'
  }
];

// 标线文本位置
export const MARK_LINE_LABEL_POS = [
  {
    label: '起始点',
    value: 'start'
  }, {
    label: '中点',
    value: 'middle'
  }, {
    label: '结束点',
    value: 'end'
  }, {
    label: '起始顶部',
    value: 'insideStartTop'
  }, {
    label: '起始底部',
    value: 'insideStartBottom'
  }, {
    label: '中间顶部',
    value: 'insideMiddleTop'
  }, {
    label: '中间底部',
    value: 'insideMiddleBottom'
  }, {
    label: '结束顶部',
    value: 'insideEndTop'
  }, {
    label: '结束底部',
    value: 'insideEndBottom'
  }
]

// 省份列表
export const PROVINCE_LIST = [
  {
    label: '北京',
    value: '110000'
  },
  {
    label: '天津市',
    value: '120000'
  },
  {
    label: '河北省',
    value: '130000'
  },
  {
    label: '山西省',
    value: '140000'
  },
  {
    label: '内蒙古自治区',
    value: '150000'
  },
  {
    label: '辽宁省',
    value: '210000'
  },
  {
    label: '吉林省',
    value: '220000'
  },
  {
    label: '黑龙江省',
    value: '230000'
  },
  {
    label: '上海市',
    value: '310000'
  },
  {
    label: '江苏省',
    value: '320000'
  },
  {
    label: '浙江省',
    value: '330000'
  },
  {
    label: '安徽省',
    value: '340000'
  },
  {
    label: '福建省',
    value: '350000'
  },
  {
    label: '江西省',
    value: '360000'
  },
  {
    label: '山东省',
    value: '370000'
  },
  {
    label: '河南省',
    value: '410000'
  },
  {
    label: '湖北省',
    value: '420000'
  },
  {
    label: '湖南省',
    value: '430000'
  },
  {
    label: '广东省',
    value: '440000'
  },
  {
    label: '广西壮族自治区',
    value: '450000'
  },
  {
    label: '海南省',
    value: '460000'
  },
  {
    label: '重庆市',
    value: '500000'
  },
  {
    label: '四川省',
    value: '510000'
  },
  {
    label: '贵州省',
    value: '520000'
  },
  {
    label: '云南省',
    value: '530000'
  },
  {
    label: '西藏自治区',
    value: '540000'
  },
  {
    label: '陕西省',
    value: '610000'
  },
  {
    label: '甘肃省',
    value: '620000'
  },
  {
    label: '青海省',
    value: '630000'
  },
  {
    label: '宁夏回族自治区',
    value: '640000'
  },
  {
    label: '新疆维吾尔自治区',
    value: '650000'
  },
  {
    label: '香港特别行政区',
    value: '810000'
  },
  {
    label: '澳门特别行政区',
    value: '820000'
  },
  {
    label: '台湾省',
    value: null
  }
]

// 城市列表
export const CITY_LIST = [
  {
    label: '北京市',
    value: '110100'
  },
  {
    label: '天津市',
    value: '120100'
  },
  {
    label: '河北省-石家庄市',
    value: '130100'
  },
  {
    label: '山西省-太原市',
    value: '140100'
  },
  {
    label: '内蒙古自治区-呼和浩特市',
    value: '150100'
  },
  {
    label: '辽宁省-沈阳市',
    value: '210100'
  },
  {
    label: '吉林省-长春市',
    value: '220100'
  },
  {
    label: '黑龙江省-哈尔滨市',
    value: '230100'
  },
  {
    label: '上海市',
    value: '310100'
  },
  {
    label: '江苏省-南京市',
    value: '320100'
  },
  {
    label: '浙江省-杭州市',
    value: '330100'
  },
  {
    label: '浙江省-宁波市',
    value: '330200'
  },
  {
    label: '浙江省-温州市',
    value: '330300'
  },
  {
    label: '浙江省-金华市',
    value: '330700'
  },
  {
    label: '安徽省-合肥市',
    value: '340100'
  },
  {
    label: '福建省-福州市',
    value: '350100'
  },
  {
    label: '江西省-南昌市',
    value: '360100'
  },
  {
    label: '山东省-济南市',
    value: '370100'
  },
  {
    label: '河南省-郑州市',
    value: '410100'
  },
  {
    label: '湖北省-武汉市',
    value: '420100'
  },
  {
    label: '湖南省-长沙市',
    value: '430100'
  },
  {
    label: '广东省-广州市',
    value: '440100'
  },
  {
    label: '广西壮族自治区-南宁市',
    value: '450100'
  },
  {
    label: '海南省-海口市',
    value: '460100'
  },
  {
    label: '重庆市',
    value: '500100'
  },
  {
    label: '四川省-成都市',
    value: '510100'
  },
  {
    label: '贵州省-贵阳市',
    value: '520100'
  },
  {
    label: '云南省-昆明市',
    value: '530100'
  },
  {
    label: '西藏自治区-拉萨市',
    value: '540100'
  },
  {
    label: '陕西省-西安市',
    value: '610100'
  },
  {
    label: '甘肃省-兰州市',
    value: '620100'
  },
  {
    label: '青海省-西宁市',
    value: '630100'
  },
  {
    label: '宁夏回族自治区-银川市',
    value: '640100'
  },
  {
    label: '新疆维吾尔自治区-乌鲁木齐市',
    value: '650100'
  },
  {
    label: '香港特别行政区',
    value: '810000'
  },
  {
    label: '澳门特别行政区',
    value: '820000'
  },
  {
    label: '台湾省',
    value: null
  }
]
