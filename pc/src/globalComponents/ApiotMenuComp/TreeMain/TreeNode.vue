<template>
  <div class="treeNode" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="treeNode__content">
      <el-checkbox
        style="margin-right: 4px"
        :value="getChecked"
        @click.native.stop
        @input="changeCheck"
        v-if="showCheckbox"
      ></el-checkbox>
      <el-radio
        :value="multiEntityArr.length && +multiEntityArr[0][getIdCompId]"
        :label="data[getIdCompId]"
        @click.native.stop
        @input="changeCheck"
        v-if="showSinglebox && data[getIdCompId]"
      ></el-radio>
      <div class="treeNode__treeIcon">
        <img
          class="treeNode__treeIcon--img m-r-4"
          :src="configData.treeIcon.imageUrl"
          v-if="
            configData.hasTreeIcon &&
            configData.treeIcon.imageUrl &&
            !showCurDict(data)
          "
        />
        <i
          v-else
          :class="`iconfont ${getCurDict(data, 1)} ${
            getCurDict(data, 1) && 'm-r-4'
          }`"
          :style="`color:${getCurDict(data, 2)}`"
        ></i>
      </div>
      <div
        class="treeNode__label"
        :title="getTreeNodeText"
        @click="changeCheck"
      >
        {{ getTreeNodeText }}
      </div>
    </div>
    <BtnsArea
      class="treeNode__btns"
      v-show="showBtns && isSidebar"
      :configData="configData"
      :activeObj="activeObj"
      :grandFather="configData"
      :hasTriggerComp="hasTriggerComp"
      :isSidebar="isSidebar"
      :isTree="true"
      :getBtnsArr="getBtnsArr"
      :getFeatureArr="getFeatureArr"
      :rowData="data"
      :fileDeleteIds="[]"
      :moreOperateArr="[]"
      @selectTreeNode="selectTreeNode"
    ></BtnsArea>
  </div>
</template>

<script>
import compMixin from '../compMixin';

export default {
  name: '',
  props: {
    node: {
      type: Object
    },
    data: {
      type: Object
    },
    isSidebar: {
      type: Boolean
    },
    getBtnsArr: {
      type: Object
    },
    getFeatureArr: {
      type: Object
    },
    getIdCompId: {
      type: String
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    showSinglebox: {
      type: Boolean,
      default: false
    },
    multiEntityArr: {
      type: Array
    }
  },
  mixins: [compMixin],
  data() {
    return {
      showBtns: false
    };
  },
  mounted() {},

  computed: {
    getShowIds() {
      return this.getFeatureArr.children.filter((child) => {
        if (child.showTreeText) {
          return true;
        }
        return false;
      });
    },
    getTreeNodeText() {
      let str = '';
      this.getShowIds.forEach((item, i) => {
        let tempStr = this.data[`${item.compId}_`] || this.data[item.compId];
        if (tempStr) {
          if (item.enableDict) {
            const dictArr = this.$store.getters.getCurDict(item.dataSource.dictObj.dictKey);
            const obj = dictArr.find((dict) => +dict.value === +tempStr);
            if (obj) {
              tempStr = obj.name;
            }
          }
          if (i !== 0) {
            str += this.configData.linkSymbol;
          }
          str += tempStr;
        }
      });
      if (!str && this.data[this.getIdCompId] === 1) {
        return '根节点';
      }
      return str;
    },
    // 字典图标是否有值
    showCurDict() {
      return (item) => {
        console.log(item);
        const compId = this.configData.iconId;
        const index = this.getFeatureArr.children.findIndex((child) => child.compId === compId);
        if (index !== -1) {
          const comp = this.getFeatureArr.children[index];
          const dict = comp.dataSource.dictObj;
          const dictArr = this.$store.getters.getCurDict(dict.dictKey);
          const res = dictArr.find((child) => child.value === item[compId]);
          if (res && res.icon) {
            return true;
          }
        }
        return false;
      };
    },
    // 获取图标
    getCurDict() {
      return (item, flag) => {
        let compId = this.configData.iconId;
        if (flag === 2) {
          compId = this.configData.iconColorId;
        }
        const index = this.getFeatureArr.children.findIndex((child) => child.compId === compId);
        if (index !== -1) {
          const comp = this.getFeatureArr.children[index];
          const dict = comp.dataSource.dictObj;
          const dictArr = this.$store.getters.getCurDict(dict.dictKey);
          const res = dictArr.find((child) => child.value === item[compId]);
          if (res && res.icon) {
            if (flag === 1) {
              return res.icon.icon;
            }
            if (flag === 2) {
              return res.icon.color;
            }
          }
        }
        if (this.configData.hasTreeIcon) {
          if (flag === 1) {
            return this.configData.treeIcon.icon;
          }
          if (flag === 2) {
            return this.configData.treeIcon.color;
          }
        }
        return '';
      };
    },
    getChecked() {
      const index = this.multiEntityArr.findIndex((item) => {
        if (+item[this.getIdCompId] === +this.data[this.getIdCompId]) {
          return true;
        }
        return false;
      });
      if (index === -1) {
        return false;
      }
      return true;
    }
  },

  components: {},

  methods: {
    mouseenter() {
      this.showBtns = true;
      this.$emit('changeForm', this.data);
    },
    mouseleave() {
      this.showBtns = false;
      this.$emit('changeFormToCurrent');
    },
    selectTreeNode() {
      this.$emit('selectTreeNode', this.data);
    },
    getCheckedIndex() {
      const index = this.multiEntityArr.findIndex((item) => {
        if (+item[this.getIdCompId] === +this.data[this.getIdCompId]) {
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
          this.multiEntityArr.push(this.data);
        } else {
          this.multiEntityArr.splice(index, 1);
        }
      }
      if (this.showSinglebox) {
        this.multiEntityArr.splice(0, this.multiEntityArr.length, this.data);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.treeNode {
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  line-height: 16px;
  &__content {
    width: calc(100% - 100px);
    flex: 1;
    height: 100%;
    display: inline-flex;
    align-items: center;
    ::v-deep {
      .el-radio {
        margin-right: 4px;
      }
      .el-radio__label {
        display: none;
      }
      .el-radio__input {
        margin-top: 1px;
      }
    }
  }
  &__label {
    width: calc(100% - 20px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
  &__treeIcon {
    height: 100%;
    display: inline-flex;
    align-items: center;
    .iconfont {
      font-size: 20px;
    }
    &--img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
