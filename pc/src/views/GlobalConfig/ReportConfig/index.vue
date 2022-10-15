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
          v-for="(item, i) in leftConfigArr"
          :key="`${item.name}_${i}`"
          :span="item.col"
        >
          <li>
            <div class="leftName">
              <div>
                {{ item.name }}
              </div>
            </div>
            <div v-if="i === 0" class="common">
              <div v-if="!statement.isUreportUrl" style="line-height: 48px">
                {{ config.ureportUrl }}
              </div>
              <apiot-input
                style="width: 90%"
                v-else
                :isForbid="false"
                v-model="config.ureportUrl"
              ></apiot-input>
              <apiot-button
                type="text"
                class="homeConfig__operation"
                @click="handleChangeCount('isUreportUrl')"
              >
                {{ changeBtnName(statement.isUreportUrl) }}
              </apiot-button>
            </div>
            <div v-if="i === 1" class="common">
              <div v-if="!statement.isAppUrl" style="line-height: 48px">
                {{ config.appHomepageUrl }}
              </div>
              <apiot-input
                style="width: 90%"
                v-else
                :isForbid="false"
                v-model="config.appHomepageUrl"
              ></apiot-input>
              <apiot-button
                type="text"
                class="homeConfig__operation"
                @click="handleChangeCount('isAppUrl')"
              >
                {{ changeBtnName(statement.isAppUrl) }}
              </apiot-button>
            </div>
            <div v-if="i === 2" class="common">
              <div v-if="!statement.isShareUrl" style="line-height: 48px">
                {{ config.shareUrl }}
              </div>
              <apiot-input
                style="width: 90%"
                v-else
                :isForbid="false"
                v-model="config.shareUrl"
              ></apiot-input>
              <apiot-button
                type="text"
                class="homeConfig__operation"
                @click="handleChangeCount('isShareUrl')"
              >
                {{ changeBtnName(statement.isShareUrl) }}
              </apiot-button>
            </div>
          </li>
        </el-col>
      </el-row>
    </ul>
  </section>
</template>

<script>
import { commonUpdate } from '@/api/globalConfig';

export default {
  data() {
    return {
      loading: false,
      params: {},
      statement: {
        isUreportUrl: false,
        isMinioUrl: false,
        isAppUrl: false,
        isShareUrl: false
      }
    };
  },
  computed: {
    config() {
      return this.$store.state.globalConfig.ureportConfig;
    },
    configArr() {
      return this.$store.state.globalConfig.ureportConfigArr;
    },
    // 左侧配置
    leftConfigArr() {
      return [
        {
          name: this.$t('globalConfig.ureportUrl'),
          col: 24,
          attr: 'ureportUrl'
        },
        {
          name: this.$t('globalConfig.APPCustomPage'),
          col: 24,
          attr: 'ureportUrl'
        },
        {
          name: this.$t('globalConfig.shareUrl'),
          col: 24,
          attr: 'ureportUrl'
        }
      ];
    },
    // 修改 button 状态
    changeBtnName() {
      return function (state) {
        return state ? this.$t('common.save') : this.$t('common.modify');
      };
    }
  },
  methods: {
    async update(params) {
      // 通用修改
      try {
        await commonUpdate({ list: [params] });
        await this.$store.dispatch('fetchConfigFun', 'UREPORT_URL');
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
      const arr = this.configArr || [];
      const currentObj = arr.find((item) => item.attributeKey === key) || {};
      const params = {
        ...currentObj,
        attributeValue: value
      };
      console.log(params);
      await this.update(params);
    },
    async handleChangeCount(key) {
      if (!this.statement[key]) {
        this.statement[key] = !this.statement[key];
        return;
      }
      // 滑块显示设置
      if (key === 'isUreportUrl' && this.statement[key]) {
        this.changeRadio(this.config.ureportUrl, 'ureportUrl');
      }
      if (key === 'isMinioUrl' && this.statement[key]) {
        this.changeRadio(this.config.minioUrl, 'minioUrl');
      }
      if (key === 'isAppUrl' && this.statement[key]) {
        this.changeRadio(this.config.appHomepageUrl, 'appHomepageUrl');
      }
      if (key === 'isShareUrl' && this.statement[key]) {
        this.changeRadio(this.config.shareUrl, 'shareUrl');
      }
      this.statement[key] = !this.statement[key];
    }
  }
};
</script>
<style lang='scss' scoped>
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
