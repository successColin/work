<!--
 * @Author: sss
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息模板详情
-->
<template>
  <apiot-drawer
    class="messageDetail"
    v-on="$listeners"
    v-bind="$attrs"
    :title="drawerTitle"
    :loading.sync="showLoading"
    @sure-click="sureClick"
  >
    <div class="detail" @click="handleclick" v-if="isShow">
      <el-form
        label-position="top"
        label-width="80px"
        class="form temDetail"
        ref="temDetail"
        :model="formData"
        :rules="rules"
        @submit.native.prevent
      >
        <div class="form--line">
          <el-form-item
            :label="$t('messageTemplate.templateName')"
            class="form--child"
            prop="templateName"
            ref="entity-form"
          >
            <apiot-input
              v-model="formData.templateName"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('messageTemplate.templateName'),
                })
              "
            ></apiot-input>
          </el-form-item>
        </div>
      </el-form>
      <section class="messageDetail__configure">
        <article
          class="messageDetail__configure--receiver"
          :class="{ isError: receiversError }"
        >
          <receiver
            :value="formData.receivers"
            :receiversType="formData.receiversTypes"
            @change="changeReceivers"
            @receiverTypeChange="receiverTypeChange"
          ></receiver>
        </article>
        <article class="messageDetail__configure--bottom">
          <variable
            ref="variable"
            v-model="formData.variables"
            :sqlScript="formData.sqlScript"
            @change="varsChange"
          ></variable>
          <div class="messageDetail__configure--configuration">
            <configuration
              v-model="configurationObj"
              :variables="formData.variables"
            ></configuration>
          </div>
          <!-- <div class="messageDetail__configure--message"></div> -->
        </article>
      </section>
    </div>
  </apiot-drawer>
</template>

<script>
import { tempAdd, tempEdit, getDetail } from '@/api/messageTemplate';
import Variable from '../Variable';
import Receiver from '../Receiver';
import Configuration from '../Configuration';

export default {
  components: { Variable, Receiver, Configuration },

  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    drawerTitle: { type: String, default: '' },
    SelectVariabletle: {
      type: String,
      default: ''
    }
  },

  provide() {
    return {
      getVariables: this.getVariables
    };
  },

  data() {
    return {
      receiversError: false,
      isOpenVar: true, // 是否打开了变量区注入功能
      showLoading: false,
      formData: {
        templateName: '',
        variables: [],
        receivers: [],
        content: [],
        supportTypes: [2],
        receiversTypes: [] // 接收人类型
      },
      configurationObj: { contents: [], supportTypes: [] },
      rules: {
        templateName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('messageTemplate.templateName')
            }),
            trigger: 'change'
          }
        ]
      },
      formItems: [{ label: 'messageTemplate.templateName', prop: 'templateName' }]
    };
  },

  computed: {
    // 接收人校验
    getReceivers() {
      const { receivers, receiversTypes } = this.formData;
      const receiver =
        receivers.filter((item) => receiversTypes.indexOf(item.receiverType) !== -1) || [];
      let array = [];
      receiver.forEach((element) => {
        const receiverValue = element.receiverValue || [];
        array = [...array, ...receiverValue];
      });
      return array;
    }
  },

  methods: {
    // 初始化
    initFormData(row) {
      this.showLoading = false;
      this.receiversError = false;
      const { contents = [], supportTypes = [4] } = row;
      this.configurationObj = { contents, supportTypes };
      this.formData = { ...this.formData, ...row };
    },
    receiverTypeChange(list) {
      this.formData.receiversTypes = list;
    },
    // 接收人
    changeReceivers(list) {
      this.formData.receivers = [...list];
      this.receiversError = this.getReceivers.length === 0;
    },
    // 获取变量
    getVariables() {
      return this.formData.variables;
    },
    varsChange(info) {
      this.formData.sqlScript = info.sqlScript;
    },
    handleclick(e) {
      // 点击除编辑器以外的地方，默认将变量区的选择变量注入编辑器的功能关闭
      const { className } = e.target;
      if (typeof className === 'string') {
        if (
          className.indexOf('varibleItem') === -1 &&
          className.indexOf('CodeMirror-line') === -1 &&
          this.isOpenVar
        ) {
          this.isOpenVar = false;
          this.$bus.$emit('codemirrorVal_close');
        } else {
          this.isOpenVar = true;
        }
      }
    },

    async getDetail(id) {
      try {
        this.showLoading = true;
        const result = await getDetail({ id });
        // 根据接收人，获取接收人类型
        const { receiverTypes, messageTypes } = result;

        // 接收人类型转化
        let receiversTypesArry = [];
        if (receiverTypes) receiversTypesArry = receiverTypes.split(',');
        result.receiversTypes = receiversTypesArry.map((item) => Number(item));

        // 配置类型转化
        let supportTypesArry = [];
        if (messageTypes) supportTypesArry = messageTypes.split(',');
        result.supportTypes = supportTypesArry.map((item) => Number(item));
        this.initFormData(result);
        this.$refs.variable.int(); // 变量区初始化
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 点击确定按钮
    sureClick() {
      if (this.getReceivers.length === 0) {
        this.receiversError = true;
        this.showLoading = false;
        return;
      }

      this.$refs.temDetail.validate((valid) => {
        if (valid) {
          this.showLoading = true;
          // 验证通过，新增
          if (this.formData.id) this.tempEdit();
          else this.tempAdd();
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 处理参数
    handleParams(params) {
      const { messageTypes, contents } = params;
      // 站内信默认类型
      // 如果有站内信类型
      if (messageTypes.indexOf(2) !== -1) {
        const inner = contents.find((item) => item.messageType === 4) || {};
        const contentProps = JSON.parse(inner.contentProps);
        contentProps.innerMailCategory = 3;
        inner.contentProps = JSON.stringify(contentProps);
      }
    },
    async tempAdd() {
      try {
        this.showLoading = true;
        const { formData, configurationObj } = this;
        formData.receiverTypes = formData.receiversTypes.join(',');
        configurationObj.messageTypes = configurationObj.supportTypes.join(',');

        this.handleParams(configurationObj);
        await tempAdd({ ...formData, ...configurationObj });
        this.showLoading = false;
        this.$emit('addOrEditClick');
      } catch (error) {
        this.showLoading = false;
        let detailError = '';

        Object.keys(error).forEach((key) => {
          const formItem = this.formItems.find((item) => item.prop === key);
          detailError = `${this.$t(formItem.label)}${error[key]}`;
        });

        this.$message.error(detailError);
      }
    },
    async tempEdit() {
      try {
        this.showLoading = true;
        const { formData, configurationObj } = this;
        formData.receiverTypes = formData.receiversTypes.join(',');
        configurationObj.messageTypes = configurationObj.supportTypes.join(',');

        this.handleParams(configurationObj);
        await tempEdit({ ...formData, ...configurationObj });
        this.showLoading = false;
        this.$emit('addOrEditClick');
      } catch (error) {
        this.showLoading = false;
        let detailError = '';

        Object.keys(error).forEach((key) => {
          const formItem = this.formItems.find((item) => item.prop === key);
          detailError = `${this.$t(formItem.label)}${error[key]}`;
        });

        this.$message.error(detailError);
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.messageDetail {
  .isError {
    // border: 1px solid red;
    ::v-deep {
      .receiver__header {
        border: 1px solid red;
        box-sizing: border-box;
      }
    }
  }
  .detail {
    height: 100%;
    box-sizing: border-box;
    padding: 36px 36px 0;
    .temDetail {
      margin: 0;
      ::v-deep {
        .form--child {
          margin-bottom: 10px;
        }
      }
    }
  }
  .header__label {
    line-height: 1;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    padding-bottom: 6px;
    font-family: PingFangSC-Medium, PingFang SC;
    &.isRequired {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
  .icon-xinzeng {
    color: $--color-primary;
  }
  &__configure--receiver {
    & p {
      display: flex;
      justify-content: space-between;
    }
  }
  &__configure--bottom {
    margin-top: 10px;
    display: flex;
  }
  &__configure--configuration {
    flex: 1 1 0%;
    overflow: hidden;
  }
}
</style>
