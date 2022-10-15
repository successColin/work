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
              <div>
                {{ item.name }}
                {{ JSON.stringify($store.state.themeConfig) }}
              </div>
            </div>
            <!-- 是否启用注册   是否支持APP扫码登录   是否启用忘记密码 -->
            <div
              v-if="[0, 1, 2, 3, 4, 5, 6, 7].includes(i)"
              style="flex: none"
              class="common"
            >
              <!-- <apiot-radio
                @change="(value) => changeRadio(value, item.attr)"
                v-model="$store.state.globalConfig.themeConfig[item.attr]"
                label="1"
                >{{ $t('common.is') }}
              </apiot-radio>
              <apiot-radio
                @change="(value) => changeRadio(value, item.attr)"
                v-model="$store.state.globalConfig.themeConfig[item.attr]"
                label="0"
                >{{ $t('common.no') }}
              </apiot-radio> -->
              <ApiotSwitch
                v-model="$store.state.globalConfig.themeConfig[item.attr]"
                @change="(value) => changeRadio(value, item.attr)"
                inactivevalue="0"
              ></ApiotSwitch>
              <image-and-change
                class="m-l-10 m-r-10"
                style="width: auto"
                v-if="item.imgAttr"
                :ref="item.imgAttr"
                :imgObj="imgObj[item.imgAttr]"
                :isSmall="true"
                :showSlider="false"
                @uploadSuccess="uploadSuccess(item.imgAttr)"
                @removeSuccesss="changeRadio('', item.imgAttr)"
              />
              <el-checkbox-group
                v-model="checkList"
                @change="(value) => changeRadio(value, item.helpCenterMenu)"
                v-if="item.helpCenterMenu"
                class="checkBox"
              >
                <el-checkbox label="1">帮助文档</el-checkbox>
                <el-checkbox label="2">视频教程</el-checkbox>
                <el-checkbox label="3">常见问题</el-checkbox>
                <el-checkbox label="4">更新日志</el-checkbox>
              </el-checkbox-group>
            </div>
            <!-- 菜单样式 -->
            <div v-else-if="i === 8" class="common">
              <div v-if="!statement.isMenuStyle">
                {{
                  showValueName(
                    menuStyleOptions,
                    $store.state.globalConfig.themeConfig[item.attr]
                  )
                }}
              </div>
              <apiot-select
                style="width: 224px"
                v-else
                v-model="menuStyle"
                :options="menuStyleOptions"
              ></apiot-select>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isMenuStyle')"
              >
                {{ changeBtnName(statement.isMenuStyle) }}
              </apiot-button>
            </div>
            <!-- 主题风格 -->
            <div v-else-if="i === 9" class="common">
              <div class="colorWrap">
                <div v-for="item in themeStyleArr" :key="item.color">
                  <div
                    class="colorBox"
                    :style="'background:' + item.color"
                    @click="changeRadio(item.value, 'themeStyle')"
                  >
                    <i
                      class="el-icon-check"
                      :class="{
                        selected:
                          $store.state.globalConfig.themeConfig.themeStyle ===
                          item.value,
                      }"
                      v-if="
                        $store.state.globalConfig.themeConfig.themeStyle ===
                        item.value
                      "
                    ></i>
                  </div>
                  <div class="name">{{ $t(item.name) }}</div>
                </div>
              </div>
            </div>
            <!-- 系统顶部高度 -->
            <div v-else-if="i === 10" class="common">
              <div v-if="!statement.isTopHeight">
                {{ $store.state.globalConfig.themeConfig.topHeight }}px
              </div>
              <div v-else style="display: flex; align-items: center">
                <el-slider
                  class="sliderWrap"
                  style="width: 140px"
                  :min="40"
                  :max="60"
                  :step="2"
                  v-model="topHeight"
                ></el-slider>
                <span class="sizeWrap m-l-14">{{ topHeight }}px</span>
              </div>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isTopHeight')"
              >
                {{ changeBtnName(statement.isTopHeight) }}
              </apiot-button>
            </div>
            <!-- 主题样式 -->
            <div v-else-if="i === 11" class="common">
              <div class="colorWrap">
                <div
                  v-for="item in themeColor"
                  :key="item"
                  style="margin-right: 0px"
                >
                  <div
                    class="colorBox"
                    :style="'background:' + item"
                    @click="changeRadio(item, 'themeColor')"
                  >
                    <i
                      class="el-icon-check"
                      :class="{
                        selected:
                          $store.state.globalConfig.themeConfig.themeColor ===
                          item,
                      }"
                      v-if="
                        $store.state.globalConfig.themeConfig.themeColor ===
                        item
                      "
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="i === 12" class="common">
              <div v-if="!statement.istopStyle">
                {{
                  getTopStyleName(
                    $store.state.globalConfig.themeConfig.topStyle
                  )
                }}
              </div>
              <div v-else style="display: flex">
                <el-select
                  style="width: 200px"
                  v-model="$store.state.globalConfig.themeConfig.topStyle"
                >
                  <el-option
                    v-for="item in topStyleArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <image-and-change
                  class="m-l-10 m-r-10"
                  style="width: auto"
                  v-if="$store.state.globalConfig.themeConfig.topStyle === '3'"
                  ref="topStyleIcon"
                  :imgObj="{
                    attributeValue:
                      $store.state.globalConfig.themeConfig.topStyleIcon,
                  }"
                  :isSmall="true"
                  :showSlider="false"
                />
              </div>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('istopStyle')"
              >
                {{ changeBtnName(statement.istopStyle) }}
              </apiot-button>
            </div>
            <!-- 登录页LOGO -->
            <div v-else-if="i === 13" class="passwordConfig__logo common">
              <div v-if="!statement.isRegistration">
                <el-image
                  fit="cover"
                  style="width: 48px; height: 48px; border-radius: 4px"
                  :src="$parseImgUrl(loginImg)"
                  v-if="loginImg"
                  class="userImage m-r-4"
                >
                </el-image>
              </div>
              <image-and-change
                v-if="statement.isRegistration"
                ref="imageAndChange"
                :imgObj="{
                  attributeValue:
                    $store.state.globalConfig.themeConfig.homePageLogo,
                }"
                :imgWidth="
                  $store.state.globalConfig.themeConfig.homePageLogoWidth
                "
                @change-image-width="changeWidth"
              />
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isRegistration')"
              >
                {{ changeBtnName(statement.isRegistration) }}
              </apiot-button>
            </div>
            <!-- socket地址 -->
            <!-- <div v-else-if="i === 15" class="passwordConfig__logo common">
              <div v-if="!statement.isSocketUrl" style="line-height: 48px">
                {{ $store.state.globalConfig.themeConfig.socketUrl }}
              </div>
              <apiot-input
                style="width: 224px"
                v-else
                :isForbid="false"
                v-model="$store.state.globalConfig.themeConfig.socketUrl"
              ></apiot-input>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isSocketUrl')"
              >
                {{ changeBtnName(statement.isSocketUrl) }}
              </apiot-button>
            </div>
            <div v-else-if="i === 16" class="passwordConfig__logo common">
              <div v-if="!statement.isUreportUrl" style="line-height: 48px">
                {{ $store.state.globalConfig.ureportConfig.ureportUrl }}
              </div>
              <apiot-input
                style="width: 224px"
                v-else
                :isForbid="false"
                v-model="$store.state.globalConfig.ureportConfig.ureportUrl"
              ></apiot-input>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('isUreportUrl')"
              >
                {{ changeBtnName(statement.isUreportUrl) }}
              </apiot-button>
            </div> -->
          </li>
        </el-col>
      </el-row>
    </ul>
  </section>
</template>

<script>
import { commonUpdate, updateImages } from '@/api/globalConfig';
import { changeThemeColor } from '@/utils/themeColorClient';
// import { selectColorArr } from '@/config';
import ImageAndChange from '../components/ImageAndChange';

export default {
  data() {
    return {
      menuStyle: null,
      loading: false,
      // eslint-disable-next-line max-len
      themeColor: [
        '#4689F5',
        '#C62127',
        '#EE5E5E',
        '#FAB71C',
        '#FC8256',
        '#34C7BE',
        '#A853F2',
        '#EF4373',
        '#285398',
        '#10978F',
        '#6B2BA2'
      ],
      // themeColor: selectColorArr,
      params: {},
      statement: {
        isRegistration: false,
        isLoopPics: false,
        isMenuStyle: false,
        isTopHeight: false,
        istopStyle: false,
        isSocketUrl: false,
        isUreportUrl: false
      },
      themeStyleArr: [
        {
          color: '#29354D',
          value: '1',
          name: 'globalConfig.themeDark'
        },
        {
          color: '#4689f5',
          value: '2',
          name: 'globalConfig.themeStyleTheme'
        }
      ],
      menuStyleOptions: [
        {
          name: this.$t('globalConfig.themeFunctionsCenter'),
          value: 1
        },
        {
          name: this.$t('globalConfig.traditionalMode'),
          value: 2
        },
        {
          name: this.$t('globalConfig.menuModuleMode'),
          value: 3
        },
        {
          name: this.$t('globalConfig.menuShrinkMode'),
          value: 4
        }
      ],
      imgObj: {
        enableMessageIcon: {},
        enableApprovalProcessIcon: {},
        enableHelpCenterIcon: {},
        enableFullScreenIcon: {},
        topStyleIcon: {}
      },
      checkList: [],
      topStyleArr: [
        {
          name: '默认',
          value: '1'
        },
        {
          name: '无底图',
          value: '2'
        },
        {
          name: '自定义样式',
          value: '3'
        }
      ],
      topHeight: 50
    };
  },
  components: { ImageAndChange },
  mounted() {
    this.menuStyle = this.$store.state.globalConfig.themeConfig.menuStyle;
    this.topHeight = this.$store.state.globalConfig.themeConfig.topHeight;
    this.checkList = this.$store.state.globalConfig.themeConfig.helpCenterMenu
      ? this.$store.state.globalConfig.themeConfig.helpCenterMenu.split(',')
      : [];
    this.initImgObj();
  },
  computed: {
    loginImg() {
      const url = this.$store.state.globalConfig.themeConfig.homePageLogo;
      // eslint-disable-next-line max-len
      return url && url.substr(0, url.length - 1);
    },
    getValue() {
      // eslint-disable-next-line no-unused-vars
      return function (key) {
        return this.$store.state.globalConfig.themeConfig[key];
      };
    },
    // 左侧配置
    configArr() {
      return [
        // {
        //   name: this.$t('globalConfig.homePageMessage'),
        //   col: 12,
        //   attr: 'enableMessage',
        //   imgAttr: 'enableMessageIcon'
        // },
        {
          name: this.$t('globalConfig.homepageApproval'),
          col: 12,
          attr: 'enableApprovalProcess',
          imgAttr: 'enableApprovalProcessIcon'
        },

        {
          name: this.$t('globalConfig.enableFullScreen'),
          col: 12,
          key: 'enableRegistration',
          attr: 'enableFullScreen',
          imgAttr: 'enableFullScreenIcon'
        },
        {
          name: this.$t('globalConfig.enableMultilingualism'),
          col: 24,
          attr: 'enableMultilingualism'
        },
        {
          name: this.$t('globalConfig.enableHelpCenter'),
          col: 24,
          attr: 'enableHelpCenter',
          imgAttr: 'enableHelpCenterIcon',
          helpCenterMenu: 'helpCenterMenu'
        },
        {
          name: this.$t('globalConfig.enableLink'),
          col: 12,
          key: 'enableLink',
          attr: 'enableLink'
        },
        {
          name: this.$t('globalConfig.enableVersionId'),
          col: 12,
          key: 'enableVersionId',
          attr: 'enableVersionId'
        },
        {
          name: this.$t('globalConfig.enablePlatformSwitch'),
          col: 12,
          key: 'enablePlatformSwitch',
          attr: 'enablePlatformSwitch'
        },
        {
          name: this.$t('globalConfig.enableVersionUpgrade'),
          col: 12,
          key: 'enableVersionUpgrade',
          attr: 'enableVersionUpgrade'
        },
        {
          name: this.$t('globalConfig.menuStyle'),
          col: 24,
          key: 'supportAppCode',
          attr: 'menuStyle'
        },
        {
          name: this.$t('globalConfig.themeStyle'),
          col: 12,
          key: 'forgetPassword',
          attr: 'themeStyle'
        },
        {
          name: this.$t('globalConfig.topHeight'),
          col: 12,
          attr: 'topHeight'
        },
        {
          name: this.$t('globalConfig.themeColor'),
          col: 12,
          attr: 'themeColor'
        },
        {
          name: this.$t('globalConfig.topStyle'),
          col: 12,
          attr: 'topStyle'
        },
        {
          name: this.$t('globalConfig.homePageLogo'),
          col: 24,
          attr: 'homePageLogo'
        }
        // {
        //   name: this.$t('globalConfig.socketAddress'),
        //   col: 12,
        //   key: 'socketAddress',
        //   attr: 'socketUrl'
        // },
        // {
        //   name: '报表域名地址',
        //   col: 12,
        //   attr: 'ureportUrl'
        // }
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
        const obj = options.find((item) => item.value === val);
        return obj && obj.name;
      };
    },
    // 获取系统顶部显示值
    getTopStyleName() {
      return (v) => {
        const obj = this.topStyleArr.find((item) => {
          if (item.value === v) {
            return true;
          }
          return false;
        });
        if (obj) {
          return obj.name;
        }
        return v;
      };
    }
  },
  methods: {
    // 初始化图片
    initImgObj() {
      Object.keys(this.imgObj).forEach((key) => {
        this.imgObj[key] =
          this.$store.state.globalConfig.themeConfigArr.find((item) => item.attributeKey === key) ||
          {};
      });
    },
    async changeWidth(width) {
      const { fileList } = this.$refs.imageAndChange[0];
      if (!fileList.length) {
        this.$store.commit('setThemeConfig', { key: 'homePageLogo', value: '' });
      }
      this.$store.commit('setThemeConfig', { key: 'homePageLogoWidth', value: width });
    },
    async update(params) {
      // 通用修改
      try {
        await commonUpdate({ list: [params] });
        await this.$store.dispatch('fetchThemeConfig', 'THEME_AND_LOGO');
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async changeRadio(value, key) {
      this.loading = true;
      const arr = this.$store.state.globalConfig.themeConfigArr || [];
      const currentObj = arr.find((item) => item.attributeKey === key) || {};
      const params = {
        ...currentObj,
        attributeValue: value
      };
      if (key === 'helpCenterMenu') {
        params.attributeValue = value.join();
      }
      await this.update(params);
      if (key === 'themeColor') {
        localStorage.setItem('theme_color', value);
        changeThemeColor(value);
      }
    },
    async handleChangeCount(key) {
      if (!this.statement[key]) {
        this.statement[key] = !this.statement[key];
        return;
      }
      // 滑块显示设置
      if (key === 'isMenuStyle' && this.statement[key]) {
        await this.changeRadio(this.menuStyle, 'menuStyle');
        this.$store.commit('changeMenuType', this.menuStyle);
      }
      if (key === 'isRegistration' && this.statement[key]) {
        // 登录logo保存
        const arr = this.$store.state.globalConfig.themeConfigArr || [];
        const currentWidthObj = arr.find((item) => item.attributeKey === 'homePageLogoWidth');
        const { imgWidth } = this.$refs.imageAndChange[0];
        const params = {
          ...currentWidthObj,
          attributeValue: imgWidth
        };
        await this.logoSave();
        await this.update(params);
      }
      if (key === 'isTopHeight') {
        this.changeRadio(this.topHeight, 'topHeight');
      }
      if (key === 'istopStyle') {
        this.changeRadio(this.$store.state.globalConfig.themeConfig.topStyle, 'topStyle');
        this.uploadSuccess('topStyleIcon');
      }
      if (key === 'isSocketUrl') {
        await this.changeRadio(this.$store.state.globalConfig.themeConfig.socketUrl, 'socketUrl');
      }
      if (key === 'isUreportUrl') {
        this.changeRadio(this.$store.state.globalConfig.ureportConfig.ureportUrl, 'ureportUrl');
      }
      this.statement[key] = !this.statement[key];
    },
    async logoSave() {
      // 登录logo保存
      const formData = new FormData();
      const { fileList } = this.$refs.imageAndChange[0];
      const arr = this.$store.state.globalConfig.themeConfigArr || [];
      const imageObj = arr.find((item) => item.attributeKey === 'homePageLogo');
      const newImageObj = JSON.parse(JSON.stringify(imageObj));
      delete newImageObj.attributeValue;
      Object.keys(newImageObj).forEach((item) => {
        formData.append(item, newImageObj[item]);
      });
      const update = async (paramsForm) => {
        try {
          await updateImages(paramsForm);
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
    async uploadSuccess(key) {
      // 登录logo保存
      const formData = new FormData();
      const { fileList } = this.$refs[key][0];
      const arr = this.$store.state.globalConfig.themeConfigArr || [];
      const imageObj = arr.find((item) => item.attributeKey === key);
      const newImageObj = JSON.parse(JSON.stringify(imageObj));
      delete newImageObj.attributeValue;
      Object.keys(newImageObj).forEach((item) => {
        formData.append(item, newImageObj[item]);
      });
      const update = async (paramsForm) => {
        try {
          await updateImages(paramsForm);
          await this.$store.dispatch('fetchThemeConfig', 'THEME_AND_LOGO');
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
    }
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
        margin-left: 20px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
        .themeStyle {
          display: flex;
        }
        & .colorWrap {
          display: flex;
          & > div {
            display: flex;
            margin-right: 40px;
            & > .name {
              margin-left: 8px;
              line-height: 36px;
            }
          }
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

  &__switch {
    margin-right: 60px;
  }

  &__radio--font {
    font-size: 13px;
    color: #666666;
  }

  &__pswd {
    & > div,
    .iconfont {
      display: inline-block;
      cursor: pointer;
    }

    .iconfont {
      margin-left: 7px;
      color: #bbc3cd;
      font-size: 16px;
    }
  }

  &__pswd1 {
    display: flex;
  }

  &__pswd2 {
    vertical-align: sub;
  }

  &__separateLayout {
    justify-content: flex-start !important;
  }

  &__logo {
    & > div {
      height: 48px;
      line-height: 48px;

      & .el-upload-list__item div {
        height: 48px;
      }
    }
  }

  &__logo img {
    width: 48px;
    border-radius: 4px;
  }

  &__operation {
    display: flex;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    align-items: center;

    & > div:nth-child(2) {
      height: 12px;
      border-right: 1px solid $--color-primary;
      margin: 0 14px;
      cursor: auto;
    }
  }

  .oneFiles {
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

  // .el-col-12:nth-child(odd) {
  //   box-sizing: border-box;
  //   border-right: 1px solid #e9e9e9;
  // }
  .el-col-12:nth-child(1),
  .el-col-12:nth-child(3),
  .el-col-12:nth-child(5),
  .el-col-12:nth-child(7),
  .el-col-12:nth-child(10),
  .el-col-12:nth-child(12) {
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
  .el-checkbox {
    line-height: 20px;
    .el-checkbox__label {
      color: #333333;
    }
  }
}
</style>
