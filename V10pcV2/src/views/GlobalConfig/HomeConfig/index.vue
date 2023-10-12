<!--
 * @Descripttion: 主页消息相关选项
 * @Author: ytx
 * @Date: 2022-08-03 15:46:48
 * @Last Modified by: ytx
 * @Last Modified time: 2022-08-03 15:46:48
-->
<template>
  <section class="homeConfig" v-loading="loading">
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
              </div>
            </div>
            <div v-if="i === 0" style="flex: none" class="common">
              <ApiotSwitch
                v-model="messageConfig[item.attr]"
                @change="(value) => changeRadio(value, item.attr)"
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
              <ApiotColorPicker
                class="colorPicker"
                @change="changeRadio(messageColor, item.messageColor)"
                v-model="messageColor"
                v-if="item.messageColor && showColor"
              ></ApiotColorPicker>
            </div>
            <!-- socket地址 -->
            <div v-else-if="i === 1" class="common">
              <div v-if="!statement.isSocketUrl" style="line-height: 48px">
                {{ messageConfig.socketUrl }}
              </div>
              <apiot-input
                style="width: 90%"
                v-else
                :isForbid="false"
                v-model="messageConfig.socketUrl"
              ></apiot-input>
              <apiot-button
                type="text"
                class="homeConfig__operation"
                @click="handleChangeCount('isSocketUrl')"
              >
                {{ changeBtnName(statement.isSocketUrl) }}
              </apiot-button>
            </div>
          </li>
        </el-col>
      </el-row>
    </ul>
  </section>
</template>

<script>
import { commonUpdate, updateImages } from '@/api/globalConfig';
import ImageAndChange from '../components/ImageAndChange';

export default {
  data() {
    return {
      loading: false,
      params: {},
      statement: {
        isSocketUrl: false,
      },
      imgObj: {
        enableMessageIcon: {},
      },
      messageColor: '#4689f5',
      showColor: true,
    };
  },
  components: { ImageAndChange },
  mounted() {
    this.messageColor =
      this.$store.state.globalConfig.messageConfig.messageColor;
    this.showColor = false;
    this.$nextTick(() => {
      this.showColor = true;
    });
    this.initImgObj();
  },
  computed: {
    messageConfig() {
      return this.$store.state.globalConfig.messageConfig;
    },
    messageConfigArr() {
      return this.$store.state.globalConfig.messageConfigArr;
    },
    // 左侧配置
    configArr() {
      return [
        {
          name: this.$t('globalConfig.homePageMessage'),
          col: 24,
          attr: 'enableMessage',
          imgAttr: 'enableMessageIcon',
          messageColor: 'messageColor',
        },
        {
          name: this.$t('globalConfig.socketAddress'),
          col: 24,
          key: 'socketUrl',
          attr: 'socketUrl',
        },
      ];
    },
    // 修改 button 状态
    changeBtnName() {
      return function (state) {
        return state ? this.$t('common.save') : this.$t('common.modify');
      };
    },
  },
  methods: {
    // 初始化图片
    initImgObj() {
      Object.keys(this.imgObj).forEach((key) => {
        this.imgObj[key] =
          this.messageConfigArr.find((item) => item.attributeKey === key) || {};
      });
    },
    async update(params) {
      // 通用修改
      try {
        await commonUpdate({ list: [params] });
        await this.$store.dispatch('fetchConfigFun', 'MESSAGE_CONFIG');
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified'),
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async changeRadio(value, key) {
      this.loading = true;
      const arr = this.messageConfigArr || [];
      const currentObj = arr.find((item) => item.attributeKey === key) || {};
      const params = {
        ...currentObj,
        attributeValue: value,
      };
      await this.update(params);
    },
    async handleChangeCount(key) {
      if (!this.statement[key]) {
        this.statement[key] = !this.statement[key];
        return;
      }
      // 滑块显示设置
      if (key === 'isSocketUrl' && this.statement[key]) {
        this.changeRadio(this.messageConfig.socketUrl, 'socketUrl');
      }
      this.statement[key] = !this.statement[key];
    },
    async uploadSuccess(key) {
      const formData = new FormData();
      const { fileList } = this.$refs[key][0];
      const arr = this.messageConfigArr || [];
      const imageObj = arr.find((item) => item.attributeKey === key);
      const newImageObj = JSON.parse(JSON.stringify(imageObj));
      delete newImageObj.attributeValue;
      Object.keys(newImageObj).forEach((item) => {
        formData.append(item, newImageObj[item]);
      });
      const update = async (paramsForm) => {
        await updateImages(paramsForm);
        await this.$store.dispatch('fetchConfigFun', 'MESSAGE_CONFIG');
      };
      if (fileList.length && Object.keys(fileList[0]).length > 3) {
        formData.append('files', fileList[0].raw);
        await update(formData);
      } else if (!fileList.length) {
        formData.append('files', '');
        await update(formData);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
$borderColor: 1px solid #e9e9e9;
.homeConfig {
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
  .colorPicker {
    width: 32px;
    height: 32px;
    ::v-deep {
      .el-color-picker__trigger {
        width: 32px;
        height: 32px;
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
  }
}
</style>
