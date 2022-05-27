<!--
 * @Descripttion: 个人中心
 * @version:
 * @Author: tjf
 * @Date: 2021-05-15 11:06:45
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-28 09:21:30
-->
<!-- treeTable -->
<template>
  <section class="user-mask">
    <div class="user" v-if="!tenantVisible && userInfo">
      <div class="user__header">
        <div class="avatar-wrap">
          <user-avatar
            v-if="userInfo.username"
            :userItem="userInfo"
            :onlyAvatar="true"
            :large="true"
          ></user-avatar>
        </div>
        <div class="info">
          <p :title="userInfo.username" class="info__name">
            {{ userInfo.username }}
          </p>
          <p :title="userInfo.telephone">{{ userInfo.telephone }}</p>
          <p :title="userInfo.signature">{{ userInfo.signature || '' }}</p>
        </div>
      </div>
      <div class="user__content">
        <ul>
          <li>
            <span
              class="team-name"
              :title="userInfo.tenantVO && userInfo.tenantVO.tenantName"
            >
              {{ userInfo.tenantVO && userInfo.tenantVO.tenantName }}
            </span>
            <span
              class="status"
              v-if="userInfo.tenantVO && userInfo.tenantVO.createByMe"
            >
              {{ $t('userCenter.creatByMe') }}
            </span>
            <span class="status" v-else>{{ $t('userCenter.joined') }}</span>
            <span class="switch" @click="openCenter('tenant')">
              <i class="iconfont icon-qiehuan"></i>{{ $t('userCenter.switch') }}
            </span>
          </li>
          <li class="user__content__li" @click="openCenter('BasicInfo')">
            {{ $t('userCenter.basicInfo') }}
          </li>
          <li class="user__content__li" @click="openCenter('AccountSecurity')">
            {{ $t('userCenter.accountSecurity') }}
          </li>
          <li class="user__content__li" @click="openCenter('VersionUpdate')">
            {{ $t('userCenter.versionUpdate') }}
          </li>
        </ul>
      </div>
      <div class="user__bottom">
        <div class="logout" @click="doLogout">
          {{ $t('userCenter.logout') }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import { logout } from '@/api/userCenter.js';

export default {
  components: {
    userAvatar
  },
  name: 'userInfo',
  data() {
    return {
      tableData: [],
      tenantVisible: false
    };
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return null;
      }
    },
    userCenter: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {},
  mounted() {
    // this.getUserList();
  },
  methods: {
    openCenter(type) {
      const center = {
        visible: true,
        showType: type
      };
      this.$emit('update:userCenter', center);
      this.$emit('update:isShowUserInfo', false);
      setTimeout(() => {
        this.$emit('update:isShowUserInfo', true);
      }, 50);
    },
    doLogout() {
      logout().then(() => {
        this.$router.push('/login');
      });
    }
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
.user-mask {
  width: 320px;
  height: 380px;
  padding-top: 18px;
  position: fixed;
  top: 42px;
  right: 10px;
  color: #333333;
  text-align: left;
  box-sizing: border-box;
  z-index: 1001;
  .user {
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    overflow: hidden;
    &__header {
      height: 110px;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      .avatar-wrap {
        width: 80px;
        padding-top: 20px;
        padding-left: 20px;
        box-sizing: border-box;
      }
      .info {
        flex: 1;
        line-height: 190%;
        padding: 16px 10px 16px 0;
        box-sizing: border-box;
        flex-shrink: 0;
        width: 240px;
        &__name {
          font-size: 16px;
        }
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    &__content {
      padding: 10px;
      height: 206px;
      box-sizing: border-box;
      ul > li {
        height: 36px;
        line-height: 36px;
        padding-left: 18px;
        box-sizing: border-box;
        border-radius: 4px;
        .status {
          height: 20px;
          background: #f1f7ff;
          border-radius: 4px;
          color: #4689f5;
          line-height: 20px;
          padding: 0 5px;
          float: left;
          margin: 8px 2px;
        }
        .switch {
          color: #4689f5;
          float: right;
          cursor: pointer;
          &:hover {
            color: #6ba1f7;
          }
        }
        .team-name {
          max-width: 100px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          float: left;
        }
      }
      &__li {
        &:hover {
          background: #f1f7ff;
        }
      }
    }
    &__bottom {
      height: 46px;
      text-align: center;
      line-height: 46px;
      border-top: 1px solid #e9e9e9;
      &:hover {
        background: #f1f7ff;
      }
    }
  }
}
</style>
