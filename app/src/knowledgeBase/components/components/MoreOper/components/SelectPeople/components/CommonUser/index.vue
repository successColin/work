<!--
 * @Descripttion: (全部、常用)
 * @Author: ytx
 * @Date: 2022-01-08 11:56:18
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 11:56:18
-->
<template>
  <u-checkbox-group v-model="checked" class="allUser">
    <u-list @scrolltolower="scrolltolower" :height="listHeight">
      <u-list-item v-for="(item, index) in arr" :key="index">
        <list-user :obj="item" :isCollect="item.isCollect"></list-user>
      </u-list-item>
    </u-list>
  </u-checkbox-group>
</template>

<script>
import ListUser from '../ListUser';

export default {
  props: {
    isAll: {
      type: Boolean,
      default: false
    },
    // 分页返回的数据
    listObj: {
      type: Object,
      default: () => {}
    },
    listArr: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      checked: []
      // listArr2: [
      //   {
      //     isCollect: true,
      //     isSelect: false,
      //     userInfo: {
      //       username: '王小二'
      //     },
      //     id: 1
      //   },
      // ]
    };
  },
  components: {
    ListUser
  },
  computed: {
    arr() {
      // 全部
      if (this.isAll) {
        const { records } = this.listObj;
        if (records) {
          const rows = records.map((item) => {
            const arr = this.listArr.filter((obj) => String(obj.id) === String(item.id));
            if (arr.length > 0) {
              item.isCollect = true;
            } else {
              item.isCollect = false;
            }
            return item;
          });
          return rows;
        }
        return [];
      }
      // 常用
      return this.listArr.map((item) => {
        item.isCollect = true;
        return item;
      });
    },
    listHeight() {
      return `calc(100vh - ${this.height}px)`;
    }
  },
  watch: {
    checked(v) {
      this.$emit('giveSelected', v);
    }
  },
  filters: {
    dataFormat(msg) {
      return `${msg}xxxxx`;
    }
  },
  mounted() {},
  methods: {
    // 滚动到底部触发事件
    scrolltolower() {}
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
