<!--
 * @Descripttion:   绑定邮箱
 * @version:
 * @Author: tjf
 * @Date: 2021-05-19 11:55:21
 * @LastEditors: tjf
 * @LastEditTime: 2021-08-11 10:41:29
-->
<template>
  <section class="telphone-dialog">
    <apiot-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :title="$t('userCenter.bind') + $t('userCenter.email')"
      @sure-click="sureClick"
      @cancle-click="cancleClick"
      :modal-append-to-body="false"
      destroy-on-close
    >
      <div class="telphone">
        <div class="telphone__content">
          <el-form
            label-position="top"
            ref="telphone"
            :rules="rules"
            label-width="80px"
            :model="emailData"
          >
            <el-form-item :label="$t('userCenter.email')" prop="email">
              <el-input placeholder="请输入内容" v-model="emailData.email">
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('login.verificationCode')"
              prop="oldMessageVerifyCode"
            >
              <!--
                验证码
                v-model:值
                prependWidth：左侧宽度
                account：手机号
                verifyType：类型 REGISTER 注册或修改密码
              -->
              <input-getcode
                v-model.number="emailData.messageVerifyCode"
                prependWidth="0"
                slotType="suffix"
                :account="emailData.email"
                verifyType="REPLACE_EMAIL"
                messageType="EMAIL"
              ></input-getcode>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </apiot-dialog>
  </section>
</template>

<script>
import { bindUserEmail } from '@/api/userCenter.js';
import InputGetcode from '@/views/Login/components/InputGetcode';

export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      emailData: {
        email: '',
        messageVerifyCode: ''
      },
      rules: {
        telephone: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('userCenter.newEmail')
            }),
            trigger: ['blur', 'change']
          }
        ],
        messageVerifyCode: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('login.verificationCode')
            }),
            trigger: ['blur', 'change']
          }
        ]
      }
    };
  },

  components: {
    InputGetcode
  },

  computed: {},

  mounted() {},

  watch: {},

  methods: {
    sureClick() {
      this.$refs.telphone.validate((valid) => {
        if (valid) {
          this.bindEmail();
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    cancleClick() {
      // this.$emit('update:visible', false);
    },
    async bindEmail() {
      try {
        if (this.isSubmit) return;
        this.isSubmit = true;
        await bindUserEmail(this.emailData);
        this.isSubmit = false;
        this.$message.success(this.$t('common.handleSuccess'));
        this.$emit('getUserCenterInfo');
        this.$emit('update:visible', false);
      } catch (error) {
        this.isSubmit = false;
        if (error.name) {
          return this.$message({
            type: 'warning',
            message: error.name
          });
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.telphone-dialog {
  width: 100%;
  overflow: hidden;
  font-size: 13px;
  .telphone {
    &__content {
      width: 100%;
      padding-top: 16px;
      color: #333333;
      box-sizing: border-box;
    }
    &__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      height: 56px;
      box-sizing: border-box;
      border-top: 1px solid #e9e9e9;
      padding: 11px 30px 0 0;
      text-align: right;
    }
  }
  .whole-line {
    width: 100%;
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 20px;
      position: relative;
    }
    .switch-password {
      position: absolute;
      right: 0px;
      top: -24px;
      text-align: right;
      height: 18px;
      line-height: 18px;
      width: 300px;
      color: #808080;
      font-size: 12px;
      span {
        color: #4689f5;
        cursor: pointer;
      }
    }
  }
}
</style>
