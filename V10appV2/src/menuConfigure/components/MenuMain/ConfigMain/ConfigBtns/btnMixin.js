import { batchDelete, batchSave, singleSave } from '@/api/menuConfig';
import { Encrypt } from '@/utils';

import gotoOtherPage from '../gotoOtherPage';

export default {
  inject: [
    'resolveFormula',
    'sysMenuDesignId',
    'getPanel',
    'getAllForm',
    'munuOnlyFlag',
    'getMenuPane',
    'onlyFlag',
    'getMenuFlag',
    'funcCheckObj',
    'clickTrigger',
    'getJumpMenu',
  ],

  mixins: [gotoOtherPage],

  props: {
    // 是否为tab按钮
    isTabBtn: {
      type: Boolean,
      default: false,
    },
    featureArr: {
      type: [Array, Object],
    },
    tabProp: {
      type: Object,
    },
  },

  data() {
    return {
      btnInfo: {},
      // 是否处于编辑状态
      canDesign: false,
      isAdd: false, // 是否为新增操作
      isBatch: false, // 是否批量操作
      isError: false, // 流程是否有错误
      isFromProcess: false, // 是否流程
    };
  },

  computed: {
    // tab区按钮需要考虑审批按钮
    // 如果有审批按钮必选是横向排布的
    btnSort() {
      const { appSort } = this.btnsProp;
      const { isProcess } = this.htmlConfig;

      let sort = appSort;
      if (isProcess) sort = 1;
      return sort;
    },
    // 按钮角度样式
    btnRadiusClass() {
      const { appRadius, appSort } = this.btnsProp;
      // 如果是横排的按钮，需要根据按钮的样式进行显示
      if (appSort === 2) return;
      if (+appRadius === 2) return 'fillet'; // 圆角
      if (+appRadius === 3) return ''; // 直角
      return 'oval'; // 椭圆
    },
    // 按钮的角度
    btnRadius() {
      const { btnRadiusClass } = this;
      if (btnRadiusClass === 'oval') return 'circle';
      if (btnRadiusClass === 'fillet') return 'square';
      return 'right';
    },
    // 跳转菜单
    jumpMenu() {
      const munuObj = this.getJumpMenu();
      if (!munuObj) return [];
      return munuObj[this.btnInfo.compId] || [];
    },
    // 区域内按钮
    btnArea() {
      const { isTabBtn, funcConfig } = this;
      if (isTabBtn) return '';
      const { children } = funcConfig;
      return children.find((item) => item.areaType === 2) || {};
    },
    // 按钮列表信息
    btnsProp() {
      const { tabProp, isTabBtn } = this;
      if (isTabBtn) return tabProp.children[0];
      return this.btnArea;
    },
    allComp() {
      return this.getMenuPane().compObj;
    },
    // 需要显示的按钮列表
    list() {
      const { btnsProp, allComp } = this;
      const { children: elements, appStyle } = btnsProp;
      return elements.filter((el) => {
        const { buttonStyle, compName } = el;
        if (compName !== 'SearchCondition') {
          if (appStyle === 1) {
            // 无主题
            el.iconColor = '#fff';
          } else if (appStyle === 3) {
            // 自定义颜色
            // 如果按钮样式为“纯文学按钮”背景为白色，如果为“次要按钮”背景为灰色
            if (buttonStyle === 'text') el.iconColor = '#fff';
            else if (buttonStyle === 'primary') {
              el.fontColor = '#fff';
            } else el.iconColor = '#F1F3F6';
          } else el.iconColor = '';
          if (el.iconColor === '#fff' || el.iconColor === '#F1F3F6') {
            el.fontColor = '';
            el.isTheme = true;
          } else el.fontColor = '#fff';
        }

        const comp = allComp[el.compId] || {};
        el = { ...el, ...comp };
        return el.canShow && el.compName !== 'SearchCondition';
      });
    },
    // 所有可以操作区域
    funcAreas() {
      const { tabId } = this;
      const { funcObj } = this.getMenuPane();
      const areas = funcObj[tabId];
      return areas.filter((area) => area.propertyCompName !== 'BtnsAreaConfig');
    },
    // tab 按钮保存的最终提交数组
    getResArr() {
      const { btnInfo, funcAreas } = this;
      const saveArr = btnInfo.saveAreaArr
        ? JSON.parse(btnInfo.saveAreaArr)
        : [];
      let resArr = [];
      saveArr.forEach((comp) => {
        const index = funcAreas.findIndex(
          (child) => child.compId === comp.compId,
        );
        if (index !== -1) {
          funcAreas[index].relation = [];
          comp.relation.forEach((relate) => {
            funcAreas[index].relation.push({
              columnName: relate.columnInfo.columnName,
              columnType: relate.columnInfo.columnTypeDict,
              relationTableName: relate.tableInfo.tableName,
            });
          });
          resArr.push(funcAreas[index]);
        }
      });
      // 执行顺序为空，则默认全部无参执行
      if (resArr.length === 0) {
        resArr = funcAreas;
      }
      return resArr;
    },
  },

  methods: {
    resolveHtml(html) {
      const reg = /<messageVar vartype=[$]([A-Za-z0-9]+)>[^<]{0,}<\/messageVar>/g;
      const formData = this.getAllForm();

      const str = html.replace(reg, (res, v) => {
        if (formData[v]) {
          return formData[v];
        }
        return '';
      });
      return this.$apiot.htmlReplace(str);
    },
    getDictStr(comp, columnValue) {
      const dictArr = this.$store.getters.getCurDict(
        comp.dataSource.dictObj.dictKey,
      );
      const obj = dictArr.find((item) => item.value === columnValue);
      if (obj) {
        return `${comp.name}:${obj.name}`;
      }
      return '';
    },
    getShowStr(comp, columnValue, form) {
      if (comp.enableDict && comp.dataSource.dictObj.dictKey) {
        const tempStr = this.getDictStr(comp, columnValue);
        return tempStr;
      }
      const v = form[`${comp.compId}_`];
      return `${comp.name}:${v}`;
    },
    // 遍历处理保存数据
    resolveSaveData(featureArr, area, data) {
      const form = data || featureArr.form;
      const arr = [
        'create_time',
        'create_user_id',
        'modify_time',
        'modify_user_id',
      ];
      const columnArr = [];
      const formInfo = [];
      formInfo.str = '';
      featureArr.children.forEach((comp) => {
        // 处理步骤条
        if (comp.compType === 27) {
          const columnValue1 =
            form[comp.compId] == null ? '' : form[comp.compId];
          const columnValue2 =
            form[comp.relateDateId] == null ? '' : form[comp.relateDateId];
          if (+columnValue1 !== +columnValue2) {
            formInfo.stepObject = {
              recordValue: columnValue2,
              compId: comp.compId,
              sysMenuDesignId: this.sysMenuDesignId(),
            };
          }
          return;
        }
        if (
          comp.submitType === 1 ||
          (comp.submitType === 2 && comp.singleStatus !== 4 && comp.canShow)
        ) {
          if (comp.compType === 15) {
            if (
              !['id', 'parent_id', 'position_id'].includes(
                comp.dataSource.columnName,
              )
            ) {
              return;
            }
          }
          // 去除修改系统字段的 并且 字段名不成重复
          if (!arr.includes(comp.dataSource.columnName)) {
            let columnValue =
              form[comp.compId] == null ? '' : form[comp.compId];
            if (Array.isArray(columnValue)) {
              columnValue = columnValue.join();
            }
            if (comp.compType === 8 && columnValue) {
              columnValue = this.$apiot.dateFormat(columnValue, 'yyyy-MM-dd');
            }
            if (comp.compType === 9 && columnValue) {
              columnValue = this.$apiot.dateFormat(
                columnValue,
                'yyyy-MM-dd hh:mm:ss',
              );
            }

            // 判断是否为新增
            if (comp.dataSource.columnName === 'id' && !data) {
              if (columnValue) {
                this.isAdd = false;
              } else {
                this.isAdd = true;
              }
            }
            if (
              comp.dataSource.columnName !== 'id' ||
              columnValue !== '' ||
              comp.compType === 17
            ) {
              let column = {
                columnName: comp.dataSource.columnName,
                columnType: comp.dataSource.columnType,
              };
              // 数据单选框 从关系里面拉取真正存的字段
              if (comp.compType === 6) {
                const relateName = comp.dataSource.relateName.split('(')[0];
                const index = area.relateTableArr.findIndex(
                  (relate) => relate.relateName === relateName,
                );
                if (index !== -1) {
                  const { firstLineColumn } = area.relateTableArr[
                    index
                  ].conditionArr[0][0];
                  column = {
                    columnName: firstLineColumn.columnName,
                    columnType: firstLineColumn.columnType,
                  };
                }
              }

              // 按钮是否启用操作日志
              if (
                this.btnInfo.enableLog &&
                this.btnInfo.logComp.includes(comp.compId)
              ) {
                let str = `${comp.name}:${columnValue}`;

                // 基础组件 不是只读 显示的组件 记录下操作
                if (
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(comp.compType) &&
                  !comp.canReadonly &&
                  comp.canShow
                ) {
                  if (
                    [2, 3, 4].includes(comp.compType) &&
                    comp.dataSource.dictObj.dictKey
                  ) {
                    const tempStr = this.getDictStr(comp, columnValue);
                    if (tempStr) {
                      str = tempStr;
                    }
                  }
                  if ([6, 7].includes(comp.compType)) {
                    const tempStr = this.getShowStr(comp, columnValue, form);
                    if (tempStr) {
                      str = tempStr;
                    }
                  }

                  formInfo.str += `${str},`;
                }
                if (
                  ['id', 'parent_id', 'position_id'].includes(
                    comp.dataSource.columnName,
                  )
                ) {
                  formInfo.str += `${str},`;
                }
              }

              if (!columnArr.includes(column.columnName)) {
                columnArr.push(column.columnName);
                formInfo.push({
                  columnName: column.columnName,
                  columnType: column.columnTypeDict,
                  columnValue,
                  compType: comp.compType,
                  compId: comp.compId,
                  sysMenuDesignId: this.sysMenuDesignId(),
                });
              } else {
                const index = formInfo.findIndex(
                  (v) => v.columnName === column.columnName,
                );
                formInfo[index] = {
                  columnName: column.columnName,
                  columnType: column.columnTypeDict,
                  columnValue,
                  compType: comp.compType,
                  compId: comp.compId,
                  sysMenuDesignId: this.sysMenuDesignId(),
                };
              }
            }
          }
        }
      });
      return formInfo;
    },
    // 表单区处理保存接口参数
    resolveParams() {
      const { funcConfig } = this;
      const menuId = this.getMenuFlag();
      const params = {
        formInfo: [],
        tableName: funcConfig.tableInfo.tableName,
        menuId,
        logData: {
          content: '',
          clientType: 'APP',
          curMenuId: menuId,
        },
      };
      params.formInfo = this.resolveSaveData(this.featureArr, funcConfig);

      const { userInfo } = this.$store.state.userCenter;
      let logContent = `${userInfo.username}(${userInfo.account}):`;
      if (params.formInfo.str) {
        const operate = this.isAdd ? '新增' : '编辑';
        logContent += `[${operate}表(${
          params.tableName
        })数据:${params.formInfo.str.slice(0, -1)}]`;
      }
      delete params.formInfo.str;
      params.logData.content = Encrypt(logContent);
      if (!this.btnInfo.enableLog || !this.btnInfo.logComp.length) {
        delete params.logData;
      }
      // 处理步骤条
      if (params.formInfo.stepObject) {
        params.stepInfo = params.formInfo.stepObject;
        delete params.formInfo.stepObject;
      }
      return params;
    },
    // 表单区 批量保存接口
    resolveFormParams(area) {
      const params = {
        listInfo: [[]],
        // removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName,
        logStr: [],
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      params.listInfo[0] = this.resolveSaveData(feature, area);
      if (params.listInfo[0].str) {
        params.logStr.push(params.listInfo[0].str.slice(0, -1));
      }
      delete params.listInfo[0].str;
      params.isAdd = this.isAdd;

      // 处理步骤条
      if (params.listInfo[0].stepObject) {
        params.stepObject = params.listInfo[0].stepObject;
        delete params.listInfo[0].stepObject;
      }
      return params;
    },

    async handleClick(e, type) {
      console.log('handleClick=====', e, type);
      if (!e) return;
      this.btnInfo = { ...e };
      let { buttonType } = e;
      // 是否为审批按钮
      if (e.isProcess) {
        this.processClick();
        if (this.$refs.btnsRow) this.$refs.btnsRow.setLoading(e.compId, false);
        return;
      }
      if (this.htmlConfig.isPreview && [3, 5].indexOf(buttonType) === -1) {
        if (this.$refs.btnsRow) {
          this.$refs.btnsRow.setLoading(e.compId, false);
        }
        // 如果在预览模式下，除新增、普通按钮，其他按钮都不走逻辑
        await this.$refs.apiotModal.showAsyncModal({
          content: '预览模式下，除新增、普通按钮，其他按钮不可操作！',
        });
        return false;
      }

      try {
        const { propertyCompName } = this.funcConfig;
        const { compId, beforeSubmit, afterSubmit, name, refreshType } = e;

        // 点击按钮前需要做的校验
        const index = this.btnInfo.ruleArr.findIndex((rule) => {
          const res = this.resolveFormula(true, rule.content);
          if (res) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          const msg =
            this.btnInfo.ruleArr[index].ruleTip ||
            `按钮第${index}条规则校验失败`;
          this.isLoading = false;
          this.$refs.uToast.show({
            type: 'warning',
            message: msg,
          });
          if (this.$refs.btnsRow) {
            this.$refs.btnsRow.setLoading(e.compId, false);
          }

          return;
        }

        // 为了兼容批量操作的逻辑，在批量操作中按确定按钮，是走正常的操作逻辑，例如批量删除走删除逻辑
        if (type) buttonType = type;
        // 批量操作
        if (buttonType === 9 || buttonType === 10) {
          if (this.$refs.btnsRow) {
            this.$refs.btnsRow.setLoading(e.compId, false);
          }
          this.batchBtnClick();
          return false;
        }

        // 保存按钮做校验
        if (buttonType === 1) {
          if (propertyCompName === 'MenuMainConfig') {
            const menuMain = this.getMenuMain();
            await menuMain.$refs.configForm.validate();
          }
          if (this.isTabBtn) {
            await this.validateSave();
          }
        }
        // 提交前提示
        if (beforeSubmit.type === 2) {
          await this.$refs.apiotModal.showAsyncModal({
            content: `是否${name}`,
          });
        }

        if (beforeSubmit.type === 3) {
          await this.$refs.apiotModal.showAsyncModal({
            content: this.resolveHtml(beforeSubmit.html),
          });
        }

        if (buttonType === 1) {
          await this.singleSave();
        } else if (buttonType === 2) {
          await this.batchDelete();
        } else if (buttonType === 3 || buttonType === 4 || buttonType === 5) {
          // 新增、编辑、普通、打印
          this.jumpOther();
        } else if (buttonType === 6) {
          // 确定数据
          this.dataSelect();
        } else if (buttonType === 15) {
          if (this.$refs.btnsRow) {
            this.$refs.btnsRow.setLoading(e.compId, false);
          }
          this.batchPrintBtnClick();
          if (this.isBatch) {
            // 打印按钮
            const sourceFlagId = `${compId}_${this._uid}`;

            let area = null;
            if (this.isTabBtn) {
              const { deleteArea } = this.btnInfo;
              area = this.getFuncAreas(deleteArea);
            } else {
              area = this.funcConfig;
            }
            const data = this.funcCheckObj()[area.compId];

            // 获取id组件 compId
            const funcArea =
              area?.children.find((item) => item.areaType === 1) || [];
            const funcAreaId = funcArea?.children.find(
              (item) => item.name === 'id',
            )?.compId;

            // 根据data 和 compId 拿到ids
            const ids = data.map((item) => item[funcAreaId]);

            // url 地址 和 传递参数
            const { outerLink } = this.btnInfo;
            const urlParams = {
              ids: ids.join(','),
            };
            this.$store.commit('setJumpMenuFilter', {
              sourceFlagId,
              data: { outerLink, urlParams },
            });
            // 跳转
            uni.navigateTo({
              url: `/PagesPrint/index?flag=${sourceFlagId}&isOuterLink=1`,
              animationType: 'slide-in-right',
            });
            this.isBatch = false;
          }
        }
        if (this.htmlConfig.isPreview) {
          // 如果在预览模式下，不进行后端触发器逻辑
          this.$refs.btnsRow.setLoading(e.compId, false);
          this.refreshTypeEvent(refreshType, compId);
          return false;
        }
        // 后端触发器
        await this.clickTrigger(this.btnInfo, this.onlyFlag());
        // 成功后提示
        // 默认提示

        if (this.isFromProcess) return;
        if (afterSubmit.type === 2) {
          this.$refs.uToast.show({
            type: 'success',
            message: `${name}成功`,
          });
          setTimeout(() => {
            this.refreshTypeEvent(refreshType, compId);
          }, 500);
        } else if (afterSubmit.type === 3) {
          // 自定义提示
          await this.$refs.apiotModal
            .showAsyncModal({
              content: this.resolveHtml(afterSubmit.html),
            })
            .finally(() => {
              setTimeout(() => {
                this.refreshTypeEvent(refreshType, compId);
              }, 300);
            });
        } else {
          // 为了兼容后端触发器
          setTimeout(() => {
            this.refreshTypeEvent(refreshType, compId);
          }, 300);
        }
      } catch (error) {
        this.isError = true;
        console.error(error);
        if (error && !Array.isArray(error) && !error.cancel) {
          uni.$u.toast('其它错误');
        }
        if (this.$refs.btnsRow) this.$refs.btnsRow.setLoading(e.compId, false);
        // this.$refs.btnsRow.setLoading(e.compId, false);
      }
    },
    // 刷新事件
    refreshTypeEvent(refreshType, compId) {
      if (this.$refs.btnsRow) this.$refs.btnsRow.setLoading(compId, false);
      // 成功后刷新逻辑
      // eslint-disable-next-line no-undef
      const pages = getCurrentPages(); // 当前页面

      let currentPage = pages[pages.length - 1];
      let beforePage = pages[pages.length - 2]; // 上一页
      // #ifdef APP-PLUS || MP
      currentPage = currentPage.$vm;
      beforePage = beforePage.$vm;
      // #endif
      if (refreshType === 1) {
        currentPage.forceUpdate(); // 刷新当前页
      } else if (refreshType === 2) {
        // 弹出关闭当前页
        if (!this.htmlConfig.isEject) uni.navigateBack();
        else this.$bus.$emit(`closePanel_${this.htmlConfig.sourceFlagId}`);
      } else if (refreshType === 3) {
        uni.navigateBack({
          animationType: 'fade-out',
          animationDuration: 500,
          success() {
            // 如果上一页是工作台
            if (beforePage.pageType !== 'home') beforePage.forceUpdate(); // 关闭当前页并刷新上一页
          },
        });
      } else if (refreshType === 4) {
        const menu = this.munuOnlyFlag();
        // 刷新菜单
        // 当前界面就是菜单，则刷新本菜单
        if (currentPage._uid === menu) {
          currentPage.forceUpdate();
          return;
        }
        const menuPageIndex = pages.findIndex((page) => {
          // #ifdef APP-PLUS || MP
          page = page.$vm;
          // #endif
          return page._uid === menu;
        });
        if (menuPageIndex !== -1) {
          const currentIndex = pages.length - 1;
          const backPageIndex = currentIndex - menuPageIndex;
          let menuPage = pages[menuPageIndex];
          // #ifdef APP-PLUS || MP
          menuPage = menuPage.$vm;
          // #endif
          uni.navigateBack({
            animationType: 'fade-out',
            animationDuration: 500,
            delta: backPageIndex,
            success() {
              // 如果上一页是工作台
              if (menuPage.pageType !== 'home') menuPage.forceUpdate(); // 刷新菜单
            },
          });
        }
      } else if (refreshType === 5) {
        // 刷新当前区域，只有功能区按钮才会有这个动作
        currentPage.forceUpdate(this.btnInfo.compId);
      } else if (refreshType === 8) {
        // 刷新上一页
        if (beforePage.pageType !== 'home') beforePage.forceUpdate(8);
      }
    },
    // 跳转到其他界面：面板、菜单、外部链接
    jumpOther() {
      const { relateType, compId, buttonType, textPanelId } = this.btnInfo;
      const formData = this.getAllForm();
      const sourceFlagId = `${compId}_${this._uid}`;
      if (relateType === 1) {
        // 跳转面板
        const urlParams = {
          parentCompId: compId,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          menuFlag: this.getMenuFlag(),
        };
        if (buttonType === 3) {
          urlParams.isAdd = true;
        }
        this.panelFormat({
          compId,
          sourceFlagId,
          textPanelId,
          urlParams,
          formData,
          canJump: true,
        });
      } else if (relateType === 3) {
        const { outerLink, paramsArr = [] } = this.btnInfo;
        this.gotoWebView({ outerLink, paramsArr, sourceFlagId, formData }); // 跳转地址
      } else {
        // 跳转菜单
        const { jumpMenu } = this;
        this.gotoMenu({
          jumpMenu,
          formData,
          sourceFlagId,
        });
      }
    },
    // 打印批量操作
    async batchPrintBtnClick() {
      try {
        let area = null;
        if (this.isTabBtn) {
          const { deleteArea } = this.btnInfo;
          const areas = this.getFuncAreas(deleteArea);
          // eslint-disable-next-line prefer-destructuring
          if (deleteArea) area = areas;
        } else {
          area = this.funcConfig;
        }
        if (!area) {
          this.$refs.uToast.show({
            type: 'error',
            message: '请联系管理员配置操作区域',
          });
          return;
        }
        // 如果需要删除的区域不是卡片区，跳出提醒
        if (area.propertyCompName !== 'CardMainConfig') {
          await this.$refs.apiotModal.showAsyncModal({
            content: '表单区不能配置打印按钮',
          });
          return false;
        }

        this.canDesign = true;
        this.$emit('setBatchArea', area.compId);
      } catch (error) {
        console.error(error);
      }
    },
    // 批量按钮点击
    async batchBtnClick() {
      try {
        let area = null;
        if (this.isTabBtn) {
          const { deleteArea } = this.btnInfo;
          const areas = this.getFuncAreas(deleteArea);
          // eslint-disable-next-line prefer-destructuring
          if (deleteArea) area = areas;
        } else {
          area = this.funcConfig;
        }
        if (!area) {
          this.$refs.uToast.show({
            type: 'error',
            message: '请联系管理员配置操作区域',
          });
          return;
        }
        // 如果需要删除的区域不是卡片区，跳出提醒
        if (area.propertyCompName !== 'CardMainConfig') {
          await this.$refs.apiotModal.showAsyncModal({
            content: '表单区不能配置批量按钮',
          });
          return false;
        }

        this.canDesign = true;
        this.$emit('setBatchArea', area.compId);
      } catch (error) {
        console.error(error);
      }
    },
    batchCancel() {
      this.canDesign = false;
      this.$emit('setBatchArea', '', 'cancel');
    },
    async batchSure() {
      let area = null;
      if (this.isTabBtn) {
        const { deleteArea } = this.btnInfo;
        area = this.getFuncAreas(deleteArea);
      } else {
        area = this.funcConfig;
      }
      const data = this.funcCheckObj()[area.compId];
      if (!data || data.length === 0) {
        this.$refs.uToast.show({
          type: 'error',
          message: '请选择数据',
        });
        return false;
      }
      try {
        let type = 2;
        if (this.btnInfo.buttonType === 10) type = 5;
        if (this.btnInfo.buttonType === 15) {
          this.isBatch = true;
          type = 15;
        }
        await this.handleClick(this.btnInfo, type);
        this.canDesign = false;

        this.$emit('setBatchArea', '', 'cancel');
      } catch (error) {
        console.error(error);
      }
    },
    checked() {
      this.$emit('checkedAllClick', true);
    },
    unchecked() {
      this.$emit('checkedAllClick', false);
    },
    // 批量保存表单校验
    async validateSave() {
      const areaArr = this.getFuncAreas();
      const menuMain = this.getMenuMain();
      for (let i = 0, len = areaArr.length; i < len; i += 1) {
        const area = areaArr[i];
        const { compId } = area;

        const thisVM = menuMain.$children.find(
          (item) => item.funcConfig && item.funcConfig.compId === compId,
        );
        if (thisVM && thisVM.$refs.configForm) {
          // eslint-disable-next-line no-await-in-loop
          await thisVM.$refs.configForm.validate();
        }
      }
    },
    // 批量保存参数设置
    resolveBatchParams(areaArr) {
      const { userInfo } = this.$store.state.userCenter;
      // eslint-disable-next-line no-unused-vars
      let logContent = `${userInfo.username}(${userInfo.account}):`;
      const menuId = this.getMenuFlag();
      const params = {
        batchInfo: [],
        compMap: JSON.stringify(this.getAllForm()),
        menuId,
        flowType: this.btnInfo.flowType,
        logData: {
          content: '',
          clientType: 'APP',
          curMenuId: menuId,
        },
      };
      areaArr.forEach((area) => {
        if (
          area.propertyCompName === 'MenuMainConfig' ||
          area.propertyCompName === 'TreeMainConfig'
        ) {
          const saveInfo = this.resolveFormParams(area);
          if (saveInfo.logStr.length) {
            const operate = saveInfo.isAdd ? '新增' : '编辑';
            logContent += `[${operate}表(${area.tableInfo.tableName})数据:${saveInfo.logStr[0]}],`;
          }
          delete saveInfo.logStr;
          const tempObj = {
            compId: area.compId,
            areaType: area.propertyCompName === 'MenuMainConfig' ? 1 : 2,
            relation: area.relation || [],
            saveInfo,
          };
          if (
            area.propertyCompName === 'MenuMainConfig' &&
            saveInfo.stepObject
          ) {
            tempObj.stepInfo = saveInfo.stepObject;
            delete saveInfo.stepObject;
          }
          params.batchInfo.push(tempObj);
        }
      });
      params.logData.content = Encrypt(logContent.slice(0, -1));
      if (!this.btnInfo.enableLog || !this.btnInfo.logComp.length) {
        delete params.logData;
      }
      return params;
    },
    // 保存
    async singleSave() {
      if (this.isTabBtn) {
        const params = this.resolveBatchParams(this.getResArr);

        if (
          this.showType &&
          JSON.stringify(this.showType) !== '{}' &&
          this.showType.type === 'flow'
        ) {
          params.flowTask = true;
        }
        if (this.btnInfo.execFunc) {
          this.bulkAddParams(params);
        }

        const result = await batchSave(params);

        // 如果是新增接口，需要将返回的id回填至表单并且按钮的刷新类型要是8=刷新上一页
        if (!this.isAdd && this.btnInfo.refreshType !== 8) return;
        const { batchInfo } = result;
        batchInfo.forEach((info) => {
          const { compId, saveInfo } = info;
          this.$bus.$emit(`loadAddId_${compId}`, saveInfo);
        });
      } else {
        const { propertyCompName } = this.funcConfig;
        if (propertyCompName === 'MenuMainConfig') {
          const params = this.resolveParams();
          await singleSave(params);
        }
      }
    },
    // 批量新增参数处理
    bulkAddParams(params) {
      if (!this.btnInfo.execFuncName) {
        return;
      }
      const res = this.resolveFormula(true, this.btnInfo.execFuncName);
      if (Array.isArray(res) && res.length) {
        params.batchInfo.forEach((area) => {
          if (area.areaType === 1 && area.saveInfo.isAdd) {
            const listInfo = [];
            const commonInfo = [];
            area.saveInfo.listInfo[0].forEach((column) => {
              if (res.includes(column.compId)) {
                listInfo.push(column);
              } else {
                commonInfo.push(column);
              }
            });
            area.saveInfo.listInfo[0] = listInfo;
            area.saveInfo.commonInfo = commonInfo;
            if (res.type === 1) {
              this.resolveListInfo(area.saveInfo.listInfo, res);
            } else {
              this.resolveListOneInfo(area.saveInfo.listInfo, res);
            }
          }
        });
      }
      if (res.type === 3) {
        this.changeCurValue(params.batchInfo, res);
      }
    },
    resolveListInfo(listInfo, multiArr) {
      let j = -1;
      const i = listInfo.findIndex((list) => {
        j = list.findIndex((column) => {
          if (multiArr.includes(column.compId) && column.columnValue) {
            const valueArr = column.columnValue.split(',');
            if (valueArr.length > 1) {
              return true;
            }
          }
          return false;
        });
        if (j !== -1) {
          return true;
        }
        return false;
      });
      if (i !== -1) {
        const obj = listInfo[i][j];
        const curData = listInfo[i];
        const valueArr = obj.columnValue.split(',');
        const arr = [];
        valueArr.forEach((item) => {
          const pushData = JSON.parse(JSON.stringify(curData));
          pushData[j].columnValue = item;
          arr.push(pushData);
        });
        listInfo.splice(i, 1, ...arr);
        this.resolveListInfo(listInfo, multiArr);
      }
    },
    resolveListOneInfo(listInfo, multiArr) {
      let j = -1;
      const i = listInfo.findIndex((list) => {
        j = list.findIndex((column) => {
          if (multiArr[0] === column.compId && column.columnValue) {
            const valueArr = column.columnValue.split(',');
            if (valueArr.length > 1) {
              return true;
            }
          }
          return false;
        });
        if (j !== -1) {
          return true;
        }
        return false;
      });
      if (i !== -1) {
        const obj = listInfo[i][j];
        const curData = listInfo[i];
        const valueArr = obj.columnValue.split(',');
        const arr = [];
        valueArr.forEach((item, index) => {
          const pushData = JSON.parse(JSON.stringify(curData));
          multiArr.forEach((mul) => {
            const k = curData.findIndex((column) => {
              if (mul === column.compId) {
                return true;
              }
              return false;
            });
            const resArr = curData[k].columnValue
              ? curData[k].columnValue.split(',')
              : [];
            if (resArr[index]) {
              pushData[k].columnValue = resArr[index];
            }
          });
          arr.push(pushData);
        });
        listInfo.splice(i, 1, ...arr);
      }
    },
    changeCurValue(arr, obj) {
      arr.forEach((area) => {
        area.saveInfo.listInfo.forEach((list) => {
          list.forEach((column) => {
            if (column.compId === obj.compId) {
              column.columnValue = obj.value;
            }
          });
        });
      });
    },
    // 获取按钮操作区
    getFuncAreas(compId) {
      const areas = this.funcAreas;
      if (compId) return areas.find((area) => area.compId === compId);
      return areas;
    },
    resolveDeleteParams(area) {
      const menuId = this.getMenuFlag();
      const params = {
        ids: '',
        tableName: area.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        menuId,
        flowType: this.btnInfo.flowType,
        logData: {
          content: '',
          clientType: 'APP',
          curMenuId: menuId,
        },
      };
      const { buttonType } = this.btnInfo;
      const featureArr =
        area.pageType === 2 ? area.children[1] : area.children[0];
      featureArr.children.findIndex((comp) => {
        if (comp.dataSource.columnName === 'id') {
          let columnValue = '';
          if (buttonType === 2 && area.propertyCompName === 'MenuMainConfig') {
            // 表单区删除
            const { form } = featureArr;
            columnValue = form[comp.compId] == null ? '' : form[comp.compId];
          } else if (buttonType === 9) {
            // 批量删除
            const data = this.funcCheckObj()[area.compId];
            const arry = [];
            data.forEach((v) => {
              arry.push(v[comp.compId]);
            });
            columnValue = arry.join();
          }
          params.ids = columnValue;
          return true;
        }
        return false;
      });

      const { userInfo } = this.$store.state.userCenter;
      const logContent = `${userInfo.username}(${userInfo.account}):[删除表(${params.tableName})数据:id:${params.ids}]`;
      params.logData.content = Encrypt(logContent);
      if (!this.btnInfo.enableLog) {
        delete params.logData;
      }

      return params;
    },
    // 删除
    async batchDelete() {
      let area = null;
      if (this.isTabBtn) {
        const { deleteArea } = this.btnInfo;
        if (deleteArea) area = this.getFuncAreas(deleteArea);
      } else {
        area = this.funcConfig;
      }
      if (!area) {
        this.$refs.uToast.show({
          type: 'error',
          message: '无可删除区域',
        });
        return;
      }
      const params = this.resolveDeleteParams(area);
      if (params.ids) {
        await batchDelete(params);
      }
    },
    // 数据选择
    dataSelect() {
      let data = [];
      let elementList = [];
      let area = null;
      if (this.isTabBtn) {
        const menuMain = this.getMenuMain();
        [area] = this.featureArr;
        const vueComp = menuMain.$children.find(
          (item) => item.funcConfig && item.funcConfig.compId === area.compId,
        );
        if (vueComp) {
          elementList = vueComp.elementList;
          data = vueComp.checkList;
        }
      } else {
        area = this.featureArr;
        elementList = this.featureArr.children;
        data = this.funcCheckObj()[this.funcConfig.compId];
      }

      if (data.length === 0) {
        this.$refs.uToast.show({
          type: 'error',
          message: '数据不能为空',
        });
        return false;
      }
      const tempArr = [];

      data.forEach((item) => {
        const obj = {};
        elementList.forEach((comp) => {
          if (
            comp.compType === 6 ||
            (comp.compType === 15 && comp.dataSource.relateName !== '主表')
          ) {
            const relateName = comp.dataSource.relateName.split('(')[0];
            const index = area.relateTableArr.findIndex(
              (relate) => relate.relateName === relateName,
            );
            if (index === -1) return;
            const { firstLineColumn, secondLineTable } = area.relateTableArr[
              index
            ].conditionArr[0][0];
            obj[firstLineColumn.columnName] = item[comp.compId];
            obj[`${comp.dataSource.columnName}_${secondLineTable.tableName}`] =
              item[`${comp.compId}_`];
          } else {
            obj[comp.dataSource.columnName] = item[comp.compId];
          }
        });
        tempArr.push(obj);
      });
      this.$bus.$emit(
        this.htmlConfig.sourceFlagId,
        tempArr,
        this.htmlConfig.parentCompId,
      );
    },
    // 处理过滤条件变量为真实值
    getCompValue(compId) {
      // 需要考虑如果点击的按钮是批量按钮时，需要做独特数量
      const { buttonType } = this.btnInfo;
      if (buttonType === 9 || buttonType === 10) {
        let area = null;
        if (this.isTabBtn) {
          const { deleteArea } = this.btnInfo;
          area = this.getFuncAreas(deleteArea);
        } else {
          area = this.funcConfig;
        }
        const data = this.funcCheckObj()[area.compId];
        const arry = [];
        data.forEach((V) => {
          if (V[compId]) arry.push(V[compId]);
        });
        return arry.join();
      }
      return this.getAllForm()[compId];
    },
  },

  mounted() {},

  beforeDestroy() {},
};
