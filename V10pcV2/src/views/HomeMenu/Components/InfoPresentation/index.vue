/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles">
    <el-row :gutter="20">
      <div class="formWrap">

        <el-col :span="item.col" v-for="(item, i) in getFiledList" :key="`${item.key}_${i}`">
          <div class="itemWrap" :class="getItemClass(item)">
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
                  :style="getEditStyles(item)"
                  @change="changeValue($event, item)"
                  :value="renderValue(item)"/>
            </div>
          </div>
        </el-col>

      </div>

    </el-row>

  </div>
</template>

<script>

import { CheckImgExists } from '@/utils/utils';
import { getInfoById } from '@/api/design';
import { checkAndGetOtherParams, getRequestParams } from '_v/HomeMenuConfig/constants/common';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    filterParameter: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      params: {},
      timer: null,
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
      };
    },
    getContentStyles() {
      const {
        width,
        height,
        top,
        left,
        stylesObj
      } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getItemClass() {
      return function ({ isApplyToPictures }) {
        const { stylesObj: { labelPosition } } = this.config;
        if (labelPosition === 'top') {
          return '';
        }
        if (labelPosition !== 'top' && !isApplyToPictures) {
          return 'flex';
        }
        if (labelPosition !== 'top' && isApplyToPictures) {
          return 'normal';
        }
        return '';
      };
    },
    getImgStyles() {
      return function (params) {
        const {
          imgWidth,
          imgHeight
        } = params;
        return {
          width: `${imgWidth}px`,
          height: `${imgHeight}px`
        };
      };
    },
    getPlaceholder() {
      return function (item) {
        const {
          labelDefaultName = '默认项目',
          isEdit
        } = item;
        if (isEdit) {
          return labelDefaultName;
        }
        return '';
      };
    },
    renderValue() {
      return function (params) {
        const {
          field,
          isApplyToPictures,
          labelDefaultName = '默认项目',
          isEdit
        } = params;
        const areaContent = isEdit ? '' : labelDefaultName;
        const value = this.renderContent[field] ?? (areaContent || '');
        if (isApplyToPictures && !CheckImgExists(value)) {
          return '';
        }
        return value;
      };
    },
    preList() {
      return function (params) {
        const url = this.renderValue(params);
        return [url];
      };
    },
    getFiledList() { // 获取真实有效的配置
      const { stylesObj: { labelConfig = [] } } = this.config;
      return labelConfig.filter((item) => item.field && item.isVisible);
    },
    getLabelClass() {
      const { stylesObj: { labelPosition } } = this.config;
      if (labelPosition === 'top') {
        return '';
      }
      return labelPosition;
    },
    getValueStyles() {
      return function () {
        const {
          stylesObj: {
            labelWidth,
            labelPosition
          }
        } = this.config;
        if (labelPosition === 'top') {
          return { width: '100%' };
        }
        return {
          width: `calc(100% - ${labelWidth}px)`
        };
      };
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
          };
        }
        if (!isNeedBg) {
          return obj;
        }
        return {
          ...obj,
          padding: '5px 8px',
          background: bgColor,
          borderRadius: `${borderRadius}px`
        };
      };
    },
    getLabelStyles() {
      return function (params) {
        const {
          labelFontFamily,
          labelFontWeight,
          labelFontSize,
          labelColor
        } = params;
        const { stylesObj: { labelWidth } } = this.config;

        return {
          width: `${labelWidth}px`,
          fontFamily: labelFontFamily,
          fontWeight: labelFontWeight,
          fontSize: `${labelFontSize}px`,
          color: labelColor
        };
      };
    },
    renderContent() {
      const {
        dataType,
        dataConfig
      } = this.config;
      const { staticValue } = dataConfig;
      if (dataType === 1) {
        try {
          const obj = JSON.parse(staticValue);
          return obj;
        } catch (e) {
          return {};
        }
      }
      return this.resObj;
    }
  },
  mounted() {
    this.checkFilterParameter(false);
  },
  activated() {
    this.checkFilterParameter(false);
  },
  watch: {
    filterParameter: {
      deep: true,
      immediate: false,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          if (isShow) {
            this.checkFilterParameter(true);
          }
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          // eslint-disable-next-line max-len
          const lastOtherParams = checkAndGetOtherParams({ config: this.config, otherParams: this.otherParams });
          if (isShow && JSON.stringify(lastOtherParams) !== '{}') {
            this.init();
          }
        }
      }
    }
  },
  methods: {
    checkFilterParameter(flag) {
      const paramsObj = {};
      const { componentId } = this.config;
      Object.keys(this.filterParameter).forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.split('_')[1];
          paramsObj[key] = this.filterParameter[item];
        }
      });
      this.params = paramsObj;
      this.$nextTick(() => {
        if (flag && JSON.stringify(paramsObj) === '{}') {
          return;
        }
        this.init();
      });
    },
    changeValue($event, { field }) {
      const v = $event.target.value;
      this.resObj[field] = v;
    },
    async init() {
      const {
        dataType,
        dataConfig
      } = this.config;
      const { staticValue } = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        this.resObj = obj;
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        this.loading = false;
      }
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const { query = {}, name } = this.$route;
      const params = getRequestParams({
        config: this.config,
        routeQuery: name !== 'appCustomPage' ? {} : query,
        otherParams: this.otherParams,
        elseParams: this.params || {}
      });
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.getSQL();
        }, time);
      }
      if (!enableSQLFilter) {
        this.resObj = JSON.stringify(res);
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.resObj = result;
        return;
      }
      this.resObj = JSON.stringify(res);
    }

  },
  beforeDestroy() {
    // eslint-disable-next-line no-unused-expressions
    this.timer && clearTimeout(this.timer);
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
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

      .textAreaWrap {
        width: 100%;
        padding: 0 5px;
        line-height: 1.5;
        outline: none;
        resize: vertical;
        box-sizing: border-box;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);

        &:hover {
          border-color: var(--hover-color) !important;
        }
      }

    }
  }
}
</style>
