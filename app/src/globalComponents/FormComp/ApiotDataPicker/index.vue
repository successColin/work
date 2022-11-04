<!--
 * @Author: sss
 * @Date: 2022-08-01 15:32:10
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-01 15:32:10
 * @Desc: 级联数据选择框
-->
<template>
  <section :class="{ disabled: readonly || disabled }">
    <uni-data-picker
      v-model="realValue"
      :placeholder="placeholder || ''"
      :popup-title="title || '选择框'"
      :localdata="dataArry"
      :map="map"
      :collection="collection"
      :showType="showType"
      :border="false"
      :readonly="readonly || disabled"
      @change="onchange"
      @nodeclick="onnodeclick"
      @popupopened="onpopupopened"
      @popupclosed="onpopupclosed"
    >
    </uni-data-picker>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    value: [String, Number],
    placeholder: String,
    title: String,
    dataArry: {
      type: Array,
      default() {
        return [];
      }
    },
    collection: String,
    valueField: {
      type: String,
      default: 'value'
    },
    textField: {
      type: String,
      default: 'text'
    },
    // 展示类型 all=所有选择的值都拼接显示，end=只展示最后一项
    showType: {
      type: String,
      default: 'all'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      realValue: null
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(V) {
        this.realValue = V;
      }
    }
  },

  computed: {
    map() {
      return {
        text: this.textField,
        // value: '_uid',
        value: this.valueField
      };
    }
  },

  methods: {
    onnodeclick(e) {
      console.log(e);
    },
    onpopupopened(e) {
      console.log('popupopened');
      console.log(e);
    },
    onpopupclosed(e) {
      console.log('popupclosed');
      console.log(e);
    },
    onchange(e) {
      console.log('onchange:', e);
      const { detail } = e;
      this.realValue = detail.value;
      this.$emit('change', detail.value);
    },
    getDataArry() {}
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.disabled {
  padding: 0 10rpx;
  background: #fafafa;
  border-radius: 12rpx;
}
</style>
