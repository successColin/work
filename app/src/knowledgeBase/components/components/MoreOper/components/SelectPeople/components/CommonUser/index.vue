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
        <list-user :obj="item"></list-user>
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
    height: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      checked: [],
      listArr2: [
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '王小二'
          },
          id: 1
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '隔壁老王'
          },
          id: 2
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 3
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '钉钉'
          },
          id: 4
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '王小二'
          },
          id: 5
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '隔壁老王'
          },
          id: 5
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 6
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '钉钉'
          },
          id: 7
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '王小二'
          },
          id: 8
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '隔壁老王'
          },
          id: 9
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 10
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '钉钉结束'
          },
          id: 11
        }
      ],
      listArr: [
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王小二'
          },
          id: 1
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '隔壁老王'
          },
          id: 2
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 3
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '钉钉'
          },
          id: 4
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王小二'
          },
          id: 5
        },
        {
          isCollect: true,
          isSelect: false,
          userInfo: {
            username: '隔壁老王'
          },
          id: 6
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 7
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '钉钉'
          },
          id: 8
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王小二'
          },
          id: 9
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '隔壁老王'
          },
          id: 10
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 11
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '钉钉'
          },
          id: 12
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '王叶冰'
          },
          id: 13
        },
        {
          isCollect: false,
          isSelect: false,
          userInfo: {
            username: '钉钉结束'
          },
          id: 14
        }
      ]
    };
  },
  components: {
    ListUser
  },
  computed: {
    arr() {
      return this.isAll ? this.listArr : this.listArr2;
    },
    listHeight() {
      return `calc(100vh - ${this.height}px)`;
    }
  },
  watch: {
    checked(v) {
      this.$emit('giveSelected', v.length);
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
