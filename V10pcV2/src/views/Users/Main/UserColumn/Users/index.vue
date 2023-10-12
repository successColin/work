<!--  -->
<template>
  <div class="roleWrap__nameWrap" :class="{ haseBgColor: isShowBgColor }">
    <span :style="getColor(row)" class="avtor" v-if="!row.icon">
      {{ renderAvtor(row) }}
    </span>
    <span class="avtor" v-if="row.icon">
      <img
        class="imgWrap"
        v-if="row.icon.imageUrl"
        :src="$parseImgUrl(row.icon.imageUrl)"
      />
      <span v-if="!row.icon.imageUrl" class="avtor" :style="getColor(row)">{{
        renderAvtor(row)
      }}</span>
    </span>
    {{ row[prop] }}
  </div>
</template>

<script>
import cnchar from 'cnchar';

export default {
  inheritAttrs: false,
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    prop: {
      type: String,
      default: 'name'
    },
    isShowBgColor: {
      type: Boolean,
      default: true
    },
    userid: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    renderAvtor() {
      return (obj) => {
        let avtor = obj[this.prop] ? cnchar.spell(obj[this.prop], 'first', 'up') : '';
        const len = avtor.length;
        avtor = avtor.substr(len - 2, 2);
        return avtor;
      };
    },
    getColor() {
      return () => {
        const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
        const index = this.row[this.userid] || 0;
        const color = `background:${colors[index % 5]}`;
        return color;
      };
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.roleWrap__nameWrap {
  line-height: 24px;
  float: left;
  //height: 24px;
  border-radius: 12px;
  padding-right: 10px;
  font-size: 14px;
  color: #333333;
  &.haseBgColor {
    background: #f1f3f6;
  }
}

.avtor {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  line-height: 24px;
  text-align: center;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
}

.imgWrap {
  width: 24px;
  height: 24px;
  vertical-align: bottom;
  border-radius: 50%;
}
</style>
