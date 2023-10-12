<!--
 * @Author: tjf
 * @Date: 2022-12-12 09:22:18
 * @Last Modified by: tjf
 * @Last Modified time: 2022-12-12 09:22:18
 * @Desc: 日历
-->
<template>
  <div class="calendar">
    <apiot-navbar v-if="!hasDing" :title="title" :backLevel="999">
    </apiot-navbar>
    <view class="calendar__content">
      <apiot-calendar
        ref="calendar"
        :insert="true"
        :showType="showType"
        class="uniCalendar"
        :isVisiabled="false"
        @changeType="changeCalendarType"
        @change="handleClickDate"
        @dateChange="dateChange"
        :signStyle="config.signStyle"
        :businessData="businessData"
      >
      </apiot-calendar>
    </view>
    <view class="calendar__business">
      <view
        class="calendar__business__item"
        @click="clickBusiness(item, item.relateType)"
        v-for="(item, i) in config.children"
        :key="i"
      >
        <!-- 图标 -->
        <p class="calendar__business__item--icon">
          <view class="icon">
            <gradient-icon
              v-if="item.icon.icon"
              :icon="item.icon.icon"
              :color="item.icon.color"
              :size="80"
              :enableGradient="item.enableGradient"
              :gradientObj="item.gradientObj"
            ></gradient-icon>
            <u-image
              v-else
              :src="$apiot.getComIconUrl(item.icon)"
              mode="widthFix"
              height="100%"
              :showError="false"
              :fade="false"
            ></u-image>
          </view>
          <span class="menuTitle font__ellipsis">{{ item.name }}</span>
          <span
            class="menuCount"
            :class="[businessClass(item)]"
            v-if="item.summaryStyle === 1"
          >
            {{ businessDay(item).unfinishedAccount }}</span
          >
          <span class="menuCount" :class="[businessClass(item)]" v-else>
            {{ businessDay(item).finishedAccount }}/{{
              businessDay(item).unfinishedAccount +
              businessDay(item).finishedAccount
            }}</span
          >
        </p>
      </view>
    </view>
    <view class="calendar__announce" v-if="announcelist.length > 0">
      <view class="calendar__announce__head">
        <i class="appIcon appIcon-gonggao"></i>公告
      </view>
      <view class="calendar__announce__list">
        <view
          class="calendar__announce__list__item"
          v-for="(item, ind) in announcelist"
          @click="goToAnnounce(item)"
          :key="ind"
        >
          <view class="time">{{ item.createTime }}</view>
          <view class="title">{{ item.title }}</view>
          <view class="content">{{ item.txt }}</view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import GradientIcon from '@/MenuHome/components/GradientIcon';
import parser from '@/utils/formula';
import { getBusinessInfo, getAnnounceInfo } from '@/api/calendar';
import apiotCalendar from './components/calendar/uni-calendar.vue';

export default {
  name: 'calendar',
  components: { apiotCalendar, GradientIcon },

  props: {},

  data() {
    return {
      title: '日历',
      info: {
        lunar: true,
        range: false,
        insert: true,
        showMonth: false
      },
      config: {},
      showType: 'month',
      announcelist: [],
      oldDate: '',
      hiddenArr: [],
      businessParams: [],
      businessData: [],
      currentDate: '',
      hasDing: false
    };
  },

  computed: {
    statusClass(item) {
      return item.summaryStyle;
    },
    businessDay() {
      return (item) => {
        if (!this.businessData.length) {
          return {
            unfinishedAccount: 0,
            finishedAccount: 0
          };
        }
        const data = this.businessData.filter((obj) => obj.business === item.compId)[0];
        const day = data
          ? data.calendarInfoList.filter((obj) => obj.date === this.currentDate)
          : [];
        if (day.length === 0) {
          return {
            unfinishedAccount: 0,
            finishedAccount: 0
          };
        }
        return day[0];
      };
    }
  },
  watch: {},

  methods: {
    navBack() {
      uni.reLaunch({ url: '/MenuHome/index' });
    },
    businessClass(item) {
      let classname = '';
      const day = this.businessDay(item);
      if (day.unfinishedAccount === 0 && day.finishedAccount > 0) {
        classname = 'finished';
      } else if (day.unfinishedAccount > 0 && day.finishedAccount === 0) {
        classname = 'unstart';
      } else if (day.unfinishedAccount > 0 && day.finishedAccount > 0) {
        classname = 'unfinished';
      } else {
        classname = 'none';
      }
      return classname;
    },
    clickBusiness(item, type) {
      if (+type === 1) {
        this.gotoPanel(item.skipPaneConfig);
      } else if (+type === 2) {
        this.gotoMenu(item.skipMenuConfig);
      }
    },
    // 跳转面板
    gotoPanel(panelConfig) {
      const { curPaneObj } = panelConfig;
      curPaneObj.panelFilter.forEach((item, index) => {
        const { filterTermStr, filterTermSql, filterTermType } = item;
        if (filterTermType === 1) {
          // 普通的过滤条件
          const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
          curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr
            ? JSON.stringify(newFilterTermStr)
            : '';
        }
        if (filterTermType === 2) {
          // sql过滤条件
          const str = this.reduceSqlFilter(filterTermSql);
          curPaneObj.panelFilter[index].filterTermSql = str;
        }
      });
      if (curPaneObj && curPaneObj.panelName) {
        this.$store.dispatch('jumpPanel', {
          panel: curPaneObj,
          sourceFlagId: curPaneObj.id,
          urlParams: { mustLoad: true },
          isCunstom: true
          // formData: panelFixData
        });
      }
    },
    // 跳转菜单
    gotoMenu(skipMenuConfigApp) {
      if (skipMenuConfigApp.length === 0) return;
      const obj = skipMenuConfigApp.find((menu) => {
        // 根据格式过滤可以跳转的菜单
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.formulaConversion(menu.jumpTerm);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        const menu = JSON.parse(JSON.stringify(obj)); // 避免对象污染
        const { menuFilter } = menu;
        const config = { sourceFlagId: this._uid };
        if (menuFilter) {
          config.filters = {};
          config.map = {};
          menuFilter.forEach((item, index) => {
            const { filterTermStr, filterTermSql, filterTermType, compId } = item;
            if (filterTermType === 1) {
              // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
              item.filterTermStr = newFilterTermStr ? JSON.stringify(newFilterTermStr) : '';
            }
            if (filterTermType === 2) {
              // sql过滤条件
              const str = this.reduceSqlFilter(filterTermSql);
              item.filterTermSql = str;
            }
            if (config.filters[compId]) config.filters[compId].push(item);
            else config.filters[compId] = [item];
          });
          console.log(menuFilter);
          this.$bus.$emit('clickMenu', {
            menu: { id: obj.id },
            menuFilter,
            config
          });
        } else {
          uni.showToast({
            icon: 'none',
            title: '您没有该跳转菜单的权限'
          });
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有符合条件的菜单'
        });
      }
    },
    reduceNormalFilter(filterTermStr) {
      // 处理普通的过滤条件
      const newFilterTermStr = filterTermStr ? JSON.parse(filterTermStr) : {};
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            const result = this.formulaConversion(content);
            term.valueType = 1;
            term.content = result;
          }
        });
      });
      if (JSON.stringify(newFilterTermStr) === '{}') {
        return '';
      }
      return newFilterTermStr;
    },
    // 处理公式
    formulaConversion(formulaStr) {
      let str = this.regProcess(formulaStr);
      let res = parser.parse(`${str}`);
      if (res.error) {
        str = str.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // console.log(res);
      // 最终错误把字符串返回
      if (res.error) {
        return false;
      }
      return res.result;
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
    reduceSqlFilter(filterTermSql) {
      // 处理sql过滤条件
      let str = this.regProcess(filterTermSql);
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    },
    handleClickDate(e) {
      console.log(e);
    },
    changeCalendarType(type) {
      // this.showType = type;
    },
    async dateChange(obj, type) {
      let year = '';
      let month = '';
      let day = '';
      if (!obj) {
        year = new Date().getFullYear();
        month = new Date().getMonth() + 1;
        day = new Date().getDate();
      } else {
        year = obj.year;
        month = obj.month;
        day = obj.date;
      }
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;
      const date = `${year}-${month}`;
      let startTime = '';
      let endTime = '';
      if (date !== this.oldDate) {
        startTime = `${year}-${month}-01`;
        endTime = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
      }
      if (type === 'change' && this.oldDate !== date) {
        await this.doGetBusinessInfo(startTime, endTime);
      }
      this.currentDate = `${year}-${month}-${day}`;
      this.doGetAnnounceInfo(this.currentDate);
      // eslint-disable-next-line no-debugger
      // debugger;
      this.oldDate = date;
    },
    resolveFormula(formulaStr, data) {
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
      let res = parser.parse(str);
      console.log(res);
      if (res.error) {
        str = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // 最终错误把字符串返回
      if (res.error) {
        return `${str}`;
      }
      return res.result;
    },
    setHiddenArr() {
      const { hiddenRules = [] } = this.config;
      hiddenRules.forEach((rule) => {
        const res = this.resolveFormula(rule.content);
        if (res) {
          this.hiddenArr.push(...rule.tabs);
        }
      });
    },
    async init() {
      await this.setHiddenArr();
      const { children } = this.config;
      this.businessParams = [];
      const businessArr = children.map((item) => {
        const { completeFilter, incompleteFilter, tableObj, columnObj, compId } = item;
        const index = this.hiddenArr.indexOf(compId);
        const obj = {
          finishedParam: JSON.stringify(completeFilter) || '',
          unfinishedParam: JSON.stringify(incompleteFilter) || '',
          tableName: tableObj.tableName,
          columnName: columnObj.columnName,
          business: compId
        };
        if (this.hiddenArr.indexOf(compId) === -1) {
          this.businessParams.push(obj);
        }
        return obj;
      });
      console.log(123);
      await this.dateChange(null, 'change');
    },
    async doGetBusinessInfo(startTime, endTime) {
      const data = {
        startTime,
        endTime,
        businessParams: this.businessParams
      };
      const res = await getBusinessInfo(data);
      this.businessData = res;
    },
    async doGetAnnounceInfo(date) {
      const res = await getAnnounceInfo({ date });
      this.announcelist = res;
    },
    goToAnnounce(item) {
      uni.navigateTo({
        url: `/Notice/NoticeDetail/index?id=${item.id}`
      });
    }
  },

  activated() {},

  mounted() {},
  onLoad(option) {
    // #ifdef MP-ALIPAY
    this.hasDing = true;
    // #endif
    this.title = option.title;
    this.config = this.$store.state.menu.systemMenusConfig[option.id];
    this.init();
    console.log(this.config);
    if (this.config.viewStyle === 2) {
      this.showType = 'day';
    } else {
      this.showType = 'month';
    }
    console.log(this.showType);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
