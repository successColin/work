<template>
  <section class="checkType">
    <header>
      <div>
        <el-checkbox v-model="checked" v-if="isCheckbox">
          <span class="checkType__title">
            <span class="checkType__isRequired">{{
              isRequired ? '*' : ''
            }}</span>
            {{ title }}
          </span>
        </el-checkbox>
        <span class="checkType__title" v-else>
          <span class="checkType__isRequired">{{ isRequired ? '*' : '' }}</span>
          {{ title }}
        </span>
      </div>

      <el-tooltip :content="$t('common.delete1')" placement="top">
        <i
          class="iconfont icon-shanchu"
          v-if="isDelete"
          @click="handleClick"
          style="color: #aaaaaa"
        ></i>
      </el-tooltip>
    </header>
    <div class="checkType__container">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    isCheckbox: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: false
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleClick() {
      this.$emit('handleDelete');
    }
  }
};
</script>
<style lang='scss' scoped>
.checkType {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #e9e9e9;
  header {
    height: 40px;
    padding: 0 20px;
    background: #fafafa;
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .checkType__title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    .icon-shanchu {
      cursor: pointer;
    }
    ::deep {
      .el-checkbox__label {
        padding-left: 5px;
      }
    }
  }
  &__container {
    display: flex;
    padding: 10px 20px;
  }
  &__isRequired {
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
