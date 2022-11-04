/* eslint-disable no-nested-ternary */
import mpMixin from '@/mixin/mpMixin';

export default {
  inject: [],
  props: {
    element: Object,
    value: [Object, Number, String, Boolean],
  },

  mixins: [mpMixin],

  data() {
    return {};
  },

  computed: {
    // 字体样式
    labelStyle() {
      const { font, labelBg = {}, enableDict } = this.element;
      const { style, color } = labelBg;
      const { size, color: fontColor, style: fontWeight } = font;

      const styleObj = {
        fontSize: size === 0 ? '' : `${size}px`,
      };

      if (fontWeight !== 1) {
        styleObj.fontFamily =
          'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold';
        styleObj.fontWeight = 600;
      }

      // 样式 0-没有样式，1-圆角，2-椭圆（50%）
      if (style !== 0) {
        styleObj.borderRadius =
          style === 1 ? '8rpx' : style === 2 ? '100px' : '';
        // 如果不是字典,背景色和字体颜色可以设置，但如果是字典背景色和字体颜色从字典中取
        if (!enableDict) {
          styleObj.backgroundColor = color;
          styleObj.color = fontColor;
        }

        // 如果背景色为白色，则不设置编辑
        if (
          styleObj.backgroundColor &&
          styleObj.backgroundColor !== '#ffffff'
        ) {
          styleObj.padding = '8rpx 10rpx';
        }
      }
      return styleObj;
    },
  },

  watch: {},

  methods: {},

  mounted() {},
};
