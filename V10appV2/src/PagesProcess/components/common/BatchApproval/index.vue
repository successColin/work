<!--
 * @Descripttion: 批量审批
 * @Author: ytx
 * @Date: 2023-07-07 15:39:19
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-07 15:39:19
-->
<template>
  <section>
    <apiot-modal
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
            prop="memo"
            :label="placeholder"
            :required="btnInfo.required"
          >
            <apiot-textarea
              v-model="opForm.memo"
              :placeholder="`请填写${placeholder}…`"
            ></apiot-textarea>
          </u-form-item>
          <u-form-item class="form--item" prop="ccUserIds" label="抄送人">
            <apiot-choose-user
              v-model="ccUserIds"
              title="选择抄送人"
            ></apiot-choose-user>
          </u-form-item>
        </u-form>
      </div>
    </apiot-modal>
    <u-toast ref="uToast"></u-toast>
  </section>
</template>

<script>
import { batchReject, batchAgree } from '@/api/pagesProcess.js';

export default {
  components: {},

  props: {
    // 流程操作信息
    btnInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    referralUserId: [String, Number]
  },

  data() {
    return {
      opForm: {
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
      const arry = this.ccUserIds.map((user) => user.id);

      if (arry.length === 0) return '';
      return arry.join(',');
    }
  },

  methods: {
    // 通过
    async batchAgree() {
      try {
        await batchAgree({
          memo: this.opForm.memo,
          ccUserIds: this.ccUserIdsStr,
          taskIds: this.btnInfo.taskIds
        });
        this.$emit('cancel', true, '批量通过');
      } catch (error) {
        console.log(error);
        this.$refs.uToast.show({
          type: 'error',
          message: error.message
        });
      }
    },
    // 驳回
    async batchReject() {
      try {
        const { opForm, ccUserIdsStr } = this;
        await batchReject({
          memo: this.opForm.memo,
          ccUserIds: this.ccUserIdsStr,
          taskIds: this.btnInfo.taskIds
        });
        this.$emit('cancel', true, '批量驳回');
      } catch (error) {
        this.$refs.uToast.show({
          type: 'error',
          message: error.message
        });
      }
    },
    async confirm() {
      try {
        const { compId } = this.btnInfo;
        console.log(this.opForm);
        await this.$refs.processForm.validate();

        if (compId === 'static_tongguo') {
          // 通过
          this.batchAgree();
        } else if (compId === 'static_bohui') {
          // 驳回
          this.batchReject();
        }
      } catch (error) {
        console.log(error);
      }
    },
    cancel() {
      this.$emit('cancel', false);
    }
  },

  mounted() {
    this.show = true;
    this.$nextTick(() => {
      console.log(this.btnInfo);
      if (!this.btnInfo.required) return;
      const rules = {
        memo: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: this.placeholder }),
            trigger: ['blur', 'change']
          }
        ]
      };
      this.$refs.processForm.setRules(rules);
    });
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
  }
}
</style>
