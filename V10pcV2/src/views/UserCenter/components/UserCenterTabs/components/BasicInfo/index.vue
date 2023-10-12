<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-07-21 11:16:40
 * @Des: 个人中心-基本信息
-->
<template>
  <div class="basic">
    <div class="basic__item">
      <label class="basic__item__label">{{ $t('userCenter.avatar') }}</label>
      <div class="basic__item__content">
        <user-avatar
          :userItem="userInfo"
          :onlyAvatar="true"
          :large="true"
        ></user-avatar>
        <div class="basic__item__content__operation">
          <span @click="editAvatar">{{ $t('common.modify') }}</span>
          <input
            @change="putImgToCanv"
            ref="inputFile"
            type="file"
            accept="image/gif, image/jpeg ,image/png"
            style="width: 1px; height: 1px; border: none; opacity: 0"
          />
        </div>
      </div>
    </div>
    <div class="basic__item">
      <label class="basic__item__label even-label">{{
        $t('userCenter.name')
      }}</label>
      <div class="basic__item__content">
        <apiot-input
          v-if="isEditName"
          v-model="info.username"
          ref="username"
          maxlength="30"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('userCenter.name'),
            })
          "
        ></apiot-input>
        <p v-else>{{ info.username }}</p>
        <div class="basic__item__content__operation">
          <span class="m-l-8" v-if="!isEditName" @click="editName(true)">{{
            $t('common.modify')
          }}</span>
          <span v-else @click="saveName">{{ $t('common.save') }}</span>
          <span class="m-l-8" v-if="isEditName" @click="editName(false)">{{
            $t('common.cancle')
          }}</span>
        </div>
      </div>
    </div>
    <div class="basic__item">
      <label class="basic__item__label">{{ $t('userCenter.telephone') }}</label>
      <div class="basic__item__content">
        <p>{{ info.telephone }}</p>
        <div class="basic__item__content__operation">
          <span @click="editTelphone('phone')">{{ $t('common.modify') }}</span>
        </div>
      </div>
    </div>
    <div class="basic__item">
      <label class="basic__item__label even-label">{{
        $t('userCenter.email')
      }}</label>
      <div class="basic__item__content">
        <p>{{ info.email }}</p>
        <div class="basic__item__content__operation">
          <span v-if="info.email" @click="editTelphone('email')">{{
            $t('common.modify')
          }}</span>
          <span v-else @click="bindEmail()">{{ $t('userCenter.bind') }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="basic__item">
      <label class="basic__item__label">{{
        $t('userCenter.bindWechat')
      }}</label>
      <div class="basic__item__content">
        <p>{{ info.wechat }}</p>
        <div class="basic__item__content__operation">
          <span v-if="info.wechat">{{ $t('common.modify') }}</span>
          <span v-else>{{ $t('userCenter.bind') }}</span>
        </div>
      </div>
    </div>
    <div class="basic__item">
      <label class="basic__item__label even-label">{{
        $t('userCenter.bindDingtalk')
      }}</label>
      <div class="basic__item__content">
        <p>{{ info.dingTalk }}</p>
        <div class="basic__item__content__operation">
          <span v-if="info.dingTalk">{{ $t('common.modify') }}</span>
          <span v-else>{{ $t('userCenter.bind') }}</span>
        </div>
      </div>
    </div> -->
    <div class="basic__item" v-if="+loginConfig.ssoTypePc === 2">
      <label class="basic__item__label">绑定浙政钉</label>
      <div class="basic__item__content">
        <p>{{ info.dingTalk }}</p>
        <div class="basic__item__content__operation">
          <span v-if="info.dingTalk" @click="handleZzdBind">{{
            $t('common.modify')
          }}</span>
          <span v-else @click="handleZzdBind">{{ $t('userCenter.bind') }}</span>
        </div>
      </div>
    </div>
    <!-- whole-line -->
    <div
      :class="`basic__item ${+loginConfig.ssoTypePc === 2 ? '' : 'whole-line'}`"
    >
      <label class="basic__item__label even-label">{{
        $t('userCenter.personalSignature')
      }}</label>
      <div class="basic__item__content">
        <p v-if="!isEditSign">{{ info.signature }}</p>
        <apiot-input
          v-else
          v-model="info.signature"
          ref="signature"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('userCenter.personalSignature'),
            })
          "
        ></apiot-input>
        <div class="basic__item__content__operation">
          <span class="m-l-8" v-if="!isEditSign" @click="editSign(true)">{{
            $t('common.modify')
          }}</span>
          <span v-else @click="saveSign">{{ $t('common.save') }}</span>
          <span class="m-l-8" v-if="isEditSign" @click="editSign(false)">{{
            $t('common.cancle')
          }}</span>
        </div>
      </div>
    </div>
    <modify-telephone
      v-if="visibleTelphone"
      v-on="$listeners"
      v-bind="$attrs"
      :visible.sync="visibleTelphone"
      :changeType="changeType"
      :userInfo="userInfo"
    ></modify-telephone>
    <modify-avatar
      v-show="visibleAvatar"
      :visible.sync="visibleAvatar"
      v-on="$listeners"
      v-bind="$attrs"
      ref="avatar"
      :userInfo="userInfo"
    ></modify-avatar>
    <bind-email
      v-show="visibleBindEmail"
      :visible.sync="visibleBindEmail"
      :userInfo="userInfo"
    ></bind-email>
    <apiot-dialog
      width="68%"
      :title="info.dingTalk ? '修改关联浙政钉' : '添加关联浙政钉'"
      :visible.sync="visibleZzd"
      :isShowSure="false"
      :cancle-click="handleZzdBindOk"
    >
      <iframe
        class="Iframe"
        :src="$store.state.globalConfig.zzdScan"
        :frameBorder="0"
        width="210"
        height="280"
        scrolling="no"
      />
    </apiot-dialog>
  </div>
</template>

<script>
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import {
  editUserName,
  editUserSignature,
  getPersonalCenterUser,
} from '@/api/userCenter.js';
import { zwdingtalkScanLogin } from '@/api/login.js';
import modifyTelephone from './components/modifyTelephone/index';
import modifyAvatar from './components/modifyAvatar/index';
import bindEmail from './components/bindEmail/index';

export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isEditName: false,
      isEditSign: false,
      visibleAvatar: false,
      visibleTelphone: false,
      visibleBindEmail: false,
      visibleZzd: false,
      changeType: 'phone',
      info: {},
    };
  },

  components: {
    userAvatar,
    modifyTelephone,
    modifyAvatar,
    bindEmail,
  },

  watch: {
    userInfo(val) {
      this.info = val;
    },
  },

  mounted() {
    this.info = this.userInfo;
    window.addEventListener('message', this.scanCode);
  },

  destroyed() {
    window.removeEventListener('message', this.scanCode);
  },

  computed: {
    loginConfig() {
      return this.$store.state.base.loginConfig;
    },
  },

  methods: {
    async scanCode(e) {
      const code = e.data && e.data.code;
      if (code) {
        await zwdingtalkScanLogin({
          code,
        });
        const res = await getPersonalCenterUser();
        this.info = res;
        this.$store.commit('setUserInfo', res);
      }
    },
    handleZzdBind() {
      this.visibleZzd = true;
    },
    handleZzdBindOk() {
      this.visibleZzd = false;
    },
    editName(type) {
      this.isEditName = type;
      if (!type) {
        this.info.username = this.userInfo.username;
      }
    },
    editSign(type) {
      this.isEditSign = type;
      if (!type) {
        this.info.signature = this.userInfo.signature;
      }
    },
    async saveName() {
      if (!this.info.username) {
        this.$refs.username.focus();
        return this.$message.warning(
          this.$t('placeholder.pleaseEnterAny', {
            any: this.$t('userCenter.name'),
          }),
        );
      }
      const param = {
        username: this.info.username,
      };
      const str = `${this.$t('userCenter.change')}${this.$t(
        'userCenter.name',
      )}:${this.info.username}`;
      param.logData = str;
      await editUserName(param);
      this.isEditName = false;
      this.$emit('getUserCenterInfo');
    },
    async saveSign() {
      if (!this.info.signature) {
        this.$refs.signature.focus();
        return this.$message.warning(
          this.$t('placeholder.pleaseEnterAny', {
            any: this.$t('userCenter.personalSignature'),
          }),
        );
      }
      const param = {
        signature: this.info.signature,
      };
      const str = `${this.$t('userCenter.change')}${this.$t(
        'userCenter.personalSignature',
      )}:${this.info.signature}`;
      param.logData = str;
      await editUserSignature(param);
      this.isEditSign = false;
      this.$emit('getUserCenterInfo');
    },
    editTelphone(type) {
      this.visibleTelphone = true;
      this.changeType = type;
      // console.log(this.changeType);
    },
    editAvatar() {
      this.$refs.inputFile.click();
      // if (this.visibleAvatar) return;
      // this.visibleAvatar = true;
      // this.$refs.avatar.checkImage();
    },
    putImgToCanv(e) {
      const name = e.target.value;
      const nameArr = name.split('.');
      if (nameArr.length !== 2) {
        return this.$message.warning('上传图片格式不正确，请重新上传');
      }
      const ext = nameArr[1];
      if (ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'svg') {
        this.$message.warning('上传图片格式不正确，请重新上传');
      } else {
        this.visibleAvatar = true;
        this.$refs.avatar.forIe9(e);
      }
    },
    clearUploadValue() {
      this.$refs.inputFile.value = '';
    },
    bindEmail() {
      this.visibleBindEmail = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.basic {
  width: 100%;
  overflow: hidden;
  font-size: 13px;
  ::v-deep {
    .el-dialog__body {
      height: 322px;
    }
  }
  &__item {
    width: 50%;
    height: 72px;
    display: inline-flex;
    border-bottom: 1px solid #e9e9e9;
    &__label {
      width: 140px;
      height: 100%;
      background: #fafafa;
      padding: 0 30px;
      line-height: 72px;
      text-align: right;
      box-sizing: border-box;
      flex-shrink: 0;
      border-right: 1px solid #e9e9e9;
    }
    .even-label {
      border-left: 1px solid #e9e9e9;
    }
    &__content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      align-items: center;
      &__operation {
        width: 100px;
        text-align: right;
        color: #4689f5;
        flex-shrink: 0;
        span {
          cursor: pointer;
          &:hover {
            color: #6ba1f7;
          }
        }
      }
    }
  }
  .whole-line {
    width: 100%;
  }
}
.Iframe {
  width: 100%;
  position: relative;
  top: -40px;
}
</style>
