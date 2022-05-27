<!--
 * @Author: sss
 * @Date: 2021-12-22 16:29:08
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-22 16:29:08
 * @Desc: 按钮-竖排
-->
<template>
  <view class="btnsRow">
    <uni-fab
      ref="fab"
      :pattern="pattern"
      :content="content"
      horizontal="right"
      vertical="bottom"
      direction="vertical"
      @trigger="btnclick"
    />
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    // 按钮列表
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 按钮列表样式 1-无背景；2-主题色背景；3-自定义颜色
    type: {
      type: [Number, String],
      default: 1
    }
  },

  data() {
    return {};
  },

  computed: {
    content() {
      return this.list.map((item) => {
        // 按钮风格：1=文字按钮；2=图标文字按钮；3=图标按钮
        if (item.buttonForm === 1) item.iconFont = '';
        item.text = item.name;
        return item;
      });
    },
    pattern() {
      if (this.list.length === 0) return {};
      const pattern = {
        backgroundColor: '#fff',
        buttonColor: this.$store.state.base.themeColor,
        iconColor: '#fff'
      };
      if (this.type === 1) {
        pattern.buttonColor = '#fff';
        pattern.iconColor = this.$store.state.base.themeColor;
      } else if (this.type === 3) {
        pattern.buttonColor = this.list[0].iconColor;
        pattern.iconColor = '#fff';
      }
      return pattern;
    }
  },

  methods: {
    btnclick(e) {
      this.$emit('click', e.item);
    }
  },

  mounted() {
    console.log(this.content);
  }
};
</script>

<style lang='scss' scoped>
</style>
