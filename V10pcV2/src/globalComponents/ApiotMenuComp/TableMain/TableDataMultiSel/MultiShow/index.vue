<template>
  <div class="multiShow">
    <span v-if="getCurrntMultiArr.length === 0" class="multiShow__place"
      >请选择数据</span
    >
    <span v-if="getCurrntMultiArr.length" class="multiShow__content tag">
      <span>{{ getCurrntMultiArr[0] }}</span>
      <i
        class="el-tag__close el-icon-close"
        @click="getCurrntMultiArr = getCurrntMultiArr[0]"
      ></i>
    </span>
    <span v-if="getCurrntMultiArr.length > 1" class="multiShow__num tag m-l-6"
      >+{{ getCurrntMultiArr.length - 1 }}</span
    >
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    form: {
      type: Object
    },
    configData: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    getCurrntMultiArr: {
      get() {
        const arr = this.form[`${this.configData.compId}_`]
          ? this.form[`${this.configData.compId}_`].split(',')
          : [];
        return arr;
      },
      set(value) {
        const valueArr = this.form[`${this.configData.compId}_`]
          ? this.form[this.configData.compId].split(',')
          : [];
        const tempArr = this.form[`${this.configData.compId}_`]
          ? this.form[`${this.configData.compId}_`].split(',')
          : [];
        const index = tempArr.findIndex((item) => item === value);
        tempArr.splice(index, 1);
        valueArr.splice(index, 1);
        this.form[`${this.configData.compId}_`] = tempArr.join(',');
        this.form[`${this.configData.compId}`] = valueArr.join(',');
      }
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.multiShow {
  display: flex;
  align-items: center;
  background-color: #fff !important;
  .tag {
    color: $--color-primary;
    background-color: $--hover-color;
    font-size: 13px;
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
  }
  &__place {
    padding-left: 10px;
    color: #aaaaaa;
  }
  &__content {
    padding-left: 6px;
    display: flex;
    align-items: center;
    .el-tag__close {
      margin-left: 4px;
      color: #fff;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      font-size: 10px;
      overflow: hidden;
      width: 13px;
      height: 13px;
      cursor: pointer;
      &::before {
        display: block;
        transform: translate(0.5px, 0.5px);
      }
      &:hover {
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
  &__num {
    padding: 0 2px;
  }
}
</style>
