<!--
 * @Author: sss
 * @Date: 2022-06-10 11:32:21
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 11:32:21
 * @Desc: 所有用户
-->
<template>
  <view class="userList">
    <slot></slot>
    <view v-for="(user, index) in listData" :key="user.id" :anchor="index">
      <user-card
        :value="user"
        :mode="cardMode"
        :canCollection="canCollection"
        @simulationDel="changeUser"
      ></user-card>
    </view>
  </view>
</template>

<script>
import UserCard from './UserCard';
import userMixin from '../userMixin';

export default {
  name: 'usersList',

  mixins: [userMixin],

  components: {
    UserCard
  },

  props: {
    // 类型data=外部数据，load=加载
    mode: {
      type: String,
      default: 'load'
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    nodeId: [Number, String],
    // delete=直接删除选中用户；simulation=模拟删除，没有实际删除
    cardMode: {
      type: String,
      default: 'delete'
    },
    // 是否显示收藏按钮
    canCollection: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {};
  },

  computed: {},

  watch: {
    mode: {
      handler() {
        if (this.mode === 'load') this.getUserList();
        else this.listData = this.list;
      },
      immediate: true
    },
    list: {
      handler(value) {
        if (this.mode !== 'load') this.listData = value;
      },
      immediate: true
    }
  },

  methods: {
    // 下拉加载
    scrolltolower() {
      if (this.mode === 'load') return;
      const { current, totalPage } = this;
      if (current < totalPage) this.getUserList('loadnext');
    },
    changeUser(user) {
      console.log('deleteUser============2');
      this.$emit('delete', user);
    }
  },

  mounted() {},

  created() {}
};
</script>
