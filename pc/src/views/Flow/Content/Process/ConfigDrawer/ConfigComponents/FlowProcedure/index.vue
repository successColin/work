/**
* @name: inndex
* @author: DELL
* @date: 2021/9/14 14:21
* @description：inndex
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="contentWrap">
    <div class="config-property">
      <div class="form-item">
        <div class="form-item-label">存储过程</div>
        <div class="form-item-content">
          <filter-store-process
            placeholder="请选择存储过程"
            :showInfo="sysProceduresObj"
            @selectRes="selectColumnRes"
          ></filter-store-process>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">参数设置</div>
        <div class="form-item-content">
          <ProcedureParams :value="proceduresList" />
        </div>
      </div>
      <div>
        <apiot-button class="list-btn" @click="showReturnValue = true">
          <i class="icon-shezhi iconfont"></i>
          设置返回值
        </apiot-button>
      </div>
      <transition name="slide-bottom">
        <return-value
          :visible.sync="showReturnValue"
          v-if="showReturnValue"
          :triggerCompMap="triggerCompMap"
          :triggerComp="triggerComp"
          :configData="configData"
          v-model="returnValue"
        ></return-value>
      </transition>
    </div>
  </div>
</template>

<script>
import { lambdaArr } from '@/config/index';
import ReturnValue from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ReturnValue';
import FilterStoreProcess from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/FilterStoreProcess/index';
import { listProceduresParameter } from '@/api/menuConfig';
import ProcedureParams from './ProcedureParams';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    },
    // 当前触发控件
    triggerComp: {
      type: Object
    }
  },
  data() {
    return {
      showReturnValue: false,
      options: [],
      value: '', // 表
      value1: '', // 请选择触发字段
      radio: 'ONLYSAVE', // 触发方式
      fieldOptions: [], // 表字段
      visible: false, // 条件筛选弹框显示隐藏
      configData: [], // 页面配置信息
      lambdaArr,
      termObj: '', // 设置筛选条件的值
      returnValue: '',
      sysProceduresObj: {}, // 存储过程详情
      proceduresList: [] // 存储过程参数列表
    };
  },

  components: {
    ReturnValue,
    FilterStoreProcess,
    ProcedureParams
  },

  computed: {
    // 获取所有的校验单位
    getAllcheck() {
      const obj = {};
      if (this.configData[0] && this.configData[0].children.length) {
        const compPath = `${this.configData[0].name}`;
        this.configData[0].children.forEach((bigArea) => {
          const bigPath = `${compPath}/${bigArea.name}`;
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj[tab.compId] = JSON.parse(JSON.stringify(tab));
              obj[tab.compId].compType = 'TAB';
              const tabPath = `${bigPath}/${tab.compId}`;
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                        obj[comp.compId].compPath = areaPath;
                      });
                    }
                  } else {
                    obj[area.compId] = JSON.parse(JSON.stringify(area));
                    obj[area.compId].compType = 'AREA';
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((smallArea) => {
                        if (smallArea.children) {
                          smallArea.children.forEach((comp) => {
                            obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                            obj[comp.compId].compPath = areaPath;
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
        return obj;
      }
      return obj;
    },
    triggerCompMap() {
      const curInfo = {};
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        curInfo[key] = {};
        curInfo[key].compName = this.getAllcheck[key].name;
        curInfo[key].compType = this.getAllcheck[key].compType;
        curInfo[key].compPath = this.getAllcheck[key].compPath;
      });
      return curInfo;
    }
  },

  mounted() {
    const configData = sessionStorage.getItem('configData');
    if (configData) {
      this.configData = JSON.parse(configData);
    }
    if (JSON.stringify(this.nodeInfo) !== '{}') {
      this.proceduresList = this.nodeInfo.proceduresList;
      this.sysProceduresObj = this.nodeInfo.sysProceduresObj || {};
      this.returnValue = this.nodeInfo.returnValue || '';
    }
  },
  watch: {},

  methods: {
    selectColumnRes(column) {
      const { id, proceduresName } = column;
      this.sysProceduresObj = {
        sysProceduresId: id,
        sysProceduresName: proceduresName
      };
      this.listProceduresParameter();
    },
    async listProceduresParameter() {
      const data = await listProceduresParameter({
        proId: this.sysProceduresObj.sysProceduresId,
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
      this.proceduresList = data;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: auto;

  .config-property {
    padding: 10px 20px;
    box-sizing: border-box;

    .form-item {
      margin-bottom: 10px;

      .form-item-label {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        text-align: left;
      }

      .form-item-content {
        text-align: left;
        ::v-deep {
          .filterableInput {
            width: 100%;
          }
          .el-radio {
            height: 30px;
            line-height: 30px;

            .el-radio__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

        .select-field {
          .icon-bangzhu {
            font-size: 13px;
            color: #aaaaaa;
            font-weight: normal;
            cursor: pointer;

            &:hover {
              color: #4689f5;
            }
          }

          ::v-deep {
            .el-select {
              width: 100%;
            }

            .el-input__inner {
              border: 1px solid #e9e9e9;
            }

            .el-select {
              .el-input__inner:hover {
                border-color: #c0c4cc;
              }
            }

            .el-input__suffix {
              display: none;
            }

            .el-input {
              height: auto;
            }

            .el-icon-close {
              background: none;
              color: #78a7e5;

              &:hover {
                color: #4689f5;
              }
            }
          }
        }
      }
    }

    .list-btn {
      width: 100%;

      .iconfont {
        margin-right: 5px;
        color: #4689f5;
      }
    }
  }

  ::v-deep {
    .el-dialog__header {
      text-align: left;
    }

    .formula__box--header {
      text-align: left;
    }

    .formula__box--main {
      text-align: left;
    }
  }
}
</style>
