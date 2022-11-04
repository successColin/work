<!--
 * @Author: sss
 * @Date: 2021-12-27 13:52:16
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-27 13:52:16
 * @Desc: 配置-功能区按钮
-->
<template>
  <view
    class="configBtns"
    :class="[
      btnsProp.appSort !== 2 ? 'row' : 'column',
      funcConfig.labelPosition,
    ]"
    v-if="list.length > 0 && !!htmlConfig.isCcTom"
  >
    <template v-if="!canDesign">
      <div v-if="btnsProp.appSort === 2" class="configBtns__column">
        <btns-column
          :list="list"
          :type="btnsProp.appStyle"
          @click="handleClick"
        ></btns-column>
      </div>
      <div
        v-else
        class="configBtns__row"
        :class="[isTabBtn ? 'btn_bottom' : '']"
      >
        <btns-row
          ref="btnsRow"
          :list="list"
          :type="btnsProp.appStyle"
          @click="handleClick"
        ></btns-row>
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
  </view>
</template>

<script>
// batchSave, batchDelete
import BtnsRow from './BtnsRow';
import BtnsColumn from './BtnsColumn';
import CheckBox from './Common/Checkbox.vue';
import btnMixin from './btnMixin';

import compMixin from '../compMixin';

export default {
  name: 'configBtns',
  components: { BtnsRow, BtnsColumn, CheckBox },

  mixins: [compMixin, btnMixin],

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'configBtns';
@include setBtnStyle($--name);
</style>
