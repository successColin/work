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
          <div class="messageDetail__set">
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
            <el-form-item
                :label="$t('messageTemplate.templateType')"
                class="form--child"
                prop="templateType"
            >
              <apiot-select
                  v-model="formData.templateType"
                  @change="changeShowConfig"
              >
                <el-option label="通用类型 " :value="1"></el-option>
                <el-option label="流程审批" :value="2"></el-option>
              </apiot-select>
            </el-form-item>
          </div>
        </div>
        <div class="form--line" v-if="isShowConfig">
          <el-form-item
              label="启用不重复发送"
              class="form--child"
              prop="enableRepeatCheck"
              ref="entity-form"
          >
            <apiot-switch
                v-model="formData.enableRepeatCheck"
                :activeValue="true"
                :inactivevalue="false"
            ></apiot-switch>
          </el-form-item>
          <el-form-item
              label="重复不发送时间间隔值"
              class="form--child third"
              prop="repeatDetectInterval"
              ref="entity-form"
              v-if="formData.enableRepeatCheck"
          >
            <span class="span-box" slot="label">
              <span style="white-space: nowrap"> 重复不发送时间间隔值 </span>
              <el-tooltip
                  :content="`${formData.repeatDetectInterval || '时间间隔'}
                  ${
                    formData.repeatDetectUnit
                      ? units[formData.repeatDetectUnit - 1].name
                      : ''
                  }内不重复发送消息`"
                  placement="top"
              >
                <i class="iconfont icon-bangzhu"/>
              </el-tooltip>
            </span>
            <apiot-input
                v-model="formData.repeatDetectInterval"
                placeholder="重复不发送时间间隔值"
            ></apiot-input>
          </el-form-item>
          <el-form-item
              label="重复不发送时间间隔单位"
              class="form--child third"
              prop="repeatDetectUnit"
              ref="entity-form"
              v-if="formData.enableRepeatCheck"
          >
            <el-select
                class="calendar__body--select"
                v-model="formData.repeatDetectUnit"
            >
              <el-option
                  v-for="item in units"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
              ></el-option>
              <!-- <el-option label="秒" :value="2"></el-option>
              <el-option label="分钟" :value="3"></el-option>
              <el-option label="小时" :value="4"></el-option>
              <el-option label="天" :value="5"></el-option>
              <el-option label="星期" :value="6"></el-option> -->
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <section class="messageDetail__configure">
        <article
            v-if="isShowConfig"
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
              :key="updateKey"
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
import { getDetail, tempAdd, tempEdit } from '@/api/messageTemplate';
import Configuration from '../Configuration';
import Receiver from '../Receiver';
import Variable from '../Variable';

const flowVarConfig = [
  {
    variableCode: 'flowCode',
    variableName: '流程编码',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'flowName',
    variableName: '流程名称',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'currentNodeName',
    variableName: '当前节点名称',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'triggerTime',
    variableName: '发起时间',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'triggerName',
    variableName: '发起人名称',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'receivers',
    variableName: '消息接收人',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'receiveType',
    variableName: '接收人类型',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'flowStatus',
    variableName: '流程状态',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'businessDesc',
    variableName: '业务摘要',
    variableType: 1,
    fixed: true
  },
  {
    variableCode: 'businessld',
    variableName: '业务数据ID',
    variableType: 1,
    fixed: true
  }
];
export default {
  components: {
    Variable,
    Receiver,
    Configuration
  },

  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    drawerTitle: {
      type: String,
      default: ''
    },
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
      isShowConfig: false,
      updateKey: 0,
      formData: {
        templateName: '',
        templateType: 1,
        variables: [],
        receivers: [],
        content: [],
        supportTypes: [2],
        receiversTypes: [], // 接收人类型
        enableRepeatCheck: false,
        repeatDetectUnit: '',
        repeatDetectInterval: ''
      },
      configurationObj: {
        contents: [],
        supportTypes: []
      },
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
      formItems: [{
        label: 'messageTemplate.templateName',
        prop: 'templateName'
      }],
      units: [
        {
          value: 1,
          name: '毫秒'
        },
        {
          value: 2,
          name: '秒'
        },
        {
          value: 3,
          name: '分'
        },
        {
          value: 4,
          name: '小时'
        },
        {
          value: 5,
          name: '天'
        },
        {
          value: 6,
          name: '星期'
        }
      ]
    };
  },

  computed: {
    // 接收人校验
    getReceivers() {
      const {
        receivers,
        receiversTypes
      } = this.formData;
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
    changeShowConfig(v, isFlag) { // 是否显示配置项
      if (v === 1) {
        this.isShowConfig = true;
        if (!isFlag) {
          this.formData.variables = [];
        }
      } else if (v === 2) {
        this.isShowConfig = false;
        if (!isFlag) {
          this.formData.variables = JSON.parse(JSON.stringify(flowVarConfig));
        }
      }
      this.updateKey += 1;
    },
    // 初始化
    initFormData(row) {
      this.showLoading = false;
      this.receiversError = false;
      const {
        contents = [],
        supportTypes = [4]
      } = row;
      this.configurationObj = {
        contents,
        supportTypes
      };
      this.formData = { ...this.formData, ...row };
      this.changeShowConfig(row.templateType || 1, true);
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
        this.formData = {
          templateName: '',
          variables: [],
          receivers: [],
          content: [],
          supportTypes: [2],
          receiversTypes: [], // 接收人类型
          enableRepeatCheck: false,
          repeatDetectUnit: '',
          repeatDetectInterval: '',
        };
        console.log(this.formData);
        const result = await getDetail({ id });
        // 根据接收人，获取接收人类型
        const {
          receiverTypes,
          messageTypes,
        } = result;
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
      if (this.getReceivers.length === 0 && this.formData.templateType === 1) {
        this.receiversError = true;
        this.showLoading = false;
        return;
      }

      this.$refs.temDetail.validate((valid) => {
        if (valid) {
          this.showLoading = true;
          // 验证通过，新增
          if (this.formData.id) {
            this.tempEdit();
          } else {
            this.tempAdd();
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 处理参数
    handleParams(params) {
      const {
        messageTypes,
        contents
      } = params;
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
        const {
          formData,
          configurationObj
        } = this;
        formData.receiverTypes = formData.receiversTypes.join(',');
        configurationObj.messageTypes = configurationObj.supportTypes.join(',');

        this.handleParams(configurationObj);
        await tempAdd({ ...formData, ...configurationObj });
        this.showLoading = false;
        this.$emit('addOrEditClick');
      } catch (error) {
        this.showLoading = false;
        let detailError = '';

        Object.keys(error)
          .forEach((key) => {
            const formItem = this.formItems.find((item) => item.prop === key);
            detailError = `${this.$t(formItem.label)}${error[key]}`;
          });

        this.$message.warning(detailError);
      }
    },
    async tempEdit() {
      try {
        this.showLoading = true;
        const {
          formData,
          configurationObj
        } = this;
        formData.receiverTypes = formData.receiversTypes.join(',');
        configurationObj.messageTypes = configurationObj.supportTypes.join(',');

        this.handleParams(configurationObj);
        await tempEdit({ ...formData, ...configurationObj });
        this.showLoading = false;
        this.$emit('addOrEditClick');
      } catch (error) {
        this.showLoading = false;
        let detailError = '';

        Object.keys(error)
          .forEach((key) => {
            const formItem = this.formItems.find((item) => item.prop === key);
            detailError = `${this.$t(formItem.label)}${error[key]}`;
          });

        this.$message.warning(detailError);
      }
    }
  },

  mounted() {
  }
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
  .messageDetail__set{
    display: flex;
    width: 100%;
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

        .third {
          margin-left: 30px;
        }

        .icon-bangzhu {
          cursor: pointer;
        }

        .icon-bangzhu:hover {
          color: #4689f5;
        }
      }
    }

    .form--row {
      width: 100%;
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
