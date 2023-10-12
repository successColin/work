<template>
  <section>
    <el-form-item style="margin-bottom: 0" v-if="showSwitch">
      <p class="switchBox">
        显示标题
        <el-switch
          v-model="activeObj.showLabelTitle"
          class="switchBox__switch"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </p>
    </el-form-item>
    <el-form-item label="标题" v-show="activeObj.showLabelTitle !== false">
      <apiot-input
        v-model="activeObj.name"
        placeholder="请输入标题"
        @focus="nameFocus"
        @blur="nameBlur"
      ></apiot-input>
    </el-form-item>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    showSwitch: {
      type: Boolean,
      default: false,
    },
    fatherObj: {
      type: Object,
    },
    activeObj: {
      type: Object,
    },
    relateObj: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    // 名字的失焦恢复
    nameFocus() {
      this.activeObj.backName = this.activeObj.name;
    },
    nameBlur() {
      if (!this.activeObj.name) {
        this.activeObj.name = this.activeObj.backName;
      }
      if (this.fatherObj.rules) {
        const ruleArr = this.fatherObj.rules[this.activeObj.compId];
        if (ruleArr && ruleArr.length) {
          const index = ruleArr.findIndex(
            (item) => item.flag === 'requiredRule',
          );
          if (index !== -1) {
            ruleArr[index].message = `${this.activeObj.name}不能为空`;
          }
        }
      }

      const placeholderArr = ['请输入', '请选择', '请上传'];

      if (this.activeObj.placeholder) {
        const i = placeholderArr.findIndex(
          (item) => this.activeObj.placeholder.indexOf(item) === 0,
        );

        if (i !== -1) {
          this.activeObj.placeholder = `${placeholderArr[i]}${this.activeObj.name}`;
        }
      }

      // 如果是下拉框 单选框 多选框
      if (this.activeObj.relateCompId) {
        const featuerObj =
          this.relateObj.pageType === 2
            ? this.relateObj.children[0]
            : this.relateObj.children[1];
        const btnsArr = featuerObj.children;
        const curIndex = btnsArr.findIndex(
          (btn) => btn.compId === this.activeObj.relateCompId,
        );
        if (curIndex !== -1) {
          btnsArr[curIndex].name = this.activeObj.name;
        }
      }

      // }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../commonConfig';
</style>
