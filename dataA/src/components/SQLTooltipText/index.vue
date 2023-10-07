/**
* @name: index
* @author: DELL
* @date: 2022/12/8 17:07
* @description：index
* @update: 2022/12/8 17:07
*/
<!-- 页面 -->
<template>
  <div>
    <p class="title">SQL写法示例 </p>
    <div style="margin-bottom: 5px;">
      <p class="xTitle">示例1:</p>
      <div>select * from user where name="${name}"</div>
    </div>
    <div>
      <p class="xTitle">示例2:</p>
      <div>select * from workorder where 1 = 1
        <pre>
        &lt;#if stateid != "-1"&gt;
          and stateid = ${stateid}
        &lt;/#if&gt;
      </pre>
        <pre>
        &lt;#if typeid != "-1" &gt;
          and typeid = ${typeid}
        &lt;/#if&gt;
      </pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.title {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 5px;
}

.xTitle {
  font-size: 14px;
  opacity: 0.7;
}
</style>
