import { getColumnUniqueness } from '@/api/menuConfig';
import mpMixin from '@/mixin/mpMixin';

export default {
  inject: ['getAllForm'],
  props: {
    value: {
      type: [String, Number, Boolean, Array],
      default: '',
    },
    element: Object,
    flagComp: Object, // id对应的控件
  },

  mixins: [mpMixin],

  data() {
    return {
      elValue: '',
    };
  },

  computed: {
    compShow() {
      // const { canShow, singleStatus } = this.element;
      // if (!canShow) return false;
      return this.element.canShow;
    },
  },

  watch: {
    value(newValue) {
      this.elValue = newValue;
    },
  },

  methods: {
    async valueChang(value) {
      const { element } = this;
      const { compId, shouldRepeat } = element;
      const valueObj = {};
      valueObj[compId] = value;
      if (shouldRepeat) {
        await this.compNoRepeat(value);
      }

      if (!this.element.notUnique) this.$emit('change', valueObj, element);
      else {
        console.log('========================');
        //  为了兼容钉钉小程序vuedom不能直接挂载到data中；错误做法：this.vmdom = this.$parent
        let parent = this.$parent;
        // #ifdef H5
        parent = this.$parent.$parent;
        // #endif
        console.log(parent);
        parent.validate(compId);
      }
    },
    // 是否不能重复
    async compNoRepeat(value) {
      const { dataSource, name } = this.element;
      const { compId } = this.flagComp;
      const data = await getColumnUniqueness({
        columnName: dataSource.columnName,
        columnTypeDict: dataSource.columnTypeDict,
        columnValue: value,
        id: this.getAllForm()[compId],
        tableName: dataSource.tableName,
      });
      // console.log(data);
      if (data > 0) {
        this.element.notUnique = true;
        uni.$u.toast(`${name}已经存在`);
      } else {
        this.element.notUnique = false;
      }
    },
  },

  mounted() {
    this.elValue = this.value;
  },
};
