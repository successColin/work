<template>
  <nav class="nav iconNav globalSearch">
    <el-tooltip
      :tabindex="-1"
      effect="dark"
      content="搜索"
      placement="bottom"
      :enterable="false"
      transition="topEnterBottomLeave"
    >
      <span
        class="iconfont icon-quanjusou sousuoBox"
        @click="showGlobalSearch"
      ></span>
    </el-tooltip>
    <transition name="el-zoom-in-right">
      <div class="globalSearch__box" v-show="showSearch" ref="globalSearchBox">
        <apiot-input
          v-model.trim="searchValue"
          placeholder="请输入关键字搜索"
          @keyup.enter.native="showRes"
          class="globalSearch__box--input"
          :class="[{ hasRes: showSearchRes }]"
          ref="globalSearchInput"
        ></apiot-input>
        <i class="iconfont icon-sousuo" @click="showRes"></i>
        <i class="iconfont icon-guanbi" @click="closeAll"></i>
      </div>
    </transition>
    <transition name="el-zoom-in-top">
      <div
        class="globalSearch__res"
        :style="`margin-top: -${
          ($store.state.globalConfig.themeConfig.topHeight - 36) / 2
        }px`"
        v-show="showSearchRes"
        ref="globalSearchRes"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            :label="tab.searchName"
            :name="`${tab.id}`"
            :key="tab.id"
            v-for="tab in tabList"
            v-loading="loading"
            ref="needScroll"
          >
            <section
              class="globalSearch__resBox"
              v-for="res in searchRes"
              :key="res.id"
            >
              <h1
                class="globalSearch__resBox--title"
                v-if="+activeName === -1"
                @click="jumpTab(res)"
              >
                {{ getTabName(res.id) }}(共{{ res.total }}条)
                <i class="iconfont icon-fanhuijiantou"></i>
              </h1>
              <ul class="globalSearch__resBox--ul" v-if="+res.id !== -2">
                <li
                  class="globalSearch__resBox--li"
                  v-for="item in res.records"
                  :key="item.id"
                  @click="jumpTermMenu(item, res)"
                >
                  <span
                    v-html="replaceRes(getResText(res.id, item))"
                    :title="getResText(res.id, item)"
                  ></span>
                </li>
              </ul>
              <ul class="globalSearch__resBox--ul" v-else>
                <li
                  class="globalSearch__resBox--li"
                  v-for="item in res.records"
                  :key="item.id"
                  @click="jumpMenu(item)"
                >
                  <icon-select
                    :notEdit="true"
                    :item="item.icon"
                    class="m-r-12"
                  ></icon-select>
                  <span v-html="replaceRes(item.menuName)"></span>
                </li>
              </ul>
              <p
                v-if="res.total > 3"
                @click="jumpTab(res)"
                class="globalSearch__resBox--more"
              >
                查看更多搜索结果>>
              </p>
            </section>
            <div
              v-if="
                (searchRes.length === 0 ||
                  (searchRes.length === 1 &&
                    searchRes[0].records.length === 0)) &&
                !loading
              "
              style="height: 400px"
              class="apiotNoData"
            ></div>
          </el-tab-pane>
        </el-tabs>
        <el-popover
          placement="bottom"
          trigger="click"
          :append-to-body="false"
          :visible-arrow="false"
          class="globalSearch__res--box"
        >
          <el-checkbox-group
            :value="checkedList"
            @input="checkChange"
            class="globalSearch__res--checkList"
          >
            <el-checkbox
              class="globalSearch__res--item"
              v-for="tab in tabAllList"
              :label="tab.id"
              :key="tab.id"
              :disabled="[-1, -2].includes(tab.id)"
              :title="tab.searchName"
              >{{ tab.searchName }}</el-checkbox
            >
          </el-checkbox-group>
          <i class="iconfont icon-gengduocaozuo" slot="reference"></i>
        </el-popover>
      </div>
    </transition>
  </nav>
</template>

<script>
import { globalSearchUser, selectData } from '@/api/globalSearch';
import { debounce, formatDate, Encrypt } from '@/utils/utils';
import parser from '@/utils/formula';
import IconSelect from '../../../../../MenuManage/components/IconSelect';

export default {
  name: '',
  data() {
    return {
      searchValue: '',
      showSearch: false,
      showSearchRes: false,
      activeName: '-1',
      checkedList: [-1, -2],
      tabAllList: [
        {
          id: -1,
          searchName: '全部',
        },
        {
          id: -2,
          searchName: '菜单',
        },
      ],
      curConfigObj: {},
      searchRes: [],
      size: 30,
      current: 1,
      loading: false,
      hasChange: false,
      allLoaded: false,
    };
  },
  computed: {
    // 获取当前是第几个tab
    getTabIndex() {
      const index = this.tabList.findIndex((tab) => {
        if (+tab.id === +this.activeName) {
          return true;
        }
        return false;
      });
      return index;
    },
    // tab区列表
    tabList() {
      const arr = [];
      this.checkedList.forEach((id) => {
        if (id === -1) {
          arr.push({
            id: -1,
            searchName: '全部',
          });
        } else if (id === -2) {
          arr.push({
            id: -2,
            searchName: '菜单',
          });
        } else if (this.curConfigObj[id]) {
          arr.push(this.curConfigObj[id]);
        }
      });
      return arr;
    },
    // 由id获取tab的名称
    getTabName() {
      return (id) => {
        const obj = this.tabAllList.find((tab) => {
          if (+tab.id === +id) {
            return true;
          }
          return false;
        });
        if (obj) {
          return obj.searchName;
        }
        return '';
      };
    },
    // 转换搜索记录
    getResText() {
      return (id, item) => {
        if (!this.curConfigObj[id]) {
          return '';
        }
        const { config } = this.curConfigObj[id];
        const strArr = [];

        config.filedArr.forEach((field) => {
          if (field.isShow === 1 && item[field.filedName]) {
            let value = item[field.filedName];
            if (field.isDict === 1 && field.dictObj.dictKey) {
              const dictData = this.$store.getters.getCurDict(
                field.dictObj.dictKey,
              );
              const obj = dictData.find((dict) => {
                if (dict.value === value) {
                  return true;
                }
                return false;
              });
              if (obj) {
                value = obj.name;
              }
            }
            strArr.push(`${field.filedMemo}：${value}`);
          }
        });

        return strArr.join('；   ');
      };
    },
    // 替换高亮结果
    replaceRes() {
      const reg = new RegExp(this.searchValue, 'g');
      return (str) =>
        str.replace(
          reg,
          `<span class="globalMarkValue">${this.searchValue}</span>`,
        );
    },
    // 获取菜单搜索的结果
    getMenuSearchRes() {
      const allMenu = this.$store.state.base.routeObj;
      const arr = [];
      Object.keys(allMenu).forEach((id) => {
        const menu = allMenu[id];
        if (menu.menuLevel === 2) {
          if (this.searchValue) {
            if (menu.menuName.indexOf(this.searchValue) !== -1) {
              arr.push(menu);
            }
          } else {
            arr.push(menu);
          }
        }
      });
      return arr;
    },
  },
  components: { IconSelect },
  create() {
    this.initFunc();
  },
  mounted() {
    document.addEventListener('mousedown', this.documentHandler);
    this.$bus.$on('refreshSearchUser', this.userBus);
    this.globalSearchUser();

    // console.log(this.$refs.needScroll);
    this.$nextTick(() => {
      this.scrollLoad();
    });
  },
  methods: {
    // 关闭所有
    closeAll() {
      this.searchValue = '';
      this.showSearch = false;
      this.showSearchRes = false;
      this.allLoaded = false;
      this.activeName = '-1';
      this.current = 1;
    },
    // 初始化自定的方法
    initFunc() {
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
      parser.setFunction('BEFORE_IN_AFTER', (params) => {
        let before = params[0];
        const after = [...params];
        after.shift();
        if (!Array.isArray(before)) {
          before = before.toString().split(',');
        }
        const indexIn = before.findIndex((v) => {
          if (!after.includes(v)) {
            return true;
          }
          return false;
        });
        if (indexIn === -1) {
          return true;
        }
        return false;
      });
      parser.setFunction('BEFORE_NOT_IN_AFTER', (params) => {
        let before = params[0];
        const after = [...params];
        after.shift();
        if (!Array.isArray(before)) {
          before = before.toString().split(',');
        }
        const indexNotIn = after.findIndex((v) => {
          if (before.includes(v)) {
            return true;
          }
          return false;
        });
        if (indexNotIn === -1) {
          return true;
        }
        return false;
      });
    },
    // 处理公式
    resolveFormula(flag, formulaStr, data) {
      if (!flag) {
        // false 代表不是公式是固定值
        return formulaStr;
      }
      // // console.log(formulaStr);
      let formulaRes = formulaStr
        .replace(' ', '')
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');

      formulaRes = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`,
      );
      let str = formulaRes.replace(
        /\$variable_+([a-zA-Z0-9_]+)\$/g,
        (...arr) => data[arr[1]],
      );
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
        return '';
      }
      return res.result;
    },
    // 跳转符合条件的菜单
    jumpTermMenu(jumpTermData, jumpTermRes) {
      const curMenuArr = this.curConfigObj[jumpTermRes.id].config.menuList;
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm, jumpTermData);
        // console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        // console.log(obj);
        const menu = this.$store.getters.getCurMenu(obj.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          obj.menuVarObj = {};
          obj.menuFilter.forEach((item) => {
            item.filterTermSql = Encrypt(
              `${this.curConfigObj[jumpTermRes.id].tableName}.id = ${
                jumpTermData.id
              }`,
            );
          });
          const menuObj = sessionStorage.jumpMenuObj
            ? JSON.parse(sessionStorage.jumpMenuObj)
            : {};
          menuObj[obj.id] = obj;
          sessionStorage.jumpMenuObj = JSON.stringify(menuObj);
          // this.$bus.$emit('changeMenuTab', curMenu);
          this.jumpMenu(curMenu);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限',
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单',
        });
      }
    },
    // 跳转菜单
    jumpMenu(menu) {
      // console.log(menu);
      this.showSearchRes = false;
      this.activeName = '-1';
      this.current = 1;
      this.allLoaded = false;
      this.closeAll();
      this.$bus.$emit('changeMenuTab', menu);
      // // 自定义配置页面跳转菜单的时候刷新下
      // setTimeout(() => {
      //   this.$bus.$emit('menuRefresh');
      // }, 20);
    },
    // 滚动加载建立
    scrollLoad() {
      const el = document.querySelector('.globalSearch__res .el-tabs__content');
      el.addEventListener('scroll', debounce(this.scrollThing));
    },
    // 滚动加载事件
    scrollThing() {
      if ([-1, -2].includes(+this.activeName) || this.allLoaded) {
        return;
      }
      const el = document.querySelector('.globalSearch__res .el-tabs__content');
      const elScroll = document.querySelectorAll(
        '.globalSearch__res .el-tabs__content .el-tab-pane',
      )[this.getTabIndex];
      if (el.scrollTop + el.offsetHeight > elScroll.offsetHeight - 100) {
        this.current += 1;
        this.selectData();
      }
    },
    // bus
    userBus() {
      // if (this.hasChange) {
      //   return;
      // }
      this.globalSearchUser();
    },
    // 获取全局搜索配置
    async globalSearchUser(globalSearchIds = '') {
      this.loading = true;
      const res = await globalSearchUser({ globalSearchIds, searchType: 1 });

      // console.log(res);
      if (res.flag === '1') {
        this.hasChange = true;
      }
      this.tabAllList = [
        {
          id: -1,
          searchName: '全部',
        },
        {
          id: -2,
          searchName: '菜单',
        },
      ];
      this.tabAllList.push(...res.all);
      this.checkedList = [-1, -2];
      this.curConfigObj = {};
      const dictArr = [];
      res.user.forEach((obj) => {
        this.checkedList.push(obj.id);
        this.curConfigObj[obj.id] = obj;
        obj.config.filedArr.forEach((field) => {
          if (field.isDict === 1 && field.dictObj.dictKey) {
            dictArr.push(field.dictObj.dictKey);
          }
        });
      });
      if (dictArr.length) {
        await this.$store.dispatch(
          'getCurrentDict',
          [...new Set(dictArr)].join(','),
        );
      }
      this.loading = false;
    },
    // x显示搜索框
    showGlobalSearch() {
      this.showSearch = true;
      this.$nextTick(() => {
        this.$refs.globalSearchInput.focus();
      });
    },
    // 显示搜索结果
    showRes() {
      if (!this.searchValue) {
        this.$refs.globalSearchInput.focus();
        return this.$message.warning('请输入搜索内容');
      }
      this.selectData();
    },
    // 查询搜索结果
    async selectData() {
      this.loading = true;
      let params = {};
      const page = {
        size: this.size,
        current: this.current,
      };
      let res = [];
      if (this.activeName === '-2') {
        // res = this.getMenuSearchRes;
        this.searchRes = [];
        this.searchRes.push({
          id: -2,
          records: this.getMenuSearchRes,
          total: this.getMenuSearchRes.length,
        });
        this.loading = false;
        this.showSearchRes = true;
        return;
      }
      try {
        const configObj = {};
        Object.keys(this.curConfigObj).forEach((id) => {
          const config = this.curConfigObj[id];
          const columnsInfo = [];
          config.config.filedArr.forEach((field) => {
            const column = {
              dict: 2,
              columnType: field.filedType,
              lambda: 'in',
              name: field.filedName,
              value: '',
            };
            if (field.isDict === 1 && field.dictObj.dictKey) {
              const dictData = this.$store.getters.getCurDict(
                field.dictObj.dictKey,
              );
              const valueArr = [];
              dictData.forEach((dict) => {
                const i = dict.name.indexOf(this.searchValue);
                if (i !== -1 && this.searchValue) {
                  valueArr.push(dict.value);
                }
              });
              column.dict = 1;
              column.value = valueArr.join();
            } else {
              column.lambda = 'like';
              column.value = this.searchValue;
            }
            columnsInfo.push(column);
          });
          const searchColumns = config.searchColumns.split(',').includes('id')
            ? config.searchColumns
            : `${config.searchColumns},id`;
          configObj[id] = {
            tableName: config.tableName,
            searchColumns,
            searchWhere: config.config.searchTerm || '',
            searchInfoDTO: {
              searchValue: this.searchValue,
              columnsInfo,
            },
          };
        });
        if (this.activeName === '-1') {
          params = configObj;
          page.size = 3;
          page.current = 1;
        } else {
          params[this.activeName] = configObj[this.activeName];
        }
        res = await selectData(params, page);
        if (this.current === 1) {
          this.searchRes = [];
        }

        if (this.getMenuSearchRes.length) {
          if (this.activeName === '-1') {
            this.searchRes.push({
              id: -2,
              records: this.getMenuSearchRes.slice(0, 3),
              total: this.getMenuSearchRes.length,
            });
          } else if (this.activeName === '-2') {
            this.searchRes.push({
              id: -2,
              records: this.getMenuSearchRes,
              total: this.getMenuSearchRes.length,
            });
          }
        }
        if (this.current === 1) {
          Object.keys(res).forEach((id) => {
            if (res[id].records.length) {
              this.searchRes.push({
                id,
                ...res[id],
              });
            }
          });
        } else {
          // 只会有1个
          Object.keys(res).forEach((id) => {
            if (res[id].records.length) {
              if (this.searchRes.length) {
                this.searchRes[0].records.push(...res[id].records);
              } else {
                this.searchRes.push({
                  id,
                  ...res[id],
                });
              }
            } else {
              this.allLoaded = true;
            }
          });
        }
        // console.log(this.searchRes);
        this.showSearchRes = true;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 是否点击外部区域
    documentHandler(e) {
      const searchEl = this.$refs.globalSearchBox;
      const resEl = this.$refs.globalSearchRes;
      if (searchEl && resEl) {
        if (searchEl.contains(e.target) || resEl.contains(e.target)) {
          return false;
        }
        this.closeAll();
      }
    },
    jumpTab(res) {
      console.log(res);
      this.activeName = `${res.id}`;
      this.handleClick();
    },
    // 点击标签页
    handleClick() {
      this.searchRes = [];
      this.current = 1;
      this.allLoaded = false;
      if (+this.activeName === -2) {
        this.searchRes.push({
          id: -2,
          records: this.getMenuSearchRes,
        });
      } else {
        this.selectData();
      }
    },
    // tab选中切换
    async checkChange(v) {
      v.sort();
      this.checkedList = v;
      const backData = this.searchRes;
      this.searchRes = [];
      await this.globalSearchUser(v.join(','));
      if (+this.activeName === -1) {
        // 说明在全部页面
        this.handleClick();
        return;
      }
      // 不在全部页面
      if (!this.checkedList.includes(+this.activeName)) {
        // 包含 说明当前的tab没影响 没包含 说明当前tab被关闭了 定位到全部的tab
        this.activeName = '-1';
        this.handleClick();
        return;
      }
      this.searchRes = backData;
    },
  },
  watch: {
    searchValue(v) {
      if (!v) {
        this.searchValue = '';
        this.showSearchRes = false;
        this.allLoaded = false;
        this.activeName = '-1';
        this.current = 1;
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('mousedown', this.documentHandler);
    this.$bus.$off('refreshSearchUser', this.userBus);
    const el = document.querySelector('.globalSearch__res .el-tabs__content');
    if (el) {
      el.removeEventListener('scroll', debounce(this.scrollThing));
    }
  },
};
</script>

<style lang="scss" scoped>
.globalSearch {
  position: relative;
  z-index: 1;

  .sousuoBox {
    display: inline-block;
    width: 44px;
    font-size: 22px;
  }

  &__box {
    position: absolute;
    height: 36px;
    z-index: 1;
    top: 0;
    margin-left: -596px;

    &--input {
      width: 640px;
      height: 36px;
      ::v-deep {
        .el-input__inner {
          padding-left: 20px;
          padding-right: 88px;
          border-color: #e9e9e9 !important;
          outline: none !important;
          height: 36px;
          line-height: 36px;
        }
      }
      &.hasRes {
        ::v-deep {
          .el-input__inner {
            border-radius: 4px 4px 0 0;
          }
        }
      }
    }

    .iconfont {
      position: absolute;
      width: 44px;
      color: #bbc3cd;

      &:hover {
        color: $--color-primary;
      }
    }

    .icon-sousuo {
      right: 44px;
      &:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 14px;
        background-color: #e9e9e9;
        margin-top: calc((#{$layoutHeader} - 14px) / 2);
        margin-left: 14px;
      }
    }

    .icon-guanbi {
      right: 0;
    }
  }

  &__res {
    position: absolute;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-left: -596px;
    margin-top: 0px;
    width: 640px;
    height: 540px;
    background: #ffffff;
    box-shadow: 3px 3px 12px 0px rgba(0, 0, 0, 0.09);
    border-radius: 0 0 4px 4px;

    ::v-deep {
      .el-tabs {
        height: 100%;
      }

      .el-tabs__header {
        margin-bottom: 0;
      }

      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #e9e9e9;
      }
      .el-tabs__content {
        height: calc(100% - 48px);
        overflow: hidden;
        overflow-y: auto;

        .el-tab-pane {
          min-height: 100%;
        }
      }
    }

    .icon-gengduocaozuo {
      position: absolute;
      right: 20px;
      top: 10px;
      color: #bbc3cd;
      cursor: pointer;

      &:hover {
        color: $--color-primary;
      }
    }

    &--box {
      ::v-deep {
        .el-popover {
          padding: 0;
          margin: 0;
          margin-top: -12px;
        }
      }
    }

    &--checkList {
      width: 160px;
      height: 272px;
      overflow: auto;
    }

    &--item {
      display: block;
      line-height: 36px;
      height: 36px;
      padding-left: 20px;
      width: 100%;
      box-sizing: border-box;
      ::v-deep {
        .el-checkbox__label {
          width: 100px;
          overflow: hidden;
          vertical-align: text-bottom;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  &__resBox {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    text-align: left;

    &--title {
      position: relative;
      box-sizing: border-box;
      font-size: 15px;
      height: 42px;
      line-height: 42px;
      font-weight: 600;
      border-bottom: 1px solid #e9e9e9;
      &:hover {
        i {
          color: $--color-primary;
        }
      }
      i {
        position: absolute;
        right: 0;
        font-weight: normal;
        color: #bbc3cd;
        transform: rotate(180deg);
      }
    }
    &--more {
      line-height: 40px;
      color: $--color-primary;
      display: flex;
      align-items: center;
    }
    &--li {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 13px;
      &:hover {
        background-color: #f1f7ff;
        border-radius: 4px;
      }
      ::v-deep {
        .iconSelect {
          width: 24px;
          height: 24px;
          line-height: 24px;
          background-color: rgba(0, 0, 0, 0);

          .showImg {
            width: 24px;
            height: 24px;
          }
          .iconfont {
            font-size: 24px;
          }
        }
      }
      span {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
<style lang="scss">
.globalMarkValue {
  background: #e5f0ff;
  border-radius: 4px;
  padding: 3px 0;
  line-height: 1;
}
</style>
