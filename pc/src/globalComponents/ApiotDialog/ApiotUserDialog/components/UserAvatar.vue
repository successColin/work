<!--
 * @Descripttion: 用户头像
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 10:00:33
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-31 17:03:39
-->
<!-- treeTable -->
<template>
  <section class="avatar" v-if="item">
    <img
      v-if="item.url"
      :src="item.url"
      class="userImage m-r-4"
      :class="large ? 'large' : ''"
    />
    <span
      v-else
      class="imageName"
      :class="{ large: large, 'm-r-4': !onlyAvatar }"
      :style="item.styleColor"
      >{{ item.imageName }}</span
    >
    <span v-if="item.username && !onlyAvatar">{{ item.username }}</span>
  </section>
</template>

<script>
import cnchar from 'cnchar';

export default {
  name: 'userAvatar',
  data() {
    return {
      tableData: [],
      colors: ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE']
    };
  },
  props: {
    userItem: {
      type: Object,
      default() {
        return {};
      }
    },
    onlyAvatar: {
      type: Boolean,
      default() {
        return false;
      }
    },
    large: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    item() {
      const data = this.userItem;
      // console.log(data);
      if (!data) return false;
      const reg = /[\\"]/g;
      let url = data && data.image && data.image !== 'null' ? data.image.replace(reg, '') : '';
      let color =
        data.color && data.color !== '""' && data.image !== 'null'
          ? data.color.replace(reg, '')
          : this.colors[data.id % 5];
      if (data && data.icon) {
        if (data.icon.color) {
          color = data.icon.color;
        }
        // console.log(data);
        if (data.icon.imageUrl) {
          url = data.icon.imageUrl;
        }
      }
      if (url === '""' || !url) {
        // 根据用户名生产用户名首字母头像
        const len = data.username.length;
        // 用户名大于两个字时取最后两个字的首字母
        const imageName = len > 2 ? data.username.substring(len - 2) : data.username;
        data.imageName = cnchar.spell(imageName, 'first', 'up') || '';
        data.styleColor = `background:${color}`;
        data.url = null;
      } else {
        data.url = url;
      }
      return data;
    }
  },
  mounted() {
    // this.getUserList();
  },
  methods: {},
  watch: {}
};
</script>
<style lang='scss' scoped>
.avatar {
  display: flex;
  align-items: center;
  .imageName {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: #fff;
    font-size: 10px;
    text-align: center;
    line-height: 28px;
  }
  .userImage {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
  .large {
    width: 48px;
    height: 48px;
    font-size: 22px;
    line-height: 48px;
  }
}
</style>
