<!--
 * @Descripttion: 点击编辑抽屉内容
 * @Author: ytx
 * @Date: 2021-06-29 18:02:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:02:05
-->
<template>
  <div class="drawer">
    <apiot-drawer
      v-on="$listeners"
      v-bind="$attrs"
      :loading.sync="showLoading"
      @sure-click="sureClick"
      @close="handleClose"
    >
      <el-form
        label-position="top"
        :model="curData"
        :rules="rules"
        ref="curData"
        v-if="isShow"
        class="drawer__curData"
      >
        <!-- 输入框 -->
        <el-form-item
          prop="title"
          class="hlaf"
          :label="$t('announce.announcementTitle')"
        >
          <apiot-input
            :placeholder="placeholder"
            v-model="curData.title"
            maxlength="20"
          ></apiot-input>
        </el-form-item>
        <el-form-item
          prop="isPlacedTop"
          :label="$t('announce.topOrNot')"
          class="hlaf"
        >
          <apiot-switch
            v-model="curData.isPlacedTop"
            :active-value="1"
            :inactive-value="0"
            class="passwordConfig__switch"
          ></apiot-switch>
        </el-form-item>
        <!-- <el-form-item prop="enable"
          :label="$t('announce.isEnable')"
          class="hlaf">
          <apiot-switch
            v-model="curData.enable"
            :active-value="1"
            :inactive-value="2"
            class="passwordConfig__switch"
          ></apiot-switch>
        </el-form-item> -->
        <el-form-item
          :label="$t('announce.enableTime')"
          prop="startTime"
          class="hlaf"
        >
          <el-date-picker
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            v-model="curData.startTime"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="$t('announce.expirationTime')"
          class="hlaf"
          prop="endTime"
        >
          <el-date-picker
            type="date"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
            v-model="curData.endTime"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          prop="leaderId"
          class="leaders"
          :label="$t('announce.receiver')"
        >
          <div class="manage-wrap">
            <div class="manage-item">
              <span
                class="add-manage m-r-6"
                @click="showSelectUserDialog('user')"
              >
                <i class="iconfont icon-jiahao"></i>
              </span>
              <span
                class="manage-tag m-r-6"
                v-for="item in curData.leaders || []"
                :key="item.id"
              >
                <user-avatar :userItem="item"></user-avatar>
                <i
                  class="iconfont icon-guanbi m-l-6"
                  @click="deleteLeader(item)"
                ></i>
              </span>
              <input
                type="text"
                v-model="leaderKeywords"
                ref="leader"
                class="search-manage"
                :placeholder="$t('org.searchUser')"
                @input="leaderSearchAsync"
                @compositionend="handleComposition"
                @compositionstart="handleComposition"
              />
            </div>
            <div
              class="leader-wrap"
              v-show="leaderList.length > 0 && leaderKeywords"
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
          </div>
          <div v-if="showLeadRequired" class="el-form-item__error leader-error">
            接收人员和接收分组不能同时为空！
          </div>
          <!-- 人员选择弹窗1 -->
          <user-dialog
            ref="selectDialog"
            v-if="userDialogVisible"
            :visible.sync="userDialogVisible"
            :leaders="curData.leaders"
            :title="$t('announce.receiver')"
            @updateUser="updateUser"
          >
          </user-dialog>
        </el-form-item>
        <!-- 输入框 -->
        <el-form-item
          prop="group"
          class="leaders"
          :label="$t('announce.receiverGroup')"
        >
          <div class="manage-wrap">
            <div class="manage-item">
              <span
                class="add-manage m-r-6"
                @click="showSelectUserGroupDialog('user')"
              >
                <i class="iconfont icon-jiahao"></i>
              </span>
              <span
                class="manage-tag m-r-6"
                v-for="item in curData.groups || []"
                :key="item.id"
              >
                <user-avatar :userItem="item"></user-avatar>
                <i
                  class="iconfont icon-guanbi m-l-6"
                  @click="deleteGroup(item)"
                ></i>
              </span>
            </div>
          </div>
          <div
            v-if="showGroupRequired"
            class="el-form-item__error leader-error"
          >
            {{ $t('org.pleaseSelectManager') }}
          </div>
          <group-dialog
            ref="selectDialog"
            v-show="userGroupDialogVisible"
            :visible.sync="userGroupDialogVisible"
            :curData="curData"
            :title="$t('announce.receiverGroup')"
            @updateGroup="updateGroup"
          >
          </group-dialog>
        </el-form-item>
        <el-form-item prop="memo" :label="$t('importTemplate.remark')">
          <apiot-input
            :placeholder="placeholder"
            v-model="curData.memo"
            maxlength="100"
          ></apiot-input>
        </el-form-item>
        <!-- 富文本 -->
        <el-form-item :label="$t('announce.announceContent')">
          <apiot-wangeditor
            ref="wangeditor"
            class="helpCenterShow"
            :value="curData.htmlContent"
            @change="handleWangeditorChange"
          >
          </apiot-wangeditor>
        </el-form-item>
        <!-- 视频上传 -->
      </el-form>
    </apiot-drawer>
  </div>
</template>

<script>
import { insertAnnounce, modifyAnnounce } from '@/api/announceManage.js';
import { getUserPage } from '@/api/orgManage.js';
import userDialog from '@/views/orgManage/components/detail/components/userDialog/index';
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import groupDialog from '../detail/components/userDialog/index';

export default {
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: ''
    },
    // 正文标题
    drawerTitle: {
      type: String,
      default: ''
    },
    // 当前表格对象
    currentTableObj: {
      type: Object,
      default: () => {}
    },
    // 新增：true；编辑：fasle
    isAddDrawerState: {
      type: Boolean,
      default: true
    },
    isShow: {
      type: Boolean,
      default: true
    },
    // 当前分组
    group: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 是否显示loading
      showLoading: false,
      // 视频格式
      curData: {},
      userDialogVisible: false,
      leaderKeywords: '',
      leaderList: [],
      showLeadRequired: false,
      showGroupRequired: false,
      userGroupDialogVisible: false,

    };
  },
  computed: {
    rules() {
      return {
        title: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('announce.announcementTitle')
            }),
            trigger: 'change'
          }
        ],
        startTime: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', { any: this.$t('announce.enableTime') }),
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('announce.expirationTime')
            }),
            trigger: 'change'
          }
        ]
      };
    }
  },
  components: {
    userDialog,
    userAvatar,
    groupDialog
  },
  watch: {
    // 赋值
    currentTableObj(v) {
      console.log(v, 1111111);
      if (JSON.stringify(v) !== '{}') {
        this.curData = JSON.parse(JSON.stringify(v));
        this.curData.htmlContent = v.html || '';
      }
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:currentTableObj', {});
      this.curData = {};
    },
    handleWangeditorChange() {},
    // 打开人员选择弹窗
    showSelectUserDialog() {
      this.userDialogVisible = !this.userDialogVisible;
    },
    // 打开人员分组选择弹窗
    showSelectUserGroupDialog() {
      this.userGroupDialogVisible = !this.userGroupDialogVisible;
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
            column: ''
          }
        ]
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
      const data = this.curData.leaders || [];
      const arr = data.length > 0 ? data.filter((obj) => String(obj.id) === String(item.id)) : [];
      if (arr.length === 0) {
        data.push(item);
      }
      this.curData = {
        ...this.curData,
        leaders: data
      };
      const ids = this.curData.leaders.map((obj) => obj.id);
      this.curData.childIds = {
        ...this.curData.childIds,
        1: [...ids],
      };
      this.isChecked = true;
      this.leaderKeywords = '';
      this.leaderList = [];
      this.$refs.leader.focus();
      setTimeout(() => {
        this.isChecked = false;
      }, 1000);
    },
    // 删除管理人员
    deleteLeader(item) {
      const newData = this.curData.leaders.filter((obj) => obj.id !== item.id) || [];
      this.curData = {
        ...this.curData,
        leaders: newData
      };
      const ids = this.curData.leaders.map((obj) => obj.id);
      this.curData.childIds = {
        ...this.curData.childIds,
        1: [...ids],
      };
    },
    deleteGroup(item) {
      const newData = this.curData.groups.filter((obj) => obj.id !== item.id
        || obj.type !== item.type) || [];
      this.curData = {
        ...this.curData,
        groups: newData
      };
      const roleids = this.curData.groups.filter((obj) => obj.type === 2).map((o) => o.id);
      const orgids = this.curData.groups.filter((obj) => obj.type === 3).map((o) => o.id);
      const postids = this.curData.groups.filter((obj) => obj.type === 4).map((o) => o.id);
      this.curData.childIds = {
        ...this.curData.childIds,
        2: [...roleids],
        3: [...orgids],
        4: [...postids],
      };
    },
    updateUser(rows) {
      this.curData.leaders = rows;
      const ids = this.curData.leaders.map((item) => item.id);
      this.curData.childIds = {
        ...this.curData.childIds,
        1: [...ids],
      };
      if (this.showLeadRequired) {
        this.showLeadRequired = false;
      }
      this.userDialogVisible = !this.userDialogVisible;
    },
    updateGroup(item) {
      this.curData.groups = [
        ...item.roleusers,
        ...item.orgusers,
        ...item.postusers,
      ];
      const roleids = item.roleusers.map((obj) => obj.id);
      const orgids = item.orgusers.map((obj) => obj.id);
      const postids = item.postusers.map((obj) => obj.id);
      this.curData.childIds = {
        ...this.curData.childIds,
        2: [...roleids],
        3: [...orgids],
        4: [...postids],
      };
      if (this.showLeadRequired) {
        this.showLeadRequired = false;
      }
      this.userGroupDialogVisible = !this.userGroupDialogVisible;
      // this.$refs.detail.validateField('leaderId');
    },
    // 确定
    sureClick() {
      this.$refs.curData.validate(async (valid) => {
        if (valid) {
          console.log(this.curData);
          if (!this.curData.childIds || !this.curData.childIds['1'].length && !this.curData.childIds['2'].length
            && !this.curData.childIds['3'].length && !this.curData.childIds['4'].length) {
            this.showLeadRequired = true;
            this.showLoading = false;
            return false;
          }
          this.showLoading = true;
          const detailId = (this.currentTableObj && this.currentTableObj.id) || '';
          const htmlObj = this.$refs.wangeditor.getHtmlObj();
          const param = {
            ...this.curData,
            html: htmlObj.html, // html
            txt: htmlObj.text, // txt
            id: detailId,
            groupId: this.group.id,
            startTime: `${this.curData.startTime} 00:00:00`,
            endTime: `${this.curData.endTime} 23:59:59`,
            logData: {
              operateType: this.isAddDrawerState ? 1 : 2,
              title: {
                name: this.$t('announce.announcementTitle')
              },
              html: {
                name: this.$t('importTemplate.content')
              },
              isPlacedTop: {
                name: this.$t('announce.topOrNot')
              },
              enable: {
                name: this.$t('common.state')
              }
            },
            childIds: JSON.stringify(this.curData.childIds)
          };
          delete param.leaders;
          try {
            // 后台接口调整，代码逻辑如下：
            if (this.isAddDrawerState) {
              param.sno = 1;
              await insertAnnounce(param);
            } else {
              await modifyAnnounce(param);
            }
            this.$emit('update:visible', false);
            this.$emit('getTableList');
            this.$message({
              type: 'success',
              message: this.isAddDrawerState
                ? this.$t('common.newSuccess')
                : this.$t('common.successfullyModified')
            });
            this.showLoading = false;
          } catch (err) {
            console.log(err);
            this.showLoading = false;
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
// @import './wangEditor.scss';
$--avataruploaderlength: 104px;
$--videoHeight: 340px;
.drawer {
  &__curData {
    margin: 30px 37px 0;
  }
  &__special {
    .drawer__empty {
      width: 32px;
    }
    &--time {
      ::v-deep {
        .el-input__inner {
          padding-left: 30px !important;
        }
        .el-input__icon {
          height: 46px;
          line-height: 46px;
          font-size: 16px;
        }
      }
    }
    ::v-deep {
      .el-form-item__content {
        display: flex;
      }
    }
  }
  &__title {
    margin: 15px 0 6px;
  }
  &__uploadImg {
    // display: flex;
    .tips {
      display: inline-block;
      font-size: 13px;
      color: #aaaaaa;
      margin-left: 14px;
      position: relative;
      bottom: 5px;
    }
    .drawer__avatar {
      .el-upload-list__item-actions {
        i {
          line-height: 1;
          vertical-align: baseline;
          display: inline-block;
          font-size: 18px;
        }
      }
    }
  }
  &__avatar {
    width: 105px;
    height: 105px;
    overflow: hidden;
    display: inline-block;
    &--default {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      height: 104px;
      i {
        color: #bbc3cd;
        font-size: 17px;
      }
      div {
        line-height: 32px;
        font-size: 12px;
        color: #aaaaaa;
      }
    }
  }
  &__uploadVideo {
    position: relative;
    &--content {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      .drawer__iconButton {
        width: 69px;
        height: 24px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        position: absolute;
        right: 20px;
        top: 20px;
        display: flex;
        align-items: center;
        i {
          width: 50%;
          height: 100%;
          line-height: 24px;
          text-align: center;
          color: #bbc3cd;
          cursor: pointer;
        }
        i:hover {
          color: $--color-primary;
        }
        &--empty {
          border-right: 1px solid #e9e9e9;
          width: 1px;
          height: 12px;
        }
      }
    }
    &--player {
      width: 300px;
      height: 300px;
      display: flex;
      margin-top: 20px;
    }
    &--icon {
      font-size: 39px;
      color: #d2d7e0;
      margin-bottom: 10px;
    }
    &--font1 {
      font-size: 13px;
      color: #333333;
      line-height: 25px;
    }
    &--font2 {
      font-size: 12px;
      color: #808080;
      line-height: 25px;
    }
    ::v-deep {
      .el-upload,
      .el-upload-dragger {
        width: 100%;
        height: $--videoHeight;
      }
      .el-upload-dragger {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #fafafa;
        border: 1px dashed #e9e9e9;
      }
    }
  }
  .leader-error {
    overflow: hidden;
    clear: both;
    animation: showError 0.3s 1 forwards;
  }
  .manage-wrap {
    // max-height: 76px;
    // overflow-y: auto;
    width: 100%;
    position: relative;
  }
  .manage-item {
    width: 100%;
    line-height: 32px;
    display: flex;
    flex-wrap: wrap;
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
      margin-bottom: 6px;
      cursor: pointer;
      transition: all 0.5s;
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
      margin-bottom: 6px;
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
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    padding: 10px 0;
    z-index: 3;
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
      max-height: 360px;
      overflow-y: auto;
      li {
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
  ::v-deep {
    // 抽屉头部
    .el-drawer__header {
      padding-left: 30px;
    }
    // 输入框
    .el-input__inner {
      font-size: 14px;
      height: 32px;
      line-height: 30px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      &:focus {
        border: 1px solid #1989fa;
      }
    }
    .el-form-item {
      padding: 0 15px;
      box-sizing: border-box;
      display: inline-block;
      margin-bottom: 22px;
      width: 100%;
      &__label {
        line-height: 1;
        color: #333333;
        padding-bottom: 6px;
      }
    }
    .leaders {
      .el-form-item__content {
      }
    }
    .hlaf {
      width: 50%;
    }
    .disabled {
      .el-upload--picture-card {
        display: none;
      }
    }
    .el-upload--picture-card {
      width: 104px;
      height: 104px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px dashed #e0e0e0;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 104px;
      height: 104px;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .el-upload-list--picture-card .el-upload-list__item:focus {
      outline: none;
    }
    .w-e-text-container {
      // height: calc(100vh - 393px) !important;
      height: 100% !important;
    }
    .helpCenterShow {
      display: flex;
      flex-direction: column;
      .w-e-text-container {
        flex: 1;
      }
      .w-e-scroll {
        height: calc(100vh - 620px);
      }
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }
}
</style>
