<!--
 * @Author: sss
 * @Date: 2022-06-11 14:24:16
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-11 14:24:16
 * @Desc: 按角色筛选
-->
<template>
  <view class="usersRole">
    <section class="usersRole__roleList">
      <role-group></role-group>
    </section>
  </view>
</template>

<script>
import RoleGroup from './components/RoleGroup';

export default {
  components: { RoleGroup },

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
