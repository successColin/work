/**
* @name: index
* @author: DELL
* @date: 2021/9/17 10:18
* @description：index
* @update: 2021/9/17 10:18
*/
<!-- 页面 -->
<template>
  <span :class="type" v-show="row[keyName]">
    <span class="iconfont" :class="getIconName()"></span>
    <span class="name">
      {{ row[keyName] }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    keyName: {
      type: String,
      default() {
        return 'name';
      }
    },
    type: {
      type: String
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getIconName() {
      return () => {
        if (this.type === 'org') {
          return 'icon-zuzhi';
        }
        if (this.type === 'pos') return 'icon-zhiwei';
        return '';
      };
    }
  },

  mounted() {},

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.org {
  display: flex;
  align-items: center;
  height: 24px;
  box-sizing: border-box;
  line-height: 18px;
  padding: 3px 8px;
  background: #e5f0ff;
  border-radius: 4px;
  box-sizing: border-box;

  & > .icon-zuzhi {
    font-size: 16px;
    color: #4689f5;
  }

  & > .name {
    margin-left: 3px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}

.pos {
  display: flex;
  align-items: center;
  height: 24px;
  box-sizing: border-box;
  line-height: 18px;
  padding: 3px 8px;
  background: #ffede1;
  border-radius: 4px;
  box-sizing: border-box;

  & > .icon-zhiwei {
    font-size: 16px;
    color: #fc8256;
  }

  & > .name {
    margin-left: 3px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
</style>
