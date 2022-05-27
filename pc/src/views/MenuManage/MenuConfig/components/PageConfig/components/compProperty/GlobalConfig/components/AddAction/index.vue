<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :title="getTitle"
    @sure-click="sureClick"
    :loading.sync="showLoading"
    class="action"
  >
    <el-form label-position="top" label-width="80px" class="form" ref="action">
      <div class="form--line">
        <el-form-item label="触发控件" class="form--child">
          <select-comp
            :configData="configData"
            :curTriggerComp="triggerComp"
            :triggerCompMap="triggerCompMap"
            :disabled="this.actionList.length !== 0"
          ></select-comp>
        </el-form-item>
        <el-form-item label="触发事件" class="form--child">
          <el-select
            v-model="triggerEvent"
            @change="triggerTypeChange"
            :disabled="this.actionList.length !== 0"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="item in getTriggerEvent"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form--line" style="width: calc(50% - 15px)">
        <el-form-item label="优先级" class="form--child">
          <el-select v-model="priority">
            <el-option label="100" :value="100"></el-option>
            <el-option label="90" :value="90"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="action__list">
      <p class="action__title m-b-10">
        <span>触发执行动作</span>
        <el-dropdown class="action__title--btn" @command="handleCommand">
          <apiot-button>
            <i class="iconfont icon-xinzeng m-r-4"></i>
            添加执行动作
          </apiot-button>
          <el-dropdown-menu slot="dropdown" class="action__type">
            <el-dropdown-item disabled>动作类型</el-dropdown-item>
            <el-dropdown-item
              :command="key"
              v-for="(value, key) in getActiveObj"
              :key="key"
              ><img :src="require(`./images/${key}.svg`)" alt="" />{{
                value.name
              }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </p>
      <el-collapse
        class="action__collapse"
        v-model="activeNames"
        v-if="showAddAction"
      >
        <el-collapse-item
          :index="index + 1"
          v-for="(item, index) in actionList"
          :key="index"
          :name="index"
        >
          <template slot="title">
            <img
              class="m-l-14 m-r-8"
              :src="require(`./images/${item.triggerType}.svg`)"
              alt=""
            />{{ actionObj[item.triggerType].name
            }}<i class="iconfont icon-shanchu" @click="deleteAction(index)"></i>
          </template>
          <component
            :is="actionObj[item.triggerType].compName"
            :showAddAction="showAddAction"
            :actionTriggerObj="item"
            :effectiveConditions.sync="item.effectiveConditions"
            :affectingComponents.sync="item.affectingComponents"
            :configData="configData"
            :triggerComp="triggerComp"
            :triggerEvent="triggerEvent"
            :triggerCompMap="triggerCompMap"
            :removeBackendIds="removeBackendIds"
            :activeNames="activeNames"
            :index="index"
          ></component>
        </el-collapse-item>
      </el-collapse>
    </div>
  </apiot-drawer>
</template>

<script>
import {
  saveDesignTriggers,
  getDesignTriggersLinkDiagram,
  getDesignTriggers
} from '@/api/menuConfig';
import { createUnique, getChartsByEx } from '@/utils/utils';
import SelectComp from './components/SelectComp';
import AffectComp from './components/AffectComp';
import OtherApi from './components/OtherApi';
import EndData from './components/EndData';
import StoreProcess from './components/StoreProcess';

export default {
  props: {
    // 页面隐藏显示
    showAddAction: {
      type: Boolean
    },
    configData: {
      type: Array
    },
    currentType: {
      type: Number,
      default: 1
    },
    triggerCompMap: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    }
  },
  data() {
    return {
      showLoading: false,
      showCompTree: false,
      // 触发组件
      triggerComp: {
        compId: '',
        name: '',
        compPath: ''
      },
      triggerEvent: 1, // 触发类型
      priority: 100,
      editId: '', // 编辑的id
      actionObj: {
        1: {
          name: '影响控件属性',
          type: 1,
          compName: 'AffectComp'
        },
        2: {
          name: '调用外部接口',
          type: 2,
          compName: 'OtherApi'
        },
        3: {
          name: '影响后台数据',
          type: 3,
          compName: 'EndData'
        },
        4: {
          name: '调用存储过程',
          type: 4,
          compName: 'StoreProcess'
        }
      },
      actionList: [],
      activeNames: [],
      linkCode: '', // 同一链路的编码
      removeBackendIds: [], // 删除后端触发器
      removeTriggerIds: [] // 删除触发器
    };
  },

  components: {
    SelectComp,
    AffectComp,
    OtherApi,
    EndData,
    StoreProcess
  },

  computed: {
    getTitle() {
      return this.currentType === 1 ? '新增动作' : '修改动作';
    },
    // 获取触发事件列表
    getTriggerEvent() {
      if (this.getCompType === 16) {
        return [this.$store.state.dictManage.TRIGGER_EVENT.find((item) => item.value === 1)];
      }
      if (this.getCompType === 5) {
        return this.$store.state.dictManage.TRIGGER_EVENT.filter((item) => item.value !== 2);
      }
      return this.$store.state.dictManage.TRIGGER_EVENT.filter((item) => item.value !== 3);
    },
    // 获取触发组件类型
    getCompType() {
      if (this.triggerComp.compId) {
        return this.triggerCompMap[this.triggerComp.compId].compType;
      }
      return '';
    },
    // 获取动作类型列表
    getActiveObj() {
      if (this.getCompType !== 5) {
        return {
          1: this.actionObj[1],
          2: this.actionObj[2]
        };
      }
      return this.actionObj;
    }
  },

  watch: {
    getTriggerEvent(v) {
      const index = v.findIndex((trigger) => trigger.value === this.triggerEvent);
      if (index === -1) {
        this.triggerEvent = v[0].value;
      }
    },
    showAddAction(v) {
      if (!v) {
        this.actionList = [];
      }
    }
  },

  mounted() {},

  inject: ['isPanel', 'sysMenuDesignId'],

  methods: {
    // 初始化新增
    init(data) {
      this.removeBackendIds = [];
      this.removeTriggerIds = [];
      if (this.currentType === 1) {
        this.triggerComp = {
          compId: '',
          name: '',
          compPath: ''
        };
        this.triggerEvent = 1;
        this.priority = 100;
        this.linkCode = createUnique();
        this.actionList = [];
      } else {
        // console.log(data);
        this.linkCode = data.linkCode;
        this.getDesignTriggers();
        // this.triggerComp.compId = data.comp.triggerCompId;
        // this.triggerComp.name = data.comp.compName || ' ';
        // this.triggerComp.compPath = data.comp.triggerCompPath;
        // this.triggerEvent = data.triggerEvent;
        // this.termObj = data.effectiveConditions;
        // this.affectCompArr = data.affectingComponents;
        // this.priority = data.triggerPriority;
        // this.editId = data.id;
      }
    },
    // 触发事件改变
    triggerTypeChange() {
      // console.log('全清');
    },
    pushCompArr(arr, str) {
      // console.log(str);
      const marTextArry = getChartsByEx(str.replace(/\\/g, ''), '\\"\\$\\[([A-Za-z0-9]{6})\\]\\"');
      marTextArry.forEach((text) => {
        const compId = text.result[1];
        arr.push({
          compId,
          compType: 3,
          linkCode: this.linkCode,
          triggerCompPath: this.triggerCompMap[compId].compPath,
          triggerEvent: this.triggerEvent,
          triggerType: 2
        });
      });
    },
    // 确认结果
    sureClick() {
      this.showLoading = false;
      if (!this.triggerComp.compId) {
        return this.$message({
          type: 'error',
          message: '请选择触发组件'
        });
      }
      if (!this.actionList.length) {
        return this.$message({
          type: 'error',
          message: '请新增动作'
        });
      }
      // console.log(this.actionList);
      let errorMsg = '';
      const triggersCompList = [];
      triggersCompList.push({
        compId: this.triggerComp.compId,
        compType: 1,
        linkCode: this.linkCode,
        triggerCompPath: this.triggerComp.compPath,
        triggerEvent: this.triggerEvent,
        triggerType: ''
      });
      const index = this.actionList.findIndex((action) => {
        action.linkCode = this.linkCode;
        action.triggerCompId = this.triggerComp.compId;
        action.triggerCompPath = this.triggerComp.compPath;
        action.triggerEvent = this.triggerEvent;
        action.triggerPriority = this.priority;
        action.sysMenuDesignId = this.isPanel ? this.sysMenuDesignId : this.$route.query.id;
        // 条件里面组件 公式先不管
        if (action.effectiveConditions) {
          const term = JSON.parse(action.effectiveConditions.replace(/\\/g, ''));
          // console.log(term);
          term.termArr.forEach((item) => {
            item.forEach((v) => {
              // console.log(v);
              triggersCompList.push({
                compId: v.comp.compId,
                compType: 3,
                linkCode: this.linkCode,
                triggerCompPath: v.comp.compPath,
                triggerEvent: this.triggerEvent,
                triggerType: +action.triggerType
              });
            });
          });
        }
        if (+action.triggerType === 1) {
          if (!action.affectingComponents) {
            errorMsg = '请添加影响控件';
            return true;
          }
          const affectComp = JSON.parse(action.affectingComponents.replace(/\\/g, ''));
          affectComp.forEach((v) => {
            triggersCompList.push({
              compId: v.comp.compId,
              compType: 2,
              linkCode: this.linkCode,
              triggerCompPath: v.comp.compPath,
              triggerEvent: this.triggerEvent,
              triggerType: +action.triggerType
            });
          });
        } else if (+action.triggerType === 2) {
          if (!action.requestUrl) {
            errorMsg = '请输入请求地址';
            return true;
          }
          if (action.requestMethod === 'POST' && !action.requestLintRes) {
            errorMsg = 'post请求，json校验失败';
            return true;
          }
          if (action.requestMethod === 'POST') {
            this.pushCompArr(triggersCompList, action.requestParameter);
          }
          if (action.returnValue) {
            const returnValue = JSON.parse(action.returnValue.replace(/\\/g, ''));
            returnValue.forEach((v) => {
              triggersCompList.push({
                compId: v.comp.compId,
                compType: 3,
                linkCode: this.linkCode,
                triggerCompPath: v.comp.compPath,
                triggerEvent: this.triggerEvent,
                triggerType: +action.triggerType
              });
            });
          }
        } else if (+action.triggerType === 3) {
          // backendList
          if (action.backendList.length === 0) {
            errorMsg = '请添加影响后台数据';
            return true;
          }
        } else if (+action.triggerType === 4) {
          //
          if (action.sysProceduresId === 0) {
            errorMsg = '请选择储存过程';
            return true;
          }
          if (action.returnValue) {
            const returnValue = JSON.parse(action.returnValue.replace(/\\/g, ''));
            returnValue.forEach((v) => {
              triggersCompList.push({
                compId: v.comp.compId,
                compType: 3,
                linkCode: this.linkCode,
                triggerCompPath: v.comp.compPath,
                triggerEvent: this.triggerEvent,
                triggerType: +action.triggerType
              });
            });
          }
        }
        return false;
      });
      // console.log(index);
      if (index !== -1) {
        return this.$message({
          type: 'error',
          message: `第${index + 1}步动作（${
            this.actionObj[this.actionList[index].triggerType].name
          }），${errorMsg}`
        });
      }
      this.saveDesignTriggers(triggersCompList);
    },
    //
    async getDesignTriggers() {
      const data = await getDesignTriggers({
        linkCode: this.linkCode,
        sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id
      });
      // console.log(data);
      this.triggerComp.compId = data[0].triggerCompId;
      this.triggerComp.compPath = data[0].triggerCompPath;
      this.triggerEvent = data[0].triggerEvent;
      console.log(data, this.triggerEvent);
      this.priority = data[0].triggerPriority;
      // data.forEach((item) => {
      //   if (!item.termObj) {
      //     item.termObj = {
      //       termType: 1, // 1 代表外层and 内层 or
      //       termArr: [] // 条件数组
      //     };
      //   }
      // });
      this.actionList = data;
      console.log(data);
    },
    // 新增触发器
    async saveDesignTriggers(triggersCompList) {
      this.showLoading = true;
      try {
        await saveDesignTriggers({
          triggersList: this.actionList,
          triggersCompList,
          removeBackendIds: this.removeBackendIds.join(),
          removeTriggerIds: this.removeTriggerIds.join(),
          sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id
        });
        this.showLoading = false;
        this.$emit('listDesignTriggers');
        this.$emit('update:visible', false);
        this.getDesignTriggersLinkDiagram();
        this.$message({
          type: 'success',
          message: '新增动作成功'
        });
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 新增后改变配置触发器的组件
    // 配置触发器的组件
    async getDesignTriggersLinkDiagram() {
      const data = await getDesignTriggersLinkDiagram({
        sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id,
        triggerEvent: ''
      });
      const obj = {};
      data.compList.forEach((item) => {
        if (!obj[item.compId]) {
          obj[item.compId] = {
            msg: '该组件存在触发器配置，请先删除或更改该触发器',
            ...item
          };
        }
      });

      this.$bus.$emit('changeHasTriggerComp', obj);
    },

    handleCommand(type) {
      // console.log(type);
      if (!this.triggerComp.compId) {
        return this.$message({
          type: 'error',
          message: '请选择触发组件'
        });
      }
      this.actionList.push({
        triggerType: type,
        // 条件4个类型都有
        // termObj: {
        //   termType: 1, // 1 代表外层and 内层 or
        //   termArr: [] // 条件数组
        // },
        effectiveConditions: '',
        // 触发控件
        affectingComponents: '', // 影响控件的数组
        // 调用外部接口
        requestMethod: 'GET', // 请求方法
        requestUrl: '', // 请求地址
        requestParameter: '{}', // 请求参数
        requestLintRes: true, // 校验post 的时候json是否符合规则
        returnValue: '',
        // 后端触发器
        backendList: [], // 列表,
        // 存储过程
        sysProceduresId: 0, // 存储过程id
        proceduresList: [] // 存储过程参数设置
      });
      this.activeNames = [this.actionList.length - 1];
    },
    // 删除动作
    deleteAction(index) {
      // console.log(this.actionList);
      if (this.actionList[index].id) {
        this.removeTriggerIds.push(this.actionList[index].id);
      }
      this.actionList.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.action {
  &__list {
    margin: 0 36px;
  }
  &__title {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    &--btn {
      margin-left: auto;
      font-weight: normal;
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
  }
  &__collapse {
    border: 0;
    ::v-deep {
      .el-collapse-item {
        margin-left: 32px;
        position: relative;
        padding-bottom: 10px;
        &:after {
          content: attr(index);
          position: absolute;
          left: -32px;
          top: 6px;
          width: 26px;
          height: 26px;
          line-height: 18px;
          border-radius: 50%;
          text-align: center;
          background-color: $--color-primary;
          background-clip: content-box;
          box-sizing: border-box;
          padding: 2px;
          border: 2px solid $--color-primary;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #ffffff;
        }
        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: -20px;
          border-left: 1px dashed #d9d9d9;
        }
        &__header {
          height: 40px;
          box-sizing: border-box;
          background: #f1f7ff;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
        }
      }
      .el-collapse-item__arrow {
        color: #bbc3cd;
        margin-left: 14px;
      }
    }
    .icon-shanchu {
      margin-left: auto;
      position: relative;
      color: #bbc3cd;
      &:after {
        content: '';
        position: absolute;
        top: 18px;
        right: -8px;
        width: 1px;
        height: 12px;
        background-color: rgba(0, 0, 0, 0.1);
      }
      &:hover {
        color: $--color-primary;
      }
    }
  }
}
</style>
<style lang='scss'>
.action__type {
  .el-dropdown-menu__item {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
    &.is-disabled {
      font-family: PingFangSC-Medium, PingFang SC;
    }
    img {
      margin-right: 8px;
    }
  }
}
</style>
