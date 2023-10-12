<template>
  <view class="tabnavHome__infor">
    <view class="tabnavHome__infor--box">
      <view class="tabnavHome__infor--title">
        {{ modeObj.name || '文章资讯' }}
      </view>
      <navigator
        url="/MoreInfor/index"
        hover-class="none"
        class="tabnavHome__infor--more moreButton"
        :class="[getThemeColorFont]"
      >
        更多
        <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
      </navigator>
    </view>
    <view v-for="(item, o) in articleArr" :key="o">
      <navigator
        :url="jumpUrl(item.id)"
        hover-class="none"
        class="tabnavHome__infor--more"
      >
        <!-- 风格一 -->
        <info-Stylea
          :valObj="item"
          :isShowTop="false"
          v-if="item.articleType === 1"
        ></info-Stylea>
        <!-- 风格二 -->
        <info-Styleb
          :valObj="item"
          :isShowTop="false"
          v-else-if="item.articleType === 2"
        ></info-Styleb>
        <!-- 风格三 -->
        <info-Stylec
          :valObj="item"
          :isShowTop="false"
          v-else-if="item.articleType === 3"
        ></info-Stylec>
        <!-- 风格三 -->
        <info-Styled
          :valObj="item"
          :isShowTop="false"
          v-else-if="item.articleType === 4"
        ></info-Styled>
      </navigator>
    </view>
  </view>
</template>

<script>
import InfoStylea from './components/InfoStylea';
import InfoStyleb from './components/InfoStyleb';
import InfoStylec from './components/InfoStylec';
import InfoStyled from './components/InfoStyled';
import { getListArticle } from '@/api/moreInfor';
import { Encrypt } from '@/utils';

export default {
  props: {
    modeObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      articleArr: []
    };
  },
  components: {
    InfoStylea,
    InfoStyleb,
    InfoStylec,
    InfoStyled
  },
  computed: {
    jumpUrl() {
      return function(id) {
        return `/MoreInfor/components/InforDetails/index?id=${Encrypt(String(id))}`;
      };
    },
    // 获取字体主题色
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    }
  },
  watch: {},
  mounted() {
    console.log(this.modeObj);
    this.getArticleArr();
  },
  methods: {
    async getArticleArr() {
      const res = await getListArticle({
        count: this.modeObj.count,
        groupId: this.modeObj.groupId === 0 ? '' : this.modeObj.groupId,
        type: this.modeObj.term
      });
      this.articleArr = res;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../Menus/ModemenuTwo/index.scss';

$--name: 'tabnavHome__infor';
$--gridColumns: 4;
$--gridSize: 1fr;
$--gridRowGap: 18rpx;
$--gridColumnGap: 18rpx;
@include setMenuStyle(
  $--name,
  $--gridColumns,
  $--gridSize,
  $--gridRowGap,
  $--gridColumnGap
);

.tabnavHome {
  &__infor {
    &--box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}

.moreButton {
  position: relative;
  left: 2px;
}
</style>
