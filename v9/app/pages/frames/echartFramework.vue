<template name="echartFramework">
  <!-- 带选择按钮 -->
  <view class="echartFramework">
    <!-- :class="{ transparent: showDefault }" :colorCode="colorCode" -->
    <m-back-bar>
      <block slot="barTitle">{{ barTitle }}</block>
    </m-back-bar>
    <!-- <image :src="echartsBg" mode="widthFix" class="echarts_bg"></image> -->
    <view class="echart-content">
      <view class="statistics-list">
        <view
          class="statistics-item"
          v-for="(item, index) in totalData"
          :key="index"
          @click="handleNav(item)"
        >
          <view>
            <m-font-icon
              :icon="item.iconName"
              :color="item.colorCode"
              :iconSize="iconSize"
            ></m-font-icon>
            <span>{{ item.displayName }}</span>
          </view>
          <view class="num">{{ item.totalData }}</view>
        </view>
      </view>

      <view class="echart-list">
        <view v-for="(item, index) in chartData" :key="index">
          <echarts-template
            :chartData="item"
            :canvasId="item.elementId"
            ref="templateChart"
          ></echarts-template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import echartsTemplate from '@/pages/common/echartsTemplate.vue';
import echartsBg from '@/static/images/echarts_bg.png';
import { mapState, mapMutations } from 'vuex';
import { formApi, homeApi } from '@/common/request/api.js';
import * as Path from 'common/request/homeApi/interface.js';
import { templateType } from '@/common/constant/constant.js';
import { common_inParam_selectByRelationId } from '@/common/request/commonApi/commonRequest.js';

export default {
  components: { echartsTemplate },
  data() {
    return {
      barTitle: '报表中心',
      echartsBg: echartsBg,
      iconSize: 30,
      height: 340,
      showDefault: true,
      colorCode: '#ffffff',
      // statusBarBgColor: 'transparent',
      gatherData: [],
      chartData: [],
      gatherelements: [],
      totalData: [],
    };
  },
  computed: {
    ...mapState(['screenHeight']),
    ...mapState(['bundleName', 'bundleId', 'isOriginHei', 'userDesigner']),
    ...mapState('home', {
      newBundle: 'newBundle',
      workSpaceList: 'workSpaceList',
    }),
    height_() {
      return uni.upx2px(this.height);
    },
  },
  methods: {
    ...mapMutations(['SET_ORIGIN', 'SET_bundle', 'SET_FRAMETYPE']),
    ...mapMutations('framsStore', ['SET_FRAMS_JUMINParams']),
    ...mapMutations('Toast', ['TOAST_REQUESTURLS']),
    ...mapMutations('form', ['SET_FILTER_SQLPARAMS', 'SET_ALLBTNS']),
    ...mapMutations('home', ['SET_NEW_BUNDLE']),
    setPageInfo(mobileTabsBYRelation, mainTabID, formId = '') {
      //根据relationTab取具体面板信息
      if (!mainTabID) {
        uni.showModal({
          title: this.$t('basic-inquiry'),
          content: '请联系管理员配置主页',
          cancelText: this.$t('basic-cancel'),
          confirmText: this.$t('basic-confirm'),
        });
        return;
      }
      // this.CLEAR_FORMDATAS(this.tabInfo.mobileTabId)//请求对应面板的需要提交的表单值
      // this.CLEAR_RULESTATE(this.tabInfo.mobileTabId)//清空对应面板的校验规则

      const _this = this;

      //设置返回栏标题
      this.barTitle = mobileTabsBYRelation.mobileTabName || this.bundleName;

      //设置表单参数
      const queryParams = Form.advancedParams(this, {
        advancedQuery: mobileTabsBYRelation.advancedQuery || {}, //过滤条件中需要转化的变量
        systemParam: { mobileTabId: this.tabInfo.mobileTabId },
      }); //获取过滤条件中的变量
      const formConfig = {};
      formConfig.otherParams = {
        //列表额外参数，过滤条件中设置的参数
        id: queryParams || formId,
        mobileTabId: this.tabInfo.mobileTabId,
        elementList: mobileTabsBYRelation.elements,
        mobileTabSource: mobileTabsBYRelation.mobileTabSource,
      };
      const elements = mobileTabsBYRelation.elements,
        bottomBtn = mobileTabsBYRelation.btnList.bottomBtn,
        topRightBtn = mobileTabsBYRelation.btnList.topRightBtn,
        comboBox = mobileTabsBYRelation.btnList.comboBox,
        tabElements = [...elements, ...bottomBtn, ...topRightBtn, ...comboBox];
      formConfig.baseParams = {
        //列表基本参数
        currentElements: elements,
        currentBottomBtns: bottomBtn,
        currentTopRightBtns: topRightBtn,
        currentComboBoxs: comboBox,
        tabElements: tabElements,
      };
      this.formConfig = formConfig;

      this.SET_FILTER_SQLPARAMS({
        tabId: mobileTabsBYRelation.mobileTabId,
        params: mobileTabsBYRelation.filterSQLParams,
      });
      //请求表单数据
      // this.getDate()
    },
    showEcharts(elements) {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].baseType == 37) {
          this.gatherData.push(elements[i]);
          this.gatherelements.push(elements[i].elementId);
          this.getTotalData(elements[i]);
        } else if (elements[i].baseType == 38) {
          this.chartData.push(elements[i]);
        }
      }
      // this.getTotalData();
    },
    getTotalData(elementId) {
      const elementIds = this.gatherelements.toString();
      let chartMap = {};
      if (elementId.globalTotalVars) {
        elementId.globalTotalVars.forEach((e) => {
          let key = this.Static_GlobalFucs.Global_ParamFormat({ key: e }, this);
          chartMap[e] = { value: key.id, type: key.relationColumnType };
        });
      }
      this.$http
        .post(
          'currencyPcList/currencyGetTotalByElementId',
          { elementIds: elementId.elementId, chartMap: chartMap },
          { header: { 'content-type': 'application/json;charset=UTF-8' } }
        )
        .then((res) => {
          this.showTotalData(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showTotalData(TotalData) {
      let obj = {};
      for (let n in TotalData) {
        for (let i = 0; i < this.gatherData.length; i++) {
          if (n == this.gatherData[i].elementId) {
            this.gatherData[i].defaultValue = TotalData[n];
            obj = {
              iconName: this.gatherData[i].iconName,
              colorCode: this.gatherData[i].colorCode,
              displayName: this.gatherData[i].label,
              totalData: TotalData[n],
              bundlePramDto: this.gatherData[i].bundlePramDto,
              elementId: n,
              jumpMenuList: this.gatherData[i].jumpMenuList,
            };
            this.totalData.push(obj);
            this.totalData = this.totalData.sort(this.compare('elementId'));
          }
        }
      }
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    handleNav(item) {
      //如果没有框架信息，提示功能正在开发中
      const bundle = item.bundlePramDto;
      let _this = this;
      let isJump = false;
      this.workSpaceList.forEach((item) => {
        const bund = item.list.filter((obj) => obj.id === bundle.id);
        if (bund.length > 0) isJump = true;
      });
      // 没有该bundle权限
      if (!isJump) {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('pageTip-noPromiss'),
          showCancel: false,
        });
        return;
      }
      if (!bundle) {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('lang-no-relation'),
          showCancel: false,
        });
        return;
      }
      const frameType = {
        1: 'UBPFramework', //1-通用业务处理框架对应主页为列表
        2: 'download', //2-数据下载框架 点巡检下载
        3: 'Inspections', // 3-离线点巡检框架
        4: 'FormFramework', //4-表单框架//5-统计框架TODO
        6: 'systemFramework', //6-系统
        7: 'echartFramework', //7-首页报表框架
        8: 'ListFramework', //8-全列表控件
      };

      const { id: jumpBundleId } = bundle,
        { bundleId, mobileFrameTypeId } = this.tabInfo;
      const template = templateType[bundle.mobileFrameTypeId];
      this.SET_FRAMETYPE(frameType[bundle.mobileFrameTypeId]);
      const url = `/pages/${template}?title=${bundle.name}&bundleId=${jumpBundleId}&mainTab=1&jumpTag=${bundleId}`;
      common_inParam_selectByRelationId({ bundleId: jumpBundleId }, this).then(
        (value) => {
          const jumpTagParam = this.getJumpBundleParam(item) || {};
          let jumpInParams = {};
          value.map((item) => {
            //处理输入参数
            if (item.name in jumpTagParam) {
              const jumpTagValue = jumpTagParam[item.name] || {};
              console.log(jumpTagValue);
              jumpInParams[item.name] = jumpTagParam[item.name];
            }
          });

          this.SET_FRAMS_JUMINParams({
            tag: jumpBundleId,
            source: bundleId,
            bundleParams: jumpInParams,
          });
          uni.navigateTo({
            url: url,
          });
        }
      );
    },
    getAccordBundle(jumpList = []) {
      //从跳转菜单列表中获取符合条件的菜单
      let jumpThing = '';
      for (let i = 0, len = jumpList.length; i < len; i++) {
        const jumpThingMap = jumpList[i] || {};
        jumpThing = { ...jumpThingMap };
      }
      return jumpThing;
    },
    getJumpBundleParam(item) {
      //获取跳转菜单变量
      const jumpMenu = this.getAccordBundle(item.jumpMenuList);
      const jumpConfig = {
        passParam: jumpMenu.passParam,
        mobileTabId: this.tabInfo.mobileTabId,
      };
      //获取跳转菜单的参数
      const passParam = jumpConfig.passParam;
      let passParamObj = '';
      if (passParam)
        try {
          passParamObj = JSON.parse(passParam);
        } catch {}
      if (passParamObj) {
        let basicConfig = {
          mobileTabId: jumpConfig.mobileTabId,
          tabsElements: jumpConfig.tabsElements,
          tabsFormDatas: jumpConfig.tabsFormDatas,
          tabStaticParams: jumpConfig.tabStaticParams,
        };
        let passParamValue = '';
        for (let i = 0, len = passParamObj.length; i < len; i++) {
          const passParamInfo = passParamObj[i],
            value = passParamInfo.value;
          basicConfig.key = value;
          let relValue = this.Static_GlobalFucs.Global_ParamFormat(
            basicConfig,
            this
          );
          relValue.relationColumnType =
            passParamInfo.type || relValue.relationColumnType;
          if (!passParamValue) {
            passParamValue = {};
            passParamValue[passParamInfo.key] = relValue;
          } else passParamValue[passParamInfo.key] = relValue;
        }
        return passParamValue || {};
      }
    },
  },

  // onPageScroll(e) {
  //   let scrollTop = (e.scrollTop / 50).toFixed(1);
  //   if (e.scrollTop > 60) {
  //     this.showDefault = false;
  //     this.colorCode = '#000000';
  //     this.statusBarBgColor = '#ffffff';
  //   } else {
  //     this.showDefault = true;
  //     this.colorCode = '#ffffff';
  //     this.statusBarBgColor = 'transparent';
  //   }
  // },
  onLoad(options) {
    this.TOAST_REQUESTURLS({ type: 'clear' }); //清空请求地址
    if (!options.bundleId) return;
    const _t = this;
    //如果有bundleId传递过来默认显示
    this.SET_bundle({
      bundleId: options.bundleId,
      bundleName: options.title,
    });

    //判断是否需要重新获取界面元素
    const bundleInfo = uni.getStorageSync(this.bundleId) || {};
    const mobileTabs = bundleInfo.mobileTabs || {},
      mobileTabId = bundleInfo.mainTabID;
    let mobileTabsBYRelation = {};
    if (mobileTabId) mobileTabsBYRelation = mobileTabs[mobileTabId] || {};

    const isNew = this.newBundle[this.bundleId], //是不是为newbundle
      bundleV = options.V || '0';
    //定义面板信息
    let tabInfo = {
      _uid: this._uid,
      bundleId: this.bundleId,
      bundleName: this.bundleName,
      mobileTabId: mobileTabId,
      relationMainTab: '',
      mobileTabs: mobileTabs,
      trigger: bundleInfo.triggerMap || {},
      parentKey: '',
      refreshParams: {},
      formType: 'editBtn', //设置表单来源：addBtn-新增；editBtn-编辑
      cascadeSelects: mobileTabsBYRelation.cascadeSelects || [],
      commonSelects: mobileTabsBYRelation.commonSelects || [],
      selectsFilterParams: mobileTabsBYRelation.filterParams || {},
    };
    this.tabInfo = tabInfo;

    homeApi
      .getPage(this, {
        bundleId: tabInfo.bundleId,
      })
      .then((value) => {
        const mainTabID = value.mainTabID;
        this.tabInfo.mobileTabId = mainTabID;
        this.tabInfo.mobileTabs = value.mobileTabs;
        this.showEcharts(value.mobileTabs[mainTabID].elements);
        //将bundle版本存入bundleVersion缓存种，版本号以用户设计组和bundleId作为key
        if (isNew) {
          //加载过后设置isNew为false
          this.SET_NEW_BUNDLE({ bundle: this.bundleId, isNew: false });
          let bundleVersions = uni.getStorageSync('bundleVersion') || {},
            key = this.userDesigner + '_' + this.bundleId;
          bundleVersions[key] = bundleV;
          uni.setStorageSync('bundleVersion', bundleVersions);
        }
      });
    //解决底部按钮在软键盘打开时被顶起问题
    const res = uni.getSystemInfoSync(),
      _this = this;
    this.originHeight = res.windowHeight;
    uni.onWindowResize((res) => {
      let isOriginHei = true;
      if (res.size.windowHeight < _this.originHeight) {
        isOriginHei = false;
      } else {
        isOriginHei = true;
      }
      _this.SET_ORIGIN(isOriginHei);
    });
  },
};
</script>
<style scoped lang="scss">
@import '@/static/scss/common/_function.scss';
.echart-content {
  border-radius: 0;
  padding-top: var(--status-bar-height);
}

</style>