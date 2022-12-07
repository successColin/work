<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 菜单
-->
<template>
  <view class="menuConfig" :style="{ height: `${menuHeight}px` }">
    <!-- tab区 -->
    <u-sticky :customNavHeight="customBar" disabled>
      <div>
        <section class="popBox__selectMsg" @click.stop>
          <span v-if="!canShowCheck">{{ popTitle }}</span>
          <span v-if="htmlConfig.multiple" @click.stop="showChecks"
            >已选择({{ getCheckList.length }})</span
          >
        </section>
      </div>
    </u-sticky>
    <section v-if="getFuncAreas.length > 0" class="menuConfig__checkedList">
      <checked-list
        :show.sync="canShowCheck"
        :checkList="getCheckList"
        :menuHeight="menuHeight"
        :featureArr="getCurrentTab"
        :configData.sync="configData"
        :htmlConfig="htmlConfig"
      ></checked-list>
    </section>

    <apiot-toast
      v-if="mainLoading && getFuncAreas.length > 0"
      status="loading"
      :isFull="true"
    ></apiot-toast>

    <!-- 实际界面区1-->
    <tab-page v-if="getFuncAreas.length > 0">
      <template v-for="area in getFuncAreas">
        <div
          class="menuConfig__tab"
          :key="area.compId"
          v-if="area.compName !== 'BtnsArea'"
        >
          <div class="menuConfig__tab--c">
            <config-list
              v-if="area.compName === 'CardMain'"
              ref="listConfig"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @switchType="switchShowType"
            ></config-list>

            <config-tree
              v-else-if="
                area.compName === 'TreeMain' || area.compName === 'MultiTree'
              "
              ref="treeConfig"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @switchType="switchShowType"
            ></config-tree>

            <tree-device-pos
              v-else-if="area.compName === 'DevicePosTree'"
              ref="DevicePosTree"
              :tabId="getCurrentTab.compId"
              :funcConfig="area"
              :htmlConfig="htmlConfig"
              :configData.sync="configData"
              :menuHeight="menuHeight"
              @switchType="switchShowType"
            ></tree-device-pos>
          </div>
        </div>
      </template>
      <view
        v-if="getCurrentTab.showTabBtn || htmlConfig.isProcess"
        class="menuConfig__tab--btns"
      >
        <tab-btns
          :tabProp="canShowTablist[current]"
          :tabId="getCurrentTab.compId"
          :htmlConfig="htmlConfig"
          :showTabBtn="getCurrentTab.showTabBtn"
          :featureArr="getFuncAreas.slice(1)"
          :isTabBtn="true"
        ></tab-btns>
      </view>
    </tab-page>
  </view>
</template>

<script>
import TabPage from './TabPage';
import ConfigList from './ConfigMain/ConfigList';
import configTree from './ConfigMain/ConfigTree';
import TreeDevicePos from './ConfigMain/ConfigTree/TreeDevicePos.vue';
import TabBtns from './ConfigMain/ConfigBtns/TabBtns.vue';
import CheckedList from './SelectDataCheckedList';

import mainMixin from './mainMixin';

export default {
  name: 'SelectDataProp',

  mixins: [mainMixin],

  props: {
    menuConfig: {
      type: Object
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    menuStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    menuHeight: Number,
    popTitle: {
      type: String,
      default: '选择'
    }
  },

  components: {
    TabPage,
    ConfigList,
    configTree,
    TabBtns,
    TreeDevicePos,
    CheckedList
  },

  data() {
    return {
      showType: 2, // 当前展示类型 1=列表；2=树;只有数据选择弹出框时有用
      // 是否显示已经选中的列表
      canShowCheck: false,
      mainLoading: true,
      getMenuPer: null // 按钮不需要走权限
    };
  },

  computed: {
    getCheckList() {
      const { funcCheckObj, getFuncAreas } = this;
      const area = getFuncAreas.find((item) => item.areaType === 1);
      if (!area) return [];
      return funcCheckObj[area.compId] || [];
    },
    // 顶部固定高度
    customBar() {
      let height = 15;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    }
  },

  watch: {
    'getAllPane.tabObj': function (newV) {
      // 需要隐藏的tab
      const hiddenTabsArr = [];
      // 所有需要隐藏的tab去重
      const result = Array.from(new Set(hiddenTabsArr));
      const tabs = [];
      Object.keys(newV).forEach((key) => {
        if (!result.includes(key)) tabs.push(newV[key]);
      });
      this.canShowTablist = [...tabs];
    }
  },

  methods: {
    clickTrigger() {},
    switchLoadingArea() {},
    // 显示已经选中的值
    showChecks() {
      if (this.getCheckList.length === 0 || this.canShowCheck) return;
      this.canShowCheck = true;
    },
    // 树和列表切换
    switchShowType(type) {
      this.showType = type;
      this.changeAreaType(this.configData);
    }
  },
  created() {
    this.onlyFlag = this._uid;
    this.htmlConfig = { ...this.menuConfig };
  }
};
</script>

<style lang='scss' scoped>
.popBox__selectMsg {
  padding: 0 30rpx;
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #333333;
  @include fontBlob(500);
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  background: #fff;
}
.menuConfig {
  height: 100%;
  &__checkedList {
    position: relative;
  }
  &__tab {
    display: flex;
    flex-direction: column;

    &--c {
      flex: 1;
    }
    &--btns {
      flex-shrink: 0;
    }
  }
}
</style>
