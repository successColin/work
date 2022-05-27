<template>
  <el-tag
    :class="`fieldSelect--item item--theme__${itemTheme}`"
    :closable="false"
    v-on="$listeners"
    v-bind="$attrs"
    :title="item"
  >
    <i :class="`iconfont ${itemIconClass} m-r-4`" v-if="itemIconClass"></i>
    <i class="wz" v-if="item">{{ item }}</i>
    <i class="close-btn" @click="deleteSelf(item)" v-if="closable"></i>
  </el-tag>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    configData: {
      type: Object
    },
    // 子项的icon class
    itemIconClass: {
      type: String,
      default: ''
    },
    // 子项icon 的主题色
    // 1 是黄色 2 红色 3 蓝色
    itemTheme: {
      type: Number,
      default: 1
    },
    // 当前项的值
    item: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //   删除
    deleteSelf(item) {
      this.$emit('deleteSelf', item);
    },
    getRes(item) {
      let res = '';
      if (item.length > 6) {
        res = `${item.slice(0, 6)}...`;
      } else {
        res = item;
      }
      return res;
    }
  }
};
</script>

<style lang='scss' scoped>
// item 样式
.fieldSelect {
  &--item {
    position: relative;
    padding: 0 10px;
    height: 28px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    margin-bottom: 4px;
    border: 0 none;
    line-height: 1;
    vertical-align: top;
    &:hover {
      .close-btn {
        visibility: visible;
      }
    }
    .wz {
      height: 100%;
      line-height: 28px;
      max-width: 116px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .close-btn {
      position: absolute;
      cursor: pointer;
      width: 12px;
      height: 12px;
      right: -4px;
      top: -4px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      visibility: hidden;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 2px;
        background-color: #fff;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
// 子项主题色
.item--theme__1 {
  background: #ffede1 !important;
  i:first-child {
    color: #fa6400 !important;
  }
}
.item--theme__2 {
  background: #ffeaeb !important;
  i:first-child {
    color: #ee5e5e !important;
  }
}
.item--theme__3 {
  background: #e5f0ff !important;
  i:first-child {
    color: #4689f6 !important;
  }
}
</style>
