<template>
  <apiot-dialog
    class="returnValue"
    title="返回值设置"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <p class="returnValue__header m-b-10">
      <span class="returnValue__header--title">新增返回值</span>
      <apiot-button class="returnValue__header--btn" @click="addReturnValue"
        ><i class="iconfont icon-xinzeng m-r-4"></i>新增</apiot-button
      >
    </p>
    <ul class="returnValue__list">
      <li
        class="returnValue__item"
        v-for="(item, index) in returnValueList"
        :key="index"
      >
        <select-comp
          class="returnValue__item--comp"
          v-bind="$attrs"
          :curTriggerComp="item.comp"
          :isNeedTriggerComp="false"
        >
        </select-comp>
        <span class="returnValue__item--equal">=</span>
        <apiot-input
          v-model="item.apiValue"
          class="returnValue__item--value"
        ></apiot-input>
        <i class="iconfont icon-shanchu" @click="deleteList(index)"></i>
      </li>
    </ul>
    <transition name="slide-bottom">
      <comp-tree
        :visible.sync="showCompTree"
        v-if="showCompTree"
        @getSelectComp="getSelectComp"
        :isNeedTriggerComp="false"
        :filterList="getIdsList"
        v-bind="$attrs"
      ></comp-tree>
    </transition>
  </apiot-dialog>
</template>

<script>
import SelectComp from '../SelectComp';
import CompTree from '../CompTree';

export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      showCompTree: false,
      returnValueList: []
    };
  },

  components: {
    SelectComp,
    CompTree
  },

  computed: {
    getIdsList() {
      const arr = [];
      this.returnValueList.forEach((item) => {
        arr.push(item.comp.compId);
      });
      return arr;
    }
  },

  mounted() {
    if (this.value) {
      this.returnValueList = JSON.parse(this.value);
    }
  },

  methods: {
    sureClick() {
      const reg = /^[A-Za-z0-9_]*(\[[0-9]+\])?$/;
      const index = this.returnValueList.findIndex((item) => {
        if (item.apiValue) {
          const apiArr = item.apiValue.split('.');
          const i = apiArr.findIndex((api) => {
            if (reg.test(api)) {
              return false;
            }
            return true;
          });
          if (i !== -1) {
            return true;
          }
        } else {
          return true;
        }
        return false;
      });
      if (index !== -1) {
        return this.$message({
          type: 'error',
          message: `第${index + 1}条数据，返回值设置不规范`
        });
      }
      this.$emit('input', JSON.stringify(this.returnValueList));
      this.$emit('update:visible', false);
    },
    addReturnValue() {
      this.showCompTree = true;
    },
    getSelectComp(comp) {
      // console.log(comp);
      this.returnValueList.unshift({
        comp: {
          compId: comp.compId,
          name: comp.name,
          compPath: comp.compPath
        },
        apiValue: ''
      });
    },
    // 删除
    deleteList(index) {
      this.returnValueList.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.returnValue {
  &__header {
    display: flex;
    align-items: center;
    &--title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    &--btn {
      margin-left: auto;
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
  }
  &__list {
    flex: 1;
    overflow-y: auto;
  }
  &__item {
    display: flex;
    height: 32px;
    align-items: center;
    text-align: center;
    margin-bottom: 8px;
    &--comp {
      width: 276px;
    }
    &--equal {
      width: 24px;
    }
    &--value {
      width: 276px;
    }
    .icon-shanchu {
      color: #bbc3cd;
      font-size: 16px;
      cursor: pointer;
      margin-left: 8px;
      &:hover {
        color: $--color-primary;
      }
    }
  }
}
</style>
