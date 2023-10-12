<template>
  <div class="selectBox" v-if="showCheckbox || showSinglebox">
    <el-checkbox
      :value="getChecked"
      @click.native.stop
      @input="changeCheck"
      v-if="showCheckbox"
    ></el-checkbox>
    <el-radio
      :value="multiEntityArr.length && +multiEntityArr[0][getIdCompId]"
      :label="+curData[getIdCompId]"
      @click.native.stop
      @input="changeCheck"
      v-if="showSinglebox"
    ></el-radio>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    showSinglebox: {
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    getIdCompId: {
      type: String,
    },
    curData: {
      type: Object,
    },
    multiEntityArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    getChecked() {
      const index = this.multiEntityArr.findIndex((item) => {
        if (+item[this.getIdCompId] === +this.curData[this.getIdCompId]) {
          return true;
        }
        return false;
      });
      if (index === -1) {
        return false;
      }
      return true;
    },
  },
  components: {},
  methods: {
    getCheckedIndex() {
      const index = this.multiEntityArr.findIndex((item) => {
        if (+item[this.getIdCompId] === +this.curData[this.getIdCompId]) {
          return true;
        }
        return false;
      });
      return index;
    },
    // 修改checkout的值
    changeCheck() {
      if (this.showCheckbox) {
        const index = this.getCheckedIndex();
        if (index === -1) {
          this.multiEntityArr.push(this.curData);
        } else {
          this.multiEntityArr.splice(index, 1);
        }
      }
      if (this.showSinglebox) {
        this.multiEntityArr.splice(0, this.multiEntityArr.length, this.curData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.selectBox {
  display: inline-flex;
  ::v-deep {
    .el-radio__label {
      display: none;
    }
    .el-radio__input {
      padding-right: 4px !important;
    }
    .el-checkbox__input {
      padding-right: 4px !important;
    }
  }
}
</style>
