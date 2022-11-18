<template>
  <section class="evaluation">
    <div
      :class="`evaluation__detail evaluation__detail${dividingType}`"
      v-if="dividingType === 1"
      @mouseleave="moveIndex = -1"
    >
      <i
        v-for="i in 5"
        :key="i"
        class="iconfont icon-shoucang"
        @mouseenter="moveIndex = i"
        @click="selectScore"
        :class="[{ active: i - 1 < getCurIndex }]"
      ></i>
      <span v-if="showContent">{{ getCurText }}</span>
    </div>
    <div
      :class="`evaluation__detail evaluation__detail${dividingType}`"
      v-if="dividingType === 2"
      @mouseleave="moveIndex = -1"
    >
      <i
        v-for="(item, i) in faceLineArr"
        :key="i"
        :class="`iconfont ${item.iconfont} ${i < getCurIndex && 'active'}`"
        @mouseenter="moveIndex = i + 1"
        @click="selectScore"
      ></i>
      <span v-if="showContent">{{ getCurText }}</span>
    </div>
    <div
      :class="`evaluation__detail evaluation__detail${dividingType}`"
      v-if="dividingType === 3"
      @mouseleave="moveIndex = -1"
    >
      <img
        v-for="(item, i) in faceArr"
        :key="i"
        :src="i === getCurIndex - 1 ? item.normal_sel : item.normal"
        @mouseenter="moveIndex = i + 1"
        @click="selectScore"
      />
      <span v-if="showContent">{{ getCurText }}</span>
    </div>
    <div
      :class="`evaluation__detail evaluation__detail${dividingType}`"
      v-if="dividingType === 4"
      @mouseleave="moveIndex = -1"
    >
      <i
        v-for="i in 5"
        :key="i"
        class="iconfont icon-youxianji"
        :class="[{ active: i - 1 < getCurIndex }]"
        @mouseenter="moveIndex = i"
        @click="selectScore"
      ></i>
      <span v-if="showContent">{{ getCurText }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    dividingType: {
      type: Number,
      default: 1
    },
    showContent: {
      type: Boolean,
      default: false
    },
    maxScore: {
      type: Number,
      default: 5
    },
    curValue: {
      type: [Number, String]
    },
    onlyRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      faceLineArr: [
        {
          iconfont: 'icon-jicha'
        },
        {
          iconfont: 'icon-cha'
        },
        {
          iconfont: 'icon-yiban'
        },
        {
          iconfont: 'icon-manyi'
        },
        {
          iconfont: 'icon-chaozan'
        }
      ],
      faceArr: [
        {
          normal: require('./image/1.svg'),
          normal_sel: require('./image/1_sel.svg')
        },
        {
          normal: require('./image/2.svg'),
          normal_sel: require('./image/2_sel.svg')
        },
        {
          normal: require('./image/3.svg'),
          normal_sel: require('./image/3_sel.svg')
        },
        {
          normal: require('./image/4.svg'),
          normal_sel: require('./image/4_sel.svg')
        },
        {
          normal: require('./image/5.svg'),
          normal_sel: require('./image/5_sel.svg')
        }
      ],
      textObj: {
        0: '极差',
        1: '差',
        2: '一般',
        3: '满意',
        4: '超赞'
      },
      moveIndex: -1
    };
  },
  computed: {
    getCurIndex() {
      if (this.moveIndex === -1 || this.onlyRead) {
        if (!this.curValue) {
          return -1;
        }
        const dis = this.maxScore / 5;
        const i = Math.floor(this.curValue / dis);
        return i;
      }
      return this.moveIndex;
    },
    getCurText() {
      if (this.getCurIndex === -1) {
        return '极差';
      }
      return this.textObj[this.getCurIndex];
    }
  },
  inject: ['isConfig'],
  components: {},
  mounted() {},
  methods: {
    selectScore() {
      if (this.onlyRead) {
        return false;
      }
      const dis = this.maxScore / 5;
      const v = this.moveIndex * dis;
      this.$emit('selectScore', v);
    }
  }
};
</script>

<style lang='scss' scoped>
.evaluation {
  &__detail {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: min-content;
    white-space: nowrap;
    i {
      font-size: 18px;
      margin-right: 8px;
      color: #d9d9d9;
      &.active {
        color: #fab71c;
      }
    }
    img {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    span {
      margin-left: 2px;
      color: #666666;
    }
  }
  &__detail4 {
    i.active {
      color: #ee5e5e;
    }
  }
}
</style>
