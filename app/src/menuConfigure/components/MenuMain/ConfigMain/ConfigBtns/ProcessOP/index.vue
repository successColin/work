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
      :show.sync="show"
      :automatic="false"
      :titleStyle="{
        fontFamily:
          'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold',
        fontWeight: 600,
        textAlign: 'left',
      }"
      @confirm="confirm"
      @cancel="cancel"
    >
      <div class="processModal form noLeftForm hasBorder">
        <u-form labelPosition="top" :model="opFormValidate" ref="processForm">
          <u-form-item
            class="form--item"
            prop="rejectTargetNodeId"
            v-if="
              oprationInfo.compId === 'static_bohui' &&
              oprationInfo.allowRejectTo
            "
            label="退回并重新进行审批"
            :required="oprationInfo.reasonForRejectionRequired"
          >
            <apiot-select-down
              v-model="opForm.rejectTargetNodeId"
              :list="selectList"
            ></apiot-select-down>
          </u-form-item>
          <u-form-item
            class="form--item"
            prop="memo"
            :label="placeholder"
            :required="oprationInfo.reasonForRejectionRequired"
          >
            <apiot-textarea
              v-model="opForm.memo"
              :placeholder="`请填写${placeholder}…`"
            ></apiot-textarea>
          </u-form-item>
          <u-form-item
            class="form--item"
            prop="ccUserIds"
            label="抄送人"
            formItemClass="formItemClass"
          >
            <apiot-choose-user v-model="ccUserIds"></apiot-choose-user>
          </u-form-item>
        </u-form>
      </div>
    </apiot-modal>
  </section>
</template>

<script>
import { getRejectNodes, referral, flowAgree, flowReject } from '@/api/pagesProcess.js';

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
    },
    referralUserId: [String, Number]
  },

  data() {
    return {
      title: '',
      selectList: [],
      opForm: {
        rejectTargetNodeId: '',
        memo: ''
      },
      placeholder: '审批意见',
      show: false,
      ccUserIds: []
    };
  },

  computed: {
    opFormValidate() {
      return { ...this.opForm };
    },
    ccUserIdsStr() {
      const { ccUserIds } = this;
      const arry = ccUserIds.map((user) => user.id);

      if (arry.length === 0) return '';
      return arry.join(',');
    },
    rule() {
      const { oprationInfo } = this;
      const { reasonForRejectionRequired, compId, allowRejectTo } = oprationInfo;
      // 驳回理由是否必填
      if (!reasonForRejectionRequired) return '';

      const rules = {
        memo: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: this.placeholder }),
            trigger: ['blur', 'change']
          }
        ]
      };
      if (compId === 'static_bohui' && allowRejectTo) {
        rules.rejectTargetNodeId = [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: '驳回' }),
            type: 'number',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['blur', 'change']
          }
        ];
      }
      return rules;
    }
  },

  methods: {
    // 转审
    async referral() {
      try {
        const { config, referralUserId, opForm } = this;
        const form = this.getProcessForm();
        await referral({
          ...config,
          referralUserId,
          compMap: form.compMap,
          memo: opForm.memo
        });

        // 转审后刷新mytodo列表
        this.$bus.$emit('PROCESS_MYTODO');
        uni.navigateBack();
      } catch (error) {
        console.error(error);
      }
    },
    // 通过
    async flowAgree() {
      try {
        const { config, opForm, ccUserIdsStr } = this;
        const form = this.getProcessForm();
        await flowAgree({
          ...config,
          compMap: form.compMap,
          memo: opForm.memo,
          ccUserIds: ccUserIdsStr
        });

        // 转审后刷新mytodo列表
        this.$bus.$emit('PROCESS_MYTODO');
        uni.navigateBack();
      } catch (error) {
        console.error(error);
      }
    },
    // 驳回
    async flowReject() {
      try {
        const { config, opForm, ccUserIdsStr } = this;
        const form = this.getProcessForm();
        await flowReject({ ...config, compMap: form.compMap, ...opForm, ccUserIds: ccUserIdsStr });

        // 转审后刷新mytodo列表
        this.$bus.$emit('PROCESS_MYTODO');
        uni.navigateBack();
      } catch (error) {
        console.error(error);
      }
    },
    async confirm() {
      try {
        const { compId } = this.oprationInfo;
        console.log(this.opForm);
        await this.$refs.processForm.validate();

        // 转审
        if (compId === 'static_zhuanshen') this.referral();
        else if (compId === 'static_tongguo') this.flowAgree(); // 通过
        else if (compId === 'static_bohui') this.flowReject(); // 通过
      } catch (error) {
        console.log(error);
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    async getRejectNodes() {
      try {
        const result = await getRejectNodes(this.config);
        const list = [];
        result.forEach((item) => {
          list.push({ name: item.nodeTitle, value: item.nodeType });
        });
        this.selectList = [...list];
      } catch (error) {
        console.error(error);
      }
    }
  },

  mounted() {
    const { name, compId, allowRejectTo, reasonForRejectionRequired } = this.oprationInfo;
    if (compId === 'static_bohui' && allowRejectTo) this.getRejectNodes();
    // 设置表单校验规则
    let title = name;
    if (compId !== 'static_zhuanshen') title = `审批${name}`;
    else this.placeholder = `${name}说明`;
    this.title = title;
    this.show = true;
    if (compId !== 'static_zhuanshen' && reasonForRejectionRequired) {
      this.$nextTick(() => {
        this.$refs.processForm.setRules(this.rule);
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.processModal {
  margin: 44rpx 0 275rpx 0;
  &__tip {
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-family: $--font-family;
    color: #555555;
    text-align: left;
  }
}
.form {
  ::v-deep {
    .u-form-item__body__left__content__required {
      position: static;
    }
    .formItemClass {
      .u-form-item__body__right,
      .u-form-item__body__right__content__slot {
        overflow: inherit;
      }
    }
  }
}
</style>
