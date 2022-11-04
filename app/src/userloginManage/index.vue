<template>
  <div class="userloginManage">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar title="用户登录管理"></apiot-navbar>
    <!-- #endif -->
    <apiot-input-search
      ref="pagesSelectUserSearch"
      searchFlag="pagesSelectUserSearch"
      @search="userSearch"
    ></apiot-input-search>
    <div class="userloginManage__box" v-if="dataArr.length !== 0">
      <u-list @scrolltolower="scrolltolower" :height="computedHeight">
        <u-checkbox-group
          v-model="checkboxValue"
          placement="column"
          @change="checkboxChange"
        >
          <u-list-item
            v-for="(val, i) in dataArr"
            :key="i"
            class="userloginManage__ul"
          >
            <div class="userloginManage__li">
              <div class="userloginManage__li--left">
                <div>
                  <img
                    src="./img/userIP.svg"
                    alt=""
                    class="userloginManage__li--icon"
                  />
                  {{ val.ipSource }}
                </div>
                <div>账号：{{ val.username }}</div>
                <div>IP地址：{{ val.ip }}</div>
                <div>登录时间：{{ val.loginTime }}</div>
                <div>在线时长：{{ val.onLineDuration }} 分钟</div>
              </div>
              <div>
                <u-checkbox
                  :key="i"
                  :class="[
                    'userloginManage__checkobx',
                    isOperation ? '' : 'checkboxVisibility',
                  ]"
                  :name="val.token"
                >
                </u-checkbox>
                <div
                  :class="[
                    'userloginManage__li--right',
                    val.client === 1
                      ? 'userloginManage__blue'
                      : 'userloginManage__red',
                  ]"
                >
                  {{ val.client === 1 ? 'PC' : 'APP' }} 端
                </div>
              </div>
            </div>
            <div class="userloginManage__liBottom">
              <div class="userloginManage__liBottom--button">
                <apiot-button
                  type="primary"
                  shape="circle"
                  @click="handleOffline(val)"
                >
                  下线
                </apiot-button>
              </div>
            </div>
          </u-list-item>
        </u-checkbox-group>
      </u-list>
    </div>
    <apiot-list-nodata v-else></apiot-list-nodata>
    <!-- v-if="dataArr.length !== 0" -->
    <footer>
      <apiot-button
        type="primary"
        shape="circle"
        class="batch"
        v-if="!isOperation"
        @click="handleBatchOffline"
      >
        <div class="batch__button">
          <i class="appIcon appIcon-piliangcaozuo"></i>
          批量下线
        </div>
      </apiot-button>
      <div v-else class="operation">
        <u-checkbox-group class="operation__checkbox" v-model="checkedAll">
          <u-checkbox
            label="全选"
            @change="handleCheckedAll"
            name="all"
          ></u-checkbox>
        </u-checkbox-group>

        <apiot-button
          type="default"
          @click="handleCancel"
          class="operation__defaultBtn"
        >
          取消
        </apiot-button>
        <apiot-button
          type="primary"
          @click="handleOk"
          class="operation__primaryBtn"
        >
          确定
        </apiot-button>
      </div>
    </footer>
    <!-- 弹出提示 -->
    <apiot-modal ref="apiotConfirmModal"> </apiot-modal>
    <!-- 成功提示 -->
    <u-toast ref="uToast"></u-toast>
  </div>
</template>

<script>
import { getListPage, offlineUsers } from '@/api/userloginManage';

export default {
  data() {
    return {
      checkboxValue: [],
      checkedAll: [],
      isOperation: false,
      params: {
        current: 1,
        size: 5,
        searchValue: '',
        orders: []
      },
      dataArr: [],
      total: 0
    };
  },
  components: {},
  computed: {
    computedHeight() {
      const { windowHeight, navbarHeight } = this.$store.state.base.systemInfo;
      console.log(windowHeight, navbarHeight);
      const height = windowHeight - navbarHeight - 44 - 75;
      return height;
    }
  },
  watch: {},
  mounted() {
    this.getList();
  },
  methods: {
    scrolltolower() {
      if (this.dataArr.length < this.total) {
        this.params.current += 1;
        this.getList('more');
      }
    },
    // 获取列表
    async getList(way) {
      if (way !== 'more') {
        this.params.current = 1;
      }
      const list = await getListPage(this.params);
      const { records, total } = list;
      if (way === 'more') {
        console.log(2222222);
        this.dataArr.push(...records);
      } else {
        this.dataArr = records;
      }

      this.total = total;
    },
    userSearch(v) {
      this.params.searchValue = v.keyword;
      this.getList();
    },
    async handleOffline(val) {
      console.log(val);
      await this.$refs.apiotConfirmModal
        .showAsyncModal({
          content: `确定下线该账号IP:${val.ip}，在${val.ipSource}地方登录，是否下线？`
        })
        .then(async (res) => {
          if (res.confirm) {
            await offlineUsers({ tokens: val.token });
            this.getList();
            this.$refs.uToast.show({
              type: 'success',
              message: '下线成功'
            });
          }
        });
    },
    handleBatchOffline() {
      this.isOperation = true;
    },
    handleCancel() {
      this.isOperation = false;
    },
    async handleOk() {
      if (this.checkboxValue.length === 0) {
        return this.$refs.uToast.show({
          type: 'warning',
          message: '请选择数据'
        });
      }
      await offlineUsers({ tokens: this.checkboxValue.join(',') });
      this.getList();
      this.$refs.uToast.show({
        type: 'success',
        message: '下线成功'
      });
      this.isOperation = false;
    },
    checkboxChange(v) {
      if (v.length === this.total) {
        this.checkedAll = ['all'];
      } else {
        this.checkedAll = [];
      }
    },
    handleCheckedAll(v) {
      const arr = [];
      if (v) {
        this.dataArr.forEach((val) => {
          arr.push(val.token);
        });
      }
      this.checkboxValue = arr;
    }
  }
};
</script>
<style lang='scss' scoped>
.userloginManage {
  display: flex;
  flex-direction: column;
  height: 100vh;
  &__red {
    color: #f6483e;
    background: #ffeaeb;
  }
  &__blue {
    color: #4689f5;
    background: #e5f0ff;
  }
  &__box {
    flex: 1;
    overflow: auto;
  }
  &__ul {
    margin: 20rpx 30rpx 0;
    background: #ffffff;
    box-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
    border-radius: 12rpx;
  }
  &__li {
    padding: 30rpx;
    display: flex;
    align-items: start;
    &--left {
      flex: 1;
      div:nth-child(1),
      div:nth-child(2) {
        font-family: PingFangSC-Medium, PingFang SC;
        @include fontBlob(500);
        color: #333333;
      }
      div:nth-child(1) {
        font-size: 34rpx;
        display: flex;
        align-items: center;
      }
      div:nth-child(2) {
        font-size: 28rpx;
        margin-top: 16rpx;
      }
      div:nth-child(3),
      div:nth-child(4) {
        font-size: 24rpx;
        color: #666666;
        margin-top: 12rpx;
      }
      div:nth-child(5) {
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        margin-top: 18rpx;
      }
    }
    &--right {
      font-size: 24rpx;
      padding: 0 25rpx;
      height: 48rpx;
      line-height: 48rpx;
      border-radius: 24rpx;
    }
    &--icon {
      width: 48rpx;
      height: 48rpx;
      margin-right: 14rpx;
    }
  }
  &__liBottom {
    box-shadow: inset 0px 1px 0px 0px #e9e9e9;
    padding: 23rpx 30rpx 23rpx 0;
    display: flex;
    flex-direction: row-reverse;
    &--button {
      width: 134rpx;
      height: 52rpx;
    }
    ::v-deep {
      .sys_btnSize {
        height: 52rpx !important;
      }
    }
  }
  &__checkobx {
    display: flex;
    justify-content: end;
    margin-bottom: 23rpx;
    ::v-deep {
      .u-checkbox__icon-wrap {
        margin-right: 0;
      }
    }
  }
  footer {
    .batch {
      width: calc(100% - 40rpx) !important;
      margin: 30rpx auto;
      .batch__button {
        display: flex;
        align-items: center;
        .appIcon {
          font-size: 32rpx;
          margin-right: 12rpx;
        }
      }
    }

    .operation {
      width: calc(100% - 40rpx) !important;
      width: 100%;
      height: 110rpx;
      background: #fff;
      display: flex;
      padding: 19rpx 20rpx;
      align-items: center;
      .operation__defaultBtn,
      .operation__primaryBtn {
        flex: 1;
      }
      .operation__defaultBtn {
        margin-right: 24rpx;
        background: #f1f3f6;
        border-radius: 12px;
      }
      .operation__primaryBtn {
        background: #4689f5;
        border-radius: 12px;
      }
      .operation__checkbox {
        margin-right: 36rpx;
      }
    }
  }
}
.checkboxVisibility {
  visibility: hidden;
}
</style>
