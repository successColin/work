export default {
  props: {
    // 用于v-model双向绑定选中的星星数量
    value: {
      type: [String, Number],
      default: uni.$u.props.rate.value,
    },
    // 要显示的星星数量
    count: {
      type: [String, Number],
      default: 5,
    },
    // 是否不可选中
    disabled: {
      type: Boolean,
      default: false,
    },
    // 星星的大小，单位px
    size: {
      type: [String, Number],
      default: 40,
    },
    // 未选中时的颜色
    inactiveColor: {
      type: String,
      default: '#D9D9D9',
    },
    // 选中的颜色
    activeColor: {
      type: String,
      default: '#FAB71C',
    },
    // 星星之间的间距，单位px
    gutter: {
      type: [String, Number],
      default: 17,
    },
    // 最少能选择的星星个数
    minCount: {
      type: [String, Number],
      default: uni.$u.props.rate.minCount,
    },
    // 是否允许半星
    allowHalf: {
      type: Boolean,
      default: false,
    },
    // 选中时的图标(星星)
    activeIcon: {
      type: String,
      default: uni.$u.props.rate.activeIcon,
    },
    // 未选中时的图标(星星)
    inactiveIcon: {
      type: String,
      default: uni.$u.props.rate.inactiveIcon,
    },
    // 是否可以通过滑动手势选择评分
    touchable: {
      type: Boolean,
      default: true,
    },
    // 展示类型 star=五角星；line-exp=线性表情；facial-exp=面性表情；flag=红旗
    showType: {
      type: String,
      default: 'flag',
    },
    // 是否展示内容
    showLevel: {
      type: Boolean,
      default: false,
    },
  },
};
