<!--
 * @Author: sss
 * @Date: 2022-08-24 15:07:35
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-24 15:07:35
 * @Desc: 选择人员控件
-->
<template>
  <section class="apiotChooseUser">
    <div class="apiotChooseUser__header" v-if="!disabled">
      <div class="apiotChooseUser__header__choose">
        <span
          class="apiotChooseUser__header--choose"
          :style="{ borderColor: themeColor, color: themeColor }"
          @click.stop="gotoChooseUsers"
        >
          <i class="appIcon appIcon-tianjiagongneng"></i>
        </span>
        <input
          v-model="searchInput"
          placeholder-class="inputPlaceholder"
          placeholder="搜索人员"
          confirm-type="search"
          @input="debouncedSearch"
        />
      </div>
      <div
        class="apiotChooseUser__header__chooseContent"
        v-if="isShowSearchBox && searchInput"
      >
        <div class="searchResulet">
          {{ $t('common.search') }}"<span :style="{ color: themeColor }">{{
            searchInput
          }}</span
          >"{{ $t('common.searchResult', { num: usersSearchList.length }) }}
        </div>
        <scroll-view scroll-y="true" class="searchContent">
          <div
            class="searchContent__user"
            v-for="user in usersSearchList"
            :key="user.id"
            @click.stop="chooseUser(user)"
          >
            <apiot-userhead
              :userInfo="{
                userId: user.id,
                username: user.username,
                icon: user.icon,
              }"
              :size="45"
            ></apiot-userhead>
          </div>
        </scroll-view>
      </div>
    </div>

    <div class="apiotChooseUser__users">
      <div
        class="apiotChooseUser__users--item"
        v-for="(user, index) in checkUsers"
        :key="user.id"
      >
        <apiot-userhead
          :userInfo="{
            userId: user.id,
            username: user.username,
            icon: user.icon,
          }"
          :size="50"
          :isClear="!disabled"
          @handleClear="deleteUser(index)"
        ></apiot-userhead>
      </div>
    </div>
  </section>
</template>

<script>
import { debounce } from '@/utils';
import { getUserList } from '@/api/pagesSelectUser.js';

export default {
  components: {},

  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: '选择人员'
    },
    // 是否禁用
    disabled: {
      type: [String, Boolean],
      default: false
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchInput: '',
      usersSearchList: [],
      checkUsers: [],
      isShowSearchBox: false,
      selectFlag: ''
    };
  },

  computed: {
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  watch: {
    value: {
      handler(newV) {
        this.checkUsers = newV;
      },
      immediate: true,
      deep: true
    },
    checkUsers: {
      handler(checkList) {
        if (!this.selectFlag) this.selectFlag = `checkUser_${this._uid}`;
        else this.$emit('input', checkList);
        this.$store.commit('setSelectUserCheck', {
          selectFlag: this.selectFlag,
          checkUsers: checkList
        });
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 删除选中用户
    deleteUser(index) {
      this.checkUsers.splice(index, 1);
    },
    // 跳转界面选择人员
    gotoChooseUsers() {
      const { isMultiple, title, selectFlag } = this;
      uni.navigateTo({
        url: `/PagesSelectUser/index?flag=${selectFlag}&title=${title}&isMultiple=${
          isMultiple ? 1 : 0
        }`
      });
    },
    // 选择人员
    chooseUser(user) {
      const index = this.checkUsers.findIndex((item) => item.id === user.id);
      if (index === -1) this.checkUsers.push(user);
      this.searchInput = '';
    },
    sure(users) {
      this.checkUsers = users;
    },
    // 搜索人员
    async searchUser() {
      const value = this.searchInput;
      if (!value) return false;
      const params = {
        keywords: value,
        size: 99,
        current: 1,
        orders: [{ asc: true, column: 'id' }]
      };
      try {
        const res = await getUserList(params);
        this.usersSearchList = res.records;
        this.isShowSearchBox = true;
      } catch (e) {
        // console.log(e);
      }
    }
  },

  mounted() {
    this.$bus.$on(this.selectFlag, this.sure);
  },

  created() {
    this.debouncedSearch = debounce(() => {
      this.searchUser();
    });
  },

  beforeDestroy() {
    this.$bus.$off(this.selectFlag);
  }
};
</script>

<style lang='scss' scoped>
.apiotChooseUser {
  width: 100%;
  &__header {
    position: relative;
    &__choose {
      display: flex;
      input {
        flex: 1;
        height: 50rpx;
        font-size: 15px;
        text-align: left;
        box-sizing: border-box;
      }
    }
    &--choose {
      margin-right: 10rpx;
      width: 50rpx;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 50%;
      border: dashed 1px #333;
    }

    &__chooseContent {
      margin-top: 16rpx;
      padding: 20rpx;
      position: absolute;
      left: 0;
      right: 0;
      top: 50rpx;
      text-align: left;
      background: #ffffff;
      box-shadow: 0 4rpx 14rpx 0 rgba(0, 0, 0, 0.14);
      border-radius: 8rpx;

      .searchResulet {
        padding: 9rpx 0;
      }

      .searchContent {
        margin: 10rpx 0;
        max-height: 220rpx;
        overflow: auto;
        &__user {
          padding: 6rpx 0;
        }
      }
    }
  }

  &__users {
    margin-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    &--item {
      margin-right: 20rpx;
    }
  }
}
</style>
