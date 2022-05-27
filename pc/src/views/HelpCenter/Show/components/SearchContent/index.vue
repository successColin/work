<!--
 * @Descripttion: 搜索出的内容
 * @Author: ytx
 * @Date: 2021-06-16 16:48:46
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-16 16:48:46
-->
<template>
  <div class="searchDiv">
    <header>
      {{ $t('helpCenter.totallySearched')
      }}<span class="searchDiv__Num">{{ totle }}</span
      >{{ $t('helpCenter.article') }}“<span class="searchDiv__title">{{
        searchName
      }}</span
      >”{{ $t('helpCenter.relatedHelpDocuments') }}
    </header>
    <section v-if="totle && isShow">
      <div
        v-for="(item, i) in recordsArr"
        :key="i"
        class="searchDiv__container"
        @click="handleJump(item)"
      >
        <!-- 不等于视频 -->
        <div v-if="parentId !== 2">
          <div class="searchDiv__headline">{{ item.name }}</div>
          <div class="searchDiv__dec">
            {{ item.txt }}
          </div>
        </div>
        <!-- 等于视频 -->
        <div v-else class="searchDiv__video" @click="handleVideoPlay(item)">
          <div class="searchDiv__video--img">
            <img :src="item.imageUrl" alt="" />
            <div class="circle">
              <div class="searchDiv__triangle"></div>
            </div>
          </div>
          <div class="dec">
            <div class="title">{{ item.name }}</div>
            <div class="timeAndRead">
              {{ $t('helpCenter.updateOn') }}{{ item.modifyTime }}
            </div>
            <!-- <div class="timeAndRead">{{ item.clickTimes }}人次阅读</div> -->
          </div>
        </div>
      </div>
    </section>
    <footer v-if="totle > 10">
      <div @click="handleNext" :class="{ disabled: nextDisabled }">
        {{ $t('helpCenter.nextPage') }}<i class="el-icon-arrow-right"></i>
      </div>
      <div @click="handlePrev" :class="{ disabled: prevDisabled }">
        <i class="el-icon-arrow-left"></i>{{ $t('helpCenter.previousPage') }}
      </div>
    </footer>
    <section
      v-if="!totle"
      class="apiotNoData"
      :placeholder="$t('common.noData')"
      @click="handleReturn"
    ></section>
    <dialog-video
      :visible.sync="dialogVisible"
      :visibleState="dialogVisible"
      :videoOption="videoOption"
    ></dialog-video>
  </div>
</template>

<script>
import DialogVideo from '@/views/HelpCenter/component/DialogVideo';

export default {
  props: {
    // 查询结果
    searchValue: {
      type: Object,
      default: () => {}
    },
    page: {
      type: Object,
      default: () => {}
    },
    isShowSearchValue: {
      type: Boolean,
      default: false
    },
    parentId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      videoOption: {},
      isShow: false
    };
  },
  components: {
    DialogVideo
  },
  computed: {
    recordsArr() {
      return this.searchValue && this.searchValue.records;
    },
    totle() {
      return this.searchValue && this.searchValue.total;
    },
    searchName() {
      return this.searchValue && this.searchValue.searchName;
    },
    prevDisabled() {
      return this.page.current === 1;
    },
    nextDisabled() {
      const v = this.totle / this.page.size;
      return Math.floor(v) < this.page.current;
    }
  },
  watch: {
    searchValue: {
      deep: true,
      immediate: true,
      handler() {
        this.isShow = true;
        this.$nextTick(() => {
          this.isShow = true;
        });
      }
    }
  },
  mounted() {},
  methods: {
    // 下一步
    handleNext() {
      const { size } = this.page;
      let { current } = this.page;
      current += 1;
      if (!this.nextDisabled) {
        this.$emit('update:page', {
          current,
          size
        });
      }
    },
    // 上一步
    handlePrev() {
      const { size } = this.page;
      let { current } = this.page;
      current -= 1;
      if (current > 0) {
        this.$emit('update:page', {
          current,
          size
        });
      }
    },
    // 跳转对应的页面
    handleJump(item) {
      if (this.parentId === 2) return;
      this.$emit('update:isShowSearchValue', false);
      this.$emit('update:activeIndex', String(item.id));
      this.$emit('giveActiveObj', item);
    },
    handleReturn() {
      this.$emit('update:isShowSearchValue', false);
    },
    handleVideoPlay(v) {
      this.dialogVisible = true;
      this.videoOption = v;
    }
  }
};
</script>
<style lang='scss' scoped>
.searchDiv {
  header {
    font-size: 16px;
    color: #333333;
    padding: 10px 0;
    border-bottom: 1px solid #e9e9e9;
    .searchDiv__Num,
    .searchDiv__title {
      color: #4689f5;
    }
  }
  section {
    font-size: 13px;
    height: calc(100vh - 285px);
    overflow: auto;
    .searchDiv__container {
      padding-bottom: 20px;
      border-bottom: 1px solid #e9e9e9;
      .searchDiv__headline {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-top: 28px;
      }
      .searchDiv__dec {
        font-family: PingFangSC-Regular, PingFang SC;
        color: #808080;
        line-height: 24px;
        margin-top: 14px;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
        -webkit-line-clamp: 2; //这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
      }
      .searchDiv__video {
        margin-top: 28px;
        display: flex;
        &--img {
          width: 166px;
          height: 96px;
          background: #f8f9fb;
          overflow: hidden;
          position: relative;
          img {
            width: 100%;
          }
          .circle {
            position: absolute;
            width: 34px;
            height: 34px;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
            background: rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            .searchDiv__triangle {
              position: absolute;
              top: 0;
              bottom: 0;
              right: 0;
              left: 0;
              margin: auto;
              margin-left: 11px;
              width: 0;
              height: 0;
              border-top: 7px solid transparent;
              border-left: 14px solid #ffffff;
              border-bottom: 7px solid transparent;
            }
          }
        }
        .dec {
          display: flex;
          flex-flow: column;
          margin-left: 20px;
          font-size: 13px;
          .title {
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333333;
            margin: 8px 0;
          }
          .timeAndRead {
            color: #808080;
            // line-height: 24px;
            margin-top: 40px;
          }
        }
      }
    }
    .searchDiv__container:hover {
      .searchDiv__headline {
        color: $--color-primary;
      }
      cursor: pointer;
    }
  }
  footer {
    display: flex;
    flex-direction: row-reverse;
    margin: 10px 0;
    font-size: 13px;
    color: #4689f5;
    & > div:first-child {
      cursor: pointer;
      margin-left: 5px;
    }
    & > div:last-child {
      margin-right: 5px;
      cursor: pointer;
    }
  }
  section::-webkit-scrollbar {
    width: 0 !important;
  }
  .disabled {
    cursor: not-allowed !important;
    opacity: 0.6;
  }
}
</style>
