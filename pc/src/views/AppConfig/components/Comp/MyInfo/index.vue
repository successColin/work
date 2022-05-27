<template>
  <div class="myInfo">
    <div class="myInfo__img m-r-10">
      <user-avatar :userItem="getUserInfo" :onlyAvatar="true"></user-avatar>
    </div>
    <div class="myInfo__box">
      <p class="myInfo__box--name">{{ getUserInfo.username }}</p>
      <p class="myInfo__box--qm">{{ getUserInfo.signature }}</p>
    </div>
  </div>
</template>

<script>
import userAvatar from '@/views/orgManage/components/userAvatar/index';

export default {
  data() {
    return {};
  },

  components: {
    userAvatar
  },

  computed: {
    getUserInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },

  mounted() {
    // console.log(this.$store.state.userCenter.userInfo);
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
.myInfo {
  height: 104px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  padding-left: 18px;
  &__img {
    ::v-deep {
      .userImage {
        width: 44px !important;
        height: 44px !important;
        margin: 0;
      }
    }
  }
  &__box {
    &--name {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
    }
    &--qm {
      font-size: 12px;
      font-weight: 400;
      color: #aaaaaa;
      line-height: 18px;
      margin-top: 2px;
    }
  }
}
</style>
