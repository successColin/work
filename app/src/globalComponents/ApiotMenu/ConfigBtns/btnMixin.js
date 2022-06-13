import { batchDelete, batchSave, singleSave } from '@/api/menuConfig';

export default {
  inject: [
    'sysMenuDesignId',
    'getPanel',
    'getAllForm',
    'munuOnlyFlag',
    'getMenuPane',
    'onlyFlag',
    'getMenuFlag',
    'funcCheckObj',
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
    };
  },

  computed: {
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
      const reg = /[$]\{([A-Za-z0-9]+)\}/g;
      const str = html.replace(reg, (res) => {
        if (this.featureArr.form[res.slice(2, 8)]) {
          return this.featureArr.form[res.slice(2, 8)];
        }
        return '';
      });
      return str;
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
      featureArr.children.forEach((comp) => {
        if (
          comp.submitType === 1 ||
          (comp.submitType === 2 && comp.singleStatus !== 4 && comp.canShow)
        ) {
          if (comp.compType === 15) {
            if (comp.dataSource.columnName !== 'id') {
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
            if (comp.dataSource.columnName !== 'id' || columnValue !== '') {
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
      const params = {
        formInfo: [],
        tableName: funcConfig.tableInfo.tableName,
        menuId: this.getMenuFlag(),
      };
      params.formInfo = this.resolveSaveData(this.featureArr, funcConfig);
      return params;
    },
    // 表单区 批量保存接口
    resolveFormParams(area) {
      const params = {
        listInfo: [[]],
        // removeFileIds: this.fileDeleteIds.join(),
        tableName: area.tableInfo.tableName,
      };
      const feature = area.pageType === 2 ? area.children[1] : area.children[0];
      params.listInfo[0] = this.resolveSaveData(feature, area);
      // if (area.isTree || (this.getFatherPanel() && this.getFatherPanel().isTree)) {
      //   params.isTree = 1;
      // }
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
        const { beforeSubmit, afterSubmit, name, refreshType } = e;
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
          const tipContent = this.$apiot.htmlReplace(beforeSubmit.html);
          await this.$refs.apiotModal.showAsyncModal({
            content: this.resolveHtml(tipContent),
          });
        }

        if (buttonType === 1) {
          await this.singleSave();
        } else if (buttonType === 2) {
          await this.batchDelete();
        } else if (buttonType === 3) {
          this.singleInset();
        } else if (buttonType === 4) {
          this.singleUpdate();
        } else if (buttonType === 5) {
          this.normalClick();
        } else if (buttonType === 6) {
          // 确定数据
          this.dataSelect();
        }
        // 后端触发器
        this.$bus.$emit('btnTrigger', this.btnInfo, this.onlyFlag());

        // 成功后提示
        if (afterSubmit.type === 2) {
          this.$refs.uToast.show({
            type: 'success',
            message: `${name}成功`,
          });
        }

        if (afterSubmit.type === 3) {
          const tipContent = this.$apiot.htmlReplace(afterSubmit.html);
          this.$refs.uToast.show({
            type: 'success',
            message: this.resolveHtml(tipContent),
          });
          // await this.$refs.apiotModal.showAsyncModal({
          //   content: this.resolveHtml(tipContent)
          // });
        }

        if (this.$refs.btnsRow) this.$refs.btnsRow.setLoading(e.compId, false);
        // 成功后刷新逻辑
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages(); // 当前页面

        let currentPage = pages[pages.length - 1];
        let beforePage = pages[pages.length - 2]; // 上一页
        // #ifdef APP-PLUS || MP-ALIPAY
        currentPage = currentPage.$vm;
        beforePage = beforePage.$vm;
        // #endif
        console.log('请求后');
        console.log(refreshType);
        if (refreshType === 1) {
          console.log(currentPage);
          currentPage.forceUpdate(); // 刷新当前页
        } else if (refreshType === 2) {
          // 弹出关闭当前页
          if (!this.htmlConfig.isEject) uni.navigateBack();
          else this.$bus.$emit('closePanel');
        } else if (refreshType === 3) {
          uni.navigateBack({
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
            const menuPage = pages[menuPageIndex];
            uni.navigateBack({
              delta: menuPageIndex + 1,
              success() {
                // 如果上一页是工作台
                if (menuPage.pageType !== 'home') menuPage.forceUpdate(); // 刷新菜单
              },
            });
          }
        }
      } catch (error) {
        if (error && !Array.isArray(error) && !error.cancel) {
          uni.$u.toast('其它错误');
        }
        if (this.$refs.btnsRow) this.$refs.btnsRow.setLoading(e.compId, false);
        // this.$refs.btnsRow.setLoading(e.compId, false);
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
      console.log('unchecked==');
      this.$emit('checkedAllClick', false);
    },
    // 新增按钮
    singleInset() {
      const panel = this.resolveFilterVar(this.getPanel()[this.btnInfo.compId]);
      if (panel && panel.panelName) {
        uni.navigateTo({
          url: `/menuConfigure/index?id=${panel.id}&title=${
            this.btnInfo.dialogTitle || panel.panelName
          }&isPanel=true&isAdd=true&parentCompId=${
            this.btnInfo.compId
          }&parentSysMenuDesignId=${this.sysMenuDesignId()}&sourceFlagId=${
            this.btnInfo.compId
          }_${this._uid}&menuFlag=${this.getMenuFlag()}`,
          animationType: 'slide-in-right',
        });
      }
    },
    // 编辑按钮
    singleUpdate() {},
    // 普通按钮
    normalClick() {
      const panel = this.resolveFilterVar(this.getPanel()[this.btnInfo.compId]);
      if (panel && panel.panelName) {
        uni.navigateTo({
          url: `/menuConfigure/index?id=${panel.id}&title=${
            panel.panelName
          }&isPanel=true&parentCompId=${
            this.btnInfo.compId
          }&parentSysMenuDesignId=${this.sysMenuDesignId()}&sourceFlagId=${
            this.btnInfo.compId
          }_${this._uid}&menuFlag=${this.getMenuFlag()}`,
          animationType: 'slide-in-right',
        });
      }
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
      const params = {
        batchInfo: [],
        compMap: JSON.stringify(this.getAllForm()),
        menuId: this.getMenuFlag(),
      };
      areaArr.forEach((area) => {
        if (
          area.propertyCompName === 'MenuMainConfig' ||
          area.propertyCompName === 'TreeMainConfig'
        ) {
          params.batchInfo.push({
            compId: area.compId,
            relation: area.relation || [],
            saveInfo: this.resolveFormParams(area),
          });
        }
      });
      return params;
    },
    // 保存
    async singleSave() {
      if (this.isTabBtn) {
        const params = this.resolveBatchParams(this.getFuncAreas());
        await batchSave(params);
      } else {
        const { propertyCompName } = this.funcConfig;
        if (propertyCompName === 'MenuMainConfig') {
          const params = this.resolveParams();
          await singleSave(params);
        }
      }
    },
    // 获取按钮操作区
    getFuncAreas(compId) {
      const { funcObj } = this.getMenuPane();
      const areas = funcObj[this.tabId];

      if (compId) return areas.find((area) => area.compId === compId);

      return areas.filter((area) => area.propertyCompName !== 'BtnsAreaConfig');
    },
    resolveDeleteParams(area) {
      const params = {
        ids: '',
        tableName: area.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        menuId: this.getMenuFlag(),
      };
      const { buttonType } = this.btnInfo;
      const featureArr =
        area.pageType === 2 ? area.children[1] : area.children[0];
      featureArr.children.findIndex((comp) => {
        if (comp.dataSource.columnName === 'id') {
          let columnValue = '';
          console.log('表单区删除');
          console.log(buttonType);
          console.log(area);
          if (buttonType === 2 && area.propertyCompName === 'MenuMainConfig') {
            // 表单区删除
            console.log('表单区删除1');
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
      console.log('删除====');
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
        const sourceFlagId = `${this.btnInfo.compId}_${this._uid}`;
        // 处理面板过滤条件
        panelObj.panelVarObj = {};
        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] =
              this.getCompValue(compId);
          });
        });
        // 不同路由用vuex进行管理
        this.$store.commit('setMenuPanelFilter', {
          sourceFlagId,
          data: { ...panelObj.panelVarObj, panelFilter: panelObj.panelFilter },
        });

        // 处理跳转面板的数据传输
        panelObj.panelDataTrans = {};
        panelObj.panelData.forEach((item) => {
          const { mainComp, paneComp } = item;
          panelObj.panelDataTrans[paneComp.compId] = this.getCompValue(
            mainComp.compId
          );
        });
        this.$store.commit('setMenuPanelDataTrans', {
          sourceFlagId,
          data: panelObj.panelDataTrans,
        });

        return panelObj;
      }
      return null;
    },
  },
};
