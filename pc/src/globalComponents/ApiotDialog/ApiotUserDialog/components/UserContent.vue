<!--
 * @Descripttion: 选择用户弹窗
 * @version:
 * @Author: tjf
 * @Date: 2021-04-14 15:24:27
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-31 16:57:18
-->
<template>
  <section class="personnel user-content">
    <div class="personnel__selected" v-show="selection.length > 0">
      <span
        class="personnel__tag m-r-6"
        v-for="item in selection"
        :key="item.id"
      >
        <user-headname
          :userInfo="item"
          prop="username"
          colorId="id"
          :isBig="true"
          :isClear="true"
          @handleClear="deleteLeader"
        ></user-headname>
      </span>
    </div>
    <div class="personnel__content">
      <div class="personnel__content__search">
        <el-input
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model="keywords"
          @input="searchUser"
          ref="input"
          @blur="isActive = false"
          @focus="isActive = true"
        >
          <i
            slot="suffix"
            class="iconfont icon-sousuo m-l-6"
            :class="isActive ? 'on' : ''"
          ></i>
        </el-input>
      </div>
      <el-tabs v-model="activeTab" @tab-click="switchTab">
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="item in tabsArr"
          :key="item.name"
        >
          <component
            v-if="activeTab===item.name"
            v-on="$listeners"
            :key="item.name"
            :activeTab="item.name"
            :checkeduser.sync="selection"
            :is="item.component"
            :ref="item.name"
            :collectUserList.sync="collectUserList"
            @updateSelection="updateSelection"
            @resetSearchKeyword="switchTab"
            v-bind="$attrs"
          >
          </component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </section>
</template>

<script>
import { getCollectionUserList } from '@/api/orgManage.js';
import CommonlyTab from './CommonlyTab';
import OrgTab from './OrgTab';
import RoleTab from './RoleTab';
import PostTab from './PostTab';
import WholeTab from './WholeTab';

export default {
  components: {
    CommonlyTab,
    OrgTab,
    RoleTab,
    PostTab,
    WholeTab
    // checkByRole,
  },
  name: 'userContent',
  data() {
    return {
      // 选择弹窗
      tabsArr: [
        { label: this.$t('org.whole'), name: 'whole', component: WholeTab },
        { label: this.$t('org.commonly'), name: 'commonly', component: CommonlyTab },
        { label: this.$t('org.byRole'), name: 'role', component: RoleTab },
        { label: this.$t('org.byOrg'), name: 'org', component: OrgTab },
        { label: this.$t('org.byPost'), name: 'post', component: PostTab }
      ],
      showTabs: false,
      activeTab: 'whole',
      visible: false,
      selection: [],
      keywords: '',
      isActive: false,
      collectUserList: []
    };
  },
  props: {
    // 已经选中的用户
    checkedUsers: {
      type: Array,
      default() {
        return [];
      }
    },
    isMult: {
      // 是否多选, 默认多选
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  provide() {
    return {
      getCollectUserList: this.getCollectUserList
    };
  },
  mounted() {
    // console.log('mounted===========================================');
    // console.log(this.checkedUsers);
    if (this.checkedUsers.length > 0) {
      this.selection = JSON.parse(JSON.stringify(this.checkedUsers));
    }
    this.getCollectUserList();
    this.$nextTick(() => {
      this.$refs.input.$el.onkeydown = () => {
        const _key = window.event.keyCode;
        if (_key === 13) {
          return false;
        }
      };
    });
  },
  methods: {
    initRoles(list) {
      this.selection = [...list];
    },
    searchUser(val) {
      // console.log(val);
      this.$refs[this.activeTab][0].getUserList(val);
    },
    cancleClick() {
      this.$emit('update:visible', false);
    },
    sureClick() {
      this.$emit('updateUser', this.selection);
    },
    switchTab() {
      this.keywords = '';
      this.$nextTick(() => {
        if (this.activeTab === 'commonly') {
          this.$refs[this.activeTab][0].getUserList(this.keywords);
        }
      });
    },
    updateSelection(row) {
      if (this.isMult) {
        const index = this.selection.findIndex((item) => String(item.id) === String(row.id));
        if (index === -1) {
          this.selection.push(row);
        } else {
          this.selection.splice(index, 1);
        }
      } else {
        this.selection = [row];
      }
    },
    deleteLeader(row) {
      const index = this.selection.findIndex((item) => String(item.id) === String(row.id));
      this.selection.splice(index, 1);
    },
    getCollectUserList() {
      getCollectionUserList().then((res) => {
        this.collectUserList = res;
      });
    }
  },
  computed: {
    detailData() {
      return JSON.parse(JSON.stringify(this.curData));
    }
  }
};
</script>

<style lang='scss' scoped>
.personnel {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__selected {
    width: 100%;
    border: 1px solid #e9e9e9;
    max-height: 70px;
    padding-top: 6px;
    padding-left: 10px;
    overflow-y: auto;
    box-sizing: border-box;
    margin-top: 6px;
    color: #333333;
  }
  &__tag {
    padding-right: 6px;
    background: #f1f3f6;
    border-radius: 14px;
    display: flex;
    margin-bottom: 6px;
    float: left;
    .imageName {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 28px;
      display: inline-block;
    }
    .iconfont {
      font-size: 12px;
      cursor: pointer;
      color: #bbc3cd;
      &:hover {
        color: #6b798d;
      }
    }
  }
  &__content {
    flex: 1;
    height: calc(100% - 70px);
    position: relative;
    &__search {
      width: 200px;
      height: 30px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      position: absolute;
      right: 0px;
      top: 5px;
      z-index: 3;
      .el-input {
        width: 200px;
        float: right;
        height: 30px;
        box-sizing: border-box;
        text-align: right;
        ::v-deep {
          .el-input__inner {
            width: 98%;
            height: 30px !important;
            //margin-top: -2px;
            padding-left: 12px;
            font-size: 13px;
            cursor: pointer;
            box-sizing: border-box;
          }
          .iconfont {
            height: 30px;
            line-height: 30px;
          }
          .el-input__suffix {
            left: auto;
            right: 10px;
            cursor: pointer;
            .el-input__suffix-inner {
              display: flex;
              align-items: center;
              height: 30px;
              .on {
                color: #4689f5;
              }
            }
          }
        }
      }
      input {
        height: 30px;
        width: 170px;
        border: none;
        background: none;
        padding: 0 10px;
        color: #aaaaaa;
        &:focus {
          outline: none;
        }
        &::placeholder {
          color: #aaaaaa;
        }
      }
      .iconfont {
        color: #d9d9d9;
        cursor: pointer;
        font-size: 16px;
      }
      .icon-xinzeng {
        color: #ffffff;
      }
    }
  }
  ::v-deep {
    .el-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      .el-tabs__header {
        flex: 0 0 42px;
      }
      .el-tabs__content {
        flex: 1;
        height: calc(100% - 42px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #e9e9e9;
    }
  }
}
.user-content {
  ::v-deep {
    .el-tree-node__expand-icon {
      margin-left: 18px;
    }
  }
}
.curMask {
  background: rgba(0, 0, 0, 0.3);
}
::v-deep {
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
    padding: 0px 20px;
  }

  .el-tabs__item {
    height: 42px;
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
