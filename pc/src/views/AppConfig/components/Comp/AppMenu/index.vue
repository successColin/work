<template>
  <div
    class="appMenu"
    @click.stop="selectActive"
    :class="[
      { borderLight: config.compId === activeObj.compId },
      { isFooter: config.isFooter },
      { hasImg: config.icon.imageUrl || config.icon.icon },
    ]"
  >
    <div
      class="appMenu__box"
      v-if="this.getGroup.showStyle === 1"
      :style="`backgroundColor:${
        this.getGroup.rowNum === 2 || this.getGroup.rowNum === 3
          ? config.bgColor
          : ''
      }`"
    >
      <div class="appMenu__box--1" v-if="this.getGroup.rowNum === 1">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="config.icon.imageUrl"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <div class="appMneu__right">
          <p class="appMenu__name">{{ config.menuName }}</p>
          <p class="appMenu__des">{{ config.des }}</p>
        </div>
      </div>
      <div class="appMenu__box--2" v-if="this.getGroup.rowNum === 2">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="config.icon.imageUrl"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
      <div class="appMenu__box--3" v-if="this.getGroup.rowNum === 3">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="config.icon.imageUrl"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
      <div class="appMenu__box--4" v-if="this.getGroup.rowNum === 4">
        <div
          class="appMenu__icon 222"
          v-if="config.compId === activeObj.compId && config.isFooter"
        >
          <i
            class="iconfont icon-jiahao"
            v-if="!config.selectIcon.imageUrl && !config.selectIcon.icon"
          ></i>
          <img
            :src="config.selectIcon.imageUrl"
            alt=""
            v-if="config.selectIcon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.selectIcon.icon}`"
            :style="`color: ${config.selectIcon.color}`"
          ></i>
        </div>
        <div class="appMenu__icon 111" v-else>
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="config.icon.imageUrl"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
      <div class="appMenu__box--5" v-if="this.getGroup.rowNum === 5">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="config.icon.imageUrl"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
    </div>
    <div
      class="appMenu__bg"
      v-if="this.getGroup.showStyle === 2"
      :class="[{ hasBorder: config.compId !== activeObj.compId }]"
    >
      <img :src="config.bgImgUrl" v-if="config.bgImgUrl" alt="图片" />
    </div>
  </div>
</template>

<script>
import compMixin from '../comp';

export default {
  mixins: [compMixin],
  props: {
    groupObj: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getGroup() {
      return this.groupObj;
    },
    getJb() {
      if (this.config.enableGradient) {
        return `-webkit-background-clip: text;background-image: linear-gradient(180deg, ${this.config.gradientObj.color1} 0%, ${this.config.gradientObj.color2} 50%,${this.config.gradientObj.color3} 100%);
        -webkit-text-fill-color: transparent;`;
      }
      return `color: ${this.config.icon.color}`;
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.appMenu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  &.borderLight {
    border: 1px dashed $--color-primary;
  }
  &:hover {
    background: #f1f7ff;
  }
  &.isFooter {
    .appMenu__name {
      width: 24px;
      height: 12px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 12px;
      margin-top: 6px;
    }
  }
  &.hasImg {
    .appMenu__icon {
      border: 0 none;
    }
  }
  &__icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    text-align: center;
    i {
      color: #bbc3cd;
    }

    &.borderLight:hover {
      border-color: $--color-primary;
      i {
        color: $--color-primary;
      }
    }
    .full {
      display: block;
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
  }
  &__name {
    width: 100%;
    margin-top: 9px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  &__bg,
  &__box {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__bg {
    width: 94%;
    height: 70px;
    box-sizing: border-box;
    &.hasBorder {
      border: 1px solid #e9e9e9;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
  .appMenu__box {
    width: 94%;
    &--1,
    &--2 {
      display: flex;
      width: 94%;
      align-items: center;
      .appMenu {
        &__icon {
          width: 34px;
          height: 34px;
          line-height: 34px;
          margin-right: 15px;
          .full {
            display: block;
            width: 34px;
            height: 34px;
            font-size: 34px;
          }
        }
        &__right {
          flex: 1;
        }
        &__name {
          text-align: left;
          margin-top: 0;
          height: 18px;
        }
        &__des {
          font-size: 12px;
          font-weight: 400;
          color: #aaaaaa;
          line-height: 15px;
        }
      }
    }
    &--2 {
      height: 100%;
    }
    &--3,
    &--4,
    &--5 {
      width: 94%;
      .appMenu {
        &__icon {
          width: 34px;
          height: 34px;
          line-height: 34px;
          margin-right: 15px;
          .full {
            display: block;
            width: 34px;
            height: 34px;
            font-size: 34px;
          }
        }
        &__name {
          text-align: left;
          height: 18px;
        }
      }
    }
    &--4,
    &--5 {
      .appMenu__icon {
        margin: 0 auto;
      }
      .appMenu__name {
        margin: 10px auto 0;
        text-align: center;
        height: 18px;
      }
    }
  }
}
</style>
