/**
* @name: varManage
* @author: DELL
* @date: 2023/2/21 15:29
* @description：varManage
* @update: 2023/2/21 15:29
*/
<!-- 页面 -->
<template>
  <div class="var__box">
    <div class="var__header">
      变量维护
      <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
        <i class="iconfont icon-xinzeng"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="VARIABLE">输入变量</el-dropdown-item>
          <el-dropdown-item command="OBJECT">数据对象</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="var__content">
      <p class="custom__varible"
         v-for="(item) in getVarArr"
         :key="item.id"
         :class="{isCurrent: isFlag(item)}"
      >
        <span class="custom__varible--item varibleItem"  @click="chooseVar(item)">
          <label class="varibleItem" :class="getVarClass(item)">{{item.name}}</label>
        </span>
        <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
          <i
              class="iconfont icon-bianji custom__varible--btn"
              @click="editVar(item)"/>
        </el-tooltip>
<!--        <el-tooltip-->
<!--            class="item"-->
<!--            effect="dark"-->
<!--            :content="`复制${item.keycode}`"-->
<!--            placement="top-start">-->
<!--          <i-->
<!--              :data-clipboard-text="getCopyValue(item.keycode)"-->
<!--              class="iconfont icon-fuzhi custom__varible&#45;&#45;btn"-->
<!--              @click.self="copy"-->
<!--          />-->
<!--        </el-tooltip>-->
        <span class="sepLine"></span>
        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
          <i
              class="iconfont icon-guanbi custom__varible--btn"
              @click="delVar(item)"/>
        </el-tooltip>
      </p>
    </div>
    <InputVarDialog
        :title="inputVarConfig.title"
        :variables="variables"
        @sureClick="closeInput"
        :visible.sync="inputVarConfig.visible"
    />
    <ObjectVarDialog
        :title="objectVarConfig.title"
        :variables="variables"
        :InputVarArr="getInputVarr"
        :ObjectVarArr="getObjectVarArr"
        @sureClick="closeObject"
        :type="objectVarConfig.type"
        :visible.sync="objectVarConfig.visible"
    />
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { createUnique } from '@/utils/utils';
import deepClone from 'lodash/cloneDeep';

const InputVarDialog = () => import('./inputVarDialog');
const ObjectVarDialog = () => import('./objectVarDialog');

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      current: {},
      clipboard: null,
      inputVarConfig: {
        title: '新增变量',
        visible: false
      },
      objectVarConfig: {
        title: '新增数据对象',
        visible: false,
        type: 'add'
      },
      variables: {}, // 输入变量数据
    };
  },

  components: {
    InputVarDialog,
    ObjectVarDialog
  },

  computed: {
    getCopyValue() {
      return function (keycode) {
        // eslint-disable-next-line no-useless-concat
        return '$' + `{${keycode}!}`;
      };
    },
    isFlag() {
      return function (obj) {
        const { id, keycode } = this.current;
        return id === obj.id && keycode === obj.keycode;
      };
    },
    getVarClass() {
      return function ({ dataType }) {
        if (dataType === 'VARIABLE') return 'VARIABLE';
        if (dataType === 'OBJECT') return 'OBJECT';
        return '';
      };
    },
    getInputVarr() {
      return this.value.filter((item) => item.dataType === 'VARIABLE');
    },
    getObjectVarArr() {
      return this.value.filter((item) => item.dataType === 'OBJECT');
    },
    getVarArr() {
      return [...this.getInputVarr, ...this.getObjectVarArr];
    },
  },

  mounted() {
    this.clipboard = new Clipboard('.icon-fuzhi');
    if (this.clipboard) {
      this.clipboard.on('success', () => {
        this.$message.success('复制成功！');
      });
    }
  },

  methods: {
    copy(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    chooseVar(item) {
      this.current = item;
      const obj = { variable: {
        ...item,
        variableCode: item.keycode,
        variableName: item.name,
        variableType: item.dataType === 'OBJECT' ? 5 : 4 }
      };
      this.$bus.$emit('chooseVarToHead', obj);
    },
    closeObject(result) {
      result.dataType = 'OBJECT';
      this.$emit('changeVar', { type: this.objectVarConfig.type, value: result });
      this.objectVarConfig = {
        title: '新增数据对象',
        visible: false,
        type: 'add'
      };
    },
    closeInput(result) {
      let type = 'edit';
      if (!result.id && !result.keycode) {
        result.keycode = createUnique();
        result.dataType = 'VARIABLE';
        type = 'add';
      }
      this.$emit('changeVar', { type, value: result });
      this.inputVarConfig = {
        title: '新增变量',
        visible: false
      };
    },
    editVar(item) { // 编辑输入变量
      if (item.dataType === 'OBJECT') {
        this.objectVarConfig = {
          title: '编辑数据对象',
          visible: true,
          type: 'edit'
        };
      }
      if (item.dataType === 'VARIABLE') {
        this.inputVarConfig = {
          title: '编辑变量',
          visible: true
        };
      }
      this.variables = deepClone(item);
    },
    delVar(item) { // 删除
      this.$emit('changeVar', { type: 'del', value: item });
    },
    handleCommand(config) {
      if (config === 'VARIABLE') {
        this.inputVarConfig = {
          title: '新增变量',
          visible: true
        };
        this.variables = {};
      }
      if (config === 'OBJECT') {
        this.objectVarConfig = {
          title: '新增数据对象',
          visible: true,
          type: 'add'
        };
        this.variables = {
          queryType: 0,
          returnType: 1
        };
      }
    }
  },
  name: 'varManage',
};
</script>

<style lang='scss' scoped>
.var__box {
  width: 100%;
  height: 100%;
  position: relative;

  .var__header {
    display: flex;
    justify-content: space-between;
    height: 36px;
    padding: 0 12px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    font-family: PingFangSC-Medium, PingFang SC;
    line-height: 36px;
    border-bottom: 1px solid #EBEBEB;

    & .icon-xinzeng {
      font-size: 16px;
      color: #4689f5;
      cursor: pointer;
    }
  }

  .var__content {
    position: absolute;
    width: 100%;
    height: calc(100% - 36px);
    overflow-y: auto;
    overflow-x: hidden;
    .custom__varible{
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover {
        background: #FAFAFA;
        cursor: pointer;
      }
      &.isCurrent{
        background: #FAFAFA;
      }
      .custom__varible--item {
        flex: 1;
      }
      .custom__varible--item label {
        margin: 6px 0 6px 9px;
        padding: 0 10px;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        background: #e5f0ff;
        border-radius: 4px;
        font-size: 13px;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #4689f5;
      }
      .custom__varible--item .VARIABLE{
        background: #FFEDE1;
        color: #FA6400;
      }
      .custom__varible--item .OBJECT{
        background: #EBFCF7;
        color: #10B98A;
      }
      &.isCurrent .custom__varible--btn{
        display: block;
      }
      .custom__varible--btn {
        display: none;
        flex-shrink: 0;
        width: 28px;
        color: #bbc3cd;
        text-align: center;
        font-size: 8px;
        cursor: pointer;
        &:hover{
          color: #4689F5;
        }
      }
      &.isCurrent .sepLine{
        display: block;
      }
      .sepLine {
        display: none;
        width: 1px;
        height: 8px;
        background: #e9e9e9;
      }
    }
  }
}
</style>
