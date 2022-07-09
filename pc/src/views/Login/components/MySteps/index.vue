<!--
 * @Descripttion: 进度条
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:45:12
-->
<template>
  <div class="mySteps">
    <ul class="mySteps__ul" ref="mytimeline">
      <li
        class="mySteps__li"
        v-for="(item, index) in timeLineList"
        :key="index"
      >
        <div class="mySteps__li--lineImg">
          <!-- 图标 -->
          <i
            :class="[
              'iconfont',
              'iconImg',
              index === 0
                ? 'icon-zuo'
                : timeLineList.length - 1 === index
                ? 'icon-you'
                : 'icon-zhongjian',
              item.checked ? 'fontColor1' : 'fontColor2',
            ]"
          >
            <span
              :class="[
                index === 0
                  ? 'mySteps__font1'
                  : timeLineList.length - 1 === index
                  ? 'mySteps__font3'
                  : 'mySteps__font2',
              ]"
              >{{ item.steps }}</span
            >
          </i>
          <!--线-->
          <div
            class="line"
            :style="
              index === 0
                ? 'width: 50%;right: -3px;'
                : timeLineList.length - 1 === index
                ? 'width: 50%;left: 0px;'
                : ''
            "
            :class="item.checked ? 'bgnColor1' : 'bgnColor2'"
          ></div>
        </div>
        <!--标注-->
        <div
          :class="['mySteps__li--info', item.checked ? '' : 'fontNameColor1']"
        >
          {{ item.content }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    timeLineList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.mySteps {
  display: flex;
  justify-content: center;
  &__ul {
    display: flex;
    text-align: center;
  }
  &__li {
    display: flex;
    flex-direction: column;
    width: 120px;
    &--lineImg {
      position: relative;
      .iconImg {
        position: relative;
        color: #4689f5;
        font-size: 23px;
        margin: 0 auto;
        z-index: 999;
        .mySteps__font1,
        .mySteps__font2,
        .mySteps__font3 {
          position: absolute;
          z-index: 999;
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }
        .mySteps__font1 {
          left: 7px;
          top: 5px;
        }
        .mySteps__font2 {
          left: 13px;
          top: 5px;
        }
        .mySteps__font3 {
          left: 13px;
          top: 5px;
        }
      }
      .line {
        position: absolute;
        width: 103%;
        border-radius: 8px;
        height: 3.5px;
        background: #4689f5;
        // border-radius: 8px;
        top: calc(50% - 2px);
      }
    }
    &--info {
      font-size: 13px;
      color: #4689f5;
      margin-top: 9px;
    }
    .fontColor1 {
      color: #4689f5 !important;
    }
    .fontColor2 {
      color: #d7dfea !important;
    }
    .bgnColor1 {
      background: #4689f5 !important;
      z-index: 2;
    }
    .bgnColor2 {
      background: #d7dfea !important;
    }
    .fontNameColor1 {
      color: #666666;
    }
  }
}
</style>
