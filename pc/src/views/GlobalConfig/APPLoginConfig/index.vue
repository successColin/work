/**
* @name: index
* @author: DELL
* @date: 2021/10/18 16:58
* @description：index
* @update: 2021/10/18 16:58
*/
<!-- 页面 -->
<template>
  <section class="passwordConfig" v-loading="loading">
    <ul>
      <el-row>
        <el-col
          v-for="(item, i) in configArr"
          :key="`${item.name}_${i}`"
          :span="item.col"
        >
          <li :name="item.key">
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

            <!-- 是否启用注册   是否支持APP扫码登录   是否启用忘记密码 -->
            <div
              v-if="[0, 1, 2, 3].includes(i)"
              style="flex: none"
              class="common"
            >
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

            <!-- 单点登录方式 -->
            <div v-if="i === 4" class="common">
              <div v-if="!statement.isSsoType">
                {{ showValueName(ssoTypeArr, ssoType, item.attributeKey) }}
              </div>
              <div v-else>
                <apiot-select
                  style="width: 200px"
                  v-if="statement.isSsoType"
                  v-model="ssoType"
                  :options="ssoTypeArr"
                  @change="handleChangeSelectVal('ssoType', $event)"
                ></apiot-select>
              </div>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isSsoType', item.attributeKey)"
              >
                {{ changeBtnName(statement.isSsoType) }}
              </apiot-button>
            </div>

            <!-- 登录页风格 -->
            <div v-if="i === 5" class="common">
              <div v-if="!statement.isLoginStyle">
                {{
                  showValueName(loginStyleArr, loginStyle, item.attributeKey)
                }}
              </div>
              <div v-else>
                <apiot-select
                  style="width: 200px"
                  v-if="statement.isLoginStyle"
                  v-model="loginStyle"
                  :options="loginStyleArr"
                  @change="handleChangeSelectVal('style', $event)"
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
            <!-- 登录页主题色 -->
            <div v-if="i === 6" class="common">
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
            <div v-if="[7].includes(i)" class="common">
              <div v-if="!statement.isUpload">
                <span v-if="params.agreementUrl">{{
                  $t('globalConfig.UploadProtocol')
                }}</span>
                <span style="color: #666666" v-if="!params.agreementUrl">{{
                  $t('globalConfig.uploadTheService')
                }}</span>
              </div>
              <div v-if="statement.isUpload" class="uploadAgreement">
                <el-upload
                  class="upload-demo"
                  action="/"
                  :limit="1"
                  ref="uploadDemo"
                  :multiple="false"
                  accept=".pdf"
                  :before-upload="beforeUploadPdf"
                  :http-request="doUploadPdf"
                  :on-success="handleChangePDF"
                >
                  <apiot-button type="default">
                    <i class="icon-shangchuan iconfont m-r-4"></i>
                    {{ $t('globalConfig.UploadProtocolBtn') }}
                  </apiot-button>
                </el-upload>
              </div>
              <span
                v-if="
                  statement.isUpload && (params.agreementUrl || fileList.length)
                "
                class="fileWrap"
                >{{ $t('globalConfig.UploadProtocol') }}</span
              >
              <div class="passwordConfig__operation">
                <a
                  :href="fileUrl(params.agreementUrl)"
                  type="text"
                  v-if="!statement.isUpload && params.agreementUrl"
                  target="_blank"
                >
                  {{ $t('globalConfig.preview') }}
                </a>
                <div></div>
                <apiot-button
                  type="text"
                  @click="handleChangeCount('isUpload', item.key, 'fileList')"
                >
                  {{ changeBtnName(statement.isUpload) }}
                </apiot-button>
              </div>
            </div>
            <!-- 登录页轮播图 -->
            <div
              v-if="i === 8"
              class="passwordConfig__logo common"
              style="line-height: 48px"
            >
              <div v-if="!statement.isLoopPics">
                <span style="color: #666666" v-if="!loopMaps.length">{{
                  $t('globalConfig.backgroundImage')
                }}</span>
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
                :class="{ uploadHide: loopMaps.length === 1 }"
                :file-list="loopMaps"
                list-type="picture-card"
                action="/"
                :on-success="
                  (response, file) => handleChange(response, file, 'loopMaps')
                "
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
                      @click="handleRemove(file, 'loopMaps')"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isLoopPics', item.key, 'loopMaps')"
              >
                {{ changeBtnName(statement.isLoopPics) }}
              </apiot-button>
            </div>
            <!-- 登录页LOGO -->
            <div
              v-if="i === 9"
              class="passwordConfig__logo common"
              style="line-height: 48px"
            >
              <div v-if="!statement.isRegistration">
                <span style="color: #666666" v-if="!loginImg">
                  {{ $t('globalConfig.uploadTheLoginPageLogo') }}
                </span>
                <el-image
                  fit="cover"
                  v-if="loginImg"
                  style="width: 48px; height: 48px; border-radius: 4px"
                  :src="loginImg"
                  class="userImage m-r-4"
                >
                </el-image>
              </div>
              <el-upload
                v-else
                class="uploadWrap"
                :class="{ uploadHide: loginMaps.length === 1 }"
                :file-list="loginMaps"
                list-type="picture-card"
                action="/"
                :on-success="
                  (response, file) => handleChange(response, file, 'loginMaps')
                "
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
                      @click="handleRemove(file, 'loginMaps')"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="
                  handleChangeCount('isRegistration', item.key, 'loginMaps')
                "
              >
                {{ changeBtnName(statement.isRegistration) }}
              </apiot-button>
            </div>
          </li>
        </el-col>
      </el-row>
    </ul>
  </section>
</template>

<script>
import { getListByKey, commonUpdate, updateImages } from '@/api/globalConfig';
import { selectColorArr } from '@/config';

export default {
  data() {
    return {
      loading: false,
      accept: '.png,.svg,.jpg, .jpeg',
      response: [],
      params: {},
      stompClient: '',
      timer: '',
      statement: {
        // 状态集合
        isUpload: false, // 备案号
        isRegistration: false, // 登录页
        isLoopPics: false, // l轮播图
        isClickErrorCount: false, // 错误次数点击
        isLoginStyle: false, // 登陆风格
        isSsoType: false // 是否单点登录
      },
      loginObj: {}, // login url
      loopMaps: [],
      loginMaps: [],
      fileList: [], // 协议列表
      loginStyle: 1, // 登录风格
      loginStyleArr: [
        {
          name: '平铺式轮播风格',
          value: 1
        },
        {
          name: '卡片式轮播风格',
          value: 2
        }
      ],
      ssoType: 1,
      themeColor: 1,
      themeStyleArr: []
    };
  },
  components: {},
  created() {},
  mounted() {
    this.initColor();
    this.init();
  },
  computed: {
    // 类型数组
    ssoTypeArr() {
      return this.$store.getters.getCurDict('SSO_TYPE');
    },
    fileUrl() {
      return function (url) {
        if (!url) return '';
        return url.substr(0, url.length - 1);
      };
    },
    loginImg() {
      // eslint-disable-next-line max-len
      return (
        this.loginObj.attributeValue &&
        this.loginObj.attributeValue.substr(0, this.loginObj.attributeValue.length - 1)
      );
    },
    // 左侧配置
    configArr() {
      return [
        {
          name: this.$t('globalConfig.enableAppRegistration'),
          col: 12,
          attributeKey: 'enableRegistration',
          key: 'enableRegistration'
        },
        // {
        //   name: this.$t('globalConfig.enableWX'),
        //   col: 12,
        //   attributeKey: 'enableWeChatLogin',
        //   key: 'enableWeChatLogin'
        // },
        // {
        //   name: this.$t('globalConfig.enableDingTalk'),
        //   col: 12,
        //   key: 'enableDingDingLogin',
        //   attributeKey: 'enableDingDingLogin'
        // },
        {
          name: this.$t('globalConfig.enableAppPassword'),
          col: 12,
          key: 'enableForgetPassword',
          attributeKey: 'enableForgetPassword'
        },
        {
          name: this.$t('globalConfig.enableAutoLogin'),
          col: 12,
          key: 'enableDefaultLogin',
          attributeKey: 'enableDefaultLogin'
        },
        {
          name: this.$t('globalConfig.enableAppMoreLanguage'),
          col: 12,
          key: 'enableMultilingual',
          attributeKey: 'enableMultilingual'
        },
        {
          name: '单点登录方式',
          col: 12,
          key: 'ssoType',
          attributeKey: 'ssoType'
        },
        {
          name: this.$t('globalConfig.style'),
          col: 12,
          key: 'style',
          attributeKey: 'style'
        },
        {
          name: this.$t('globalConfig.themeColor'),
          col: 24,
          key: 'themeColor',
          attributeKey: 'themeColor'
        },
        {
          name: this.$t('globalConfig.LoginRegistrationAgreement'),
          col: 24,
          key: 'agreementUrl',
          attributeKey: 'agreementUrl'
        },
        {
          name: this.$t('globalConfig.LoginAppBg'),
          col: 24,
          key: 'backgroundUrl',
          attributeKey: 'backgroundUrl'
        },
        {
          name: this.$t('globalConfig.LoginAppLogo'),
          col: 24,
          key: 'loginLogo',
          attributeKey: 'loginLogo'
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
        const obj = options.find((item) => item.value === Number(val));
        return obj && obj.name;
      };
    }
  },
  methods: {
    // 初始化主题色
    initColor() {
      selectColorArr.forEach((color, index) => {
        this.themeStyleArr.push({
          color,
          value: index + 1
        });
      });
    },
    handleRemove({ url }, key) {
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.image') }),
        this.$t('common.delete', { name: this.$t('helpCenter.image') }),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(() => {
        const index = this[key].findIndex((item) => item.url === url);
        if (index === -1) return;
        this[key].splice(index, 1);
      });
    },
    handleChange(response, file, key) {
      this[key].push(file);
    },
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    beforeUploadPdf(file) {
      // 上传校验
      // console.log(4444444444);
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        const newSize = size / 1024 / 1024 < 20;
        if ('.pdf'.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'error',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        if (!newSize) {
          this.$message({
            type: 'error',
            message: this.$t('icon.beforeUploadingConfig')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    handleChangePDF(a, b) {
      this.fileList = [b];
      // console.log(this.fileList, a, b);
      this.$refs.uploadDemo[0].clearFiles();
    },
    async doUploadPdf(params) {
      const { file } = params;
      console.log(file);
    },
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        const newSize = size / 1024 < 200;
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'error',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        if (!newSize) {
          this.$message({
            type: 'error',
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
      this.$store.dispatch('getCurrentDict', 'SSO_TYPE');
      const res = await getListByKey({ parameterKey: 'APPLOGIN' });
      this.loading = false;
      this.response = res;
      this.response.forEach((item) => {
        this.params[item.attributeKey] = item.attributeValue;
      });
      this.loginObj = this.response.find((item) => item.attributeKey === 'loginLogo') || {};
      const backgroundUrlObj =
        this.response.find((item) => item.attributeKey === 'backgroundUrl') || {};
      const backgroundUrl = backgroundUrlObj.attributeValue;
      const loginLogo = this.loginObj.attributeValue;
      const styleObj = this.response.find((item) => item.attributeKey === 'style') || {};
      this.loginStyle = Number(styleObj.attributeValue);
      const ssoType = this.response.find((item) => item.attributeKey === 'ssoType') || {};
      this.ssoType = Number(ssoType.attributeValue);
      const themeColorObj = this.response.find((item) => item.attributeKey === 'themeColor') || {};
      this.themeColor = Number(themeColorObj.attributeValue);
      const makeUrlArr = (value, key) => {
        if (value) {
          const arr = value.split(',');
          arr.forEach((item) => {
            if (item) {
              this[key].push({ url: item });
            }
          });
        } else {
          this[key] = [];
        }
      };
      makeUrlArr(backgroundUrl, 'loopMaps');
      makeUrlArr(loginLogo, 'loginMaps');
      this.params = {
        ...this.params
      };
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
    async saveLoopMap(key, arrKey) {
      const currentObj = this.response.find((item) => item.attributeKey === key);
      const formData = new FormData();
      delete currentObj.attributeValue;
      Object.keys(currentObj).forEach((item) => {
        formData.append(item, currentObj[item]);
      });
      const update = async (paramsForm) => {
        try {
          await updateImages(paramsForm);
          this.loopMaps = [];
          this.loginMaps = [];
          this.fileList = [];
          await this.init();
        } catch (e) {
          // console.log(e);
        }
      };
      if (!this[arrKey].length) {
        formData.append('files', '');
        await update(formData);
      } else if (this[arrKey].length) {
        // eslint-disable-next-line no-unused-vars
        let attributeValue = '';
        if (arrKey === 'fileList') {
          this[arrKey].forEach((item) => {
            formData.append('files', item.raw);
          });
        } else {
          this[arrKey].forEach((item) => {
            if (Object.keys(item).length && Object.keys(item).length > 3) {
              formData.append('files', item.raw);
            } else {
              attributeValue += `${item.url},`;
            }
          });
        }
        formData.append('attributeValue', attributeValue);
        await update(formData);
      }
    },
    async handleChangeCount(key, attr, arrKey) {
      // 滑块显示设置
      if (this.statement[key]) {
        this.loading = true;
        if (key === 'isLoopPics' || key === 'isRegistration') {
          await this.saveLoopMap(attr, arrKey);
          this.statement[key] = !this.statement[key];
          return;
        }
        if (key === 'isUpload') {
          if (!this.fileList.length) {
            this.statement[key] = !this.statement[key];
            this.loading = false;
            return;
          }
          await this.saveLoopMap(attr, arrKey);
          this.statement[key] = !this.statement[key];
          return;
        }
        if (key === 'isLoginStyle' || key === 'isSsoType') {
          const currentObj = this.response.find((item) => item.attributeKey === attr);
          // 登录logo保存
          let params = {};
          if (key === 'isLoginStyle') {
            params = {
              ...currentObj,
              attributeValue: this.loginStyle
            };
          } else if (key === 'isSsoType') {
            params = {
              ...currentObj,
              attributeValue: this.ssoType
            };
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
      }
    }
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    // this.disconnect();
    // clearInterval(this.timer);
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
        .uploadAgreement {
          .icon-shangchuan {
            color: #4689f5;
          }
          ::v-deep {
            .el-upload-list {
              display: none;
            }
          }
        }
        .fileWrap {
          display: inline-block;
          height: 30px;
          width: 100%;
          margin: 0 10px;
          padding: 0 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
          line-height: 30px;
        }
        .passwordConfig__operation {
          display: flex;
          font-size: 13px;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          align-items: center;
          a {
            color: #4689f5;
            text-decoration: none;
          }
          & > div:nth-child(2) {
            height: 12px;
            border-right: 1px solid $--color-primary;
            margin: 0 14px;
            cursor: auto;
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
    }
  }

  .el-upload-list--picture-card .el-upload-list__item {
    width: 48px;
    height: 48px;
  }
}
</style>
