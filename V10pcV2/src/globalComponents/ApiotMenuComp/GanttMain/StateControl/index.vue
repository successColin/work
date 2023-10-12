v
<template>
  <div class="stateControl">
    <div class="stateControl__left">状态</div>
    <div class="stateControl__right">
      <div
        v-for="dict in getDictArr"
        :key="dict.id"
        class="m-r-12"
        @click="selectState(dict.value)"
      >
        <span
          v-if="!activeValue.includes(dict.value)"
          class="stateControl__right--box m-t-6"
          :style="`borderColor:${dict.color}`"
        ></span>
        <i
          v-else
          class="iconfont icon-wancheng1"
          :style="`color:${dict.color}`"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    dictObj: {
      type: Object,
    },
    isConfig: {
      type: Boolean,
    },
  },
  data() {
    return {
      activeValue: [],
    };
  },
  computed: {
    getDictKey() {
      if (this.dictObj) {
        return this.dictObj.dictKey;
      }
      return '';
    },
    getDictArr() {
      let tempData = [];
      if (this.isConfig && this.dictObj) {
        tempData = this.dictObj.dictValue;
      } else if (this.getDictKey) {
        tempData = this.$store.getters.getCurDict(this.getDictKey);
      }
      if (Array.isArray(tempData)) {
        tempData = JSON.parse(JSON.stringify(tempData));
        if (tempData.length) {
          return tempData;
        }
      }
      if (this.isConfig || this.isPreview) {
        return [
          {
            name: '选项1',
            value: 1,
            color: '#E73D3D',
          },
          {
            name: '选项2',
            value: 2,
            color: '#FAB71C',
          },
        ];
      }
      return [];
    },
  },
  components: {},
  methods: {
    selectState(v) {
      if (this.activeValue.includes(v)) {
        const index = this.activeValue.findIndex((vv) => vv === v);
        this.activeValue.splice(index, 1);
      } else {
        this.activeValue.push(v);
      }
      this.$emit('changeStateValue', this.activeValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.stateControl {
  border: 1px solid #e9e9e9;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  cursor: pointer;
  border-radius: 4px;
  &__left {
    color: #111111;
    width: 46px;
    border-right: 1px solid #e9e9e9;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #111111;
  }
  &__right {
    padding: 0 12px 0 10px;
    display: flex;
    &--box {
      display: inline-block;
      vertical-align: top;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 4px solid #fff;
    }
    i {
      font-size: 17px;
    }
  }
}
</style>
