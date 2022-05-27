<!--
 * @Descripttion: 按角色
 * @Author: ytx
 * @Date: 2022-01-08 11:57:12
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 11:57:12
-->
<template>
  <u-collapse class="passRole" @change="change" @close="close" @open="open">
    <u-collapse-item
      :title="item.name"
      name="group"
      v-for="(item, index) in listArr"
      :key="index"
    >
      <text
        class="u-collapse-content"
        v-for="(val, i) in item.childrens"
        :key="i"
        @click="handleJump"
      >
        <i class="appIcon appIcon-zhanghao m-r-11"></i>
        {{ val.name }}({{ val.count }})
      </text>
    </u-collapse-item>
  </u-collapse>
</template>

<script>
export default {
  props: {
    isSwitch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // isOpen: false,
      listArr: [
        {
          name: '管理员组',
          childrens: [
            { name: '数控工程师', count: 10 },
            { name: '数控工程师', count: 11 }
          ]
        },
        {
          name: '管理员组1',
          childrens: [
            { name: '数控工程师1', count: 101 },
            { name: '数控工程师1', count: 111 }
          ]
        }
      ]
    };
  },
  components: {},
  computed: {},
  watch: {},
  filters: {
    dataFormat(msg) {
      return `${msg}xxxxx`;
    }
  },
  mounted() {},
  methods: {
    handleJump() {
      this.$emit('update:isSwitch', false);
    },
    change(e) {
      console.log('change', e);
    },
    close(e) {
      console.log('close', e);
      // this.isOpen = false;
    },
    open(e) {
      console.log('close', e);
      // this.isOpen = true;
    }
  }
};
</script>
<style lang='scss' scoped>
.allUser {
  &__cancel,
  &__ok {
    font-size: 30rpx;
  }
  &__cancel {
    margin-right: 24rpx;
    color: #333333;
    background: #f1f3f6;
  }
  &__ok {
    color: #ffffff;
  }
}
</style>
