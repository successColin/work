<template>
  <div class="tagBox" ref="tagBox">
    <apiot-tag
      ref="tag"
      class="m-r-4"
      style="margin-bottom: 0"
      @deleteSelf="getCurrntMultiArr = item"
      v-for="(item, index) in getCurrntMultiArr"
      :key="index"
      :item="item"
      :closable="!disabled"
      v-show="index < hiddenIndex"
    ></apiot-tag>
    <el-popover
      placement="bottom"
      trigger="hover"
      :popper-class="popperClass"
      style="height: 32px"
      v-bind="$attrs"
    >
      <section class="more__ul" :style="`width: ${curBoxWidth}px`">
        <apiot-tag
          v-for="(item, index) in getCurrntMultiArr.slice(hiddenIndex)"
          class="m-r-4"
          :key="index"
          @deleteSelf="getCurrntMultiArr = item"
          :configData="configData"
          :item="item"
          :closable="!disabled"
        ></apiot-tag>
      </section>
      <apiot-tag
        slot="reference"
        v-show="hiddenIndex !== getCurrntMultiArr.length"
        class="tagBox__more"
        itemIconClass="icon-gengduocaozuo"
        :closable="false"
      >
        <el-badge
          class="tagBox__badge"
          :value="getCurrntMultiArr.length"
          v-show="hiddenIndex !== getCurrntMultiArr.length"
        ></el-badge>
      </apiot-tag>
    </el-popover>
    <!-- <div class="readonly" v-if="disabled"></div> -->
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    form: {
      type: Object
    },
    configData: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: String,
      default: 'noPadding'
    },
    btnWidth: {
      type: Number,
      default: 72
    }
  },
  computed: {
    getCurrntMultiArr: {
      get() {
        const arr = this.form[`${this.configData.compId}_`]
          ? this.form[`${this.configData.compId}_`].split(',')
          : [];
        return arr;
      },
      set(value) {
        const valueArr = this.form[`${this.configData.compId}_`]
          ? this.form[this.configData.compId].split(',')
          : [];
        const tempArr = this.form[`${this.configData.compId}_`]
          ? this.form[`${this.configData.compId}_`].split(',')
          : [];
        const index = tempArr.findIndex((item) => item === value);
        tempArr.splice(index, 1);
        valueArr.splice(index, 1);
        this.form[`${this.configData.compId}_`] = tempArr.join(',');
        this.form[`${this.configData.compId}`] = valueArr.join(',');
        this.configData.selData = null;
      }
    }
  },
  data() {
    return {
      hiddenIndex: 0,
      curBoxWidth: 300
    };
  },
  mounted() {
    this.hiddenIndex = this.getCurrntMultiArr.length;
  },
  methods: {},
  components: {},
  watch: {
    'getCurrntMultiArr.length': {
      handler(v) {
        this.$nextTick(() => {
          const tagBoxWidth = this.$refs.tagBox.offsetWidth;
          this.curBoxWidth = tagBoxWidth - this.btnWidth;
          const moreW = 42;
          let curW = 0;
          this.hiddenIndex = v;
          setTimeout(() => {
            if (this.$refs.tag) {
              const index = this.$refs.tag.findIndex((comp) => {
                if (curW + moreW + comp.$el.offsetWidth + 4 < tagBoxWidth) {
                  curW += comp.$el.offsetWidth + 4;
                  return false;
                }
                return true;
              });
              if (index !== -1) {
                this.hiddenIndex = index;
              }
            }
          }, 100);
        });
      },
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
.tagBox {
  position: relative;
  vertical-align: top;
  display: inline-flex;
  align-items: center;
  &__more {
    margin-bottom: 0 !important;
    height: 32px !important;
    cursor: pointer;
  }
  &__badge {
    position: absolute;
    top: -4px;
    right: -15px;
    cursor: pointer;
  }
  .readonly {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    cursor: not-allowed;
  }
}
.more__ul {
  max-height: 128px;
  min-width: min-content;
  overflow-y: auto;
  padding: 10px 20px;
}
.more__li {
  height: 36px;
}
::v-deep {
  .wz {
    line-height: 32px !important;
  }
}
</style>
