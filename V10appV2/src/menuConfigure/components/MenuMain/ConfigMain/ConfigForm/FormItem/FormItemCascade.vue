<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-级联
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span></view
      >
      <view class="elementContent">
        <apiot-data-picker
          :value="realValue"
          :dataArry="dataArry"
          :title="element.name"
          :placeholder="element.placeholder"
          :showType="element.storeType === 1 ? 'all' : 'end'"
          textField="showColumn"
          valueField="id"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @change="valueChang"
        ></apiot-data-picker>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import { getCascadeInfo } from '@/api/menuConfig';
import elementMixin from './elementMixin';

export default {
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      realValue: '',
      dataArry: []
    };
  },

  computed: {
    collection() {
      const { cascadeDataSource } = this.element;
      const str = [];
      cascadeDataSource.forEach((el) => {
        const { tableInfo } = el;
        if (str.indexOf(tableInfo.tableName) === -1) str.push(tableInfo.tableName);
      });

      if (str.length > 0) return str.join(',');

      return null;
    }
  },

  watch: {
    value() {
      this.getRealValue();
    }
  },

  methods: {
    valueChang(value) {
      const strArry = [];
      value.forEach((V) => {
        strArry.push(`${V.text}(${V.value})`);
      });
      const { element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = strArry.join(',');
      this.$emit('change', valueObj, element);
    },
    async getCascadeInfo() {
      try {
        const data = await getCascadeInfo({
          configInfo: JSON.stringify(this.element.cascadeDataSource)
        });
        this.dataArry = data;
        this.getRealValue();
      } catch (error) {
        console.error(error);
        this.dataArry = [];
      }
    },
    // 获取参数的实际值
    getRealValue() {
      const { value, dataArry } = this;
      if (dataArry.length === 0 || !value) return;

      const valueArry = value.split(',');
      let data = [...dataArry];
      valueArry.forEach((V, index) => {
        if (data.length === 0) return;
        const node = data.find((item) => {
          const v = `${item.showColumn}(${item.id})`;
          return v === V;
        });
        if (!node) return;

        if (index === valueArry.length - 1) this.realValue = node.id;

        if ('children' in node) data = node.children;
        else data = [];
      });
    }
  },

  mounted() {},

  created() {
    this.getCascadeInfo();
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
