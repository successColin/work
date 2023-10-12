/**
* @name: operationExpert
* @author: DELL
* @date: 2023/9/1 10:43
* @description：operationExpert
* @update: 2023/9/1 10:43
*/
<!-- 页面 -->
<template>
  <apiot-dialog
      :title="getDialogName"
      :visible.sync="visible"
      :loading="loading"
      @sure-click="handleOk"
      class="approverDialog"
  >
    <div class="form-content" v-if="visible">
      <el-form
          ref="valiForm"
          @submit.native.prevent
          :rules="rules"
          :model="info"
      >
        <el-row class="form_el_row_wrap" style="margin: 0 !important">
          <el-col :span="24" :class="{readonly: !!info.id}">
            <el-form-item
              :label="$t('expert.account')"
              prop="ccList">
              <div>
                <CCUsers
                    v-if="!info.id"
                    :isMute="false"
                    :value="ccList"
                    @change="handleSelectCC"
                />
                <user-headname
                    v-if="info.id"
                    :userInfo="ccList[0]"
                    v-bind="$attrs"
                ></user-headname>

              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('expert.memo')" prop="domain">
              <apiot-input
                  v-forbid
                  v-model="info.domain"
                  type="textarea"
              ></apiot-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </apiot-dialog>
</template>

<script>
import { addUser, editUser } from '@/api/expert';

const CCUsers = () => import('@/views/TaskToDo/Components/UserSelect/index');

export default {
  props: {
    targetObj: {
      type: Object,
      default() {
        return {
          userid: null,
          username: ''
        };
      }
    }
  },
  data() {
    return {
      loading: false,
      info: {},
      visible: false
    };
  },

  components: {
    CCUsers
  },

  computed: {
    ccList() {
      if (!this.info.userid) {
        return [];
      }
      const {
        userid,
        username
      } = this.info;
      return [{
        id: userid,
        username
      }];
    },
    getDialogName() {
      if (this.info.id) {
        return '编辑专家信息';
      }
      return '新增专家信息';
    },
    rules() {
      return {
        ccList: [
          {
            required: true,
            message: '请选择专家',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.info.userid) {
                callback(new Error('请选择专家!'));
              } else {
                callback();
              }
            },
          }
        ]
      };
    }
  },

  mounted() {
  },
  watch: {
    targetObj: {
      immediate: true,
      handler(v) {
        this.info = JSON.parse(JSON.stringify(v));
      }
    }
  },
  methods: {
    setVisible() {
      this.visible = true;
    },
    handleSelectCC(v) {
      const obj = v[0] || {};
      const {
        id,
        username
      } = obj;
      this.info = {
        ...this.info,
        userid: id,
        username
      };
      this.$refs.valiForm.validate();
    },
    handleOk() {
      this.$refs.valiForm.validate((valid) => {
        if (valid) {
          this.doSubmit();
        } else {
          return false;
        }
      });
    },
    async doSubmit() {
      const api = this.info.id ? editUser : addUser;
      this.loading = true;
      try {
        await api(this.info);
        this.loading = false;
        this.$message.success('操作成功!');
        this.visible = false;
        this.$emit('refresh');
      } catch (e) {
        this.loading = false;
      }
    },
  },
  name: 'operationExpert',
};
</script>

<style lang='scss' scoped>
.form-content {
  padding: 13px 20px;
  .readonly {
    ::v-deep {
      .el-form-item__label {
        float: none;
      }
      .el-form-item__content {
        margin-top: 6px;
      }
    }
  }
  ::v-deep {
    .el-form-item__label {
      //float: none;
      padding-bottom: 6px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 1;
    }
  }
}
</style>
