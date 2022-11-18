<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-用户选择框
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element" :class="[multiple ? 'topEl' : 'normal']">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <slot name="elTilte"></slot>
      </view>
      <view class="elementContent">
        <apiot-choose-user
          v-model="users"
          :title="element.placeholder"
          :isMultiple="multiple"
          :shouldFav="element.shouldFav"
          :shouldInOrg="element.shouldInOrg"
          :shouldInPost="element.shouldInPost"
          :shouldInRole="element.shouldInRole"
          :shouldSearch="element.shouldSearch"
        ></apiot-choose-user>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      users: []
    };
  },

  computed: {
    multiple() {
      return this.element.dropDownType === 2;
    }
  },

  watch: {
    value: {
      handler(user) {
        this.getUserList(user);
      },
      immediate: true
    },
    users(V) {
      console.log('users============================');
      this.handleV(V);
    }
  },

  methods: {
    // 根据id值获取对应数据
    async getUserList() {
      const { value } = this;
      this.users = await this.$store.dispatch('get_userCenter_usersInfo', value);
    },
    handleV(list) {
      const { element, multiple } = this;
      const getShowColumnName = 'username';
      const getRelateColumnName = 'id';
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = '';
      valueObj[`${compId}_`] = '';
      if (multiple) {
        const arry = [];
        const arry1 = [];
        list.forEach((item) => {
          arry.push(item[getRelateColumnName]);
          arry1.push(item[getShowColumnName]);
        });
        valueObj[compId] = arry.join(',');
        valueObj[`${compId}_`] = arry1.join(',');
      } else if (list.length > 0) {
        valueObj[compId] = `${list[0][getRelateColumnName]}`;
        valueObj[`${compId}_`] = list[0][getShowColumnName];
      }
      this.$emit('change', valueObj, element, list);
    }
  },

  mounted() {
    console.log(this.element);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.topEl {
  padding-bottom: 0 !important;
}
</style>
