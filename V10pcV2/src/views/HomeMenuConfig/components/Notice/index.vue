/**
* @name: index
* @author: DELL
* @date: 2022/8/31 15:50
* @description：index
* @update: 2022/8/31 15:50
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap">
    <el-tabs v-model="activeName" :style="getTitleHeight">
      <el-tab-pane :name="item" v-for="item in titleArr" :key="item">
        <span slot="label" :style="getTitleNameStyles">{{ item }}</span>
      </el-tab-pane>
    </el-tabs>
    <div
        :style="getContentHeight"
        class="contentWrap"
        :id="`basicPie_${config.componentId}`"
        @mouseover="clear"
        @mouseout="begin"
    >
      <div
          v-for="(item, i) in msgList"
          :key="`${item.name}_${i}`"
          class="itemWrap"
          :style="getItemStyles"
      >
        <div :title="item.name">{{ item.name }}</div>
        <div>{{ item.time }}</div>
        <div>{{ item.issued }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const titleArr = ['通知公告', '部门动态', 'IT信息', '制度建设'];
const msgList = [
  {
    name: '市政府党组召开巡视整改专题民主生活会',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '市七届人大常委会第十一次会议闭幕',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '市政协党组会议：主动服务融入中心大局全力助推高质量发展',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '应对奥密克戎BA.5 深圳提升疫情快速处置力',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '我市拟修订优化职业技能培训载体认定奖补管理政策',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '深圳银保监局等部门握指成拳保外贸',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '我市首个刑事案件赔偿保证金提存制度出台',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '今年第三批居住用地9月底出让',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '安居鸿栖台公共住房项目封顶 提供人才住房1666套',
    time: '2022年08月31日',
    issued: 'admin'
  },
  {
    name: '深圳低空经济产业换挡提速 获批全国“民用无人驾驶航空试验区”',
    time: '2022年08月31日',
    issued: 'admin'
  },
];
export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    config: {
      type: Object,
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      titleArr,
      activeName: '通知公告',
      msgList,
      timer: null,
      timer1: null,
      transactionY: 0,
      scrollTime: 5, // 单位秒
      inside: false,
    };
  },

  components: {},

  computed: {
    getItemStyles() {
      const {
        stylesObj: {
          contentFontFamily,
          contentFontSize,
          contentColor,
          contentFontWeight,
          colHeight,
        }
      } = this.config;
      return {
        height: `${colHeight}px`,
        lineHeight: `${colHeight}px`,
        fontSize: `${contentFontSize}px`,
        fontFamily: contentFontFamily,
        fontWeight: contentFontWeight,
        color: contentColor,
        transform: `translateY(-${this.transactionY}px)`,
        transition: 'transform 500ms ease-in 0.5s'
      };
    },
    getContentHeight() {
      const { stylesObj: { titleHeight, animationSet } } = this.config;
      return {
        height: `calc(100% - ${titleHeight}px)`,
        overflow: (animationSet === 1 || !animationSet) ? 'auto' : 'hidden',
      };
    },
    getTitleHeight() {
      const { stylesObj: { titleHeight } } = this.config;
      return {
        height: `${titleHeight}px`
      };
    },
    getTitleNameStyles() {
      const {
        stylesObj: {
          titleFontFamily,
          titleFontSize,
          titleFontWeight,
          titleHeight
        }
      } = this.config;
      return {
        height: `${titleHeight}px`,
        lineHeight: `${titleHeight}px`,
        fontSize: `${titleFontSize}px`,
        fontFamily: titleFontFamily,
        fontWeight: titleFontWeight,
      };
    }
  },
  watch: {
    'config.stylesObj.animationSet': {
      handler(v) {
        if (v === 2) {
          this.init();
        } else {
          this.clear();
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    clear() {
      this.inside = true;
      if (this.timer1) clearTimeout(this.timer1);
      if (this.timer) clearTimeout(this.timer);
    },
    begin() {
      this.inside = false;
      this.init();
    },
    getDom() {
      const { componentId } = this.config;
      return document.querySelector(`#basicPie_${componentId}`);
    },
    checkIsRight() {
      const { stylesObj: { colHeight, animationSet } } = this.config;
      if (animationSet === 1 || !animationSet) return false;
      const dom = this.getDom();
      if (dom) {
        const { height } = dom.getBoundingClientRect();
        if (height < (colHeight * 10 * this.scale)) {
          return true;
        }
        return false;
      }
      return false;
    },
    init() { // 初始化
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
      const { stylesObj: { colHeight } } = this.config;
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
    }
  },
  beforeDestroy() {
    this.clear();
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;

  ::v-deep {
    .el-tabs .el-tabs__item {
      padding: 0 20px;
      height: unset;
      line-height: unset;
    }
  }

  .contentWrap {
    //overflow: hidden;

    .itemWrap {
      display: flex;
      &> div {
        overflow: hidden;
        box-sizing: border-box;
        cursor: pointer;
        &:hover{
          opacity: 0.7;
        }
      }
      & > div:nth-child(1) {
        flex: 0 0 68%;
        padding-left: 20px;
        &:hover{
          text-decoration:underline;
        }
      }

      & > div:nth-child(2) {
        flex: 0 0 22%;
      }
      & > div:nth-child(3) {
        flex: 0 0 10%;
      }
    }
  }
}

</style>
