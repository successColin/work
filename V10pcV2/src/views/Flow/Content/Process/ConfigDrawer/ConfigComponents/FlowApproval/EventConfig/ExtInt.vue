/**
* @name: 外部接口
* @author: DELL
* @date: 2023/10/10 16:29
* @description：ExtInt
* @update: 2023/10/10 16:29
*/
<!-- 页面 -->
<template>
  <div class="extInt dragItem">
    <CollapseCard>
      <template v-slot:title>
        <div class="header">
          <div>
            <span class="iconfont icon-zongxiangtuodong m-r-10"></span>
            <i class="iconfont icon-waibujiekou m-r-8"></i>
            <span>外部接口</span>
          </div>
          <div class="right" @click="del">
            <span class="iconfont icon-shanchu"></span>删除
          </div>
        </div>
      </template>
      <template>
        <div class="content">
          <div class="form-item-label">
            代理接口编码
          </div>
          <el-select
              class="chooseWebHook"
              v-model="value.attribute.apiCode"
              filterable
              plcaeholder="请选择代理接口"
              @change="choose"
          >
            <el-option
                v-for="item in apiList"
                :key="item.businessCode"
                :label="item.businessName"
                :value="item.businessCode"
            >
            </el-option>
          </el-select>
          <div class="form-item-label">
            参数设置
          </div>
          <div class="headersBox" v-for="(item) in value.attribute.params" :key="item.uuid">
            <div class="paramsWrapFirst">
              <apiot-input v-model="item.showName" disabled></apiot-input>
            </div>
            <div class="paramsWrapFirst">
              <el-select v-model="item.valueType" @change="item.content = ''">
                <el-option label="固定值" :value="1"></el-option>
                <el-option label="公式" :value="2"></el-option>
              </el-select>
            </div>
            <div class="paramsWrapThird">
              <apiot-input
                  v-if="item.valueType===1"
                  v-model="item.content"
                  class="formulaContent"
              ></apiot-input>
              <select-formula
                  class="selectFormulaWrap"
                  v-if="item.valueType === 2"
                  v-model="item.content"
                  :showType="[1, 6]"
              ></select-formula>
              <!--        <i class="iconfont icon-shanchu" @click="deleteHeader(index)"></i>-->
            </div>
          </div>

        </div>
      </template>
    </CollapseCard>
  </div>
</template>

<script>
import CollapseCard from '@/views/Proxy/Layout/ApiConfig/components/collapseCard';
import SelectFormula
  from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/SelectFormula/index';

export default {
  props: {
    apiList: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Object,
      default() {
        return {
          key: '',
          nodeType: '8',
          attribute: {
            apiCode: '',
            params: []
          },
        };
      }
    }
  },
  data() {
    return {};
  },

  components: {
    SelectFormula,
    CollapseCard
  },

  computed: {},

  mounted() {
  },
  watch: {
    value: {
      deep: true,
      handler(v) {
        console.log(v, '组件值变化');
      }
    }
  },
  methods: {
    choose(v) {
      const current = this.apiList.find((item) => item.businessCode === v);
      if (!current) return;
      const { params = [] } = current;
      this.value.attribute.params = params.map(({
                                                  code,
                                                  comment
                                                }) => {
        const uuid = `${Date.parse(new Date())}${Math.random() * 100}`;
        return {
          uuid,
          name: code,
          showName: comment,
          valueType: 1,
          content: ''
        };
      });
    },
    del() {
      this.$emit('del');
    }
  },
  name: 'ExtInt',
};
</script>

<style lang='scss' scoped>
.extInt {
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

    .icon-zongxiangtuodong {
      color: #AAAAAA;
      cursor: pointer;
    }

    .icon-waibujiekou {
      font-size: 24px;
      color: rgb(250, 183, 28);
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

  .content {
    padding: 0 10px 0 10px;
    box-sizing: border-box;

    .form-item-label {
      height: 30px;
      margin-top: 10px;
      line-height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .chooseWebHook{
      width: 429px;
    }

    .headersBox {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .paramsWrapFirst {
        width: 209.5px;

        ::v-deep {
          .el-select {
            width: 100%;
          }
        }
      }

      .paramsWrapThird {
        width: 429px;
      }
    }

    .selectFormulaWrap {
      ::v-deep {
        .el-dialog__body {
          height: calc(100% - 54px - 54px);
        }
      }
    }
  }

  ::v-deep {
    .el-collapse-item__header {
      height: 42px;
      line-height: 42px;
    }
  }
}
</style>
