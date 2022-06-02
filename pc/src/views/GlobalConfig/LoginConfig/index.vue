<template>
  <section class="passwordConfig" v-loading="loading">
    <ul>
      <el-row>
        <el-col
          v-for="(item, i) in configArr"
          :key="`${item.name}_${i}`"
          :span="item.col"
        >
          <li>
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
                style="width: 224px"
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
                style="width: 224px"
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
            <!-- 是否启用注册   是否支持APP扫码登录   是否启用忘记密码 -->
            <div
              v-if="[2, 3, 4, 5].includes(i)"
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
            <!-- 登录页风格 -->
            <div v-if="i === 6" class="common">
              <div v-if="!statement.isLoginStyle">
                {{
                  showValueName(loginStyleArr, loginStyle, item.attributeKey)
                }}
              </div>
              <apiot-select
                style="width: 224px"
                v-if="statement.isLoginStyle"
                v-model="loginStyle"
                :options="loginStyleArr"
                @change="handleChangeSelectVal('style', $event)"
              ></apiot-select>
              <apiot-select
                style="width: 224px"
                v-if="statement.isLoginStyle && loginStyle === 2"
                v-model="stylePercentage"
                :options="stylePercentageArr"
                @change="handleChangeSelectVal('stylePercentage', $event)"
              ></apiot-select>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isLoginStyle', item.attributeKey)"
              >
                {{ changeBtnName(statement.isLoginStyle) }}
              </apiot-button>
            </div>

            <!-- 登录页LOGO -->
            <div v-if="i === 7" class="passwordConfig__logo common">
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
                ref="imageAndChange"
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
            <div v-if="i === 8" class="passwordConfig__logo common">
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
  </section>
</template>

<script>
import { getListByKey, commonUpdate, updateImages } from '@/api/globalConfig';
// import { makeUrlToBase64, dataURLtoFile } from '@/utils/utils';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
import ImageAndChange from '../components/ImageAndChange';

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
        isRecord: false, // 备案号
        isRegistration: false, // 登录页
        isLoopPics: false, // l轮播图
        isClickErrorCount: false, // 错误次数点击
        isLoginStyle: false
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
      stylePercentage: 1, // 卡片式轮播风格 的比例
      stylePercentageArr: [
        {
          name: '比例80%',
          value: 1
        },
        {
          name: '比例60%',
          value: 2
        },
        {
          name: '比例40%',
          value: 3
        }
      ],
      loopMaps: []
    };
  },
  components: { ImageAndChange },
  created() {
    // this.setSocket(`${this.expertSysid}/${this.consultationSysid}`);
  },
  mounted() {
    this.init();
    // this.initWebSocket();
  },
  computed: {
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
          name: this.$t('globalConfig.supportAppCode'),
          col: 12,
          key: 'enableAppLogin',
          attributeKey: 'enableAppLogin'
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
          name: this.$t('globalConfig.style'),
          col: 24,
          key: 'style',
          attributeKey: 'style'
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
        const obj = options.find((item) => item.value === Number(val));
        return obj && obj.name;
      };
    }
  },
  methods: {
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
    // initWebSocket() {
    //   this.connection();
    //   const that = this;
    //   // 断开重连机制,尝试发送消息,捕获异常发生时重连
    //   this.timer = setInterval(() => {
    //     try {
    //       that.stompClient.send('test');
    //     } catch (err) {
    //       that.connection();
    //     }
    //   }, 5000);
    // },
    // connection() {
    //   // 建立连接对象
    //   const socket = new SockJS('http://192.168.0.138:8080/welcome');
    //   // 获取STOMP子协议的客户端对象
    //   this.stompClient = Stomp.over(socket);
    //   // 定义客户端的认证信息,按需求配置
    //   const headers = {
    //     token: Decrypt(localStorage.getItem('token') || '')
    //   };
    //   // 向服务器发起websocket连接
    //   this.stompClient.connect(headers, () => {
    //     // console.log('链接成功');
    //     this.stompClient.subscribe('/user/admin/msg', (msg) => { // 订阅服务端提供的某个topic
    //       // console.log('广播成功');
    //       // console.log(msg); // msg.body存放的是服务端发送给我们的信息
    //     }, headers);
    //     this.stompClient.send('/app/chat.addUser', headers, JSON.stringify({
    //       sender: '',
    //       chatType: 'JOIN'
    //     })); // 用户加入接口
    //   }, (err) => {
    //     // 连接发生错误时的处理函数
    //     // console.log('失败');
    //     // console.log(err);
    //   });
    // }, // 连接后台
    // disconnect() {
    //   if (this.stompClient) {
    //     this.stompClient.disconnect();
    //   }
    // }, // 断开连接
    // setSocket(path) {
    //   const that = this;
    //   // 链接次数
    //   let number = 1;
    //   // 连接地址
    //   const url = '';
    //   // 建立连接对象（还未发起连接）
    //   const socket = new SockJS(url);
    //   // 获取 STOMP 子协议的客户端对象
    //   const stompClient = Stomp.over(socket);
    //   stompClient.debug = null; // 浏览器不console信息日志
    //   // 向服务器发起websocket连接并发送CONNECT帧
    //   stompClient.connect({}, (frame) => {
    //     stompClient.subscribe(`/user/${path}/consultationImageUpdateNotify`, (data) => {
    //       // console.log('))))收到后台推送的数据', frame, data);
    //     });
    //   }, function (error) {
    //     number += 1;
    //     if (number < 6) {
    //       this.setSocket(`${that.expertSysid}/${that.consultationSysid}`);
    //     }
    //     // console.log('))))收到后台推送的数据错误回调', error);
    //   });
    // },
    changeWidth(value) {
      // 改变logo宽度
      this.loginWidth = value;
    },
    async init() {
      this.loading = true;
      const res = await getListByKey({ parameterKey: 'LOGIN' });
      this.loading = false;
      this.response = res;
      console.log(res);
      const errorObj =
        this.response.find((item) => item.attributeKey === 'sliderErrorsCount') || {};
      const recordObj = this.response.find((item) => item.attributeKey === 'record') || {};
      const enableRegistrationObj =
        this.response.find((item) => item.attributeKey === 'enableRegistration') || {};
      const enableAppLoginObj =
        this.response.find((item) => item.attributeKey === 'enableAppLogin') || {};
      const enableForgetPasswordObj =
        this.response.find((item) => item.attributeKey === 'enableForgetPassword') || {};
      const enableMultilingual =
        this.response.find((item) => item.attributeKey === 'enableMultilingual') || {};
      const styleObj = this.response.find((item) => item.attributeKey === 'style') || {};
      const stylePercentage =
        this.response.find((item) => item.attributeKey === 'stylePercentage') || {};
      const logoObj = this.response.find((item) => item.attributeKey === 'loginLogo') || {};
      const logoObjWidth =
        this.response.find((item) => item.attributeKey === 'loginLogoWidth') || {};
      const loopObj = this.response.find((item) => item.attributeKey === 'loginLoopMaps') || {};
      const loopMapsArr = loopObj.attributeValue ? loopObj.attributeValue.split(',') : [];
      this.loopMaps = [];
      // eslint-disable-next-line array-callback-return
      loopMapsArr.forEach((item) => {
        if (item) {
          this.loopMaps.push({ url: item });
        }
      });
      console.log(styleObj);
      this.params = {
        ...this.params,
        enableRegistration: enableRegistrationObj.attributeValue,
        enableAppLogin: enableAppLoginObj.attributeValue,
        enableForgetPassword: enableForgetPasswordObj.attributeValue,
        enableMultilingual: enableMultilingual.attributeValue
      };
      this.errorCount = Number(errorObj.attributeValue);
      this.loginStyle = Number(styleObj.attributeValue);
      this.stylePercentage = Number(stylePercentage.attributeValue);
      this.record = recordObj.attributeValue;
      this.loginObj = logoObj;
      this.loginWidth = Number(logoObjWidth.attributeValue);
    },
    async changeRadio(value, key) {
      this.loading = true;
      const currentObj = this.response.find((item) => item.attributeKey === key);
      const params = {
        ...currentObj,
        attributeValue: this.params[key]
      };
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
    async logoSave() {
      // 登录logo保存
      const formData = new FormData();
      const { fileList } = this.$refs.imageAndChange[0];
      const imageObj = this.response.find((item) => item.attributeKey === 'loginLogo');
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
        if (key === 'isRegistration') {
          // 登录logo保存
          await this.logoSave(key, attr);
          const { imgWidth } = this.$refs.imageAndChange[0];
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
</style>
