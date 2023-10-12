/**
* @name: content
* @author: DELL
* @date: 2023/2/18 15:02
* @description：content
* @update: 2023/2/18 15:02
*/
<!-- 页面 -->
<template>
  <div class="rightMain">
    <component :is="getContent" :info="info"></component>
  </div>
</template>

<script>

const GroupConfig = () => import('./groupForm');
const ApiConfig = () => import('./ApiConfig/index');

export default {
  data() {
    return {
      info: {}, // 节点信息
    };
  },

  components: {
    GroupConfig,
    ApiConfig
  },

  computed: {
    getContent() {
      const { type } = this.info;
      if (type === 2) {
        return 'ApiConfig';
      }
      if (type === 1) {
        return 'GroupConfig';
      }
      return '';
    }
  },

  mounted() {
    this.$bus.$off('proxyNodeClick')
      .$on('proxyNodeClick', (data) => {
        this.info = data;
      });
  },

  methods: {
  },
  name: 'mainLayout',
};
</script>

<style lang='scss' scoped>
.rightMain {
  width: 100%;
  height: 100%;
}
</style>
