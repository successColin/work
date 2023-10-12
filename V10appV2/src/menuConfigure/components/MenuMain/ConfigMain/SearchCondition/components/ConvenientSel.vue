<!--
 * @Author: sss
 * @Date: 2023-05-25 19:44:23
 * @Last Modified by: sss
 * @Last Modified time: 2023-05-25 19:44:23
 * @Desc: 便捷搜索-下拉框
-->
<template>
  <view class="convenientSel">
    <view class="convenientSel__scroll">
      <scroll-view
        scroll-x="true"
        class="scroll-Y"
        :scroll-left="scrollLeft"
        scroll-with-animation
      >
        <div class="convenientSel__content">
          <ConvenientSelItem
            v-for="comp in convenientComp"
            :placeholder="comp.name"
            :key="comp.compId"
            :isActivited="activitedCompId === comp.compId"
            :value="form[comp.compId]"
            @click="clickConvenientSel(comp.compId)"
          ></ConvenientSelItem>
        </div>
      </scroll-view>
    </view>
    <view
      v-if="
        activitedCompId && activitedComp && activitedComp.dicList.length > 0
      "
      class="convenientSelItem__content"
    >
      <span
        v-for="dic in activitedComp.dicList"
        :key="dic.value"
        class="dicValue"
        :class="[
          checkedList.findIndex((item) => item.value === dic.value) !== -1
            ? `themeColor__bg-font-${getThemeIndex}`
            : '',
        ]"
        @click.stop="
          checkValues(
            dic,
            checkedList.findIndex((item) => item.value === dic.value)
          )
        "
      >
        {{ dic.name }}
      </span>
    </view>
    <view
      v-if="activitedCompId"
      class="convenientSel__Mask"
      @click.stop="activitedCompId = ''"
    ></view>
  </view>
</template>

<script>
import ConvenientSelItem from './ConvenientSelItem.vue';

export default {
  components: { ConvenientSelItem },

  inject: ['getPanel'],

  props: {
    convenientComp: {
      type: Array,
      default() {
        return [];
      }
    },
    elementList: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      scrollLeft: 0,
      activitedCompId: '',
      form: {}
    };
  },

  computed: {
    activitedComp() {
      const { activitedCompId, relateCompObj } = this;
      return relateCompObj[activitedCompId] || '';
    },
    checkedList() {
      const { form, activitedCompId } = this;
      return form[activitedCompId] || [];
    },
    relateCompObj() {
      const { elementList } = this;
      const obj = {};
      elementList.forEach((comp) => {
        if (comp.relateCompId) {
          const { dataSource } = comp;
          const { dictKey } = dataSource.dictObj;
          comp.dicList = this.$store.getters.getCurDict(dictKey) || [];
          obj[comp.relateCompId] = comp;
        }
      });
      return obj;
    },
    // 便捷搜索巨头控件类型
    compArray() {
      const { convenientComp } = this;

      const arry = [];
      convenientComp.forEach((item) => {
        const comp = this.getAllPane.compObj[item.compId];
        arry.push(comp);
      });
      return arry;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    clear() {
      this.form = {};
    },
    // 选择便捷搜索的值
    checkValues(dic, index) {
      console.log('checkValues==================');
      const list = [...this.checkedList];
      if (index === -1) list.push(dic);
      else list.splice(index, 1);

      const { activitedCompId } = this;
      this.$set(this.form, activitedCompId, list);
      this.doChange();
    },
    doChange() {
      const arry = [];
      const { convenientComp, relateCompObj, form } = this;
      convenientComp.forEach((item) => {
        const { compId } = item;
        const comp = relateCompObj[compId];
        let value = form[compId] || [];
        if (value.length > 0) {
          value = value.map((e) => e.value);
          arry.push({ ...comp, value: value.join() });
        }
      });
      this.$emit('change', arry);
    },
    clickConvenientSel(compId) {
      if (this.activitedCompId === compId) {
        this.activitedCompId = '';
        return;
      }
      console.log('clickConvenientSel========================');
      const comp = this.relateCompObj[compId];
      const { dicList } = comp;
      this.activitedCompId = compId;
      console.log(dicList);
      console.log(this.elementList);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.convenientSel {
  position: relative;

  &__Mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 11;
  }
  &__content {
    display: flex;
    align-items: center;
    height: 88rpx;
    z-index: 100;
  }
  &__scroll {
    position: relative;
    z-index: 100;
    padding: 0 30rpx;
    background: #fff;
    box-shadow: inset 0 1rpx 0 0 #e9e9e9;
  }
  .convenientSelItem__content {
    position: absolute;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: inset 0 1rpx 0 0 #e9e9e9;
    z-index: 100;
    padding: 30rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20rpx 20rpx;
    .dicValue {
      padding: 0 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #f8f8f8;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
