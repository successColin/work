<!--
 * @Descripttion: 编辑新增消息模板
 * @Author: ytx
 * @Date: 2021-08-10 08:48:45
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-10 08:48:45
-->
<template>
  <apiot-drawer
    class="taskDetail"
    v-on="$listeners"
    v-bind="$attrs"
    :loading.sync="showLoading"
    @sure-click="sureClick"
  >
    <el-form
      v-if="isShow"
      label-position="top"
      label-width="80px"
      class="form temDetail"
      ref="temDetail"
      :model="formData"
      :rules="rules"
    >
      <!-- 第一行：任务名称、类型 -->
      <div class="form--line">
        <el-form-item
          :label="$t('timedTask.missionName')"
          class="form--child"
          prop="jobName"
        >
          <apiot-input
            v-model="formData.jobName"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('timedTask.missionName'),
              })
            "
          ></apiot-input>
        </el-form-item>
        <el-form-item
          :label="$t('timedTask.type')"
          class="form--child"
          prop="jobType"
        >
          <el-select
            v-model="formData.jobType"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                any: $t('timedTask.type'),
              })
            "
            @change="handleChange"
          >
            <el-option
              v-for="item in taskTypeOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 第二行：周期、消息模板 -->
      <div class="form--line">
        <el-form-item
          :label="$t('timedTask.cycle')"
          class="form--child"
          prop="cronTime"
        >
          <select-cycle
            dialogTitle="选择周期"
            @selectRes="selectResCycle"
            :columnArr="cycleColumnArr"
            :paramsObj="cycleParamsObj"
            :optionArray="cycleOptions"
            :getListFun="cycleGetListFun"
            optionLabel="description"
            optionKey="expression"
            :showInfo="showInfoCycle"
          ></select-cycle>
        </el-form-item>
        <!-- 消息模板 -->
        <el-form-item
          :label="$t('timedTask.messageTemplate')"
          class="form--child"
          prop="templateId"
          v-if="formData.jobType === 1 || formData.jobType === ''"
        >
          <select-cycle
            dialogTitle="选择消息模板"
            @selectRes="selectResTemplate"
            :columnArr="templateColumnArr"
            :paramsObj="templateParamsObj"
            :optionArray="templateOptions"
            :getListFun="templateGetListFun"
            optionLabel="templateName"
            :showInfo="showInfoTemplate"
          ></select-cycle>
        </el-form-item>
        <!-- 还没有做 (外部接口) ？？？？？？？？？ -->
        <!-- 外部接口 -->
        <el-form-item
          :label="$t('timedTask.externalInterface')"
          class="form--child"
          prop="templateId"
          v-else-if="formData.jobType === 2"
        >
          <select-cycle
            dialogTitle="选择外部接口"
            @selectRes="selectResTemplate"
            :columnArr="templateColumnArr"
            :paramsObj="templateParamsObj"
            :optionArray="templateOptions"
            :getListFun="templateGetListFun"
            optionLabel="templateName"
          ></select-cycle>
        </el-form-item>
        <!-- 存储过程 -->
        <el-form-item
          :label="$t('timedTask.storedProcedure')"
          class="form--child"
          prop="proceduresId"
          v-else-if="formData.jobType === 3"
        >
          <select-cycle
            dialogTitle="选择存储过程"
            @selectRes="storedSelectRes"
            :columnArr="storedColumnArr"
            :optionArray="storedOptions"
            :getListFun="storedGetListFun"
            optionLabel="proceduresName"
            :showInfo="storedshowInfo"
            :hasPagination="false"
          ></select-cycle>
        </el-form-item>
        <!-- 内置接口 -->
        <el-form-item
          :label="$t('timedTask.builtInInterface')"
          class="form--child"
          prop="interfaceType"
          v-else-if="formData.jobType === 4"
        >
          <el-select
            v-model="formData.interfaceType"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                any: this.$t('timedTask.builtInInterface'),
              })
            "
          >
            <el-option
              v-for="item in JOB_IN_INTERFACE"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 第三行：消息渠道 -->
      <div class="form--line form__halfLine" v-if="formData.jobType === 1">
        <el-form-item
          :label="$t('timedTask.newsChannel')"
          class="form--child"
          prop="messageTypes"
        >
          <el-select
            v-model="formData.messageTypes"
            multiple
            :placeholder="
              $t('placeholder.pleaseSelect', {
                any: $t('timedTask.newsChannel'),
              })
            "
          >
            <el-option
              v-for="item in messageOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 第三行：参数设置 -->
      <div
        class="form--line taskDetail__paramsSet"
        v-if="formData.jobType === 3"
      >
        <el-form-item
          :label="$t('timedTask.parameterSettings')"
          class="form--child"
        >
          <apiot-table
            ref="paramsSet"
            :tableData="tableData"
            :dropColumnData="dropColumnData"
            :showSelection="false"
            :isNeedColumnDrop="false"
            :isAnimate="false"
            dropClass=".taskDetail__paramsSet"
          >
            <component
              v-for="(item, index) in dropColumnData"
              :is="item.compName"
              :key="`${item.prop}_${index}`"
              :prop="item.prop"
              :label="$t(item.label)"
              :width="item.width"
              :tableData="tableData"
            ></component>
          </apiot-table>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import { addList, updateEdit, getTemplateList } from '@/api/timedTask';
import { getExpressionList } from '@/api/importTemplate';
import { getList } from '@/api/expression'; // cron 表达式
import { getList as getListTemplate, getDetail } from '@/api/messageTemplate'; // 模板
import { listProcedures, listProceduresParameter } from '@/api/menuConfig'; // 获取存储过程
import SelectCycle from '../SelectCycle';
import {
  cycleColumnArr,
  cycleParamsObj,
  templateColumnArr,
  templateParamsObj,
  storedColumnArr
} from './index';

import ParamterColumn from './components/ParamterColumn';
import ValueColumn from './components/ValueColumn';

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    // 当前行数据
    currentObj: {
      type: Object,
      default: () => {}
    },
    // 是否新增
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  components: { SelectCycle, ParamterColumn, ValueColumn },

  data() {
    return {
      receiversError: false,
      isOpenVar: true, // 是否打开了变量区注入功能
      formData: {
        jobName: '', // 任务名称
        jobType: '', // 类型
        cronTime: '', // 周期
        templateId: '', // 消息模板ID
        proceduresId: '',
        messageTypes: [], // 消息渠道
        interfaceType: '' // 内置接口
      },
      // interfaceOption: [
      //   {
      //     id: 'DEVICE_RESOURCE_STATISTICS',
      //     name: '设备资源管理器定时统计'
      //   },
      //   {
      //     id: 'INSEPCTION_OVERDUE_TASKS_PROCESS',
      //     name: '巡检任务定时过期处理'
      //   }
      // ],
      configurationObj: { contents: [], supportTypes: [] },
      // 周期
      cycleColumnArr, // 列
      cycleParamsObj, // 参数
      cycleOptions: [], // 下拉框
      showInfoCycle: {}, // 周期返显
      // 消息模板
      templateColumnArr,
      templateParamsObj,
      templateOptions: [],
      showInfoTemplate: {}, // 模板返显
      // 存储过程
      storedColumnArr,
      storedOptions: [],
      storedshowInfo: {}, // 模板返显
      // 消息渠道
      messageOption: [],
      // 参数设置
      dropColumnData: [
        // 参数
        {
          label: 'timedTask.parameter',
          prop: 'parameterName',
          compName: 'ParamterColumn'
        },
        // 备注
        {
          label: 'timedTask.remark',
          prop: 'parameterRemarks',
          compName: 'ElTableColumn'
        },
        // 值
        {
          label: 'timedTask.value',
          prop: 'valueInfo',
          compName: 'ValueColumn'
        }
      ],
      tableData: [],
      showLoading: false
    };
  },

  watch: {
    // 赋值
    currentObj(v) {
      if (JSON.stringify(v) === '{}') {
        this.formData.jobName = '';
        this.formData.jobType = '';
        this.formData.cronTime = '';
        this.formData.templateId = '';
        this.formData.proceduresId = '';
        this.formData.proceduresName = '';
        this.formData.proceduresMethod = '';
        this.formData.messageTypes = [];
        this.formData.interfaceType = '';
        this.showInfoCycle = {};
        this.showInfoTemplate = {};
        this.storedshowInfo = {};
        this.tableData = [];
        return;
      }
      this.formData.jobName = v.jobName;
      this.formData.jobType = v.jobType;
      // 周期
      this.showInfoCycle = {
        expression: v.cronTime
      };
      this.formData.cronTime = v.cronTime;
      // 模板
      const templateValue = JSON.parse(v && v.typeProps);
      if (JSON.stringify(templateValue) !== '{}') {
        // 模板值
        this.showInfoTemplate = {
          id: templateValue.templateId
        };
        this.storedshowInfo = {
          id: templateValue.proceduresId
        };
        // 获取相关全渠道
        if (templateValue.templateId) {
          this.getChannel(templateValue.templateId);
        }
        this.tableData = templateValue.parameterList;
        this.formData.templateId = templateValue.templateId;
        this.formData.proceduresId = templateValue.proceduresId;
        this.formData.interfaceType = templateValue.interfaceType;
        this.$nextTick(() => {
          this.formData.messageTypes = templateValue.messageTypes || [];
        });
      }
    }
  },

  computed: {
    rules() {
      return {
        jobName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('timedTask.missionName')
            }),
            trigger: 'change'
          }
        ],
        jobType: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('timedTask.type')
            }),
            trigger: 'change'
          }
        ],
        cronTime: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('timedTask.cycle')
            }),
            trigger: 'change'
          }
        ],
        templateId: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('timedTask.messageTemplate')
            }),
            trigger: 'change'
          }
        ],
        proceduresId: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('timedTask.storedProcedure')
            }),
            trigger: 'change'
          }
        ],
        messageTypes: [{ required: true, validator: this.checkMessageType, trigger: 'change' }],
        interfaceType: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('timedTask.builtInInterface')
            }),
            trigger: 'change'
          }
        ]
      };
    },
    // 类型
    taskTypeOption() {
      return this.$store.state.dictManage.JOB_TYPE.map((item) => {
        const { value, zhCN } = item;
        return {
          id: value,
          name: zhCN
        };
      });
    },
    MESSAGE_TYPE() {
      return this.$store.state.dictManage.MESSAGE_TYPE;
    },
    JOB_IN_INTERFACE() {
      const arr = this.$store.state.dictManage.JOB_IN_INTERFACE || [];
      arr.forEach((item) => {
        item.id = item.value;
      });
      return arr;
    }
  },

  methods: {
    checkMessageType(rule, value, callback) {
      console.log(rule, value, callback);
      if (value && value.length === 0) {
        return callback(
          new Error(
            this.$t('placeholder.pleaseSelect', {
              any: this.$t('timedTask.newsChannel')
            })
          )
        );
      }
      callback();
    },
    async getChannel(id) {
      const res = await getDetail({
        id
      });
      const arr = res.messageTypes.split(',');
      this.channelOptionFun(arr);
    },
    // 类型变化
    handleChange() {
      this.formData.messageTypes = [];
      this.formData.templateId = '';
      this.formData.proceduresId = '';
      this.showInfoTemplate = {};
      this.storedshowInfo = {};
      this.tableData = [];
      this.$nextTick(() => {
        this.$refs.temDetail.clearValidate();
      });
    },
    // 选择周期
    selectResCycle(v) {
      this.formData.cronTime = v.expression;
    },
    selectResTemplate(v) {
      // 消息模板的id
      this.formData.templateId = v.id;
      this.formData.messageTypes = [];
      // 消息渠道
      const { messageTypes } = v;
      if (messageTypes) {
        const arr = messageTypes.split(',');
        this.channelOptionFun(arr);
      }
    },
    // 选择存储过程
    async storedSelectRes(v) {
      console.log(v);
      const { id, proceduresName, proceduresMethod } = v;
      this.formData.proceduresId = id;
      this.formData.proceduresName = proceduresName;
      this.formData.proceduresMethod = proceduresMethod;
      const res = await listProceduresParameter({
        proId: id
      });
      this.tableData = res;
    },
    // 渠道类型
    channelOptionFun(arr = []) {
      const catchArr = [];
      arr.forEach((item) => {
        this.MESSAGE_TYPE.forEach((val) => {
          if (Number(item) === val.value) {
            catchArr.push({
              id: val.value,
              name: val.zhCN
            });
          }
        });
      });
      this.messageOption = catchArr;
    },
    // 点击确定按钮
    sureClick() {
      this.$refs.temDetail.validate(async (valid) => {
        if (valid) {
          const {
            jobName,
            jobType,
            cronTime,
            templateId,
            messageTypes,
            proceduresId,
            proceduresName,
            proceduresMethod,
            interfaceType
          } = this.formData;
          const params = {
            jobName,
            jobType,
            cronTime
          };
          if (this.formData.jobType === 3) {
            params.typeProps = JSON.stringify({
              proceduresId,
              proceduresName,
              proceduresMethod,
              parameterList: this.tableData
            });
          } else if (this.formData.jobType === 4) {
            params.typeProps = JSON.stringify({
              interfaceType
            });
          } else {
            params.typeProps = JSON.stringify({
              templateId,
              messageTypes
            });
          }
          let messageName = '';
          try {
            if (this.isAdd) {
              await addList(params);
              messageName = this.$t('common.newSuccess');
            } else {
              params.id = this.currentObj.id;
              await updateEdit(params);
              messageName = this.$t('common.successfullyModified');
            }
            this.$message({
              type: 'success',
              message: messageName
            });
            this.showLoading = false;
            this.$emit('update:visible', false);
            this.$emit('getList');
          } catch (error) {
            this.showLoading = false;
          }
        } else {
          this.showLoading = false;
        }
      });
    },
    // 初始化
    async init() {
      // 获取 cron 表达式 => 周期
      this.cycleOptions = await getExpressionList({ expressionType: 'CORN' });
      this.templateOptions = await getTemplateList();
      this.storedOptions = await listProcedures();
      console.log(this.templateOptions, this.storedOptions);
    },
    // 周期弹出框值
    async cycleGetListFun(params) {
      const popupsList = await getList(params);
      return popupsList;
    },
    // 模板弹出框值
    async templateGetListFun(params) {
      const popupsList = await getListTemplate(params);
      return popupsList;
    },
    // 存储过程弹出框值
    async storedGetListFun(params) {
      const popupsList = await listProcedures(params);
      console.log(popupsList);
      return popupsList;
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style lang='scss' scoped>
.taskDetail {
  ::v-deep {
    .form--child {
      margin-bottom: 17px;
    }
  }
}
</style>
