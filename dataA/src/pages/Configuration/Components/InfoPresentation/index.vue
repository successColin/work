/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <CDragComponent
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      @deactivated="deactivated"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :minw="2"
      :minh="2"
      :parentScaleX="scale"
      :parentScaleY="scale"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="singleTextWrap" @contextmenu.prevent="show">
      <el-row :gutter="20">
        <div class="formWrap">

          <el-col :span="item.col" v-for="(item, i) in getFiledList" :key="`${item.key}_${i}`">
            <div class="itemWrap">
              <div class="labelWrap"
                   :class="getLabelClass"
                   :style="getLabelStyles(item)"
              >
                {{ item.labelName }}
              </div>
              <div class="valueWrap" :style="getValueStyles(item)">
                <span v-if="!item.isApplyToPictures && !item.isEdit" :title="renderValue(item)"
                      :style="getValueLastStyles(item)">{{ renderValue(item) }}</span>
                <el-image
                    v-if="item.isApplyToPictures"
                    :style="getImgStyles(item)"
                    :src="renderValue(item)"
                    fit="scale-down"></el-image>
                <textarea
                    class="textAreaWrap"
                    v-if="!item.isApplyToPictures && item.isEdit"
                    name="text"
                    :rows="item.editRows"
                    readonly
                    :style="getEditStyles(item)"
                    :value="renderValue(item)"/>
              </div>
            </div>
          </el-col>

        </div>

      </el-row>

    </div>
  </CDragComponent>
</template>

<script>

import {screenConfig} from '@/constants/global';
import {CheckImgExists} from '@/utils/utils';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
      }
    },
    config: {
      type: Object,
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      resObj: {} // 数据集合
    };
  },

  components: {},

  computed: {
    getEditStyles() {
      return function (params) {
        const {
          editBorderColor = '',
          editHoverBorderColor = '',
          editBgColor = '',
          editColor = '',
          editBorderRadius = 0,
          editFontSize = 14,
          editFontFamily = 'Arial',
          editFontWeight = 'normal'
        } = params;
        return {
          border: `1px solid ${editBorderColor || 'rgba(255, 255, 255, 0)'}`,
          borderRadius: `${editBorderRadius}px`,
          backgroundColor: editBgColor || 'rgba(255, 255, 255, 0)',
          '--hover-color': editHoverBorderColor || 'rgba(255, 255, 255, 0)',
          fontSize: `${editFontSize}px`,
          color: editColor,
          fontWeight: editFontWeight,
          fontFamily: editFontFamily
        };
      }
    },
    getImgStyles() {
      return function (params) {
        const {imgWidth, imgHeight} = params;
        return {
          width: `${imgWidth}px`,
          height: `${imgHeight}px`
        }
      }
    },
    renderValue() {
      return function (params) {
        const {field, isApplyToPictures, labelDefaultName} = params;
        const value = this.renderContent[field] ?? (labelDefaultName || '');
        if (isApplyToPictures && !CheckImgExists(value)) {
          return '';
        }
        return value
      }
    },
    preList() {
      return function (params) {
        const url = this.renderValue(params);
        return [url];
      }
    },
    getFiledList() { // 获取真实有效的配置
      const {stylesObj: {labelConfig = []}} = this.config;
      return labelConfig.filter((item) => item.field && item.isVisible);
    },
    getLabelClass() {
      const {stylesObj: {labelPosition}} = this.config;
      if (labelPosition === 'top') {
        return '';
      }
      ;
      return labelPosition;
    },
    getValueStyles() {
      return function () {
        const {stylesObj: {labelWidth, labelPosition}} = this.config;
        if (labelPosition === 'top') {
          return {width: '100%'};
        }
        return {
          width: `calc(100% - ${labelWidth}px)`
        }
      }
    },
    getValueLastStyles() {
      return function (params) {
        const {
          isNeedBg, // 是否需要背景色
          bgColor, // 背景色
          borderRadius,
          isEllipsis
        } = params;
        let obj = this.getLabelStyles(params);
        delete obj.width;
        if (!isEllipsis) {
          obj = {
            ...obj,
            whiteSpace: 'normal',
            lineHeight: 1.3
          }
        }
        if (!isNeedBg) {return obj;}
        return {
          ...obj,
          padding: '5px 8px',
          background: bgColor,
          borderRadius: `${borderRadius}px`
        }
      }
    },
    getLabelStyles() {
      return function (params) {
        const {
          labelFontFamily,
          labelFontWeight,
          labelFontSize,
          labelColor
        } = params;
        const {stylesObj: {labelWidth}} = this.config;
        return {
          width: `${labelWidth}px`,
          fontFamily: labelFontFamily,
          fontWeight: labelFontWeight,
          fontSize: `${labelFontSize}px`,
          color: labelColor
        };
      }
    },
    renderContent() {
      const {dataType, dataConfig, apiDataConfig, SqlDataConfig} = this.config;
      const {staticValue} = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        return obj;
      }
      if (dataType === 2) {
        const {apiFilterResponse} = apiDataConfig
        const obj = JSON.parse(apiFilterResponse);
        return obj;
      }
      if (dataType === 3) {
        const {SQLFilterResponse} = SqlDataConfig
        const obj = JSON.parse(SQLFilterResponse);
        return obj;
      }
      return {};
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {},
  methods: {
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstop(newRect) {
      // this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick() {
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    -webkit-background-clip: text;
    color: transparent;
  }

  .formWrap {
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;

    ::v-deep {
      .el-col {
        margin-bottom: 10px;
      }
    }

    .itemWrap {
      position: relative;
      overflow: hidden;
      min-height: 36px;

      .labelWrap {
        float: left;
        min-height: 36px;
        padding: 0 8px;
        box-sizing: border-box;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .valueWrap {
        float: left;
        padding: 0 8px;
        box-sizing: border-box;

        & > span {
          display: inline-block;
          max-width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          box-sizing: border-box;
        }
      }

      .left {
        text-align: left;
      }

      .right {
        text-align: right;
      }

      .textAreaWrap{
        width: 100%;
        padding: 0 5px;
        line-height: 1.5;
        outline: none;
        resize: vertical;
        box-sizing: border-box;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        &:hover{
          border-color: var(--hover-color) !important;
        }
      }
    }
  }
}
</style>
