<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageList">
    <div class="header">
      <view class="commandSelect">
        <picker
          @change="handleCommand"
          :value="command"
          range-key="label"
          :range="dropdownArr"
        >
          <view class="command">
            {{ dropdownArr[commandIndex].label }}
            <i class="appIcon appIcon-xialasanjiao"></i>
          </view>
        </picker>
      </view>
      <div class="header__right">
        <label class="checkbox">
          <checkbox-group @change="changeOnlyUnread">
            <div class="checkbox-box">
              <i
                v-show="isOnlyUnread"
                class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"
              ></i>
              <checkbox
                value="isOnlyUnread"
                :checked="isOnlyUnread"
                class="checkbox-style"
                :class="[{ showSelect: !isOnlyUnread }]"
              />
            </div>
          </checkbox-group>
          <span>{{ $t('message.OnlyUnread') }}</span>
        </label>
        <span class="line m-r-10"></span>
        <span>
          <i @click="markAllRead" class="appIcon appIcon-quanbusheweiyidu"></i>
        </span>
      </div>
    </div>
    <view
      class="messageListTemp"
      v-show="computedHeight > 0"
      :style="{ height: `${computedHeight}px` }"
    >
      <u-list
        class="content"
        v-if="messageArr.length > 0"
        @scrolltolower="getPageInnerMailList"
        ref="card"
        :height="computedHeight"
        :preLoadScreen="3"
        :pagingEnabled="true"
      >
        <u-list-item
          v-for="(item, index) in messageArr"
          :key="item.id"
          :anchor="item.id"
        >
          <view class="content__item">
            <message-item
              :type="type"
              :class="[{ animateListClick: focusIndex === index }]"
              :focusIndex.sync="focusIndex"
              @clickNode="clickNode"
              @clickMessage="clickMessage"
              :index="index"
              :message="item"
            ></message-item>
          </view>
        </u-list-item>
      </u-list>
      <apiot-list-nodata
        v-else-if="!isLoading && messageArr.length === 0"
      ></apiot-list-nodata>
    </view>
  </div>
</template>

<script>
import { getPageInnerMail, markMailAllRead, getByCode } from '@/api/message.js';
import { getNodeAttr } from '@/api/pagesProcess.js';
import MessageItem from '../MessageItem/index.vue';
import parser from '@/utils/formula';

// let getAllPaneBack = null;
export default {
  name: 'MessageList',
  components: { MessageItem },

  props: {
    type: {
      type: String,
      default: 'WORK_FLOW'
    },
    sysMenuId: {
      type: String,
      default: null
    },
    compId: {
      type: String,
      default: ''
    }
  },

  // mixins: [elementMixin],

  data() {
    return {
      dropdownArr: [
        {
          label: '全部消息',
          key: 'all'
        },
        {
          label: this.$t('message.ThisWeek'),
          key: 'ThisWeek'
        },
        {
          label: this.$t('message.ThisMonth'),
          key: 'ThisMonth'
        },
        {
          label: this.$t('message.NearlyThreeMonths'),
          key: 'NearlyThreeMonths'
        },
        {
          label: this.$t('message.NearlyHalfYear'),
          key: 'NearlyHalfYear'
        },
        {
          label: this.$t('message.CurrentYear'),
          key: 'CurrentYear'
        }
      ],
      commandIndex: 0,
      isOnlyUnread: false,
      messageArr: [],
      command: 'all',
      page: 1,
      size: 20,
      focusIndex: null,
      isLoading: false
    };
  },

  computed: {
    computedHeight() {
      const { windowHeight, navbarHeight } = this.$store.state.base.systemInfo;
      const height = windowHeight - navbarHeight - 50;
      return height;
    }
  },

  methods: {
    changeOnlyUnread(e) {
      this.messageArr = [];
      this.page = 1;
      if (e.detail.value.length) {
        this.isOnlyUnread = true;
      } else {
        this.isOnlyUnread = false;
      }
      this.getPageInnerMailList();
    },
    // 获取消息列表
    getPageInnerMailList() {
      try {
        const param = {
          current: this.page,
          size: this.size,
          orders: [
            {
              asc: true,
              column: 'hasRead'
            },
            {
              asc: false,
              column: 'sendTime'
            }
          ]
        };
        uni.showLoading({
          title: '加载中'
        });
        this.isLoading = true;
        if (this.isOnlyUnread) {
          param.hasRead = false;
        }
        if (this.command && this.command !== 'all') {
          param.sendTime = this.getSendTime(this.command);
        }
        getPageInnerMail(param).then((res) => {
          if (res.records.length) {
            this.messageArr = this.messageArr.concat(res.records);
            console.log(this.messageArr);
            this.page += 1;
          }
          uni.hideLoading();
          this.isLoading = false;
        });
      } catch (err) {
        uni.hideLoading();
        this.isLoading = false;
      }
    },
    handleCommand(e) {
      const { value } = e.detail;
      this.commandIndex = value;
      this.command = this.dropdownArr[value].key;
      this.messageArr = [];
      this.page = 1;
      this.getPageInnerMailList();
    },
    getSendTime(type) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDay();
      const number = date.getDate();
      const t = date.getTime();
      let result = '';
      if (type === 'ThisWeek') {
        console.log(type);
        const minDay = day === 0 ? 6 : day - 1;
        console.log(t - minDay * 24 * 60 * 60 * 1000);
        const newDate = new Date(t - minDay * 24 * 60 * 60 * 1000);
        result = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()} 00:00:00`;
      } else if (type === 'ThisMonth') {
        const m = month + 1 >= 10 ? month + 1 : `0${month + 1}`;
        result = `${year}-${m}-01 00:00:00`;
      } else if (type === 'NearlyThreeMonths') {
        const newMonth = month >= 3 ? month - 2 : month + 10;
        const newYear = month >= 3 ? year : year - 1;
        // eslint-disable-next-line no-nested-ternary
        const newNumber = newMonth === 2 && number > 28 ? 28 : number > 30 ? 30 : number;
        result = `${newYear}-${newMonth}-${newNumber} 00:00:00`;
      } else if (type === 'NearlyHalfYear') {
        const newMonth = month >= 6 ? month - 5 : month + 7;
        const newYear = month >= 6 ? year : year - 1;
        // eslint-disable-next-line no-nested-ternary
        const newNumber = newMonth === 2 && number > 28 ? 28 : number > 30 ? 30 : number;
        result = `${newYear}-${newMonth}-${newNumber} 00:00:00`;
      } else if (type === 'CurrentYear') {
        result = `${year}-01-01 00:00:00`;
      } else if (type === 'all') {
        result = '';
      }
      return result;
    },
    markAllRead() {
      markMailAllRead().then(() => {
        this.messageArr = this.messageArr.map((item) => {
          const obj = {
            ...item,
            hasRead: true
          };
          return obj;
        });
      });
    },
    // 获取节点配置信息
    async getNodeAttr(nodeId) {
      try {
        const result = await getNodeAttr({ nodeId });
        const config = JSON.parse(result.attributes);
        config.workflowVersionId = result.workflowVersionId;
        this.$store.commit('setProcessConfig', { nodeId, config });
      } catch (error) {
        console.error(error);
      }
    },
    // 点击按钮
    async clickNode(variablesStr) {
      const node = await getByCode({ code: variablesStr });
      // 跳转至审批详情
      const { appPanelId, instanceName, instanceId, dataId, nodeId, taskId } = node;
      if (!appPanelId) return;
      const { processConfigs } = this.$store.state.process;
      if (!processConfigs[nodeId]) await this.getNodeAttr(nodeId);

      uni.navigateTo({
        url: `/menuConfigure/index?id=${appPanelId}&title=${instanceName}&isProcess=true&workflowDataId=${dataId}&instanceId=${instanceId}&processNodeId=${nodeId}&taskId=${taskId}`,
        animationType: 'slide-in-right'
      });
    },
    clickMessage(skipMenuConfigApp, variablesStr, type) {
      if (+type === 2) {
        this.gotoPanel(skipMenuConfigApp, variablesStr);
      } else if (+type === 3) {
        this.gotoMenu(skipMenuConfigApp, variablesStr);
      }
    },
    // 跳转面板
    // doSpringPanel(panelConfig, variablesStr) {
    //   const { curPaneObj } = panelConfig;
    //   if (curPaneObj && curPaneObj.id) {
    //     curPaneObj.panelFilter.forEach((item, index) => {
    //       // 将公式值处理成固定值
    //       const { filterTermStr, filterTermSql, filterTermType } = item;
    //       if (filterTermType === 1) {
    //         // 普通的过滤条件
    //         const newFilterTermStr = this.reduceNormalFilter(filterTermStr, variablesStr);
    //         curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr
    //           ? JSON.stringify(newFilterTermStr)
    //           : '';
    //       }
    //       if (filterTermType === 2) {
    //         // sql过滤条件
    //         const str = this.reduceSqlFilter(filterTermSql);
    //         curPaneObj.panelFilter[index].filterTermSql = str;
    //       }
    //     });
    //     // const { panelData } = curPaneObj;
    //     const panelFixData = {};
    //     // if (panelData && panelData.length) {
    //     //   panelData.forEach((item) => {
    //     //     const {
    //     //       field,
    //     //       paneComp: { compId }
    //     //     } = item;
    //     //     panelFixData[compId] = FIXED_OBJ[field] || field;
    //     //   });
    //     // }
    //     curPaneObj.panelFixData = panelFixData;
    //     this.panelConfig = panelConfig;
    //     // 不同路由用vuex进行管理
    //     this.$store.commit('setMenuPanelFilter', {
    //       sourceFlagId,
    //       data: { ...panelObj.panelVarObj, panelFilter: panelObj.panelFilter },
    //     });
    //     const panel = this.reduceNormalFilter(curPaneObj, variablesStr);
    //     this.$store.commit('setMenuPanelDataTrans', {
    //       sourceFlagId,
    //       data: panelObj.panelDataTrans
    //     });
    //     if (curPaneObj && curPaneObj.panelName) {
    //       uni.navigateTo({
    //         url: `/menuConfigure/index?id=${panel.id}&title=${
    //           panel.panelName
    //         }&isPanel=true&ejectComId=${this.compId}&parentCompId=${
    //           this.compId
    //         }&sourceFlagId=${
    //           this.compId
    //         }_${this._uid}`,
    //         animationType: 'slide-in-right'
    //       });
    //     }
    //   }
    // },
    // 跳转面板
    gotoPanel(panelConfig, variablesStr) {
      const { curPaneObj } = panelConfig;
      curPaneObj.panelFilter.forEach((item, index) => {
        const { filterTermStr, filterTermSql, filterTermType } = item;
        if (filterTermType === 1) {
          // 普通的过滤条件
          const newFilterTermStr = this.reduceNormalFilter(filterTermStr, variablesStr);
          curPaneObj.panelFilter[index].filterTermStr = JSON.stringify(newFilterTermStr);
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
    gotoMenu(skipMenuConfigApp, variablesStr) {
      if (skipMenuConfigApp.length === 0) return;
      const obj = skipMenuConfigApp.find((menu) => {
        // 根据格式过滤可以跳转的菜单
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.formulaConversion(menu.jumpTerm, variablesStr);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        const menu = this.$store.state.menu.menusObj[obj.id];
        if (menu) {
          obj.menuVarObj = {};
          obj.menuFilter.forEach((item, index) => {
            const { filterTermStr, filterTermSql, filterTermType } = item;
            if (filterTermType === 1) {
              // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(filterTermStr, variablesStr);
              obj.menuFilter[index].filterTermStr = JSON.stringify(newFilterTermStr);
            }
            if (filterTermType === 2) {
              // sql过滤条件
              const str = this.reduceSqlFilter(filterTermSql);
              obj.menuFilter[index].filterTermSql = str;
            }
          });
          // 不同路由用vuex进行管理
          // this.$store.commit('setJumpMenuFilter', {
          //   sourceFlagId: obj.id,
          //   data: { ...obj.menuVarObj, menuFilter: obj.menuFilter }
          // });
          this.$store.dispatch('jumpMenu', {
            menuFilter: obj.menuFilter,
            menuId: obj.id,
            isJump: 1
            // formData: panelFixData
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
    reduceNormalFilter(filterTermStr, variablesStr) {
      // 处理普通的过滤条件
      const newFilterTermStr = filterTermStr ? JSON.parse(filterTermStr) : {};
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            if (content.indexOf('$variable_') !== -1) {
              // const name = content.split('$variable_')[1].split('$')[0];
              term.valueType = 1;
              term.content = this.formulaVariable(content, variablesStr);
            } else {
              const result = this.formulaConversion(content);
              term.valueType = 1;
              term.content = result;
            }
          }
        });
      });
      if (JSON.stringify(newFilterTermStr) === '{}') {
        return '';
      }
      return newFilterTermStr;
    },
    formulaVariable(text, variablesStr) {
      const res = text.replace(/\$variable_+([a-zA-Z0-9]+)\$/g, (...arr) => variablesStr[arr[1]]);
      return res;
    },
    // 处理公式
    formulaConversion(formulaStr, variablesStr) {
      console.log(formulaStr);
      let str = this.regProcess(formulaStr, variablesStr);
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
    regProcess(str = '', variablesStr) {
      // 将公式中的特殊字符去除
      if (!str) return '';
      let formulaRes = str
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
      let newStr = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );
      if (variablesStr) {
        newStr = newStr.replace(/\$variable_+([a-zA-Z0-9]+)\$/g, (...arr) => variablesStr[arr[1]]);
      }
      return newStr;
    },
    reduceSqlFilter(filterTermSql, variablesStr) {
      // 处理sql过滤条件
      let str = this.regProcess(filterTermSql, variablesStr);
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    }
  },

  mounted() {
    this.getPageInnerMailList();
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
