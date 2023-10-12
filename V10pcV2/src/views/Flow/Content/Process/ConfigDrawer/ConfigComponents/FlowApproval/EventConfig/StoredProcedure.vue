/**
* @name: 存储过程
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
            <i class="iconfont icon-cunchuguocheng m-r-8"></i>
            <span>存储过程</span>
          </div>
          <div class="right" @click="del">
            <span class="iconfont icon-shanchu"></span>删除
          </div>
        </div>
      </template>
      <template>
        <div class="content">
          <div class="form-item-label">
            存储过程
          </div>
          <filter-store-process
              placeholder="请选择存储过程"
              :showInfo="value.attribute.sysProceduresObj"
              @selectRes="selectColumnRes"
          ></filter-store-process>
          <div class="form-item-label">
            参数设置
          </div>
          <div class="headersBox" v-for="(item) in value.attribute.proceduresList" :key="item.uuid">
            <div class="paramsWrapFirst">
              <apiot-input v-model="item.parameterName" disabled></apiot-input>
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
                  v-model="item.valueInfo"
                  class="formulaContent"
              ></apiot-input>
              <select-formula
                  class="selectFormulaWrap"
                  v-if="item.valueType === 2"
                  v-model="item.valueInfo"
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
import SelectFormula from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/SelectFormula/index';
import FilterStoreProcess from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/FilterStoreProcess/index';
import { listProceduresParameter } from '@/api/menuConfig';

export default {
  props: {
    value: {
      type: Object,
      default() {
        return {
          key: '',
          nodeType: '7',
          attribute: {
            sysProceduresObj: {},
            proceduresList: []
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
    CollapseCard,
    FilterStoreProcess
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
    selectColumnRes(column) {
      const { id, proceduresName, proceduresMethod } = column;
      this.value.attribute.sysProceduresObj = {
        sysProceduresId: id,
        proceduresMethod,
        sysProceduresName: proceduresName
      };
      this.listProceduresParameter();
    },
    async listProceduresParameter() {
      const data = await listProceduresParameter({
        proId: this.value.attribute.sysProceduresObj.sysProceduresId,
        triggerId: ''
      });
      data.forEach((item) => {
        if (!item.valueType) {
          item.valueType = 1;
        }
        if (!item.valueInfo) {
          item.valueInfo = '';
        }
      });
      this.value.attribute.proceduresList = data;
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

    .icon-cunchuguocheng {
      font-size: 24px;
      color: #FAB71C;
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
