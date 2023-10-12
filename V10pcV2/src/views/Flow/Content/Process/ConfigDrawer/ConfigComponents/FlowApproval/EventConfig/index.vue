/**
* @name: index
* @author: DELL
* @date: 2023/10/10 14:12
* @description：index
* @update: 2023/10/10 14:12
*/
<!-- 页面 -->
<template>
  <apiot-dialog
      title="事件设置"
      :isBigDialog="true"
      v-bind="$attrs"
      :visible="visible"
      v-on="$listeners"
      :show-close="false"
      @sure-click="handleOk"
      @cancle-click="handleCancel"
  >
    <div class="eventBox" v-if="visible">
      <el-tabs v-model="activeName">
        <el-tab-pane
            lazy
            v-for="item in tabArr"
            :label="item.name"
            :name="item.key"
            :key="item.key">
          <component
              :value="allConfig[item.eventType]"
              :is="item.com"
              v-bind="$attrs"
              @change="changeConfig"
              :eventType="item.eventType"
              :apiList="apiList"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </div>
  </apiot-dialog>

</template>

<script>
import { fetchApiList } from '@/api/flow';

import CommonConfig from './CommonConfig';
import RejectConfig from './RejectConfig';
// import { nodeComType } from '@/config';

export default {
  props: {
    tabArr: {
      type: Array,
      default() {
        return [];
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    const { key } = this.tabArr[0];
    console.log(key, 'zz', this.tabArr);
    return {
      apiList: [], // 外部接口数据
      allConfig: {}, // 所有配置
      activeName: key,
    };
  },

  components: {
    CommonConfig,
    RejectConfig
  },

  computed: {
  },

  mounted() {
    this.allConfig = this.value;
    console.log('mounted', this.value, this.activeName);
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler(v) {
       if (v) {
         const { key } = this.tabArr[0];
         this.activeName = key;
         this.initList();
         this.allConfig = this.value;
         console.log(this.value, 'v');
       }
      }
    },
  },
  methods: {
    changeConfig({ value, type }) {
      this.$set(this.allConfig, type, value);
    },
    async initList() { // 接口调用
      this.apiList = await fetchApiList();
    },
    handleCancel() {
      this.$emit('update:visible', false);
    },
    handleOk() {
      const nameObj = {
        AGREE: '同意',
        REVOKE: '撤回',
        REJECT: '驳回',
        REFERRAL: '转审',
        ENDORSEMENT: '加签',
        SUBMIT: '提交'
      };
      const arr = Object.keys(this.allConfig);
      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        const target = this.allConfig[item];
        if (['SUBMIT', 'AGREE', 'REVOKE', 'REFERRAL', 'ENDORSEMENT'].includes(item)) {
          console.log(item, target.nodeEvents);
          try {
            target.nodeEvents.forEach((node) => {
              const { nodeType, attribute } = node;
              console.log(nodeType, attribute);
              const { apiCode, sysProceduresObj, proceduresList, ruleList } = attribute;
              node.nodeAttributes = JSON.stringify(attribute);
              if (`${nodeType}` === '8' && !apiCode) {
                throw new Error(`请在${nameObj[item]}tab的外部接口中选择代理接口!`);
              }
              if (
                  `${nodeType}` === '7' &&
                  ((sysProceduresObj && JSON.stringify(sysProceduresObj) === '{}')) ||
                  (proceduresList && !proceduresList.length)
              ) {
                throw new Error(`请在${nameObj[item]}tab的存储过程中选择存储过程!`);
              }
              if (`${nodeType}` === '6' && (ruleList && !ruleList.length)) {
                throw new Error(`请在${nameObj[item]}tab的后台数据中添加配置!`);
              }
            });
          } catch (e) {
            this.$message.error(e.message);
            return;
          }
        }
        if (item === 'REJECT' && JSON.stringify(target) !== '{}') {
          const { rejectEvents } = target;
          const jArr = Object.keys(rejectEvents);
          for (let j = 0; j < jArr.length; j += 1) {
            const currentKey = jArr[j];
            const current = rejectEvents[currentKey] || [];
            if (!current.length) {
              return this.$message.error('请配置驳回节点的属性');
            }
            try {
              current.forEach((currentNode) => {
                const { nodeType: cNodeType, attribute: cAttribute } = currentNode;
                const {
                  apiCode: cApiCode,
                  sysProceduresObj: cSysProceduresObj,
                  proceduresList: cProceduresList,
                  ruleList: cRuleList
                } = cAttribute;
                currentNode.nodeAttributes = JSON.stringify(cAttribute);
                if (`${cNodeType}` === '8' && !cApiCode) {
                  throw new Error(`请在${nameObj[item]}tab的外部接口中选择代理接口!`);
                }
                if (
                    `${cNodeType}` === '7' &&
                    ((cSysProceduresObj && JSON.stringify(cSysProceduresObj) === '{}')) ||
                    (cProceduresList && !cProceduresList.length)
                ) {
                  throw new Error(`请在${nameObj[item]}tab的存储过程中选择存储过程!`);
                }
                if (`${cNodeType}` === '6' && (cRuleList && !cRuleList.length)) {
                  throw new Error(`请在${nameObj[item]}tab的后台数据中添加配置!`);
                }
              });
            } catch (e) {
              this.$message.error(e.message);
              return;
            }
          }
        }
      }
      console.log('结束');
      this.$emit('submitChange', this.allConfig);
      this.$emit('update:visible', false);
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
//::v-deep{
//  .el-dialog__body{
//    padding: 0 20px;
//  }
//}
.eventBox {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: left;
  overflow: hidden;

  ::v-deep {
    .el-tabs {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .el-tabs__item.is-active{
      font-weight: 600;
      color: #4689F5;
    }
    .el-tabs__header .el-tabs__item:nth-child(2) {
      padding-left: 10px;
    }
    .el-tabs__item{
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    .el-tabs__nav-wrap::after{
      height: 1px;
      background-color: #ebebeb;
    }
    .el-tabs__content{
      overflow: hidden;
      position: relative;
      width: 100%;
      height: calc(100% - 42px - 15px);
    }
    .el-tab-pane{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
