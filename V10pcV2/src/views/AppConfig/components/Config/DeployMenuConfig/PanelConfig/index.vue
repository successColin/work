<template>
  <section>
    <apiot-dialog
      class="PanelConfig"
      v-on="$listeners"
      v-bind="$attrs"
      title="展示面板配置"
      :isShowSure="false"
      cancelBtnName="确认"
    >
      <apiot-table
        ref="table"
        :tableData="canAddArea"
        :showRadio="true"
        selectName="compId"
        :currentRadioObj.sync="currentRadioObj"
        @handleChangeRadioObj="handleCommand"
      >
        <el-table-column prop="name" label="面板区域">
          <template slot-scope="scope">
            {{ scope.row.name
            }}{{
              scope.row.tableInfo ? `(${scope.row.tableInfo.tableName})` : ''
            }}
          </template>
        </el-table-column>
      </apiot-table>
    </apiot-dialog>
  </section>
</template>

<script>
export default {
  props: {
    tabPaneConfig: {
      // 自定义页面那边需要
      type: Object,
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      },
    },
    activeObj: {
      type: Object,
    },
    configData: {
      type: Object,
    },
    triggerCompMap: {
      type: Object,
    },
    // 所有组件平坦化
    getAllcheck: {
      type: Object,
    },
  },
  computed: {
    canAddArea() {
      const obj = [];
      const keys = Object.keys(this.allArea);
      // console.log(this.allArea);
      keys.forEach((key) => {
        const area = this.allArea[key];

        // 设备位子表
        if (area.compName === 'DevicePosTree') {
          ['sys_device', 'sys_position'].forEach((tableName) => {
            const res = this.curPaneObj.panelFilter.findIndex((panle) => {
              if (
                panle.tableInfo.tableName === tableName &&
                panle.compId === key
              ) {
                return true;
              }
              return false;
            });
            if (res === -1) {
              obj.push({
                name: area.name,
                compId: area.compId,
                tableInfo: {
                  tableName,
                },
              });
            }
          });
        } else if (area.compName === 'MultiTree') {
          area.multiDataSource.forEach((data) => {
            const { tableName } = data.tableInfo;
            const res = this.curPaneObj.panelFilter.findIndex((panle) => {
              if (
                panle.tableInfo.tableName === tableName &&
                panle.compId === key
              ) {
                return true;
              }
              return false;
            });
            if (res === -1) {
              obj.push({
                name: '多表树区',
                compId: area.compId,
                tableInfo: {
                  tableName,
                  nameAlias: data.tableInfo.nameAlias,
                },
              });
            }
          });
        } else if (area.tableInfo && area.tableInfo.tableName) {
          const index = this.curPaneObj.panelFilter.findIndex((panle) => {
            if (panle.compId === key) {
              return true;
            }
            return false;
          });
          if (index === -1) {
            obj.push(area);
          }
        } else {
          const index = this.curPaneObj.panelFilter.findIndex((panle) => {
            if (panle.compId === key) {
              return true;
            }
            return false;
          });
          if (index === -1) {
            obj.push(area);
          }
        }
      });
      return obj;
    },
    // 获取面板所有单位
    getAreaAndComp() {
      const obj = {
        tab: {},
        area: {},
        comp: {},
      };
      // console.log(this.curPaneConfig);
      if (
        this.curPaneConfig &&
        this.curPaneConfig[0] &&
        this.curPaneConfig[0].children.length
      ) {
        const compPath = `${this.curPaneConfig[0].name}`;
        this.curPaneConfig[0].children.forEach((bigArea) => {
          const bigPath = `${compPath}/${bigArea.name}`;
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj.tab[tab.compId] = JSON.parse(JSON.stringify(tab));
              obj.tab[tab.compId].compType = 'TAB';
              const tabPath = `${bigPath}/${tab.compId}`;
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj.comp[comp.compId] = JSON.parse(
                          JSON.stringify(comp),
                        );
                        obj.comp[comp.compId].compPath = areaPath;
                      });
                    }
                  } else {
                    obj.area[area.compId] = JSON.parse(JSON.stringify(area));
                    obj.area[area.compId].compType = 'AREA';
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((smallArea) => {
                        if (smallArea.children) {
                          smallArea.children.forEach((comp) => {
                            obj.comp[comp.compId] = JSON.parse(
                              JSON.stringify(comp),
                            );
                            obj.comp[comp.compId].compPath = areaPath;
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
        // console.log(obj, 'obj');
        return obj;
      }
      // console.log(obj, 'obj');
      return obj;
    },
    // 面板上所有区域
    allArea() {
      return this.getAreaAndComp.area;
    },
  },
  data() {
    return {
      curPaneObj: {
        id: '', // 面板id
        panelName: '', // 面板名称
        sysMenuDesignId: '', // 设计组id
        relationMenuDesignId: '', // 外层设计组id
        panelType: '', // 类型
        panelData: [], // 面板传递参数
        panelFilter: [], // 面板过滤条件
      },
      curPaneConfig: [],
      currentRadioObj: {},
    };
  },
  watch: {},

  created() {
    this.curPaneConfig = this.tabPaneConfig.panelConfig;
    if (this.activeObj.panelHornMark && this.activeObj.panelHornMark.length) {
      // eslint-disable-next-line prefer-destructuring
      this.currentRadioObj = this.activeObj.panelHornMark[0];
    }
  },
  mounted() {},

  components: {},
  methods: {
    handleCommand(area) {
      const arr = [];
      arr.push(area);
      this.$emit('selectHornMark', arr);
    },
  },
};
</script>

<style lang="scss" scoped>
.PanelConfig {
  overflow-x: hidden;
  ::v-deep {
    @media (min-height: 640px) {
      & > .el-dialog {
        height: 640px;
      }
    }
    @media (max-height: 640px) {
      & > .el-dialog {
        position: absolute;
        top: 20px;
        bottom: 20px;
      }
    }
    & > .el-dialog {
      width: 960px;
      & > .el-dialog__body {
        padding-top: 16px;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px - 16px);
        overflow-y: auto;
      }
    }
  }
}
</style>
