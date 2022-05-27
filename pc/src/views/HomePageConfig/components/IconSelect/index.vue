<!--
* @Description: 图标选择器
* @Author: cmk
* @Date: 2021-04-28 10:04:15
* @Last Modified by: cmk
* @Last Modified time: 2021-04-28 10:04:15
-->
<template>
  <div class="icon-wrapper">
    <div
      class="iconSelect"
      :class="[
        { scaleClass: shouldScale },
        { notEdit: notEdit },
        { hasDefault: tempIcon !== 'icon-jiahao' || !!tempImg },
      ]"
      @click="showIconSelect"
      :style="getCurStyle"
    >
      <i :class="`iconfont ${tempIcon}`" v-if="!tempImg"></i>
      <img :src="tempImg" v-if="tempImg" class="showImg" />
      <div class="iconSelect__change">
        <i class="iconfont icon-qiehuan"></i>
      </div>
    </div>
    <icon-dialog
      ref="iconDialog"
      v-bind="$attrs"
      :mouseStop="true"
      :showSelfIcon="true"
      :visible.sync="iconDialog"
      @iconSelected="iconSelected"
      :iconFontClass.sync="tempIcon"
      :iconFontColor.sync="tempColor"
      :iconImgUrl.sync="tempImg"
      :title="$t('common.add', { name: $t('menu.icon') })"
    ></icon-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 大小尺寸 48 还是32
    shouldScale: {
      type: Boolean,
      default: false
    },
    // 能否编辑
    notEdit: {
      type: Boolean,
      default: false
    },
    // 当前的icon
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      iconDialog: false,
      tempIcon: 'icon-jiahao',
      tempColor: '',
      tempImg: ''
    };
  },

  components: {},

  computed: {
    getCurStyle() {
      if (this.tempColor && this.tempIcon !== 'icon-jiahao') {
        return `color:${this.tempColor};border: 0 none`;
      }
      if (this.tempImg) {
        return 'border: 0 none';
      }
      return '';
    }
  },

  mounted() {
    if (this.item.icon) {
      this.tempIcon = this.item.icon;
    }
    if (this.item.color) {
      this.tempColor = this.item.color;
    }
    if (this.item.imageUrl) {
      this.tempImg = this.item.imageUrl;
    }
  },

  methods: {
    // 显示图标选择框
    showIconSelect() {
      if (this.notEdit) {
        return;
      }
      this.iconDialog = true;
      this.$nextTick(() => {
        this.$refs.iconDialog.initDialog();
      });
    },
    // 图标选中
    iconSelected() {
      const obj = {
        icon: this.tempIcon === 'icon-jiahao' ? '' : this.tempIcon,
        color: this.tempColor,
        imageUrl: this.tempImg
      };
      this.$emit('update:item', obj);
      this.$emit('iconSelected', obj);
    }
  }
};
</script>

<style lang='scss' scoped>
.iconSelect {
  position: relative;
  width: 48px;
  height: 48px;
  line-height: 48px;
  border: 1px dashed #d9d9d9;
  background: #ffffff;
  border-radius: 4px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  will-change: transform;
  .iconfont {
    font-size: 48px;
  }
  .showImg {
    width: 48px;
    height: 48px;
  }
  &.scaleClass {
    width: 32px;
    height: 32px;
    line-height: 32px;
    .iconfont {
      font-size: 32px;
    }
    .showImg {
      width: 32px;
      height: 32px;
    }
  }
  .icon-jiahao {
    font-size: 16px !important;
    color: #bbc3cd;
  }
  &:hover:not(.notEdit) {
    border-color: $--color-primary;
    .icon-jiahao {
      color: $--color-primary;
    }
  }
  &.hasDefault:hover:not(.notEdit) {
    .iconSelect__change {
      display: block;
    }
  }
  &__change {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    .icon-qiehuan {
      font-size: 16px !important;
      color: #fff !important;
    }
  }
}
</style>
