<!-- 页面 -->
<template>
  <div class="orgWrap" v-loading="loading">
    <div class="selectArrWrap" v-show="selectKeys.length">
      <apiot-tag
        size="mini"
        v-for="tag in selectKeys"
        :key="tag.value"
        closable
        :itemTheme="2"
        @deleteSelf="handleClose(tag)"
      >
        <i
          :class="{
          iconfont: true,
          [`${tag.icon?tag.icon.icon : 'icon-benren'}`]: true
        }"
         :style="getIconColor(tag)"
        /><span class="m-l-5">{{ tag.zhCN }}</span>
      </apiot-tag>
    </div>
    <div class="orgWrapTitleAndSearch">
      <div class="orgWrapTitleAndSearch__title">{{ $t('user.TagList') }}</div>
      <div class="orgWrapTitleAndSearch__search">
<!--        <el-input-->
<!--          ref="btn"-->
<!--          :placeholder="$t('placeholder.pleaseEnterkeySearch')"-->
<!--          v-model="input"-->
<!--          @keyup.enter.native="doSearch"-->
<!--          @blur="isActive = false"-->
<!--          @focus="isActive = true"-->
<!--          @input="reset"-->
<!--        >-->
<!--          <i-->
<!--            slot="prefix"-->
<!--            class="iconfont icon-sousuo"-->
<!--            :class="isActive ? 'on' : ''"-->
<!--            @click="doSearch"-->
<!--          ></i>-->
<!--        </el-input>-->
        <search-input
            :placeholder="$t('placeholder.pleaseEnterkeySearch')"
            @getList="doSearch"
            v-model="input"
        ></search-input>
      </div>
    </div>
    <div class="listWrap">
      <apiot-nodata v-if="!rolesList.length"></apiot-nodata>
      <div
        v-for="list in rolesList"
        :key="list.value"
        class="listRole"
        @click.prevent="changeRole(list)"
        :class="{ active: isCheck(list) }"
      >
        <el-checkbox
          :checked="isCheck(list)"
          :value="isCheck(list)"
          @click="changeRole(list)"
        ></el-checkbox>
        <i :style="getIconColor(list)"
           :class="{
          iconfont: true,
          [`${list.icon?list.icon.icon : 'icon-benren'}`]: true
        }"/>
        <span class="m-l-5">{{ list.zhCN }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsersState } from '@/api/user';

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
      realList: [],
      selectKeys: [], // 勾选的数据
      rolesList: [] // 角色列表
    };
  },
  components: {},
  watch: {},
  computed: {
    getIconColor() {
      return function (tag) {
        if (tag.icon && tag.icon.icon) {
          return {
            color: tag.icon.color
          };
        }
        return {};
      };
    },
    isCheck() {
      return (list) => {
        const index = this.selectKeys.findIndex((item) => Number(item.value) === list.value);
        return index !== -1;
      };
    }
  },
  mounted() {
    const params = {
      roleName: ''
    };
    this.init(params);
    // this.$refs.btn.$el.onkeydown = () => {
    //   const _key = window.event.keyCode;
    //   if (_key === 13) {
    //     return false;
    //   }
    // };
    // console.log(this.roles, 'roles');
    this.selectKeys = JSON.parse(JSON.stringify(this.roles));
    // console.log(this.roles);
  },
  methods: {
    reset() {
      // 重置
      if (!this.input) {
        this.rolesList = [...this.realList];
      }
    },
    handleClose(role) {
      const newTag = [...this.selectKeys];
      const index = newTag.findIndex((item) => item.value === role.value);
      newTag.splice(index, 1);
      this.selectKeys = newTag;
    },
    changeRole(role) {
      const newTag = [...this.selectKeys];
      const index = newTag.findIndex((item) => Number(item.value) === Number(role.value));
      if (index === -1) {
        newTag.push(role);
      } else {
        newTag.splice(index, 1);
      }
      this.selectKeys = newTag;
    },
    doSearch() {
      if (!this.input) {
        this.rolesList = [...this.realList];
        return;
      }
      this.rolesList = this.rolesList.filter((item) => (item.zhCN.indexOf(this.input) > -1));
    },
    async init() {
      this.loading = true;
      try {
        const res = await getUsersState({ dictKeys: 'USER_LABEL_TAGS' });
        this.rolesList = res.USER_LABEL_TAGS || [];
        this.realList = res.USER_LABEL_TAGS || [];
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
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    .orgWrapTitleAndSearch__search {
      float: right;
      //text-align: right;

      .on {
        color: $--color-primary;
      }

      //::v-deep {
      //  .el-input__inner {
      //    width: 98%;
      //    height: 30px;
      //    padding-left: 12px;
      //    font-size: 14px;
      //    cursor: pointer;
      //  }
      //
      //  .el-input__prefix {
      //    left: auto;
      //    right: 15px;
      //    cursor: pointer;
      //  }
      //}
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
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      box-sizing: border-box;
      cursor: pointer;

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
      & > span {
        //margin-left: 5px;
        vertical-align: super;
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
