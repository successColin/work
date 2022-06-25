/**
* @name: index
* @author: DELL
* @date: 2021/9/14 14:21
* @description：headers 属性添加页面
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="headersWrap">
    <div class="headersBox" v-for="item in value" :key="item.uuid">
      <div class="paramsWrap">
        <div class="paramsName">{{ item.parameterName }}</div>
      </div>
      <div class="paramsWrap">
        <el-select v-model="item.valueType" @change="item.content = ''">
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
      </div>
      <div class="paramsWrap">
        <apiot-input
          v-if="item.valueType === 1"
          v-model="item.valueInfo"
          class="formulaContent"
        ></apiot-input>
        <select-formula
          class="selectFormulaWrap"
          v-if="item.valueType === 2"
          :configData="configData"
          :triggerCompMap="triggerCompMap"
          v-model="item.valueInfo"
          :showType="[1,6]"
        ></select-formula>
      </div>
    </div>
  </div>
</template>

<script>
import SelectFormula from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/SelectFormula/index';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      configData: []
    };
  },

  components: { SelectFormula },

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
  },
  watch: {},

  methods: {
    deleteHeader(index) {
      this.$emit('deleteHeader', index);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.headersWrap {
  width: 100%;
  height: auto;

  .headersBox {
    width: 100%;
    margin-bottom: 10px;
    box-sizing: border-box;

    &:hover {
      background: #fafafa;
      border-radius: 4px;
    }

    .paramsWrap {
      width: 100%;
      margin-bottom: 10px;
      position: relative;

      .paramsName {
        width: 100%;
        height: 32px;
        padding: 0 10px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4689f5;
        line-height: 32px;
        background: #e5f0ff;
        border-radius: 4px;
        box-sizing: border-box;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .formulaContent,
      .selectFormulaWrap {
        width: calc(100%);
      }

      ::v-deep {
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
</style>
