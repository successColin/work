<template>
  <section>
    <ActionTerm
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      v-model="termObj"
      :lambdaArr="lambdaArr"
      :triggerComp="triggerComp"
    ></ActionTerm>
    <section class="action__api">
      <el-form label-position="top" label-width="80px" @submit.native.prevent>
        <el-form-item label="请求类型">
          <el-radio-group
            v-model="actionTriggerObj.requestMethod"
            @change="methodChange"
          >
            <el-radio label="GET">GET</el-radio>
            <el-radio label="POST">POST</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="URL">
          <el-input
            v-model="actionTriggerObj.requestUrl"
            plcaeholder="请输入请求地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Body"
          class="form--child"
          v-if="actionTriggerObj.requestMethod === 'POST'"
        >
          <apiot-button type="text" class="addBody" @click.stop="addComp"
            ><i class="iconfont icon-xinzeng m-r-4"></i
            ><span>添加控件</span></apiot-button
          >
          <json-editor
            v-if="showJson"
            v-model="actionTriggerObj.requestParameter"
            :requestLintRes.sync="actionTriggerObj.requestLintRes"
            :triggerCompMap="triggerCompMap"
            ref="jsonEditor"
          ></json-editor>
        </el-form-item>
        <el-form-item label="返回值设置">
          <apiot-button @click="setReturnValue"
            ><i class="iconfont icon-shezhi m-r-4"></i
            ><span>设置返回值</span></apiot-button
          >
        </el-form-item>
      </el-form>
    </section>
    <transition name="slide-bottom">
      <comp-tree
        :visible.sync="showCompTree"
        v-if="showCompTree"
        :configData="configData"
        @getSelectComp="getSelectComp"
        :triggerComp="triggerComp"
      ></comp-tree>
    </transition>
    <transition name="slide-bottom">
      <return-value
        :visible.sync="showReturnValue"
        v-if="showReturnValue"
        :triggerCompMap="triggerCompMap"
        :triggerComp="triggerComp"
        :configData="configData"
        v-model="actionTriggerObj.returnValue"
      ></return-value>
    </transition>
  </section>
</template>

<script>
import termMixin from '../termMixin';
import CompTree from '../CompTree';
import JsonEditor from '../JsonEditor';
import ReturnValue from '../ReturnValue';
import ActionTerm from '../ActionTerm';

export default {
  mixins: [termMixin],
  props: {
    //  配置，渲染树
    configData: {
      type: Array
    },
    // 所有组件
    triggerCompMap: {
      type: Object
    },
    // 条件
    effectiveConditions: {
      type: String
    },
    // item 所有数据，方便修改
    actionTriggerObj: {
      type: Object
    },
    // 当前触发控件
    triggerComp: {
      type: Object
    },
    // 触发事件
    triggerEvent: {
      type: Number
    },
    // 打开的窗口
    activeNames: {
      type: Array
    },
    // 当前pane的名称
    index: {
      type: Number
    }
  },
  data() {
    return {
      showCompTree: false,
      showReturnValue: false,
      showJson: false
    };
  },

  components: {
    CompTree,
    JsonEditor,
    ReturnValue,
    ActionTerm
  },

  computed: {},

  mounted() {
    if (this.activeNames.includes(this.index)) {
      this.showJson = true;
    }
  },

  methods: {
    methodChange() {
      // this.actionTriggerObj.requestParameter = '';
    },
    addComp() {
      this.showCompTree = true;
    },
    getSelectComp(comp) {
      // console.log(comp);
      this.$refs.jsonEditor.setValue(comp);
    },
    setReturnValue() {
      this.showReturnValue = true;
    }
  },

  watch: {
    activeNames(v) {
      if (v.includes(this.index)) {
        this.showJson = true;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.action {
  .icon-xinzeng {
    color: $--color-primary;
  }
  &__term {
    margin-top: 8px;
    &--header,
    &--liHeader {
      display: flex;
      height: 30px;
      line-height: 30px;
      font-weight: 600;
      color: #333333;
      font-size: 13px;
    }
    &--addAnd,
    &--addTerm {
      margin-left: auto;
    }
    &--ul {
      margin-top: 10px;
    }
    &--li {
      padding: 0 15px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      margin-bottom: 10px;
    }
    &--addTerm,
    &--deleteTerm {
      color: #333333;
      position: relative;
    }
    &--addTerm {
      margin-right: 10px;
      &:after {
        content: '';
        position: absolute;
        right: -14px;
        width: 1px;
        height: 12px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    &--liChildren {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .termComp {
        position: absolute;
        margin-left: 14px;
      }
      .icon-shanchu {
        width: 40px;
        text-align: right;
        cursor: pointer;
      }
    }
    &--liChild {
      margin-left: 10px;
      &:nth-child(1) {
        width: 200px;
      }
      &:nth-child(2) {
        width: 100px;
      }
      &:nth-child(3) {
        width: 100px;
      }
      &:nth-child(4) {
        margin-right: 0;
        flex: 1;
      }
    }
  }
  .addBody {
    position: absolute;
    right: 0;
    margin-top: -28px;
    span {
      color: #333333;
    }
  }
  .icon-shezhi {
    color: $--color-primary;
  }
  &__api {
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    padding: 16px 15px 0;
  }
}
</style>
