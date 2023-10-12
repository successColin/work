<!--
 * @Author: sss
 * @Date: 2022-10-28 09:01:20
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-28 09:01:20
 * @Desc: 列表控件-进度条
-->
<template>
  <view
    class="listLabel"
    :class="[element.alignStyle === 3 ? 'labelRight' : '']"
  >
    <span class="listLabel__title" v-if="element.showLabelTitle"
      >{{ element.name }}：</span
    >
    <apiot-choose-user
      mode="small"
      :value="users"
      :title="element.placeholder"
      :disabled="true"
      showMode="list"
    ></apiot-choose-user>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    element: Object,
    value: [Object, Number, String, Boolean]
  },

  data() {
    return {
      users: []
    };
  },

  computed: {},

  watch: {
    value: {
      handler(user) {
        this.getUserList(user);
      },
      immediate: true
    }
  },

  methods: {
    // 根据id值获取对应数据
    async getUserList() {
      const { value } = this;
      this.users = await this.$store.dispatch('get_userCenter_usersInfo', value);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
