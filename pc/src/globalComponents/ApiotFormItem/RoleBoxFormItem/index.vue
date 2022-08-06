<!--
 * @Author: sss
 * @Date: 2021-07-21 08:49:12
 * @Last Modified by:   sss
 * @Last Modified time: 2021-07-21 08:49:12
 * @dec: 选择角色
-->

<template>
  <div class="rolesWrap">
    <apiot-button size="mini" @click="toggle">
      <i class="iconfont icon-jiahao"></i> {{ $t('user.doAdd') }}
    </apiot-button>
    <el-tag v-for="tag in value" :key="tag.id" closable @close="deleteTag(tag)">
      <i class="iconfont icon-jiaose"></i>{{ tag.roleName }}
    </el-tag>
    <el-input
      class="search"
      v-model="input"
      :placeholder="$t('user.searchRole')"
      @input="debouncedSearch"
      ref="btn"
    ></el-input>
    <div class="searchWrap" v-if="input && dialogVisible">
      <div class="searchResulet">
        {{ $t('user.search') }}"<span>{{ input }}</span
        >"{{ $t('user.searchResult') }}{{ roleList.length
        }}{{ $t('user.item') }}
      </div>
      <ul class="listWrap" v-if="roleList.length">
        <li @click="chooseRole(item)" v-for="item in roleList" :key="item.id">
          <i class="iconfont icon-jiaose"></i>
          {{ item.roleName }}
        </li>
      </ul>
    </div>
    <apiot-roles-dialog
      ref="roles"
      :visible.sync="visible"
      :title="$t('user.roleNames')"
      :modal-append-to-body="false"
      :checkedRoles="value"
      @sureClick="handleChooseRoles"
    ></apiot-roles-dialog>
  </div>
</template>

<script>
import { getRoleLiistById } from '@/api/role';
import { debounce } from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {
    // 选择的角色
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      input: '',
      dialogVisible: false,
      visible: false,
      roleList: [] // 角色组
    };
  },
  components: {},
  computed: {},
  watch: {},
  created() {
    this.debouncedSearch = debounce(() => {
      this.doSearch();
    });
  },
  mounted() {
    // this.doSearch = debounce(this.doSearch);
    this.$refs.btn.$el.onkeydown = () => {
      const _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    };
  },
  methods: {
    deleteTag(tag) {
      const roles = [...this.value];
      const index = roles.findIndex((item) => item.id === tag.id);
      const deleteRole = roles[index];
      roles.splice(index, 1);
      this.$emit('input', roles);
      this.$emit('deleteRole', {
        roles,
        deleteRole
      });
      this.$emit('changeRoles', roles);
      this.$refs.roles.changeSelectVallue(roles);
    },
    handleChooseRoles(list) {
      this.$emit('input', list);
      this.$emit('selectRoles', list);
      this.$emit('changeRoles', list);
    },
    toggle() {
      this.visible = true;
    },
    hide() {
      this.input = '';
      this.roleList = [];
      this.dialogVisible = false;
    },

    async doSearch() {
      // console.log('doSearch');
      const value = this.input;
      if (!value) return;
      const params = {
        roleName: value
      };
      try {
        const res = await getRoleLiistById(params);
        this.roleList = value ? res : [];
        this.dialogVisible = true;
      } catch (e) {
        // console.log(e);
      }
    },
    // 选择搜索后的值
    chooseRole(item) {
      const currentRoles = [...this.value];
      const index = currentRoles.findIndex((tag) => Number(tag.id) === item.id);

      if (index === -1) {
        currentRoles.push(item);
        this.hide();
        this.$emit('input', currentRoles);
        this.$emit('selectRoles', currentRoles);
        this.$emit('changeRoles', currentRoles);
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('user.hasBeenSelected')
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.rolesWrap {
  position: relative;

  ::v-deep {
    .el-dialog__body {
      padding: 0 20px;
    }
  }

  .icon-jiahao {
    vertical-align: bottom;
    color: #aaaaaa;
  }

  .search {
    width: 200px;

    ::v-deep {
      .el-input__inner {
        border: none;
      }
    }
  }

  .searchWrap {
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

  ::v-deep {
    .el-button--mini {
      padding: 0 8px;
      border: 1px dashed #e9e9e9;
      font-size: 13px;

      &:hover {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }

      &:focus {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }
    }

    .el-tag {
      margin-left: 4px;
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 30px;
      color: #333333;
      background: #ffeaeb;
      line-height: 30px;
      border: none;

      & > .icon-jiaose {
        margin-right: 2px;
        vertical-align: middle;
        color: #ee5e5e;
      }
    }

    .el-tag .el-tag__close {
      top: 0;
      color: #aaaaaa;
      font-size: 13px;

      &:hover {
        color: #6b798d;
        background: none;
      }
    }
  }
}
</style>
