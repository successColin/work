<!--
 * @Descripttion: 切换团队
 * @version:
 * @Author: tjf
 * @Date: 2021-05-15 11:06:45
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-31 10:07:32
-->
<template>
  <section class="tenant-dialog">
    <el-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :title="$t('userCenter.switchTenant')"
      close-on-click-modal
      class="curMask"
      :visible="visible"
      :modal-append-to-body="false"
    >
      <div class="tenant" v-if="userInfo">
        <p class="title">我创建的团队</p>
        <ul>
          <li
            v-for="item in createTenantData"
            :key="item.tenantCode"
            :class="
              userInfo.tenantVO &&
              userInfo.tenantVO.tenantCode === item.tenantCode
                ? 'current-tenant'
                : 'tenant-li'
            "
          >
            <span>{{ item.tenantName }}</span>
            <span
              v-if="
                userInfo.tenantVO &&
                userInfo.tenantVO.tenantCode === item.tenantCode
              "
              >当前选中团队</span
            >
            <span class="time" v-else>{{ item.deadlineTime }}</span>
            <span
              class="switch"
              @click="switchTenant(item)"
              v-if="
                userInfo.tenantVO &&
                userInfo.tenantVO.tenantCode !== item.tenantCode
              "
            >
              <i class="iconfont icon-qiehuan"></i>切换
            </span>
          </li>
        </ul>
        <p class="title">我加入的团队</p>
        <ul>
          <li
            v-for="item in addTenantData"
            :key="item.tenantCode"
            :class="
              userInfo.tenantVO &&
              userInfo.tenantVO.tenantCode === item.tenantCode
                ? 'current-tenant'
                : 'tenant-li'
            "
          >
            <span>{{ item.tenantName }}</span>
            <span
              v-if="
                userInfo.tenantVO &&
                userInfo.tenantVO.tenantCode === item.tenantCode
              "
              >当前选中团队</span
            >
            <span class="time" v-else>{{ item.deadlineTime }}</span>
            <span
              v-if="
                userInfo.tenantVO &&
                userInfo.tenantVO.tenantCode !== item.tenantCode
              "
              class="switch"
              @click="switchTenant(item)"
            >
              <i class="iconfont icon-qiehuan"></i>切换
            </span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getPersonalCenterTenantList,
  switchPersonalCenterTenant,
} from '@/api/userCenter.js';

export default {
  name: 'userCenter',
  data() {
    return {
      createTenantData: [],
      addTenantData: [],
    };
  },
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {},
  mounted() {
    this.getUserCenterTenantList();
  },
  methods: {
    async getUserCenterTenantList() {
      const params = {
        id: this.userInfo.id,
      };
      const res = await getPersonalCenterTenantList(params);
      this.createTenantData = res.filter((item) => item.createByMe);
      this.addTenantData = res.filter((item) => !item.createByMe);
    },
    switchTenant(item) {
      const params = {
        tenantCode: item.tenantCode,
      };
      const str = `${this.$t('userCenter.switchTenant')}:(${this.$t(
        'userCenter.tenantName',
      )}:${item.tenantName})`;
      params.logData = str;
      switchPersonalCenterTenant(params).then(() => {
        // console.log(123);
        const center = {
          visible: false,
          showType: '',
        };
        this.$emit('update:userCenter', center);
        const f = sessionStorage.traditionOpen;
        sessionStorage.clear();
        sessionStorage.traditionOpen = f;
        // this.$router.push('/home');
        // window.location.reload();
        window.location.href = '/home';
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.tenant-dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  color: #333333;
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 102;
  .tenant {
    .title {
      height: 36px;
      line-height: 36px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #808080;
    }
    ul > li {
      height: 40px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      line-height: 40px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .current-tenant {
      background: #f1f7ff;
    }
    .tenant-li {
      transition: all 0.3s;
      .time {
        display: inline-block;
      }
      .switch {
        display: none;
        color: #4689f5;
        transition: all 0.3s;
      }
      &:hover {
        background: #f1f7ff;
        .time {
          display: none;
        }
        .switch {
          display: inline-block;
          cursor: pointer;
        }
      }
    }
  }
}
::v-deep {
  .v-modal {
    background: rgba(0, 0, 0, 0.3);
  }
  .el-dialog {
    width: 640px;
    border-radius: 8px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    height: 54px;
    padding: 16px 20px;
  }

  .el-dialog__title {
    vertical-align: top;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .el-dialog__body {
    height: 422px;
    box-sizing: border-box;
    padding: 10px 20px 0;
  }

  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    padding: 16px 20px 17px;
  }

  .el-dialog__headerbtn {
    top: 18px;
  }
}
</style>
