<!--
 * @Descripttion: 更新日志
 * @Author: ytx
 * @Date: 2021-06-04 09:23:46
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-04 09:23:46
-->
<template>
  <div class="updateLog ShowIndex" ref="middleContent">
    <div>
      <div style="height: 40px"></div>
      <el-timeline>
        <el-timeline>
          <el-timeline-item
            v-for="(item, i) in activities"
            :key="i"
            :timestamp="`${item.logUpdateTime} ${item.name}`"
            placement="top"
            :class="`p_${item.timeDate}`"
          >
            <div class="contentBox">
              <!-- 三角形 -->
              <div class="updateLog__triangle"></div>
              <div v-html="htmlVal(item.html)" class="apiotWangeditor"></div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-timeline>
    </div>
    <position-ele :position="position" :jumpToEle="jumpToEle"></position-ele>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { getlistDetailShow } from '@/api/helpCenter';
import { Decrypt } from '@/utils/utils';
import PositionEle from '../components/PositionEle';

export default {
  data() {
    return {
      parentId: 4,
      scroll: null,
      activities: [],
      // 定位数组
      position: []
    };
  },
  components: {
    PositionEle
  },
  computed: {
    htmlVal() {
      return function (html = '') {
        if (html) {
          html = html.replace(/token=[^"]*/g, () => `token=${Decrypt(localStorage.token)}`);
        }
        return html;
      };
    }
  },
  watch: {},
  mounted() {
    this.initScroll();
    this.getlistDetail();
  },
  methods: {
    init() {
      this.getlistDetail();
    },
    // 获取页面数据
    async getlistDetail() {
      const res = await getlistDetailShow({
        parentId: this.parentId
      });
      this.activities = res;
      this.initGetPosition();
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    // 获取右侧定位信息
    initGetPosition() {
      const arr = [];
      this.activities.forEach((item) => {
        if (item.logUpdateTime) {
          const timeDate = item.logUpdateTime.slice(0, 7);
          item.timeDate = timeDate;
          arr.push(timeDate);
        }
      });
      this.position = Array.from(new Set(arr));
    },
    // 跳转对应的值
    jumpToEle(index, item) {
      const element = document.querySelectorAll(`.updateLog .p_${item}`)[0];
      this.scroll.scrollToElement(element, 400, 0, -30);
    },
    // 滚动条初始化
    initScroll() {
      this.scroll = new BScroll(this.$refs.middleContent, {
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        },
        bounce: false,
        preventDefault: false
      });
    }
  }
};
</script>
<style lang='scss' scoped>
@import '@/globalComponents/ApiotWangeditor/index';
@import '@/globalComponents/ApiotWangeditor/show';
@import '../index';

$--name: 'updateLog';
@include setLayout($--name);
.updateLog {
  position: relative;
  padding: 43px 229px 0 218px;
  height: calc(100vh - 110px);
  overflow: hidden;
  .contentBox {
    margin-top: 30px;
  }
  ::v-deep {
    .el-timeline-item__node--normal {
      width: 10px;
      height: 10px;
      background: #ffffff;
      border: 4px solid #4689f5;
      left: -4px;
    }
    .el-timeline-item__tail {
      border-left: 2px dashed #e9e9e9;
    }
    .positionEle {
      width: 142px;
      position: absolute;
      right: 34px;
      top: 36px;
      font-size: 13px;
      color: #666666;
    }
    .el-timeline-item__timestamp.is-top {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
  }
}
</style>
