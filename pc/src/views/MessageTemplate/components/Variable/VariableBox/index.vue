<!--
 * @Author: sss
 * @Date: 2021-07-23 10:35:52
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-23 10:35:52
 * @Desc: 变量选择
-->
<template>
  <section class="vriableBox">
    <el-popover
      class="vriableBox__select"
      popper-class="custom"
      width="196"
      placement="bottom-start"
      v-model="visible"
      @show="show"
    >
      <apiot-button slot="reference" size="mini">
        <i class="iconfont icon-jiahao"></i> {{ $t('user.doAdd') }}
      </apiot-button>
      <section class="vriableBox__select--items">
        <custom-variable
          :variables="variables"
          :isEdit="false"
          @selectVar="selectVar"
        ></custom-variable>
      </section>
    </el-popover>
    <el-tag
      v-for="tag in value"
      :class="[`item--theme__${tag.variableType}`]"
      :key="tag.variableCode"
      closable
      @close="deleteTag(tag)"
    >
      {{ tag.variableName }}
    </el-tag>
  </section>
</template>

<script>
import CustomVariable from '../CustomVariable';

export default {
  components: { CustomVariable },

  inject: ['getVariables'], // 获取变量

  props: {
    prop: Number,
    // 已经选中的变量
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      visible: false,
      variables: { inArry: [], viewArry: [], envArry: [] }
    };
  },

  computed: {},

  watch: {},

  methods: {
    show() {
      const variablesArry = this.getVariables();
      // 区分输入变量、展示变量、环境变量
      const inArry = [];
      const viewArry = [];
      const envArry = [];
      variablesArry.forEach((item) => {
        // 输入变量
        if (item.variableType === 1) inArry.push(item);
        // 展示变量
        else if (item.variableType === 2) viewArry.push(item);
        // 环境变量
        else envArry.push(item);
      });
      this.variables = { inArry, viewArry, envArry };
    },
    deleteTag(item) {
      const { value, prop } = this;
      const current = [...value];
      const index = current.findIndex((tag) => tag.variableCode === item.variableCode);
      current.splice(index, 1);
      this.$emit('input', current);
      this.$emit('changVars', { vars: current, prop });
    },
    selectVar(item) {
      const { value, prop } = this;
      const { variable } = item;
      const current = [...value];
      const index = current.findIndex((tag) => tag.variableCode === variable.variableCode);
      if (index === -1) {
        current.push(variable);
        this.$emit('input', current);
        this.$emit('changVars', { vars: current, prop });
      } else {
        this.$message({
          type: 'error',
          message: this.$t('messageTemplate.isExist', { any: variable.variableCode })
        });
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.vriableBox {
  .icon-jiahao {
    vertical-align: bottom;
    color: #aaaaaa;
  }

  &__select {
    &--items {
      overflow-y: auto;
      max-height: 400px;
    }
  }
  .item--theme__1 {
    background: #ffeaeb;
    color: #ee5e5e;
    i:first-child {
      color: #ee5e5e;
    }
    ::v-deep {
      .el-icon-close {
        color: #ee5e5e;
        &:hover {
          background: none;
        }
      }
    }
  }
  .item--theme__2 {
    background: #ebfcf7;
    color: #10b98a;
    i:first-child {
      color: #10b98a;
    }
    ::v-deep {
      .el-icon-close {
        color: #10b98a;
        &:hover {
          background: none;
        }
      }
    }
  }
  .item--theme__3 {
    background: #e5f0ff;
    color: #4689f5;
    i:first-child {
      color: #4689f5;
    }
    ::v-deep {
      .el-icon-close {
        color: #4689f5;
        &:hover {
          background: none;
        }
      }
    }
  }
  ::v-deep {
    .el-button--mini {
      padding: 0 8px;
      border: 1px dashed #e9e9e9;
      font-size: 13px;

      &:hover {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }

      &:focus {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }
    }

    .el-tag {
      margin-left: 4px;
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 30px;
      border: none;

      & > .icon-jiaose {
        margin-right: 2px;
        vertical-align: middle;
      }
    }
  }
}
</style>
