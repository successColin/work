<template>
  <div class="popupContent">
    <div v-for="(item, i) in currentUser" :key="i">
      <div class="operatorList">
        <UserHeadname
          :userInfo="{ triggerUserName: item.userName }"
          prop="triggerUserName"
        />
      </div>
      <span class="operatorStr m-t-10">
        {{ item.actionTime && item.actionTime.substring(0, 16) }}
      </span>
      <div class="operatorStr" v-if="item.actionType">
        {{ operatorMap[item.actionType] }}
      </div>
      <u-divider
        v-if="i + 1 !== currentUser.length"
        class="divider"
      ></u-divider>
    </div>
  </div>
</template>

<script>
import UserHeadname from '../../../UserHeadname';

export default {
  props: {
    currentUser: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      operatorMap: {
        1: '执行同意操作',
        2: '执行撤回操作',
        3: '执行驳回操作',
        4: '执行转审操作',
        5: '执行加签操作',
        6: '执行提交操作'
      }
    };
  },
  components: {
    UserHeadname
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.operatorList {
  display: flex;
  align-items: center;
}
.operatorStr {
  height: 25px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 25px;
}
</style>
