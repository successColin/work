<!-- 页面 -->
<template>
  <div class="orgWrap" v-loading="loading">
    <div class="selectArrWrap" v-show="selectKeys.length">
      <el-tag
        size="mini"
        v-for="tag in selectKeys"
        :key="tag.id"
        closable
        @close="handleClose(tag)"
      >
        <i class="iconfont icon-jiaose"></i>{{ tag.roleName }}
      </el-tag>
    </div>
    <div class="orgWrapTitleAndSearch">
      <div class="orgWrapTitleAndSearch__title">{{ $t('user.RoleList') }}</div>
      <div class="orgWrapTitleAndSearch__search">
        <el-input
          ref="btn"
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model="input"
          @keyup.enter.native="doSearch"
          @blur="isActive = false"
          @focus="isActive = true"
          @input="reset"
        >
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            :class="isActive ? 'on' : ''"
            @click="doSearch"
          ></i>
        </el-input>
      </div>
    </div>
    <div class="listWrap">
      <div
        v-for="list in rolesList"
        :key="list.id"
        class="listRole"
        @click.prevent="changeRole(list)"
        :class="{ active: isCheck(list) }"
      >
        <el-checkbox
          :checked="isCheck(list)"
          :value="isCheck(list)"
          @click="changeRole(list)"
        ></el-checkbox>
        <i class="iconfont icon-jiaose"></i>
        <span>{{ list.roleName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleLiistById } from '@/api/role';

export default {
  props: {
    roles: {
      type: Array,
      default: () => []
    },
    updateData: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      isActive: false,
      input: '',
      selectKeys: [], // 勾选的数据
      rolesList: [] // 角色列表
    };
  },
  components: {},
  watch: {},
  computed: {
    isCheck() {
      return (list) => {
        const index = this.selectKeys.findIndex((item) => Number(item.id) === list.id);
        const isTure = index !== -1;
        return isTure;
      };
    }
  },
  mounted() {
    const params = {
      roleName: ''
    };
    this.init(params);
    this.$refs.btn.$el.onkeydown = () => {
      const _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    };
    this.selectKeys = this.roles;
    // console.log(this.roles);
  },
  methods: {
    initRoles(list) {
      this.selectKeys = [...list];
    },
    reset() {
      // 重置
      if (!this.input) {
        const params = {
          roleName: ''
        };
        this.init(params);
      }
    },
    handleClose(role) {
      const newTag = [...this.selectKeys];
      const index = newTag.findIndex((item) => item.id === role.id);
      newTag.splice(index, 1);
      this.selectKeys = newTag;
    },
    changeRole(role) {
      const newTag = [...this.selectKeys];
      const index = newTag.findIndex((item) => Number(item.id) === Number(role.id));
      if (index === -1) {
        newTag.push(role);
      } else {
        newTag.splice(index, 1);
      }
      this.selectKeys = newTag;
    },
    doSearch() {
      const params = {
        roleName: this.input
      };
      this.init(params);
    },
    async init(params) {
      this.loading = true;
      try {
        const res = await getRoleLiistById(params);
        this.rolesList = res;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    }
  },
  beforeDestory() {}
};
</script>

<style lang='scss' scoped>
.orgWrap {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .selectArrWrap {
    width: 100%;
    margin-top: 7px;
    padding: 4px 10px 0 10px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    overflow-y: auto;
    //flex: 1;
    max-height: 70px;

    .icon-jiaose {
      margin-right: 2px;
      vertical-align: bottom !important;
      color: #ee5e5e;
    }

    ::v-deep {
      .el-tag {
        margin: 0 4px 6px 0 !important;
        height: 24px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        background: #ffeaeb;
        line-height: 24px;
        border: none;
      }

      .el-tag .el-tag__close {
        color: #aaaaaa;
        top: 0;
        right: -3px;
        font-size: 16px;

        &:hover {
          color: #6b798d;
          background: none;
        }
      }
    }
  }

  .orgWrapTitleAndSearch {
    height: 42px;
    width: 100%;
    flex: 42px 0 0;
    line-height: 42px;
    overflow: hidden;

    .orgWrapTitleAndSearch__title {
      float: left;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    .orgWrapTitleAndSearch__search {
      float: right;
      text-align: right;

      .on {
        color: $--color-primary;
      }

      ::v-deep {
        .el-input__inner {
          width: 98%;
          height: 30px;
          padding-left: 12px;
          font-size: 13px;
          cursor: pointer;
        }

        .el-input__prefix {
          left: auto;
          right: 15px;
          cursor: pointer;
        }
      }
    }
  }

  .listWrap {
    width: 100%;
    flex: 1;
    height: calc(100% - 81px);
    border-top: 1px solid #e9e9e9;
    overflow-y: auto;

    .listRole {
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #e9e9e9;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      box-sizing: border-box;

      ::v-deep {
        .el-checkbox {
          margin: 0 10px 0 20px;
          vertical-align: top;
        }
      }

      & > .icon-jiaose {
        font-size: 20px;
        color: #ee5e5e;

        & + span {
          margin-left: 4px;
          vertical-align: super;
        }
      }

      &:last-child {
        border-bottom: none;
      }

      &:hover,
      &.active {
        background: #edf3fe;
      }
    }
  }
}
</style>
