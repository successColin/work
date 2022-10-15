<!-- 添加或者编辑字段 -->
<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :title="drawerTitle"
    @sure-click="sureClick"
    :loading.sync="showLoading"
  >
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      class="form"
      ref="detail"
    >
      <div class="form--line">
        <el-form-item
          prop="leaderId"
          style="width: 100%"
          class="is-required"
          :label="
            curDrawerType === 1
              ? $t('passwordValid.selectPerson')
              : $t('passwordValid.curPerson')
          "
        >
          <div class="manage-item">
            <span
              class="add-manage m-r-6"
              v-if="curDrawerType === 1"
              @click="showSelectUserDialog()"
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
                v-if="curDrawerType === 1"
              ></i>
            </span>
            <input
              v-if="curDrawerType === 1"
              type="text"
              v-model="leaderKeywords"
              ref="leader"
              class="search-manage"
              :placeholder="$t('org.searchUser')"
              @input="leaderSearchAsync"
              @compositionend="handleComposition"
              @compositionstart="handleComposition"
            />
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
            <div
              v-if="showLeadRequired"
              class="el-form-item__error leader-error"
            >
              {{ $t('org.pleaseSelectManager') }}
            </div>
          </div>
          <!-- 人员选择弹窗1 -->
          <user-dialog
            ref="selectDialog"
            v-if="userDialogVisible"
            :visible.sync="userDialogVisible"
            :leaders="formData.leaders"
            :title="$t('org.addManage')"
            @updateUser="updateUser"
            v-on="$listeners"
            v-bind="$attrs"
          >
          </user-dialog>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('passwordValid.userPasswordValid')"
          class="form--child"
        >
          <el-date-picker
            type="datetime"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            v-model="formData.validTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="this.$t('passwordValid.expirationAction')"
          class="form--child"
        >
          <el-select v-model="formData.expirationType">
            <el-option label="不允许登录" :value="1"></el-option>
            <el-option label="修改密码续期" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('passwordValid.renewalDays')"
          class="form--child half"
        >
          <el-input-number
            class="number"
            placeholder="请输入续期天数"
            v-model="formData.renewalDays"
            :controls="false"
            :precision="0"
          ></el-input-number>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import { getUserPage } from '@/api/orgManage.js';
import { modifySysUserValid } from '@/api/passwordValid.js';
import { formatDate } from '@/utils/utils';
import userDialog from '../../orgManage/components/detail/components/userDialog';
import userAvatar from '../../orgManage/components/userAvatar/index';

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    curDrawerType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showLoading: false,
      // 表单数据
      formData: {
        leaderId: '',
        leaders: [],
        validTime: '',
        expirationType: 1,
        renewalDays: 30
      },
      leaderKeywords: '', // 人员搜索关键字
      userDialogVisible: false, // 人员选择弹窗显隐
      isOnComposition: false,
      showLeadRequired: false,
      isChecked: false,
      leaderList: []
    };
  },

  components: {
    userDialog,
    userAvatar
  },

  computed: {
    drawerTitle() {
      return this.$t('passwordValid.set', {
        name: this.$t('passwordValid.userPasswordValid')
      });
    },
    rules() {
      return {};
    }
  },

  mounted() {},

  methods: {
    initFormData(obj) {
      console.log(this.curDrawerType);
      this.showLeadRequired = false;
      this.formData.leaderId = '';
      this.formData.leaders = [];
      if (this.curDrawerType === 1) {
        if (obj.length) {
          obj.forEach((item) => {
            this.formData.leaderId += `${item.userId},`;
            this.formData.leaders.push({
              id: item.userId,
              username: item.username
            });
          });
        }
        this.formData.expirationType = 1;
        this.formData.renewalDays = 30;
      } else {
        console.log(obj);
        this.formData.leaderId += `${obj.userId},`;
        this.formData.leaders.push({
          id: obj.userId,
          username: obj.username
        });
        this.formData.expirationType = obj.validType;
        this.formData.renewalDays = obj.renewDay;
        this.formData.validTime = obj.validTime;
      }
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
      // this.$refs.detail.validateField('leaderId');
    },
    // 打开人员选择弹窗
    showSelectUserDialog() {
      if (this.curDrawerType === 2) {
        return false;
      }
      this.userDialogVisible = !this.userDialogVisible;
    },
    // 删除管理人员
    deleteLeader(item) {
      const newData = this.formData.leaders.filter((obj) => obj.id !== item.id) || [];
      this.formData = {
        ...this.formData,
        leaders: newData
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
      const data = this.formData.leaders || [];
      const arr = data.length > 0 ? data.filter((obj) => String(obj.id) === String(item.id)) : [];
      if (arr.length === 0) {
        data.push(item);
      }
      this.formData = {
        ...this.formData,
        leaders: data
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
    sureClick() {
      this.$refs.detail.validate((valid) => {
        if (!this.formData.leaderId) {
          this.showLeadRequired = true;
          return false;
        }
        if (valid) {
          this.saveData();
        } else {
          // console.log('error submit!!');
          this.showLoading = false;
          return false;
        }
      });
    },
    async saveData() {
      try {
        const params = {
          renewDay: this.formData.renewalDays,
          userIds: this.formData.leaderId,
          validTime: this.formData.validTime,
          validType: this.formData.expirationType
        };
        const data = await modifySysUserValid(params);
        this.showLoading = false;
        this.$emit('update:visible', false);
        this.$emit('refreshPage');
        this.$message({
          type: 'success',
          message: '保存成功'
        });
        console.log(data);
      } catch (error) {
        this.showLoading = false;
      }
    },
    resetForm() {
      this.formData = {
        leaderId: '',
        leaders: [],
        validTime: '',
        expirationType: 1,
        renewalDays: 30
      };
    }
  },

  watch: {
    drawer(v) {
      if (v) {
        if (this.curDrawerType === 1) {
          this.formData.validTime = formatDate(
            new Date(new Date().getTime() + 3600 * 1000 * 24 * 30),
            'yyyy-MM-dd hh:mm:ss'
          );
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
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
    margin-bottom: 6px;
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
}
.number {
  width: 100%;
  ::v-deep {
    .el-input__inner {
      text-align: left;
    }
  }
}
</style>
