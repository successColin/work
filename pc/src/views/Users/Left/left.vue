<!-- 页面 -->
<template>
  <div class="leftWrap" v-loading="loading">
    <div class="leftWrap__switch">
      <div class="switch__push" @click="linkTo">
        <el-tooltip
          class="item"
          effect="dark"
          :content="getDefaultLeftTypeName()"
          placement="top-start"
        >
          <i class="iconfont icon-tiaozhuan"></i>
        </el-tooltip>
      </div>
      <div class="switch__title">{{ getDefaultLeftTypeName() }}</div>
      <div class="switch__select">
        <el-dropdown
          trigger="click"
          placement="bottom"
          @command="handleCommand"
        >
          <i class="iconfont icon-gengduocaozuo"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="org">{{$t('user.org')}}</el-dropdown-item>
            <el-dropdown-item command="role">{{$t('user.roles')}}</el-dropdown-item>
            <el-dropdown-item command="position">{{$t('user.pos')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="left__search">
      <apiot-input
        :placeholder="getInputPlaceholder()"
        v-model="keyWord"
        ref="search"
        @keyup.enter.native="doSearch"
        @input="reset"
      ></apiot-input>
      <i class="iconfont icon-sousuo"></i>
    </div>
    <div class="leftWrap_ul_listWrap">
      <OrgTree v-if="defaultLeftType === 'org'" ref="org" isolationSign="user"></OrgTree>
      <RoleTree
        v-if="defaultLeftType === 'role'"
        ref="role"
        isolationSign="user"
        :isSearch="isSearch"
      ></RoleTree>
      <PositionTree
        v-if="defaultLeftType === 'position'"
        isolationSign="user"
        ref="pos"
      ></PositionTree>
    </div>
  </div>
</template>

<script>
const RoleTree = () => import('./RoleList/roleTree');
const PositionTree = () => import('./PositionTree/positionTree');
const OrgTree = () => import('./OrgTree/orgTree');

export default {
  data() {
    return {
      loading: false,
      keyWord: '',
      defaultLeftType: 'org', // 默认组织类型
      defaultLeftTypeName: '',
      inputPlaceholder: '', // 模糊查询框中的文字
      selectKey: {}, // 默认选中的数据
      isSearch: false // 标识是否是角色查询
    };
  },
  components: {
    OrgTree,
    RoleTree,
    PositionTree
  },

  computed: {
    getDefaultLeftTypeName() {
      return function () {
        return this.defaultLeftTypeName || this.$t('user.org');
      };
    },
    getInputPlaceholder() {
      return function () {
        return this.inputPlaceholder || this.$t('user.placeholder_org');
      };
    },
  },

  mounted() {
    this.loading = false;
  },
  watch: {},

  methods: {
    linkTo() {
      // 跳转菜单
      let item = {};
      if (this.defaultLeftType === 'role') {
        item = {
          path: '/role',
          routeName: 'role',
          menuName: this.$t('user.roles'),
        };
      }
      if (this.defaultLeftType === 'org') {
        item = {
          path: '/orgManage',
          routeName: 'orgManage',
          menuName: this.$t('user.org'),
        };
      }
      if (this.defaultLeftType === 'position') {
        item = {
          path: '/postManage',
          routeName: 'postManage',
          menuName: this.$t('user.pos'),
        };
      }
      this.$bus.$emit('changeMenuTab', item);
    },
    handleCommand(type) {
      if (type === 'org') {
        this.inputPlaceholder = this.$t('user.placeholder_org');
        this.defaultLeftTypeName = this.$t('user.org');
      }
      if (type === 'role') {
        this.inputPlaceholder = this.$t('user.placeholder_role');
        this.defaultLeftTypeName = this.$t('user.roles');
        this.isSearch = false;
      }
      if (type === 'position') {
        this.inputPlaceholder = this.$t('user.placeholder_pos');
        this.defaultLeftTypeName = this.$t('user.pos');
      }
      this.defaultLeftType = type;
      this.$bus.$emit('defaultLeftType', type);
      this.keyWord = '';
    },
    reset() {
      // 重置
      if (!this.keyWord) {
        this.doSearch();
      }
    },
    doSearch() {
      // 进行模糊查询
      if (this.defaultLeftType === 'org') {
        const params = this.keyWord ? { keywords: this.keyWord } : { parentId: 0 };
        this.$refs.org.getOrgTree(params);
      } else if (this.defaultLeftType === 'role') {
        if (this.keyWord) {
          this.isSearch = true;
          this.$refs.role.getRoleList({ roleName: this.keyWord });
        } else {
          this.isSearch = false;
          this.$refs.role.getOrgTree();
        }
      } else {
        const params = this.keyWord ? { keywords: this.keyWord } : { parentId: 0 };
        this.$refs.pos.getOrgTree(params);
      }
    }
  },
  name: 'List'
};
</script>

<style lang='scss' scoped>
.iconfont {
  font-size: 18px;
}

.leftWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .leftWrap__switch {
    height: 30px;
    width: 222px;
    margin: 6px auto;
    display: flex;
    //padding: 6px 0;
    border-radius: 4px;
    background: #fafafa;
    border: 1px solid #e9e9e9;

    .switch__push {
      flex: 0 0 30px;
      border-right: 1px solid #e9e9e9;
      cursor: pointer;
      background: #ffffff;
      text-align: center;
      line-height: 30px;
      color: #bbc3cd;

      &:hover {
        color: #4689f5;
      }
    }

    .switch__title {
      flex: 1;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      text-align: center;
      line-height: 30px;
    }

    .switch__select {
      flex: 0 0 30px;
      border-left: 1px solid #e9e9e9;
      cursor: pointer;
      background: #ffffff;
      text-align: center;
      line-height: 30px;
      color: #bbc3cd;

      & .icon-gengduocaozuo {
        padding: 5px;
        color: #bbc3cd;
        font-size: 16px;
      }

      & .icon-gengduocaozuo:hover {
        color: #4689f5;
      }
    }
  }

  .left__search {
    position: relative;
    margin: 6px auto;
    width: 224px;
    text-align: center;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        padding-left: 12px;
        padding-right: 30px;
      }

      .el-input:focus-within + i.icon-sousuo {
        color: $--color-primary;
      }
    }

    .icon-sousuo {
      position: absolute;
      color: #d9d9d9;
      height: 28px;
      top: 50%;
      transform: translateY(-50%);
      right: 1px;
      width: 29px;
      line-height: 30px;
      cursor: pointer;
    }
  }
}

.leftWrap_ul_listWrap {
  height: calc(100% - 42px - 44px);
  width: 240px;
  overflow: hidden;
}
</style>
