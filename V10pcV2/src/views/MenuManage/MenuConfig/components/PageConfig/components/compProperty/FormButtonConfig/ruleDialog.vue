<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="rule"
    title="提交前校验"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <apiot-button type="primary" class="rule__addBtn" @click="addRule">
      <i class="iconfont icon-xinzeng m-r-4"></i>
      添加规则
    </apiot-button>
    <section class="rule__list">
      <div class="rule__head rule__item">
        <span class="rule__item--index"></span>
        <span class="rule__item--move"></span>
        <span class="rule__item--ruleContent">规则</span>
        <span class="rule__item--tip">不合规提示</span>
        <span class="rule__item--delete"></span>
      </div>
      <div class="rule__body">
        <div class="rule__scroll">
          <draggable
            v-model="activeObj.ruleArr"
            group="rule"
            animation="300"
            handle=".icon-zongxiangtuodong"
          >
            <div
              class="rule__item"
              v-for="(item, index) in activeObj.ruleArr"
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
              <span class="rule__item--tip"
                ><apiot-input v-model="item.ruleTip"></apiot-input
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
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  props: {
    activeObj: {
      type: Object,
    },
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
    showRuleDialog: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },

  components: {
    SelectFormula,
  },

  computed: {},

  mounted() {},

  methods: {
    addRule() {
      this.activeObj.ruleArr.push({
        content: '',
        ruleTip: '',
        id: `formula_${createUnique()}`,
      });
    },
    async deleteRule(index) {
      try {
        await this.$confirm('将删除规则，是否继续', {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning',
        });
        this.activeObj.ruleArr.splice(index, 1);
      } catch (error) {
        // console.log(error);
      }
    },
  },

  watch: {
    showRuleDialog(v) {
      console.log(v);
      if (!v) {
        const { length } = this.activeObj.ruleArr;
        for (let i = length - 1; i >= 0; i -= 1) {
          if (!this.activeObj.ruleArr[i].content) {
            this.activeObj.ruleArr.splice(i, 1);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rule {
  &__addBtn {
    width: 94px;
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
      color: #bbc3cd;
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
