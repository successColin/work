<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="rule"
    title="Tabs隐藏条件"
    :isShowSure="false"
    cancelBtnName="确认"
  >
    <apiot-button type="primary" class="rule__addBtn" @click="addRule">
      <i class="iconfont icon-xinzeng m-r-4"></i>
      添加隐藏条件
    </apiot-button>
    <section class="rule__list">
      <div class="rule__head rule__item">
        <span class="rule__item--index"></span>
        <span class="rule__item--move"></span>
        <span class="rule__item--ruleContent">条件</span>
        <span class="rule__item--tip">隐藏tabs</span>
        <span class="rule__item--delete"></span>
      </div>
      <div class="rule__body">
        <div class="rule__scroll">
          <draggable
            v-model="activeObj.hiddenRules"
            group="rule"
            animation="300"
            handle=".icon-zongxiangtuodong"
          >
            <div
              class="rule__item"
              v-for="(item, index) in activeObj.hiddenRules"
              :key="item.id"
            >
              <span class="rule__item--index">{{ index + 1 }}</span>
              <span class="rule__item--move">
                <i class="iconfont icon-zongxiangtuodong"></i>
              </span>
              <span class="rule__item--ruleContent">
                <select-formula
                  :configData="configData"
                  class="action__term--formula"
                  :triggerCompMap="triggerCompMap"
                  v-model="item.content"
                ></select-formula
              ></span>
              <span class="rule__item--tip">
                <el-select
                  v-model="item.tabs"
                  multiple
                  collapse-tags
                  class="contentConfig__select"
                >
                  <el-option
                    :label="item.name"
                    :value="item.compId"
                    v-for="item in getTabs"
                    :key="item.compId"
                  ></el-option> </el-select
              ></span>
              <span class="rule__item--delete" @click="deleteRule(index)">
                <i class="iconfont icon-shanchu"></i>
              </span></div
          ></draggable>
        </div>
      </div>
    </section>
  </apiot-dialog>
</template>

<script>
import { createUnique } from '@/utils/utils';
import SelectFormula from '../../GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  props: {
    activeObj: {
      type: Object
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    showRuleDialog: {
      type: Boolean
    }
  },
  data() {
    return {};
  },

  components: {
    SelectFormula
  },

  computed: {
    getTabs() {
      return this.activeObj.children;
    }
  },

  mounted() {},

  methods: {
    addRule() {
      if (!this.activeObj.hiddenRules) {
        this.$set(this.activeObj, 'hiddenRules', []);
      }
      this.activeObj.hiddenRules.push({
        content: '',
        tabs: [],
        id: `formula_${createUnique()}`
      });
    },
    async deleteRule(index) {
      try {
        await this.$confirm('将删除规则，是否继续', {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        });
        this.activeObj.hiddenRules.splice(index, 1);
      } catch (error) {
        // console.log(error);
      }
    }
  },

  watch: {
    showRuleDialog(v) {
      if (!v && this.activeObj.hiddenRules) {
        const { length } = this.activeObj.hiddenRules;
        for (let i = length - 1; i >= 0; i -= 1) {
          if (
            !this.activeObj.hiddenRules[i].content ||
            this.activeObj.hiddenRules[i].tabs.length === 0
          ) {
            this.activeObj.hiddenRules.splice(i, 1);
          }
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.rule {
  &__addBtn {
    width: 120px;
    margin-bottom: 6px;
  }
  &__list {
    flex: 1;
  }
  &__item {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    &--index {
      text-align: center;
      width: 40px;
    }
    &--move {
      text-align: center;
      width: 40px;
      cursor: move;
    }
    &--ruleContent {
      padding-left: 10px;
      flex: 1;
    }
    &--tip {
      padding-left: 10px;
      width: 240px;
    }
    &--delete {
      text-align: center;
      width: 50px;
      cursor: pointer;
    }
    &--move,
    &--delete {
      &:hover {
        .iconfont {
          color: $--color-primary;
        }
      }
    }
  }
  &__head {
    background: #f6f7fb;
    box-shadow: 0px 1px 0px 0px #e9e9e9, 0px -1px 0px 0px #e9e9e9;
    .rule__item--ruleContent {
      border-right: 1px solid #e9e9e9;
    }
  }
  &__body {
    position: relative;
    height: calc(100% - 40px);
    .rule__item {
      width: 600px;
      border-bottom: 1px solid #e9e9e9;
      &:hover {
        background-color: #f1f7ff;
      }
      &--index,
      &--move {
        border-right: 1px solid #e9e9e9;
      }
    }
  }
  &__scroll {
    position: absolute;
    top: 0;
    left: 0;
    right: -30px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
