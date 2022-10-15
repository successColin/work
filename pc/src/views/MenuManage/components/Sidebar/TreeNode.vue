<template>
  <div class="treeNode" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="treeNode__content">
      <el-checkbox
        style="margin-right: 4px"
        :value="getChecked"
        @click.native.stop
        @input="changeCheck"
        v-if="false"
      ></el-checkbox>
      <el-radio
        :value="multiEntityArr.length && +multiEntityArr[0].id"
        :label="data.id"
        :disabled="getDisabledIds.includes(data.id)"
        @click.native.stop
        @input="changeCheck"
        v-if="showSingle"
      ></el-radio>
      <div class="treeNode__treeIcon" @click="changeCheck">
        <img
          class="treeNode__treeIcon--img m-r-4"
          :src="$parseImgUrl(data.icon.imageUrl)"
          v-if="data.icon.imageUrl"
        />
        <i
          v-else
          :class="`iconfont ${data.icon.icon} ${data.icon.icon && 'm-r-4'}`"
          :style="`color:${data.icon.color}`"
        ></i>
      </div>
      <div class="treeNode__label" :title="data.menuName" @click="changeCheck">
        {{ data.menuName }}
      </div>
    </div>
    <div class="treeNode__btns" v-show="showBtns && !showSingle">
      <el-tooltip content="新增模块" placement="top">
        <i
          class="iconfont icon-xinzeng m-r-4"
          v-if="data.menuType !== 1 && this.node.level < 6"
          @click.stop="addModule"
        ></i>
      </el-tooltip>
      <el-tooltip content="编辑模块" placement="top">
        <i
          class="iconfont icon-bianji m-r-4"
          v-if="data.id !== -2"
          @click.stop="editModule"
        ></i>
      </el-tooltip>
      <el-tooltip content="删除模块" placement="top">
        <i
          class="iconfont icon-shanchu m-r-4"
          v-if="data.menuType !== 1 && data.id !== -2"
          @click.stop="deleteModule"
        ></i>
      </el-tooltip>
      <el-tooltip content="移动模块" placement="top">
        <i
          class="iconfont icon-qiehuan"
          v-if="data.menuType !== 1 && data.id !== -2"
          @click.stop="moveModule"
        ></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    node: {
      type: Object
    },
    data: {
      type: Object
    },
    multiEntityArr: {
      type: Array
    },
    showSingle: {
      type: Boolean,
      default: false
    },
    getDisabledIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      showBtns: false,
      timer: null
    };
  },
  mounted() {},

  computed: {
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
      this.timer = setTimeout(() => {
        this.showBtns = true;
      }, 100);
    },
    mouseleave() {
      clearInterval(this.timer);
      this.showBtns = false;
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
      if (this.getDisabledIds.includes(this.data.id)) {
        return;
      }
      if (this.showCheckbox) {
        const index = this.getCheckedIndex();
        if (index === -1) {
          this.multiEntityArr.push(this.data);
        } else {
          this.multiEntityArr.splice(index, 1);
        }
      }
      if (this.showSingle) {
        this.multiEntityArr.splice(0, this.multiEntityArr.length, this.data);
      }
    },
    // 新增模块
    addModule() {
      this.$emit('addModule', this.data);
    },
    // 编辑模块
    editModule() {
      this.$emit('editModule', this.data);
    },
    // 删除模块
    deleteModule() {
      this.$emit('deleteModule', this.data);
    },
    // 移动模块
    moveModule() {
      this.$emit('moveModule', this.data);
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
    line-height: 34px;
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
  &__btns {
    i {
      color: $--color-primary;
    }
  }
}
</style>
