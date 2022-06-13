<template>
  <section>
    <ActionTerm
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      v-model="termObj"
      :lambdaArr="lambdaArr"
      :triggerComp="triggerComp"
    ></ActionTerm>
    <section class="action__affect">
      <h1 class="action__affect--header">
        <apiot-button class="action__affect--addComp" @click="addAffectComp">
          <i class="iconfont icon-xinzeng m-r-4"></i>影响控件
        </apiot-button>
      </h1>
      <ul class="action__affect--table">
        <li class="action__affect--tableHead">
          <span class="action__affect--index"></span>
          <span class="action__affect--affectComp">影响控件</span>
          <span class="action__affect--type">类型</span>
          <span class="action__affect--content">内容</span>
        </li>
        <li
          class="action__affect--li"
          v-for="(item, index) in affectCompArr"
          :key="`${index}${item.comp ? item.comp.compId : ''}`"
        >
          <span class="action__affect--index">{{ index + 1 }}</span>
          <span class="action__affect--affectComp"
            ><comp-item
              :compObj="item.comp"
              :triggerCompMap="triggerCompMap"
              v-if="item.comp.compId"
              class="m-t-8"
            ></comp-item
          ></span>
          <span class="action__affect--type">
            <el-select
              v-model="item.affectType"
              @change="item.normalValue = ''"
            >
              <el-option label="显隐" :value="1"></el-option>
              <el-option
                v-show="
                  ![16].includes(triggerCompMap[item.comp.compId].compType)
                "
                :label="
                  [5].includes(triggerCompMap[item.comp.compId].compType)
                    ? '禁用'
                    : '只读'
                "
                :value="2"
              ></el-option>
              <el-option
                label="是否必填"
                :value="5"
                v-show="
                  ![5, 16].includes(triggerCompMap[item.comp.compId].compType)
                "
              ></el-option>
              <el-option
                label="固定值"
                :value="3"
                v-show="
                  ![5, 16].includes(triggerCompMap[item.comp.compId].compType)
                "
              ></el-option>
              <el-option
                label="公式"
                :value="4"
                v-show="
                  ![5, 16].includes(triggerCompMap[item.comp.compId].compType)
                "
              ></el-option>
            </el-select>
          </span>
          <span class="action__affect--content">
            <el-select v-model="item.canShow" v-show="item.affectType === 1">
              <el-option label="显示" :value="true"></el-option>
              <el-option label="隐藏" :value="false"></el-option>
            </el-select>
            <el-select
              v-model="item.canReadonly"
              v-show="item.affectType === 2"
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
            <el-select
              v-model="item.canRequired"
              v-show="item.affectType === 5"
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
            <el-date-picker
              v-show="item.affectType === 3"
              v-if="
                item.comp.compId &&
                triggerCompMap[item.comp.compId].compType == 8
              "
              type="date"
              :editable="false"
              value-format="yyyy-MM-dd"
              v-model="item.normalValue"
              placeholder="请选择日期"
            >
            </el-date-picker>
            <el-date-picker
              v-show="item.affectType === 3"
              v-else-if="
                item.comp.compId &&
                triggerCompMap[item.comp.compId].compType == 9
              "
              type="datetime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="item.normalValue"
              placeholder="请选择日期时间"
            >
            </el-date-picker>
            <apiot-input
              v-else
              v-model="item.normalValue"
              v-show="item.affectType === 3"
              placeholder="请输入固定值"
            ></apiot-input>
            <select-formula
              v-if="item.affectType === 4"
              :configData="configData"
              :triggerCompMap="triggerCompMap"
              :showType="[1, 2]"
              v-model="item.normalValue"
            ></select-formula>
            <i
              class="iconfont icon-shanchu"
              @click="deleteAffectComp(index)"
            ></i>
          </span>
        </li>
      </ul>
    </section>
    <transition name="slide-bottom">
      <comp-tree
        :visible.sync="showCompTree"
        v-if="showCompTree"
        :configData="configData"
        @getSelectComp="getSelectComp"
        :isNeedTriggerComp="false"
        :triggerComp="triggerComp"
        :isMulti="true"
      ></comp-tree>
    </transition>
  </section>
</template>

<script>
import termMixin from '../termMixin';
import CompTree from '../CompTree';
import ActionTerm from '../ActionTerm';
import SelectFormula from '../SelectFormula';

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
    // 影响数组
    affectingComponents: {
      type: String
    },
    // 当前触发控件
    triggerComp: {
      type: Object
    },
    // 触发事件
    triggerEvent: {
      type: Number
    }
  },
  data() {
    return {
      showCompTree: false,
      affectCompArr: []
    };
  },

  components: {
    CompTree,
    ActionTerm,
    SelectFormula
  },

  computed: {
    // 获取触发组件类型
    getCompType() {
      if (this.triggerComp.compId) {
        return this.triggerCompMap[this.triggerComp.compId].compType;
      }
      return '';
    }
  },

  created() {
    if (this.affectingComponents) {
      this.affectCompArr = JSON.parse(this.affectingComponents.replace(/\\/g, ''));
    }
  },

  methods: {
    // 添加影响控件
    addAffectComp() {
      if (!this.triggerComp.compId) {
        return this.$message({
          type: 'error',
          message: '请选择触发组件'
        });
      }
      // console.log(this.triggerEvent);
      if (this.triggerEvent === 1) {
        this.getSelectComp(this.triggerComp);
      } else {
        this.selectTriggerComp();
      }
    },
    // 选择组件
    selectTriggerComp() {
      this.showCompTree = true;
    },
    // 获取组件结果
    getSelectComp(compArr) {
      if (Array.isArray(compArr)) {
        compArr.forEach((comp) => {
          this.affectCompArr.push({
            comp: {
              compId: comp.compId,
              name: comp.name,
              compPath: comp.compPath
            },
            affectType: 1,
            canShow: true,
            canReadonly: false,
            canRequired: false,
            normalValue: ''
          });
        });
      } else {
        this.affectCompArr.push({
          comp: {
            compId: compArr.compId,
            name: compArr.name,
            compPath: compArr.compPath
          },
          affectType: 1,
          canShow: true,
          canReadonly: false,
          canRequired: false,
          normalValue: ''
        });
      }
    },
    // 删除影响控件
    deleteAffectComp(index) {
      console.log(this.affectCompArr, index);
      this.affectCompArr.splice(index, 1);
    }
  },

  watch: {
    affectCompArr: {
      handler(v) {
        this.$emit('update:affectingComponents', JSON.stringify(v));
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.action {
  .icon-xinzeng {
    color: $--color-primary;
  }
  .icon-shanchu {
    color: #bbc3cd;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
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

  &__affect {
    margin: 8px 0 0;
    ul {
      margin-top: 6px;
      li {
        height: 40px;
        line-height: 40px;
        display: flex;
      }
    }
    &--tableHead {
      background: #f6f7fb;
      box-shadow: 0px 1px 0px 0px #e9e9e9, 0px -1px 0px 0px #e9e9e9;
      .action__affect--affectComp,
      .action__affect--type {
        border-right: 1px solid #e9e9e9;
      }
    }
    &--index,
    &--affectComp,
    &--type,
    &--content {
      box-sizing: border-box;
      padding: 0 10px;
    }
    &--index {
      width: 40px;
      text-align: center;
    }
    &--affectComp {
      width: 200px;
    }
    &--type {
      width: 140px;
    }
    &--content {
      flex: 1;
      display: flex;
      .iconfont {
        width: 40px;
        text-align: center;
        margin-left: 80px;
        cursor: pointer;
      }
    }
    &--li {
      border-bottom: 1px solid #e9e9e9;
      .action__affect--index {
        border-right: 1px solid #e9e9e9;
      }
    }
  }
}
</style>
