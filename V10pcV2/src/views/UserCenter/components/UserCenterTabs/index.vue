<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-31 09:44:55
 * @Des: 个人中心
-->
<template>
  <transition name="slide-bottom">
    <div
      class="tabs-wrap"
      v-if="centerVisible && userCenter.showType !== 'tenant'"
    >
      <div class="tabs">
        <div class="tabs__top">
          <apiot-button class="tabs__top__return" @click="closeTabs">
            <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
          </apiot-button>
        </div>
        <div class="tabs__content" v-if="userInfo.tenantVO">
          <div class="tabs__content__header">
            <div class="team-icon m-r-12">
              <i class="iconfont icon-gongsi1"></i>
            </div>
            <div class="header-info">
              <p class="tenantName">
                {{ $t('userCenter.team') }}:{{ userInfo.tenantVO.tenantName }}
                <span class="status">
                  {{
                    userInfo.tenantVO.createByMe
                      ? $t('userCenter.creatByMe')
                      : $t('userCenter.joined')
                  }}
                </span>
              </p>
              <p>
                {{
                  userInfo.tenantVO.createByMe
                    ? $t('userCenter.registerTime') + ':'
                    : $t('userCenter.joinTime') + ':'
                }}
                {{ userInfo.tenantVO.registerTime }}
              </p>
            </div>
          </div>
          <el-tabs
            tab-position="left"
            v-model="userCenter.showType"
            v-on="$listeners"
            v-bind="$attrs"
          >
            <el-tab-pane
              :label="item.label"
              :name="item.key"
              v-for="item in tabsArr"
              :key="item.key"
              :class="item.key === 'VersionUpdate' ? 'no-border' : ''"
            >
              <component
                :is="item.component"
                :activeTab="item.key"
                v-on="$listeners"
                v-bind="$attrs"
                :userInfo="userInfo"
              ></component>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import AccountSecurity from './components/AccountSecurity/index';
import BasicInfo from './components/BasicInfo/index';
import VersionUpdate from './components/VersionUpdate/index';

export default {
  inheritAttrs: false,
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    userCenter: {
      type: Object,
      default() {
        return {};
      }
    },
    centerVisible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      activeName: '',
      tabsArr: [
        {
          label: this.$t('userCenter.basicInfo'),
          key: 'BasicInfo',
          component: BasicInfo
        },
        {
          label: this.$t('userCenter.accountSecurity'),
          key: 'AccountSecurity',
          component: AccountSecurity
        }
        // {
        //   label: this.$t('userCenter.versionUpdate'),
        //   key: 'VersionUpdate',
        //   component: VersionUpdate
        // }
      ],
      activeTab: 'BasicInfo'
    };
  },

  components: {
    AccountSecurity,
    BasicInfo,
    VersionUpdate
  },

  computed: {},

  mounted() {
    this.activeName = this.tabsArr[0].key;
    // console.log(this.userCenter.showType, 'ssssss');
    // console.log(this.userCenter, 'ssssss');
  },

  methods: {
    closeTabs() {
      // this.$emit('updateStatus');
      this.$emit('update:userVisible', false);
    }
  }
};
</script>

<style lang='scss' scoped>
.tabs-wrap {
  position: fixed;
  top: -200px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  background: rgba(0, 0, 0, 0.3);
  .tabs {
    position: absolute;
    left: 0;
    right: 0;
    top: 250px;
    bottom: 0;
    z-index: 102;
    background: #f6f6f8;
    &__top {
      width: 100%;
      height: 46px;
      background: #ffffff;
      position: relative;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      &__return {
        width: 100px;
        height: 46px;
        border-width: 0 1px 0 0;
        border-color: #ebebeb;
        border-radius: 0;
        color: #333333;
        font-size: 16px;

        i {
          font-size: 20px;
          margin-right: 8px;
          color: #9b9b9b;
        }

        &:hover,
        &:active,
        &:focus {
          border-color: #ebebeb !important;
          background-color: #fff !important;
          color: $--color-primary;
          i {
            color: $--color-primary;
          }
        }
      }
    }
    &__content {
      width: 100%;
      height: 100%;
      padding: 10px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      &__header {
        width: 100%;
        height: 68px;
        padding: 14px 12px;
        display: flex;
        background: #ffffff;
        box-sizing: border-box;
        .team-icon {
          width: 40px;
          height: 40px;
          .iconfont {
            font-size: 40px;
            color: #4689f5;
          }
        }
        .header-info {
          line-height: 100%;
          color: #808080;
          font-size: 13px;
          .tenantName {
            margin-bottom: 4px;
            font-weight: 600;
            font-size: 16px;
            color: #333333;
            .status {
              height: 22px;
              background: #f1f7ff;
              border-radius: 4px;
              color: #4689f5;
              line-height: 22px;
              padding: 0 5px;
              font-size: 13px;
              margin: 8px 2px;
              font-weight: 400;
            }
          }
        }
      }
    }
    ::v-deep {
      .el-tabs {
        height: 100%;
        width: 100%;
        display: flex;
        background: #ffffff;
        &__active-bar.is-left {
          left: 0;
          width: 3px;
          background: #4689f5;
        }
      }
      .el-tabs__header {
        margin: 0;
        background-color: #fff;
        width: 200px;
        height: 100%;
        line-height: 46px;
        border: 1px solid #e9e9e9;
        flex-shrink: 0;
      }

      .el-tabs__nav-wrap::after {
        height: 0;
      }

      .el-tabs__nav-scroll {
        display: flex;
        .el-tabs__nav {
          width: 100%;
        }
      }

      .el-tabs__item {
        color: #333333;
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        &.is-active {
          font-family: PingFangSC-Medium;
          background: #f1f7ff;
        }
      }

      .el-tabs__content {
        width: 100%;
        height: 100%;
        background: #ffffff;
        margin: 0 10px;
        background-color: #fff;
      }

      .el-button:active {
        border-color: #c8dcfc;
      }

      .el-tab-pane {
        height: 100%;
        // overflow: hidden;
        overflow-x: auto;
        overflow-y: hidden;
        border: 1px solid #e9e9e9;
      }
      .no-border {
        border: none;
      }

      .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none;
      }
    }
  }
}
</style>
