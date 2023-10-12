<!--
 * @Author: sss
 * @Date: 2021-07-22 10:57:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-22 10:57:44
 * @Desc: 用户搜索框
-->
<template>
  <section class="userBox">
    <div class="userBox__content">
      <span class="userBox__AddBtn" @click="showDialog()">
        <i class="iconfont icon-jiahao"></i>
      </span>
      <span class="userBox__tag" v-for="item in value" :key="item.id">
        <user-headname
          :userInfo="item"
          prop="username"
          colorId="id"
          :isBig="true"
          :isClear="true"
          @handleClear="deleteUser"
        ></user-headname>
        <!-- <user-avatar :userItem="item"></user-avatar> -->
      </span>
      <el-input
        class="search"
        v-model="searchInput"
        :placeholder="$t('org.searchUser')"
        @input="debouncedSearch"
        ref="btn"
      ></el-input>
    </div>

    <div class="userBox__searchWrap" v-if="searchInput && isShowSearchBox">
      <div class="searchResulet">
        {{ $t('user.search') }}"<span>{{ searchInput }}</span
        >"{{ $t('user.searchResult') }}{{ usersSearchList.length
        }}{{ $t('user.item') }}
      </div>
      <ul class="listWrap" v-if="usersSearchList.length">
        <li
          @click="chooseUser(item)"
          v-for="item in usersSearchList"
          :key="item.id"
        >
          <user-headname
            :userInfo="item"
            prop="username"
            colorId="id"
          ></user-headname>
        </li>
      </ul>
    </div>
    <apiot-user-dialog
      ref="users"
      :visible.sync="visible"
      :title="dialogTitle"
      :checkedUsers="value"
      @handleSure="handleSure"
    ></apiot-user-dialog>
  </section>
</template>

<script>
import { getUserPage } from '@/api/orgManage.js';
import { debounce } from '@/utils/utils';

export default {
  components: {},

  props: {
    // 已经选中的用户
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      visible: false,
      searchInput: '',
      usersSearchList: [],
      isShowSearchBox: false
    };
  },

  computed: {},

  methods: {
    hide() {
      this.searchInput = '';
      this.usersSearchList = [];
      this.isShowSearchBox = false;
    },
    // 选择搜索后的值
    chooseUser(tag) {
      const users = [...this.value];
      const index = users.findIndex((item) => `${item.id}` === `${tag.id}`);

      if (index === -1) {
        users.push(tag);
        this.hide();
        this.$emit('input', users);
        this.$emit('selectUsers', tag);
        this.$emit('changeUser', users);
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('user.hasUserSelected')
        });
      }
    },
    // 点击确定按钮
    handleSure(users) {
      this.visible = false;
      // console.log(users);
      this.$emit('input', users);
      this.$emit('changeUser', users);
    },
    // 显示用户选择弹窗
    showDialog() {
      this.visible = true;
    },
    // 删除选中人员
    deleteUser(userInfo) {
      const users = [...this.value];
      const index = users.findIndex((item) => item.id === userInfo.id);
      const user = users[index];
      users.splice(index, 1);
      this.$emit('input', users);
      this.$emit('deleteUser', {
        users,
        user
      });
      this.$emit('changeUser', users);
      this.$refs.users.changeSelectVallue(users);
    },
    // 搜索
    async doSearch() {
      const value = this.searchInput;
      if (!value) return false;
      const params = {
        keywords: value,
        size: 99,
        current: 1,
        orders: [{ asc: true, column: 'id' }]
      };
      try {
        const res = await getUserPage(params);
        // console.log(res);
        this.usersSearchList = res.records;
        this.isShowSearchBox = true;
      } catch (e) {
        // console.log(e);
      }
    }
  },

  created() {
    this.debouncedSearch = debounce(() => {
      this.doSearch();
    });
  }
};
</script>

<style lang='scss' scoped>
.userBox {
  position: relative;

  .search {
    margin-bottom: 5px;
    width: 200px;
    ::v-deep {
      .el-input__inner {
        border: none;
      }
    }
  }
  &__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    margin-bottom: -5px;
    max-height: 80px;
    overflow-y: auto;
  }
  &__AddBtn {
    margin-bottom: 5px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px dashed #4689f5;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #4689f5;
    flex-shrink: 0;
    margin-right: 6px;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      background: #edf3fe;
    }
  }
  &__tag {
    margin-bottom: 5px;
    padding-right: 6px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
  }
  &__searchWrap {
    position: absolute;
    height: 164px;
    width: 100%;
    top: 105%;
    background: #ffffff;
    box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    z-index: 3;

    .searchResulet {
      height: 36px;
      padding-left: 21px;
      margin-top: 10px;
      line-height: 36px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      & > span {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4689f5;
      }
    }

    .listWrap {
      height: calc(100% - 46px);
      overflow: auto;

      & > li {
        height: 36px;
        padding-left: 21px;
        line-height: 36px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;

        & > i {
          color: #ee5e5e;
          font-size: 20px;
          vertical-align: bottom;
        }

        &:hover {
          background: $--hover-color;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
