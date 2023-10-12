<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="rule"
    title="颜色显示条件"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <apiot-button type="primary" class="rule__addBtn" @click="addRule">
      <i class="iconfont icon-xinzeng m-r-4"></i>
      添加条件
    </apiot-button>
    <section class="rule__list">
      <div class="rule__head rule__item">
        <span class="rule__item--index"></span>
        <span class="rule__item--move"></span>
        <span class="rule__item--ruleContent">合并表头名称</span>
        <span class="rule__item--tip">合并字段</span>
        <span class="rule__item--delete"></span>
      </div>
      <div class="rule__body">
        <div class="rule__scroll">
          <draggable
            v-model="activeObj.mergeColumnsArr"
            group="rule"
            animation="300"
            handle=".icon-zongxiangtuodong"
          >
            <div
              class="rule__item"
              v-for="(item, index) in activeObj.mergeColumnsArr"
              :key="item.id"
            >
              <span class="rule__item--index">{{ index + 1 }}</span>
              <span class="rule__item--move">
                <i class="iconfont icon-zongxiangtuodong"></i>
              </span>
              <span class="rule__item--ruleContent">
                <apiot-input
                  v-model="item.content"
                  placeholder="请输入表头名称"
                ></apiot-input>
              </span>
              <span class="rule__item--tip">
                <el-select
                  v-model="item.columnsArr"
                  multiple
                  collapse-tags
                  class="contentConfig__select"
                >
                  <el-option
                    :label="comp.name"
                    :value="comp.compId"
                    v-for="comp in getColumns(item.columnsArr)"
                    :key="comp.compId"
                  ></el-option>
                </el-select>
              </span>
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
    showColumnsDialog: {
      type: Boolean,
    },
    columnsArr: {
      type: Object,
    },
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getColumns() {
      return (curColumnArr) => {
        const arr = this.columnsArr.children.filter((columns) => {
          // 排除id跟操作列跟隐藏的
          if (columns.tableCompName !== 'OperateCol' && columns.canShow) {
            return true;
          }
          return false;
        });
        // 排除已经选中的
        if (this.activeObj.mergeColumnsArr) {
          this.activeObj.mergeColumnsArr.forEach((cArr) => {
            cArr.columnsArr.forEach((columns) => {
              const index = arr.findIndex((comp) => {
                if (
                  columns === comp.compId &&
                  !curColumnArr.includes(columns)
                ) {
                  return true;
                }
                return false;
              });
              if (index !== -1) {
                // 代表已经被选中 要删除
                arr.splice(index, 1);
              }
            });
          });
        }
        console.log(arr);
        return arr;
      };
    },
  },

  mounted() {},

  methods: {
    addRule() {
      if (!this.activeObj.mergeColumnsArr) {
        this.$set(this.activeObj, 'mergeColumnsArr', []);
      }
      this.activeObj.mergeColumnsArr.push({
        content: '',
        columnsArr: [],
        id: `columns_${createUnique()}`,
      });
    },
    async deleteRule(index) {
      try {
        await this.$confirm('将删除条件，是否继续', {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning',
        });
        this.activeObj.mergeColumnsArr.splice(index, 1);
      } catch (error) {
        // console.log(error);
      }
    },
  },

  watch: {
    showColumnsDialog(v) {
      console.log(v);
      if (!v) {
        const { length } = this.activeObj.mergeColumnsArr;
        for (let i = length - 1; i >= 0; i -= 1) {
          if (!this.activeObj.mergeColumnsArr[i].content) {
            this.activeObj.mergeColumnsArr.splice(i, 1);
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
      width: 200px;
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
