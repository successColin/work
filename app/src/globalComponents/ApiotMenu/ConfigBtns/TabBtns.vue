<!--
 * @Author: sss
 * @Date: 2021-12-27 13:52:16
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-27 13:52:16
 * @Desc: 配置-tab区按钮
-->
<template>
  <view
    class="tabBtns"
    :class="[btnSort !== 2 ? 'row' : 'column', funcConfig.labelPosition]"
    v-if="tabBtnList.length > 0"
  >
    <template v-if="!canDesign">
      <div v-if="btnSort === 2" class="tabBtns__column">
        <btns-column
          :list="tabBtnList"
          :type="btnsProp.appStyle"
          @click="handleClick"
        ></btns-column>
      </div>
      <div v-else class="tabBtns__row" :class="[isTabBtn ? 'btn_bottom' : '']">
        <tab-btns-row
          ref="btnsRow"
          :list="isSeparate ? tabConfigBtns : tabBtnList"
          :processBtns="processBtns"
          :type="btnsProp.appStyle"
          :isProcess="htmlConfig.isProcess"
          @click="handleClick"
        ></tab-btns-row>
      </div>
    </template>
    <template v-else>
      <div class="btn_bottom">
        <div class="batchSure">
          <div class="batchSure__item">
            <check-box
              class="batchSure__item"
              @checked="checked"
              @unchecked="unchecked"
              >全选</check-box
            >
          </div>
          <div class="batchSure__item batchSure__btn">
            <apiot-button
              btnClass="nosys"
              size="medium"
              shape="circle"
              :hair-line="false"
              :custom-style="{
                background: '#F1F3F6',
              }"
              @click="batchCancel"
            >
              取消
            </apiot-button>
          </div>
          <div class="batchSure__item batchSure__btn">
            <apiot-button
              btnClass="nosys"
              type="primary"
              size="medium"
              shape="circle"
              :hair-line="false"
              :custom-style="{
                background: '#F1F3F6',
              }"
              @click="batchSure"
            >
              确定
            </apiot-button>
          </div>
        </div>
      </div>
    </template>
    <apiot-modal ref="apiotModal"></apiot-modal>
    <u-toast ref="uToast"></u-toast>
    <process-op
      v-if="htmlConfig.isProcess && showProcessOp"
      :oprationInfo="btnInfo"
      :config="processOpConfig"
      @cancel="cancelProcessOP"
    ></process-op>
  </view>
</template>

<script>
import ProcessOp from './ProcessOP';
import TabBtnsRow from './BtnsRow/TabBtnsRow.vue';
import BtnsColumn from './BtnsColumn';
import CheckBox from './Common/Checkbox.vue';
import compMixin from '../compMixin';
import btnMixin from './btnMixin';

export default {
  name: 'tabBtns',
  components: { TabBtnsRow, BtnsColumn, CheckBox, ProcessOp },

  mixins: [compMixin, btnMixin],

  provide() {
    return {
      getProcessForm: this.getProcessForm
    };
  },

  props: {
    // 是否显示tab区按钮
    showTabBtn: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      showProcessOp: false
    };
  },

  computed: {
    // tab区按钮需要考虑审批按钮
    // 如果有审批按钮必选是横向排布的
    btnSort() {
      const { appSort } = this.btnsProp;
      const { isProcess } = this.htmlConfig;

      let sort = appSort;
      if (isProcess) sort = 1;
      return sort;
    },
    // tab区按钮样式
    tabBtnStyle() {
      const { isNullConfigBtn } = this;
      const { isProcess } = this.htmlConfig;
      if (isProcess && isNullConfigBtn) return 3;
      return this.btnsProp.appStyle;
    },
    // tab区按钮
    tabConfigBtns() {
      const { showTabBtn } = this;
      if (!showTabBtn) return [];
      return this.list;
    },
    // 流程操作基本配置信息
    processOpConfig() {
      const { instanceId, processNodeId } = this.htmlConfig;
      const { workflowVersionId } = this.processConfig;
      return { instanceId, nodeId: processNodeId, workflowVersionId };
    },
    // 流程节点配置信息
    processConfig() {
      const { processNodeId, isProcess } = this.htmlConfig;
      if (!isProcess) return {};
      const { processConfigs } = this.$store.state.process;
      return processConfigs[processNodeId] || {};
    },
    // 流程节点按钮
    processBtns() {
      const { buttonAttributes, allowReferral, allowAddCheck, allowRejectTo, workflowVersionId } =
        this.processConfig;
      const { instanceId, processNodeId } = this.htmlConfig;

      const btnList = [];
      const baseConfig = {
        isProcess: true,
        iconType: 1,
        workflowVersionId,
        instanceId,
        processNodeId,
        allowRejectTo
      };
      // 是否允许转审
      if (allowReferral) {
        btnList.push({
          compId: 'static_zhuanshen',
          name: '转审',
          iconFont: 'appIcon-zhuanshen',
          iconColor: '#FAB71C',
          ...baseConfig
        });
      }
      // 是否允许加签
      if (allowAddCheck) {
        btnList.push({
          compId: 'static_jiaqian',
          name: '加签',
          iconFont: 'appIcon-jiaqian',
          iconColor: '#FC8256',
          ...baseConfig
        });
      }
      // 通过，驳回按钮
      if (buttonAttributes) {
        const { reasonForRejectionRequired } = buttonAttributes;
        btnList.push({
          compId: 'static_tongguo',
          name: buttonAttributes.passText,
          reasonForRejectionRequired,
          iconFont: 'appIcon-tongguo',
          iconColor: '#34C7BE',
          ...baseConfig
        });
        btnList.push({
          compId: 'static_bohui',
          name: buttonAttributes.rejectText,
          reasonForRejectionRequired,
          iconFont: 'appIcon-bohui',
          iconColor: '#EE5E5E',
          ...baseConfig
        });
      }

      return btnList;
    },
    // tab区按钮需要考虑流程按钮
    tabBtnList() {
      const { tabConfigBtns, processBtns } = this;
      const { isProcess } = this.htmlConfig;
      if (isProcess) return tabConfigBtns.concat(processBtns);
      return tabConfigBtns;
    },
    // 按钮个数
    isSeparate() {
      const { isNullConfigBtn } = this;
      const { isProcess } = this.htmlConfig;
      if (isProcess && !isNullConfigBtn) return this.tabBtnList.length > 4;
      return false;
    },
    isNullConfigBtn() {
      return this.tabConfigBtns.length === 0;
    }
  },

  methods: {
    // 审批按钮点击1
    processClick() {
      const { compId } = this.btnInfo;
      if (compId === 'static_jiaqian' || compId === 'static_zhuanshen') {
        uni.navigateTo({
          url: '/PagesSelectUser/index'
        });
        return;
      }
      this.showProcessOp = true;
    },
    cancelProcessOP() {
      this.showProcessOp = false;
    },
    getProcessForm() {
      return this.resolveBatchParams(this.getFuncAreas());
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'tabBtns';
@include setBtnStyle($--name);
</style>
