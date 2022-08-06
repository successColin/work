<template>
  <section class="passwordConfig" v-loading="loading">
    <ul>
      <el-row>
        <el-col
          v-for="(item, i) in configArr"
          :key="`${item.name}_${i}`"
          :span="item.col"
        >
          <li v-show="!(i === 8 && loginStyle === 1)">
            <div class="leftName">
              <div v-if="!Array.isArray(item.name)">
                {{ item.name }}
              </div>
              <div v-else>
                <div v-for="(val, index) in item.name" :key="index">
                  {{ val }}
                </div>
              </div>
            </div>
            <!-- 滑块 -->
            <div v-if="i === 0" class="common">
              <div v-if="!statement.isClickErrorCount">
                {{
                  showValueName(
                    onlineTimeOptionsArr,
                    errorCount,
                    item.attributeKey
                  )
                }}
              </div>
              <apiot-select
                :style="selectWidth"
                v-else
                v-model="errorCount"
                :options="onlineTimeOptionsArr"
                @change="handleChangeSelectVal('onlineTime', $event)"
              ></apiot-select>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="
                  handleChangeCount('isClickErrorCount', item.attributeKey)
                "
              >
                {{ changeBtnName(statement.isClickErrorCount) }}
              </apiot-button>
            </div>
            <!-- 备案号 -->
            <div v-if="i === 1" class="common">
              <div v-if="!statement.isRecord">
                {{ record }}
              </div>
              <apiot-input
                :style="selectWidth"
                v-else
                v-model="record"
                @change="handleChangeSelectVal('onlineTime', $event)"
              ></apiot-input>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isRecord', item.attributeKey)"
              >
                {{ changeBtnName(statement.isRecord) }}
              </apiot-button>
            </div>
            <!-- 登录页风格 -->
            <div v-if="i === 3" class="common">
              <div v-if="!statement.isScanType">
                {{ showValueName(scanTypeArr, scanType) }}
              </div>
              <div v-else>
                <apiot-select
                  :style="selectWidth"
                  v-if="statement.isScanType"
                  v-model="scanType"
                  :options="scanTypeArr"
                ></apiot-select>
              </div>
              <div class="buttonBlock">
                <!-- 浙政钉配置 -->
                <apiot-button
                  v-if="scanType === 3"
                  type="text"
                  class="passwordConfig__operation"
                  @click="handleConfigZhe"
                >
                  配置
                </apiot-button>
                <div class="onLine" v-if="scanType === 3"></div>
                <apiot-button
                  type="text"
                  class="passwordConfig__operation"
                  @click="handleChangeCount('isScanType', item.attributeKey)"
                >
                  {{ changeBtnName(statement.isScanType) }}
                </apiot-button>
              </div>
            </div>
            <!-- 是否启用注册   是否支持APP扫码登录   是否启用忘记密码 -->
            <div v-if="[2, 4, 5].includes(i)" style="flex: none" class="common">
              <apiot-radio
                @change="(value) => changeRadio(value, item.key)"
                v-model="params[item.key]"
                label="1"
                >{{ $t('common.is') }}
              </apiot-radio>
              <apiot-radio
                @change="(value) => changeRadio(value, item.key)"
                v-model="params[item.key]"
                label="0"
                >{{ $t('common.no') }}
              </apiot-radio>
            </div>
            <!-- 单点登录 -->
            <div v-if="i === 6" class="common">
              <div v-if="!statement.isSsoTypePc">
                {{ showValueName(ssoTypePcArr, ssoTypePc, item.attributeKey) }}
              </div>
              <div v-else>
                <apiot-select
                  :style="selectWidth"
                  v-if="statement.isSsoTypePc"
                  v-model="ssoTypePc"
                  :options="ssoTypePcArr"
                ></apiot-select>
              </div>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isSsoTypePc', item.attributeKey)"
              >
                {{ changeBtnName(statement.isSsoTypePc) }}
              </apiot-button>
            </div>
            <!-- 登录页风格 -->
            <div v-if="i === 7" class="common">
              <div v-if="!statement.isLoginStyle">
                {{
                  showValueName(loginStyleArr, loginStyle, item.attributeKey)
                }}
              </div>
              <div v-else>
                <apiot-select
                  :style="`width: ${
                    statement.isLoginStyle && loginStyle === 1 ? '100%' : '50%'
                  }`"
                  v-if="statement.isLoginStyle"
                  v-model="loginStyle"
                  :options="loginStyleArr"
                  @change="handleChangeSelectVal('style', $event)"
                ></apiot-select>
                <apiot-select
                  class="m-l-10"
                  style="width: 38%"
                  v-if="statement.isLoginStyle && loginStyle === 2"
                  v-model="stylePercentage"
                  :options="stylePercentageArr"
                  @change="handleChangeSelectVal('stylePercentage', $event)"
                ></apiot-select>
              </div>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isLoginStyle', item.attributeKey)"
              >
                {{ changeBtnName(statement.isLoginStyle) }}
              </apiot-button>
            </div>
            <!-- 背景图 -->
            <div v-if="i === 8" class="passwordConfig__logo common">
              <div v-if="!statement.isBackgroundImage">
                <el-image
                  fit="cover"
                  v-if="backgroundImg"
                  style="width: 48px; height: 48px; border-radius: 4px"
                  :src="backgroundImg"
                  class="userImage m-r-4"
                >
                </el-image>
              </div>
              <image-and-change
                v-if="statement.isBackgroundImage"
                :ref="item.attributeKey"
                :imgObj="backgroundImageObj"
                :showSlider="false"
                :maxKb="1024"
              />
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="
                  handleChangeCount('isBackgroundImage', item.attributeKey)
                "
              >
                {{ changeBtnName(statement.isBackgroundImage) }}
              </apiot-button>
            </div>
            <!-- 登录页主题色 -->
            <div v-if="i === 9" class="common">
              <div class="colorWrap">
                <div
                  class="colorBox"
                  :style="'background:' + item.color"
                  @click="changeRadio(item.value, 'themeColor')"
                  v-for="item in themeStyleArr"
                  :key="item.color"
                >
                  <i
                    class="el-icon-check"
                    :class="{
                      selected: themeColor === item.value,
                    }"
                    v-if="themeColor === item.value"
                  ></i>
                </div>
              </div>
            </div>
            <!-- 登录页LOGO -->
            <div v-if="i === 10" class="passwordConfig__logo common">
              <div v-if="!statement.isRegistration">
                <el-image
                  fit="cover"
                  v-if="loginImg"
                  style="width: 48px; height: 48px; border-radius: 4px"
                  :src="loginImg"
                  class="userImage m-r-4"
                >
                </el-image>
              </div>
              <image-and-change
                v-if="statement.isRegistration"
                ref="loginLogo"
                :imgObj="loginObj"
                :imgWidth="loginWidth"
                @change-image-width="changeWidth"
                :max="40"
              />
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isRegistration')"
              >
                {{ changeBtnName(statement.isRegistration) }}
              </apiot-button>
            </div>

            <!-- 登录页轮播图 -->
            <div v-if="i === 11" class="passwordConfig__logo common">
              <div v-if="!statement.isLoopPics">
                <el-image
                  v-for="(item, i) in loopMaps"
                  class="userImage m-r-4"
                  style="width: 48px; height: 48px; border-radius: 4px"
                  :src="item.url"
                  :key="item.url + '__' + i"
                  fit="cover"
                ></el-image>
              </div>
              <el-upload
                v-else
                class="uploadWrap"
                :class="{ uploadHide: loopMaps.length === 3 }"
                :file-list="loopMaps"
                list-type="picture-card"
                action="/"
                :on-success="handleChange"
                :multiple="false"
                :before-upload="beforeUpload"
                :accept="accept"
                :http-request="doUpload"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isLoopPics')"
              >
                {{ changeBtnName(statement.isLoopPics) }}
              </apiot-button>
            </div>
          </li>
        </el-col>
      </el-row>
    </ul>
    <zhezhengding-config
      :zzdConfig="zzdConfig"
      ref="historyPassword"
      :visible.sync="dialogVisible"
      :zzdConfigObj="zzdConfigObj"
      title="配置浙政钉"
    ></zhezhengding-config>
  </section>
</template>

<script>
import { commonUpdate, getListByKey, updateImages } from '@/api/globalConfig';
import { loginStyleArr, selectColorArr, stylePercentageArr } from '@/config';
import ImageAndChange from '../components/ImageAndChange';
import ZhezhengdingConfig from '../components/ZhezhengdingConfig';

export default {
  props: {
    selectWidth: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      accept: '.png,.svg,.jpg, .jpeg',
      response: [],
      params: {},
      stompClient: '',
      timer: '',
      statement: {
        // 状态集合
        isRecord: false, // 备案号
        isRegistration: false, // 登录页
        isLoopPics: false, // l轮播图
        isClickErrorCount: false, // 错误次数点击
        isLoginStyle: false, // 登陆风格
        isBackgroundImage: false, // 背景图
        isScanType: false, // app类型
        isSsoTypePc: false // 单点登录方式
      },
      loginObj: {}, // login url
      loginWidth: 20, // logo宽度
      record: '备案号', // 备案号
      errorCount: 1, // 错误次数
      onlineTimeOptionsArr: [
        {
          name: '一直显示',
          value: 1
        },
        {
          name: '一直不显示',
          value: 2
        },
        {
          name: '错误三次才显示',
          value: 3
        }
      ],
      loginStyle: 1, // 登录风格
      ssoTypePc: 1, // 单点登录
      loginStyleArr,
      stylePercentage: 2, // 卡片式轮播风格 的比例
      stylePercentageArr,
      backgroundImageObj: {}, // 背景图url
      themeColor: 1,
      themeStyleArr: [],
      loopMaps: [],
      scanType: 1,
      scanTypeArr: [], // 扫码类型
      ssoTypePcArr: [], // 单点登录类型
      zzdConfig: {},
      zzdConfigObj: {}
    };
  },
  components: { ImageAndChange, ZhezhengdingConfig },
  created() {
    // this.setSocket(`${this.expertSysid}/${this.consultationSysid}`);
  },
  mounted() {
    this.initColor();
    this.init();
    // this.initWebSocket();
  },
  computed: {
    // // 扫码类型
    // scanTypeArr() {
    //   return this.$store.getters.getCurDict('SCAN_TYPE');
    // },
    // // 单点登录类型
    // ssoTypePcArr() {
    //   return this.$store.getters.getCurDict('SSO_TYPE_PC');
    // },
    loginImg() {
      // eslint-disable-next-line max-len
      return (
        this.loginObj.attributeValue &&
        this.loginObj.attributeValue.substr(0, this.loginObj.attributeValue.length - 1)
      );
    },
    backgroundImg() {
      // eslint-disable-next-line max-len
      return (
        this.backgroundImageObj.attributeValue &&
        this.backgroundImageObj.attributeValue.substr(
          0,
          this.backgroundImageObj.attributeValue.length - 1
        )
      );
    },
    // 左侧配置
    configArr() {
      return [
        {
          name: [this.$t('globalConfig.passwordError'), this.$t('globalConfig.passwordErrorShow')],
          col: 12,
          attributeKey: 'sliderErrorsCount'
        },
        {
          name: this.$t('globalConfig.recordName'),
          col: 12,
          attributeKey: 'record'
        },
        {
          name: this.$t('globalConfig.enableRegistration'),
          col: 12,
          key: 'enableRegistration',
          attributeKey: 'enableRegistration'
        },
        {
          name: 'App 扫码类型',
          col: 12,
          key: 'scanType',
          attributeKey: 'scanType'
        },
        {
          name: this.$t('globalConfig.forgetPassword'),
          col: 12,
          key: 'enableForgetPassword',
          attributeKey: 'enableForgetPassword'
        },
        {
          name: this.$t('globalConfig.enableMultilingual'),
          col: 12,
          key: 'enableMultilingual',
          attributeKey: 'enableMultilingual'
        },
        {
          name: '单点登录方式',
          col: 12,
          key: 'ssoTypePc',
          attributeKey: 'ssoTypePc'
        },
        // 登录页风格
        {
          name: this.$t('globalConfig.style'),
          col: 12,
          key: 'style',
          attributeKey: 'style'
        },
        {
          name: this.$t('globalConfig.styleBackgroundImage'),
          col: 24,
          key: 'backgroundImage',
          attributeKey: 'backgroundImage'
        },
        {
          name: this.$t('globalConfig.themeColor'),
          col: 24,
          key: 'themeColor',
          attributeKey: 'themeColor'
        },
        {
          name: this.$t('globalConfig.loginpagelogo'),
          col: 24,
          attributeKey: 'loginLogoWidth'
        },
        {
          name: this.$t('globalConfig.loginCarousel'),
          col: 24,
          attributeKey: 'loginLoopMaps'
        }
      ];
    },
    // 修改 button 状态
    changeBtnName() {
      return function (state) {
        return state ? this.$t('common.save') : this.$t('common.modify');
      };
    },
    // 登录在线时长/登录账号的密码有效期名称
    showValueName() {
      return function (options, val) {
        const obj = options && options.find((item) => item.value === Number(val));
        return obj && obj.name;
      };
    }
  },
  methods: {
    handleConfigZhe() {
      this.dialogVisible = true;
    },
    // 初始化主题色
    initColor() {
      selectColorArr.forEach((color, index) => {
        this.themeStyleArr.push({
          color,
          value: index + 1
        });
      });
    },
    handleRemove({ url }) {
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.image') }),
        this.$t('common.delete', { name: this.$t('helpCenter.image') }),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(() => {
        const index = this.loopMaps.findIndex((item) => item.url === url);
        if (index === -1) return;
        this.loopMaps.splice(index, 1);
      });
    },
    handleChange(response, file) {
      this.loopMaps.push(file);
    },
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        const newSize = size / 1024 < 1024;
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        if (!newSize) {
          this.$message({
            type: 'warning',
            message: this.$t('icon.beforeUploadingConfig')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    changeWidth(value) {
      // 改变logo宽度
      this.loginWidth = value;
    },
    async init() {
      this.loading = true;
      await this.$store.dispatch('getCurrentDict', 'SCAN_TYPE,SSO_TYPE_PC');
      this.scanTypeArr = this.$store.getters.getCurDict('SCAN_TYPE'); // 扫码类型
      this.ssoTypePcArr = this.$store.getters.getCurDict('SSO_TYPE_PC'); // 单点登录类型
      const res = await getListByKey({ parameterKey: 'LOGIN' });
      this.loading = false;
      this.response = res;
      const errorObj =
        this.response.find((item) => item.attributeKey === 'sliderErrorsCount') || {};
      const recordObj = this.response.find((item) => item.attributeKey === 'record') || {};
      const enableRegistrationObj =
        this.response.find((item) => item.attributeKey === 'enableRegistration') || {};
      const scanType = this.response.find((item) => item.attributeKey === 'scanType') || {};
      const enableForgetPasswordObj =
        this.response.find((item) => item.attributeKey === 'enableForgetPassword') || {};
      const enableMultilingual =
        this.response.find((item) => item.attributeKey === 'enableMultilingual') || {};
      const styleObj = this.response.find((item) => item.attributeKey === 'style') || {};
      const ssoTypePcObj = this.response.find((item) => item.attributeKey === 'ssoTypePc') || {};
      const themeColorObj = this.response.find((item) => item.attributeKey === 'themeColor') || {};
      const stylePercentage =
        this.response.find((item) => item.attributeKey === 'stylePercentage') || {};
      const logoObj = this.response.find((item) => item.attributeKey === 'loginLogo') || {};
      const backgroundObj =
        this.response.find((item) => item.attributeKey === 'backgroundImage') || {};
      const logoObjWidth =
        this.response.find((item) => item.attributeKey === 'loginLogoWidth') || {};
      const zzdConfig = this.response.find((item) => item.attributeKey === 'zzdConfig') || {};
      const loopObj = this.response.find((item) => item.attributeKey === 'loginLoopMaps') || {};
      const loopMapsArr = loopObj.attributeValue ? loopObj.attributeValue.split(',') : [];
      this.loopMaps = [];
      // eslint-disable-next-line array-callback-return
      loopMapsArr.forEach((item) => {
        if (item) {
          this.loopMaps.push({ url: item });
        }
      });
      this.params = {
        ...this.params,
        enableRegistration: enableRegistrationObj.attributeValue,
        enableForgetPassword: enableForgetPasswordObj.attributeValue,
        enableMultilingual: enableMultilingual.attributeValue
      };
      this.errorCount = Number(errorObj.attributeValue);
      this.loginStyle = Number(styleObj.attributeValue);
      this.ssoTypePc = Number(ssoTypePcObj.attributeValue);
      this.scanType = Number(scanType.attributeValue);
      this.stylePercentage = Number(stylePercentage.attributeValue);
      this.themeColor = Number(themeColorObj.attributeValue);
      this.record = recordObj.attributeValue;
      this.loginObj = logoObj;
      this.backgroundImageObj = backgroundObj;
      this.loginWidth = Number(logoObjWidth.attributeValue);
      this.zzdConfig = (zzdConfig.attributeValue && JSON.parse(zzdConfig.attributeValue)) || {};
      this.zzdConfigObj = zzdConfig || {};
    },
    async changeRadio(value, key) {
      this.loading = true;
      const currentObj = this.response.find((item) => item.attributeKey === key);
      const params = {
        ...currentObj,
        attributeValue: this.params[key]
      };
      if (key === 'themeColor') {
        this.themeColor = value;
        params.attributeValue = value;
      }
      try {
        await commonUpdate({ list: [params] });
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async logoSave(key = 'loginLogo') {
      // 登录logo保存
      const formData = new FormData();
      console.log(this.$refs[key]);
      const { fileList } = this.$refs[key][0];
      const imageObj = this.response.find((item) => item.attributeKey === key);
      const newImageObj = JSON.parse(JSON.stringify(imageObj));
      delete newImageObj.attributeValue;
      Object.keys(newImageObj).forEach((item) => {
        formData.append(item, newImageObj[item]);
      });
      const update = async (paramsForm) => {
        try {
          await updateImages(paramsForm);
          this.loopMaps = [];
        } catch (e) {
          // console.log(e);
        }
      };
      if (fileList.length && Object.keys(fileList[0]).length > 3) {
        formData.append('files', fileList[0].raw);
        await update(formData);
      } else if (!fileList.length) {
        formData.append('files', '');
        await update(formData);
      }
    },
    async saveLoopMap() {
      const currentObj = this.response.find((item) => item.attributeKey === 'loginLoopMaps');
      const formData = new FormData();
      delete currentObj.attributeValue;
      Object.keys(currentObj).forEach((item) => {
        formData.append(item, currentObj[item]);
      });
      const update = async (paramsForm) => {
        try {
          this.loopMaps = [];
          await updateImages(paramsForm);
          await this.init();
        } catch (e) {
          // console.log(e);
        }
      };
      if (!this.loopMaps.length) {
        formData.append('files', '');
        await update(formData);
      } else if (this.loopMaps.length) {
        // eslint-disable-next-line no-unused-vars
        let attributeValue = '';
        this.loopMaps.forEach((item) => {
          if (Object.keys(item).length && Object.keys(item).length > 3) {
            formData.append('files', item.raw);
          } else {
            attributeValue += `${item.url},`;
          }
        });
        formData.append('attributeValue', attributeValue);
        await update(formData);
      }
    },
    async handleChangeCount(key, attr) {
      // 滑块显示设置
      if (this.statement[key]) {
        this.loading = true;
        const currentObj = this.response.find((item) => item.attributeKey === attr);
        let params = {};
        if (key === 'isLoopPics') {
          await this.saveLoopMap(key, attr);
          this.statement[key] = !this.statement[key];
          return;
        }
        if (key === 'isClickErrorCount') {
          // eslint-disable-next-line no-const-assign
          params = {
            ...currentObj,
            attributeValue: this.errorCount
          };
        }
        if (key === 'isRecord') {
          params = {
            ...currentObj,
            attributeValue: this.record
          };
        }
        if (key === 'isBackgroundImage') {
          // 登录logo保存
          await this.logoSave(attr);
        }
        if (key === 'isLoginStyle') {
          // 登录logo保存
          params = [
            {
              ...currentObj,
              attributeValue: this.loginStyle
            },
            {
              ...this.response.find((item) => item.attributeKey === 'stylePercentage'),
              attributeValue: this.stylePercentage
            }
          ];
        }
        if (key === 'isSsoTypePc') {
          // 单点登录方式
          params = [
            {
              ...currentObj,
              attributeValue: this.ssoTypePc
            }
          ];
        }
        if (key === 'isScanType') {
          params = [
            {
              ...currentObj,
              attributeValue: this.scanType
            }
          ];
        }
        if (key === 'isRegistration') {
          // 登录logo保存
          await this.logoSave();
          const { imgWidth } = this.$refs.loginLogo[0];
          const widthObj = this.response.find((item) => item.attributeKey === 'loginLogoWidth');
          params = {
            ...widthObj,
            attributeValue: imgWidth
          };
        }
        try {
          if (Array.isArray(params)) {
            await commonUpdate({ list: [...params] });
          } else {
            await commonUpdate({ list: [params] });
          }
          await this.init();
          this.loading = false;
          this.$message({
            type: 'success',
            message: this.$t('common.successfullyModified')
          });
        } catch (e) {
          this.loading = false;
        }
      }
      this.statement[key] = !this.statement[key];
    },
    // 下拉框__获取对象方法
    getSelectFun(option, val) {
      const obj = option.find((item) => item.value === val);
      return obj;
    },
    // 下拉框__改变值
    handleChangeSelectVal(name, val) {
      if (name === 'onlineTime') {
        this.onlineTimeVal = val;
      } else if (name === 'periodValidity') {
        this.periodValidityValue = val;
      } else if (name === 'style') {
        this.loginStyle = val;
      } else if (name === 'stylePercentage') {
        this.stylePercentage = val;
      }
    }
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    if (this.disconnect) {
      this.disconnect();
    }

    clearInterval(this.timer);
  }
};
</script>
<style lang='scss' scoped>
$borderColor: 1px solid #e9e9e9;
.passwordConfig {
  width: 100%;
  height: 100%;

  ul {
    margin: 10px 10px 0 10px;
    background: #ffffff;
    border: $borderColor;
    border-bottom: 0;
    height: 100%;
    overflow-y: auto;
    li {
      display: flex;
      height: 72px;
      border-bottom: $borderColor;

      & > div:first-child {
        width: 200px;
        min-width: 200px;
        background: #fafafa;
        display: flex;
        justify-content: center;
        text-align: right;
        font-size: 13px;
        color: #666666;
        flex-direction: column;
        border-right: $borderColor;
        box-sizing: border-box;
        padding-right: 20px;

        & > div:first-child > div:first-child {
          margin-bottom: 6px;
        }
      }

      & > .common {
        flex: 1;
        margin-left: 27px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
        .colorWrap {
          display: flex;
          & .colorBox {
            flex-grow: 1;
            width: 20px;
            height: 20px;
            margin: 8px 2.7px;
            cursor: pointer;
            border-radius: 4px;
            text-align: center;
            line-height: 20px;

            & .el-icon-check {
              color: #fff;
              opacity: 1;
              transition: opacity 1s;
            }
          }
        }
      }
    }
  }

  &__radio--font {
    font-size: 13px;
    color: #666666;
  }

  &__logo {
    & > div {
      height: 48px;
      overflow: hidden;

      & .el-upload-list__item div {
        height: 48px;
      }
    }
  }

  &__logo img {
    width: 48px;
    border-radius: 4px;
  }
  .uploadHide {
    ::v-deep {
      .el-upload--picture-card {
        display: none;
      }
    }
  }
  .uploadWrap {
    ::v-deep {
      .el-upload--picture-card i {
        font-size: 16px !important;
        color: #bbc3cd;
      }

      .el-upload-list--picture-card
        .el-upload-list__item-actions
        .el-upload-list__item-delete {
        position: absolute;
        font-size: inherit;
        color: inherit;
        font-size: 13px;
        right: 5px;
      }
    }
  }
}

::v-deep {
  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #4689f5;
    background-color: #4689f5;
    opacity: 0.5;
  }

  .el-col-12:nth-child(odd) {
    box-sizing: border-box;
    border-right: 1px solid #e9e9e9;
  }

  .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    background-color: white;
  }

  .el-upload--picture-card {
    width: 48px;
    height: 48px;
    line-height: 48px;

    .el-upload--picture-card i {
      font-size: 16px !important;
      color: #bbc3cd;
    }
  }

  .el-upload-list--picture-card .el-upload-list__item {
    width: 48px;
    height: 48px;
  }
}
.buttonBlock {
  display: flex;
  align-items: center;
}
.onLine {
  height: 12px;
  border-right: 1px solid $--color-primary;
  margin: 0 8px;
  cursor: auto;
}
</style>
