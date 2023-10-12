<!--
 * @Descripttion: 修改组织弹窗
 * @version:
 * @Author: tjf
 * @Date: 2021-04-14 15:24:27
 * @LastEditors: tjf
 * @LastEditTime: 2022-04-19 12:02:17
-->
<!-- treeTable -->
<template>
  <section class="personnel user-content">
    <div class="personnel__selected" v-show="selection.length > 0">
      <span class="manage-tag m-r-6" v-for="item in selection" :key="item.id">
        <user-avatar :userItem="item"></user-avatar>
        <i class="iconfont icon-guanbi m-l-6" @click="deleteLeader(item)"></i>
      </span>
    </div>
    <div class="personnel__content">
      <!-- <div class="personnel__content__search">
        <el-input
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model.trim="keywords"
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
      </div> -->
      <el-tabs
        v-model="activeTab"
        @tab-click="switchTab"
        :class="[{ hiddenTitle: tabsArr.length === 1 }]"
      >
        <el-tab-pane
          :label="item.label"
          :name="item.name"
          v-for="item in tabsArr"
          :key="item.name"
        >
          <component
            v-on="$listeners"
            :key="item.name"
            v-if="activeTab === item.name"
            :activeTab="item.name"
            :checkeduser.sync="selection"
            :is="item.component"
            :ref="item.name"
            :collectUserList.sync="collectUserList"
            @updateSelection="updateSelection"
            @updateAllSelection="updateAllSelection"
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
// import { getCollectionUserList } from '@/api/orgManage.js';
import apiotInput from '@/globalComponents/ApiotInput/index';
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import orgTab from '../../../orgTab/index';
import postTab from '../../../postTab/index';
import roleTab from '../../../roleTab/index';

export default {
  components: {
    orgTab,
    roleTab,
    postTab,
    apiotInput,
    userAvatar
    // checkByRole,
  },
  name: 'userContent',
  data() {
    return {
      // 选择弹窗
      tabsArr: [
        { label: this.$t('org.byRole'), name: 'role', component: roleTab, },
        { label: this.$t('org.byOrg'), name: 'org', component: orgTab },
        { label: this.$t('org.byPost'), name: 'post', component: postTab }
      ],
      showTabs: false,
      activeTab: 'role',
      visible: false,
      selection: [],
      keywords: '',
      isActive: false,
      collectUserList: [],
      memoryData: {}
    };
  },
  props: {
    curData: {
      type: Object,
      default() {
        return {};
      }
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    getTabsArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {
    this.memoryData = {
      ...this.curData
    };
    console.log(this.curData);
    if (this.curData.roleusers) {
      this.selection = [
        ...this.curData.roleusers,
      ];
    }
    this.$nextTick(() => {
      this.initTabsArr();
      // this.$refs.input.$el.onkeydown = () => {
      //   const _key = window.event.keyCode;
      //   if (_key === 13) {
      //     return false;
      //   }
      // };
    });
  },
  methods: {
    // 是否初始化tab
    initTabsArr() {
      if (!this.getTabsArr.length) return;
      const arr = [];
      this.getTabsArr.forEach((flag, i) => {
        if (flag) {
          arr.push(this.tabsArr[i]);
        }
      });
      this.tabsArr = arr;
    },
    searchUser(val) {
      this.$refs[this.activeTab][0].getUserList(val);
    },
    switchTab() {
      this.keywords = '';
      this.$nextTick(() => {
        if (this.activeTab === 'role') {
          this.selection = [
            ...this.memoryData.roleusers,
          ];
        } else if (this.activeTab === 'org') {
          this.selection = [
            ...this.memoryData.orgusers,
          ];
        } else if (this.activeTab === 'post') {
          this.selection = [
            ...this.memoryData.postusers
          ];
        }
      });
    },
    updateMemory() {
      if (this.activeTab === 'role') {
        this.memoryData.roleusers = this.selection;
      } else if (this.activeTab === 'org') {
        this.memoryData.orgusers = this.selection;
      } else if (this.activeTab === 'post') {
        this.memoryData.postusers = this.selection;
      }
      console.log(this.memoryData);
    },
    updateSelection(row) {
      const index = this.selection.findIndex((item) => String(item.id) === String(row.id));
      if (index === -1) {
        if (this.isSingle) {
          this.selection.splice(0, 1, row);
        } else {
          this.selection.push(row);
        }
      } else {
        this.selection.splice(index, 1);
      }
      console.log(this.selection);
      this.updateMemory();
    },
    updateAllSelection(rows, type) {
      for (let i = 0; i < rows.length; i += 1) {
        const index = this.selection.findIndex((item) => String(item.id) === String(rows[i].id));
        if (index === -1) {
          if (type) {
            this.selection.push(rows[i]);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (!type) {
            // this.selection.push(rows[i]);
            this.selection.splice(index, 1);
          }
        }
      }
    },
    deleteLeader(row) {
      // const index = this.selection.findIndex((item) => String(item.id) === String(row.id) &&
      //   item.type === row.type);
      // this.selection.splice(index, 1);
      this.$refs[this.activeTab][0].setChecked(row);
    },
    // getCollectUserList() {
    //   getCollectionUserList().then((res) => {
    //     this.collectUserList = res;
    //   });
    // }
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
    min-height: 40px;
    max-height: 70px;
    padding-top: 5px;
    padding-left: 10px;
    overflow-y: auto;
    box-sizing: border-box;
    margin-top: 10px;
    color: #333333;
    .manage-tag {
      padding-right: 6px;
      height: 28px;
      line-height: 28px;
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
  }
  &__content {
    flex: 1;
    height: calc(100% - 82px);
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
  .hiddenTitle {
    ::v-deep {
      .el-tabs__active-bar {
        background-color: rgba(0, 0, 0, 0);
      }
      .el-tabs__item {
        color: #ffffff;
      }
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
    padding: 16px 20px 15px;
  }

  .el-dialog__headerbtn {
    top: 18px;
  }
}
</style>
