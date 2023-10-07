/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/

<!-- 页面 -->
<template>
  <div
      v-loading="loading"
      class="singleTextWrap"
      :style="getContentStyles()"
      @click="handleClick"
  >
    <div
        class="singleTextContent"
        :title="renderContent"
        :style="singleTextContentStyles"
    >
      <span v-if="prefixContent" :style="prefixStyles">{{prefixContent}}</span>
      <span :style="contentStyles">
          <component
              :is="activeCom"
              :value="renderContent"
              :config="sConfig"
              :endVal="getEndValue"
              :separator="separator"
          />
        </span>
      <span v-if="suffixContent" :style="suffixStyles">{{suffixContent}}</span>
    </div>
  </div>
</template>

<script>
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import Bus from '@/utils/bus';
import {getInfoById} from '@/services/design';
import {IsURL} from '@/utils/utils';
import { decrypt } from '@/utils/secret';
import {isEqual} from 'lodash';

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
    }
  },
  data() {
    return {
      client: null,
      content: '',
      timer: null,
      loading: false
    };
  },

  components: {},

  computed: {
    activeCom() { // 风格类型
      const obj = {
        1: 'CScrollNumber',
        2: 'CCountTo'
      }
      const { styleType = 1 } = this.config;
      return obj[styleType];
    },
    prefixStyles() {
      const { stylesObj: { prefixFontFamily, prefixFontSize, prefixColor, prefixFontWeight } } = this.config;
      return {
        fontFamily: prefixFontFamily,
        fontSize: `${prefixFontSize}px`,
        color: prefixColor,
        fontWeight: prefixFontWeight
      }
    },
    suffixStyles() {
      const { stylesObj: { suffixFontFamily, suffixFontSize, suffixColor, suffixFontWeight } } = this.config;
      return {
        fontFamily: suffixFontFamily,
        fontSize: `${suffixFontSize}px`,
        color: suffixColor,
        fontWeight: suffixFontWeight
      }
    },
    prefixContent() {
      return this.config.stylesObj.prefixContent;
    },
    suffixContent() {
      return this.config.stylesObj.suffixContent;
    },
    singleTextContentStyles() {
      const { stylesObj: { textAlign } } = this.config;
      return {
        justifyContent: textAlign
      };
    },
    contentStyles() {
      const { stylesObj: { FontFamily, FontSize, Color, FontWeight } } = this.config;
      return {
        fontFamily: FontFamily,
        fontSize: `${FontSize}px`,
        color: Color,
        fontWeight: FontWeight
      }
    },
    isNumberString() {
      return function (str) {
        return !isNaN(parseFloat(str)) && isFinite(str)
      };
    },
    sConfig() {
      const { stylesObj: {
        enableThousands,
        bgUrl, FontSize,distance, contentWidth, contentHeight
      }, enableBackgroundImage } = this.config;
      return {
        enableBackgroundImage,
        FontSize,
        distance,
        contentWidth,
        contentHeight,
        bgUrl,
        enableThousands
      }
    },
    addThousandsSeparator() { // 千分位
      return function (numStr) {
        return numStr.toLocaleString();
      }
    },
    separator() {
      const { stylesObj: { enableThousands = true} } = this.config;
      if (enableThousands) {
        return ',';
      }
      return '';
    },
    getValue() {
      return this.content || '0';
    },
    getEndValue() {
      const str = this.getValue;
      if (str && this.isNumberString(`${str}`)) {
        return +str;
      }
      return 0;
    },
    renderContent() {
      const { stylesObj: { enableThousands = true} } = this.config;
      const str = this.getValue;
      if (str && this.isNumberString(`${str}`)) {
        if (enableThousands) {
          return this.addThousandsSeparator(Number(str));
        } else {
          return `${str}`;
        }
      }
      return '0';
    },
    getContentStyles() {
      return function () {
        const {stylesObj = {}, width, height, top, left} = this.config;
        let styles = `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex}; `;
        return styles;
      };
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: false,
      handler(v, o) {
        const params = this.getParameters();
        const {isShow} = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.init();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.init();
        }
      }
    }
  },
  methods: {
    handleClick() {
      const {bulletType = 1, interactionMode, bulletUrl, bulletWidth, bulletHeight} = this.config;
      if (interactionMode === 1) {
        return;
      }
      if (interactionMode === 2 && bulletType === 1) {
        Bus.$emit('modalOpera', {
          visible: true,
          singleConfig: {
            url: bulletUrl,
            bulletWidth,
            bulletHeight
          },
          otherParams: {}
        });
      }
      if (interactionMode === 3) {
        this.hrefUrl();
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

    async init() {

      const {dataType, dataConfig} = this.config;
      const {takeEffect, staticValue} = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        this.content = obj[takeEffect];
      }
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
      if (dataType === 4 && !this.client) {
        await this.initMqtt()
        // if (this.client) {
        //   this.publishMessage()
        // } else {
        //   await this.initMqtt()
        // }
      }
    },
    async getApi() {
      const {apiDataConfig} = this.config;
      const params = this.getParameters();
      const res = await getInfoById(params) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiEffect,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.getApi();
          }, time);
        }
        if (!apiEffect && !enableApiFilter) {
          this.content = targetObj;
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.content = result[apiEffect];
          return;
        }
        this.content = JSON.parse(targetObj)[apiEffect];
      }
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
        this.reduceMqtt(JSON.parse(message));
      });
    },
    reduceMqtt(data) {
      const {
        mqttDataConfig: {
          enableMqttFilter,
          mqttFilterFun, // 过滤器函数
          mqttEffect
        }
      } = this.config;
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.content = result[mqttEffect];
      } else {
        this.content = data[mqttEffect];
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
    async getSQL() {
      const {SqlDataConfig} = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLEffect,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.getSQL();
        }, time);
      }
      if (!SQLEffect && !enableSQLFilter) {
        this.content = JSON.stringify(res);
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.content = result[SQLEffect];
        return;
      }
      this.content = JSON.stringify(res[SQLEffect]);
    },
    hrefUrl() {
      const {url, enableOpenNewWindow} = this.config;
      if (!url) {
        return;
      }
      if (!IsURL(url)) {
        return;
      }
      if (enableOpenNewWindow) {
        window.open(url, '_blank');
      } else {
        window.open(url, '_self');
      }
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
    if (this.client) {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.unsubscribe(`${topic}/response`);
      this.client.end();
    }
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
    display: flex;
    align-items: center;
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>
