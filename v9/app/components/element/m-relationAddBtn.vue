<!-- 关联面板-新增按钮
 这种控件类型需要配置业务表、业务表字段、关联弹出面板。
 默认需要数据回填，监测到数据变化自动保存。
 默认取回填的数据中的id对应到业务表字段-->
<template name="mRelationAddBtn">
  <view class="mButton" :class="[btnClass]" v-show="static_visiabled">
    <div
      :style="{ fontSize: pxToREM(fontSize) }"
      @tap.stop="handleClick"
      style="z-index: 1000"
    >
      <m-font-icon icon="iconguanliantianjia" :iconSize="40"></m-font-icon>
    </div>
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { formApi } from '@/common/request/api.js';
export default {
  name: 'mRelationAddBtn',
  data() {
    return {
      static_visiabled: this.visiabled,
      btnTilte_: this.btnTilte,
      disabled_: this.disabled,
      elementId_: this.elementId,
      isLoading: false, //按钮是否带loading
    };
  },
  props: {
    dataId: [String, Number], //主业务数据
    relationColumn: String, //关联主业务表字段
    relationTabId: [String, Number], //关联面板
    relationTableName: [String, Number], //关联表
    relationColumnName: [String, Number], //业务表字段
    btnTilte: {
      //按钮显示值
      type: [String, Number],
    },
    btnClass: {
      //按钮颜色
      type: String,
    },
    disabled: {
      //按钮是否不可编辑
      type: Boolean,
      default: false,
    },
    fontSize: {
      //按钮字体大小
      type: Number,
      default: 32,
    },
    btnClick: {
      type: Function,
    },
    btnColor: {
      validator(value) {
        const color16 = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
        const colorRGB =
          /^[rR][gG][Bb][Aa]?[\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\.\d{1,2}|1|0)?[\)]{1}$/;
        if (!value) {
          return true;
        } else {
          return color16.test(value) || colorRGB.test(value);
        }
      },
    },
    elementId: [String, Number],
    visiabled: {
      type: [Number, Boolean],
      default: 1,
    }, //是否显示
  },
  computed: {
    plain_() {
      if (this.disabled_) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    handleClick() {
      this.$emit('elementClick', {
        elementId: this.elementId_,
        relationTabId: this.relationTabId,
        onkey: this._uid,
      });
    },
    addRelation(relations) {
      //添加数据
      if (relations.length == 0 || !this.dataId) return;
      formApi
        .batchInsertOrUpdate(this, {
          static_list: relations,
        })
        .then((result) => {
          if (result.success) {
            this.$emit('doParentReFresh');
          } else {
            uni.showModal({
              title: this.$t('basic-modalTipError'),
              content: result.msg,
              showCancel: false,
              confirmText: this.$t('basic-confirm'),
            });
          }
        });
    },
  },
  created() {
    //设置监听
    const _this = this;
    let onKey = `relationAdd${this._uid}`;
    bus.$on(onKey, (params) => {
      //获取传递的参数并进行操作
      const primaryKey = params.primaryKey,
        checkNode = params.checkNode;
      let relations = [];
      for (let i = 0, len = checkNode.length; i < len; i++) {
        let param = {},
          relationColumnData = checkNode[i][primaryKey];
        try {
          relationColumnData = JSON.parse(relationColumnData);
        } catch (e) {}
        if (relationColumnData && typeof relationColumnData === 'object') {
          relationColumnData = relationColumnData.id;
        }
        param[_this.relationColumnName] = relationColumnData;
        param[_this.relationColumn] = _this.dataId;
        param.static_tableName = _this.relationTableName;
        relations.push(param);
      }
      _this.addRelation(relations);
    });
  },
};
</script>
