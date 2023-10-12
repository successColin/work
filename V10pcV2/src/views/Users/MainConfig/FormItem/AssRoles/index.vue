<!-- * @描述: 通用单选框 -->
<template>
  <div
    class="rolesWrap"
    :style="`width:${configData.width}`"
    v-if="configData.canShow"
  >
    <el-form-item :prop="`${configData.compId}`">
      <span class="span-box" slot="label">
        <span style="white-space: nowrap"> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <apiot-input
        v-model="parent.form[configData.compId]"
        v-show="false"
      ></apiot-input>
      <el-button size="mini" @click="toggle"
        ><i class="iconfont icon-jiahao"></i> {{ $t('user.doAdd') }}</el-button
      >
      <apiot-tag
        class="m-r-6"
        :itemTheme="2"
        v-for="tag in roles"
        :key="tag.id"
        @deleteSelf="deleteTag(tag)"
        :item="tag.roleName"
        itemIconClass="icon-jiaose"
      ></apiot-tag>
      <el-input
        class="search"
        v-model="input"
        :placeholder="$t('user.searchRole')"
        @input="doSearch"
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
    </el-form-item>
    <apiot-dialog
      :visible.sync="visible"
      :title="$t('user.roleNames')"
      :modal-append-to-body="true"
      v-on:sure-click="handleChooseRoles"
      v-on:cancle-click="visible = false"
    >
      <roles :roles="roles" ref="roles" v-if="visible"></roles>
    </apiot-dialog>
  </div>
</template>

<script>
import { getRoleLiistById } from '@/api/role';
import { debounce } from '@/utils/utils';
import Roles from './Roles/roles';

export default {
  inheritAttrs: false,
  props: {
    roles: {
      type: Array,
      default: () => [],
    },
    updateData: {
      type: Function,
      default: () => {},
    },
    configData: {
      type: Object,
    },
    parent: {
      type: Object,
    },
  },
  data() {
    return {
      input: '',
      dialogVisible: false,
      visible: false,
      roleList: [], // 角色组
    };
  },
  components: { Roles },
  computed: {},
  watch: {
    roles: {
      handler(v) {
        console.log(v);
        if (v.length) {
          const arr = [];
          v.forEach((item) => {
            arr.push(item.id);
          });
          this.parent.form[this.configData.compId] = arr.join(',');
        } else {
          this.parent.form[this.configData.compId] = '';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.doSearch = debounce(this.doSearch, 500);
  },
  mounted() {
    this.$refs.btn.$el.onkeydown = () => {
      const _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    };
  },
  methods: {
    deleteTag(tag) {
      const index = this.roles.findIndex((item) => item.id === tag.id);
      this.roles.splice(index, 1);
      this.updateData({ roles: this.roles });
    },
    handleChooseRoles() {
      const list = this.$refs.roles.selectKeys;
      this.visible = false;
      this.updateData({ roles: list });
    },
    toggle() {
      this.visible = !this.visible;
    },
    hide() {
      this.input = '';
      this.roleList = [];
      this.dialogVisible = false;
    },
    async doSearch(value) {
      const params = {
        roleName: value,
      };
      try {
        const res = await getRoleLiistById(params);
        this.roleList = value ? res : [];
        this.dialogVisible = true;
      } catch (e) {
        // console.log(e);
      }
    },
    chooseRole(item) {
      const index = this.roles.findIndex((tag) => Number(tag.id) === item.id);
      const newTag = [...this.roles];
      if (index === -1) {
        newTag.push(item);
        this.hide();
        this.updateData({ roles: newTag });
        // this.$emit('relationRoles', this.tags);
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('user.hasBeenSelected'),
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rolesWrap {
  position: relative;
  padding: 0px 15px 18px 20px;
  box-sizing: border-box;
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .wz {
      line-height: 30px;
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
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      & > span {
        font-size: 14px;
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
        font-size: 14px;
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
      font-size: 14px;

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
      font-size: 14px;
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
      font-size: 14px;

      &:hover {
        color: #6b798d;
        background: none;
      }
    }
  }
}
</style>
