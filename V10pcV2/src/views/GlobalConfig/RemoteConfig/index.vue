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
            <!-- 备案号 -->
            <div v-if="[0, 1, 3, 4, 5, 7,8,9,10,11].includes(i)" class="common">
              <div v-if="!statement[item.attributeKey]"
                   :title="params[item.key]"
                   class="text">
                {{ params[item.key] }}
              </div>
              <apiot-input
                  :style="selectWidth"
                  v-else
                  v-model="params[item.key]"
              ></apiot-input>
              <apiot-button
                  type="text"
                  class="passwordConfig__operation"
                  @click="handleChangeCount(item.attributeKey)"
              >
                {{ changeBtnName(statement[item.attributeKey]) }}
              </apiot-button>
            </div>
            <div
                v-if="[2, 6].includes(i)"
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
          </li>
        </el-col>
      </el-row>
    </ul>
  </section>
</template>

<script>
import { commonUpdate, getListByKey } from '@/api/globalConfig';

export default {
  props: {
    selectWidth: {
      type: String,
      default: 'width: 200px',
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      response: [],
      params: {},
      record: '',
      statement: {
        // 状态集合
        appId: false,
        appSecret: false,
        region: false,
        secretKey: false,
        secretId: false,
        websocketProxy: false,
        loggerProxy: false,
        turnServerUrl: false,
        turnUsername: false,
        turnCredential: false
      },
    };
  },
  components: {},
  created() {
  },
  mounted() {
    this.init();
  },
  computed: {
    // 左侧配置
    configArr() {
      return [
        // 1
        {
          name: 'SDKAppID',
          col: 12,
          attributeKey: 'appId',
          key: 'appId',
        },
        // 2
        {
          name: 'SDKSecretKey',
          col: 12,
          key: 'appSecret',
          attributeKey: 'appSecret',
        },
        // 3
        {
          name: '启用远程协助中心',
          col: 12,
          key: 'enableAssistance',
          attributeKey: 'enableAssistance',
        },
        {
          name: '腾讯云视频转码secretId',
          col: 12,
          key: 'secretId',
          attributeKey: 'secretId',
        },
        {
          name: '腾讯云视频转码secretKey',
          col: 12,
          key: 'secretKey',
          attributeKey: 'secretKey',
        },
        {
          name: '腾讯云视频转码region',
          col: 12,
          key: 'region',
          attributeKey: 'region',
        },
        {
          name: '是否启用内网模式',
          col: 12,
          key: 'enableIntranet',
          attributeKey: 'enableIntranet',
        },
        {
          name: 'Websocket 代理地址',
          col: 12,
          key: 'websocketProxy',
          attributeKey: 'websocketProxy',
        },
        {
          name: '日志上报代理地址',
          col: 12,
          key: 'loggerProxy',
          attributeKey: 'loggerProxy',
        },
        {
          name: 'turnServer地址',
          col: 12,
          key: 'turnServerUrl',
          attributeKey: 'turnServerUrl',
        },
        {
          name: 'turnServer用户名',
          col: 12,
          key: 'turnUsername',
          attributeKey: 'turnUsername',
        },
        {
          name: 'turnServer密码',
          col: 12,
          key: 'turnCredential',
          attributeKey: 'turnCredential',
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
    async init() {
      this.loading = true;
      const res = await getListByKey({ parameterKey: 'REMOTE_ASSISTANCE' });
      this.loading = false;
      this.response = res;
      res.forEach((item) => {
        const {
          attributeKey,
          attributeValue
        } = item;
        this.$set(this.params, attributeKey, attributeValue);
      });
    },
    async changeRadio(value, key) {
      this.loading = true;
      const currentObj = this.response.find(
          (item) => item.attributeKey === key,
      );
      const params = {
        ...currentObj,
        attributeValue: this.params[key],
      };
      try {
        await commonUpdate({ list: [params] });
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified'),
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async handleChangeCount(attr) {
      // 滑块显示设置
      if (this.statement[attr]) {
        this.loading = true;
        const currentObj = this.response.find(
            (item) => item.attributeKey === attr,
        );
        const params = {
          ...currentObj,
          attributeValue: this.params[attr],
        };
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
            message: this.$t('common.successfullyModified'),
          });
        } catch (e) {
          this.loading = false;
        }
      }
      this.statement[attr] = !this.statement[attr];
    },
  },
  beforeDestroy() {
  },
};
</script>
<style lang="scss" scoped>
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

        .text {
          width: 200px;
          line-height: 18px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
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
