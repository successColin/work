/**
* @name: index
* @author: DELL
* @date: 2021/12/23 15:01
* @description：index
* @update: 2021/12/23 15:01
*/
<!-- 页面 -->
<template>
  <div class="GeneralTableWrap " v-loading="loading" :id="`list_${config.componentId}`">
    <div class="tableHeader" v-if="config.enableHeader" :style="getTheadStyles">
      <div class="column serial" v-if="config.enableSno"></div>
      <div
          class="column column-thead"
          v-for="(item, index) in columnArr"
          :key="`${index}_${item.fieldName}_${item.field}`"
          :style="getColumnStyles(item)"
      >
        {{ item.fieldName }}
      </div>
    </div>
    <!-- 行不置顶 -->
    <div class="seamless-warp"
         :style="getListScroll(true)"
         v-if="!config.enableRowTopping"
         ref="listScroll"
    >
      <div
          class="list column-list"
          v-for="(item,i) in list"
          :key="i"
          :style="getLiStyles(item, i, true)"
      >
        <div
            class="column serial"
            v-if="config.enableSno"
            :style="getSnoStyles(i)"
        >{{ item.snoZ }}
        </div>
        <div
            class="column column-td"
            v-for="(column, index) in columnArr"
            :key="`${index}_${column.fieldName}_${column.field}_${i}`"
            :style="getListColumnStyles(column, i, item)"
        >
          <div
              class="column-content"
              v-if="!column.isApplyPicture"
              :class="{'ellipsis': column.isEllipsis, 'unEllipsis': !column.isEllipsis}"
          >
            <img
                class="prefix"
                v-if="getPrefixUrl(column, item)"
                :src="getPrefixUrl(column, item)"
                :style="getPrefixStyles(column)"
            />
            <span
                :class="{'unExpress': !column.isEllipsis}"
                @click="doHref(column, item)"
                :style="getColumnContentStyles(column, item)"
                :title="renderValue(column, item)">
              {{ renderValue(column, item) }}
            </span>
            <span
                class="column-iconOpe"
                v-if="column.interactionMode===4 && getFilesType(column, item).isShow"
                :style="getIconStyles(column, i, item)"
            >
               <el-tooltip effect="dark" content="预览" placement="top">
                 <span
                     class="el-icon-view"
                     v-if="isShowView(column, item)"
                     @click="handlePreview(column, item)"
                 ></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="下载" placement="top">
                 <span class="el-icon-download" @click="handleDown(column, item)"></span>
              </el-tooltip>
            </span>
          </div>
          <div
              class="column-images"
              v-if="column.isApplyPicture && getImageUrl(column, item)"
              :style="getImageStyles(column)"
              @click="handleImagePreview(column, item)"
          >
            <el-image
                style="height: calc(100% - 18px)"
                :src="getImageUrl(column, item)"
                fit="contain"></el-image>
          </div>
        </div>
      </div>
    </div>

    <!-- 行置顶 -->
    <div class="seamless-warp" v-if="config.enableRowTopping" :style="getListScroll(true)" ref="listScroll">
      <div :style="getRowToppingStyles">
        <div
            class="list column-list"
            v-for="(item,i) in topListData"
            :key="i"
            :style="getLiStyles(item, i, false)"
        >
          <div
              class="column serial"
              v-if="config.enableSno"
              :style="getSnoStyles(i)"
          >{{ item.snoZ }}
          </div>
          <div
              class="column column-td"
              v-for="(column, index) in columnArr"
              :key="`${index}_${column.fieldName}_${column.field}_${i}`"
              :style="getListColumnStyles(column, i, item)"
          >
            <div
                class="column-content"
                v-if="!column.isApplyPicture"
                :class="{'ellipsis': column.isEllipsis, 'unEllipsis': !column.isEllipsis}"
            >
              <img
                  class="prefix"
                  v-if="getPrefixUrl(column, item)"
                  :src="getPrefixUrl(column, item)"
                  :style="getPrefixStyles(column)"
              />
              <span
                  :class="{'unExpress': !column.isEllipsis}"
                  @click="doHref(column, item)"
                  :style="getColumnContentStyles(column, item)"
                  :title="renderValue(column, item)">
              {{ renderValue(column, item) }}
            </span>
              <span
                  class="column-iconOpe"
                  v-if="column.interactionMode===4 && getFilesType(column, item).isShow"
                  :style="getIconStyles(column, i, item)"
              >
               <el-tooltip effect="dark" content="预览" placement="top">
                 <span
                     class="el-icon-view"
                     v-if="isShowView(column, item)"
                     @click="handlePreview(column, item)"
                 ></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="下载" placement="top">
                 <span class="el-icon-download" @click="handleDown(column, item)"></span>
              </el-tooltip>
            </span>
            </div>
            <div
                class="column-images"
                v-if="column.isApplyPicture && getImageUrl(column, item)"
                :style="getImageStyles(column)"
                @click="handleImagePreview(column, item)"
            >
              <el-image
                  style="height: calc(100% - 18px)"
                  :src="getImageUrl(column, item)"
                  fit="contain"></el-image>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
            class="list column-list"
            v-for="(item,i) in list"
            :key="`${item.snoZ}_${i}`"
            :style="getLiStyles(item, i, true)"
        >
          <div
              class="column serial"
              v-if="config.enableSno"
              :style="getSnoStyles(i)"
          >{{ item.snoZ }}
          </div>
          <div
              class="column column-td"
              v-for="(column, index) in columnArr"
              :key="`${index}_${column.fieldName}_${column.field}_${i}`"
              :style="getListColumnStyles(column, i, item)"
          >
            <div
                class="column-content"
                v-if="!column.isApplyPicture"
                :class="{'ellipsis': column.isEllipsis, 'unEllipsis': !column.isEllipsis}"
            >
              <img
                  class="prefix"
                  v-if="getPrefixUrl(column, item)"
                  :src="getPrefixUrl(column, item)"
                  :style="getPrefixStyles(column)"
              />
              <span
                  :class="{'unExpress': !column.isEllipsis}"
                  @click="doHref(column, item)"
                  :style="getColumnContentStyles(column, item)"
                  :title="renderValue(column, item)">
              {{ renderValue(column, item) }}
            </span>
              <span
                  class="column-iconOpe"
                  v-if="column.interactionMode===4 && getFilesType(column, item).isShow"
                  :style="getIconStyles(column, i, item)"
              >
               <el-tooltip effect="dark" content="预览" placement="top">
                 <span
                     class="el-icon-view"
                     v-if="isShowView(column, item)"
                     @click="handlePreview(column, item)"
                 ></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="下载" placement="top">
                 <span class="el-icon-download" @click="handleDown(column, item)"></span>
              </el-tooltip>
            </span>
            </div>
            <div
                class="column-images"
                v-if="column.isApplyPicture && getImageUrl(column, item)"
                :style="getImageStyles(column)"
                @click="handleImagePreview(column, item)"
            >
              <el-image
                  style="height: calc(100% - 18px)"
                  :src="getImageUrl(column, item)"
                  fit="contain"></el-image>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import {getInfoById} from '@/services/design';
import {checkDetials, validConditions} from '@/utils/common';
import {getBlob, saveAs} from '@/utils/utils';
import {isEqual, cloneDeep} from 'lodash';
import Bus from '@/utils/bus';
import {decrypt} from '@/utils/secret';

const setSnoZ = (list = []) => {
  return list.map((item, index) => {
    return {
      ...item,
      snoZ: index + 1
    }
  })
}
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default() {
        return 1;
      }
    },
    type: {
      type: String,
      default() {
        return '';
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      client: null,
      imageFileUrl: '',
      imageFileName: '',
      list: [],
      originList: [], // 源数据
      height: 0,
      timer: null,
      transactionY: 0,
      timerSql: null,
      timerApi: null,
      otherTimer: null,
      loading: false,
      loopArr: [], // 显示区域的数据
      topListData: [] // 置顶的数据
    };
  },

  components: {},

  computed: {
    getRowToppingStyles() {
      const {rowToppingBg} = this.config;
      if (rowToppingBg) {
        return {
          backgroundColor: rowToppingBg
        }
      }
      return ''
    },
    columnArr() {
      const {columnConfig = []} = this.config;
      return columnConfig;
    },
    isShowView() {
      return function (column, data) {
        const obj = this.getFilesType(column, data);
        if (['jpg', 'png', 'jif', 'jpeg', 'png'].includes(obj.type)) {
          return true;
        }
        return false;
      }
    },
    getFilesType() { // 获取文件类型
      return function (column, data) {
        const {callbackFields} = column;
        const url = data[callbackFields];
        if (!url) {
          return {isShow: false};
        }
        const reg = /(http|https):\/\/([\w.]+\/?)\S*/ig;
        const result = url.match(reg);
        if (!result) {
          return {isShow: false};
        }
        const newUrl = result[0] || '';
        if (!newUrl) {
          return {isShow: false};
        }
        const arr = newUrl.split('.');
        const n = arr.length;
        return {
          isShow: true,
          type: arr[n - 1],
          url: newUrl
        }
      }
    },
    getIconStyles() { // 获取icon颜色
      return function (column, i, data) {
        const {
          fieldFontSize,
          fieldColor
        } = column;
        const {
          enableLinesHighlighted,
          stylesObj: {
            rows = 10,
            autoHighlight,
            highlightFontSize,
            highlightColor,
            loop,
            animationTypes
          }
        } = this.config;
        const conditionColor = this.getColor(column, data, 'fieldRelColor');
        if (enableLinesHighlighted && autoHighlight && loop && animationTypes === 2 && i === 0 && this.list.length > rows) {
          return `fontSize:${highlightFontSize}px;color:${highlightColor};`;
        }
        return `fontSize:${fieldFontSize}px;color:${conditionColor || fieldColor};`;
      }
    },
    getListColumnStyles() { //
      return function (column, i, data) {
        const {
          fieldFontFamily,
          fieldFontWeight,
          fieldFontSize,
          fieldColor,
          fieldTextAlign,
          fieldWidth,
          isEllipsis
          // conditionsArr = []
        } = column;
        const {
          enableLinesHighlighted,
          stylesObj: {
            rows = 10,
            autoHighlight,
            highlightFontFamily,
            highlightFontWeight,
            highlightFontSize,
            highlightColor,
            loop,
            animationTypes
          }
        } = this.config;
        const height = this.height / rows / this.scale;
        const conditionColor = this.getColor(column, data, 'fieldRelColor');
        const realWidth = this.getColumnWidth(fieldWidth);
        const obj = {
          lineHeight: `${height}px`,
          height: `${height}px`,
          width: `${realWidth}px`,
          textAlign: `${fieldTextAlign}`
        }
        if (!isEllipsis) {
          delete obj.lineHeight;
        }
        if (enableLinesHighlighted && autoHighlight && loop && animationTypes === 2 && i === 0 && this.list.length > rows) {
          return {
            ...obj,
            fontFamily: `${highlightFontFamily}`,
            fontWeight: `${highlightFontWeight}`,
            fontSize: `${highlightFontSize}px`,
            color: `${highlightColor}`
          }
        }
        return {
          ...obj,
          fontFamily: `${fieldFontFamily}`,
          fontWeight: `${fieldFontWeight}`,
          fontSize: `${fieldFontSize}px`,
          color: `${conditionColor || fieldColor}`
        }
      }
    },
    getColor() {
      return function (column, data, key) {
        const {
          conditionsArr = []
        } = column;
        let conditionColor = '';
        if (conditionsArr.length) {
          const realConditionsArr = conditionsArr.filter((item) => item.enableConditions);
          if (realConditionsArr.length) {
            const color = validConditions(realConditionsArr, data, key);
            conditionColor = color;
          }
        }
        return conditionColor;
      }
    },
    getListScroll() {
      return function (flag = false) {
        const {
          stylesObj: {
            theadHeight,
            loop
          },
          enableHeader
        } = this.config;
        const height = enableHeader ? 100 - theadHeight : 100;
        const overflow = loop ? 'hidden' : 'auto';
        if (flag) return `height:${height}%;overflow:${overflow};`
        return `height:${height}%;`
      }
    },
    getTheadStyles() {
      const {
        stylesObj: {
          theadHeight,
          theadBgColor,
          theadFontFamily,
          theadFontWeight,
          theadFontSize,
          theadColor,
          theadTextAlign
        }
      } = this.config;
      return `height:${theadHeight}%;background-color:${theadBgColor};color: ${theadColor};fontSize:${theadFontSize}px;fontWeight:${theadFontWeight};fontFamily:${theadFontFamily};textAlign:${theadTextAlign};`;
    },
    getTheadTotalWidth() { // 获取列表宽总宽度
      const columnArr = this.columnArr;
      let total = columnArr.reduce((pre, current) => {
        const {fieldWidth} = current;
        return pre + fieldWidth;
      }, 0);
      const {width} = this.config;
      const realWidth = width * this.scale;
      return {
        realWidth,
        total
      }
    },
    getColumnWidth() { // 获取每个格子的宽度
      return function (cw) {
        const {realWidth, total} = this.getTheadTotalWidth;
        const {enableSno} = this.config;
        if (!enableSno) {
          return cw / total * realWidth / this.scale;
        }
        return cw / total * ((realWidth - 50) / this.scale);
      };
    },
    getColumnStyles() {
      return function (obj) {
        const {fieldWidth} = obj;
        const {
          stylesObj: {
            theadFontFamily,
            theadFontWeight,
            theadFontSize,
            theadColor,
            theadTextAlign
          }
        } = this.config;
        const realWidth = this.getColumnWidth(fieldWidth);
        return `width:${realWidth}px;color: ${theadColor};fontSize:${theadFontSize}px;fontWeight:${theadFontWeight};fontFamily:${theadFontFamily};textAlign:${theadTextAlign};`;
      }
    },
    renderValue() { // 渲染数据
      return function (column, item) {
        const {field} = column;
        return item[field] || '';
      }
    },
    getImageUrl() { // 获取图片路径
      return function (column, item) {
        const {field} = column;
        const value = item[field] || '';
        if (!value) {
          return '';
        }
        const reg = /(http|https):\/\/([\w.]+\/?)\S*/ig;
        const result = value.match(reg);
        if (!result) {
          return '';
        }
        return result[0] || '';
      }
    },
    getPreviewList() {
      return function (column, item) {
        const url = this.getImageUrl(column, item);
        return [url];
      }
    },
    getImageStyles() {
      return function (column) {
        const {fieldTextAlign} = column;
        if (fieldTextAlign === 'center') {
          return {
            justifyContent: 'center'
          };
        }
        if (fieldTextAlign === 'left') {
          return {
            justifyContent: 'flex-start'
          };
        }
        if (fieldTextAlign === 'right') {
          return {
            justifyContent: 'flex-end'
          };
        }
        return {
          justifyContent: 'flex-end'
        };
      }
    },
    getLiStyles() {
      return function ({snoZ}, i, flag) {
        const retust = snoZ % 2;
        const {
          enableLinesHighlighted,
          enableRowTopping,
          rowToppingBg,
          stylesObj: {
            oddBgColor,
            evenBgColor,
            rows = 10,
            autoHighlight,
            highlightFontFamily,
            highlightFontWeight,
            highlightFontSize,
            highlightColor,
            highlightBgColor,
            loop,
            animationTypes,
            speHighlight
          }
        } = this.config;
        const height = this.height / rows / this.scale;
        let highLightStyles = '', speHighlightArr = [];
        let bg = '';
        if (speHighlight) {
          speHighlightArr = speHighlight.split(',');
        }
        if (flag && enableLinesHighlighted && autoHighlight && loop && animationTypes === 2 && i === 0 && this.list.length > rows) {
          bg = `background-color:${highlightBgColor} !important;`;
          highLightStyles = `color: ${highlightColor} !important;fontSize:${highlightFontSize}px;fontWeight:${highlightFontWeight};fontFamily:${highlightFontFamily};`;
        } else if (speHighlightArr.length && !autoHighlight && speHighlightArr.includes(`${snoZ}`)) {
          bg = `background-color:${highlightBgColor} !important;`;
          highLightStyles = `color: ${highlightColor} !important;fontSize:${highlightFontSize}px;fontWeight:${highlightFontWeight};fontFamily:${highlightFontFamily};`;
        } else {
          bg = `background-color:${retust === 1 ? oddBgColor : evenBgColor} !important;`;
        }
        let styles = `${bg}height:${height}px;${highLightStyles};`;
        if (flag ) {
          styles += `transform: translateY(-${this.transactionY}px);`;
        } else if (!flag && rowToppingBg && enableRowTopping) {
          styles += `position: relative;zIndex: 1;background-color:${rowToppingBg}`;
        } else if (enableRowTopping && !flag && !rowToppingBg) {
          styles += 'position: relative;zIndex: 1;';
        }
        return this.transactionY ? `${styles}transition: transform 500ms ease-in 0.5s;` : `${styles}`;
      }
    },
    getSnoStyles() {
      return function (i) {
        const {stylesObj: {snoFontFamily, snoFontWeight, snoFontSize, snoColor}} = this.config;
        const {
          stylesObj: {
            rows = 10,
            autoHighlight,
            highlightFontFamily,
            highlightFontWeight,
            highlightFontSize,
            highlightColor,
            loop,
            animationTypes
          },
          enableLinesHighlighted
        } = this.config;
        if (enableLinesHighlighted && autoHighlight && loop && animationTypes === 2 && i === 0 && this.list.length > rows) {
          return `fontFamily:${highlightFontFamily};fontWeight:${highlightFontWeight};fontSize:${highlightFontSize}px;color:${highlightColor};`;
        }
        return `fontFamily:${snoFontFamily};fontWeight:${snoFontWeight};fontSize:${snoFontSize}px;color:${snoColor};`;
      }
    },
    getPrefixStyles() { // 获取前缀图片样式
      return function (item) {
        const {fieldPrefixWidth, fieldPrefixHeight} = item;
        // const {fieldPrefix, fieldPrefixWidth, fieldPrefixHeight} = item;
        // const color = this.getColor(item, data);
        return {
          width: `${fieldPrefixWidth}px`,
          height: `${fieldPrefixHeight}px`
        };
      }
    },
    getPrefixUrl() {
      return function (column, data) {
        const {fieldPrefix} = column;
        const url = this.getColor(column, data, 'fieldRelImagesUrl');
        return url || fieldPrefix;
      }
    },
    getColumnContentStyles() {
      return function (column, data) {
        const {
          bulletUrl, interactionMode, url,
          fieldBgColor,
          fieldFontFamily,
          fieldFontWeight,
          fieldFontSize
        } = column;
        const color = this.getColor(column, data, 'fieldRelBgColor');
        const relColor = color || fieldBgColor;
        const styleObj = {
          fontFamily: fieldFontFamily,
          fontWeight: fieldFontWeight,
          fontSize: `${fieldFontSize}px`
        }
        let obj = relColor ? {
          ...styleObj,
          background: relColor,
          padding: '3px 8px',
          borderRadius: '5px'
        } : styleObj;
        if (interactionMode === 2 && !!bulletUrl || interactionMode === 3 && !!url) {
          return {cursor: 'pointer', ...obj};
        }
        return obj;
      }
    }
  },

  mounted() {
    this.init()
    window.addEventListener('resize', () => {
      if (this.$refs.listScroll) {
        const {height} = this.$refs.listScroll.getBoundingClientRect();
        this.height = height;
      }
    })
  },
  watch: {
    'config.stylesObj.rows': {
      deep: true,
      handler(v) {
        if (v) {
          this.list = cloneDeep(this.originList);
        }
      }
    },
    'config.dataType': {
      handler(val, old) {
        if (val !== old && this.type) {
          this.init();
        }
      }
    },
    'config.stylesObj.loop': {
      deep: true,
      handler(v) {
        if (!v) {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.list = cloneDeep(this.originList);
        }
      }
    },
    config: {
      deep: true,
      handler(v) {
        if (v && this.$refs.listScroll) {
          const {height} = this.$refs.listScroll.getBoundingClientRect();
          this.height = height;
          this.init();
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: false,
      handler(v, o) {
        const params = this.getParameters();
        const {isShow} = this.config;
        if (JSON.stringify(v) !== '{}' && o && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          clearTimeout(this.otherTimer);
          this.init();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          clearTimeout(this.otherTimer);
          this.init();
        }
      }
    }
  },
  methods: {
    handleImagePreview(column, item) { // 图片预览
      if (this.type === 'design') {
        return;
      }
      const url = this.getImageUrl(column, item);
      Bus.$emit('previewOpera', {
        visible: true,
        imageFileName: '',
        imageFileUrl: url
      });
    },
    handlePreview(column, item) {
      if (this.type === 'design') {
        return;
      }
      const obj = this.getFilesType(column, item);
      const {url = '', type} = obj;
      if (type === 'pdf') {
        window.open(url);
        return;
      }
      const name = this.renderValue(column, item);
      const rName = `${name}.${type}`;
      Bus.$emit('previewOpera', {
        visible: true,
        imageFileName: rName,
        imageFileUrl: url
      });
    },
    handleDown(column, item) { // 下载
      if (this.type === 'design') {
        return;
      }
      const obj = this.getFilesType(column, item);
      const {url = '', type} = obj;
      const name = this.renderValue(column, item);
      const rName = `${name}.${type}`;
      getBlob({url}, (res) => {
        saveAs(res, rName);
      })
    },
    doHref(config, obj) { // 跳转菜单
      if (this.type === 'design') {
        return;
      }
      const {bulletHeight, bulletWidth, bulletUrl, callbackFields, interactionMode, url, enableOpenNewWindow} = config;
      if (interactionMode === 1) {
        return;
      }
      let urlSplit = [];
      if (callbackFields) { //  回调参数
        const fields = callbackFields.split(',');
        fields.forEach((item) => {
          const value = obj[item];
          if (value) {
            urlSplit.push(`${item}=${value}`);
          }
        })
      }
      const reduceUrl = (bulletUrl, urlSplit) => {
        let newBulletUrl = bulletUrl;
        if (bulletUrl.indexOf('?') === -1) {
          newBulletUrl += `?${urlSplit.join('&')}`;
        } else {
          newBulletUrl += `&${urlSplit.join('&')}`;
        }
        return newBulletUrl;
      }
      if (interactionMode === 2 && bulletUrl) { // 弹框
        const newBulletUrl = reduceUrl(bulletUrl, urlSplit);
        Bus.$emit('modalOpera', {
          visible: true,
          singleConfig: {
            url: newBulletUrl,
            bulletWidth,
            bulletHeight
          },
          otherParams: {}
        });
      }
      if (interactionMode === 3 && url) { // url
        const newUrl = reduceUrl(url, urlSplit);
        if (!enableOpenNewWindow) { // 刷新当前页
          window.location.href = newUrl;
        }
        if (enableOpenNewWindow) { // 打开新页面
          window.open(newUrl, '_blank');
        }
      }
    },
    getParameters() {
      const {id, componentId} = this.config;
      const reduce = (obj) => { // 将Object 处理成 Array
        return Object.keys(obj).map((item) => {
          return {
            name: item,
            value: obj[item]
          }
        })
      }
      const query = this.$route.query
      let satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        })
      }
      const currentParams = {
        ...satisfyParams,
        ...query
      }
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },
    makeTopListData(arr) {
      const {
        lineTopConditionConfig = {}
      } = this.config;
      let loopList = []; // 需要滚动的数据
      let topDataList = []; // 需要置顶的数据
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        const data = arr[i];
        const flag = checkDetials(lineTopConditionConfig, data);
        flag ? topDataList.push(data) : loopList.push(data);
      }
      return {
        loopList,
        topDataList
      }
    },
    async init() {
      const {
        dataType,
        enableRowTopping = false,
        lineTopConditionConfig = {},
        dataConfig: {
          staticValue = '[]'
        },
        apiDataConfig,
        mqttDataConfig,
        SqlDataConfig
      } = this.config;
      if (this.type === 'design' && dataType !== 1) {
        let list, arr;
        if (dataType === 2) {
          const {apiFilterResponse = '[]'} = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        if (dataType === 3) {
          const {SQLFilterResponse = '[]'} = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        if (dataType === 4) {
          const { mqttFilterResponse} = mqttDataConfig
          list = JSON.parse(mqttFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }

        arr = setSnoZ(list);
        if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
          const {loopList, topDataList} = this.makeTopListData(arr);
          this.list = cloneDeep(loopList);
          this.originList = cloneDeep(loopList);
          this.topListData = topDataList;
        } else {
          this.list = cloneDeep(arr);
          this.originList = cloneDeep(arr);
        }
      } else if (dataType === 1) {
        let list = JSON.parse(staticValue);
        let arr = setSnoZ(list);

        if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
          const {loopList, topDataList} = this.makeTopListData(arr);
          this.list = cloneDeep(loopList);
          this.originList = cloneDeep(loopList);
          this.topListData = topDataList;

        } else {
          this.list = cloneDeep(arr);
          this.originList = cloneDeep(arr);
        }
      } else {
        if (dataType === 2) {
          this.loading = true;
          await this.getApi();
          this.loading = false;
        }
        if (dataType === 3) {
          this.loading = true;
          await this.getSQL();
          this.loading = false;
        }
        if (dataType === 4) {
          this.loading = true;
          console.log(1111)
          await this.initMqtt()
          this.loading = false;
        }
      }
      this.$nextTick(() => {
        if (this.$refs.listScroll) {
          const {height} = this.$refs.listScroll.getBoundingClientRect();
          this.height = height;
          this.move();
        }
      })
    },
    async initMqtt() {
      const {
        mqttDataConfig: {
          mqttSourceId,
          sourceU,
          sourceP,
          sourceA,
          sourceD,
          topic
        }
      } = this.config;
      if (!(mqttSourceId && sourceU && sourceP && topic)) return;
      const options = {
        username: decrypt(sourceA), // 可选，MQTT代理的用户名
        password: decrypt(sourceD) // 可选，MQTT代理的密码
      };
      const url = decrypt(sourceU);
      const port = decrypt(sourceP);
      this.client = mqtt.connect(`${url}:${port}/mqtt`, options);
      this.client.on('connect', () => {
        this.client.subscribe(`${topic}/response`, (err) => {
          if (!err) {
            console.log('订阅成功!');
            this.publishMessage();
          }
        });
      });
      this.client.on('message', (u, message) => {
        console.log(u);
        this.reduceMqtt(JSON.parse(message));
      });
    },
    reduceMqtt(res) {
      const {
        enableRowTopping = false,
        lineTopConditionConfig = {},
        mqttDataConfig: {
          enableMqttFilter,
          mqttDataFilterId,
          mqttFilterFun // 过滤器函数
        }
      } = this.config;
      if (!enableMqttFilter) {
        if (Array.isArray(res) && res.length) {
          const arr = setSnoZ(res);
          if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
            const {loopList, topDataList} = this.makeTopListData(arr);
            this.list = cloneDeep(loopList);
            this.originList = cloneDeep(loopList);
            this.topListData = topDataList;
          } else {
            this.list = cloneDeep(arr);
            this.originList = cloneDeep(arr);
          }
          // this.list = JSON.parse(JSON.stringify(arr));
          // this.originList = JSON.parse(JSON.stringify(arr));
          return;
        }
        this.list = res;
        this.originList = res;
        return
      }
      if (enableMqttFilter && mqttFilterFun && mqttDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(res);
        const arr = setSnoZ(result);
        // eslint-disable-next-line no-new-func
        if (Array.isArray(result) && result.length) {
          if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
            const {loopList, topDataList} = this.makeTopListData(arr);
            this.list = cloneDeep(loopList);
            this.originList = cloneDeep(loopList);
            this.topListData = topDataList;

          } else {
            this.list = cloneDeep(arr);
            this.originList = cloneDeep(arr);
          }
          return;
        }
        if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
          const {loopList, topDataList} = this.makeTopListData(arr);
          this.list = cloneDeep(loopList);
          this.originList = cloneDeep(loopList);
          this.topListData = topDataList;

        } else {
          this.list = cloneDeep(arr);
          this.originList = cloneDeep(arr);
        }
        return;
      }
      const arr = setSnoZ(res);
      if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
        const {loopList, topDataList} = this.makeTopListData(arr);
        this.list = cloneDeep(loopList);
        this.originList = cloneDeep(loopList);
        this.topListData = topDataList;

      } else {
        this.list = cloneDeep(arr);
        this.originList = cloneDeep(arr);
      }
    },
    publishMessage(message = '') {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.publish(`${topic}/publish`, message, {qos: 2});
    },
    async getApi() {
      const {apiDataConfig, enableRowTopping = false, lineTopConditionConfig = {}} = this.config;
      const params = this.getParameters();
      const res = await getInfoById(params) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          this.timerApi && clearTimeout(this.timerApi);
          this.timerApi = setTimeout(() => {
            this.getApi();
          }, time);
        }

        if (!enableApiFilter) {
          if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
            const {loopList, topDataList} = this.makeTopListData(targetObj);
            this.list = cloneDeep(loopList);
            this.originList = cloneDeep(loopList);
            this.topListData = topDataList;
          } else {
            this.list = cloneDeep(targetObj);
            this.originList = cloneDeep(targetObj);
          }
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          if (Array.isArray(result) && result.length) {
            const arr = setSnoZ(result);
            if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
              const {loopList, topDataList} = this.makeTopListData(arr);
              this.list = cloneDeep(loopList);
              this.originList = cloneDeep(loopList);
              this.topListData = topDataList;
            } else {
              this.list = cloneDeep(arr);
              this.originList = cloneDeep(arr);
            }

            return;
          }
          this.list = cloneDeep(result);
          this.originList = cloneDeep(result);
          return;
        }
        this.list = JSON.parse(targetObj);
        this.originList = cloneDeep(targetObj);
      }
    },
    async getSQL() {
      const {SqlDataConfig, enableRowTopping = false, lineTopConditionConfig = {}} = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;

      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        this.timerSql && clearTimeout(this.timerSql);
        this.timerSql = setTimeout(() => {
          this.getSQL();
        }, time);
      }

      if (!enableSQLFilter) {
        if (Array.isArray(res) && res.length) {
          const arr = setSnoZ(res);
          if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
            const {loopList, topDataList} = this.makeTopListData(arr);
            this.list = cloneDeep(loopList);
            this.originList = cloneDeep(loopList);
            this.topListData = topDataList;
          } else {
            this.list = cloneDeep(arr);
            this.originList = cloneDeep(arr);
          }
          // this.list = JSON.parse(JSON.stringify(arr));
          // this.originList = JSON.parse(JSON.stringify(arr));
          return;
        }
        this.list = res;
        this.originList = res;
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        const arr = setSnoZ(result);
        // eslint-disable-next-line no-new-func
        if (Array.isArray(result) && result.length) {
          if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
            const {loopList, topDataList} = this.makeTopListData(arr);
            this.list = cloneDeep(loopList);
            this.originList = cloneDeep(loopList);
            this.topListData = topDataList;

          } else {
            this.list = cloneDeep(arr);
            this.originList = cloneDeep(arr);
          }
          return;
        }
        if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
          const {loopList, topDataList} = this.makeTopListData(arr);
          this.list = cloneDeep(loopList);
          this.originList = cloneDeep(loopList);
          this.topListData = topDataList;

        } else {
          this.list = cloneDeep(arr);
          this.originList = cloneDeep(arr);
        }
        return;
      }
      const arr = setSnoZ(res);
      if (enableRowTopping && JSON.stringify(lineTopConditionConfig) !== '{}') {
        const {loopList, topDataList} = this.makeTopListData(arr);
        this.list = cloneDeep(loopList);
        this.originList = cloneDeep(loopList);
        this.topListData = topDataList;

      } else {
        this.list = cloneDeep(arr);
        this.originList = cloneDeep(arr);
      }
    },
    move() { // 数据开始移动
      const {stylesObj: {rows = 10, loop, loopTime, animationTypes}, enableRowTopping} = this.config;
      // , animationTypes
      if (!loop) {
        return;
      }
      const n = this.topListData.length;
      if (enableRowTopping && n >= rows) {
        clearTimeout(this.timer);
        return;
      }
      if (!enableRowTopping && this.list.length < rows) {
        clearTimeout(this.timer);
        return;
      } // 如果数据少于展示的行数，默认不移动
      this.transactionY = 0;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (animationTypes === 2) {
          const y = this.height / rows / this.scale;
          this.transactionY = y;
        }
        if (animationTypes === 3) {
          const y = this.height / this.scale;
          this.transactionY = y;
        }

        this.$nextTick(() => {
          if (this.list.length < rows) {
            clearTimeout(this.otherTimer);
            return;
          }
          this.otherTimer = setTimeout(() => {
            if (animationTypes === 2) {
              const obj = this.list[0];
              this.list.shift();
              this.list.push(obj);
              this.move();
            }
            if (animationTypes === 3) {

              if (enableRowTopping && n) {
                const rn = rows - n;
                this.loopArr = this.list.slice(0, rn);
                const restArr = this.list.slice(rn);
                this.list = [...restArr, ...this.loopArr];
              } else {
                this.loopArr = this.list.slice(0, rows);
                const restArr = this.list.slice(rows);
                this.list = [...restArr, ...this.loopArr];
              }

              this.move();
            }
          }, 1000);
        })
      }, loopTime * 1000)
    }
  },
  beforeDestroy() {
    window && window.removeEventListener('resize', () => {
    });
    this.timer = null;
    this.timerSql = null;
    this.timerApi = null;
    clearTimeout(this.otherTimer);
    if (this.client) {
      this.client.end();
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.GeneralTableWrap {
  height: 100%;
  width: 100%;

  .tableHeader {
    width: 100%;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    .serial {
      width: 50px;
    }

    .column-thead {
      display: inline-block;
      padding-left: 10px;
      box-sizing: border-box;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .seamless-warp {
    width: 100%;

    .column-list {
      display: flex;
      align-items: center;

      .serial {
        width: 50px;
        color: #FFFFFF;
        text-align: center;
      }

      .column-td {
        height: 100%;
        padding-left: 10px;
        box-sizing: border-box;
        //text-overflow: ellipsis;
        //white-space: nowrap;
        //overflow: hidden;

        .prefix {
          display: inline-block;
          margin-right: 5px;
          vertical-align: middle;
        }

        .column-images {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          background: unset;

          ::v-deep {
            .el-image__placeholder {
              background: unset;
            }
          }
        }

        .column-content {
          width: 100%;
          height: 100%;
          position: relative;

          .column-iconOpe {
            position: absolute;
            right: 0;
            cursor: pointer;
            height: 100%;
            display: flex;
            top: 0;
            align-items: center;

            & > span {
              display: none;
              margin-right: 10px;
              transition: display 2s;

              &:hover {
                opacity: 0.3;
              }
            }

            //& > span:last-child {
            //  margin-right: 10px;
            //}
          }
        }

        .column-content:hover .column-iconOpe > span {
          display: inline-block;
        }
      }
    }
  }

  .ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .unEllipsis {
    //display: table;
    line-height: 1.2;
    word-break: break-all;
  }

  .unExpress {
    display: inline-block;
    //display: table-cell;
    //vertical-align: middle;
  }
}
</style>
