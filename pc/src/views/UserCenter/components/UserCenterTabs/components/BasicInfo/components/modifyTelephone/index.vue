<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-08-11 10:34:27
 * @Des: 个人中心-修改密码
-->
<template>
  <section class="telephone-dialog">
    <apiot-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :title="
        $t('common.modify') +
        (changeType === 'phone'
          ? $t('userCenter.telephone')
          : $t('userCenter.email'))
      "
      @sure-click="sureClick"
      @cancle-click="cancleClick"
      :modal-append-to-body="false"
      :destroy-on-close="true"
    >
      <div class="telephone">
        <div class="telephone__content">
          <el-form
            label-position="top"
            ref="telephone"
            :rules="changeType === 'phone' ? rules : erules"
            label-width="80px"
            :model="changeType === 'phone' ? telData : emailData"
          >
            <el-form-item
              :label="
                changeType === 'phone'
                  ? $t('userCenter.currentTelphone')
                  : $t('userCenter.currentEmail')
              "
              :prop="changeType === 'phone' ? 'oldTelephone' : 'oldEmail'"
            >
              <el-input
                v-if="changeType === 'phone'"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('userCenter.currentTelphone'),
                  })
                "
                v-model="telData.oldTelephone"
                disabled
              >
                <template slot="prepend">+86</template>
              </el-input>
              <el-input
                v-else
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('userCenter.currentEmail'),
                  })
                "
                v-model="emailData.oldEmail"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="
                isCheckByPassword
                  ? $t('login.password')
                  : $t('login.verificationCode')
              "
              :prop="isCheckByPassword ? 'password' : 'oldMessageVerifyCode'"
            >
              <!--
                验证码
                v-model:值
                prependWidth：左侧宽度
                account：手机号
                verifyType：类型 REGISTER 注册或修改密码
              -->
              <input-getcode
                v-if="changeType === 'phone' && !isCheckByPassword"
                v-model.number="telData.oldMessageVerifyCode"
                prependWidth="0"
                slotType="suffix"
                :account="telData.oldTelephone"
                verifyType="REPLACE_TELEPHONE"
              ></input-getcode>
              <input-getcode
                v-if="changeType !== 'phone' && !isCheckByPassword"
                v-model.number="emailData.oldMessageVerifyCode"
                prependWidth="0"
                slotType="suffix"
                :account="emailData.oldEmail"
                verifyType="REPLACE_EMAIL"
                messageType="EMAIL"
              ></input-getcode>
              <input-password
                v-if="changeType !== 'phone' && isCheckByPassword"
                v-model="emailData.password"
                prependWidth="70px"
                :placeholder="$t('userCenter.enterPassword')"
                :isShow="true"
              >
              </input-password>
              <input-password
                v-if="changeType === 'phone' && isCheckByPassword"
                v-model="telData.password"
                prependWidth="70px"
                :placeholder="$t('userCenter.enterPassword')"
                :isShow="true"
              >
              </input-password>
              <p class="switch-password">
                {{
                  !isCheckByPassword
                    ? $t('userCenter.codeTip1')
                    : $t('userCenter.codeTip3')
                }}
                <span v-if="isCheckByPassword" @click="changeCheckType">{{
                  changeType === 'phone'
                    ? $t('userCenter.checkPhone')
                    : $t('userCenter.checkEmail')
                }}</span>
                <span v-else @click="changeCheckType">{{
                  $t('userCenter.checkPassword')
                }}</span>
                {{ $t('userCenter.codeTip2') }}
              </p>
            </el-form-item>
            <el-form-item
              :label="
                changeType === 'phone'
                  ? $t('userCenter.newTelphone')
                  : $t('userCenter.newEmail')
              "
              :prop="changeType === 'phone' ? 'telephone' : 'email'"
            >
              <el-input
                v-if="changeType === 'phone'"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('userCenter.newTelphone'),
                  })
                "
                maxlength="11"
                v-model="telData.telephone"
              >
              </el-input>
              <el-input
                v-else
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('userCenter.newEmail'),
                  })
                "
                v-model="emailData.email"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('login.verificationCode')"
              prop="messageVerifyCode"
            >
              <!--
                验证码
                v-model:值
                prependWidth：左侧宽度
                account：手机号
                verifyType：类型 REGISTER 注册或修改密码
              -->
              <input-getcode
                v-if="changeType === 'phone'"
                v-model.number="telData.messageVerifyCode"
                prependWidth="0"
                slotType="suffix"
                :account="telData.telephone"
                verifyType="REPLACE_TELEPHONE"
              ></input-getcode>
              <input-getcode
                v-else
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
        <!-- <div class="password__footer">
          <apiot-button @click="cancleClick">{{$t('common.cancle')}}</apiot-button>
          <apiot-button type="primary"
            :loading="loading"
            @click.stop.prevent="sureClick">
            {{$t('common.sure')}}
          </apiot-button>
        </div> -->
      </div>
    </apiot-dialog>
  </section>
</template>

<script>
import { editUserEmail, editUserTelphone } from '@/api/userCenter.js';
import { Encrypt } from '@/utils/utils';
import { email, phoneNumber } from '@/utils/validationRules';
import InputGetcode from '@/views/Login/components/InputGetcode';

export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    changeType: {
      type: String,
      default() {
        return 'phone';
      }
    }
  },
  data() {
    return {
      isEditName: false,
      isEditSign: false,
      isCheckByPassword: false,
      telData: {
        oldTelephone: this.userInfo.telephone,
        oldMessageVerifyCode: '',
        password: '',
        telephone: '',
        messageVerifyCode: ''
      },
      emailData: {
        oldEmail: this.userInfo.email,
        oldMessageVerifyCode: '',
        password: '',
        email: '',
        messageVerifyCode: ''
      },
      rules: {
        oldTelephone: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('userCenter.telephone')
            }),
            trigger: ['blur', 'change']
          }
        ],
        oldMessageVerifyCode: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('login.verificationCode')
            }),
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('login.password')
            }),
            trigger: ['blur', 'change']
          }
        ],
        telephone: [{ required: true, validator: phoneNumber, trigger: ['blur', 'change'] }],
        messageVerifyCode: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('login.verificationCode')
            }),
            trigger: ['blur', 'change']
          }
        ]
      },
      erules: {
        oldEmail: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('userCenter.email')
            }),
            trigger: ['blur', 'change']
          }
        ],
        oldMessageVerifyCode: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('login.verificationCode')
            }),
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('login.password')
            }),
            trigger: ['blur', 'change']
          }
        ],
        email: [{ required: true, validator: email, trigger: ['blur', 'change'] }],
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
      this.$refs.telephone.validate((valid) => {
        if (valid) {
          this.changeTelphone();
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    cancleClick() {
      this.telData = {
        oldTelephone: this.userInfo.telephone,
        oldMessageVerifyCode: '',
        password: '',
        telephone: '',
        messageVerifyCode: ''
      };
      this.emailData = {
        oldEmail: this.userInfo.email,
        oldMessageVerifyCode: '',
        password: '',
        email: '',
        messageVerifyCode: ''
      };
      // this.$emit('update:visible', false);
    },
    async changeTelphone() {
      try {
        if (this.isSubmit) return;
        this.isSubmit = true;
        let api = editUserEmail;
        let param = {
          ...this.emailData,
          password: Encrypt(this.emailData.password)
        };
        let str = this.$t('userCenter.change');
        if (this.changeType === 'phone') {
          api = editUserTelphone;
          param = {
            ...this.telData,
            password: Encrypt(this.telData.password)
          };
          str = `${str}${this.$t('userCenter.telephone')}:${this.telData.telephone}`;
        } else {
          str = `${str}${this.$t('userCenter.email')}:${this.emailData.email}`;
        }
        param.logData = str;
        await api(param);
        this.isSubmit = false;
        this.$message.success(this.$t('common.successfullyModified'));
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
    },
    changeCheckType() {
      this.isCheckByPassword = !this.isCheckByPassword;
    }
  }
};
</script>

<style lang='scss' scoped>
.telephone-dialog {
  width: 100%;
  overflow: hidden;
  font-size: 13px;
  .telephone {
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
