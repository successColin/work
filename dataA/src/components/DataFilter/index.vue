/**
* @name: index
* @author: DELL
* @date: 2021/10/30 14:39
* @description：index
* @update: 2021/10/30 14:39
*/
<!-- 页面 -->
<template>
  <div class="databaseWrap">
    <div class="opearWrap">
      <c-select
          filterable
          v-model="val"
          class="selectData"
          :options="options"
          @change="change"
      >
      </c-select>
      <div class="look" @click="toggleFlag=!toggleFlag">
        <i class="el-icon-edit"></i>
      </div>
      <div class="dataBtn" @click="toggle">+</div>
    </div>
    <CDialog
        :visible.sync="toggleFlag"
        title="数据过滤器"
        classStyle="largeDialog"
        :isNeedBtn="true"
        @handleOk="handleOk"
        @handleCancel="handleCancel"
    >
      <div class="editContent">
        <div class="canEditArea">
          <JSEditor ref="canEditArea" v-if="toggleFlag" v-model="currentJs"/>
        </div>
        <div class="previewArea">
          <div class="changeBefore">
            <div class="title">修改前</div>
            <JsonEditor v-if="toggleFlag" v-model="jsResponse"/>
          </div>
          <div class="changeAfter">
            <div class="title">修改后</div>
            <JsonEditor v-if="toggleFlag" v-model="changeAfter"/>
          </div>
        </div>
      </div>
      <div slot="otherBtn" style="margin-right: 10px;">
        <CButton type="default" @click="testFun">测试</CButton>
      </div>
    </CDialog>
    <CDialog
        :visible.sync="visible"
        title="数据过滤器库"
        classStyle="middlingDialog"
        :isNeedBtn="false"
    >
      <DataList :init="init" :tableData="options"/>
    </CDialog>
  </div>
</template>

<script>
import {insertDataFilter, updateDataFilter, getDataFilterList} from '@/services/home';

const DataList = () => import('./DataList/index');
const JSEditor = () => import('@/pages/Configuration/ConfigComponents/JsEditor/index');
const JsonEditor = () => import('@/pages/Configuration/ConfigComponents/JsonEditor/index');


export default {
  props: {
    value: {
      type: Number
    },
    response: {
      type: String,
      default() {
        return '{}';
      }
    },
    activeComponent: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      val: 1,
      options: [{value: 1, label: 1}, {value: 2, label: 3}],
      toggleFlag: false,
      changeAfter: '{}',
      currentJs: 'function filter(data) { return data;}', // 当前数据过滤器的js
      jsResponse: '{}'
    };
  },

  components: {
    DataList,
    JSEditor,
    JsonEditor
  },

  computed: {},
  watch: {
    response: {
      handler(v){
        if (v) {
          this.jsResponse = v;
        }
      }
    }
  },
  mounted() {
    this.jsResponse = this.response;
    this.init();
  },

  methods: {
    beforeSave() { // 保存之前做个通用的校验
      if (this.currentJs.indexOf('alert') > -1) {
        throw new Error('alert is not function');
      }
    },
    testFun() { // 测试过滤器函数
      'use strict';
      try {
        this.beforeSave();
      } catch (e) {
        this.$message.error(e);
        return;
      }
      // eslint-disable-next-line no-new-func
      const b = new Function(`'use strict';
       return ${this.currentJs}`);
      try {
        if (this.currentJs.indexOf('alert') > -1) {
          throw new Error('alert is not function');
        }
        const changeBefore = JSON.parse(this.jsResponse);
        const result = b()(changeBefore)
        this.changeAfter = JSON.stringify(result);
      } catch (e) {
        if (this.currentJs.indexOf('alert') > -1) {
          this.$message.error(e);
        } else {
          this.$message.error('请检查过滤器的格式是否正确!');
        }
      }
      // eslint-disable-next-line consistent-return
      return this.changeAfter;
    },
    handleCancel(){
      this.changeAfter = '{}';
    },
    async handleOk() { // 点击确定的操作，如果没有选择值，这是新增选择操作，如果有选择值，这是修改操作
      try {
        this.beforeSave();
      } catch (e) {
        this.$message.error(e);
        return;
      }
      const {value} = this.$refs.canEditArea;
      const selectedId = this.val;
      const api = selectedId ? updateDataFilter : insertDataFilter;
      const params = selectedId ? {
        id: selectedId,
        content: value
      } : {
        name: this.activeComponent.name,
        content: value
      };
      const data = await api(params);
      if (!this.val) {
        this.val = data.id;
      }
      await this.init();
      await this.throwResult()
      this.toggleFlag = false;
      this.changeAfter = '{}';
    },
    throwResult() {
      const apiFilterResponse = this.testFun();
      const valueObj = {
        id: this.val,
        response: apiFilterResponse,
        filterFun: this.currentJs
      };
      this.$emit('change', valueObj);
      this.changeAfter = '{}';
    },
    async init() {
      const list = await getDataFilterList();
      this.options = list.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      });
      if (!this.value) {this.currentJs = 'function filter(data) { return data;}';}
      if (this.value) {
        const currentObj = this.options.find((item) => item.id === this.value);
        if (currentObj) {
          this.currentJs = currentObj.content || '{}';
        }
      }
      this.$nextTick(() => {
        this.val = this.value;
      })
    },
    toggle() {
      this.visible = true;
    },
    change(value) {
      this.val = value;
      if (value) {
        const currentObj = this.options.find((item) => item.id === value);
        if (currentObj) {
          this.currentJs = currentObj.content || '{}';
        }
      }
      this.throwResult();
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.databaseWrap {
  width: 100%;
  transition: height 0.5s ease;

  .opearWrap {
    display: flex;
    align-items: center;

    .selectData {
      flex: 0 0 70%;
    }

    .look {
      flex: 0 0 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      border-right: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      box-sizing: border-box;
      border-color: #2F437F;

      & > i {
        color: #FFFFFF;

        &.roteY {
          transform: rotate(90deg);
          transition: all 0.4s ease;
        }

        &.roteX {
          transform: rotate(0deg);
          transition: all 0.4s ease;
        }
      }
    }

    .dataBtn {
      flex: 1;
      width: 32px;
      height: 32px;
      margin-left: 10px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      background: $component-background-color;
      border: 1px solid $component-border-color;
      box-sizing: border-box;

      &:hover {
        border: 1px solid $component-borderFocus-color;
        transition: all 0.2s;
        cursor: pointer;
      }
    }
  }

  .editContent {
    width: 100%;
    height: 100%;

    .canEditArea {
      width: 100%;
      height: 261px;

      ::v-deep {
        .js-editor-wrap {
          height: 261px;

          &.fullScreen {
            height: calc(100% - 50px);
          }

          .CodeMirror {
            min-height: 261px;
          }

          .CodeMirror-scroll {
            min-height: 261px;
          }
        }
      }
    }

    .previewArea {
      width: 100%;
      height: 261px;
      display: flex;
      justify-content: space-between;

      .changeBefore, .changeAfter {
        width: 48%;

        .title {
          color: #FFFFFF;
          opacity: .7;
          line-height: 40px;
        }

        ::v-deep {
          .json-editor-wrap {
            height: 200px;

            &.fullScreen {
              height: calc(100% - 50px);
            }

            .CodeMirror {
              min-height: 200px;
            }

            .CodeMirror-scroll {
              min-height: 200px;
            }
          }
        }

      }
    }

    .previewArea {
      width: 100%;
      height: calc(100% / 2);
    }
  }
}
</style>
