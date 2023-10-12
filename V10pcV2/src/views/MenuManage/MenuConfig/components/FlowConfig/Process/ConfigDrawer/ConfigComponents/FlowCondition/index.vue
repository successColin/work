/**
* @name: index
* @author: DELL
* @date: 2021/9/22 8:53
* @description：index
* @update: 2021/9/22 8:53
*/
<!-- 页面 -->
<template>
  <div class="conditionWrap">
    <ActionTerm
        ref="dataFiltering"
        :configData="configData"
        businessType="flow"
        :lambdaArr="lambdaArr"
        :triggerCompMap="triggerCompMap"
        layout="Vertical"
        class="conditionActionTerm"
        :value="value"
    />
  </div>
</template>

<script>
import { lambdaArr } from '@/config/index';
import ActionTerm from '../../../../../PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ActionTerm';

export default {
  props: {
    nodeInfo: { // 节点流程配置信息
      type: Object,
      default: () => {
      }
    },
  },
  data() {
    return {
      configData: [], // 页面配置信息
      lambdaArr,
      value: '', // 条件配置信息
    };
  },

  components: { ActionTerm },

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
  errorCaptured(error) {
    if (error.message.indexOf('compType') > -1) {
      this.$message.warning('页面配置已经有调整，请重新配置分支条件！');
    }
  },

  mounted() {
    const configData = sessionStorage.getItem('configData');
    if (configData) {
      this.configData = JSON.parse(configData);
    }
    if (JSON.stringify(this.nodeInfo) !== '{}') {
      const value = {
        termType: this.nodeInfo.conditionDesc,
        termArr: this.nodeInfo.conditions,
      };
      this.value = JSON.stringify(value);
    }
  },

  methods: {},
  name: 'index',
};
</script>

<style lang='scss' scoped>
.conditionWrap {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  position: relative;
  overflow-y: auto;
  box-sizing: border-box;

  .conditionActionTerm {
    position: absolute;
    width: 360px;
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
