<!--
 * @Author: sss
 * @Date: 2021-07-20 09:06:58
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-20 09:06:58
 * @Desc: 变量列表
-->
<template>
  <section class="custom">
    <article class="inVariable">
      <el-tooltip
        v-for="(item, index) in variables.inArry"
        :key="`inVarable_${index}`"
        effect="dark"
        :content="item.variableCode"
        placement="right"
      >
        <p
          class="custom__varible"
          :class="{ isCurrent: current === `1_${index}` }"
        >
          <span
            :ref="`var_item_${item.variableType}_${index}`"
            class="custom__varible--item varibleItem"
            @click.stop="clickVar(item, index)"
          >
            <label class="varibleItem red__fontColor">{{
              item.variableName
            }}</label>
          </span>
          <template
              v-if="current === `1_${index}` && isEdit && !fixArr.includes(item.variableCode)">
            <i
              class="iconfont icon-bianji custom__varible--btn red__btn--hover"
              @click.stop="editVar(item, index)"
            ></i>
            <span class="sepLine"></span>
            <i
              class="iconfont icon-guanbi custom__varible--btn red__btn--hover"
              @click.stop="delVar(item, index)"
            ></i>
          </template>
        </p>
      </el-tooltip>
    </article>
    <article class="envVariable">
      <el-tooltip
        v-for="(item, index) in variables.envArry"
        :key="`envVarable_${index}`"
        effect="dark"
        :content="item.variableCode"
        placement="right"
      >
        <p
          class="custom__varible"
          :class="{ isCurrent: current === `3_${index}` }"
        >
          <span
            :ref="`var_item_${item.variableType}_${index}`"
            class="custom__varible--item varibleItem"
            @click.stop="clickVar(item, index)"
          >
            <label class="varibleItem blue__fontColor">{{
              item.variableName
            }}</label>
          </span>
          <i
            v-if="current === `3_${index}` && isEdit"
            class="iconfont icon-guanbi custom__varible--btn red__btn--hover"
            @click.stop="delVar(item, index)"
          ></i>
        </p>
      </el-tooltip>
    </article>
    <article class="viewVariable">
      <el-tooltip
        v-for="(item, index) in variables.viewArry"
        :key="`viewVarable_${index}`"
        effect="dark"
        :content="item.variableCode"
        placement="right"
      >
        <p
          class="custom__varible"
          :class="{ isCurrent: current === `2_${index}` }"
        >
          <span
            :ref="`var_item_${item.variableType}_${index}`"
            class="custom__varible--item varibleItem"
            @click.stop="clickVar(item, index)"
          >
            <label class="varibleItem cyan__fontColor">{{
              item.variableName
            }}</label>
          </span>
          <i
            v-if="current === `2_${index}` && isEdit"
            class="iconfont icon-bianji custom__varible--btn red__btn--hover"
            @click.stop="editVar(item, index)"
          ></i>
        </p>
      </el-tooltip>
    </article>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    variables: {
      type: Object,
      defalut() {
        return {};
      }
    }
  },

  data() {
    return {
      // 输入变量
      current: -1,
      isError: false,
      errorMsg: '',
      fixArr: ['flowCode', 'flowName', 'currentNodeName', 'triggerTime', 'triggerName', 'receivers', 'receiveType', 'flowStatus', 'businessDesc', 'businessld']
    };
  },

  computed: {},

  methods: {
    // 变量选择
    clickVar(variable, index) {
      if (this.isEdit) {
        this.$emit('handleClick', {
          variable,
          index
        });
      } else {
        this.$emit('selectVar', {
          variable,
          index
        });
      }

      this.current = `${variable.variableType}_${index}`;
    },
    // 编辑变量
    editVar(variable, index) {
      this.$emit('editVar', {
        variable,
        index
      });
    },
    // 删除变量
    delVar(variable, index) {
      this.$emit('delVar', {
        variable,
        index
      });
    }
  },

  mounted() {
    console.log('mounted');
  },

  directives: {}
};
</script>

<style lang='scss' scoped>
.custom {
  .is-error {
    position: relative;
    .error__tip {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1;
      padding-top: 4px;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 100;
    }
    ::v-deep {
      .el-input__inner {
        border-color: #f56c6c;
      }
    }
  }
  .isCurrent {
    background: #fafafa;
  }
  &__varible {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .blue {
      &__fontColor {
        background: #e5f0ff;
        color: #4689f5;
      }
      &__btn--hover {
        &:hover {
          color: #4689f5;
        }
      }
    }
    .cyan {
      &__fontColor {
        background: #ebfcf7;
        color: #10b98a;
      }
      &__btn--hover {
        &:hover {
          color: #10b98a;
        }
      }
    }
    .red {
      &__fontColor {
        background: #ffeaeb;
        color: #ee5e5e;
      }
      &__btn--hover {
        &:hover {
          color: #ee5e5e;
        }
      }
    }
    &:hover {
      background: #fafafa;
    }
    &--item {
      flex: 1;

      & label {
        margin: 6px 0 6px 9px;
        padding: 0 10px;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        background: #e5f0ff;
        border-radius: 4px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4689f5;
      }
      ::v-deep {
        .el-input__inner {
          height: 28px;
        }
      }
    }
    &--btn {
      flex-shrink: 0;
      width: 28px;
      color: #bbc3cd;
      text-align: center;
      font-size: 8px;
      &:hover {
        color: #4689f5;
      }
    }
    .sepLine {
      width: 1px;
      height: 8px;
      background: #e9e9e9;
    }
  }
}
</style>
