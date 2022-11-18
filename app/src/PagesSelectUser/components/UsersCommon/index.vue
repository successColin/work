<!--
 * @Author: sss
 * @Date: 2022-06-10 11:32:21
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 11:32:21
 * @Desc: 常用用户
-->
<template>
  <section class="usersCommon">
    <users-list mode="data" :list="users"></users-list>
  </section>
</template>

<script>
import UsersList from '../UsersList';

export default {
  name: 'usersCommon',

  inject: ['GetGlobalParam'],

  components: {
    UsersList
  },

  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      users: []
    };
  },

  computed: {},

  watch: {
    list: {
      handler(V) {
        this.doSearch();
      },
      immediate: true
    }
  },

  methods: {
    doSearch() {
      const globalParam = this.GetGlobalParam();
      const { keywords } = globalParam;
      if (!keywords) this.users = this.list;
      else {
        this.users = this.list.filter((user) => {
          const { username = '', telephone = '', email = '' } = user;
          return (
            username.indexOf(keywords) !== -1 ||
            `${telephone}`.indexOf(keywords) !== -1 ||
            email.indexOf(keywords) !== -1
          );
        });
      }
    }
  },

  mounted() {},

  created() {}
};
</script>
