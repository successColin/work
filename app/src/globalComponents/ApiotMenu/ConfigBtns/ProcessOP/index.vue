<!--
 * @Author: sss
 * @Date: 2022-06-07 13:46:51
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-07 13:46:51
 * @Desc: 流程操作
-->
<template>
  <section>
    <apiot-modal
      ref="processModal"
      position="bottom"
      cancelColor="#F1F3F6"
      :titleStyle="{ fontWeight: 600, textAlign: 'left' }"
    >
      <div class="processModal form noLeftForm hasBorder">
        <u-form labelPosition="top" :model="opForm" ref="loginAccountForm">
          <u-form-item
            class="form--item"
            prop="username"
            v-if="
              oprationInfo.compId === 'static_bohui' &&
              oprationInfo.allowRejectTo
            "
            label="退回并重新进行审批"
          >
            <apiot-select-down
              :value="opForm.aa"
              :list="selectList"
            ></apiot-select-down>
          </u-form-item>
          <u-form-item class="form--item" prop="username" label="审批意见">
            <apiot-textarea
              :value="opForm.memo"
              placeholder="请填写审批意见…"
            ></apiot-textarea>
          </u-form-item>
        </u-form>
      </div>
    </apiot-modal>
  </section>
</template>

<script>
import { getRejectNodes } from '@/api/pagesProcess.js';

export default {
  components: {},

  inject: ['getProcessForm'],

  props: {
    // 流程操作信息
    oprationInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      selectList: [],
      opForm: {
        aa: '',
        memo: ''
      }
    };
  },

  computed: {},

  methods: {
    async showProcess() {
      try {
        const { name } = this.oprationInfo;
        await this.$refs.processModal.showAsyncModal({
          title: `审批${name}`
        });
      } catch (error) {
        this.$emit('cancel');
      }
    },
    async getRejectNodes() {
      try {
        const param = this.config;
        console.log(param);
        const result = await getRejectNodes(this.config);
        console.log(result);
        const list = [];
        result.forEach((item) => {
          list.push({ name: item.nodeTitle, value: item.nodeType });
        });
        this.selectList = [...list];
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  },

  mounted() {
    console.log(this.oprationInfo);
    const { compId, allowRejectTo } = this.oprationInfo;
    if (compId === 'static_bohui' && allowRejectTo) this.getRejectNodes();
    this.showProcess();
  }
};
</script>

<style lang='scss' scoped>
.processModal {
  margin: 44rpx 0 275rpx 0;
  &__tip {
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #555555;
    text-align: left;
  }
}
</style>
