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
    <apiot-modal
      v-if="htmlConfig.isProcess"
      ref="processModal"
      position="bottom"
      cancelColor="#F1F3F6"
      :titleStyle="{ fontWeight: 600, textAlign: 'left' }"
    >
      <div class="processModal__textarea">
        <p class="processModal__textarea--tip">审批意见</p>
        <apiot-textarea></apiot-textarea>
      </div>
    </apiot-modal>
  </view>
</template>

<script>
import TabBtnsRow from './BtnsRow/TabBtnsRow.vue';
import BtnsColumn from './BtnsColumn';
import CheckBox from './Common/Checkbox.vue';
import compMixin from '../compMixin';
import btnMixin from './btnMixin';

export default {
  name: 'tabBtns',
  components: { TabBtnsRow, BtnsColumn, CheckBox },

  mixins: [compMixin, btnMixin],

  props: {
    // 是否显示tab区按钮
    showTabBtn: {
      type: Boolean,
      default: true
    }
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
    // 流程节点配置信息
    processConfig() {
      const { processNodeId, isProcess } = this.htmlConfig;
      if (!isProcess) return {};
      console.log(`tabConfigBtns=================${processNodeId}`);
      const { processConfigs } = this.$store.state.process;
      console.log(processConfigs);
      return processConfigs[processNodeId] || {};
    },
    // 流程节点按钮
    processBtns() {
      const { buttonAttributes, allowReferral, allowAddCheck } = this.processConfig;

      const btnList = [];
      // 是否允许转审
      if (allowReferral) {
        btnList.push({
          compId: 'static_zhuanshen',
          name: '转审',
          iconFont: 'appIcon-zhuanshen',
          iconType: 1,
          iconColor: '#FAB71C',
          isProcess: true
        });
      }
      // 是否允许加签
      if (allowAddCheck) {
        btnList.push({
          compId: 'static_jiaqian',
          name: '加签',
          iconFont: 'appIcon-jiaqian',
          iconType: 1,
          iconColor: '#FC8256',
          isProcess: true
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
          iconType: 1,
          iconColor: '#34C7BE',
          isProcess: true
        });
        btnList.push({
          compId: 'static_bohui',
          name: buttonAttributes.rejectText,
          reasonForRejectionRequired,
          iconFont: 'appIcon-bohui',
          iconType: 1,
          iconColor: '#EE5E5E',
          isProcess: true
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
    async processClick() {
      await this.$refs.processModal.showAsyncModal({
        title: '审批通过'
      });
    }
  },

  mounted() {
    console.log('tabBtn=================');
    console.log(this.$store.state.process.processConfigs);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'tabBtns';
@include setBtnStyle($--name);

.processModal__textarea {
  margin: 44rpx 0 275rpx 0;
  &--tip {
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #555555;
    text-align: left;
  }
}
</style>
