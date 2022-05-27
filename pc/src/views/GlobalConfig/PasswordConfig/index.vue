<template>
  <section class="passwordConfig">
    <ul>
      <li v-for="(item, i) in configArr" :key="`${item.name}_${i}`">
        <div class="leftName">
          <div v-if="!Array.isArray(item.name)">
            {{ item.name }}
          </div>
          <div v-else>
            <div v-for="(val, index) in item.name" :key="index">
              {{ val }}
            </div>
          </div>
        </div>
        <!-- 密码是否加密 -->
        <div v-if="i === 0" class="passwordConfig__separateLayout">
          <apiot-switch
            v-model="isEncryption"
            @change="changeEncryption"
            disabled
            class="passwordConfig__switch"
          ></apiot-switch>
          <apiot-radio v-model="encryptionValue" label="1" disabled>
            <span class="passwordConfig__radio--font">{{
              $t('globalConfig.encryptionModeOne')
            }}</span>
          </apiot-radio>
        </div>
        <!-- 初始密码 -->
        <div v-else-if="i === 1">
          <div :class="['passwordConfig__pswd', pswdStyle]">
            <div :class="[pswdValueStyle]">{{ pswdValue }}</div>
            <i
              :class="['iconfont', pswdIcon]"
              class="fontHover"
              @click="handleChangePasd"
            ></i>
          </div>
          <div class="passwordConfig__operation">
            <apiot-button type="text" @click="handleHistoryPswd">
              {{ $t('globalConfig.modifyHistory') }}
            </apiot-button>
            <div></div>
            <apiot-button type="text" @click="handleUpdatePswd">
              {{ $t('common.modify') }}
            </apiot-button>
          </div>
        </div>
        <!-- 登录账号的密码有效期 -->
        <!-- <div v-else-if="i === 2">
          <div v-if="!isClickPeriodValidity">
            {{ showValueName(periodValidityOptions, periodValidityValue) }}
          </div>
          <apiot-select
            v-else
            v-model="periodValidityValue"
            :options="periodValidityOptions"
            @change="handleChangeSelectVal('periodValidity', $event)"
          ></apiot-select>
          <apiot-button
            type="text"
            class="passwordConfig__operation"
            @click="handlePeriodValidity"
          >
            {{ changeBtnName(isClickPeriodValidity) }}
          </apiot-button>
        </div> -->
        <!-- 登录在线时长 -->
        <div v-else-if="i === 2">
          <div v-if="!isClickOnlineTime">
            {{ showValueName(onlineTimeOptions, onlineTimeVal) }}
          </div>
          <apiot-select
            v-else
            v-model="onlineTimeVal"
            :options="onlineTimeOptions"
            @change="handleChangeSelectVal('onlineTime', $event)"
          ></apiot-select>
          <apiot-button
            type="text"
            class="passwordConfig__operation"
            @click="handleOnlineTime"
          >
            {{ changeBtnName(isClickOnlineTime) }}
          </apiot-button>
        </div>
      </li>
    </ul>
    <!-- 修改密码 -->
    <change-password
      :initialPasswordObj="initialPasswordObj"
      ref="changePassword"
      :visible.sync="dialogVisiblePassword"
      :title="$t('globalConfig.changeInitialPassword')"
      :params="params"
      :initialPassword.sync="initialPassword"
    ></change-password>
    <!-- 历史密码 -->
    <history-password
      ref="historyPassword"
      :visible.sync="dialogVisibleHistory"
      :title="$t('globalConfig.initialPasswordChangeRecord')"
    ></history-password>
  </section>
</template>

<script>
import { getListByKey, updateSysGlobalParameters } from '@/api/globalConfig';
import { Decrypt } from '@/utils/utils';
import ChangePassword from '../components/ChangePassword';
import HistoryPassword from '../components/HistoryPassword';

export default {
  data() {
    return {
      response: [],
      // 固定参数
      params: {},
      // 是否加密
      isEncryption: '1',
      // 加密方式
      encryptionValue: '1',
      // 密码明文和密文切换
      isShowPswd: false,
      // 密码弹出框
      dialogVisiblePassword: false,
      // 修改历史弹出框
      dialogVisibleHistory: false,
      // 是否点击有效期
      isClickPeriodValidity: false,
      // 是否点击
      isClickOnlineTime: false,
      // 下拉框__有效期值
      periodValidityValue: '',
      // 下拉框__在线时长
      onlineTimeVal: '',
      initialPassword: '',
      initialPasswordObj: {} // 初始密码
    };
  },
  components: {
    ChangePassword,
    HistoryPassword
  },
  computed: {
    // 左侧配置
    configArr() {
      return [
        {
          name: this.$t('globalConfig.whetherThePasswordIsEncrypted')
        },
        {
          name: [
            this.$t('globalConfig.newAccountResetPassword'),
            this.$t('globalConfig.initialPassword')
          ]
        },
        // {
        //   name: this.$t('globalConfig.passwordValidityPeriodForLoginAccount')
        // },
        {
          name: this.$t('globalConfig.loginTimeOnline')
        }
      ];
    },
    pswdValue() {
      return this.isShowPswd ? Decrypt(this.initialPassword) : '******************';
    },
    pswdIcon() {
      return this.isShowPswd ? 'icon-mimaxianshi' : 'icon-mimayincang';
    },
    pswdStyle() {
      return this.isShowPswd ? 'passwordConfig__pswd1' : '';
    },
    pswdValueStyle() {
      return this.isShowPswd ? '' : 'passwordConfig__pswd2';
    },
    // 修改 button 状态
    changeBtnName() {
      return function(state) {
        return state ? this.$t('common.save') : this.$t('common.modify');
      };
    },
    // // 有效期下拉数据
    // periodValidityOptions() {
    //   return this.$store.getters.getCurDict('PASSWORD_VALIDITY_PERIOD');
    // },
    // 登录在线时长下拉框数据
    onlineTimeOptions() {
      return this.$store.getters.getCurDict('LOGIN_DURATION');
    },
    // 登录在线时长/登录账号的密码有效期名称
    showValueName() {
      return function(options, val) {
        const obj = options.find((item) => item.value === val);
        return obj && obj.name;
      };
    }
  },
  async activated() {
    await this.$store.dispatch('getCurrentDict', 'PASSWORD_VALIDITY_PERIOD,LOGIN_DURATION');
    this.getListData();
  },
  methods: {
    async changeEncryption(value) {
      const isEncryptionObj = this.response.find(
        (item) => item.attributeKey === 'whetherToEncrypt'
      );
      const params = { ...isEncryptionObj, attributeValue: value };
      await updateSysGlobalParameters({ list: [params] });
      this.$message({
        type: 'success',
        message: this.$t('common.successfullyModified')
      });
    },
    // 获取__当前数据
    async getListData() {
      const res = await getListByKey({ parameterKey: 'ACCOUNT_PASSWORD' });
      this.response = res || [];
      if (this.response.length) {
        // 初始密码
        const initialPasswordObj = this.response.find(
          (item) => item.attributeKey === 'initialPassword'
        );
        this.initialPassword = initialPasswordObj.attributeValue || '';
        this.initialPasswordObj = initialPasswordObj;
        // 是否加密
        const isEncryptionObj = this.response.find(
          (item) => item.attributeKey === 'whetherToEncrypt'
        );
        this.isEncryption = isEncryptionObj.attributeValue;
        // 登录在线时长
        const onlineTimeValObj = this.response.find(
          (item) => item.attributeKey === 'loginDuration'
        );
        this.onlineTimeVal = Number(onlineTimeValObj.attributeValue) || 2;
      }
      // const { globalAccountPassword } = res;
      // if (globalAccountPassword) {
      //   this.params = {
      //     id: res.id,
      //     parameterKey: res.parameterKey,
      //     globalAccountPassword: {
      //       initialPassword: globalAccountPassword.initialPassword,
      //       loginDuration: globalAccountPassword.loginDuration,
      //       passwordValidityPeriod: globalAccountPassword.passwordValidityPeriod,
      //       whetherToEncrypt: globalAccountPassword.whetherToEncrypt
      //     }
      //   };
      //   // 初始密码
      //   this.initialPassword = globalAccountPassword.initialPassword;
      //   // 是否加密
      //   this.isEncryption = globalAccountPassword.whetherToEncrypt;
      //   // 登录账号的密码有效期
      //   this.periodValidityValue = Number(globalAccountPassword.passwordValidityPeriod) || 1;
      //   // 登录在线时长
      //   this.onlineTimeVal = Number(globalAccountPassword.loginDuration) || 2;
      // }
    },
    // 按钮__明文和密文切换
    handleChangePasd() {
      this.isShowPswd = !this.isShowPswd;
    },
    // 按钮__修改初始密码
    handleUpdatePswd() {
      this.dialogVisiblePassword = true;
    },
    // 按钮__修改密码中的历史密码
    handleHistoryPswd() {
      this.dialogVisibleHistory = true;
      this.$refs.historyPassword.getListData();
    },
    // // 按钮__登录账号的密码有效期
    // async handlePeriodValidity() {
    //   this.isClickPeriodValidity = !this.isClickPeriodValidity;
    //   if (!this.isClickPeriodValidity) {
    //     this.params.globalAccountPassword.passwordValidityPeriod = this.periodValidityValue;
    //     await updateSysGlobalParameters(this.params);
    //     this.$message({
    //       type: 'success',
    //       message: this.$t('common.successfullyModified')
    //     });
    //   }
    // },
    // 按钮__登录在线时长
    async handleOnlineTime() {
      this.isClickOnlineTime = !this.isClickOnlineTime;
      if (!this.isClickOnlineTime) {
        const onlineTimeValObj = this.response.find(
          (item) => item.attributeKey === 'loginDuration'
        );
        const params = {
          ...onlineTimeValObj,
          attributeValue: this.onlineTimeVal
        };
        await updateSysGlobalParameters({ list: [params] });
        // this.params.globalAccountPassword.loginDuration = this.onlineTimeVal;
        // this.params.loginDuration = this.onlineTimeVal;
        // // 有个operateType， 1 是新增 2是编辑 3是删除 4是移动
        // this.params.logData = {
        //   operateType: 2,
        //   loginDuration: {
        //     name: this.$t('globalConfig.loginTimeOnline'),
        //     transFormArr: this.$store.getters.getCurDict('LOGIN_DURATION')
        //   }
        // };
        // await updateSysGlobalParameters(this.params);
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
      }
    },
    // 下拉框__获取对象方法
    getSelectFun(option, val) {
      const obj = option.find((item) => item.value === val);
      return obj;
    },
    // 下拉框__改变值
    handleChangeSelectVal(name, val) {
      if (name === 'onlineTime') {
        this.onlineTimeVal = val;
      } else if (name === 'periodValidity') {
        this.periodValidityValue = val;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
$borderColor: 1px solid #e9e9e9;
.passwordConfig {
  ul {
    margin: 10px 10px 0 10px;
    background: #ffffff;
    border: $borderColor;
    border-bottom: 0;
    height: 100%;
    li {
      display: flex;
      height: 72px;
      border-bottom: $borderColor;
      & > div:first-child {
        width: 17%;
        min-width: 200px;
        background: #fafafa;
        display: flex;
        justify-content: center;
        text-align: right;
        font-size: 13px;
        color: #666666;
        flex-direction: column;
        border-right: $borderColor;
        box-sizing: border-box;
        padding-right: 20px;
        & > div:first-child > div:first-child {
          margin-bottom: 6px;
        }
      }
      & > div:last-child {
        flex: 1;
        margin-left: 27px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
      }
    }
  }
  &__switch {
    margin-right: 60px;
  }
  &__radio--font {
    font-size: 13px;
    color: #666666;
  }
  &__pswd {
    & > div,
    .iconfont {
      display: inline-block;
      cursor: pointer;
    }
    .iconfont {
      margin-left: 7px;
      color: #bbc3cd;
      font-size: 16px;
    }
  }
  &__pswd1 {
    display: flex;
  }
  &__pswd2 {
    vertical-align: sub;
  }
  &__separateLayout {
    justify-content: flex-start !important;
  }
  &__operation {
    display: flex;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    align-items: center;
    & > div:nth-child(2) {
      height: 12px;
      border-right: 1px solid $--color-primary;
      margin: 0 14px;
      cursor: auto;
    }
  }
}
::v-deep {
  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #4689f5;
    background-color: #4689f5;
    opacity: 0.5;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    background-color: white;
  }
}
</style>
