<template>
  <apiot-dialog
    class="CompleteConfig"
    v-on="$listeners"
    v-bind="$attrs"
    :title="title"
    :isShowSure="false"
    cancelBtnName="确认"
  >
    <ActionTerm
      v-bind="$attrs"
      termTitle="生效条件"
      :curTermObj="termObj"
      :lambdaArr="lambdaArr"
      :notShowSys="false"
      :tableInfo="tableInfo"
      :flag="2"
    ></ActionTerm>
  </apiot-dialog>
</template>

<script>
import { lambdaArr } from '@/config/index';
import ActionTerm from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ActionTerm';

export default {
  name: '',
  props: {
    activeObj: {
      type: [Object, Array]
    },
    configData: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    },
    // type 为2的时候的表
    tableInfo: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      lambdaArr,
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [] // 条件数组
      },
    };
  },
  components: {
    ActionTerm,
  },
  computed: {
  },
  created() {
    if (this.configData) {
      this.termObj = this.configData;
    }
    console.log(this.termObj, 'this.termObj');
  },
  methods: {
  },
  watch: {
    termObj: {
      handler(v) {
        // console.log(this.getCurrentTab);
        // console.log(v);
        const obj = {
          termType: v.termType, // 1 代表外层and 内层 or
          termArr: [] // 条件数组
        };
        if (v.termArr.length) {
          v.termArr.forEach((term) => {
            // console.log(term);
            const arr = [];
            term.forEach((child) => {
              if (child.columnObj.columnName) {
                arr.push(child);
              }
            });
            if (arr.length) {
              obj.termArr.push(arr);
            }
          });
          console.log(obj);
          this.$emit('changeTerm', obj);
        } else {
          this.$emit('changeTerm', '');
        }
      },
      deep: true
    },
  }
};
</script>

<style lang='scss' scoped>

</style>
