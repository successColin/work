<template>
  <div class="menu">
    <component
      v-if="
        show &&
        this.configDataArr[0] &&
        this.configDataArr[0].designOverallLayout
      "
      :key="this.configDataArr[0].id"
      :is="configData.compName"
      :showType="showType"
      :nodeConfig="nodeConfig"
      :configData.sync="configData"
    ></component>
    <el-skeleton
      :rows="14"
      animated
      v-if="!this.panelObj && showSkeleton"
      class="skeleton"
    >
      <template slot="template">
        <el-skeleton-item variant="p" style="width: 50%" />
        <el-skeleton-item variant="p" style="width: 40%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 70%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 80%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 30%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 40%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 90%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 20%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 30%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 70%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 80%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 30%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 40%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 90%" class="m-t-16" />
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { getDesignMenu, operationTriggers, selectList } from '@/api/menuConfig';
import parser from '@/utils/formula';
import { isExistInObj, createUnique, formatDate } from '@/utils/utils';

let getAllPaneBack = null;

export default {
  name: 'ApiotMenu',
  props: {
    showType: {
      type: Object,
      default() {
        return {};
      }
    },
    menuId: {
      type: Number
    },
    nodeConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    // 面板相关信息
    panelObj: {
      type: Object
    },
    // 数据选择框信息
    dataSelObj: {
      type: Object
    }
  },
  data() {
    return {
      configDataArr: [],
      configData: null,
      show: false,
      btnClickTriggerMap: null,
      sysMenuDesignId: '', // 当前设计组的id
      onlyFlag: '',
      notValueChange: false, // 不进行值变化
      notTabChange: false, // 不进行tab显示隐藏变化
      initComp: {},
      watchArr: [], // 值变化监听数组
      showSkeleton: true
    };
  },
  provide() {
    return {
      isConfig: false,
      resolveFormula: this.resolveFormula,
      getAllForm: this.getAllForm,
      findForm: this.findForm,
      getPanel: this.getPanel,
      getMenu: this.getMenu,
      getFatherPanel: this.getFatherPanel,
      sysMenuDesignId: this.getSysMenuDesignId,
      onlyFlag: this.getOnlyFlag,
      getSelData: this.getSelData,
      initSelData: this.initSelData,
      changeNotValueChange: this.changeNotValueChange,
      changeTabChange: this.changeTabChange,
      getIsMain: this.getIsMain,
      getInitComp: this.getInitComp,
      resolveTerm: this.resolveTerm,
      getNotInitArr: this.getNotInitArr,
      clickTrigger: this.clickTrigger,
      initStart: this.initStart,
      isSelect: false
    };
  },

  components: {},

  computed: {
    // 获取所有单位
    getAllPane() {
      const obj = {
        formObj: {},
        tabObj: {},
        compObj: {}
      };
      if (this.configData && this.configData.children.length) {
        this.configData.children.forEach((bigArea) => {
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj.tabObj[tab.compId] = tab;
              obj.tabObj[tab.compId].compType = 'TAB';
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj.compObj[comp.compId] = comp;
                      });
                    }
                  } else if (area.children.length) {
                    // obj[area.compId] = JSON.parse(JSON.stringify(area));
                    // obj[area.compId].compType = 'AREA';
                    area.children.forEach((smallArea) => {
                      if (smallArea.areaType === 1) {
                        // 代表功能区
                        obj.formObj[smallArea.compId] = smallArea;
                        // 父节点的id记录
                        obj.formObj[smallArea.compId].parentCompId = area.compId;
                      }
                      if (smallArea.children) {
                        smallArea.children.forEach((comp) => {
                          if (area.compName === 'TableMain') {
                            comp.isTable = true;
                          }
                          if (area.isTree) {
                            comp.isTree = true;
                          }
                          obj.compObj[comp.compId] = comp;
                          if (comp.children) {
                            comp.children.forEach((btn) => {
                              if (area.compName === 'TableMain') {
                                btn.isTable = true;
                              }
                              if (area.isTree) {
                                btn.isTree = true;
                              }
                              obj.compObj[btn.compId] = btn;
                            });
                          }
                        });
                      }
                    });
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
    // 处理所有值给后端
    getCompMap() {
      const keys = Object.keys(this.getAllPane.formObj);
      let obj = {};
      keys.forEach((key) => {
        obj = Object.assign(obj, this.getAllPane.formObj[key].form);
      });
      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].join();
        }
      });
      // 插入菜单id
      obj.MENU_ID = this.$route.params.id;
      obj.CUR_SELECTED_IDS = sessionStorage.__current__mulArr__id || '';
      return obj;
    },
    getAllReloadArea() {
      const keys = Object.keys(this.getAllPane.tabObj);
      const arr = [];
      if (keys.length) {
        keys.forEach((key) => {
          this.getAllPane.tabObj[key].children.forEach((area) => {
            if (area.reloadArea && area.reloadArea.length) {
              arr.push(...area.reloadArea);
            }
          });
        });
      }
      return arr;
    }
  },

  mounted() {
    this.getDesignMenu(this.$route.params.id);
    this.initFunc();
    // 生成唯一标识
    this.onlyFlag = createUnique();
    this.$bus.$on('btnTrigger', this.clickTrigger);
    this.$bus.$on('closePanel', this.closePanel);
    this.$bus.$on('setDataSel', this.setDataSel);
    this.$bus.$on('multiArrChange', this.multiArrChange);
    this.$bus.$on('changeShowSkeleton', this.changeShowSkeleton);
    if (!this.panelObj) {
      // 最多3秒 去除骨架屏
      setTimeout(() => {
        this.changeShowSkeleton();
      }, 3000);
    }
  },
  // beforeRouteUpdate(to, from, next) {
  //   next();
  //   this.show = false;
  //   this.getDesignMenu(to.params.id);
  // },
  beforeDestroy() {
    // 在最外层的数据上才销毁
    if (!this.panelObj) {
      this.$bus.$off('btnTrigger');
      this.$bus.$off('closePanel');
      this.$bus.$off('setDataSel');
      this.$bus.$off('multiArrChange');
      this.$bus.$off('reloadArea');
      this.$bus.$off('changeShowSkeleton');
    }
    // 取消值变化的监听
    this.watchArr.forEach((unWatch) => {
      if (unWatch) {
        unWatch();
      }
    });
    this.watchArr = [];
  },

  methods: {
    // 更改骨架屏状态
    changeShowSkeleton() {
      this.showSkeleton = false;
    },
    // 多选数组变化
    multiArrChange(onlyFlag, v, compIdMap) {
      if (this.onlyFlag === onlyFlag) {
        this.$emit('multiArrChange', v, compIdMap);
      }
    },
    // 关闭当前面板
    closePanel(onlyFlag) {
      if (this.onlyFlag === onlyFlag) {
        this.$emit('closePanle');
      }
    },
    // 数据选择框选择结果
    setDataSel(arr, onlyFlag) {
      if (this.onlyFlag === onlyFlag) {
        this.$emit('setDataSel', arr);
      }
    },
    // 初始化自定的方法
    initFunc() {
      parser.setFunction('GET_VAR', (params) => {
        if (params.length === 0) {
          return '';
        }
        return params[0];
      });
      // 数据选择框选择数据公式，只在影响控件里面有
      parser.setFunction('GET_SELDATA', (params) => {
        // 公式函数内部包裹必须定义外部变量，不然引用有问题
        if (!getAllPaneBack) {
          return '';
        }
        const comp = getAllPaneBack.compObj[params[0]];
        if (comp && comp.selData) {
          if (comp.compType === 6 || comp.compType === 7) {
            if (params.length === 4 || params.length === 5) {
              // 0 组件id 1 真实值 2 表名 3 显示值 4 关联字段
              const ids = [];
              comp.selData.forEach((data) => {
                // 第一项是值
                if (data[params[1]]) {
                  ids.push(data[params[1]]);
                }
              });
              if (ids.length) {
                const relateColumn = params[4] ? params[4] : 'id';
                const p = {
                  selectContent: params[3],
                  selectFrom: params[2],
                  selectWhere: `${params[2]}.${relateColumn} in (${ids.join(',')})`
                };
                return p;
              }
              return '';
            }
            const vArr = [];
            comp.selData.forEach((data) => {
              // 第一项是值
              if (data[params[1]]) {
                vArr.push(data[params[1]]);
              }
            });
            return vArr.join();
          }
        }
        return {
          error: 'error'
        };
      });
      parser.setFunction('BULK_ADD', (params) => {
        const arr = [];
        params.forEach((compId) => {
          const comp = getAllPaneBack.compObj[compId];
          if (comp) {
            arr.push(compId);
          }
        });
        arr.type = 1;
        return arr;
      });
      parser.setFunction('BULK_ONE_ADD', (params) => {
        const arr = [];
        params.forEach((compId) => {
          const comp = getAllPaneBack.compObj[compId];
          // if (comp && comp.compType === 7) {
          if (comp) {
            arr.push(compId);
          }
        });
        arr.type = 2;
        return arr;
      });
      parser.setFunction('GET_SHOW_VALUE', (params) => {
        const keys = Object.keys(getAllPaneBack.formObj);
        let obj = {};
        keys.forEach((key) => {
          obj = Object.assign(obj, getAllPaneBack.formObj[key].form);
        });
        Object.keys(obj).forEach((key) => {
          if (Array.isArray(obj[key])) {
            obj[key] = obj[key].join();
          }
        });
        return obj[`${params[0]}_`];
      });
      // GET_TABLE_VALUE
      parser.setFunction('GET_TABLE_VALUE', (params) => {
        const { formObj } = getAllPaneBack;
        const formId = Object.keys(formObj).find((key) => {
          if (Object.prototype.hasOwnProperty.call(formObj[key].form, params[0])) {
            return true;
          }
          return false;
        });
        let multiArr = [];
        this.$bus.$emit('getSelMultiArr', this.onlyFlag, formObj[formId].parentCompId, (arr) => {
          multiArr = arr;
        });
        if (multiArr.length) {
          const obj = multiArr[0];
          let flag = false;
          if (params.length === 2) {
            flag = params[1] === 2;
          }
          // 取显示值
          if (flag) {
            return obj[`${params[0]}_`];
          }
          return obj[`${params[0]}`];
        }
        return '';
      });

      parser.setFunction('GET_TIME_GAP', (params) => {
        const start = new Date(params[0]).getTime();
        const end = new Date(params[1]).getTime();
        if (!Number.isNaN(start) && !Number.isNaN(end)) {
          const dis = (end - start) / 1000; // 间隔为秒
          let res = 0;
          if (
            params[2] &&
            ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].includes(params[2])
          ) {
            switch (params[2]) {
              case 'seconds':
                res = dis;
                break;
              case 'minutes':
                res = dis / 60;
                break;
              case 'hours':
                res = dis / 60 / 60;
                break;
              case 'days':
                res = dis / 60 / 60 / 24;
                break;
              case 'weeks':
                res = dis / 60 / 60 / 24 / 7;
                break;
              case 'months':
                res = dis / 60 / 60 / 24 / 30;
                break;
              case 'years':
                res = dis / 60 / 60 / 24 / 365;
                break;
              default:
                res = dis / 60 / 60 / 24;
            }
          } else {
            res = dis / (1 * 24 * 3600);
          }
          return res.toFixed(1);
        }
        return '';
      });

      parser.setFunction('CREATE_UNIQUE', (params) => {
        const obj = {};
        [obj.compId] = params;
        obj.value = createUnique();
        if (params[1]) {
          [, obj.value] = params;
        }
        obj.type = 3;
        return obj;
      });

      parser.setFunction('GET_TABLE_IDS', (params) => {
        if (params.length !== 0) {
          return new Error('获取表格id集合公式无参数');
        }
        return sessionStorage.__current__mulArr__id || '';
      });

      parser.setFunction('GET_USER_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户公式无参数');
        }
        return this.$store.state.userCenter.userInfo.id;
      });
      parser.setFunction('GET_ORG_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.orgId;
      });
      parser.setFunction('GET_ROLES_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.roleIds;
      });
      parser.setFunction('GET_DATE', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return formatDate(new Date(), 'yyyy-MM-dd');
      });
      parser.setFunction('GET_DATETIME', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      });
      parser.setFunction('GET_YEAR', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getFullYear();
      });
      parser.setFunction('GET_MONTH', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getMonth();
      });
      parser.setFunction('GET_WEEK', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDay();
      });
      parser.setFunction('GET_DAY', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDate();
      });
      parser.setFunction('GET_TIMESTAMP', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getTime();
      });
      parser.setFunction('GET_MENU_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取菜单id公式无参数');
        }
        return this.$route.query.id;
      });
    },
    reduceData(list = [], parentNode = {}) {
      const { checkFormConfig = [] } = this.nodeConfig;
      if (!checkFormConfig.length) return;
      list.forEach((item) => {
        const { compId, children, name } = item;
        const index = checkFormConfig.findIndex((config) => config.compId === compId);
        if (index !== -1) {
          const config = checkFormConfig[index];
          // 如果流程配置中 和当前控件中都存在必填属性，将控件属性修改成配置的值
          if (isExistInObj(config, 'shouldRequired') && isExistInObj(item, 'shouldRequired')) {
            item.shouldRequired = config.shouldRequired;
            // 如果流程的必填属性是false的时候，将配置中的rules规则的require 改成false
            if (!config.shouldRequired) {
              const { rules = {} } = parentNode;
              const currentRule = rules[compId] || [];
              currentRule.forEach((ruleConfig) => {
                ruleConfig.required = false;
              });
            }
          }
          if (isExistInObj(config, 'shouldRequired') && isExistInObj(item, 'shouldRequired')) {
            item.shouldRequired = config.shouldRequired;
            // 如果流程中的配置，修改rules的必填属性
            const { rules = {} } = parentNode;
            const currentRule = rules[compId] || [];
            if (currentRule.length) {
              currentRule.forEach((ruleConfig) => {
                ruleConfig.required = config.shouldRequired;
              });
            } else if (rules[compId]) {
              rules[compId].push({
                flag: 'requiredRule',
                required: config.shouldRequired,
                message: `请输入${name}`,
                trigger: 'change'
              });
            } else {
              rules[compId] = [
                {
                  flag: 'requiredRule',
                  required: config.shouldRequired,
                  message: `请输入${name}`,
                  trigger: 'change'
                }
              ];
            }
          }
          if (isExistInObj(config, 'canEdit') && isExistInObj(item, 'singleStatus')) {
            if (config.canEdit) {
              item.singleStatus = 1;
            } else {
              item.singleStatus = 2;
            }
          }
          if (isExistInObj(config, 'canShow') && isExistInObj(item, 'singleStatus')) {
            if (config.canShow) {
              if (config.canEdit) {
                item.singleStatus = 1;
              } else {
                item.singleStatus = 2;
              }
            } else {
              item.singleStatus = 4;
            }
          }
          if (item.compName === 'FormButton' && isExistInObj(config, 'canShow')) {
            item.canShow = config.canShow;
          }
          if (item.compName === 'FormButton' && isExistInObj(config, 'canEdit')) {
            item.canReadonly = !config.canEdit;
          }
        }

        if (children && Array.isArray(children) && children.length) {
          this.reduceData(children, item);
        }
      });
    },
    // 获取所有设计
    async getDesignMenu(menuId) {
      let data = null;
      const isTrue =
        this.showType && JSON.stringify(this.showType) !== '{}' && this.showType.type === 'flow';
      if (this.panelObj && this.panelObj.id) {
        if (this.panelObj.pageConfig) {
          data = this.panelObj.pageConfig;
        } else {
          data = await getDesignMenu({ panelId: this.panelObj.id });
          if (isTrue && data.length && data[0].designOverallLayout) {
            const { children } = data[0].designOverallLayout[0];
            if (children && Array.isArray(children)) {
              this.reduceData(children, data[0].designOverallLayout[0]);
            }
          }
        }
      } else {
        data = await getDesignMenu({ sysMenuId: isTrue ? this.menuId : menuId });
        if (isTrue && data.length && data[0].designOverallLayout) {
          const { children } = data[0].designOverallLayout[0];
          if (children && Array.isArray(children)) {
            this.reduceData(children, data[0].designOverallLayout[0]);
          }
        }
      }
      // console.log(data);
      this.configDataArr = data;
      if (this.$store.state.userCenter.isSupAdmin) {
        await this.initPage(0);
      } else if (this.configDataArr.length > 1) {
        await this.initPage(1);
      } else {
        await this.initPage(0);
      }
      // 获取所有面板的信息
      setTimeout(() => {
        this.getAllPanel();
      }, 500);
    },
    async getAllPanel() {
      if (!this.configData) {
        return;
      }
      const panelKey = Object.keys(this.configData.paneObj);
      let paneIds = [];
      panelKey.forEach((key) => {
        if (this.configData.paneObj[key].id) {
          paneIds.push(this.configData.paneObj[key].id);
        }
      });
      paneIds = [...new Set(paneIds)];
      if (!paneIds.length) {
        return false;
      }
      const data = await getDesignMenu({ panelId: paneIds.join(',') });
      const isTrue =
        this.showType && JSON.stringify(this.showType) !== '{}' && this.showType.type === 'flow';
      if (isTrue && data.length) {
        data.forEach((dataObj) => {
          if (dataObj && dataObj.designOverallLayout) {
            const { children } = dataObj.designOverallLayout[0];
            if (children && Array.isArray(children)) {
              this.reduceData(children, data[0].designOverallLayout[0]);
            }
          }
        });
      }
      const obj = {};
      let dictArr = [];
      data.forEach((v) => {
        if (v.panelId) {
          obj[v.panelId] = v;
        }
        if (v.designOverallLayout[0].dictArr.length !== 0) {
          dictArr.push(...v.designOverallLayout[0].dictArr);
        }
      });
      dictArr = [...new Set(dictArr)];
      panelKey.forEach((key) => {
        this.configData.paneObj[key].pageConfig = [obj[this.configData.paneObj[key].id]];
      });
      if (dictArr.length !== 0) {
        this.$store.dispatch('getCurrentDict', dictArr.join());
      }
      // console.log(this.configData.paneObj);
    },
    // 初始化配置，默认第一个
    async initPage(i) {
      // console.log(this.configDataArr[i], 'zzzzzzzzz');
      if (this.configDataArr[i].designOverallLayout) {
        this.sysMenuDesignId = this.configDataArr[i].id;
        [this.configData] = this.configDataArr[i].designOverallLayout;
        if (this.configData.dictArr.length) {
          if (this.panelObj && this.panelObj.id) {
            // this.$store.dispatch('getCurrentDict', this.configData.dictArr.join());
          } else {
            await this.$store.dispatch('getCurrentDict', this.configData.dictArr.join());
          }
        }
      }

      // console.log(this.configData, 555555555);
      const { triggerMap } = this.configDataArr[i];
      this.triggerMap = triggerMap;

      if (triggerMap) {
        // 处理初始化 放到表单请求结束去处理，都会处理一遍
        if (triggerMap[1]) {
          await this.initStart();
        }
        // 处理值变化
        if (triggerMap[2]) {
          this.createWatchMap(triggerMap[2]);
        }
        // 按钮点击触发变化
        if (triggerMap[3]) {
          /* eslint-disable prefer-destructuring  */
          this.btnClickTriggerMap = triggerMap[3];
        }
      }
      // 初始化的数据加载完，渲染页面
      this.show = true;
    },
    // 找到组件对应的tab的form
    findForm(comp) {
      const { formObj } = this.getAllPane;
      const formId = Object.keys(formObj).find((key) => {
        if (comp && Object.prototype.hasOwnProperty.call(formObj[key].form, comp.compId)) {
          return true;
        }
        return false;
      });
      return formObj[formId];
    },
    // 获取值，当获取的值为数组时，转为，隔开的字符串
    getFormValue(value) {
      if (Array.isArray(value)) {
        return value.join();
      }
      return `${value}`;
    },
    // 处理值去设置
    resolveRes(v) {
      if (v) {
        const arr = v.split(',');
        arr.forEach((item, index) => {
          arr[index] = +item;
        });
        return arr;
      }
      return [];
    },
    // 处理条件
    resolveTerm(term, data) {
      if (!term) {
        return true;
      }
      const termObj = JSON.parse(term.replace(/\\/g, ''));
      if (termObj.termType === 1) {
        // console.log(termObj.termArr);
        // 表示外层 and 内层 or
        const res = termObj.termArr.findIndex((andTerm) => {
          const index = andTerm.findIndex((orTerm) => {
            const tab =
              data && Object.prototype.hasOwnProperty.call(data, orTerm.comp.compId)
                ? { form: data }
                : this.findForm(orTerm.comp);
            // console.log(tab);
            // 如果未找到该表单值，直接不通过
            if (!tab && orTerm.comp.isFormula !== 2) {
              return false;
            }
            // const curComp =
            let orTermRes = false;
            const { compId } = orTerm.comp;
            // 1 代表固定值 2 代表公式
            let beforeValue =
              orTerm.comp.isFormula === 2
                ? `${this.resolveFormula(true, orTerm.comp.name, data)}`
                : this.getFormValue(tab.form[compId]);
            const content = this.resolveFormula(orTerm.valueType === 2, orTerm.content, data);
            switch (orTerm.lambda) {
              case '=':
                orTermRes = beforeValue === `${content}`;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) === content;
                // }
                break;
              case '!=':
                // console.log(beforeValue, content, beforeValue !== `${content}`);
                orTermRes = beforeValue !== `${content}`;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) === content;
                // }
                break;
              case '>=':
                orTermRes = beforeValue >= content;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) >= content;
                // }
                break;
              case '<=':
                orTermRes = beforeValue <= content;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) <= content;
                // }
                break;
              case '>':
                orTermRes = beforeValue > content;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) > content;
                // }
                break;
              case '<':
                orTermRes = beforeValue < content;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) < content;
                // }
                break;
              case 'in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexIn = beforeValue.findIndex((v) => {
                  if (!contentArr.includes(v)) {
                    return true;
                  }
                  return false;
                });
                orTermRes = indexIn === -1;
                break;
              }
              case 'not in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexNotIn = contentArr.findIndex((v) => {
                  if (beforeValue.includes(v)) {
                    return true;
                  }
                  return false;
                });
                orTermRes = indexNotIn === -1;
                break;
              }
              default:
                break;
            }
            // 为true 则这一组or条件都为true，跳出
            if (orTermRes) {
              return true;
            }
            return false;
          });
          if (index === -1) {
            return true;
          }
          return false;
        });
        // 没值，说明and没有找到错误
        if (res === -1) {
          return true;
        }
        return false;
      }
      if (termObj.termType === 2) {
        // 表示外层 or 内层 and
        const res = termObj.termArr.findIndex((orTerm) => {
          const index = orTerm.findIndex((andTerm) => {
            const tab =
              data && Object.prototype.hasOwnProperty.call(data, orTerm.comp.compId)
                ? { form: data }
                : this.findForm(orTerm.comp);
            // 如果未找到该表单值，直接不通过
            if (!tab && andTerm.comp.isFormula !== 2) {
              return false;
            }
            let andTermRes = false;
            const { compId } = andTerm.comp;
            // 1 代表固定值 2 代表公式
            let beforeValue =
              andTerm.comp.isFormula === 2
                ? `${this.resolveFormula(true, andTerm.comp.name, data)}`
                : this.getFormValue(tab.form[compId]);
            const content = this.resolveFormula(andTerm.valueType === 2, andTerm.content, data);
            switch (andTerm.lambda) {
              case '=':
                andTermRes = beforeValue === `${content}`;
                // 有显示值，且条件跟值比较是false时，跟显示值进行比较
                // if (tab.form[`${compId}_`] && !andTermRes) {
                //   andTermRes = this.getFormValue(tab.form[`${compId}_`]) === content;
                // }
                break;
              case '!=':
                andTermRes = beforeValue !== `${content}`;
                // if (tab.form[`${compId}_`] && !orTermRes) {
                //   orTermRes = this.getFormValue(tab.form[`${compId}_`]) === content;
                // }
                break;
              case '>=':
                andTermRes = beforeValue >= content;
                // if (tab.form[`${compId}_`] && !andTermRes) {
                //   andTermRes = this.getFormValue(tab.form[`${compId}_`]) >= content;
                // }
                break;
              case '<=':
                andTermRes = beforeValue <= content;
                // if (tab.form[`${compId}_`] && !andTermRes) {
                //   andTermRes = this.getFormValue(tab.form[`${compId}_`]) <= content;
                // }
                break;
              case '>':
                andTermRes = beforeValue > content;
                // if (tab.form[`${compId}_`] && !andTermRes) {
                //   andTermRes = this.getFormValue(tab.form[`${compId}_`]) > content;
                // }
                break;
              case '<':
                andTermRes = beforeValue < content;
                // if (tab.form[`${compId}_`] && !andTermRes) {
                //   andTermRes = this.getFormValue(tab.form[`${compId}_`]) < content;
                // }
                break;
              case 'in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexIn = beforeValue.findIndex((v) => {
                  if (!contentArr.includes(v)) {
                    return true;
                  }
                  return false;
                });
                andTermRes = indexIn === -1;
                break;
              }
              case 'not in': {
                const contentArr = `${content}`.split(',');
                if (!Array.isArray(beforeValue)) {
                  beforeValue = beforeValue.split(',');
                }
                const indexNotIn = contentArr.findIndex((v) => {
                  if (beforeValue.includes(v)) {
                    return true;
                  }
                  return false;
                });
                andTermRes = indexNotIn === -1;
                break;
              }
              default:
                break;
            }
            // 为false 则这一组and条件都为false，跳出
            if (!andTermRes) {
              return true;
            }

            return false;
          });
          if (index === -1) {
            return true;
          }
          return false;
        });
        // 有值，说明or至少有一个条件正确
        if (res !== -1) {
          return true;
        }
        return false;
      }
    },
    // 处理公式
    resolveFormula(flag, formulaStr, data) {
      if (!flag) {
        // false 代表不是公式是固定值
        return formulaStr;
      }
      // 暂存组件
      getAllPaneBack = this.getAllPane;
      // // console.log(formulaStr);
      let formulaRes = formulaStr
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      // 数据选择框的替换
      formulaRes = formulaRes.replace(
        /GET_SELDATA\(\$([A-Za-z0-9]{6})\$(,['A-Za-z0-9_]+){1,4}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      // 批量新增数据替换
      formulaRes = formulaRes.replace(
        /BULK_ADD\(\$([A-Za-z0-9]{6})\$(,\$([A-Za-z0-9]{6})\$){0,}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      formulaRes = formulaRes.replace(
        /BULK_ONE_ADD\(\$([A-Za-z0-9]{6})\$(,\$([A-Za-z0-9]{6})\$){0,}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );
      // 获取数据选择框显示值，不是数据选择框返回空
      formulaRes = formulaRes.replace(/GET_SHOW_VALUE\(\$([A-Za-z0-9]{6})\$\)/g, (v) => {
        const str = v.replace(/\$/g, "'");
        return str;
      });
      // 获取表格选中列的该值
      formulaRes = formulaRes.replace(/GET_TABLE_VALUE\(\$([A-Za-z0-9]{6})\$\)(|,1|,2)/g, (v) => {
        const str = v.replace(/\$/g, "'");
        return str;
      });
      // 更改值
      formulaRes = formulaRes.replace(
        /CREATE_UNIQUE\(\$([A-Za-z0-9]{6})\$(,['A-Za-z0-9_]+){0,1}\)/g,
        (v) => {
          const str = v.replace(/\$/g, "'");
          return str;
        }
      );

      formulaRes = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );
      // console.log(formulaRes);
      let str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
        const form =
          data && Object.prototype.hasOwnProperty.call(data, v1)
            ? { form: data }
            : this.findForm({
              compId: v1
            });
        if (form && form.form[v1]) {
          const res = form.form[v1];
          return Number.isNaN(+res) ? `'${res}'` : res;
        }
        return '""';
      });
      // console.log(str);
      let res = parser.parse(str);
      // console.log(res);
      if (res.error) {
        str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // console.log(res);
      // 最终错误把字符串返回
      if (res.error) {
        return `${str}`;
      }
      return res.result;
    },
    // 处理影响数组
    resolveAfffetComp(action) {
      const termRes = this.resolveTerm(action.effectiveConditions);
      const affectingComponents = JSON.parse(action.affectingComponents.replace(/\\/g, ''));
      if (termRes) {
        affectingComponents.forEach(async (item) => {
          const comp = this.getAllPane.compObj[item.comp.compId];
          if (!comp) {
            return;
          }
          const { checkFormConfig = [] } = this.nodeConfig;
          let isTrue = false;
          if (this.showType && this.showType.type === 'flow') {
            const targetComp = checkFormConfig.find((Config) => Config.compId === comp.compId);
            if (targetComp && [1, 2, 5].includes(item.affectType)) {
              isTrue = true;
            }
          }
          if (isTrue) {
            // console.log('已经退出循环', comp);
            return;
          }
          // console.log(comp, 111);
          let tab = null;
          if (comp) {
            // console.log(item.affectType);
            switch (item.affectType) {
              case 1:
                // 显隐
                comp.canShow = item.canShow;
                break;
              case 2:
                // console.log(comp);
                // 只读
                comp.canReadonly = item.canReadonly;
                break;
              case 5:
                {
                  // console.log(comp, this.findForm(comp));
                  // 必填
                  const area = this.findForm(comp);
                  const ruleArr = area.rules[comp.compId];
                  // 必填
                  const ruleObj = {
                    flag: 'requiredRule',
                    required: true,
                    message: `${comp.name}不能为空`,
                    trigger: 'change'
                  };
                  if (ruleArr && ruleArr.length !== 0) {
                    const index = ruleArr.findIndex((v) => v.flag === 'requiredRule');
                    if (index === -1 && comp.shouldRequired) {
                      ruleArr.push(ruleObj);
                    }
                    if (index !== -1 && !item.canRequired) {
                      ruleArr.splice(index, 1);
                    }
                  } else if (item.canRequired) {
                    this.$set(area.rules, comp.compId, [ruleObj]);
                  }
                }

                break;
              case 3:
                // 固定值
                tab = this.findForm(comp);
                if (tab) {
                  let v = item.normalValue;
                  if (comp.compType === 2) {
                    if (comp.dropDownType === 1) {
                      v = +v;
                    } else {
                      v = this.resolveRes(v);
                    }
                  }
                  if ([3].includes(comp.compType)) {
                    v = +v;
                  }
                  if ([4].includes(comp.compType)) {
                    v = this.resolveRes(v);
                  }
                  tab.form[comp.compId] = v;
                }
                break;
              case 4: {
                // 公式
                tab = this.findForm(comp);
                // console.log(tab);
                if (tab) {
                  let v = this.resolveFormula(true, item.normalValue);
                  if (typeof v === 'object' && v.error) {
                    return;
                  }
                  // 显示值赋值
                  if (typeof v === 'object' && v.selectContent) {
                    const data = await selectList(v);
                    const showArr = [];
                    data.forEach((tempV) => {
                      if (tempV[v.selectContent]) {
                        showArr.push(tempV[v.selectContent]);
                      }
                    });
                    v = showArr.join();
                  }
                  if (comp.compType === 2) {
                    if (comp.dropDownType === 1) {
                      if (v !== '') {
                        v = +v;
                      }
                    } else {
                      v = this.resolveRes(v);
                    }
                  }
                  if ([3].includes(comp.compType)) {
                    if (v !== '') {
                      v = +v;
                    }
                  }
                  if ([4].includes(comp.compType)) {
                    v = this.resolveRes(v);
                  }
                  if ([6, 7, 15].includes(comp.compType)) {
                    if (v || v === '') {
                      if (v !== tab.form[comp.compId]) {
                        tab.form[comp.compId] = '';
                        tab.form[`${comp.compId}_`] = '';
                        this.$nextTick(() => {
                          tab.form[comp.compId] = v;
                        });
                        return;
                      }
                    }
                  }
                  tab.form[comp.compId] = v;
                }
                break;
              }

              default:
                break;
            }
          }
        });
      }
      affectingComponents.forEach((item) => {
        const comp = this.getAllPane.compObj[item.comp.compId];
        if (comp) {
          if (comp.isTable || comp.isTree) {
            if (!this.initComp[action.linkCode]) {
              this.initComp[action.linkCode] = {};
            }
            this.initComp[action.linkCode][action.id] = action;
          }
        }
      });
    },
    // 处理返回值 获取单个值
    resolveReturnValue(data, value) {
      const arr = value.split('.');
      let curValue = data;
      arr.forEach((v) => {
        const tempArr = v.split('[');
        const last = tempArr[tempArr.length - 1];
        if (last.indexOf(']') !== -1) {
          tempArr[tempArr.length - 1] = last.slice(0, -1);
        }
        tempArr.forEach((t) => {
          if (t) {
            curValue = curValue[t];
          }
        });
      });
      return `${curValue}`;
    },
    async resolveOtherApi(linkcode, actionArr) {
      // console.log(actionArr);
      const params = {
        triggerMap: {}
      };
      params.triggerMap[linkcode] = actionArr;
      // 传给后端触发器 CUR_SELECTED_IDS
      params.compMap = {
        ...this.getCompMap,
        CUR_SELECTED_IDS: sessionStorage.__current__mulArr__id || ''
      };
      const data = await operationTriggers(JSON.stringify(params));
      const lastAction = actionArr[actionArr.length - 1];
      const triggerId = lastAction.id;
      if (data[triggerId].code) {
        if (data[triggerId].code !== 200) {
          return this.$message({
            type: 'warning',
            message: `存储过程报错：${data[triggerId].message}`
          });
        }
      }
      // console.log(lastAction);
      if (lastAction.returnValue) {
        const returnValue = JSON.parse(lastAction.returnValue.replace(/\\/g, ''));
        const lastData = data[triggerId].data;
        // console.log(lastData, returnValue);
        if (lastData) {
          returnValue.forEach((v) => {
            const form = this.findForm(v.comp);
            if (form) {
              form.form[v.comp.compId] = this.resolveReturnValue(lastData, v.apiValue);
            }
          });
        }
      }
    },
    // 处理链路
    async resolveLink(data, key) {
      // console.log(data);
      // console.log(key);
      // 获取该触发组件下面的触发链路
      Object.keys(data[key]).forEach((linkcode) => {
        // 对链路做切割以前端触发器为起始
        const linkArr = [];
        data[key][linkcode].forEach((action) => {
          if (action.triggerType === 1 || linkArr.length === 0) {
            linkArr.push([action]);
          } else {
            const len = linkArr.length;
            linkArr[len - 1].push(action);
          }
        });
        // 执行每条链路的初始化过程
        linkArr.forEach(async (actionArr) => {
          // 判断第一个是否是前端触发器，是则触发，不是则判断该组是否只存在前端触发器，然后进行调用后端触发器
          if (actionArr[0].triggerType === 1) {
            this.resolveAfffetComp(actionArr[0]);
            if (actionArr.length !== 1) {
              await this.resolveOtherApi(linkcode, actionArr);
            }
          } else {
            await this.resolveOtherApi(linkcode, actionArr);
          }
        });
      });
    },
    // 初始化
    async initStart() {
      // 获取动作为初始化下面的触发组件
      if (this.triggerMap[1]) {
        Object.keys(this.triggerMap[1]).forEach(async (key) => {
          // console.log(data[key]);
          await this.resolveLink(this.triggerMap[1], key);
        });
      }
    },
    // 值变化
    createWatchMap(data) {
      // 获取动作为初始化下面的触发组件
      Object.keys(data).forEach((key) => {
        const form = this.findForm({ compId: key });
        if (form) {
          const comp = this.getAllPane.compObj[key];
          // console.log(comp.isTable);
          if (comp.isTable || comp.isTree) {
            this.resolveLink(data, key);
            return;
          }
          const unWatch = this.$watch(
            `getAllPane.formObj.${form.compId}.form.${key}`,
            (v) => {
              this.$nextTick(async () => {
                if (!this.notValueChange) {
                  if (v && !comp.selData) {
                    if (comp.compType === 6 || comp.compType === 7) {
                      let tableName = comp.dataSource.tableName;
                      if (comp.compType === 7) {
                        tableName = comp.multiTable.table.tableName;
                      }
                      const params = {
                        selectContent: '*',
                        selectFrom: tableName,
                        selectWhere: `${tableName}.id in (${v})`
                      };
                      const selData = await selectList(params);
                      comp.selData = selData;
                    }
                  }
                  getAllPaneBack = this.getAllPane;
                  this.resolveLink(data, key);
                }
              });
            },
            {
              immediate: true
            }
          );
          this.watchArr.push(unWatch);
        }
      });
    },
    // 点击触发
    async clickTrigger(btn, onlyFlag) {
      if (
        this.btnClickTriggerMap &&
        this.btnClickTriggerMap[btn.compId] &&
        this.onlyFlag === onlyFlag
      ) {
        // console.log(btn, this.btnClickTriggerMap);
        this.getCompMap.CREATE_FLOW_STATE = btn.flowType;
        await this.resolveLink(this.btnClickTriggerMap, btn.compId);
      }
    },
    // 获取全部值
    getAllForm() {
      return this.getCompMap;
    },
    // 获取面板相关数据
    getPanel() {
      return this.configData.paneObj;
    },
    // 获取菜单
    getMenu() {
      return this.configData.menuObj;
    },
    // 获取传递进来的相关面板信息
    getFatherPanel() {
      return this.panelObj;
    },
    // 获取当前设计组id
    getSysMenuDesignId() {
      return this.sysMenuDesignId;
    },
    // 获取唯一标识
    getOnlyFlag() {
      return this.onlyFlag;
    },
    // 设置数据选择框的值
    initSelData(name, value, obj) {
      this.dataSelObj.name = name;
      this.dataSelObj.value = value;
      this.dataSelObj.showInfo = obj;
    },
    // 获取数据选择框的值
    getSelData() {
      return this.dataSelObj;
    },
    // 改变notValueChange
    changeNotValueChange(v) {
      this.notValueChange = v;
    },
    // 是否触发tab显示隐藏
    changeTabChange(v) {
      this.notTabChange = v;
    },
    // 获取是主页还是弹窗
    getIsMain() {
      if (!this.panelObj) {
        return true;
      }
      return false;
    },
    // 获取初始化表格以及树的触发器
    getInitComp() {
      return this.initComp;
    },
    // 获取不需要初始化的数组
    getNotInitArr() {
      return this.getAllReloadArea;
    },
    replaceChildren(area) {
      const arr = [];
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
    // 树跟列表切换
    changeShowType(v) {
      const area = this.configData.children[0].children[0].children[1];
      // console.log(this.configData, this.panelObj);
      if (v === 1) {
        area.compType = 1001;
        area.compName = 'TableMain';
        area.propertyCompName = 'TableMainConfig';
        area.isTree = false;
        if (this.configData.selShowType === 5) {
          this.replaceChildren(area);
        }
      }
      if (v === 2) {
        if (this.configData.selShowType === 5) {
          area.compType = 1007;
          area.compName = 'MultiTree';
          area.propertyCompName = 'MultiTreeConfig';
          area.isTree = true;
          if (area.children[1].backChildren && area.children[1].backChildren.length) {
            area.children[1].children = area.children[1].backChildren;
          }
        } else if (this.panelObj.id === 3) {
          area.compType = 1004;
          area.compName = 'DevicePosTree';
          area.propertyCompName = 'DevicePosTreeConfig';
        } else {
          area.compType = 1003;
          area.compName = 'TreeMain';
          area.propertyCompName = 'TreeMainConfig';
        }

        area.isTree = true;
      }
    }
  },

  watch: {
    getCompMap: {
      handler() {
        if (!this.notTabChange) {
          // console.log(v);
          // 页面数据变化，引发tab的显示隐藏
          // 目前页面内部值变化不管
          // this.$bus.$emit('tabHidden', this.onlyFlag, v);
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.menu {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.skeleton {
  position: absolute;
  background-color: #fff;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0;
  z-index: 2000;
  ::v-deep {
    .el-skeleton__item {
      display: block;
    }
  }
}
</style>
