/**
* @name: index
* @author: DELL
* @date: 2021/10/30 14:39
* @description：index
* @update: 2021/10/30 14:39
*/
<!-- 页面 -->
<template>
  <div class="databaseWrap">
    <c-select
        v-model="val"
        class="selectData"
        :options="options"
        @change="change"
    >
    </c-select>
    <div class="dataBtn" @click="toggle">配置更多</div>
    <CDialog
        :visible.sync="visible"
        title="配置数据库"
        classStyle="middlingDialog"
        :isNeedBtn="false"
    >
      <DataList :init="init" :tableData="options"/>
    </CDialog>
  </div>
</template>

<script>
import { getDatasource } from '@/services/home';

const DataList = () => import('./DataList/index');

export default {
  props: {
    value: {
      type: Number
    }
  },
  data() {
    return {
      visible: false,
      val: 1,
      options: [{value: 1, label: 1}, {value: 2, label: 3}]
    };
  },

  components: {DataList},

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      const list = await getDatasource();
      this.options = list.map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      });
      this.$nextTick(() => {
        this.val = this.value;
      })
    },
    toggle() {
      this.visible = true;
    },
    change(value) {
      this.$emit('change', value);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.databaseWrap {
  width: 100%;
  display: flex;
  align-items: center;

  .selectData {
    flex: 0 0 80%;
  }

  .dataBtn {
    flex: 1;
    width: 106px;
    height: 32px;
    margin-left: 10px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    background: $component-background-color;
    border: 1px solid $component-border-color;
    box-sizing: border-box;

    &:hover {
      border: 1px solid $component-borderFocus-color;
      transition: all 0.2s;
      cursor: pointer;
    }
  }
}
</style>
