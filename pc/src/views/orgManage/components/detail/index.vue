<!--
 * @Descripttion: 修改组织弹窗
 * @version:
 * @Author: tjf
 * @Date: 2021-04-14 15:24:27
 * @LastEditors: tjf
 * @LastEditTime: 2021-06-03 09:57:28
-->
<!-- treeTable -->
<template>
  <div class="detail">
    <section class="drawer-content">
      <el-form
        label-position="top"
        ref="detail"
        :rules="rules"
        label-width="80px"
        :model="curData"
      >
        <el-form-item
          class="hlaf"
          :label="$t('common.name', { name: '' })"
          prop="name"
        >
          <apiot-input
            v-model="curData.name"
            maxlength="30"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                any: $t('org.org'),
              })
            "
          ></apiot-input>
        </el-form-item>
        <el-form-item
          class="hlaf"
          :label="$t('org.keycode')"
          prop="keyCode"
        >
          <apiot-input
            v-model="curData.keyCode"
            maxlength="30"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                any: $t('org.keycode'),
              })
            "
          ></apiot-input>
        </el-form-item>
        <el-form-item
          class="hlaf"
          prop="parentId"
          :label="$t('org.organization')"
        >
          <div class="org-item">
            <span class="add-org m-r-6" @click="showSelectOrgDialog('org')">
              <i class="iconfont icon-jiahao m-r-6"></i>
              {{ $t('common.select') }}
            </span>
            <apiot-tag
              v-if="!!curData.parentId"
              class="m-r-6"
              @deleteSelf="deleteParent"
              :key="curData.parentName"
              :item="curData.parentName"
              itemIconClass="icon-zuzhi"
            ></apiot-tag>
            <!-- <span class="org-tag m-r-6" v-if="!!curData.parentId">
              <i class="iconfont icon-zuzhi m-r-6"></i>
              {{ curData.parentName || '' }}
              <i class="iconfont icon-guanbi m-l-6" @click="deleteParent()"></i>
            </span> -->
          </div>
        </el-form-item>
        <el-form-item
          prop="leaderId"
          class="is-required"
          :label="$t('org.manage')"
        >
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
              <!-- <span class="imageName m-r-6" :style="item.styleColor">{{item.imageName}}</span>
              {{item.username}} -->
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
            :leaders="curData.leaders"
            :title="$t('org.addManage')"
            @updateUser="updateUser"
            v-on="$listeners"
            v-bind="$attrs"
          >
          </user-dialog>
          <!-- 组织选择弹窗 -->
          <org-dialog
            ref="selectDialog"
            v-if="orgDialogVisible"
            :visible.sync="orgDialogVisible"
            :curData="curData"
            @updateOrg="updateOrg"
            v-on="$listeners"
            v-bind="$attrs"
          >
          </org-dialog>
        </el-form-item>
        <el-form-item :label="$t('common.desc')">
          <el-input
            type="textarea"
            :rows="2"
            v-model="curData.memo"
            maxlength="200"
            :placeholder="
              $t('placeholder.pleaseEnterAnyModify', {
                any: $t('common.desc'),
              })
            "
          ></el-input>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { getUserPage } from '@/api/orgManage.js';
import orgDialog from './components/orgDialog/index';
import userDialog from './components/userDialog/index';
import userAvatar from '../userAvatar/index';

export default {
  components: {
    orgDialog,
    userDialog,
    userAvatar
  },
  name: 'treeTable',
  data() {
    return {
      curData: {
        parentId: 0,
        rootPath: 0
      },
      selectRows: [],
      curChildData: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAnyName', {
              any: this.$t('org.org')
            }),
            trigger: 'blur'
          }
        ]
        // leaderId: [
        //   { required: true,
        //     message: this.$t('placeholder.pleaseEnterAnyName', {
        //       any: this.$t('org.org')
        //     }),
        //     trigger: 'change' },
        // ],
      },
      leaderKeywords: '',
      leaderList: [],
      // 选择弹窗
      orgDialogVisible: false,
      userDialogVisible: false,
      pageSize: 10,
      isChecked: false,
      showLeadRequired: false,
      isOnComposition: false
    };
  },
  props: {
    // 当前编辑数据
    editData: {
      type: Object,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      default() {
        return '';
      }
    }
  },

  computed: {},

  created() {},

  mounted() {
    if (this.type === 'edit') {
      this.curData = JSON.parse(JSON.stringify(this.editData));
    }
  },
  methods: {
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
      const ids = this.curData.leaderId ? this.curData.leaderId : '';
      this.curData.leaderId = `${ids}${item.id},`;
      this.isChecked = true;
      this.leaderKeywords = '';
      this.leaderList = [];
      if (!this.curData.leaderId) {
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
        if (!this.curData.leaderId) {
          this.showLeadRequired = true;
          return false;
        }
        if (valid) {
          this.$emit('submit', this.curData);
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 删除管理人员
    deleteLeader(item) {
      const newData = this.curData.leaders.filter((obj) => obj.id !== item.id) || [];
      this.curData = {
        ...this.curData,
        leaders: newData
      };
      let ids = '';
      this.curData.leaders.forEach((obj) => {
        ids = `${ids}${obj.id},`;
      });
      this.curData.leaderId = ids;
      if (!this.curData.leaderId) {
        this.showLeadRequired = true;
      }
    },
    // 打开人员选择弹窗
    showSelectOrgDialog() {
      this.orgDialogVisible = !this.orgDialogVisible;
    },
    // 打开人员选择弹窗
    showSelectUserDialog() {
      this.userDialogVisible = !this.userDialogVisible;
    },
    // 更新所属组织
    updateOrg(obj) {
      // console.log(obj);
      if (!obj) return;
      this.curData.parentId = obj.id;
      this.curData.parentName = obj.name;
      this.curData.rootPath = obj.rootPath;
      this.orgDialogVisible = !this.orgDialogVisible;
      // this.$nextTick(() => {
      //   this.$refs.detail.validateField('parentId');
      // });
    },
    updateUser(rows) {
      this.curData.leaders = rows;
      let ids = '';
      this.curData.leaders.forEach((item) => {
        ids = `${ids}${item.id},`;
      });
      // console.log(ids);
      this.curData.leaderId = ids;
      if (!this.curData.leaderId) {
        this.showLeadRequired = true;
      } else {
        this.showLeadRequired = false;
      }
      this.userDialogVisible = !this.userDialogVisible;
      // this.$refs.detail.validateField('leaderId');
    },
    deleteParent() {
      this.curData.parentId = 0;
      this.curData.parentName = '';
      this.curData.rootPath = 0;
    }
  }
};
</script>

<style lang='scss' scoped>
@keyframes showError {
  from {
    height: 0;
  }
  to {
    height: 16px;
  }
}
.drawer-content {
  width: 100%;
  height: 100%;
  padding: 30px 21px;
  box-sizing: border-box;
  ::v-deep {
    .el-form {
      .el-form-item {
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        display: inline-block;
        margin-bottom: 22px;
        &__label {
          line-height: 1;
          color: #333333;
          padding-bottom: 6px;
        }
        .el-input__inner {
          height: 32px;
          line-height: 30px;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
          &:focus {
            border: 1px solid #1989fa;
          }
        }
        .el-textarea__inner {
          border: 1px solid #e9e9e9;
        }
        .org-item {
          width: 100%;
          line-height: 32px;
          display: flex;
          .add-org {
            width: 66px;
            height: 28px;
            border-radius: 4px;
            border: 1px dashed #d9d9d9;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            cursor: pointer;
            transition: all 0.5s;
            .iconfont {
              color: #aaaaaa;
              transition: all 0.5s;
            }
            &:hover {
              color: #4689f5;
              border: 1px dashed #4689f5;
              background: #edf3fe;
              .iconfont {
                color: #4689f5;
              }
            }
          }
          .org-tag {
            height: 28px;
            background: #e5f0ff;
            border-radius: 4px;
            padding: 0 6px;
            display: flex;
            align-items: center;
            .iconfont {
              font-size: 12px;
              color: #4689f5;
            }
            .icon-zuzhi {
              font-size: 16px;
            }
            .icon-guanbi {
              cursor: pointer;
            }
          }
        }
        .leader-error {
          overflow: hidden;
          clear: both;
          animation: showError 0.3s 1 forwards;
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
            // .imageName {
            //   width: 24px;
            //   height: 24px;
            //   border-radius: 14px;
            //   color: #fff;
            //   font-size: 12px;
            //   text-align: center;
            //   line-height: 24px;
            // }
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
                // .imageName {
                //   display: inline-block;
                //   width: 28px;
                //   height: 28px;
                //   border-radius: 14px;
                //   color: #fff;
                //   font-size: 12px;
                //   text-align: center;
                //   line-height: 28px;
                // }
              }
            }
          }
        }
      }
      .hlaf {
        width: 50%;
      }
    }
  }
}
.personnel {
  height: 100%;
  &__selected {
    width: 100%;
    border: 1px solid #e9e9e9;
  }
  &__content {
    height: 100%;
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
        overflow-y: auto;
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
}
</style>
