<template>
  <section class="configSidebar">
    <el-button-group class="configSidebar__tab">
      <apiot-button
          class="configSidebar__tab--item"
          :class="[{ active: curType === 1 }]"
          @click="curType = 1"
      >组件库
      </apiot-button>
      <apiot-button
          class="configSidebar__tab--item"
          :class="[{ active: curType === 2 }]"
          @click="curType = 2"
      >图层
      </apiot-button>
    </el-button-group>
    <div class="configSidebar__wrapper">
      <div class="configSidebar__tabArea" v-show="curType === 1">
        <ul
            class="configSidebar__comp"
            v-for="(group, index) in areaArr"
            :key="index + 1000"
        >
          <li class="configSidebar__comp--group">
            <h1
                class="triangle"
                :class="`${group.isClose ? '' : 'open'}`"
                @click="group.isClose = !group.isClose"
            >
              {{ group.name }}
            </h1>
            <draggable
                v-show="!group.isClose"
                v-model="group.children"
                v-bind="{
                group: { name: 'area', pull: 'clone' },
                sort: false,
              }"
                animation="300"
                @end="dragAreaEnd($event, index, areaArr)"
            >
              <transition-group class="configSidebar__comp--compList" tag="ul">
          <li
              class="configSidebar__comp--compItem"
              v-for="(comp, index) in getAreaArr(group.children)"
              :key="index + 3232"
          >
            <img
                v-if="comp.imgUrl"
                :src="require(`@/assets/img/${comp.imgUrl}`)"
            />
            <p>{{ comp.name }}</p>
          </li>
          </transition-group>
          </draggable>
          </li>
        </ul>
        <ul
            class="configSidebar__comp"
            v-for="(group, index) in compArr"
            :key="index + 123"
        >
          <li class="configSidebar__comp--group">
            <h1
                class="triangle"
                :class="`${group.isClose ? '' : 'open'}`"
                @click="group.isClose = !group.isClose"
            >
              {{ group.name }}
            </h1>
            <draggable
                v-show="!group.isClose"
                v-model="group.children"
                v-bind="{
                group: { name: 'comp', pull: 'clone' },
                sort: false,
              }"
                dragType="comp"
                animation="300"
                @end="dragAreaEnd($event, index, compArr)"
            >
              <transition-group class="configSidebar__comp--compList" tag="ul">
          <li
              class="configSidebar__comp--compItem"
              :class="[{ btnBox: comp.areaType === 2 }]"
              v-for="(comp, index) in getAreaArr(group.children)"
              :key="index + 1234"
          >
            <img
                v-if="comp.imgUrl"
                :src="require(`@/assets/img/${comp.imgUrl}`)"
            />
            <p>{{ comp.name }}</p>
          </li>
          </transition-group>
          </draggable>
          </li>
        </ul>
        <ul
            class="configSidebar__comp"
            v-for="(group, index) in busArr"
            :key="index + 2000"
        >
          <li class="configSidebar__comp--group">
            <h1
                class="triangle"
                :class="`${group.isClose ? '' : 'open'}`"
                @click="group.isClose = !group.isClose"
            >
              {{ group.name }}
            </h1>
            <draggable
                v-show="!group.isClose"
                v-model="group.children"
                v-bind="{
                group: { name: 'area', pull: 'clone' },
                sort: false,
              }"
                animation="300"
                :move="move"
                @end="dragAreaEnd($event, index, busArr)"
            >
              <transition-group class="configSidebar__comp--compList" tag="ul">
          <li
              class="configSidebar__comp--compItem"
              :class="[{ btnBox: comp.areaType === 2 }]"
              v-for="comp in getAreaArr(group.children)"
              :key="comp.componentName"
          >
            <img
                v-if="comp.imgUrl"
                :src="require(`@/assets/img/${comp.imgUrl}`)"
            />
            <p>{{ comp.name }}</p>
          </li>
          </transition-group>
          </draggable>
          </li>
        </ul>
      </div>
      <div class="configSidebar__tabArea" v-show="curType === 2">
        <ZoomCenter v-bind="$attrs" v-on="$listeners"></ZoomCenter>
      </div>
    </div>
  </section>
</template>

<script>
import { createUnique } from '@/utils/utils';
import ZoomCenter from '../ZoomCenter/index';

const SqlDataConfig = {
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
};

const bulletCommonConfig = {
  interactionMode: 1, // 交互方式 1、没有 2、弹框 3、跳转链接 4、下载
  // bulletType: 1, // 1、默认弹框  2、自定义弹框位置 3、 随鼠标位置
  bulletConfig: {}, // 弹框地址
  toMenuConfig: {}, // 跳菜单配置
};

export const tabStylesConfig = {
  cFontFamily: '微软雅黑', // 未激活状态字体
  cFontWeight: 'normal', // 未激活状态文字粗细
  cFontSize: 16, // 未激活状态文字大小
  cPaddingTopAndBottom: 10, // 未激活状态上下内边距
  cPaddingRightAndLeft: 10, // 未激活状态左右内边距
  cColor: '#333', // 未激活状态左右内边距
  cHoverColor: '#4689F5', // 未激活状态左右内边距
  cBgUrl: '', // 背景图片
  cHoverBgUrl: '', // 悬浮时的背景图片
  cBgColor: '#fff', // 背景颜色
  cHoverBgColor: '#fff', // 悬浮时的背景颜色
  borderWidth: 1, // 边框大小
  borderColor: '#fff', // 边框颜色
  borderRadius: 0 // 边框倒角
};

export const infoComForEdit = { // 允许编辑时的属性
  editRows: 2, // 输入框行数
  editBorderRadius: 0, // 倒角
  editBorderColor: '', // 边框颜色
  editHoverBorderColor: '', // 悬浮边框颜色
  editBgColor: '', // 背景颜色
  editColor: '', // 字体颜色
  editFontSize: 14, // 字体大小
  editFontFamily: 'Arial', // 字体
  editFontWeight: 'normal' // 字体加粗
};

export default {
  props: {},
  data() {
    return {
      curType: 1,
      showTree: true,
      btnAreaIds: [2],
      areaArr: [
        {
          name: '系统组件',
          isClose: false,
          children: [
            // {
            //   name: '日志',
            //   imgUrl: 'homePage/journal.svg'
            // },
            {
              name: '审批',
              imgUrl: 'homePage/Approval.svg',
              componentName: 'ApprovalCom',
              width: 200,
              height: 30,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              content: '审批组件',
              gradientType: 1, // 渐变色类型
              enableBackground: false,
              enableEllipsis: true,
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              stylesObj: {
                fontFamily: '微软雅黑',
                textAlign: 'center',
                fontSize: 24,
                color1: 'rgba(51, 51, 51, 1)',
                color2: null,
                fontWeight: 'bold',
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
                borderStyle: 'solid',
                flowGroups: [], // 流程分支集合ids
                flowType: 'LeaveItToMe', // 流程类型， 固定 待我处理，我参与的，我发起的，抄送给我
              },
              SqlDataConfig: {
                ...SqlDataConfig
              },
            },
            {
              name: '通知',
              imgUrl: 'homePage/notify.svg'
            },
            {
              name: '公告',
              imgUrl: 'homePage/Notice.svg',
              componentName: 'Notice',
              clientType: 1,
              width: 600,
              height: 400,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              content: '公告',
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              stylesObj: {
                dataShowType: 2, // 1, 全部， 2， 分组
                titleFontFamily: 'Arial,苹方,微软雅黑',
                titleFontSize: 16,
                titleColor: '#333333',
                titleFontWeight: 'normal',
                titleHeight: 40,
                contentFontFamily: 'Arial,苹方,微软雅黑',
                contentFontSize: 13,
                contentColor: '#333333',
                contentFontWeight: 'normal',
                colHeight: 36,
                zIndex: 1,
                animationSet: 1, // 动画
              },
            },
            {
              name: '日历',
              imgUrl: 'homePage/calendar.svg'
            },
            // {
            //   name: '欢迎',
            //   imgUrl: 'homePage/welcome.svg'
            // },
            {
              name: '天气',
              imgUrl: 'homePage/weather.svg'
            }
          ]
        }
      ],
      compArr: [
        {
          name: '基础组件',
          isClose: false,
          children: [
            {
              name: '文本',
              imgUrl: 'homePage/text.svg',
              componentName: 'SingleLineTextHome',
              width: 200,
              height: 30,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              content: '单行文本组件',
              gradientType: 1, // 渐变色类型
              enableBackground: false,
              enableEllipsis: true,
              interactionType: 1, // 交互
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              stylesObj: {
                fontFamily: 'Arial,苹方,微软雅黑',
                textAlign: 'center',
                fontSize: 16,
                color1: 'rgba(51, 51, 51, 1)',
                color2: null,
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
                borderStyle: 'solid',
                externalUrl: ''
              },
              dataConfig: {
                staticValue: '{"text":"文本组件","value":"文本组件2"}', // 静态值
                takeEffect: 'text' // 生效字段
              },
              SqlDataConfig: {
                ...SqlDataConfig
              },
              panelConfig: {}, // 跳转面板配置
              skipMenuConfig: [], // 跳菜单配置
            },
            {
              name: '图片',
              imgUrl: 'homePage/picture.svg',
              componentName: 'ImageBox',
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
              stylesObj: {
                backgroundImage: '',
                opacity: 1,
                rotationAngle: 0,
                zIndex: 1
              }
            },
            {
              name: '表格',
              imgUrl: 'homePage/list.svg',
              componentName: 'GeneralTable',
              width: 800,
              height: 300,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              enableLinesHighlighted: false, // 启用高亮
              enableHeader: true, // 是否启用表头
              enableSno: false, // 是否启用序号
              stylesObj: {
                zIndex: 1,
                rows: 6, // 列表行数
                loop: true, // 是否轮播
                animationTypes: 2, // 动画类型
                loopTime: 3, // 轮播间隔时间
                autoHighlight: true, // 依次高亮
                speHighlight: '3,4', // 指定第几行数高亮
                highlightFontFamily: '微软雅黑', // 图例字体
                highlightFontWeight: 'normal', // 图例文字粗细
                highlightFontSize: 12, // 图例文字大小
                highlightColor: 'rgba(51, 51, 51, 1)', // 图例字体颜色
                highlightBgColor: 'rgba(232, 240, 248, 1)', // 高亮背景色
                snoFontFamily: '微软雅黑', // 序号字体
                snoFontWeight: 'normal', // 序号文字粗细
                snoFontSize: 12, // 序号文字大小
                snoColor: 'rgba(51, 51, 51, 1)', // 序号字体颜色
                theadHeight: 18, // 表头高度
                theadBgColor: 'rgba(243, 244, 251, 1)', // 表头背景色
                theadFontFamily: '微软雅黑', // 表头字体
                theadFontWeight: 'normal', // 表头文字粗细
                theadFontSize: 15, // 表头文字大小
                theadColor: 'rgba(51, 51, 51, 1)', // 表头字体颜色
                theadTextAlign: 'center', // 表头字体对齐方式
                oddBgColor: 'rgba(255, 255, 255, 1)', // 奇数行背景色
                evenBgColor: 'rgba(249, 249, 254, 1)' // 偶数行背景色
              },
              columnConfig: [
                {
                  index: 0,
                  title: '列1',
                  field: 'name',
                  fieldWidth: 100,
                  fieldName: '地区编码',
                  fieldFontFamily: '微软雅黑',
                  fieldFontWeight: 'normal',
                  fieldFontSize: 14,
                  fieldColor: 'rgba(51, 51, 51, 1)',
                  fieldBgColor: '',
                  isEllipsis: true,
                  fieldTextAlign: 'center',
                  fieldPrefix: '', // 文字前缀
                  fieldPrefixWidth: 20, // 文字前缀宽度
                  fieldPrefixHeight: 20, // 文字前缀高度
                  enableConditions: false, // 是否启用字段条件
                  fieldRelColor: '#fff', // 配置了启用条件及条件满足，则该字段生效
                  fieldRelBgColor: '', // 配置了启用条件及条件满足，则该字段生效
                  isApplyPicture: false, // 是否应用与图片
                  conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
                  ...bulletCommonConfig, // 弹框或者url跳转配置
                  callbackFields: '' // 回调字段集合
                },
                {
                  index: 1,
                  title: '列2',
                  field: 'area',
                  fieldWidth: 100,
                  fieldName: '名称',
                  fieldFontFamily: '微软雅黑',
                  fieldFontWeight: 'normal',
                  fieldFontSize: 14,
                  fieldColor: 'rgba(51, 51, 51, 1)',
                  fieldTextAlign: 'center',
                  fieldPrefix: '',
                  isEllipsis: true,
                  isApplyPicture: false, // 是否应用与图片
                  enableConditions: false, // 是否启用字段条件
                  fieldRelColor: '#fff', // 配置了启用条件及条件满足，则该字段生效
                  conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
                  ...bulletCommonConfig, // 弹框或者url跳转配置
                  callbackFields: '' // 回调字段集合
                },
                {
                  index: 2,
                  title: '列3',
                  field: 'state',
                  fieldWidth: 100,
                  fieldName: '状态',
                  fieldFontFamily: '微软雅黑',
                  fieldFontWeight: 'normal',
                  fieldFontSize: 14,
                  fieldColor: 'rgba(51, 51, 51, 1)',
                  fieldTextAlign: 'center',
                  fieldPrefix: '',
                  isEllipsis: true,
                  isApplyPicture: false, // 是否应用与图片
                  enableConditions: false, // 是否启用字段条件
                  fieldRelColor: '#fff', // 配置了启用条件及条件满足，则该字段生效
                  conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
                  ...bulletCommonConfig, // 弹框或者url跳转配置
                  callbackFields: '' // 回调字段集合
                },
                {
                  index: 3,
                  title: '列4',
                  field: 'type',
                  fieldWidth: 100,
                  fieldName: '类型',
                  fieldFontFamily: '微软雅黑',
                  fieldFontWeight: 'normal',
                  fieldFontSize: 14,
                  fieldColor: 'rgba(51, 51, 51, 1)',
                  fieldTextAlign: 'center',
                  fieldPrefix: '',
                  isEllipsis: true,
                  isApplyPicture: false, // 是否应用与图片
                  enableConditions: false, // 是否启用字段条件
                  fieldRelColor: '#fff', // 配置了启用条件及条件满足，则该字段生效
                  conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
                  ...bulletCommonConfig, // 弹框或者url跳转配置
                  callbackFields: '' // 回调字段集合
                }
              ], // 自定义列表配置
              dataConfig: {
                staticValue: '[{"name":"310000","area":"上海", "state": "市", "type": "直辖市"},{"name":"330100","area":"杭州市", "state": "市", "type": "省会"},{"name":"350200","area":"厦门市", "state": "市", "type": "地级市"},{"name":"110000","area":"北京", "state": "市", "type": "首都"},{"name":"320100","area":"南京市","state": "市", "type": "省会"},{"name":"360100","area":"广州市","state": "市", "type": "省会"},{"name":"430100","area":"长沙市","state": "市", "type": "省会"},{"name":"420100","area":"武汉市","state": "市", "type": "省会"},{"name":"510100","area":"成都市","state": "市", "type": "省会"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              name: '背景框',
              imgUrl: 'homePage/backgroundBox.svg',
              componentName: 'BackgroundBox',
              width: 400,
              height: 140,
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
              enableShadows: true, // 是否启用阴影
              stylesObj: {
                backgroundImage: '',
                borderRadius: 8,
                color1: 'rgba(229, 240, 255, 1)',
                color2: '',
                opacity: 1,
                zIndex: 1,
                borderColor: '#4689F5',
                borderWidth: 0,
                borderStyle: 'solid',
                rotationAngle: 0,
                xShadow: 0, // 水平阴影
                yShadow: 0, // 垂直阴影
                shadowDistance: 0, // 阴影距离
                blurRadius: 4, // 模糊半径
                shadowColor: 'rgba(0,0,0,.16)', // 阴影颜色
              }
            },
            {
              name: '实时时间',
              componentName: 'RealTime',
              imgUrl: 'homePage/realTime.svg',
              width: 300,
              height: 30,
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
                FontFamily: '微软雅黑',
                FontSize: 18,
                Color: 'rgba(51, 51, 51, 1)',
                FontWeight: 'bold',
                zIndex: 1,
                showType: 'YYYY-MM-DD HH:mm:ss'
              }
            },
            {
              name: '线条',
              componentName: 'AuxiliaryLine',
              imgUrl: 'homePage/homeLine.svg',
              width: 800,
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
                lineStyleType: 'solid',
                opacity: 100,
                rotationAngle: 0,
                height: 1,
                color: 'rgba(227, 227, 227, 1)',
                color1: '#43DBFF',
                zIndex: 1
              }
            },
            { // 视频
              componentName: 'Video',
              imgUrl: 'homePage/VideoCom.svg',
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
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'InfoPresentation',
              imgUrl: 'homePage/homeLine.svg',
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
                  ...infoComForEdit,
                  col: 12,
                  field: 'name',
                  labelName: '地区名称',
                  labelDefaultName: '北京',
                  labelFontFamily: 'Arial,苹方,微软雅黑', // 标签字体
                  labelFontWeight: 'normal', // 标签文字粗细
                  labelFontSize: 16, // 标签文字大小
                  labelColor: '#333333', // 标签文字颜色
                  isEllipsis: true, // 默认开启省略
                  isEdit: false, // 默认不开起编辑
                  isVisible: true, // 默认显示
                  isApplyToPictures: false, // 是否应用于图片
                  imgWidth: 50, // 图片宽度
                  imgHeight: 50, // 图片高度
                  isNeedBg: false, // 是否需要背景色
                  bgColor: 'rgba(31, 147, 255, 0.73)', // 背景色
                  borderRadius: 5 // 背景倒角
                },
                  {
                    ...infoComForEdit,
                    col: 12, // 比例， 24 = 1：1； 12 = 1:2; 8 = 1:3; 6 = 1:4;
                    field: 'areaCode', // 字段名称
                    labelName: '行政编码', // 标签名称
                    labelDefaultName: '110000', // 字段值为空时显示的内容
                    labelFontFamily: 'Arial,苹方,微软雅黑', // 标签字体
                    labelFontWeight: 'normal', // 标签文字粗细
                    labelFontSize: 16, // 标签文字大小
                    labelColor: '#333333', // 标签文字颜色
                    isEllipsis: true, // 默认开启省略
                    isEdit: false, // 默认不开起编辑
                    isVisible: true, // 默认显示
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
              SqlDataConfig: {
                ...SqlDataConfig
              }
            }

          ]
        }
      ],
      busArr: [
        {
          name: '图表组件',
          isClose: false,
          children: [
            {
              name: '基础饼图',
              imgUrl: 'homePage/pieChart.svg',
              componentName: 'BasicPieChart',
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
              interactionType: 1, // 1无2面板3菜单4下钻
              stylesObj: {
                zIndex: 1,
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: 'rgba(128, 128, 128, 1)', // 图例字体颜色
                legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
                labelPosition: 'none', // 标注位置，内部外部
                labelColor: 'rgba(255, 255, 255, 0.7)', // 标注字体颜色
                labelShowType: 'type', // 标注显示值
                labelValueType: 1, // 标注值类型
                labelFontSize: 12, // 图例文字大小
                labelFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
                labelFontWeight: 'normal', // 图例文字粗细
                outerCircle: 70, // 外圆半径
                InnerCircle: 40, // 内圆半径
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 1)',
                  c2: null
                }, {
                  c1: 'rgba(252, 130, 86, 1)',
                  c2: null
                }, {
                  c1: 'rgba(138, 90, 237, 1)',
                  c2: null
                }, {
                  c1: 'rgba(14, 190, 196, 1)',
                  c2: null
                }, {
                  c1: 'rgba(90, 128, 237, 1)',
                  c2: null
                }, {
                  c1: 'rgba(250, 183, 28, 1)',
                  c2: null
                }] // 扇形区域颜色
              },
              dataConfig: {
                staticValue:
                    '[{"value":1048,"name":"类型一"},{"value":735,"name":"类型二"},{"value":580,"name":"类型三"},{"value":680,"name":"类型四"},{"value":430,"name":"类型五"},{"value":630,"name":"类型六"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              },
              panelConfig: {}, // 跳转面板配置
              skipMenuConfig: [], // 跳菜单配置
              drillDownConfig: {
                drillDownField: [], // 下钻回调字段
                pathColor: '#666666', // 路径颜色
                tripStopField: '', // 下钻停止字段
                tripStopFieldValue: '', // 下钻停止字段值
              }, // 下钻配置
            },
            {
              componentName: 'BasicBarChart',
              imgUrl: 'homePage/barChart.svg',
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
              enableLabel: false, // 是否启用标注
              enableGrid: false, // 是否启用容器布局
              enableXAxis: true, // 启用x轴样式
              enableYAxis: true, // 启用y轴样式
              enableData: false, // 启用海量数据
              dimension: 'x', // 默认以x字段作为x轴为主，也可以用s字段作为x轴
              interactionType: 1, // 交互 1、无；2、跳面板；3、菜单；4、下钻
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
                borderRadius: 4, // 柱子顶部倒角
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: 'rgba(128, 128, 128, 1)', // 图例字体颜色
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                XLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                XDataType: 'category', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 14, // x轴文字大小
                XColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: 'rgba(128, 128, 128, 1)', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                YLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                YDataType: 'value',
                YName: '', // X轴 标题名称
                YFontFamily: '微软雅黑', // x轴字体
                YFontWeight: 'normal', // x轴文字粗细
                YFontSize: 14, // x轴文字大小
                YColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                YTickEnable: false, // x轴刻度
                YTickColor: '#808080', // x轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // x轴字体
                YTickLabelFontWeight: 'normal', // x轴文字粗细
                YTickLabelFontSize: 12, // x轴文字大小
                YTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                colorArr: [
                  {
                    c1: 'rgba(238, 94, 94, 0.3)',
                    c2: 'rgba(238, 94, 94, 1)'
                  },
                  {
                    c1: 'rgba(90, 128, 237, 0.3)',
                    c2: 'rgba(90, 128, 237, 1)'
                  }
                ] // 区域颜色
              },
              dataConfig: {
                staticValue: '[{"x":"项目一","y":98,"s":"系列一"},{"x":"项目二","y":86,"s":"系列一"},{"x":"项目三","y":90,"s":"系列一"},{"x":"项目一","y":91,"s":"系列二"},{"x":"项目二","y":97,"s":"系列二"},{"x":"项目三","y":95,"s":"系列二"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              },
              panelConfig: {}, // 跳转面板配置
              skipMenuConfig: [], // 跳菜单配置
              drillDownConfig: {
                drillDownField: [], // 下钻回调字段
                pathColor: '#666666', // 路径颜色
                tripStopField: '', // 下钻停止字段
                tripStopFieldValue: '', // 下钻停止字段值
              }, // 下钻配置
            },
            {
              componentName: 'BasicLineChart',
              imgUrl: 'homePage/lineChart.svg',
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
              enableFullArea: true, // 是否填充折线区域
              stylesObj: {
                zIndex: 1,
                gridLeft: 30, // 距离容器左边
                gridTop: 30, // 距离容器顶部
                gridRight: 30, // 距离容器右边
                gridBottom: 30, // 距离容器底部
                groupDisplay: 'curve', // 柱状图分组展示， normal， curve，trapezoid
                lineStyleType: 'solid', // 折线类型，solid = 实线； 虚线=dashed；点线=dotted
                lineWidth: 3, // 线粗细
                symbolSize: 3, // 线标记大小
                symbol: 'none', // 线标记
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: '#808080', // 图例字体颜色
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                XLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                XDataType: 'category', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 14, // x轴文字大小
                XColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                YLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                YDataType: 'value',
                YName: '', // X轴 标题名称
                YFontFamily: '微软雅黑', // x轴字体
                YFontWeight: 'normal', // x轴文字粗细
                YFontSize: 14, // x轴文字大小
                YColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                YTickEnable: false, // x轴刻度
                YTickColor: '#808080', // x轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // x轴字体
                YTickLabelFontWeight: 'normal', // x轴文字粗细
                YTickLabelFontSize: 12, // x轴文字大小
                YTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 1)',
                  c2: 'rgba(238, 94, 94, 0)'
                }, {
                  c1: 'rgba(90, 128, 237, 1)',
                  c2: 'rgba(90, 128, 237, 0)'
                }], // 区域颜色
              },
              dataConfig: {
                staticValue: '[{"x":"周一","y":98,"s":"系列一"},{"x":"周二","y":86,"s":"系列一"},{"x":"周三","y":90,"s":"系列一"},{"x":"周四","y":48,"s":"系列一"},{"x":"周五","y":78,"s":"系列一"},{"x":"周一","y":91,"s":"系列二"},{"x":"周二","y":97,"s":"系列二"},{"x":"周三","y":95,"s":"系列二"},{"x":"周四","y":67,"s":"系列二"},{"x":"周五","y":69,"s":"系列二"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'CircleProgressBar',
              imgUrl: 'homePage/progressBar.svg',
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
              enableLegend: false, // 是否启用标题
              stylesObj: {
                zIndex: 1,
                legendName: '环形进度条', // 标题名称
                legendPosition: 'lt', // 标题位置
                legendFontFamily: '微软雅黑', // 标题字体
                legendFontWeight: 'normal', // 标题文字粗细
                legendFontSize: 24, // 标题文字大小
                legendColor: '#808080', // 标题字体颜色
                legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
                labelPosition: 1, // 显示内容， 1、默认；2、自定义1；3、自定义2
                labelColor: 'rgba(51, 51, 51, 1)', // 标注字体颜色
                labelFontSize: 24, // 文字大小
                labelFontFamily: '微软雅黑', // 字体
                labelFontWeight: 'bold', // 文字粗细
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
                outerCircle: 75, // 外圆半径
                InnerCircle: 50, // 内圆半径
                barColor: 'rgba(90, 128, 237, 1)', // 进度条颜色
                barBgColor: 'rgba(238, 244, 252, 1)', // 进度条背景色
                colorArr: [
                  {
                    c1: '#7381F8',
                    c2: '#7381F8'
                  },
                  {
                    c1: '#4689F5',
                    c2: '#4689F5'
                  },
                  {
                    c1: '#43DBFF',
                    c2: '#43DBFF'
                  }
                ] // 扇形区域颜色
              },
              dataConfig: {
                staticValue: '{"total": 100,"value":88}' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'TransverseBarChart',
              imgUrl: 'homePage/runwayMap.svg',
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
                barWidth: 20, // 柱子宽度
                borderRadius: 4, // 柱子顶部倒角
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: '#808080', // 图例字体颜色
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                XLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                XDataType: 'value', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 12, // x轴文字大小
                XColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                YLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                YDataType: 'category',
                YName: '', // X轴 标题名称
                YFontFamily: '微软雅黑', // x轴字体
                YFontWeight: 'normal', // x轴文字粗细
                YFontSize: 12, // x轴文字大小
                YColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                YTickEnable: false, // x轴刻度
                YTickColor: '#808080', // x轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // x轴字体
                YTickLabelFontWeight: 'normal', // x轴文字粗细
                YTickLabelFontSize: 12, // x轴文字大小
                YTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 0.3)',
                  c2: 'rgba(238, 94, 94, 1)'
                }, {
                  c1: 'rgba(90, 128, 237, 0.38)',
                  c2: 'rgba(90, 128, 237, 1)'
                }]// 区域颜色
              },
              dataConfig: {
                staticValue: '[{"x":"项目一","y":98,"s":"系列一"},{"x":"项目二","y":86,"s":"系列一"},{"x":"项目三","y":90,"s":"系列一"},{"x":"项目一","y":91,"s":"系列二"},{"x":"项目二","y":97,"s":"系列二"},{"x":"项目三","y":95,"s":"系列二"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'ColumnLineMix',
              imgUrl: 'homePage/columnLine.svg',
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
              enableLabel: false, // 柱状标注
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
                legendFontSize: 14, // 图例文字大小
                legendColor: '#808080', // 图例字体颜色
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 0.3)',
                  c2: 'rgba(238, 94, 94, 1)'
                }, {
                  c1: 'rgba(90, 128, 237, 0.32)',
                  c2: 'rgba(90, 128, 237, 1)'
                }, {
                  c1: 'rgba(14, 190, 196, 1)',
                  c2: null
                }], // 区域颜色
                XLineColor: 'rgba(227, 227, 227, 1)', // x轴轴颜色
                XDataType: 'category', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 12, // x轴文字大小
                XColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: 'rgba(102, 102, 102, 1)', // x轴字体颜色
                groupDisplay: 'curve', // 折线图展示， normal， curve，trapezoid
                lineStyleType: 'solid', // 折线类型，solid = 实线； 虚线=dashed；点线=dotted
                lineWidth: 3, // 线粗细
                symbolSize: 3, // 线标记大小
                symbol: 'none', // 线标记
                barGroupDisplay: 'group', // 柱状图分组展示， group， stack
                innerGroupSpace: 10, // 组内间距， 只有分组时才生效
                interGroupSpace: 20, // 组间间距， 柱子和其他柱子的间隔
                barWidth: 20, // 柱子宽度
                borderRadius: 4, // 柱子顶部倒角
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                labelBarField: 'y', // 标注字段
                labelBarPrefix: '', // 标注前缀
                labelBarSuffix: '', // 标注后缀
                labelBarFontFamily: '微软雅黑', // 标注字体
                labelBarFontWeight: 'normal', // 标注文字粗细
                labelBarFontSize: 12, // 标注文字大小
                labelBarColor: '#808080', // 标注字体颜色
                labelBarPosition: 'top', // 标注位置，顶部， 内部，底部
                YLineColor: 'rgba(227, 227, 227, 1)', // Y轴轴颜色
                YDataType: 'value',
                YName: '', // Y轴 标题名称
                YFontFamily: '微软雅黑', // Y轴字体
                YFontWeight: 'normal', // Y轴文字粗细
                YFontSize: 12, // Y轴文字大小
                YColor: 'rgba(102, 102, 102, 1)', // Y轴字体颜色
                YTickEnable: false, // Y轴刻度
                YTickColor: '#808080', // Y轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // Y轴字体
                YTickLabelFontWeight: 'normal', // Y轴文字粗细
                YTickLabelFontSize: 12, // Y轴文字大小
                YTickLabelColor: 'rgba(102, 102, 102, 1)', // Y轴字体颜色
                Y1LineColor: 'rgba(227, 227, 227, 1)', // Y轴轴颜色
                Y1DataType: 'value',
                Y1Name: '', // Y轴 标题名称
                Y1FontFamily: '微软雅黑', // Y轴字体
                Y1FontWeight: 'normal', // Y轴文字粗细
                Y1FontSize: 12, // Y轴文字大小
                Y1Color: 'rgba(102, 102, 102, 1)', // Y轴字体颜色
                Y1TickEnable: false, // Y轴刻度
                Y1TickColor: '#808080', // Y轴刻度颜色
                Y1TickLabelFontFamily: '微软雅黑', // Y轴字体
                Y1TickLabelFontWeight: 'normal', // Y轴文字粗细
                Y1TickLabelFontSize: 12, // Y轴文字大小
                Y1TickLabelColor: 'rgba(102, 102, 102, 1)' // Y轴字体颜色
              },
              dataConfig: {
                staticValue: '{"list":[{"name":"营业额","data":[4033,2340,2743,3903,5899,6382,8630],"yAxisIndex":0,"type":"bar"},{"name":"支出","data":[4233,4335,3424,6345,7542,4522,9654],"yAxisIndex":0,"type":"bar"},{"name":"盈利占比","data":[-4.72,-46.02,-19.89,-38.49,-25.89,41.13,10.6],"yAxisIndex":1,"type":"line"}],"xAxis":["周一","周二","周三","周四","周五","周六","周日"]}' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'Dashboard',
              imgUrl: 'homePage/dashboard.svg',
              name: '仪表盘',
              width: 500,
              height: 340,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              enableLegend: false, // 是否启用图例
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
                legendColor: '#808080', // 图例字体颜色
                startAngle: 180, // 起始角度
                endAngle: 0, // 结束角度
                radius: 90, // 仪表盘半价
                max: 180, // 刻度最大值
                min: 0, // 刻度最小值
                splitNumber: 5, // 刻度分割段数
                roundCap: true, // 两端启用圆角
                axisLineWidth: 25, // 轴线宽度
                axisLineColorConfig: [{
                  name: 1,
                  value: '#E6EBF8'
                }], // 轴线颜色
                progressRoundCap: true, // 进度条
                progressWidth: 25, // 进度条宽度
                progressColor: 'rgba(90, 128, 237, 1)', // 进度条颜色
                splitLineLength: 8, // 分割线长度
                splitLineDistance: 10, // 分割线离轴线的距离
                splitLineColor: 'rgba(227, 227, 227, 1)', // 分割线颜色
                splitLineWidth: 2, // 分割线宽度
                splitLineType: 'solid', // 分割线类型， 实现，虚线，点线
                axisTickSplitNumber: 5, // 分隔线之间分割的刻度数
                axisTickLength: 10, // 刻度线长
                axisTickDistance: 0, // 刻度线与轴线的距离
                axisTickColor: 'rgba(227, 227, 227, 1)', // 刻度线颜色
                axisTickWidth: 2, // 刻度线宽度
                axisTickType: 'solid', // 刻度线类型， 实现，虚线，点线
                axisLabelDistance: 10, // 标签与刻度线的距离
                axisLabelFontFamily: '微软雅黑', // 标签字体
                axisLabelFontWeight: 'normal', // 标签文字粗细
                axisLabelFontSize: 16, // 标签文字大小
                axisLabelColor: 'rgba(102, 102, 102, 1)', // 标签文字颜色
                icon: '', // 指针图标， 默认
                pointerLength: 60, // 指针长度
                pointerWidth: 5, // 指针宽度
                pointerColor: 'rgba(90, 128, 237, 1)', // 制作颜色
                anchorIcon: 'none', // 指针圆心图标， 默认
                anchorSize: 6, // 指针圆心大小
                anchorColor: 'rgba(128, 128, 128, 1)', // 指针圆心颜色
                horizontalOffset: 0, // 水平方向偏移
                verticalOffset: 35, // 垂直方向偏移
                detailFontFamily: '微软雅黑',
                detailFontWeight: 'bold',
                detailFontSize: 24,
                detailColor: 'rgba(51, 51, 51, 1)',
                detailPrefix: '', // 值前缀
                detailSuffix: '' // 值后缀
              },
              dataConfig: {
                staticValue: '{"value":80}' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'HorizontalProgressBar',
              imgUrl: 'homePage/HorizontalProgressBar.svg',
              name: '横向进度条',
              width: 500,
              height: 180,
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
                borderRadius: 4, // 柱子顶部倒角
                barBgColor: 'rgba(238, 244, 252, 1)', // 进度条背景色
                XFontFamily: '微软雅黑',
                XFontWeight: 'normal',
                XFontSize: 14,
                XColor: 'rgba(102, 102, 102, 1)',
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 14, // 标注文字大小
                labelColor: 'rgba(51, 51, 51, 1)', // 标注字体颜色
                labelPosition: 'insideRight', // 标注位置，顶部， 内部，底部
                labelOffset: 20, // 文字偏移
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 1)',
                  c2: null
                }, {
                  c1: 'rgba(14, 190, 196, 1)',
                  c2: null
                }, {
                  c1: 'rgba(250, 183, 28, 1)',
                  c2: null
                }], // 区域颜色
              },
              dataConfig: {
                staticValue: '[{"x":"新创建","y":98,"s": 100},{"x":"进行中","y":86,"s": 100},{"x":"已完成","y":90,"s":100}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'RadarChart',
              imgUrl: 'homePage/radarChart.svg',
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
              enableLegend: false, // 是否启用图例
              enableDimension: true, // 是否启用维度
              enableGlobalAxisLine: true, // 是否启用坐标轴轴线相关设置
              enableGlobalAxisTick: true, // 是否启用坐标轴刻度相关设置
              enableGlobalAxisLabel: false, // 是否显示坐标标签
              enableGlobalSplitLine: true, // 区域中的分隔线
              enableGlobalSplitArea: true, // 区域中的填充色
              stylesObj: {
                zIndex: 1,
                centerX: 50, // 水平中心点
                centerY: 50, // 垂直中心点
                radius: 75, // 雷达图半径
                nameGap: 15, // 指示器名称和指示器轴的距离。
                splitNumber: 6, // 指示器轴的分割段数。
                shape: 'polygon', // 雷达图绘制类型
                legendPosition: 'tr', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: 'rgba(128, 128, 128, 1)', // 图例字体颜色
                // legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
                // 轴线
                axisColor: 'rgba(227, 227, 227, 1)', // 坐标轴线颜色
                axisWidth: 1, // 坐标轴线线宽。
                axisType: 'solid', // 线的类型

                axisTickLength: 4, // 刻度长度
                axisTickColor: 'rgba(227, 227, 227, 1)', // 刻度颜色
                axisTickWidth: 0, // 刻度线宽。
                axisTickType: 'solid', // 线的类型

                axisLabelRotate: 0, // 标签旋转角度
                axisLabelMargin: 8, // 刻度标签与轴线之间的距离。
                axisLabelColor: '#fff', // 刻度标签文字的颜色
                axisLabelFontWeight: 'normal', // 文字字体的粗细
                axisLabelFontFamily: 'sans-serif', // 文字的字体系列
                axisLabelFontSize: 12, // 文字的字体大小。

                splitLineColor: [{
                  c1: '#fff',
                  c2: '#fff'
                }, {
                  c1: '#fff',
                  c2: '#fff'
                }], // 分割线颜色
                splitLineWidth: 1, // 分割线线宽。
                splitLineType: 'solid', // 分割线的类型

                axisNameColor: 'rgba(102, 102, 102, 1)', // 标注字体颜色
                axisNameFontSize: 12, // 图例文字大小
                axisNameFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
                axisNameFontWeight: 'normal', // 图例文字粗细
                dataField: 'type', // 维度数据字段
                colorArr: [{
                  c1: 'rgba(242, 244, 248, 1)'
                }, {
                  c1: 'rgba(255, 255, 255, 0.3)'
                }] // 区域填充色
              },
              customStyle: [{
                name: '自定义1',
                show: false,
                axisLabelFontFamily: 'Arial,苹方,微软雅黑',
                axisLabelFontWeight: 'normal',
                axisLabelFontSize: 16,
                axisLabelColor: '#FFF',
                axisLabelRotate: 0,
                axisLabelMargin: 8,
                splitLineWidth: 3,
                axisColor: 'rgba(238, 94, 94, 1)',
                splitLineType: 'solid',
                enableSplitArea: true,
                colorArr: 'rgba(238, 94, 94, 0.3)',
                enableHover: false,
                labelColor: '',
                lineColor: '',
                areaStyle: '',
                enable: true
              }, {
                name: '自定义2',
                show: false,
                axisLabelFontFamily: 'Arial,苹方,微软雅黑',
                axisLabelFontWeight: 'normal',
                axisLabelFontSize: 16,
                axisLabelColor: '#FFF',
                axisLabelRotate: 0,
                axisLabelMargin: 8,
                splitLineWidth: 3,
                axisColor: 'rgba(90, 128, 237, 1)',
                splitLineType: 'solid',
                enableSplitArea: true,
                colorArr: 'rgba(90, 128, 237, 0.3)',
                enableHover: false,
                labelColor: '',
                lineColor: '',
                areaStyle: '',
                enable: true
              }], // 自定义样式
              indicator: [
                {
                  name: '数学',
                  max: 100,
                  enable: true,
                  fieldValue: 1,
                  color: 'rgba(102, 102, 102, 1)'
                },
                {
                  name: '语文',
                  max: 100,
                  enable: true,
                  color: 'rgba(102, 102, 102, 1)',
                  fieldValue: 2
                },
                {
                  name: '英语',
                  max: 100,
                  enable: true,
                  fieldValue: 3,
                  color: 'rgba(102, 102, 102, 1)'
                },
                {
                  name: '物理',
                  max: 100,
                  enable: true,
                  fieldValue: 4,
                  color: 'rgba(102, 102, 102, 1)'
                },
                {
                  name: '化学',
                  max: 100,
                  enable: true,
                  fieldValue: 5,
                  color: 'rgba(102, 102, 102, 1)'
                },
                {
                  name: '其他',
                  max: 100,
                  enable: true,
                  fieldValue: 6,
                  color: 'rgba(102, 102, 102, 1)'
                }
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
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'RoseChart',
              imgUrl: 'homePage/RoseChart.svg',
              name: '玫瑰图',
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
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: 'rgba(128, 128, 128, 1)', // 图例字体颜色
                legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
                labelPosition: 'none', // 标注位置，内部外部
                labelColor: 'rgba(255, 255, 255, 1)', // 标注字体颜色
                labelShowType: 'type', // 标注显示值
                labelValueType: 1, // 标注值类型
                labelFontSize: 12, // 图例文字大小
                labelFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
                labelFontWeight: 'normal', // 图例文字粗细
                outerCircle: 50, // 外圆半径
                InnerCircle: 99, // 内圆半径
                pieHorizontal: 50, // 水平位置
                pieVertical: 50, // 竖向位置
                borderRadius: 6, // 扇形倒角
                roseType: 'radius',
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 1)',
                  c2: null
                }, {
                  c1: 'rgba(252, 130, 86, 1)',
                  c2: null
                }, {
                  c1: 'rgba(138, 90, 237, 1)',
                  c2: null
                }, {
                  c1: 'rgba(14, 190, 196, 1)',
                  c2: null
                }, {
                  c1: 'rgba(90, 128, 237, 1)',
                  c2: null
                }, {
                  c1: 'rgba(250, 183, 28, 1)',
                  c2: null
                }] // 扇形区域颜色
              },
              dataConfig: {
                staticValue: '[{"value":1048,"name":"类型一"},{"value":735,"name":"类型二"},{"value":580,"name":"类型三"},{"value":680,"name":"类型四"},{"value":430,"name":"类型五"},{"value":630,"name":"类型六"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'Liquidfill',
              imgUrl: 'homePage/Liquidfill.svg',
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
                waveNum: 2, // 波浪个数
                waveLength: 200, // 波浪宽度
                amplitude: 15, // 波浪整幅
                radius: 65, // 图表大小
                shape: 'circle', // 形状 circle， rect，roundRect，triangle， diamond，pin， arrow
                waveAnimation: false, // 动画
                outlineShow: false, // 显示外边框
                borderDistance: 5, // Distance between border and inner circle.
                borderColor: 'rgba(90, 128, 237, 1)', // 边框颜色
                borderWidth: 5, // 边框宽度
                shadowColor: '', // 阴影颜色
                shadowBlur: 0, // 阴影距离
                bgColor: 'rgba(242, 244, 248, 1)', // 内部背景颜色
                bgBorderColor: 'rgba(90, 128, 237, 1)', // 内部背景边框颜色
                bgBorderWidth: 0, // 内部背景边框宽度
                bgShadowColor: 'rgba(229, 240, 255, 1)', // 背景阴影颜色
                bgShadowBlur: 0, // 背景阴影距离
                labelPosition: 'inside', // 文字位置inside， left， right， top，bottom
                labelFontSize: 20, // 文字大小
                labelFontWeight: 'bold', // 文字
                labelColor: '#fff', // 文字颜色
                labelShow: true, // 是否显示文字
                colorArr: [{
                  c1: 'rgba(90, 128, 237, 1)',
                  c2: null
                }, {
                  c1: 'rgba(14, 190, 196, 1)',
                  c2: null
                }] // 扇形区域颜色
              },
              dataConfig: {
                staticValue: '{"value":0.6}' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              componentName: 'FunnelChart',
              imgUrl: 'homePage/FunnelChart.svg',
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
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 14, // 图例文字大小
                legendColor: 'rgba(128, 128, 128, 1)', // 图例字体颜色
                legendOrient: 'horizontal', // 图例布局， 默认水平，选项水平， 垂直
                colorArr: [{
                  c1: 'rgba(238, 94, 94, 1)'
                }, {
                  c1: 'rgba(250, 183, 28, 1)'
                }, {
                  c1: 'rgba(252, 130, 86, 1)'
                }, {
                  c1: 'rgba(14, 190, 196, 1)',
                  c2: '#fff'
                }, {
                  c1: 'rgba(90, 128, 237, 1)',
                  c2: '#fff'
                }] // 区域颜色
              },
              dataConfig: {
                staticValue: '[{"value":60,"name":"访问","title":"网站用户行为统计"},{"value":40,"name":"咨询","title":"网站用户行为统计"},{"value":20,"name":"订单","title":"网站用户行为统计"},{"value":80,"name":"点击","title":"网站用户行为统计"},{"value":100,"name":"展现","title":"网站用户行为统计"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              },
              funnelsConfig: [
                {
                  width: 45, // 宽
                  height: 70, // 高
                  top: 16, // 上边距
                  left: 25, // 左边距
                  sort: 'descending', // 排序
                  orient: 'vertical', // 漏斗图朝向
                  funnelAlign: 'center',
                  gap: 2, // 图形间距
                  fieldName: '配置1',
                  isShowLabel: true, // 是否显示文本标签
                  isShowTooltip: true, // 是否显示悬浮
                  labelFontFamily: '微软雅黑',
                  labelFontWeight: 'normal',
                  labelFontSize: 12,
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
            {
              componentName: 'Sankey',
              imgUrl: 'homePage/FunnelChart.svg',
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
                colorArr: [{ c1: '#7381F8' }, { c1: '#4689F5' }, { c1: '#43DBFF' }] // 扇形区域颜色
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
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },

          ]
        },
        {
          name: '高级组件',
          isClose: false,
          children: [
            {
              imgUrl: 'homePage/TabComponent.svg',
              componentName: 'TabComponent',
              name: 'tab组件',
              width: 500,
              height: 60,
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
                tabMarginLeftAndRight: 24, // tab外边距
                defaultShowTab: 'tab1_0', // 默认选中的tab
                paramName: '' // 传递参数名称
              },
              styleOne: {
                activeConfig: {
                  ...tabStylesConfig,
                  cFontWeight: 'bold',
                  cColor: 'rgba(90, 128, 237, 1)',
                  cHoverColor: '#4689F5',
                },
                unActiveConfig: {
                  ...tabStylesConfig,
                  cColor: 'rgba(51, 51, 51, 1)',
                  cHoverColor: 'rgba(90, 128, 237, 1)',
                }
              },
              styleTwo: {
                activeConfig: {
                  ...tabStylesConfig,
                  cColor: '#4689F5' // 激活状态
                },
                unActiveConfig: {
                  ...tabStylesConfig,
                  cBgColor: '#f5f7fa', // 背景颜色
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
                  cColor: '#333', // 激活状态
                  cBgColor: '#f5f7fa', // 背景颜色
                  borderColor: '#e9e9e9', // 边框颜色
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
            {
              imgUrl: 'homePage/CarouselChart.svg',
              componentName: 'CarouselChart',
              name: '轮播图',
              width: 500,
              height: 300,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              interactionType: 1, // 交互
              stylesObj: {
                zIndex: 1,
                autoplay: true, // 是否自动轮播
                interval: 3, // 轮播间隔
                loop: true, // 是否循环显示
                direction: 'horizontal', // 走马灯展示的方向
                type: '', // 轮播图类型  card/''
                indicatorPosition: '', // 指示器的位置  none=> 不显示; outside=> 外部； '' => 默认里边
                indicatorType: 1, // 1: 线条展示, 2： 圆点展示, 3： 数字展示
                arrow: 'hover', // 切换器 always/hover/never
              },
              imgArr: [], // 静态图片集合
              SqlDataConfig: {
                ...SqlDataConfig
              },
              panelConfig: {}, // 跳转面板配置
              skipMenuConfig: [], // 跳菜单配置
            },
            {
              imgUrl: 'homePage/Indicator.svg',
              componentName: 'Indicator',
              name: '指标组件',
              width: 200,
              height: 50,
              minHeight: 20,
              minWidth: 50,
              left: 0,
              top: 0,
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              interactionType: 1, // 交互
              stylesObj: {
                zIndex: 1,
                prefixText: '', // 前缀文字
                prefixTextMarginRight: 0, // 文字右边距
                suffixText: '', // 后缀文字
                suffixTextMarginLeft: 0, // 文字左边距
                prefixImg: '', // 前缀图片
                prefixImgMarginRight: 0, // 前缀图片右边距
                suffixImg: '', // 后缀图片
                suffixImgMarginLeft: 0, // 后缀图片左边距
                textAlign: 'center', // 整体对齐方式
                CFontFamily: '微软雅黑', // 内容字体
                CFontSize: 24, // 内容文字大小
                CColor: 'rgba(51, 51, 51, 1)', // 内容文字颜色
                CFontWeight: 'bold', // 内容文字加粗
                prefixTextFontFamily: 'Arial,苹方,微软雅黑', // 前缀字体
                prefixTextFontSize: 30, // 前缀文字大小
                prefixTextColor: '#808080', // 前缀文字颜色
                prefixTextFontWeight: 'normal', // 前缀文字加粗
                suffixTextFontFamily: 'Arial,苹方,微软雅黑', // 后缀字体
                suffixTextFontSize: 30, // 后缀文字大小
                suffixTextColor: '#808080', // 后缀文字颜色
                suffixTextFontWeight: 'normal', // 后缀文字加粗
                prefixImgWidth: 20, // 前缀图片宽度
                prefixImgHeight: 20, // 前缀图片高度
                suffixImgWidth: 20, // 后缀图片宽度
                suffixImgHeight: 20, // 后缀图片宽度
              },
              SqlDataConfig: {
                ...SqlDataConfig
              },
              dataConfig: {
                staticValue: '{"text":"文本组件","value":"文本组件2"}', // 静态值
                takeEffect: 'text' // 生效字段
              },
              conditionsArr: [], // 条件集合
              panelConfig: {}, // 跳转面板配置
              skipMenuConfig: [], // 跳菜单配置
            },
            {
              imgUrl: 'homePage/SelectCom.svg',
              componentName: 'DropdownBox',
              name: '下拉框',
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
                fontSize: 16, // 字体大小
                bgColor: 'rgba(255, 255, 255, 1)', // 控件背景颜色
                borderColor: 'rgba(227, 227, 227, 1)', // 控件边框颜色
                iconColor: 'rgba(229, 240, 255, 1)', // 图标颜色
                fontColor: 'rgba(51, 51, 51, 1)', // 控件字体颜色
                defaultCheckedTimeType: '', // 默认时间类型选用
                updateChart: [], // 关联更新图表
                paramsFiled: '', // 参数字段
                interactionSettingType: 1, // 1,自定义， 2，系统自带枚举
                dictObj: {}, // 字典项配置
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
                  }], // 自定义的下拉项
                dictOptions: [] // 字典项的下拉项
              }
            },
            {
              imgUrl: 'homePage/TimeFilter.svg',
              componentName: 'TimeFiltering',
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
                bgColor: 'rgba(255, 255, 255, 1)', // 控件背景颜色
                borderColor: 'rgba(227, 227, 227, 1)', // 控件边框颜色
                iconColor: 'rgba(229, 240, 255, 1)', // 图标颜色
                fontColor: 'rgba(51, 51, 51, 1)', // 控件字体颜色
                fontSize: 14, // 字体大小
                checkedTimes: [2, 3, 4, 5, 6], // 时间类型选用
                defaultCheckedTimeType: '', // 默认时间类型选用
                updateChart: [], // 关联更新图表
                timeTypeFiled: '', // 时间类型字段
                timeValueFiled: '', // 时间值字段
                checkedTimesOthers: [2, 4, 5, 6] // 时间扩展操作
              }
            },
            { // 数据切换
              componentName: 'DataSwitching',
              imgUrl: 'homePage/DataSwitching.svg',
              name: '数据切换',
              width: 80,
              height: 40,
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
                cFontFamily: '微软雅黑',
                cFontWeight: 'normal',
                cFontSize: 16,
                cPaddingTopAndBottom: 10,
                cPaddingRightAndLeft: 10,
                cColor: '#333',
                cHoverColor: 'rgba(255, 255, 255, 1)',
                cBgUrl: '',
                cHoverBgUrl: '',
                cBgColor: 'rgba(255, 255, 255, 1)',
                cHoverBgColor: 'rgba(90, 128, 237, 1)',
                borderWidth: 1,
                borderColor: 'rgba(227, 227, 227, 1)',
                borderRadius: 8
              },
              afterConfig: { // 切换后数据
                content: '切换后',
                cFontFamily: '微软雅黑',
                cFontWeight: 'normal',
                cFontSize: 16,
                cPaddingTopAndBottom: 10,
                cPaddingRightAndLeft: 10,
                cColor: 'rgba(255, 255, 255, 1)',
                cHoverColor: 'rgba(255, 255, 255, 1)',
                cBgUrl: '',
                cHoverBgUrl: '',
                cBgColor: 'rgba(90, 128, 237, 1)',
                cHoverBgColor: 'rgba(90, 128, 237, 1)',
                borderWidth: 0,
                borderColor: '#fff',
                borderRadius: 8
              },
              beforeParamsConfig: [], // 初始化时的参数传递
              afterParamsConfig: [] // 切换后的参数传统
            },
            {
              componentName: 'BasicMap',
              imgUrl: 'homePage/BasicMap.svg',
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
                    fieldValue: '1',
                    scatterSize: 15,
                    scatterHighlightSize: 15,
                    scatterColor: 'rgba(255, 140, 0, 1)',
                    scatterHighlightColor: 'rgba(255, 215, 0, 1)',
                    scatterBorderColor: '',
                    scatterBorderHighlight: ''
                  },
                  {
                    fieldValue: '2',
                    scatterSize: 15,
                    scatterHighlightSize: 15,
                    scatterColor: 'rgba(0, 186, 189, 1)',
                    scatterHighlightColor: 'rgba(31, 147, 255, 0.73)',
                    scatterBorderColor: '',
                    scatterBorderHighlight: ''
                  },
                  {
                    fieldValue: '3',
                    scatterSize: 15,
                    scatterHighlightSize: 15,
                    scatterColor: 'rgba(255, 0, 234, 1)',
                    scatterHighlightColor: 'rgba(179, 73, 193, 1)',
                    scatterBorderColor: '',
                    scatterBorderHighlight: ''
                  },
                  {
                    fieldValue: '4',
                    scatterSize: 15,
                    scatterHighlightSize: 15,
                    scatterColor: 'rgba(20, 234, 45, 1)',
                    scatterHighlightColor: 'rgba(52, 220, 105, 1)',
                    scatterBorderColor: '',
                    scatterBorderHighlight: ''
                  }
                ], // 散点图点样式配置集合
                pointSize: 100, // 权重最大值
                dotBlurSize: 15, // 半径大小
                hotDataColor: [{ c1: 'rgba(255, 69, 0, 0.68)' }, { c1: 'rgba(199, 21, 133, 0.46)' }, { c1: 'rgba(144, 240, 144, 0.5)' }], // 热力图颜色

                minPellucidity: 20, // 最小透明度
                maxPellucidity: 100, // 最大透明度

                imageWidth: 32, //  图片宽度
                imageHeight: 32, // 图片高度
                customDataMappingField: 'type', // 数据映射字段
                customDisplay: [], // 自定义展示
                // tooltip配置
                showInfoType: 2, // 悬浮类型
                customTipInfo: '{name}类型是{type}', // 自定义悬浮类型信息
                infoConfig: [{
                  name: 'name',
                  value: '名称'
                }], // 自定义悬浮信息
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
              SqlDataConfig: {
                ...SqlDataConfig
              },
              panelConfig: {}, // 跳转面板配置
              skipMenuConfig: [], // 跳菜单配置
            },
            {
              componentName: 'CanvasDrawing',
              imgUrl: 'homePage/CanvasDraw.svg',
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
                type: 2, // 下钻
                updateTime: 15,
                pathColor: '#333', // 路径颜色
                associatedControls: [], // 点击全部时管理的受控控件
                dataSourceVar: 'varTableName', // 数据源变量
                dataSourceValue: '', // 数据源明细
                dataDetailVar: 'varDetailName', // 数据明细变量
                dataDetailValue: '', // 数据明细值
              },
              designObject: '' // canvas配置
            },
          ]
        }
      ]
    };
  },
  components: {
    ZoomCenter
  },

  computed: {
    getAreaArr() {
      return function (arr) {
        const { clientType } = sessionStorage;
        return arr.filter((item) => !item.clientType || item.clientType === +clientType);
      };
    }
  },

  mounted() {
  },

  methods: {
    move(e) {
      const { to } = e;
      const { classList } = to;
      if (classList.contains('configSidebar__comp--compList')) return false;
    },
    dragAreaEnd(e, index, arr) {
      const el = document.querySelector('.homePageContent__main--content');
      const boundingRect = el.getBoundingClientRect();
      const { originalEvent } = e;
      const {
        pageX,
        pageY
      } = originalEvent;
      const {
        left: designLeft,
        right,
        top: designTop,
        bottom
      } = boundingRect;
      if (pageX < designLeft) {
        return;
      }
      if (pageX > right) {
        return;
      }
      if (pageY < designTop) {
        return;
      }
      if (pageY > bottom) {
        return;
      }
      this.copyNew(arr, index, originalEvent, e.oldIndex);
    },
    // 创建一个新的初始化
    copyNew(data, index, originalEvent, oldIndex) {
      const baseInfo = JSON.parse(JSON.stringify(data[index].children[oldIndex]));
      const componentId = createUnique();
      baseInfo.componentId = componentId;
      this.$emit('dragObject', {
        componentInfo: baseInfo,
        e: originalEvent
      });
    }
  },

  watch: {}
};
</script>

<style lang='scss' scoped>
.configSidebar {
  height: 100%;
  width: 280px;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);

  &__tab {
    box-sizing: border-box;
    width: 100%;
    height: 46px;
    padding: 10px 10px 8px;
    display: flex;

    &--item {
      flex: 1;
      border: 1px solid #e9e9e9;
      color: #333333;
      cursor: pointer;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;

      &:not(:first-child) {
        margin-left: 1px;
      }

      &.active {
        background-color: $--color-primary !important;
        border-color: $--color-primary !important;
        color: #fff !important;
      }
    }
  }

  &__wrapper {
    height: calc(100% - 46px);
  }

  &__comp {
    &--group {
      h1 {
        position: relative;
        font-weight: 600;
        font-size: 13px;
        height: 40px;
        line-height: 40px;
        padding-left: 22px;
        cursor: pointer;
      }
    }

    &--compList {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
    }

    &--compItem {
      box-sizing: border-box;
      width: 80px;
      height: 80px;
      margin-left: 10px;
      margin-bottom: 10px;
      border: 1px solid #e9e9e9;
      cursor: pointer;

      &.featGhost {
        display: inline-block;
        box-sizing: border-box;
        width: 50%;
        height: 90px;
        border: 1px dashed $--color-primary;
        margin: 0;
        vertical-align: top;

        img,
        p {
          opacity: 0;
        }
      }

      &.btnBox.featGhost {
        width: 68px;
        height: 30px;
        margin-left: 10px;
      }

      &.isTable.featGhost {
        display: inline-block;
        width: 140px;
        height: 80px;
      }

      &:hover {
        background: #fafafa;
        border: 1px solid #e9e9e9;
      }

      img {
        display: block;
        margin: 14px auto 0;
        width: 30px;
      }

      p {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }
    }
  }

  &__tabArea {
    height: 100%;
    overflow: auto;
    width: 100%;
    //padding-right: 20px;
  }

  &__tabArea::-webkit-scrollbar {
    width: 0 !important
  }
}
</style>
