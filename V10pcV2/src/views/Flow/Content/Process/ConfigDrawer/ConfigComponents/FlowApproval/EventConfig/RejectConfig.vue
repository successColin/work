/**
* @name: Agree
* @author: DELL
* @date: 2023/10/10 14:43
* @description：Agree
* @update: 2023/10/10 14:43
*/
<!-- 页面 -->
<template>
  <div class="agreeBox" :class="eventType">
    <div class="nodeWrap">
      <div class="form-item-label">设置允许驳回节点</div>
      <div>
        <apiot-select
            v-model="allowNodeIds"
            filterable
            multiple
            placeholder="请选择节点"
            @change="changeSelect"
        >
          <el-option
              v-for="item in rejectNodeList"
              :value="`${item.id}`"
              :key="item.id"
              :label="item.nodeTitle"
          ></el-option>
        </apiot-select>
      </div>
    </div>
    <div class="box">
      <div class="listBox" v-for="item in allowNodeIds" :key="item">
        <CollapseCard>
          <template v-slot:title>
            <div class="header">
              <div>
                <span>{{getNodeName(item)}}</span>
              </div>
              <div class="right" @click="delNode(item)">
                <span class="iconfont icon-shanchu"></span>删除
              </div>
            </div>
          </template>
          <template>
            <div class="rejectConfigMain">
              <NormalConfig
                  v-bind="$attrs"
                  :eventType="eventType"
                  :value="{nodeEvents: config[item]}"
              />
            </div>
          </template>
        </CollapseCard>
      </div>
    </div>
  </div>
</template>

<script>
import CollapseCard from '@/views/Proxy/Layout/ApiConfig/components/collapseCard';
import NormalConfig from './CommonConfig';

export default {
  props: {
    eventType: {
      type: String
    },
    rejectNodeList: { // 允许驳回的节点
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Object,
      default() {
        return {
          rejectEvents: {}
        };
      }
    }
  },
  data() {
    const rejectArr = Object.keys(this.value.rejectEvents);
    return {
      allowNodeIds: rejectArr,
      config: this.value.rejectEvents
    };
  },

  components: {
    CollapseCard,
    NormalConfig
  },

  computed: {
    getNodeName() {
      return function (params) {
        console.log(params, this.rejectNodeList);
        const target = this.rejectNodeList.find((item) => `${item.id}` === `${params}`) || {};
        return target.nodeTitle || '';
      };
    }
  },

  mounted() {
  },
  watch: {
    config: {
      deep: true,
      handler(v) {
        console.log(v, '驳回组件值变化');
        this.$emit('change', { value: { rejectEvents: v }, type: this.eventType });
      }
    }
  },
  methods: {
    delNode(nodeId) {
      const i = this.allowNodeIds.findIndex((item) => item === nodeId);
      this.allowNodeIds.splice(i, 1);
      this.changeSelect(this.allowNodeIds);
    },
    changeSelect(v) {
      const nN = v.length; // 下拉选项的长度
      const cN = Object.keys(this.config).length; // 目前配置的长度
      console.log(nN, cN);
      if (!nN) { // 如果下拉选项的长度为空，重置配置
        this.config = {};
      }
      const obj = v.reduce((init, pre) => {
        const flag = Object.hasOwnProperty.call(this.config, pre);
        if (nN > cN && !flag) {
          return {
            ...init,
            [pre]: []
          };
        }
        if (nN < cN && !flag) {
          return init;
        }
        return {
          ...init,
          [pre]: this.config[pre]
        };
      }, {});
      this.config = obj;
      console.log(v, this.config);
    },
  },
  name: 'CommonConfig',
};
</script>

<style lang='scss' scoped>
.agreeBox {
  width: 100%;
  height: 100%;
  .nodeWrap{
    margin-bottom: 10px;
  }
  .form-item-label {
    height: 30px;
    //margin-top: 10px;
    line-height: 30px;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .box{
    height: calc(100% - 82px);
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    ::v-deep {
      .el-collapse-item__header {
        height: 42px;
        line-height: 42px;
      }
      .el-collapse-item__wrap, .el-collapse-item__header {
        border-bottom: 1px solid #EBEBEB;
      }
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-right: 20px;
      box-sizing: border-box;

      div {
        display: flex;
        align-items: center;
      }

      .right {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;

        span {
          color: #4689F5;
          cursor: pointer;
        }
      }
    }
    .rejectConfigMain{
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
    .listBox{
      margin-bottom: 10px;
      ::v-deep{
        .paramsWrapFirst {
          width: 204px;
        }
        .paramsWrapThird, .chooseWebHook {
          width: 418px;
        }
      }
    }
    &::-webkit-scrollbar {
      width: 0;
    }

    //将宽度设为0，滚动条就会隐藏。
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
