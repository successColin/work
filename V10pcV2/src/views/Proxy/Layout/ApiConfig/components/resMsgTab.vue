/**
* @name: resMsgTab
* @author: DELL
* @date: 2023/2/23 19:20
* @description：resMsgTab
* @update: 2023/2/23 19:20
*/
<!-- 页面 -->
<template>
  <div class="resMsg">
    <transition name="el-fade-in-linear">
      <div class="resMsg__notes" v-if="isShow">
        <div>
          <i class="el-icon-warning"></i>
          <span class="resMsg__notes--use">模板使用</span>
          <span class="resMsg__notes--des">模板支持Freemarker语法，点击左侧变量名称可使用变量！</span>
        </div>
        <span class="iconfont icon-guanbi" @click="isShow=false"></span>
      </div>
    </transition>
    <div class="resMsg__template">
      <div class="resMsg__template--title">
        报文模板
      </div>
      <div class="resMsg__template--detials">
        <JsonEdit
            :value="info.commonApiHeader.requestBody"
            ref="resMsg"
            @changed="changeJson"
            :variables="getVariables"/>
      </div>
      <div class="resMsg__template--footer">
        <apiot-button type="primary" @click="doSend" :loading="loading">生成报文</apiot-button>
      </div>
    </div>
    <div class="resMsg__real" v-if="textarea">
      <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="textarea"
          disabled
          :rows="3"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
import { sendMessage } from '@/api/proxy';
import JsonEdit from './jsonEditor';

export default {
  props: {
    variables: {
      type: Array,
      default() {
        return [];
      }
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isShow: true,
      textarea: '',
      loading: false
    };
  },

  components: {
    JsonEdit
  },

  computed: {
    getVariables() {
      return this.variables.map((item) => ({
        ...item,
        variableCode: item.keycode,
        variableName: item.name,
        variableType: item.dataType === 'OBJECT' ? 5 : 4
      }));
    }
  },

  mounted() {
    this.$bus.$off('chooseVarToHead').$on('chooseVarToHead', (message) => {
      this.setValue(message);
    });
    this.textarea = this.info.commonApiHeader.textarea || '';
  },

  methods: {
    changeJson(v) {
      this.info.commonApiHeader.requestBody = v;
    },
    async doSend() { // 模拟请求
      this.loading = true;
      try {
        const template = this.$refs.resMsg.getValue();
        this.info.commonApiHeader.requestBody = template;
        const res = await sendMessage(this.info);
        this.textarea = res;
        this.info.commonApiHeader.textarea = res;
        this.loading = false;
        this.$message.success('操作成功!');
      } catch (e) {
        this.loading = false;
      }
    },
    setValue(message) {
      this.$refs.resMsg.setValue(message);
    }
  },
  beforeDestroy() {
    this.$bus.$off('chooseVarToHead');
  },
  name: 'resMsgTab',
};
</script>

<style lang='scss' scoped>
.resMsg {
  width: 100%;
  height: 100%;
  position: absolute;
  padding-bottom: 10px;
  overflow: auto;
  .resMsg__notes{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px 0 15px;
    background: #F1F3F6;
    border-radius: 4px;
    box-sizing: border-box;
    .el-icon-warning{
      font-size: 18px;
      margin-right: 11px;
      color: #BBC3CD;
    }
    .resMsg__notes--use{
      padding-right: 7px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      border-right: 1px solid #333333;
    }
    .resMsg__notes--des{
      padding-left: 7px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
    }
    .icon-guanbi{
      color: #BBC3CD;
      cursor: pointer;
      &:hover{
        color: #4689F5;
      }
    }
  }
  .resMsg__template{
    max-height: 310px;
    .resMsg__template--title{
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 30px;
    }
    .resMsg__template--detials{
      height: 238px;
      border-top: 1px solid #E9E9E9;
      border-left: 1px solid #E9E9E9;
      border-right: 1px solid #E9E9E9;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      box-sizing: border-box;
    }
    .resMsg__template--footer{
      display: flex;
      height: 42px;
      padding: 0 10px 0 0;
      align-items: center;
      justify-content: flex-end;
      background: #FFFFFF;
      border-radius: 0px 0px 4px 4px;
      border: 1px solid #E9E9E9;
    }
  }
  .resMsg__real{
    margin-top: 10px;
  }
}
</style>
