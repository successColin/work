export default {
  // 跳转至其他界面
  methods: {
    // 跳转外部地址
    gotoWebView({ outerLink, paramsArr = [], sourceFlagId, formData }) {
      if (!outerLink) return;
      const urlParams = {};
      paramsArr.forEach((param) => {
        const { type, name, fixed, formula } = param;
        let value = fixed;
        if (type === 2) {
          value = this.resolveFormula(true, formula, formData);
        }
        urlParams[name] = value;
      });
      this.$store.dispatch('jumpOuterLink', {
        sourceFlagId,
        outerLink,
        urlParams,
      });
    },
    // 跳转菜单
    gotoMenu({ jumpMenu, formData, sourceFlagId }) {
      if (jumpMenu.length === 0) return;
      const obj = jumpMenu.find((menu) => {
        // 根据格式过滤可以跳转的菜单
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm, formData);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        const menu = JSON.parse(JSON.stringify(obj)); // 避免对象污染
        const { menuFilter } = menu;
        // 如果有菜单过滤条件
        const config = { sourceFlagId };
        if (menuFilter) {
          config.filters = {};
          config.map = {};
          menuFilter.forEach((item) => {
            const { filterTermType, filterTermSql, filterTermStr, compId } =
              item;
            if (filterTermType === 1) {
              // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(
                filterTermStr,
                formData
              );
              item.filterTermStr = JSON.stringify(newFilterTermStr);
            }
            if (config.filters[compId]) config.filters[compId].push(item);
            else config.filters[compId] = [item];
            const arr = item.termParams.split(',');
            arr.forEach((id) => {
              config.map[id] = formData[id];
            });
          });
        }
        this.$bus.$emit('clickMenu', {
          menu: { id: obj.id },
          menuFilter,
          formData,
          config,
        });
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有符合条件的菜单',
        });
      }
    },
    // 跳转面板
    gotoPanel({ panel, sourceFlagId, urlParams, formData, isNoVuex, canJump }) {
      if (panel) {
        const panelObj = JSON.parse(JSON.stringify(panel)); // 避免对象污染
        const config = {
          panel: panelObj,
          sourceFlagId,
          urlParams,
          isNoVuex,
          canJump,
        };
        const { panelFilter = [], panelData = {} } = panelObj;
        // 处理传递参数以及过滤条件1
        if (panelFilter) {
          config.filters = {};
          config.map = {};
          panelFilter.forEach((item, index) => {
            const { filterTermType, filterTermSql, filterTermStr, compId } =
              item;
            if (filterTermType === 1) {
              // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(
                filterTermStr,
                formData
              );
              item.filterTermStr = JSON.stringify(newFilterTermStr);
            }
            const arr = item.termParams.split(',');
            arr.forEach((id) => {
              config.map[id] = formData[id];
            });
            // if (filterTermType === 2) {
            //   // sql过滤条件
            //   const str = this.reduceSqlFilter(filterTermSql, formData);
            //   item.filterTermSql = str;
            //   const arr = item.termParams.split(',');
            //   arr.forEach((id) => {
            //     config.map[id] = formData[id];
            //   });
            // }
            if (config.filters[compId]) config.filters[compId].push(item);
            else config.filters[compId] = [item];
          });
        }
        // 处理传递参数
        config.panelFixData = {};
        panelData.forEach((item) => {
          const { mainComp, paneComp } = item;
          let value = null;
          const { type, compId, fixedValue } = mainComp;
          if (type === 1) value = formData[compId];
          else if (type === 3) {
            value = this.resolveFormula(true, fixedValue, formData);
          } else value = fixedValue;
          config.panelFixData[paneComp.compId] = value;
        });

        this.$store.dispatch('jumpPanel', config);
      }
    },

    reduceNormalFilter(filterTermStr, formData) {
      if (!filterTermStr) return {};
      // 处理普通的过滤条件
      const newFilterTermStr = JSON.parse(filterTermStr);
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            let result = this.regProcess(content);
            if (result) {
              // 如果是公式
              result = this.resolveFormula(true, result, formData);
            } else {
              result = content.replace(
                /\$([A-Za-z0-9]{6})\$/g,
                (v, v1) => formData[v1]
              );
            }
            term.valueType = 1;
            term.content = result;
          }
        });
      });
      return newFilterTermStr;
    },
    reduceSqlFilter(filterTermSql, formData) {
      // 处理sql过滤条件
      // let str = this.regProcess(filterTermSql);
      let str = filterTermSql;
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取当前用户
      str = str.replace(/GET_USER_ID\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取用户组织
      str = str.replace(/GET_ORG_ID\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取用户角色
      str = str.replace(/GET_ROLES_ID\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取日期
      str = str.replace(/GET_DATE\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取日期时间
      str = str.replace(/GET_DATETIME\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取年份
      str = str.replace(/GET_YEAR\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取月份
      str = str.replace(/GET_MONTH\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取星期
      str = str.replace(/GET_WEEK\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取天
      str = str.replace(/GET_DAY\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      // 获取时间撮
      str = str.replace(/GET_TIMESTAMP\(\)/g, (text) => {
        const result = this.resolveFormula(true, text, formData);
        return result ? `'${result}'` : '';
      });
      return str;
    },
    regProcess(str = '') {
      // 将公式中的特殊字符去除
      if (!str) return '';
      let formulaRes = str
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
      const newStr = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );
      return newStr;
    },
    // 跳转面板
    panelFormat({
      compId,
      textPanelId, // 多面板跳转时会有
      sourceFlagId,
      urlParams,
      formData,
      isNoVuex = false,
      canJump = false,
    }) {
      let obj = null;

      if (textPanelId) {
        const arr = textPanelId.split(',');
        const panelArr = [];
        arr.forEach((panelId) => {
          if (panelId && this.getPanel()[panelId]) {
            panelArr.push(this.getPanel()[panelId]);
          }
        });
        obj = panelArr.find((panel) => {
          if (!panel.jumpTerm) {
            return true;
          }
          const res = this.resolveFormula(true, panel.jumpTerm, formData);
          if (res) {
            return true;
          }
          return false;
        });
      } else obj = this.getPanel()[compId]; // 为了兼容早期pane只有一个时的代码

      if (obj) {
        const { id } = obj;
        urlParams.ejectComId = id;
        urlParams.parentCompId = id;
        this.gotoPanel({
          panel: obj,
          urlParams,
          sourceFlagId,
          formData,
          isNoVuex,
          canJump,
        });

        return obj;
      }
      return null;
    },
  },
};
