<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:16:26
 * @Des: 表格 操作列 | 按钮类型
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    :sortable="false"
    :label="$t('knowledge.file_name')"
    resizable
    :min-width="300"
  >
    <template slot-scope="scope">
      <div @click="preView(scope.row)" class="inputWrap">
        <img class="listWrap__img" :src="getFileUrl(scope.row)" />
        <span v-if="!isEdit(scope.row)" :title="scope.row.sysKlTree.name">
          {{
            renderFileName(
              scope.row.name || scope.row.sysKlTree.name,
              scope.row,
            )
          }}
        </span>
        <apiot-input
          style="width: calc(100% - 38px)"
          v-model="editFileName"
          @blur="handleSubmitFileName"
          @keyup.enter.native="enterInput"
          @keydown.native="keyDown"
          @click.native.stop.prevent
          ref="input1"
          v-if="isEdit(scope.row)"
        >
        </apiot-input>
        <el-tooltip
          :tabindex="-1"
          effect="dark"
          transition="topEnterBottomLeave"
          :content="$t('knowledge.his_version')"
          placement="bottom"
        >
          <i
            class="iconfont icon-lishibanben"
            @click.stop="showHisList(scope.row)"
            v-if="!isEdit(scope.row) && scope.row.sysKlTree.treeType !== 1"
          ></i>
        </el-tooltip>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    fileUrl: {
      type: Function,
      default: () => {},
    },
    selectKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      editFileName: '',
    };
  },

  components: {},

  computed: {
    renderFileName() {
      return function (name, obj) {
        if (
          obj &&
          name &&
          ((obj.treeType && obj.treeType !== 1) ||
            (obj.sysKlTree &&
              obj.sysKlTree.treeType &&
              obj.sysKlTree.treeType !== 1))
        ) {
          const realNameArr = name.toString().split('.');
          // const len = realNameArr.length;
          if (realNameArr[0].length > 20) {
            realNameArr[0] = `${realNameArr[0].slice(
              0,
              6,
            )}...${realNameArr[0].slice(-3, realNameArr[0].length)}`;
          }
          // const newRealName = realNameArr.slice(0, len - 1);
          return realNameArr.join('.');
        }
        return name;
      };
    },
    getFileUrl() {
      return function (obj) {
        return this.fileUrl(obj);
      };
    },
    isEdit() {
      return function (item) {
        return (
          this.edit &&
          this.selectKeys.length === 1 &&
          this.selectKeys[0].sysKlTree.id === item.sysKlTree.id
        );
      };
    },
  },

  mounted() {},

  methods: {
    showHisList(item) {
      this.$emit('showHisList', item);
    },
    preView(item) {
      this.$emit('preview', item);
    },
    // 不允许空格
    keyDown(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return false;
      }
    },
    enterInput(e) {
      e.target.blur();
    },
    handleSubmitFileName() {
      const obj = this.selectKeys[0];
      let submitValue = this.editFileName;
      const { name, treeType } = obj.sysKlTree;
      if (treeType !== 1) {
        const realNameArr = name.toString().split('.');
        const len = realNameArr.length;
        const newRealName = realNameArr[len - 1];
        submitValue += `.${newRealName}`;
      }
      this.$emit('editFileName', submitValue, this.selectKeys[0].sysKlTree.id);
      // this.$emit('editFileName', this.editFileName, this.selectKeys[0].sysKlTree.id);
    },
  },
  watch: {
    edit: {
      immediate: true,
      deep: true,
      handler(newValue) {
        console.log(newValue);
        if (newValue && this.selectKeys.length === 1) {
          const obj = this.selectKeys[0];
          const { name, treeType } = obj.sysKlTree;
          if (treeType !== 1) {
            const realNameArr = name.toString().split('.');
            const len = realNameArr.length;
            const newRealName = realNameArr.slice(0, len - 1);
            this.editFileName = newRealName.join('.');
          } else {
            this.editFileName = name;
          }
          this.$nextTick(() => {
            if (this.$refs.input1) {
              this.$refs.input1.focus();
              this.$refs.input1.select();
            }
          });
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.inputWrap {
  height: 100%;
  display: flex;
  align-items: center;
  .inputWrap {
    ::v-deep {
      .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .listWrap__img {
    width: 24px;
    height: 24px;
    margin-right: 14px;
    vertical-align: middle;
    cursor: pointer;

    & + span {
      cursor: pointer;
    }
  }
  .icon-lishibanben {
    cursor: pointer;
    color: #bbc3cd;
    margin-left: 4px;
  }
  .icon-lishibanben:hover {
    color: $--color-primary;
  }
}
</style>
