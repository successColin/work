<template>
  <div class="pageConfig">
    <header class="pageConfig__header">
      <div class="pageConfig__header--center" v-if="!isSelect">
        {{ isPanel ? panelName : $route.query.menuName }}
      </div>
      <div class="pageConfig__header--right">
        <apiot-button v-if="!isPanel">预览</apiot-button>
        <apiot-button v-if="isPanel" @click="closePanle">取消</apiot-button>
        <apiot-button type="primary" @click="saveLayout(1)" v-if="!isSelect"
          >保存</apiot-button
        >
        <apiot-button type="primary" @click="saveSelConfig" v-if="isSelect"
          >保存</apiot-button
        >
        <!-- <apiot-button type="primary">发布</apiot-button> -->
      </div>
    </header>
    <section class="pageConfig__wrapper">
      <div class="pageConfig__wrapper--left">
        <config-sidebar
          :configData="configData"
          :activeObj.sync="activeObj"
          v-if="!isSelect"
        ></config-sidebar>
        <sel-data-init-config
          ref="selDataPanle"
          @changeType="changeType"
          :configData="configData"
          :curDrawerType.sync="curDrawerType"
          :row="row"
          v-else
        ></sel-data-init-config>
      </div>
      <div class="pageConfig__wrapper--center">
        <ListOrTree
          v-if="
            isSelect &&
            configData[0] &&
            [3, 5].includes(configData[0].selShowType)
          "
          class="pageConfig__wrapper--btnArr"
          :class="[{ isApp: $route.query.isApp == 1 }]"
          :disabled="configData[0].selShowType === 5"
          :curTypeValue="configData[0].selShowType === 5 ? 2 : 1"
          @changeShowType="changeShowType"
        ></ListOrTree>
        <div
          class="configModule"
          :class="[
            {
              highBorder:
                activeObj.compId === configData[0].compId &&
                $route.query.isApp != 1,
            },
            { isApp: $route.query.isApp == 1 },
          ]"
          v-if="configData.length"
          @click.stop="
            $route.query.isApp != 1 && !isSelect
              ? (activeObj = configData[0])
              : ''
          "
        >
          <div class="isApp__title" v-if="$route.query.isApp == 1">
            {{ isPanel ? panelName : $route.query.menuName }}
          </div>
          <component
            :is="configData[0].compName"
            :configData.sync="configData[0]"
            :activeObj.sync="activeObj"
            :hasTriggerComp="hasTriggerComp"
          ></component>
        </div>
      </div>
      <div class="pageConfig__wrapper--right">
        <component
          v-show="!showGlobal"
          :key="activeObj.compId"
          :is="propertyCompName"
          :configData.sync="configData"
          :activeObj.sync="activeObj"
          :hasTriggerComp="hasTriggerComp"
          :hasTriggerCompOnly="hasTriggerCompOnly"
          :triggerCompMap="triggerCompMap"
          :getAllcheck="getAllcheck"
          :isSelect="isSelect"
        ></component>
        <global-config
          v-show="showGlobal"
          :configData="configData"
          :triggerCompMap="triggerCompMap"
          :hasTriggerComp="hasTriggerComp"
          :isPanel="isPanel"
        ></global-config>
        <apiot-button
          class="pageConfig__wrapper--globalBtn"
          v-if="!isSelect"
          @click="showGlobal = !showGlobal"
        >
          <i class="iconfont icon-shezhi m-r-4"></i
          >{{ showGlobal ? '组件配置' : '全局配置' }}
        </apiot-button>
      </div>
    </section>
  </div>
</template>

<script>
import { getDesignTriggersLinkDiagram, getSysDesignMenu, saveLayout } from '@/api/menuConfig';
import { createUnique } from '@/utils/utils';
import CardMainConfig from './components/compProperty/CardMainConfig';
import CascadeConfig from './components/compProperty/CascadeConfig';
import CodingConfig from './components/compProperty/CodingConfig';
import ContentConfig from './components/compProperty/ContentConfig';
import BtnsAreaConfig from './components/compProperty/ContentConfig/BtnsAreaConfig';
import DataMultiSelConfig from './components/compProperty/DataMultiSelConfig';
import DataSingleSelConfig from './components/compProperty/DataSingleSelConfig';
import DatePickerBoxConfig from './components/compProperty/DatePickerBoxConfig';
import DateTimePickerBoxConfig from './components/compProperty/DateTimePickerBoxConfig';
import DeployProgressBarConfig from './components/compProperty/DeployProgressBarConfig';
import DevicePosTreeConfig from './components/compProperty/DevicePosTreeConfig';
import DividingLineConfig from './components/compProperty/DividingLineConfig';
import DropDownBoxConfig from './components/compProperty/DropDownBoxConfig';
import EnclosureConfig from './components/compProperty/EnclosureConfig';
import EvaluationConfig from './components/compProperty/EvaluationConfig';
import FaultTreeConfig from './components/compProperty/FaultTreeConfig';
import FormButtonConfig from './components/compProperty/FormButtonConfig';
import GlobalConfig from './components/compProperty/GlobalConfig';
import ImgAndVideoConfig from './components/compProperty/ImgAndVideoConfig';
import LabelConfig from './components/compProperty/LabelConfig';
import MenuMainConfig from './components/compProperty/MenuMainConfig';
import MultiBoxConfig from './components/compProperty/MultiBoxConfig';
import MultiLineTextConfig from './components/compProperty/MultiLineTextConfig';
import MultiTreeConfig from './components/compProperty/MultiTreeConfig';
import NumberBoxConfig from './components/compProperty/NumberBoxConfig';
import PageLayout from './components/compProperty/PageLayout';
import PapersUploadConfig from './components/compProperty/PapersUploadConfig';
import QueryMainConfig from './components/compProperty/QueryMainConfig';
import RelatedDataConfig from './components/compProperty/RelatedDataConfig';
import RichTextConfig from './components/compProperty/RichTextConfig';
import SearchConditionConfig from './components/compProperty/SearchConditionConfig';
import SelDataInitConfig from './components/compProperty/SelDataInitConfig';
import SingleBoxConfig from './components/compProperty/SingleBoxConfig';
import SingleLineTextConfig from './components/compProperty/SingleLineTextConfig';
import TableMainConfig from './components/compProperty/TableMainConfig';
import TreeTableConfig from './components/compProperty/TreeTableConfig';
import TextTipConfig from './components/compProperty/TextTipConfig';
import TreeMainConfig from './components/compProperty/TreeMainConfig';
import WebviewConfig from './components/compProperty/WebviewConfig';
import CarouselConfig from './components/compProperty/CarouselConfig';
import StepsConfig from './components/compProperty/StepsConfig';
import ConfigSidebar from './components/ConfigSidebar';
import selData from './selData';

export default {
  props: {
    // 是不是面板
    isPanel: {
      type: Boolean,
      default: false
    },
    // 是不是数据选择面板
    isSelect: {
      type: Boolean,
      default: false
    },
    // 当前弹窗类型
    curDrawerType: {
      type: Number,
      default: 1
    },
    row: {
      type: Object
    },
    // 编辑时才有当前设计组id
    sysMenuDesignId: {
      type: Number,
      default: 0
    },
    // 面板名称
    panelName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      configData: [],
      activeObj: {
        compId: 0,
        propertyCompName: ''
      },
      showGlobal: false,
      // triggerCompMap: {}, // 触发器组件的map
      hasTriggerCompOnly: {}, // 已配置触发器的组件
      hasFilterCompOnly: {}, // 已配置过滤条件的组件
      notDelPanelId: []
    };
  },

  components: {
    ConfigSidebar,
    PageLayout,
    ContentConfig,
    MenuMainConfig,
    CardMainConfig,
    TreeMainConfig,
    MultiTreeConfig,
    DevicePosTreeConfig,
    TableMainConfig,
    TreeTableConfig,
    BtnsAreaConfig,
    SingleLineTextConfig,
    FormButtonConfig,
    DropDownBoxConfig,
    SingleBoxConfig,
    MultiBoxConfig,
    DataSingleSelConfig,
    DataMultiSelConfig,
    DatePickerBoxConfig,
    DateTimePickerBoxConfig,
    NumberBoxConfig,
    GlobalConfig,
    MultiLineTextConfig,
    ImgAndVideoConfig,
    EnclosureConfig,
    PapersUploadConfig,
    LabelConfig,
    SearchConditionConfig,
    CodingConfig,
    FaultTreeConfig,
    DividingLineConfig,
    SelDataInitConfig,
    WebviewConfig,
    RelatedDataConfig,
    TextTipConfig,
    RichTextConfig,
    DeployProgressBarConfig,
    QueryMainConfig,
    EvaluationConfig,
    CascadeConfig,
    CarouselConfig,
    StepsConfig
  },
  provide() {
    return {
      isConfig: true,
      resolveFormula: '', // 真实页面使用的方法，定义空，占位防报错
      getAllForm: '', // 真实页面使用的方法，定义空，占位防报错
      getAllComp: '',
      getPanel: '', // 真实页面使用的方法，定义空，占位防报错
      getMenu: '', // 真实页面使用的方法，定义空，占位防报错
      getFatherPanel: '', // 真实页面使用的方法，定义空，占位防报错
      onlyFlag: '', // 真实页面使用的方法，定义空，占位防报错
      getSelData: '', // 真实页面使用的方法，定义空，占位防报错
      initSelData: '', // 真实页面使用的方法，定义空，占位防报错
      changeNotValueChange: '', // 真实页面使用的方法，定义空，占位防报错
      changeTabChange: '', // 真实页面使用的方法，定义空，占位防报错
      getIsMain: '', // 真实页面使用的方法，定义空，占位防报错
      getInitComp: '', // 真实页面使用的方法，定义空，占位防报错
      resolveTerm: '', // 真实页面使用的方法，定义空，占位防报错
      getNotInitArr: '', // 真实页面使用的方法，定义空，占位防报错
      clickTrigger: '', // 真实页面使用的方法，定义空，占位防报错
      initStart: '', // 真实页面使用的方法，定义空，占位防报错
      isPanel: this.isPanel,
      isSelect: this.isSelect,
      sysMenuDesignId: this.sysMenuDesignId
    };
  },
  computed: {
    propertyCompName() {
      return this.activeObj.propertyCompName;
    },
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
                        comp.tabId = tab.compId;
                        obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                        obj[comp.compId].compPath = areaPath;
                        obj[comp.compId].tabId = tab.compId;
                      });
                    }
                  } else {
                    obj[area.compId] = JSON.parse(JSON.stringify(area));
                    obj[`${area.compId}_`] = area;
                    if (area.compName === 'DevicePosTree') {
                      if (area.posAddPos) {
                        this.notDelPanelId.push(area.posAddPos);
                      }
                      if (area.posAddDevice) {
                        this.notDelPanelId.push(area.posAddDevice);
                      }
                      if (area.deviceAddDevice) {
                        this.notDelPanelId.push(area.deviceAddDevice);
                      }
                    }
                    obj[area.compId].compType = 'AREA';
                    obj[area.compId].tabId = tab.compId;
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((smallArea) => {
                        if (smallArea.children) {
                          smallArea.children.forEach((comp) => {
                            if (comp.compName === 'DataSingleSel' && comp.textPanelId) {
                              this.notDelPanelId.push(...comp.textPanelId.split(','));
                            }
                            obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                            obj[comp.compId].compPath = areaPath;
                            obj[comp.compId].tabId = tab.compId;
                            // 表格区里面的按钮
                            if (comp.children) {
                              const btnPath = `${areaPath}/${comp.name}`;
                              comp.children.forEach((btn) => {
                                btn.tabId = tab.compId;
                                obj[btn.compId] = JSON.parse(JSON.stringify(btn));
                                obj[btn.compId].compPath = btnPath;
                                obj[btn.compId].tabId = tab.compId;
                              });
                            }
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
    },
    hasTriggerComp() {
      return {
        ...this.hasTriggerCompOnly,
        ...this.hasFilterCompOnly
      };
    }
  },

  mounted() {
    // 获取事件字典
    this.$store.dispatch('getCurrentDict', 'TRIGGER_EVENT,PANEL_TYPE,REQUISITE_TYPE');
    // 更新字典项
    this.$bus.$on('changeDictArr', (dict) => {
      if (!this.configData[0].dictArr.includes(dict)) {
        this.configData[0].dictArr.push(dict);
      }
    });
    // 更新触发器的组件
    this.$bus.$on('changeHasTriggerComp', (obj) => {
      this.hasTriggerCompOnly = obj;
    });
    // 删除面板关联关系
    this.$bus.$on('deletePanel', (compId) => {
      if (this.configData[0].paneObj[compId]) {
        delete this.configData[0].paneObj[compId];
      }
    });
    this.$bus.$on('addHasTriggerComp', this.resolveFilterTerm);
    this.initConfig();
    this.getDesignTriggersLinkDiagram();
    this.resolveFilterTerm();
  },

  methods: {
    // 数据初始化
    async initConfig() {
      // 不是面板配置
      if (!this.isPanel) {
        if (sessionStorage.configData) {
          this.configData = JSON.parse(sessionStorage.configData);
        } else {
          const data = await getSysDesignMenu({
            sysMenuDesignId: this.$route.query.id
          });
          if (data && data.designOverallLayout) {
            this.configData = data.designOverallLayout;
          }
        }
        if (this.configData[0]) {
          this.$nextTick(() => {
            // 防止刚开始渲染的时候触发多次
            this.$bus.$on('changeCurActiveObj', (obj) => {
              this.activeObj = obj;
            });
            if (this.$route.query.isApp === '1') {
              [this.activeObj] = this.configData[0].children;
            } else {
              [this.activeObj] = this.configData;
            }
          });
          this.clearDirty();
          return;
        }
      }
      // 是面板配置
      if (this.isPanel && !this.isSelect) {
        const data = await getSysDesignMenu({
          sysMenuDesignId: this.sysMenuDesignId
        });
        if (data && data.designOverallLayout) {
          this.configData = data.designOverallLayout;
          this.$nextTick(() => {
            // 防止刚开始渲染的时候触发多次
            this.$bus.$on('changeCurActiveObj', (obj) => {
              this.activeObj = obj;
            });
            if (this.$route.query.isApp === '1') {
              [this.activeObj] = this.configData[0].children;
            } else {
              [this.activeObj] = this.configData;
            }
          });
          this.clearDirty();
          return;
        }
      }
      // 是选择面板的
      if (this.isPanel && this.isSelect) {
        if (this.curDrawerType === 1) {
          this.configData = JSON.parse(JSON.stringify(selData));
        } else {
          const data = await getSysDesignMenu({
            sysMenuDesignId: this.sysMenuDesignId
          });
          this.configData = data.designOverallLayout;
        }
        // console.log(selData);
        this.$nextTick(() => {
          [, this.activeObj] = this.configData[0].children[0].children[0].children;
          this.activeObj.areaType = 1;
          if (this.curDrawerType === 1) {
            this.activeObj.compId = createUnique();
          }
          setTimeout(() => {
            // 防止刚开始渲染的时候触发多次
            this.$bus.$on('changeCurActiveObj', (obj) => {
              this.activeObj = obj;
            });
          }, 0);
          // 防止某些之前页面遗留的选中按钮区的问题
          if (this.$route.query.isApp === '1') {
            this.changeShowType(1);
          }
          // 如果是多表树列表切换的 改为多表树
          if (this.configData[0].selShowType === 5) {
            this.changeShowType(2);
          }
        });

        this.clearDirty();
        return;
      }
      // 防止刚开始渲染的时候触发多次
      this.$bus.$on('changeCurActiveObj', (obj) => {
        this.activeObj = obj;
      });
      this.activeObj.propertyCompName = 'PageLayout';
      if (this.$route.query.isApp === '1') {
        this.$nextTick(() => {
          [this.activeObj] = this.activeObj.children;
        });
      }
      // this.clearDirty();
    },
    // 获取完配置去除不存在的面板跟编码
    clearDirty() {
      // console.log(this.getAllcheck, this.configData[0].paneObj);
      // console.log(this.configData[0].dictArr);
      // 字典获取
      if (this.configData[0].dictArr.length) {
        this.$store.dispatch('getCurrentDict', this.configData[0].dictArr.join(','));
      }

      const paneKeys = Object.keys(this.configData[0].paneObj);
      paneKeys.forEach((compId) => {
        // 设备位置树的按钮
        if (!this.getAllcheck[compId] && !this.notDelPanelId.includes(compId)) {
          delete this.configData[0].paneObj[compId];
        }
      });
      if (this.configData[0].codeRuleList) {
        const { codeRuleList } = this.configData[0];
        const len = codeRuleList.length;
        // 不存在的规则，如果标记不是3则标记为3让数据库删除，标记为3说明数据库已经删除，则前端删除，如果存在，刚进来的时候同意标记为4 未改变
        for (let i = len - 1; i >= 0; i -= 1) {
          const rule = codeRuleList[i];
          // rule.sysMenuDesignId = this.sysMenuDesignId;
          if (!this.getAllcheck[rule.compId]) {
            if (rule.operationType !== 3) {
              rule.operationType = 3;
            } else {
              this.configData[0].codeRuleList.splice(i, 1);
            }
          } else {
            rule.operationType = 4;
          }
        }
      }
    },
    // 保存设计
    async saveLayout(flag) {
      try {
        const res = this.checkDataSource();
        if (!res.flag) {
          this.$message({
            type: 'warning',
            message: res.msg
          });
          return Promise.reject();
        }
        const a = {
          id: this.isPanel ? this.sysMenuDesignId : this.$route.query.id,
          designOverallLayout: this.configData
        };
        const params = {
          jsonString: JSON.stringify(a)
        };
        await saveLayout(params);
        if (flag === 1) {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    replaceChildren(area) {
      const arr = [];
      area.children[1].backChildren = area.children[1].children;
      area.children[1].backChildren.forEach((item) => {
        if (
          area.tableInfo.nameAlias === item.dataSource.alias ||
          item.dataSource.columnName === 'id'
        ) {
          const comp = JSON.parse(JSON.stringify(item));
          comp.dataSource.alias = '';
          comp.dataSource.tableName = area.tableInfo.tableName;
          comp.dataSource.relateName = '主表';
          arr.push(comp);
        }
      });
      area.children[1].children = arr;
    },
    async saveSelConfig() {
      try {
        const res = this.checkDataSource();
        if (!res.flag) {
          this.$message({
            type: 'warning',
            message: res.msg
          });
          return Promise.reject();
        }
        const data = await this.$refs.selDataPanle.submitSel();
        if (!data.sysMenuDesignId) {
          return;
        }
        // 确保默认的是列表
        const configData = JSON.parse(JSON.stringify(this.configData));
        const area = configData[0].children[0].children[0].children[1];
        if (this.configData[0].selShowType !== 4 && this.configData[0].selShowType !== 2) {
          if (this.$route.query.isApp === '1') {
            area.compType = 1002;
            area.compName = 'CardMain';
            area.propertyCompName = 'CardMainConfig';
          } else {
            area.compType = 1001;
            area.compName = 'TableMain';
            area.propertyCompName = 'TableMainConfig';
          }
          if (this.configData[0].selShowType === 5) {
            area.tableInfo = area.multiDataSource[area.multiDataSource.length - 1].tableInfo;
            this.replaceChildren(area);
          }
        }
        const a = {
          id: data.sysMenuDesignId,
          designOverallLayout: configData
        };
        const params = {
          jsonString: JSON.stringify(a)
        };
        await saveLayout(params);
        this.$emit('saveSuccess');
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 校验数据源
    checkDataSource() {
      // console.log(this.getAllcheck);
      const keys = Object.keys(this.getAllcheck);
      const { length } = keys;
      const checkObj = {
        flag: true,
        msg: ''
      };
      for (let i = 0; i < length; i += 1) {
        const tempObj = this.getAllcheck[keys[i]];
        switch (tempObj.compType) {
          case 'AREA':
            if (tempObj.compName === 'BtnsArea' || tempObj.compName === 'RelatedData') {
              break;
            }
            if (tempObj.compName === 'MultiTree') {
              break;
            }
            if (tempObj.compName === 'QueryMain') {
              break;
            }
            if (!tempObj.tableInfo.tableName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未配置数据源`;
              break;
            }
            if (tempObj.relateTableArr && tempObj.relateTableArr.length) {
              tempObj.relateTableArr.forEach((item) => {
                item.conditionArr.forEach((condition) => {
                  // console.log(condition);
                  condition.forEach((obj) => {
                    if (checkObj.flag) {
                      if (obj.secondIsValue) {
                        // 固定值 第一行表名 字段名 固定值 都有才通过
                        if (
                          !(
                            obj.firstLineTable.tableName &&
                            obj.firstLineColumn.columnName &&
                            obj.secondLineValue
                          )
                        ) {
                          checkObj.flag = false;
                          checkObj.msg = `${item.relateName} 未配置完全`;
                        }
                      } else if (
                        !(
                          obj.firstLineTable.tableName &&
                          obj.firstLineColumn.columnName &&
                          obj.secondLineTable.tableName &&
                          obj.secondLineColumn.columnName
                        )
                      ) {
                        checkObj.flag = false;
                        checkObj.msg = `${item.relateName} 未配置完全`;
                      }
                    }
                  });
                });
              });
            }
            break;
          case 1:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 14:
          case 17:
          case 21:
          case 22:
          case 23:
          case 24:
            // if (tempObj.canQuery && !tempObj.fieldName) {
            //   checkObj.flag = false;
            //   checkObj.msg = `${tempObj.name} 未填写字段`;
            //   break;
            // } else
            if (tempObj.dataSource.tableName && !tempObj.dataSource.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字段`;
              break;
            }
            break;
          case 25: {
            if (tempObj.dataSource.tableName && !tempObj.dataSource.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字段`;
              break;
            }
            const obj = tempObj.cascadeDataSource.find((data, index) => {
              if (index !== 0) {
                if (!data.relateColumn.columnName) {
                  return true;
                }
              }
              if (!data.tableInfo.tableName) {
                return true;
              }
              if (!data.showColumn.columnName) {
                return true;
              }
              return false;
            });
            if (obj) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 数据来源未配置完全`;
            }
            break;
          }
          case 2:
          case 3:
          case 4:
            // if (tempObj.canQuery && !tempObj.fieldName) {
            //   checkObj.flag = false;
            //   checkObj.msg = `${tempObj.name} 未填写字段`;
            //   break;
            // }
            if (tempObj.dataSource.tableName && !tempObj.dataSource.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字段`;
              break;
            }
            if (!tempObj.dataSource.dictObj) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字典`;
              break;
            }
            break;
          case 6:
            // if (tempObj.canQuery && !tempObj.fieldName) {
            //   checkObj.flag = false;
            //   checkObj.msg = `${tempObj.name} 未填写字段`;
            //   break;
            // }
            if (tempObj.canQuery && !tempObj.tableInfo.tableName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择业务表`;
              break;
            }
            if (!tempObj.dataSource.relateName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择关系`;
              break;
            }
            if (!tempObj.dataSource.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字段`;
              break;
            }
            break;
          case 7:
            // if (tempObj.canQuery && !tempObj.fieldName) {
            //   checkObj.flag = false;
            //   checkObj.msg = `${tempObj.name} 未填写字段`;
            //   break;
            // }
            if (tempObj.canQuery && !tempObj.tableInfo.tableName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择业务表`;
              break;
            }
            if (!tempObj.dataSource.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字段`;
              break;
            }
            if (!tempObj.multiTable.table.tableName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择多选字段来源表`;
              break;
            }
            if (!tempObj.multiTable.column.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择多选字段来源字段`;
              break;
            }
            break;
          case 5:
            if (tempObj.templateInfo && !tempObj.templateInfo.id && tempObj.buttonType === 7) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择导入模板`;
              break;
            }
            if (
              (tempObj.templateInfo &&
                !tempObj.templateInfo.id &&
                tempObj.buttonType === 8 &&
                tempObj.exportSetting === 1) ||
              (tempObj.templateInfo &&
                !tempObj.templateInfo.id &&
                tempObj.buttonType === 8 &&
                tempObj.exportSetting === 2)
            ) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择导出模板`;
              break;
            }
            if (tempObj.buttonType === 14) {
              // eslint-disable-next-line no-unused-vars
              const {
                layeredStrategy = '',
                fileColumns = [],
                downLoadType = null,
                downloadName = ''
              } = tempObj;
              if (!layeredStrategy || layeredStrategy === '[]') {
                checkObj.flag = false;
                checkObj.msg = `${tempObj.name} 未配置文件层级`;
                break;
              }
              if (!downloadName) {
                checkObj.flag = false;
                checkObj.msg = `${tempObj.name} 未配置导出文件名称`;
                break;
              }
              if (!downLoadType) {
                checkObj.flag = false;
                checkObj.msg = `${tempObj.name} 未配置下载数据类型`;
                break;
              }
              if ([1, 2].includes(downLoadType) && fileColumns && !fileColumns.length) {
                checkObj.flag = false;
                checkObj.msg = `${tempObj.name} 未配置业务文件字段`;
                break;
              }
            }
            break;
          case 15:
            if (!tempObj.dataSource.relateName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择关系`;
              break;
            }
            if (!tempObj.dataSource.columnName) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择字段`;
              break;
            }
            if (tempObj.enableMultiColumn) {
              if (tempObj.enableDict) {
                if (!tempObj.dataSource.dictObj) {
                  checkObj.flag = false;
                  checkObj.msg = `${tempObj.name} 未选择字典`;
                  break;
                }
              } else {
                if (!tempObj.multiTable.table.tableName) {
                  checkObj.flag = false;
                  checkObj.msg = `${tempObj.name} 未选择多选字段来源表`;
                  break;
                }
                if (!tempObj.multiTable.column.columnName) {
                  checkObj.flag = false;
                  checkObj.msg = `${tempObj.name} 未选择多选字段来源字段`;
                  break;
                }
              }
            } else if (tempObj.enableDict) {
              if (!tempObj.dataSource.dictObj) {
                checkObj.flag = false;
                checkObj.msg = `${tempObj.name} 未选择字典`;
                break;
              }
            }

            break;
          case 27:
            console.log(tempObj);
            if (!tempObj.relateDateId) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未选择关联组件`;
              break;
            }
            if (tempObj.dataSource.stepsArr && !tempObj.dataSource.stepsArr.length) {
              checkObj.flag = false;
              checkObj.msg = `${tempObj.name} 未添加步骤条数据`;
              break;
            }
            break;
          default:
        }
        if (!checkObj.flag) {
          break;
        }
      }
      return checkObj;
    },
    // 配置触发器的组件
    async getDesignTriggersLinkDiagram() {
      const data = await getDesignTriggersLinkDiagram({
        sysMenuDesignId: this.isPanel ? this.sysMenuDesignId : this.$route.query.id
      });
      this.hasTriggerCompOnly = {};
      if (data.compList) {
        data.compList.forEach((item) => {
          if (!this.hasTriggerCompOnly[item.compId]) {
            this.hasTriggerCompOnly[item.compId] = {
              msg: '该组件存在触发器配置，请先删除或更改该触发器',
              ...item
            };
          }
        });
      }
    },
    // 处理过滤条件组件
    resolveFilterTerm() {
      this.hasFilterCompOnly = {};
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        // 处理过滤条件
        if (this.getAllcheck[key].compType === 'AREA') {
          const comp = this.getAllcheck[key];
          const reg = /\$([A-Za-z0-9]{6})\$/g;
          const arr1 = comp.filterTermSql ? comp.filterTermSql.match(reg) || [] : [];
          const arr2 = comp.filterTermStr ? comp.filterTermStr.match(reg) || [] : [];
          const arr = arr1.concat(arr2);
          arr.forEach((str) => {
            this.hasFilterCompOnly[str.slice(1, -1)] = {
              compName: comp.name,
              compType: comp.compType,
              compPath: comp.compPath,
              msg: '该组件存在过滤条件配置，请先删除或更改该过滤条件'
            };
          });
        }
      });
    },
    // 关闭面板设计
    closePanle() {
      this.$emit('closePanle');
    },

    changeType(v) {
      const area = this.configData[0].children[0].children[0].children[1];
      // console.log(v, area);
      if (v === 1 || v === 3) {
        if (this.$route.query.isApp === '1') {
          area.compType = 1002;
          area.compName = 'CardMain';
          area.propertyCompName = 'CardMainConfig';
        } else {
          area.compType = 1001;
          area.compName = 'TableMain';
          area.propertyCompName = 'TableMainConfig';
        }
        area.isTree = false;
      }
      if (v === 3) {
        area.isTree = true;
      }
      if (v === 2) {
        area.compType = 1003;
        area.compName = 'TreeMain';
        area.propertyCompName = 'TreeMainConfig';
        area.isTree = true;
      }
      if (v === 4 || v === 5) {
        area.compType = 1007;
        area.compName = 'MultiTree';
        area.propertyCompName = 'MultiTreeConfig';
        area.isTree = true;
      }
      // 重置子节点
      area.tableInfo = {
        id: 0,
        nameAlias: '',
        tableName: ''
      };
      area.children[1].children.splice(1, area.children[1].children.length - 1);
      area.form = {};
      area.form[area.children[1].children[0].compId] = '';
      if (v === 4 || v === 5) {
        const dataTypeCompId = createUnique();
        area.children[1].children.push({
          areaType: 1,
          backName: 'label控件',
          canReadonly: false,
          canShow: true,
          compId: dataTypeCompId,
          compName: 'Label',
          compType: 15,
          dataSource: {
            alias: '',
            columnName: 'dataType',
            columnTypeDict: 1,
            dictObj: null,
            mainColumnInfo: null,
            relateName: '主表',
            tableName: ''
          },
          labelNotChange: true,
          dragCard: true,
          enableDict: false,
          enableDictIcon: false,
          enableIcon: false,
          enableMultiColumn: false,
          font: { color: '#333333', size: 14, style: 1 },
          helpInfo: '',
          icon: { icon: '', color: '', imageUrl: '' },
          imgUrl: 'baseComp/Label.svg',
          labelBg: { color: '#ffffff', style: 0 },
          labelName: 'label',
          multiTable: {
            table: { tableName: '', id: '' },
            column: { columnName: '', id: '', columnTypeDict: 0 }
          },
          name: 'dataType',
          pane: { name: '', columnName: '', paramArr: [] },
          placeholder: '请选择数据',
          propertyCompName: 'LabelConfig',
          shouldRequired: true,
          showLabelTitle: true,
          showTreeText: false,
          singleStatus: 4,
          submitType: 1,
          width: '100%'
        });
        area.form[dataTypeCompId] = '';
      }
      this.activeObj = {};
      this.$nextTick(() => {
        this.activeObj = area;
      });
    },
    changeShowType(v) {
      const area = this.configData[0].children[0].children[0].children[1];
      if (v === 1) {
        if (this.$route.query.isApp === '1') {
          area.compType = 1002;
          area.compName = 'CardMain';
          area.propertyCompName = 'CardMainConfig';
        } else {
          area.compType = 1001;
          area.compName = 'TableMain';
          area.propertyCompName = 'TableMainConfig';
        }
        area.isTree = false;
      }
      if (v === 2) {
        if (this.configData[0].selShowType === 5) {
          area.compType = 1007;
          area.compName = 'MultiTree';
          area.propertyCompName = 'MultiTreeConfig';
          area.isTree = true;
          if (area.children[1].backChildren && area.children[1].backChildren.length) {
            area.children[1].children = area.children[1].backChildren;
          }
        } else {
          area.compType = 1003;
          area.compName = 'TreeMain';
          area.propertyCompName = 'TreeMainConfig';
          area.isTree = true;
        }
      }
      this.activeObj = {};
      this.$nextTick(() => {
        this.activeObj = area;
      });
    }
  },

  beforeDestroy() {
    this.$bus.$off('changeCurActiveObj');
    this.$bus.$off('changeDictArr');
    this.$bus.$off('changeHasTriggerComp');
    this.$bus.$off('addHasTriggerComp');
    this.$bus.$off('deletePanel');
  },
  watch: {
    configData: {
      handler(v) {
        if (!this.isPanel) {
          sessionStorage.configData = JSON.stringify(v);
        }
      },
      deep: true
    },
    'activeObj.compId': function () {
      this.showGlobal = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.pageConfig {
  height: 100%;
  background-color: #fff;
  &__header {
    display: flex;
    height: 46px;
    line-height: 46px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 2;
    &--left {
      box-sizing: border-box;
      flex: 0 0 48px;
      border-right: 1px solid #e9e9e9;
      text-align: center;
      .iconfont {
        font-size: 20px;
        color: #9b9b9b;
      }
    }
    &--center {
      position: relative;
      flex: 1;
      padding-left: 14px;
      font-weight: 500;
      color: #333333;
      font-size: 16px;
    }
    &--right {
      margin-left: auto;
      margin-right: 20px;
    }
  }
  &__wrapper {
    position: relative;
    height: calc(100% - 46px);
    display: flex;
    &--btnArr {
      position: absolute;
      z-index: 100;
      left: 44px;
      top: 38px;
      &.isApp {
        left: 50%;
        margin-left: -155px;
        top: 74px;
      }
    }
    &--left {
      height: 100%;
      flex: 0 0 280px;
    }
    &--center {
      position: relative;
      box-sizing: border-box;
      padding: 10px 10px 0;
      background-color: #f6f6f8;
      height: 100%;
      // flex: 1;
      width: calc(100% - 562px);
    }
    &--right {
      position: relative;
      height: 100%;
      flex: 0 0 280px;
      max-width: 280px;
    }
    &--globalBtn {
      position: absolute;
      top: 8px;
      right: -1px;
      width: 104px;
      height: 30px;
      line-height: 30px;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 100px 0px 0px 100px;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
}
.configModule {
  box-sizing: border-box;
  cursor: pointer;
  border: 1px solid transparent;
  background-color: #fff;
  height: 100%;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.12);
  &.isApp {
    position: absolute;
    height: auto;
    top: 20px;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 40px 20px 30px;
    width: 377px;
    background-color: #fff;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
    border-radius: 30px;
    .isApp__title {
      box-sizing: border-box;
      height: 54px;
      line-height: 54px;
      text-align: center;
      border: 1px solid #e9e9e9;
      border-bottom: 0;
    }
    ::v-deep {
      .fullScreen {
        padding: 0;
        height: calc(100% - 54px);
      }
    }
  }
}
</style>
