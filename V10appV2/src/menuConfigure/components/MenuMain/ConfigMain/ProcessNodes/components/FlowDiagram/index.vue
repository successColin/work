<!--
 * @Descripttion: 流程图谱
 * @Author: ytx
 * @Date: 2023-07-20 15:18:18
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-20 15:18:18
-->
<template>
  <div class="flowBox">
    <div class="cardMain" ref="cardMain">
      <movable-area scale-area class="movable-area">
        <movable-view
          ref="movableView"
          class="movable-view"
          direction="all"
          :scale="true"
          :inertia="true"
          :out-of-bounds="true"
          :scale-min="0.5"
          :scale-max="4"
          :scale-value="scale"
          :x="x"
          :animation="true"
        >
          <!-- 内容 -->
          <div
            class="cardMainWrap"
            ref="cardMainWrap"
            v-if="JSON.stringify(data) !== '{}'"
          >
            <div class="nodeMain" ref="nodeMain">
              <Node
                :data="data"
                :nodeArr="nodeArr"
                :approvalInfo="approvalInfo"
              ></Node>
              <section class="end-node">流程结束</section>
            </div>
          </div>
        </movable-view>
      </movable-area>
    </div>
    <!-- 状态 -->
    <div class="des">
      <div v-for="(item, i) in styleConfig" :key="i">
        <span class="m-r-20">
          <span class="stylesIcon m-r-6" :style="{ background: item.c }"></span>
          {{ item.n }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getFlowTree } from '@/api/pagesProcess.js';
import Node from './node';

export default {
  name: 'index',
  props: {
    instanceId: {
      type: [Number, String],
      default: ''
    },
    approvalInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      scale: 1,
      x: 0,
      styleConfig: [
        {
          c: '#5A80ED',
          n: '已流转'
        },
        {
          c: 'rgb(250, 183, 28)',
          n: '处理中'
        },
        {
          c: '#BBC3CD',
          n: '未流转'
        }
      ],
      data: {},
      nodeArr: []
    };
  },

  mounted() {
    if (this.instanceId) {
      this.init();
    }
  },
  components: {
    Node
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      const res = await getFlowTree({ instanceId: this.instanceId });
      const { treeVo = {}, nodes: nodeIds } = res;
      this.data = treeVo;
      this.nodeArr = nodeIds || [];
      console.log(11111111);
      this.$nextTick(() => {
        this.doScroll();
      });
    },
    doScroll() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select('.cardMainWrap')
        .boundingClientRect((data) => {
          this.x = -data.width / 4;
        })
        .exec();
    }
  }
};
</script>

<style lang='scss' scoped>
@import './index';

.movable-area {
  height: 100%;
  width: 100%;
}
.movable-view {
  height: 200%;
  width: 200%;
}

.flowBox {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  .des {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 88rpx;
    background: #ffffff;
    font-size: 29rpx;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;

    .stylesIcon {
      display: inline-block;
      width: 22rpx;
      height: 22rpx;
      border-radius: 4rpx;
    }
  }

  .cardMain {
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 50rpx;
    height: calc(100% - 88rpx);

    .cardMainWrap {
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
      transform-origin: center center;
      .nodeMain {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        transform-origin: 0 0;
      }
    }
  }

  ::v-deep {
    .user__name {
      max-width: 60px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
