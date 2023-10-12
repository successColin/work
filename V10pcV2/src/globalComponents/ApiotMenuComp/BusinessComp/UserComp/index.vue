<template>
  <div
    class="singleBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
      { isCard: isCard },
      { isConfig: isConfig },
    ]"
    v-if="showInput"
  >
    <div class="cardUser" v-if="isCard" :style="getStyle">
      <div class="cardUser__title" v-if="configData.showLabelTitle">
        {{ configData.name }}
      </div>
      <div v-if="configData.showLabelTitle">：</div>
      <div class="cardUser__cardConfig" v-if="isConfig">占位提示</div>
      <div class="cardUser__person" v-else>
        <span
          class="cardUser__person--tag m-r-6"
          v-for="item in formData.leaders || []"
          :key="item.id"
        >
          <user-avatar :userItem="item"></user-avatar>
        </span>
      </div>
    </div>
    <el-form-item :prop="`${configData.compId}`" v-if="!isTable && !isCard">
      <span class="span-box" slot="label" v-if="configData.showLabelTitle">
        <span> {{ configData.name }} </span>
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
      <div class="manage-item" ref="manageItem">
        <span
          class="add-manage m-r-6"
          @click="showSelectUserDialog()"
          v-if="!configData.canReadonly && isSingle"
        >
          <i class="iconfont icon-jiahao"></i>
        </span>
        <span
          class="manage-tag m-r-6"
          v-for="item in formData.leaders || []"
          :key="item.id"
        >
          <user-avatar :userItem="item"></user-avatar>
          <i
            class="iconfont icon-guanbi m-l-6"
            @click="deleteLeader(item)"
            v-if="!configData.canReadonly"
          ></i>
        </span>
        <input
          type="text"
          v-if="
            !configData.canReadonly &&
            isSingle &&
            !isConfig &&
            configData.shouldSearch
          "
          v-model="leaderKeywords"
          ref="leader"
          class="search-manage"
          :placeholder="$t('org.searchUser')"
          @input="leaderSearchAsync"
          @compositionend="handleComposition"
          @compositionstart="handleComposition"
        />

        <!-- <div
          v-if="showLeadRequired && !configData.canReadonly && isSingle"
          class="el-form-item__error leader-error"
        >
          {{ $t('org.pleaseSelectManager') }}
        </div> -->
      </div>
      <div
        class="leader-wrap"
        v-show="leaderList.length > 0 && leaderKeywords"
        :style="getLeaderWrapStyle"
      >
        <p>
          {{ $t('common.search') }}"
          <span>{{ leaderKeywords }}</span>
          "{{ $t('org.searchResult', { num: leaderList.length }) }}
        </p>
        <ul class="leader-list">
          <li
            v-for="item in leaderList"
            @click="selectLeader(item)"
            :key="'select_' + item.id"
          >
            <user-avatar :userItem="item"></user-avatar>
          </li>
        </ul>
      </div>
    </el-form-item>
    <!-- 人员选择弹窗1 -->
    <user-dialog
      ref="selectDialog"
      v-if="userDialogVisible"
      :visible.sync="userDialogVisible"
      :leaders="formData.leaders"
      :title="configData.name"
      @updateUser="updateUser"
      append-to-body
      v-bind="$attrs"
      :isSingle="configData.dropDownType === 1"
      :getTabsArr="getTabsArr"
    >
    </user-dialog>
    <div class="table" v-if="isTable">
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw">数据占位</p>
    </div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import { selectList } from '@/api/menuConfig';
import { getUserPage } from '@/api/orgManage.js';
import compMixin from '../../compMixin';

const userDialog = () =>
  import('_v/orgManage/components/detail/components/userDialog');
const userAvatar = () => import('_v/orgManage/components/userAvatar/index');

export default {
  data() {
    return {
      curCompType: 2,
      formData: {
        leaderId: '',
        leaders: [],
      },
      leaderKeywords: '', // 人员搜索关键字
      userDialogVisible: false, // 人员选择弹窗显隐
      isOnComposition: false,
      showLeadRequired: false,
      isChecked: false,
      leaderList: [],
      unwatch: null,
      flag: true,
      showSearch: false,
      popoverWidth: 300,
      curUserArr: [], // 当前取缓存用户
      pos: {
        x: 0,
        y: 0,
      },
    };
  },
  mixins: [compMixin],

  components: {
    userDialog,
    userAvatar,
  },

  computed: {
    getLeaderWrapStyle() {
      const style = `width:${this.popoverWidth}px;`;
      // if (this.pos.x && this.pos.y) {
      //   style += `left:${this.pos.x - 36}px;top:${this.pos.y + 34}px`;
      // }
      return style;
    },
    isSingle() {
      if (+this.configData.dropDownType === 1) {
        if (this.formData.leaders.length >= 1) {
          return false;
        }
      }
      return true;
    },
    getTabsArr() {
      const arr = [true, true, true, true, true];
      if (this.configData.shouldFav) {
        arr[1] = true;
      } else {
        arr[1] = false;
      }
      if (this.configData.shouldInRole) {
        arr[2] = true;
      } else {
        arr[2] = false;
      }
      if (this.configData.shouldInOrg) {
        arr[3] = true;
      } else {
        arr[3] = false;
      }
      if (this.configData.shouldInPost) {
        arr[4] = true;
      } else {
        arr[4] = false;
      }
      return arr;
    },
    getAllUser() {
      return this.$store.state.userCenter.allUser;
    },
    getStyle() {
      let style = '';
      if (!this.isConfig) {
        if (this.configData.alignStyle === 2) {
          style += 'justify-content:flex-end;';
        } else if (this.configData.alignStyle === 3) {
          style += 'justify-content:center;';
        } else {
          style += 'justify-content:flex-start;';
        }
      }
      return style;
    },
  },

  mounted() {
    if (!this.isConfig) {
      this.$nextTick(() => {
        if (this.$refs.manageItem) {
          this.popoverWidth = this.$refs.manageItem.offsetWidth;
        }
        // if (this.$refs.leader) {
        //   this.initSearchPos();
        // }
      });
      this.initData();
    }
  },

  methods: {
    initSearchPos() {
      const pos = this.$refs.leader.getBoundingClientRect();
      console.log(pos);
      this.pos.x = pos.left;
      this.pos.y = pos.top;
    },
    // 数据初始化
    async initData() {
      if (this.cardData) {
        if (this.cardData[this.configData.compId]) {
          const params = {
            selectContent:
              'account,email,enabled,icon,id,memo,orgId,telephone,username,wechat',
            selectFrom: 'sys_user',
            selectWhere: `sys_user.id in (${
              this.cardData[this.configData.compId]
            })`,
          };
          let data = [];
          if (this.isContainsAll(this.cardData[this.configData.compId])) {
            data = this.curUserArr;
          } else {
            data = await selectList(params);
            data.forEach((item) => {
              item.icon = JSON.parse(item.icon);
            });
            this.setUserStore(data);
          }
          this.formData.leaders = data;
        } else {
          this.formData.leaders = [];
        }
      } else {
        this.unwatch = this.$watch(
          `parent.form.${this.configData.compId}`,
          async (v) => {
            if (v && this.flag) {
              const params = {
                selectContent:
                  'account,email,enabled,icon,id,memo,orgId,telephone,username,wechat',
                selectFrom: 'sys_user',
                selectWhere: `sys_user.id in (${v})`,
              };
              let data = [];
              if (this.isContainsAll(v)) {
                data = this.curUserArr;
              } else {
                data = await selectList(params);
                data.forEach((item) => {
                  item.icon = JSON.parse(item.icon);
                });
                this.setUserStore(data);
              }
              this.formData.leaders = data;
            }
            if (!v) {
              this.formData.leaders = [];
            }
          },
          {
            immediate: true,
          },
        );
      }
    },
    setUserStore(arr) {
      // console.log(arr);
      arr.forEach((user) => {
        this.$store.commit('setAllUser', user);
      });
    },
    isContainsAll(ids) {
      const arr = ids.split(',');
      const keys = Object.keys(this.getAllUser);
      const temp = [];
      this.curUserArr = [];
      arr.forEach((id) => {
        const obj = keys.find((key) => +key === +id);
        if (!obj) {
          temp.push(obj);
        } else {
          this.curUserArr.push(this.getAllUser[id]);
        }
      });
      if (temp.length === 0) {
        return true;
      }
      this.curUserArr = [];
      return false;
    },
    updateUser(rows) {
      this.formData.leaders = rows;
      let ids = '';
      this.formData.leaders.forEach((item) => {
        ids = `${ids}${item.id},`;
      });
      // console.log(ids);
      this.formData.leaderId = ids;
      if (!this.formData.leaderId) {
        this.showLeadRequired = true;
      } else {
        this.showLeadRequired = false;
      }
      this.userDialogVisible = !this.userDialogVisible;
    },
    // 打开人员选择弹窗
    showSelectUserDialog() {
      this.userDialogVisible = !this.userDialogVisible;
    },
    // 删除管理人员
    deleteLeader(item) {
      const newData =
        this.formData.leaders.filter((obj) => obj.id !== item.id) || [];
      this.formData = {
        ...this.formData,
        leaders: newData,
      };
      let ids = '';
      this.formData.leaders.forEach((obj) => {
        ids = `${ids}${obj.id},`;
      });
      this.formData.leaderId = ids;
      if (!this.formData.leaderId) {
        this.showLeadRequired = true;
      }
    },
    handleComposition(e) {
      if (e.type === 'compositionend') {
        this.isOnComposition = false;
        setTimeout(() => {
          this.leaderSearchAsync();
        }, 100);
      } else {
        this.isOnComposition = true;
      }
    },
    // 人员实时搜索
    leaderSearchAsync() {
      if (this.isOnComposition) return;
      const params = {
        keywords: this.leaderKeywords,
        size: 99,
        current: 1,
        orders: [
          {
            asc: true,
            column: '',
          },
        ],
      };
      if (this.isChecked) return;
      getUserPage(params).then((res) => {
        if (res.records.length) {
          this.leaderList = res.records;
        } else {
          this.leaderList = [];
        }
      });
    },
    // 选中管理人员
    selectLeader(item) {
      const data = this.formData.leaders || [];
      const arr =
        data.length > 0
          ? data.filter((obj) => String(obj.id) === String(item.id))
          : [];
      if (arr.length === 0) {
        data.push(item);
      }
      this.formData = {
        ...this.formData,
        leaders: data,
      };
      const ids = this.formData.leaderId ? this.formData.leaderId : '';
      this.formData.leaderId = `${ids}${item.id},`;
      this.isChecked = true;
      this.leaderKeywords = '';
      this.leaderList = [];
      if (!this.formData.leaderId) {
        this.showLeadRequired = true;
      } else {
        this.showLeadRequired = false;
      }
      this.$refs.leader.focus();
      setTimeout(() => {
        this.isChecked = false;
      }, 1000);
    },
  },
  watch: {
    'formData.leaders': {
      handler(v) {
        const idsArr = [];
        v.forEach((item) => {
          if (item.id) {
            idsArr.push(item.id);
          }
        });
        this.flag = false;
        this.parent.form[this.configData.compId] = idsArr.join(',');
        this.$nextTick(() => {
          this.flag = true;
        });
      },
      deep: true,
    },
    leaderKeywords(v) {
      if (v) {
        this.showSearch = true;
      } else {
        this.showSearch = false;
      }
    },
    beforeDestroy() {
      if (this.unwatch) {
        this.unwatch();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.singleBox {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 44px;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 20px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
    overflow: hidden;
  }
  &.isCard {
    height: 24px;
    min-height: auto;
    line-height: 1;
    box-sizing: border-box;
    padding: 14px 15px 10px 15px;
    &.isConfig {
      min-height: 44px;
    }
    &.noHover {
      padding: 0px;
      margin-top: 0;
      // margin-bottom: 4px;
    }
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    height: 100%;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
    }
  }
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    p:nth-child(2) {
      color: #333;
      border-top: 1px solid #e9e9e9;
    }
  }
}
.manage-item {
  width: 100%;
  line-height: 32px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .add-manage {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px dashed #4689f5;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4689f5;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.5s;
    &.disabled {
      cursor: not-allowed;
      color: #808080;
      border-color: #808080;
      background: none !important;
    }
    &:hover {
      background: #edf3fe;
    }
  }
  .manage-tag {
    padding-right: 6px;
    flex-shrink: 0;
    height: 28px;
    line-height: 28px;
    background: #f1f3f6;
    border-radius: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    .iconfont {
      font-size: 12px;
      cursor: pointer;
      color: #bbc3cd;
      &:hover {
        color: #6b798d;
      }
    }
  }

  .search-manage {
    width: 100px;
    height: 28px;
    flex-shrink: 0;
    border: none;
    outline: #4689f5;
    input {
      width: 100px;
      height: 28px;
      border: none;
      outline: #4689f5;
    }
  }
}
.leader-wrap {
  position: absolute;
  background: #ffffff;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.14);
  margin-top: -246px;
  border-radius: 8px;
  padding: 10px 0;
  z-index: 100;
  p {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    color: #333333;
    padding: 0 20px;
    span {
      color: #4689f5;
    }
  }
  .leader-list {
    width: 100%;
    // max-height: 360px;
    height: 150px;
    overflow-y: auto;
    li {
      display: flex;
      align-items: center;
      height: 36px;
      line-height: 36px;
      font-size: 13px;
      color: #333333;
      padding: 0 20px;
      &:hover {
        background: #f1f7ff;
      }
    }
  }
}
.cardUser {
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(51, 51, 51);
  font-size: 13px;
  &__person {
    height: 24px;
  }
}
</style>
