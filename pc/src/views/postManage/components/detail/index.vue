<!--
 * @Descripttion: 修改职位弹窗
 * @version:
 * @Author: tjf
 * @Date: 2021-04-14 15:24:27
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-20 10:09:29
-->
<!-- treeTable -->
<template>
  <div class="detail">
    <section class="drawer-content">
      <el-form
        @submit.native.prevent
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
                any: $t('post.post'),
              })
            "
          >
          </apiot-input>
        </el-form-item>
        <el-form-item class="hlaf" prop="parentId" :label="$t('post.position')">
          <div class="org-item">
            <span class="add-org m-r-6" @click="showSelectOrgDialog('post')">
              <i class="iconfont icon-jiahao m-r-6"></i>
              {{ $t('common.select') }}
            </span>
            <span class="org-tag m-r-6" v-if="!!curData.parentId">
              <i class="iconfont icon-zhiwei m-r-6"></i>
              {{ curData.parentName || '' }}
              <i class="iconfont icon-guanbi m-l-6" @click="deleteParent()"></i>
            </span>
          </div>
          <!-- 职位选择弹窗 -->
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
import orgDialog from './components/orgDialog/index';

export default {
  components: {
    orgDialog
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
              any: this.$t('post.post')
            }),
            trigger: 'blur'
          }
        ]
      },
      leaderKeywords: '',
      leaderList: [],
      // 选择弹窗
      orgDialogVisible: false,
      userDialogVisible: false,
      pageSize: 10
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

  created() {
    // console.log(this.editData);
  },

  mounted() {
    if (this.type === 'edit') {
      this.curData = JSON.parse(JSON.stringify(this.editData));
    }
  },
  methods: {
    sureClick() {
      this.$refs.detail.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.curData);
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    // 打开人员选择弹窗
    showSelectOrgDialog() {
      this.orgDialogVisible = !this.orgDialogVisible;
    },
    // 更新所属职位
    updateOrg(obj) {
      if (!obj) return;
      this.curData.parentId = obj.id;
      this.curData.parentName = obj.name;
      this.curData.rootPath = obj.rootPath;
      this.orgDialogVisible = !this.orgDialogVisible;
    },
    deleteParent() {
      this.curData.parentId = 0;
      this.curData.parentName = '';
      this.curData.rootPath = 0;
      // console.log(this.curData.parentId);
    }
  }
};
</script>

<style lang='scss' scoped>
.drawer-content {
  width: 100%;
  height: 100%;
  padding: 36px 21px;
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
            background: #ffede1;
            border-radius: 4px;
            padding: 0 6px;
            display: flex;
            align-items: center;
            .iconfont {
              font-size: 16px;
              color: #fc8256;
            }
            .icon-zuzhi {
              font-size: 16px;
            }
            .icon-guanbi {
              cursor: pointer;
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
