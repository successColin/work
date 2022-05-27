<!--
 * @Author: cmk
 * @Date: 2021-04-13 19:26:18
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:29:57
 * @Des: 字段/约束/索引 弹窗
-->
<template>
  <apiot-tabs
    v-on="$listeners"
    v-bind="$attrs"
    v-model="activeName"
    :tabsArr="tabsArr"
    @tab-click="tabClick"
  >
    <template v-slot:FieldManage>
      <field-manage v-bind="$attrs" ref="FieldManage"></field-manage>
    </template>
    <!-- <template v-slot:BridleManage>
      <bridle-manage></bridle-manage>
    </template> -->
    <template v-slot:IndexManage>
      <index-manage v-bind="$attrs" ref="IndexManage"></index-manage>
    </template>
  </apiot-tabs>
</template>

<script>
import FieldManage from './components/FieldManage';
import IndexManage from './components/IndexManage';

export default {
  data() {
    return {
      activeName: 'FieldManage'
    };
  },

  components: {
    FieldManage,
    // BridleManage,
    IndexManage
  },

  computed: {
    tabsArr() {
      return [
        {
          label: this.$t('common.manage', { name: this.$t('entity.column') }),
          compName: 'FieldManage',
          key: 'FieldManage'
        },
        // {
        //   label: '约束管理',
        //   compName: 'BridleManage',
        // },
        {
          label: this.$t('common.manage', { name: this.$t('entity.indexes') }),
          compName: 'IndexManage',
          key: 'IndexManage'
        }
      ];
    }
  },

  mounted() {},

  methods: {
    // tab切换 触发table高度重新计算
    tabClick() {
      this.$broadcast('changeHeight');
      this.$nextTick(() => {
        if (this.$refs[this.activeName]) {
          this.$refs[this.activeName].init();
        }
      });
    },
    setActiveName(name) {
      this.activeName = name;
      this.tabClick();
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
