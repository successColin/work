/** * @name: operationExpert * @author: DELL * @date: 2023/9/1 10:43 *
@description：operationExpert * @update: 2023/9/1 10:43 */
<!-- 页面 -->
<template>
  <apiot-dialog
    :title="getDialogName"
    :visible.sync="visible"
    :loading="loading"
    @sure-click="handleOk"
    :isBigDialog="true"
    class="approverDialog"
  >
    <div class="form-content" v-if="visible">
      <el-form
        ref="valiForm"
        @submit.native.prevent
        :rules="rules"
        :model="info"
      >
        <el-row
          :gutter="30"
          class="form_el_row_wrap"
          style="margin: 0 !important"
        >
          <el-col :span="12" v-if="info.id">
            <el-form-item :label="$t('expert.glassesKeycode')" prop="keycode">
              <apiot-input
                disabled
                v-model="info.keycode"
                placeholder="请输入编码"
              ></apiot-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('expert.glassesName')" prop="name">
              <apiot-input
                v-model="info.name"
                placeholder="请输入名称"
              ></apiot-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('expert.spectacleModel')"
              prop="modelnumber"
            >
              <apiot-input
                v-model="info.modelnumber"
                placeholder="请输入眼镜型号"
              ></apiot-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('expert.serialNumber')"
              prop="serialnumber"
            >
              <apiot-input
                v-model="info.serialnumber"
                placeholder="请输入生产序列号"
              ></apiot-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('role.memo')" prop="arguments">
              <apiot-wangeditor
                ref="wangeditor"
                :value="info.arguments"
                class="wangeditor"
              >
              </apiot-wangeditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </apiot-dialog>
</template>

<script>
import { addGlasses, editGlasses } from '@/api/expert';

export default {
  props: {
    targetObj: {
      type: Object,
      default() {
        return {
          userId: null,
          username: '',
        };
      },
    },
  },
  data() {
    return {
      loading: false,
      info: {},
      visible: false,
    };
  },

  components: {},

  computed: {
    getDialogName() {
      if (this.info.id) {
        return '编辑眼镜信息';
      }
      return '新增眼镜信息';
    },
    rules() {
      return {
        // keycode: [
        //   {
        //     required: true,
        //     // message: '请输入眼镜编码',
        //     trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       if (!value) {
        //         callback(new Error('请输入眼镜编码!'));
        //       } else {
        //         const regex = /^[a-zA-Z0-9]+$/;
        //         if (!regex.test(value)) {
        //           callback(new Error('请输入字母和数字!'));
        //         }
        //         callback();
        //       }
        //     },
        //   }
        // ],
        name: [
          {
            required: true,
            message: '请输入眼镜名称',
            trigger: 'blur',
          },
        ],
        modelnumber: [
          {
            required: true,
            message: '请输入眼镜型号',
            trigger: 'blur',
          },
        ],
        serialnumber: [
          {
            required: true,
            message: '请输入生产序列号',
            trigger: 'blur',
          },
        ],
      };
    },
  },

  mounted() {},
  watch: {
    targetObj: {
      immediate: true,
      handler(v) {
        this.info = JSON.parse(JSON.stringify(v));
      },
    },
  },
  methods: {
    setVisible() {
      this.visible = true;
    },
    handleSelectCC(v) {
      const obj = v[0] || {};
      const { id, username } = obj;
      this.info = {
        ...this.info,
        userId: id,
        username,
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
      const api = this.info.id ? editGlasses : addGlasses;
      this.loading = true;
      try {
        await api({
          ...this.info,
          arguments: this.$refs.wangeditor.getHtmlObj().html, // 备注
        });
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

<style lang="scss" scoped>
.form-content {
  padding: 13px 0;
  overflow: auto;

  ::v-deep {
    .el-form-item__label {
      float: none;
      //padding-bottom: 6px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 1;
    }

    .el-form-item__content {
      margin-top: 6px;
    }
    .el-col{
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }

  .wangeditor {
    // height: 50vh;
    ::v-deep {
      .w-e-scroll {
        height: 210px;
      }
    }
  }
}
</style>
