import { batchDelete, batchSave, singleSave } from '@/api/menuConfig';
import { Encrypt } from '@/utils';

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
    };
  },

  computed: {
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
      const { children: elements } = btnsProp;
      return elements.filter((el) => {
        const comp = allComp[el.compId] || {};
        el = { ...el, ...comp };
        return el.canShow && el.compName !== 'SearchCondition';
      });
    },
  },

  methods: {
    resolveHtml(html) {
      const reg =
        /<messageVar vartype=[$]([A-Za-z0-9]+)>[^<]{0,}<\/messageVar>/g;
      const formData = this.getAllForm();

      const str = html.replace(reg, (res, v) => {
        console.log(res);
        console.log(v);
        console.log(this.featureArr);
        if (formData[v]) {
          return formData[v];
        }
        return '';
      });
      return this.$apiot.htmlReplace(str);
    },
    getDictStr(comp, columnValue) {
      const dictArr = this.$store.getters.getCurDict(
        comp.dataSource.dictObj.dictKey
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
                comp.dataSource.columnName
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
                'yyyy-MM-dd hh:mm:ss'
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
                  (relate) => relate.relateName === relateName
                );
                if (index !== -1) {
                  const { firstLineColumn } =
                    area.relateTableArr[index].conditionArr[0][0];
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
                    comp.dataSource.columnName
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
                  (v) => v.columnName === column.columnName
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
      console.log(params, 'params');
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
      this.btnInfo = { ...e };
      // 是否为审批按钮
      if (e.isProcess) {
        this.processClick();
        if (this.$refs.btnsRow) this.$refs.btnsRow.setLoading(e.compId, false);
        return;
      }

      try {
        const { propertyCompName } = this.funcConfig;
        const { compId, beforeSubmit, afterSubmit, name, refreshType } = e;

        // 点击按钮前需要做的校验
        const index = this.btnInfo.ruleArr.findIndex((rule) => {
          const res = this.resolveFormula(true, rule.content);
          console.log(res);
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

        let { buttonType } = e;
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
          // 新增、编辑、普通
          this.jumpOther();
        } else if (buttonType === 6) {
          // 确定数据
          this.dataSelect();
        }
        // 后端触发器
        await this.clickTrigger(this.btnInfo, this.onlyFlag());
        // 成功后提示
        // 默认提示
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
        else this.$bus.$emit('closePanel');
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
        const menuPageIndex = pages.findIndex((page) => page._uid === menu);

        if (menuPageIndex !== -1) {
          const currentIndex = pages.length - 1;
          const backPageIndex = currentIndex - menuPageIndex;
          const menuPage = pages[menuPageIndex];
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
        if (beforePage.pageType !== 'home') beforePage.forceUpdate();
      }
    },
    // 跳转到其他界面：面板、菜单、外部链接
    jumpOther() {
      console.log(this.btnInfo);
      const { relateType, compId } = this.btnInfo;
      if (relateType === 1) this.gotoPanel(compId); // 跳转面板
      else if (relateType === 3) this.gotoWebView(); // 跳转地址
      else this.gotoMenu(); // 跳转菜单
    },
    // 跳转外部地址
    gotoWebView() {
      const { outerLink, paramsArr = [], compId } = this.btnInfo;
      if (!outerLink) return;
      const urlParams = {};
      console.log('paramsArr===============');
      console.log(paramsArr);
      paramsArr.forEach((param) => {
        const { type, name, fixed, formula } = param;
        let value = fixed;
        if (type === 2) {
          value = this.resolveFormula(true, formula);
        }
        urlParams[name] = value;
      });
      console.log(urlParams);
      const sourceFlagId = `${compId}_${this._uid}`;
      this.$store.dispatch('jumpOuterLink', {
        sourceFlagId,
        outerLink,
        urlParams,
      });
    },
    // 跳转菜单
    gotoMenu() {
      console.log(this.jumpMenu);
      if (this.jumpMenu.length === 0) return;
      const obj = this.jumpMenu.find((menu) => {
        // 根据格式过滤可以跳转的菜单
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        this.$bus.$emit('clickMenu', {
          menu: { id: obj.id },
          menuFilter: obj.menuFilter,
          formData: this.getAllForm(),
        });
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有符合条件的菜单',
        });
      }
    },
    // 跳转面板
    gotoPanel(compId) {
      const panel = this.getPanel()[compId];
      if (panel) {
        this.resolveFilterVar(panel);
      }
    },
    // 批量按钮点击
    async batchBtnClick() {
      try {
        let area = null;
        if (this.isTabBtn) {
          const { deleteArea } = this.btnInfo;
          area = this.getFuncAreas(deleteArea);
        } else {
          area = this.funcConfig;
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
          (item) => item.funcConfig && item.funcConfig.compId === compId
        );
        // eslint-disable-next-line no-await-in-loop
        if (thisVM) await thisVM.$refs.configForm.validate();
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
          console.log(area.propertyCompName, 'area.propertyCompName');
          if (
            area.propertyCompName === 'MenuMainConfig' &&
            saveInfo.stepObject
          ) {
            tempObj.stepInfo = saveInfo.stepObject;
            delete saveInfo.stepObject;
          }
          params.batchInfo.push(tempObj);
          console.log(tempObj, 'tempObj');
        }
      });
      params.logData.content = Encrypt(logContent.slice(0, -1));
      if (!this.btnInfo.enableLog || !this.btnInfo.logComp.length) {
        delete params.logData;
      }
      console.log(params, 'params');
      return params;
    },
    // 保存
    async singleSave() {
      if (this.isTabBtn) {
        const params = this.resolveBatchParams(this.getFuncAreas());
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
      const { funcObj } = this.getMenuPane();
      const areas = funcObj[this.tabId];

      if (compId) return areas.find((area) => area.compId === compId);

      return areas.filter((area) => area.propertyCompName !== 'BtnsAreaConfig');
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
        area = this.getFuncAreas(deleteArea);
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
          (item) => item.funcConfig && item.funcConfig.compId === area.compId
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
      console.log('this.featureArr==============================');
      console.log(area);
      console.log(elementList);

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
              (relate) => relate.relateName === relateName
            );
            if (index === -1) return;
            const { firstLineColumn, secondLineTable } =
              area.relateTableArr[index].conditionArr[0][0];
            obj[firstLineColumn.columnName] = item[comp.compId];
            obj[`${comp.dataSource.columnName}_${secondLineTable.tableName}`] =
              item[`${comp.compId}_`];
          } else {
            obj[comp.dataSource.columnName] = item[comp.compId];
          }
        });
        tempArr.push(obj);
      });

      this.$bus.$emit('sureSelect', tempArr, this.htmlConfig.parentCompId);
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
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        const { buttonType, compId } = this.btnInfo;
        const sourceFlagId = `${compId}_${this._uid}`;

        const urlParams = {
          parentCompId: compId,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          menuFlag: this.getMenuFlag(),
        };
        if (buttonType === 3) {
          urlParams.isAdd = true;
        }

        this.$store.dispatch('jumpPanel', {
          panel: panelObj,
          sourceFlagId,
          formData: this.getAllForm(),
          urlParams,
        });

        return panelObj;
      }
      return null;
    },
  },
};
