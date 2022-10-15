<!--
 * @Descripttion: 可搜索、可弹出选择框
 * @Author: ytx
 * @Date: 2021-07-01 09:23:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-07-01 09:23:05
-->
<template>
  <section class="filterableInput">
    <div class="filterableInput__con" :class="[{ disabled: disabled }]">
      <el-select
        v-bind="$attrs"
        :value="currentRadioId"
        :disabled="disabled"
        :placeholder="placeholder"
        filterable
        class="filterableInput__select"
        ref="select"
        @blur="showRes = true"
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item[getLable]"
          :value="item[getLable]"
          @click.native="setCurrentRadio(item)"
          class="filterableInput__option"
        >
          <i class="iconfont icon-shujubiao" v-if="dialogType === 1"></i>
          <span class="filterableInput__option--label">{{
            item[getLable]
          }}</span>
        </el-option>
      </el-select>
      <i
        class="iconfont icon-jiahao"
        @click="handleAdd"
        :class="[{ disabled: disabled }]"
      ></i>
      <div
        class="filterableInput__result"
        v-if="currentRadioObj && currentRadioId && showRes"
        @click="changeRes"
        @mouseenter="showClose = true"
        @mouseleave="showClose = false"
      >
        <div
          class="filterableInput__result--table"
          :class="[{ dictStyle: dialogType === 3 }]"
        >
          <i class="iconfont icon-shujubiao" v-if="dialogType === 1"></i>
          <i class="iconfont icon-zidian" v-if="dialogType === 3"></i>
          <span class="font__ellipsis" :title="currentRadioObj[getLable]">{{
            currentRadioObj[getLable]
          }}</span>
          <i
            class="el-input__icon el-icon-circle-close"
            @click.stop="deletePanel"
            v-if="
              dialogType === 4 &&
              currentRadioObj &&
              currentRadioObj.id &&
              !disabled
            "
            v-show="showClose"
          ></i>
        </div>
      </div>
    </div>
    <!-- 实体表和字段表: 实体表1，字段表2 -->
    <transition name="dialog-fade">
      <table-or-field-dialog
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        :currentRadioObj.sync="currentRadioObj"
        :dialogType="dialogType"
        :tableName="tableName"
        :hasPagination="hasPagination"
        :columnTypes="columnTypes"
        :idNeedId="idNeedId"
        :notShowSys="notShowSys"
        :isTree="isTree"
        :title="title"
        :isSelPanel="isSelPanel"
        :otherParams="otherParams"
        :tableArr="tableArr"
        :isApp="isApp"
        @sure-click="handleSubmit"
      ></table-or-field-dialog>
    </transition>
  </section>
</template>

<script>
import { getListSysEntityTables, listSysEntityColumns } from '@/api/entityManage';
import { getDictList } from '@/api/dictManage';
import { listPanel, getSysImportTemplateList } from '@/api/menuConfig';
import { sysMenuList, ureportfiles } from '@/api/menuManage';
import { getListSysPrintTemplate } from '@/api/printTemplate';

export default {
  props: {
    // 弹出类型 1为表名称 2为字段名称 3为字典 4为面板 5为导入模板 6为菜单名称 7为ureport文件
    dialogType: {
      type: Number,
      default: 1
    },
    // 字段弹窗接口参数的表名
    tableName: {
      type: String,
      default: 'sys_org'
    },
    // 展示结果
    showInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 有无分页
    hasPagination: {
      type: Boolean,
      default: false
    },
    // 字段类型集合
    columnTypes: {
      type: String,
      default: ''
    },
    idNeedId: {
      type: Boolean,
      default: true
    },
    // 字段不展示系统字段
    notShowSys: {
      type: Boolean,
      default: false
    },
    // 是不是树结构的表
    isTree: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'false'
    },
    isSelPanel: {
      type: [Boolean, Number],
      default: false
    },
    otherParams: {
      // 额外参数，用于接口的其他参数
      type: Object,
      default() {
        return {};
      }
    },
    tableArr: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isApp: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 下拉选择
      options: [],
      // 是否显示弹出框
      dialogVisible: false,
      // 当前选中数据
      currentRadioObj: null,
      showRes: true,
      showClose: false
    };
  },
  components: {},
  computed: {
    currentRadioId() {
      if (this.currentRadioObj) {
        switch (this.dialogType) {
          case 1:
            return this.currentRadioObj.tableName;
          case 2:
            return this.currentRadioObj.columnName;
          case 3:
            return this.currentRadioObj.dictName;
          case 4:
            return this.currentRadioObj.panelName;
          case 5:
            return this.currentRadioObj.templateName;
          case 6:
            return this.currentRadioObj.menuName;
          case 7:
            return this.currentRadioObj.name;
          case 8:
            return this.currentRadioObj.name;
          default:
            return '';
        }
      }
      return '';
    },
    getLable() {
      switch (this.dialogType) {
        case 1:
          return 'tableName';
        case 2:
          return 'columnName';
        case 3:
          return 'dictName';
        case 4:
          return 'panelName';
        case 5:
          return 'templateName';
        case 6:
          return 'menuName';
        case 7:
          return 'name';
        case 8:
          return 'name';
        default:
          return 'id';
      }
    }
  },
  mounted() {},
  watch: {
    tableName: {
      handler(v) {
        this.tableName = v;
        this.getList();
      },
      deep: true,
      immediate: true
    },
    showInfo: {
      handler(v) {
        if (JSON.stringify(v) !== '{}') {
          this.currentRadioObj = v;
        } else {
          this.currentRadioObj = null;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      if (this.disabled) {
        return;
      }
      if (this.tableArr.length) {
        this.options = this.tableArr;
        return;
      }
      if (this.dialogType === 1) {
        const params = {
          keywords: this.dictKeywords
        };
        // console.log(this.isTree);
        if (this.isTree) {
          params.treeDict = 1;
        }
        const res = await getListSysEntityTables(params);
        this.options = res;
      } else if (this.dialogType === 2) {
        if (this.tableName) {
          const params = {
            keywords: this.dictKeywords,
            columnTypes: this.columnTypes,
            tableName: this.tableName
          };
          if (this.notShowSys) {
            params.allowApplication = 2;
          }
          let res = await listSysEntityColumns(params);
          if (this.notShowSys) {
            res = res.filter((item) => {
              if (item.columnName === 'root_path' || item.columnName === 'parent_id') {
                return false;
              }
              // 设备位置表 需要排除position_id
              // if (this.tableName === 'sys_device' || this.tableName === 'sys_position') {
              //   if (item.columnName === 'position_id') {
              //     return false;
              //   }
              // }
              return true;
            });
          }
          if (this.idNeedId) {
            this.options = res;
          } else {
            const arr = [];
            res.forEach((item) => {
              if (item.columnName !== 'id') {
                arr.push(item);
              }
            });
            this.options = arr;
          }
        }
      } else if (this.dialogType === 3) {
        const params = {
          keywords: this.dictKeywords
        };
        const res = await getDictList(params);
        this.options = res;
      } else if (this.dialogType === 4) {
        const params = {
          keywords: this.keyWord,
          panelType: '',
          relationMenuDesignId: this.$route.query.id,
          unDesign: 1,
          panelClassify: this.isSelPanel ? 2 : 1,
          clientType: this.$route.query.isApp === '1' || this.isApp === 1 ? 2 : 1,
          ...this.otherParams
        };
        if (this.isSelPanel === 0) {
          delete params.panelClassify;
        }
        const res = await listPanel(params);
        // 面板名称重置
        const index = res.findIndex((item) => item.id === this.showInfo.id);
        if (index !== -1) {
          this.showInfo.panelName = res[index].panelName;
        }
        this.options = res;
      } else if (this.dialogType === 5) {
        const params = {
          keywords: this.keyWord
        };
        const res = await getSysImportTemplateList(params);
        this.options = res;
      } else if (this.dialogType === 6) {
        const res = await sysMenuList({
          clientType: this.$route.query.isApp === '1' || this.isApp === 1 ? 2 : 1,
          menuLevel: 2,
          menuType: 2,
          keywords: this.keyWord
        });
        // console.log(data);
        this.options = res;
      } else if (this.dialogType === 7) {
        const res = await ureportfiles({
          current: 1,
          size: 99999
        });
        const arr = [];
        res.records.forEach((item) => {
          arr.push({
            name: item
          });
        });
        this.options = arr;
      } else if (this.dialogType === 8) {
        const res = await getListSysPrintTemplate({
          menuId: this.$route.query.id
        });
        this.options = res;
      }
    },
    // 按钮__添加
    async handleAdd() {
      if (this.dialogType === 2 && !this.tableName) {
        return this.$message({
          type: 'warning',
          message: '请先选择表格'
        });
      }
      if (this.disabled) {
        return false;
      }
      this.dictKeywords = '';
      this.dialogVisible = true;
    },

    // 弹出框__确定
    handleSubmit() {
      // console.log(this.currentRadioObj);
      if (!this.currentRadioObj) {
        return this.$message({
          type: 'warning',
          message: '请选择数据'
        });
      }
      this.dialogVisible = false;
      // console.log('确定');
      this.showRes = true;
      this.$emit('selectRes', this.currentRadioObj);
    },
    setCurrentRadio(item) {
      // console.log(item);
      this.currentRadioObj = item;
      this.$refs.select.blur();
      this.showRes = true;
      this.$emit('selectRes', this.currentRadioObj);
    },
    deletePanel() {
      this.setCurrentRadio(null);
      this.showRes = false;
    },
    // 更改展现形式
    changeRes() {
      if (this.disabled) {
        return false;
      }
      this.showRes = false;
      this.$refs.select.focus();
    }
  }
};
</script>
<style lang='scss' scoped>
.filterableInput {
  position: relative;
  &__select {
    width: 100%;
    &:focus-within + .icon-jiahao {
      border-color: $--color-primary;
      background: #f1f7ff;
      color: $--color-primary;
    }
  }
  &__option {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 24px;
      margin-right: 8px;
      color: #5a80ed;
      font-weight: normal;
    }
    &--label {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
  }
  &__result {
    position: absolute;
    height: 32px;
    left: 0;
    bottom: 0;
    right: 32px;
    &--table {
      display: flex;
      align-items: center;
      position: absolute;
      top: 3px;
      right: 3px;
      bottom: 3px;
      left: 3px;
      background: #e5f0ff;
      border-radius: 4px;
      cursor: pointer;
      &.dictStyle {
        background-color: #ebfcf7;
        i {
          background-color: #34c7be;
        }
      }
      i {
        width: 28px;
        height: 100%;
        background: #5a80ed;
        line-height: 24px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        border-radius: 4px 0 0 4px;
        margin-right: 4px;
      }
      .el-input__icon {
        height: 26px;
        line-height: 26px;
        background-color: transparent;
        color: #999;
        font-size: 13px;
        margin-left: auto;
      }
      span {
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-left: 6px;
      }
    }
  }
  &__con {
    &:hover:not(.disabled) {
      .icon-jiahao {
        border-color: $--color-primary;
        background: #f1f7ff;
        color: $--color-primary;
      }
      ::v-deep {
        .el-input__inner {
          border-color: $--color-primary;
        }
      }
    }
    &.disabled {
      .filterableInput__result--table {
        cursor: not-allowed;
        background: #f1f3f6;
      }
      .icon-shujubiao {
        background-color: #bbc3cd;
      }
    }
    .icon-jiahao {
      font-size: 18px;
      color: #aaaaaa;
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      cursor: pointer;
      border-left: 1px dashed #d9d9d9;
      transition: border-color 300ms ease-in-out;
      &.disabled {
        cursor: not-allowed;
      }
    }

    ::v-deep {
      .el-input__inner {
        border: 1px dashed #d9d9d9;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .el-radio__label {
        display: none;
      }
      .el-table--border th:first-child .cell,
      .el-table--border td:first-child .cell {
        padding-left: 12px;
      }
      .el-select {
        width: 100%;
        height: 32px;
      }
    }
  }
}
</style>
