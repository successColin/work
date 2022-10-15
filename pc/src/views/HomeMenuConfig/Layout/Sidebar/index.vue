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
            {
              name: '日志',
              imgUrl: 'homePage/journal.svg'
            },
            {
              name: '审批',
              imgUrl: 'homePage/Approval.svg'
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
            {
              name: '欢迎',
              imgUrl: 'homePage/welcome.svg'
            },
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
              interactionType: 1, // 交互
              isShow: true, // 是否显示，用于图层控制组件显示与否
              isLock: false, // 是否锁定
              dataType: 1, // 1：静态；2：接口获取；3：SQL获取
              stylesObj: {
                fontFamily: 'Arial,苹方,微软雅黑',
                textAlign: 'center',
                fontSize: 30,
                color1: '#808080',
                color2: '#808080',
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
                  isEllipsis: true,
                  fieldTextAlign: 'center',
                  fieldPrefix: '', // 文字前缀
                  fieldPrefixWidth: 20, // 文字前缀宽度
                  fieldPrefixHeight: 20, // 文字前缀高度
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
                staticValue: '[{"name":"1","area":"上海市"},{"name":"2","area":"杭州市"},{"name":"3","area":"上海市"},{"name":"4","area":"杭州市"},{"name":"5","area":"上海市"},{"name":"6","area":"杭州市"},{"name":"7","area":"上海市"},{"name":"8","area":"杭州市"},{"name":"9","area":"上海市"}]' // 静态值
              },
              SqlDataConfig: {
                ...SqlDataConfig
              }
            },
            {
              name: '背景框',
              imgUrl: 'homePage/backgroundBox.svg',
              componentName: 'BackgroundBox',
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
              enableShadows: true, // 是否启用阴影
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
                Color: '#4689f5',
                FontWeight: 'normal',
                zIndex: 1,
                showType: 'YYYY-MM-DD HH:mm:ss'
              }
            },
            {
              name: '线条',
              componentName: 'AuxiliaryLine',
              imgUrl: 'homePage/homeLine.svg',
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
                lineStyleType: 'solid',
                opacity: 100,
                rotationAngle: 0,
                height: 1,
                color: '#43DBFF',
                color1: '#43DBFF',
                zIndex: 1
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
                legendPosition: 'lt', // 图例位置
                legendFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 12, // 图例文字大小
                legendColor: '#808080', // 图例字体颜色
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
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }
                ] // 扇形区域颜色
              },
              dataConfig: {
                staticValue:
                  '[{"value":1048,"name":"类型一"},{"value":735,"name":"类型二"},{"value":580,"name":"类型三"}]' // 静态值
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
              enableLabel: true, // 是否启用标注
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
                borderRadius: 0, // 柱子顶部倒角
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 12, // 图例文字大小
                legendColor: '#808080', // 图例字体颜色
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                XLineColor: '#808080', // x轴轴颜色
                XDataType: 'category', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 12, // x轴文字大小
                XColor: '#808080', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: '#808080', // x轴字体颜色
                YLineColor: '#808080', // x轴轴颜色
                YDataType: 'value',
                YName: '', // X轴 标题名称
                YFontFamily: '微软雅黑', // x轴字体
                YFontWeight: 'normal', // x轴文字粗细
                YFontSize: 12, // x轴文字大小
                YColor: '#808080', // x轴字体颜色
                YTickEnable: false, // x轴刻度
                YTickColor: '#808080', // x轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // x轴字体
                YTickLabelFontWeight: 'normal', // x轴文字粗细
                YTickLabelFontSize: 12, // x轴文字大小
                YTickLabelColor: '#808080', // x轴字体颜色
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }
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
                legendColor: '#808080', // 图例字体颜色
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                XLineColor: '#808080', // x轴轴颜色
                XDataType: 'category', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 12, // x轴文字大小
                XColor: '#808080', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: '#808080', // x轴字体颜色
                YLineColor: '#808080', // x轴轴颜色
                YDataType: 'value',
                YName: '', // X轴 标题名称
                YFontFamily: '微软雅黑', // x轴字体
                YFontWeight: 'normal', // x轴文字粗细
                YFontSize: 12, // x轴文字大小
                YColor: '#808080', // x轴字体颜色
                YTickEnable: false, // x轴刻度
                YTickColor: '#808080', // x轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // x轴字体
                YTickLabelFontWeight: 'normal', // x轴文字粗细
                YTickLabelFontSize: 12, // x轴文字大小
                YTickLabelColor: '#808080', // x轴字体颜色
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }], // 区域颜色
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
              enableLegend: true, // 是否启用标题
              stylesObj: {
                zIndex: 1,
                legendName: '环形进度条', // 标题名称
                legendPosition: 'lt', // 标题位置
                legendFontFamily: 'Arial,苹方,微软雅黑', // 标题字体
                legendFontWeight: 'normal', // 标题文字粗细
                legendFontSize: 16, // 标题文字大小
                legendColor: '#808080', // 标题字体颜色
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
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }
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
                barWidth: 25, // 柱子宽度
                borderRadius: 0, // 柱子顶部倒角
                legendPosition: 'tc', // 图例位置
                legendFontFamily: '微软雅黑', // 图例字体
                legendFontWeight: 'normal', // 图例文字粗细
                legendFontSize: 12, // 图例文字大小
                legendColor: '#808080', // 图例字体颜色
                labelField: 'y', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'top', // 标注位置，顶部， 内部，底部
                XLineColor: '#808080', // x轴轴颜色
                XDataType: 'value', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 12, // x轴文字大小
                XColor: '#808080', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: '#808080', // x轴字体颜色
                YLineColor: '#808080', // x轴轴颜色
                YDataType: 'category',
                YName: '', // X轴 标题名称
                YFontFamily: '微软雅黑', // x轴字体
                YFontWeight: 'normal', // x轴文字粗细
                YFontSize: 12, // x轴文字大小
                YColor: '#808080', // x轴字体颜色
                YTickEnable: false, // x轴刻度
                YTickColor: '#808080', // x轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // x轴字体
                YTickLabelFontWeight: 'normal', // x轴文字粗细
                YTickLabelFontSize: 12, // x轴文字大小
                YTickLabelColor: '#808080', // x轴字体颜色
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }
                ] // 区域颜色
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
                legendColor: '#808080', // 图例字体颜色
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }
                ], // 区域颜色
                XLineColor: '#808080', // x轴轴颜色
                XDataType: 'category', // 轴类型
                XName: '', // X轴 标题名称
                XFontFamily: '微软雅黑', // x轴字体
                XFontWeight: 'normal', // x轴文字粗细
                XFontSize: 12, // x轴文字大小
                XColor: '#808080', // x轴字体颜色
                XTickEnable: false, // x轴刻度
                XTickColor: '#808080', // x轴刻度颜色
                XTickLabelFontFamily: '微软雅黑', // x轴字体
                XTickLabelFontWeight: 'normal', // x轴文字粗细
                XTickLabelFontSize: 12, // x轴文字大小
                XTickLabelColor: '#808080', // x轴字体颜色
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
                YLineColor: '#808080', // Y轴轴颜色
                YDataType: 'value',
                YName: '', // Y轴 标题名称
                YFontFamily: '微软雅黑', // Y轴字体
                YFontWeight: 'normal', // Y轴文字粗细
                YFontSize: 12, // Y轴文字大小
                YColor: '#808080', // Y轴字体颜色
                YTickEnable: false, // Y轴刻度
                YTickColor: '#808080', // Y轴刻度颜色
                YTickLabelFontFamily: '微软雅黑', // Y轴字体
                YTickLabelFontWeight: 'normal', // Y轴文字粗细
                YTickLabelFontSize: 12, // Y轴文字大小
                YTickLabelColor: '#808080', // Y轴字体颜色
                Y1LineColor: '#808080', // Y轴轴颜色
                Y1DataType: 'value',
                Y1Name: '', // Y轴 标题名称
                Y1FontFamily: '微软雅黑', // Y轴字体
                Y1FontWeight: 'normal', // Y轴文字粗细
                Y1FontSize: 12, // Y轴文字大小
                Y1Color: '#808080', // Y轴字体颜色
                Y1TickEnable: false, // Y轴刻度
                Y1TickColor: '#808080', // Y轴刻度颜色
                Y1TickLabelFontFamily: '微软雅黑', // Y轴字体
                Y1TickLabelFontWeight: 'normal', // Y轴文字粗细
                Y1TickLabelFontSize: 12, // Y轴文字大小
                Y1TickLabelColor: '#808080' // Y轴字体颜色
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
                legendColor: '#808080', // 图例字体颜色
                startAngle: 180, // 起始角度
                endAngle: 0, // 结束角度
                radius: 100, // 仪表盘半价
                max: 180, // 刻度最大值
                min: 0, // 刻度最小值
                splitNumber: 5, // 刻度分割段数
                roundCap: true, // 两端启用圆角
                axisLineWidth: 10, // 轴线宽度
                axisLineColorConfig: [{ name: 1, value: '#E6EBF8' }], // 轴线颜色
                progressRoundCap: true, // 进度条
                progressWidth: 10, // 进度条宽度
                progressColor: '#58D9F9', // 进度条颜色
                splitLineLength: 10, // 分割线长度
                splitLineDistance: 10, // 分割线离轴线的距离
                splitLineColor: '#808080', // 分割线颜色
                splitLineWidth: 2, // 分割线宽度
                splitLineType: 'solid', // 分割线类型， 实现，虚线，点线
                axisTickSplitNumber: 5, // 分隔线之间分割的刻度数
                axisTickLength: 10, // 刻度线长
                axisTickDistance: 0, // 刻度线与轴线的距离
                axisTickColor: '#808080', // 刻度线颜色
                axisTickWidth: 2, // 刻度线宽度
                axisTickType: 'solid', // 刻度线类型， 实现，虚线，点线
                axisLabelDistance: 10, // 标签与刻度线的距离
                axisLabelFontFamily: 'Arial,苹方,微软雅黑', // 标签字体
                axisLabelFontWeight: 'normal', // 标签文字粗细
                axisLabelFontSize: 16, // 标签文字大小
                axisLabelColor: '#808080', // 标签文字颜色
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
                detailColor: '#808080',
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
                barBgColor: 'rgba(0,0,0,.2)', // 进度条背景色
                XFontFamily: '微软雅黑',
                XFontWeight: 'normal',
                XFontSize: 14,
                XColor: 'rgba(0,0,0,.7)',
                labelField: 'x', // 标注字段
                labelPrefix: '', // 标注前缀
                labelSuffix: '', // 标注后缀
                labelFontFamily: '微软雅黑', // 标注字体
                labelFontWeight: 'normal', // 标注文字粗细
                labelFontSize: 12, // 标注文字大小
                labelColor: '#808080', // 标注字体颜色
                labelPosition: 'insideRight', // 标注位置，顶部， 内部，底部
                labelOffset: 20, // 文字偏移
                colorArr: [
                  { c1: '#7381F8', c2: '#7381F8' },
                  { c1: '#4689F5', c2: '#4689F5' },
                  { c1: '#43DBFF', c2: '#43DBFF' }
                ], // 区域颜色
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
                legendColor: '#333333', // 图例字体颜色
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

                axisNameColor: '#333333', // 标注字体颜色
                axisNameFontSize: 12, // 图例文字大小
                axisNameFontFamily: 'Arial,苹方,微软雅黑', // 图例字体
                axisNameFontWeight: 'normal', // 图例文字粗细
                dataField: 'type', // 维度数据字段
                colorArr: [{ c1: 'rgba(250,250,250,0.3)' }, { c1: 'rgba(200,200,200,0.3)' }] // 区域填充色
              },
              customStyle: [], // 自定义样式
              indicator: [
                { name: '数学', max: 100, enable: true, fieldValue: 1 },
                { name: '语文', max: 100, enable: true, fieldValue: 2 },
                { name: '英语', max: 100, enable: true, fieldValue: 3 },
                { name: '物理', max: 100, enable: true, fieldValue: 4 },
                { name: '化学', max: 100, enable: true, fieldValue: 5 },
                { name: '其他', max: 100, enable: true, fieldValue: 6 }
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

          ]
        },
        {
          name: '高级组件',
          isClose: false,
          children: [
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

  mounted() {},

  methods: {
    dragAreaEnd(e, index, arr) {
      const el = document.querySelector('.homePageContent__main--content');
      const boundingRect = el.getBoundingClientRect();
      const { originalEvent } = e;
      const { pageX, pageY } = originalEvent;
      const { left: designLeft, right, top: designTop, bottom } = boundingRect;
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
      this.$emit('dragObject', { componentInfo: baseInfo, e: originalEvent });
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
