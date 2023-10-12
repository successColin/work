<!--
 * @Descripttion: 全局搜索
 * @Author: ytx
 * @Date: 2023-03-05 16:04:17
 * @Last Modified by: ytx
 * @Last Modified time: 2023-03-05 16:04:17
-->
<template>
  <view class="search">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="$t('common.globalSearch')"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar" ref="sticky" id="sticky">
      <search-box ref="searchBox" @search="getSearchVal"></search-box>
      <!-- tabs -->
      <section class="search__tabs" v-if="!showRecent">
        <apiot-tabs
          v-if="isShowTabs"
          :list="tabList"
          mode="cricle"
          @click="handleSwitch"
        ></apiot-tabs>
        <!-- <u-tabs
          v-if="isShowTabs"
          :list="tabList"
          @click="handleSwitch"
          :activeStyle="{ color: '#4689f5', background: '#f1f7ff' }"
        ></u-tabs> -->
        <i class="appIcon appIcon-gengduo" @click="handleMore"></i>
      </section>
    </u-sticky>
    <!-- 最近搜索 -->
    <section class="lastSearches" v-if="showRecent">
      <header class="lastSearches__header">
        <span>最近搜索</span>
        <p @click="delLastSearche"><i class="appIcon appIcon-shanchu"></i></p>
      </header>
      <div class="lastSearches__content">
        <div
          class="lastSearches__content--item"
          v-for="(item, index) in recentSearch"
          :key="index"
          @click.stop="clickLastSearchesItem(item)"
        >
          {{ item }}
        </div>
      </div>
    </section>

    <!-- loading -->
    <apiot-toast v-if="isloading" status="loading" :isFull="true"></apiot-toast>
    <!-- 无数据 -->
    <apiot-list-nodata
      v-if="searchRes.length === 0 && !showRecent"
    ></apiot-list-nodata>
    <!-- 内容 -->
    <u-list
      v-else-if="searchRes !== 0 && !showRecent"
      :height="computedHeight"
      :preLoadScreen="1.5"
      :pagingEnabled="true"
      @scrolltolower="scrolltolower"
    >
      <div class="search__resBox" v-for="res in searchRes" :key="res.id">
        <h1 class="search__resBox--title" v-if="tabIndex === -1">
          {{ getTabName(res.id) }}
        </h1>
        <u-list-item
          class="search__resBox--ul"
          v-for="item in res.records"
          :key="item.id"
          :anchor="item.id"
        >
          <div
            class="search__resBox--li"
            @click.stop="jumpTermMenu(item, res)"
            v-if="res.id !== -2"
          >
            <div class="myparse">
              <u-parse
                :content="replaceRes(getResText(res.id, item))"
              ></u-parse>
            </div>
          </div>
          <div v-else class="search__resBox--li" @click.stop="jumpMenu(item)">
            <label-icon
              v-show="item.icon.imageUrl || item.icon.icon"
              :name="item.icon.imageUrl || item.icon.icon"
              :size="30"
            ></label-icon>
            <div class="myparse">
              <u-parse :content="replaceRes(item.menuName)"></u-parse>
            </div>
          </div>
        </u-list-item>
      </div>
    </u-list>
    <!-- 更多 -->
    <u-popup :show="isShow" :round="20" mode="bottom" @close="handleCancel">
      <section class="search__popup">
        <div
          v-for="(item, index) in tabAllList"
          :key="index"
          class="search__popup--item"
          @click="handleChoose(item.id)"
        >
          <div class="search__popup--font">
            {{ item.name }}
          </div>
          <i
            v-show="chooseList.includes(item.id)"
            class="appIcon appIcon-xialagouxuan"
            :class="[[-1, -2].includes(item.id) ? 'disableClass' : '']"
          ></i>
        </div>
      </section>
      <div class="search__popup--button">
        <apiot-button
          type="secondary"
          style="margin-right: 24rpx"
          @click="handleCancel"
        >
          取消
        </apiot-button>
        <apiot-button type="primary" @click="handleConfirm">
          确定
        </apiot-button>
      </div>
    </u-popup>
    <!-- 成功提示 -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import parser from '@/utils/formula';
import { selectData, globalSearchUser } from '@/api/globalSearch';
import SearchBox from './components/SearchComps/SearchBox.vue';
import LabelIcon from './components/LabelIcon/index.vue';
import gotoOtherPage from './gotoOtherPage';

export default {
  mixins: [gotoOtherPage],
  components: { SearchBox, LabelIcon },

  props: {},

  data() {
    return {
      isloading: false,
      tabAllList: [], // 搜索类型
      curConfigObj: {},
      isShow: false,
      defaultTabs: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: -2,
          name: '菜单'
        }
      ], // 默认tabs
      tabIndex: -1, // tabs 位置
      size: 30,
      current: 1,
      searchRes: [], // 菜单结果
      checkedList: [-1, -2], // tabs 选中结果
      chooseList: [], // 弹出框选中的值
      searchValue: '', // 搜索出的值
      recentSearch: [], // 最近搜索
      showRecent: true, // 第一次显示最近搜索
      isShowTabs: true
    };
  },

  computed: {
    computedHeight() {
      const { windowHeight, customBar } = this.systemInfo;
      const height = windowHeight - customBar - 45 - 45 - 5;
      return height;
    },
    // 搜索框-下拉框内容
    getICSearchDown() {
      return this.$store.getters.getICSearchDown;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.customBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    },
    getThemeColorBg() {
      return this.$store.getters.getThemeColorBg;
    },
    // 获取菜单搜索的结果
    getMenuSearchRes() {
      const allMenu = this.$store.state.menu.menusObj;
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
    // tab区列表
    tabList() {
      const arr = [];
      this.checkedList.forEach((id) => {
        if (id === -1) {
          arr.push({
            id: -1,
            name: '全部'
          });
        } else if (id === -2) {
          arr.push({
            id: -2,
            name: '菜单'
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
          return obj.name;
        }
        return '';
      };
    },
    // 替换高亮结果
    replaceRes() {
      const reg = new RegExp(this.searchValue, 'g');
      return function(str) {
        return this.searchValue
          ? str.replace(reg, `<span class="globalMarkValue">${this.searchValue}</span>`)
          : str;
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
          let value = item[field.filedName];
          if (field.isDict === 1 && field.dictObj.dictKey) {
            const dictData = this.$store.getters.getCurDict(field.dictObj.dictKey);
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
          strArr.push(`${field.filedMemo}:${value}`);
        });
        return strArr.join(';');
      };
    }
  },
  mounted() {},
  methods: {
    initParams() {
      this.current = 1; // 页码
      this.tabIndex = -1; // tabs -1===全部
      this.isShowTabs = false;
      this.$nextTick(() => {
        this.isShowTabs = true;
      });
    },
    // 下拉加载
    scrolltolower() {
      // console.log(this.searchRes, this.tabIndex);
      // 全部下拉有很多条数据，除了全部数组只有一条
      if (this.tabIndex === -1) return;
      const { total, records } = this.searchRes[0];
      if (records.length < total) {
        this.current += 1;
        this.handleSearch();
      }
    },
    // 获取全局搜索配置
    async getConfig(globalSearchIds = '') {
      const res = await globalSearchUser({ globalSearchIds, searchType: 2 });
      res.all.forEach((item) => {
        item.name = item.searchName;
      });
      res.user.forEach((item) => {
        item.name = item.searchName;
      });
      this.tabAllList = JSON.parse(JSON.stringify(this.defaultTabs));
      // 全部 tabs
      this.tabAllList.push(...res.all);
      // 选中结果
      this.checkedList = [-1, -2];
      // 当前选中的对象
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
        await this.$store.dispatch('getCurrentDict', [...new Set(dictArr)].join(','));
      }
      this.chooseList = JSON.parse(JSON.stringify(this.checkedList));
    },
    // 点击更多
    handleMore() {
      this.isShow = true;
    },
    // 个性化选择
    handleChoose(id) {
      if ([-1, -2].includes(id)) return;
      const index = this.chooseList.indexOf(id);
      if (index !== -1) {
        this.chooseList.splice(index, 1);
      } else {
        this.chooseList.push(id);
      }
      console.log(this.chooseList);
    },
    // 个性化取消按钮
    handleCancel() {
      this.isShow = false;
    },
    // 个性化确定按钮
    async handleConfirm() {
      await this.getConfig(this.chooseList.join(','));
      this.initParams();
      this.handleSearch();
      this.isShow = false;
    },
    // 切换tab
    handleSwitch(item) {
      this.tabIndex = item.id;
      this.current = 1;
      this.handleSearch();
    },
    // 搜索值
    getSearchVal(e) {
      this.searchValue = e;
      if (!this.searchValue) return;
      this.current = 1;
      this.showRecent = false;
      const arr = uni.getStorageSync('globalSearchArr') || [];
      arr.push(e);
      if (arr.length > 10) {
        arr.shift();
      }
      const noRepeat = new Set(arr);
      uni.setStorageSync('globalSearchArr', [...noRepeat]);
      this.handleSearch();
    },
    // 处理搜索
    async handleSearch() {
      this.isloading = true;
      console.log('进来额', this.searchValue);
      // if (!this.searchValue) {
      //   this.showRecent = true;
      //   this.searchRes = [];
      //   return;
      // }

      let params = {};
      const page = {
        size: this.size,
        current: this.current
      };

      try {
        // 配置字段参数
        const configObj = {};
        console.log(this.curConfigObj);
        Object.keys(this.curConfigObj).forEach((id) => {
          // 需要选择的 item
          const config = this.curConfigObj[id];
          // 字段的详情
          const columnsInfo = [];
          config.config.filedArr.forEach((field) => {
            const column = {
              dict: 2,
              columnType: field.filedType,
              lambda: 'in',
              name: field.filedName,
              value: ''
            };
            // 字段为字典类型时
            if (field.isDict === 1 && field.dictObj.dictKey) {
              const dictData = this.$store.getters.getCurDict(field.dictObj.dictKey);
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
              columnsInfo
            }
          };
        });
        // 全部参数
        if (this.tabIndex === -1) {
          params = configObj;
          page.size = 3;
          page.current = 1;
        } else {
          params[this.tabIndex] = configObj[this.tabIndex];
        }
        // 请求接口
        const res = await selectData(params, page);
        console.log(res);
        if (this.current === 1) {
          this.searchRes = [];
        }

        // 菜单的判断，不走接口
        if (this.getMenuSearchRes.length) {
          console.log(this.getMenuSearchRes);
          // 全部只要3个菜单
          if (this.tabIndex === -1) {
            this.searchRes.push({
              id: -2,
              records: this.getMenuSearchRes.slice(0, 3)
            });
          } else if (this.tabIndex === -2) {
            // 当菜单时，显示所有菜单
            this.searchRes.push({
              id: -2,
              records: this.getMenuSearchRes
            });
          }
        }
        console.log('============', this.searchRes);
        // 接口值处理
        if (this.current === 1) {
          Object.keys(res).forEach((id) => {
            if (res[id].records.length) {
              this.searchRes.push({
                id,
                ...res[id]
              });
            }
          });
        } else {
          Object.keys(res).forEach((id) => {
            if (res[id].records.length) {
              if (this.searchRes.length) {
                this.searchRes[0].records.push(...res[id].records);
              } else {
                this.searchRes.push({
                  id,
                  ...res[id]
                });
              }
            }
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isloading = false;
      }
      console.log(this.searchRes);
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
        (...arr) => `${arr[1]}`
      );
      let str = formulaRes.replace(/\$variable_+([a-zA-Z0-9_]+)\$/g, (...arr) => data[arr[1]]);
      console.log(str);
      let res = parser.parse(str);
      console.log(res);
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
    // 跳转菜单
    jumpMenu(menu) {
      this.tabIndex = -1;
      this.current = 1;
      this.$store.dispatch('jumpMenu', {
        menuId: menu.id,
        isJump: 1,
        menuFilter: menu.menuFilter,
        filters: menu.menuFilter
      });
      // this.$bus.$emit('changeMenuTab', menu);
    },
    // 跳转符合条件的菜单
    jumpTermMenu(jumpTermData, jumpTermRes) {
      const curMenuArr = this.curConfigObj[jumpTermRes.id].config.menuAppList;
      console.log(curMenuArr);
      this.gotoMenu({ jumpMenu: curMenuArr, formData: jumpTermData });
    },
    // 删除近期搜索缓存
    delLastSearche() {
      this.recentSearch = [];
      uni.setStorageSync('globalSearchArr', []);
    },
    // 点击最近搜索
    clickLastSearchesItem(search) {
      this.searchValue = search;
      this.$refs.searchBox.keyword = search;
      this.showRecent = false;
      this.handleSearch();
    },
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
    }
  },
  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('common.globalSearch')
    });
    // #endif
    this.getConfig();
    this.recentSearch = uni.getStorageSync('globalSearchArr') || [];
    this.initFunc();
  }
};
</script>

<style lang='scss' scoped>
.search {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #fff;
  overflow: auto;
  &__tabs {
    background: #fff;
    position: relative;
    padding: 0 70rpx 0rpx 30rpx;
    height: 88rpx;
    // ::v-deep {
    //   .u-tabs__wrapper__nav__item {
    //     padding: 0;
    //   }
    //   .u-tabs__wrapper__nav__item__text {
    //     height: 48rpx;
    //     line-height: 48rpx;
    //     background: #f6f6f8;
    //     border-radius: 33rpx;
    //     padding: 0 20rpx;
    //     font-size: 28rpx;
    //     margin-right: 23rpx;
    //     color: #333333;
    //   }
    //   .u-tabs__wrapper__nav__line {
    //     display: none;
    //   }
    // }
    .appIcon-gengduo {
      position: absolute;
      top: 24rpx;
      right: 20rpx;
      font-size: 38rpx;
      color: #b8b8b8;
      background: #fff;
    }
  }
  &__select {
    color: #4689f5;
    background: #f1f7ff;
  }
  &__popup {
    margin: 30rpx 0 20rpx;
    &--item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 98rpx;
      padding: 0 30rpx;
      box-shadow: inset 0px -1px 0px 0px #f0f0f0;
      font-size: 32rpx;
      color: #333333;
    }
    &--font {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &--button {
      display: flex;
      margin: 20rpx 30rpx;
    }
    .appIcon-xialagouxuan {
      color: #4689f5;
      font-size: 30rpx;
    }
    .disableClass {
      opacity: 0.5;
    }
    &--item:last-child {
      box-shadow: none;
    }
  }
  &__resBox {
    // margin-top: 20rpx;
    color: #333333;
    &--title {
      font-size: 34rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      padding: 20rpx 30rpx;
      border-bottom: 1px solid #f0f0f0;
    }
    &--ul {
      padding: 0;
    }
    &--li {
      display: flex;
      align-items: center;
      font-size: 13rpx;
      flex-direction: row;
      font-size: 30rpx;
      margin: 0 30rpx;
      .myparse {
        width: 100%;
        margin-left: 30rpx;
        padding: 25rpx 0;
        border-bottom: 1px solid #f0f0f0;
        overflow: hidden;
      }
    }
  }
  ::v-deep {
    .nodata {
      height: 50%;
    }
  }
}
.lastSearches {
  padding: 0 30rpx;
  font-family: $--font-family;

  &__header {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #333333;
    .appIcon {
      padding-left: 30rpx;
      font-size: 19px;
      color: #bbc3cd;
    }
  }
  &__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
    color: #333333;
    &--item {
      margin: 18rpx 0 0 18rpx;
      padding: 15rpx 30rpx;
      background: #f6f6f8;
      border-radius: 20rpx;
    }
  }
}
</style>
