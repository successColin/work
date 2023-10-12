/** * @name: index * @author: DELL * @date: 2022/8/31 15:50 *
@description：index * @update: 2022/8/31 15:50 */
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles" v-loading="loading">
    <el-tabs
      v-model="activeName"
      :style="getTitleHeight"
      @tab-click="handleSelect"
    >
      <el-tab-pane
        :name="`${item.id}`"
        v-for="item in titleArr"
        :key="`${item.id}`"
      >
        <span slot="label" :style="getTitleNameStyles"
          >{{ item.name }}({{ item.count }})</span
        >
      </el-tab-pane>
    </el-tabs>
    <div
      :style="getContentHeight"
      class="contentWrap"
      :id="`basicPie_${config.componentId}`"
      @mouseover="clear"
      @mouseout="begin"
    >
      <div class="apiotNoData" v-if="!msgList.length"></div>
      <div
        v-for="(item, i) in msgList"
        :key="`${item.name}_${i}`"
        class="itemWrap"
        :style="getItemStyles"
      >
        <div :title="item.title" @click="look(item)">
          {{ item.title }}
          <span v-if="item.isHaveRead === 2" class="isRead"></span>
        </div>
        <div :title="item.createTime">{{ item.createTime }}</div>
        <div :title="item.memo">{{ item.memo || 'admin' }}</div>
      </div>
    </div>
    <apiot-drawer
      :append-to-body="true"
      :visible.sync="visible"
      destroy-on-close
      @closed="begin"
      :hasFooter="false"
      ref="apiotDrawer"
      :title="lookInfo.title"
    >
      <div class="noticeContent">
        <div v-html="lookInfo.html"></div>
        <div class="noticeEdit">编辑:{{ lookInfo.memo || 'admin' }}</div>
        <div class="noticeEdit">发布时间:{{ lookInfo.createTime }}</div>
      </div>
    </apiot-drawer>
  </div>
</template>

<script>
import {
  getNoticeGroup,
  getNoticeListById,
  getNoticeDetial,
} from '@/api/homePage';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    config: {
      type: Object,
      default: () => {},
    },
    scale: {
      type: Number,
      default: 1,
    },
    activeComponent: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      lookInfo: {},
      loading: false,
      titleArr: [],
      activeName: '通知公告',
      msgList: [],
      timer: null,
      timer1: null,
      transactionY: 0,
      scrollTime: 5, // 单位秒
      inside: false,
      visible: false,
    };
  },

  components: {},

  computed: {
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    },
    getContentStyles() {
      const { width, height, top, left, stylesObj } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getItemStyles() {
      const {
        stylesObj: {
          contentFontFamily,
          contentFontSize,
          contentColor,
          contentFontWeight,
          colHeight,
        },
      } = this.config;
      const obj = {
        height: `${colHeight}px`,
        lineHeight: `${colHeight}px`,
        fontSize: `${contentFontSize}px`,
        fontFamily: contentFontFamily,
        fontWeight: contentFontWeight,
        color: contentColor,
      };
      if (this.transactionY) {
        return {
          ...obj,
          transform: `translateY(-${this.transactionY}px)`,
          transition: 'transform 500ms ease-in 0.5s',
        };
      }
      return obj;
    },
    getContentHeight() {
      const {
        stylesObj: { titleHeight, animationSet },
      } = this.config;
      return {
        height: `calc(100% - ${titleHeight}px)`,
        overflow: animationSet === 1 || !animationSet ? 'auto' : 'hidden',
      };
    },
    getTitleHeight() {
      const {
        stylesObj: { titleHeight },
      } = this.config;
      return {
        height: `${titleHeight}px`,
      };
    },
    getTitleNameStyles() {
      const {
        stylesObj: {
          titleFontFamily,
          titleFontSize,
          titleFontWeight,
          titleHeight,
        },
      } = this.config;
      return {
        height: `${titleHeight}px`,
        lineHeight: `${titleHeight}px`,
        fontSize: `${titleFontSize}px`,
        fontFamily: titleFontFamily,
        fontWeight: titleFontWeight,
      };
    },
  },
  mounted() {
    const {
      stylesObj: { dataShowType },
    } = this.config;
    if (dataShowType === 1) {
      // 全部
      this.allInit();
    }
    if (dataShowType === 2) {
      // 分组
      this.initData();
    }
  },
  methods: {
    async look(item) {
      this.clear();
      const res = await getNoticeDetial({
        id: item.id,
        userId: this.getUserId,
      });
      item.isHaveRead = 1;
      this.lookInfo = res;
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    allInit() {
      this.fetchNoticeList({
        status: 2,
        userId: this.getUserId,
      });
    },
    async fetchNoticeList(params) {
      this.loading = true;
      try {
        const msgList = await getNoticeListById(params);
        this.msgList = msgList;
        if (this.config.stylesObj.dataShowType === 1) {
          this.titleArr = [{ name: '全部', id: 0, count: msgList.length }];
          this.activeName = '0';
        }
        this.loading = false;
        this.$nextTick(() => {
          this.init();
        });
      } catch (e) {
        this.clear();
        this.loading = false;
      }
    },
    async handleSelect({ name }) {
      if (name === '0') return;
      this.activeName = name;
      this.transactionY = 0;
      // this.msgList = [];
      this.clear();
      await this.fetchNoticeList({
        status: 1,
        userId: this.getUserId,
        groupId: name,
      });
    },
    clear() {
      if (this.timer1) clearTimeout(this.timer1);
      if (this.timer) clearTimeout(this.timer);
    },
    begin() {
      if (!this.visible) {
        this.init();
      }
    },
    getDom() {
      const { componentId } = this.config;
      return document.querySelector(`#basicPie_${componentId}`);
    },
    checkIsRight() {
      const {
        stylesObj: { colHeight, animationSet },
      } = this.config;
      if (animationSet === 1 || !animationSet) return false;
      const dom = this.getDom();
      if (dom) {
        const { height } = dom.getBoundingClientRect();
        const n = this.msgList.length;
        if (height < colHeight * n * this.scale) {
          return true;
        }
        return false;
      }
      return false;
    },
    async initData() {
      // 分组
      try {
        this.loading = true;
        const groupList = await getNoticeGroup({ userId: this.getUserId });
        if (groupList.length) {
          const { id } = groupList[0];
          this.titleArr = groupList;
          this.activeName = `${id}`;
          await this.fetchNoticeList({
            status: 1,
            userId: this.getUserId,
            groupId: id,
          });
        }
      } catch (e) {
        this.loading = false;
      }
    },
    async init() {
      // 初始化
      if (this.checkIsRight()) {
        this.start();
      }
    },
    start() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.startAnimation();
      }, this.scrollTime * 1000);
    },
    startAnimation() {
      const obj = this.msgList[0];
      this.msgList.push(obj);
      const {
        stylesObj: { colHeight },
      } = this.config;
      this.transactionY = colHeight;
      if (this.timer1) {
        clearTimeout(this.timer1);
      }
      this.timer1 = setTimeout(() => {
        this.msgList.shift();
        this.transactionY = 0;
      }, 1000);
      this.$nextTick(() => {
        this.start();
      });
    },
  },
  beforeDestroy() {
    console.log('消耗');
    this.clear();
  },
  name: 'index',
};
</script>

<style lang="scss" scoped>
.singleTextWrap {
  position: absolute;
  width: 100%;
  height: 100%;

  ::v-deep {
    .el-tabs .el-tabs__item {
      //padding: 0 20px;
      height: unset;
      line-height: unset;
    }
  }

  .contentWrap {
    overflow: hidden;

    .itemWrap {
      display: flex;
      position: relative;
      & > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      & > div:nth-child(1) {
        flex: 0 0 68%;
        padding-left: 20px;
        &:hover {
          text-decoration: underline;
        }
      }

      & > div:nth-child(2) {
        flex: 0 0 22%;
      }
      & > div:nth-child(3) {
        flex: 0 0 10%;
      }
      .isRead {
        display: inline-block;
        //position: absolute;
        //content: '';
        width: 8px;
        height: 8px;
        //top: 24%;
        margin-left: 5px;
        vertical-align: super;
        background: red;
        border-radius: 50%;
      }
    }
  }
}
.noticeContent {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  .noticeEdit {
    line-height: 28px;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
}
</style>
