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
              </div>
            </div>
            <!-- 是否启用水印功能 是否启用人员变量 是否启用日期时间变量-->
            <div v-if="[0].includes(i)" class="common">
              <!-- <ApiotSwitch
                v-model="$store.state.globalConfig.waterConfig[item.attr]"
                @change="(value) => changeRadio(value, item.attr)"
                inactivevalue="0"
              ></ApiotSwitch> -->
              <div v-if="!statement.enableWaterMask">
                {{
                  showValueName(
                    waterMaskTypeOptions,
                    $store.state.globalConfig.waterConfig[item.attr]
                  )
                }}
              </div>
              <apiot-select
                style="width: 224px"
                v-else
                v-model="$store.state.globalConfig.waterConfig[item.attr]"
                :options="waterMaskTypeOptions"
              ></apiot-select>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('enableWaterMask')"
              >
                {{ changeBtnName(statement.enableWaterMask) }}
              </apiot-button>
            </div>
            <!-- 水印使用范围 水印大小 水印类型 字体-->
            <div v-else-if="i === 1" class="common">
              <div v-if="!statement.waterMaskScope">
                {{
                  showValueName(
                    waterMaskScopeOptions,
                    $store.state.globalConfig.waterConfig[item.attr]
                  )
                }}
              </div>
              <apiot-select
                style="width: 224px"
                multiple
                collapse-tags
                v-else
                v-model="waterMaskScope"
                :options="waterMaskScopeOptions"
              ></apiot-select>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('waterMaskScope')"
              >
                {{ changeBtnName(statement.waterMaskScope) }}
              </apiot-button>
            </div>
            <!-- 水印位子 -->
            <div v-else-if="[2, 3, 4, 7, 9].includes(i)" class="common">
              <div v-if="!statement[item.state]">
                {{
                  showValueName(
                    optionsObj[item.options],
                    $store.state.globalConfig.waterConfig[item.attr]
                  )
                }}
              </div>
              <apiot-select
                style="width: 224px"
                v-else
                v-model="$store.state.globalConfig.waterConfig[item.attr]"
                :options="optionsObj[item.options]"
              ></apiot-select>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount(item.state)"
              >
                {{ changeBtnName(statement[item.state]) }}
              </apiot-button>
            </div>
            <!-- 文字内容 -->
            <div v-else-if="i === 5" class="common">
              <div v-if="!statement.text">
                {{ $store.state.globalConfig.waterConfig[item.attr] }}
              </div>

              <apiot-input
                style="width: 224px"
                v-model="$store.state.globalConfig.waterConfig[item.attr]"
                placeholder="请输入文字内容"
                v-else
              >
              </apiot-input>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('text')"
              >
                {{ changeBtnName(statement.text) }}
              </apiot-button>
            </div>
            <!-- 水印组合样式 -->
            <div v-else-if="i === 6" class="common">
              <div v-if="!statement.waterMaskStyle">
                {{
                  showValueName(
                    waterMaskStyleOptions1,
                    waterMaskStyle.join(',')
                  )
                }}
              </div>
              <el-cascader
                v-else
                style="width: 224px"
                separator=" "
                v-model="waterMaskStyle"
                :options="waterMaskStyleOptions"
                :props="{ expandTrigger: 'hover', checkStrictly: true }"
              ></el-cascader>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('waterMaskStyle')"
              >
                {{ changeBtnName(statement.waterMaskStyle) }}
              </apiot-button>
            </div>
            <!-- 文字颜色 -->
            <div v-else-if="i === 8" class="common">
              <div v-if="!statement.waterMaskColor">
                <div
                  :style="`width:30px;height:30px;background:${
                    $store.state.globalConfig.waterConfig[item.attr]
                  }`"
                ></div>
              </div>
              <el-color-picker
                v-model="$store.state.globalConfig.waterConfig[item.attr]"
                v-else
              ></el-color-picker>
              <apiot-button
                type="text"
                class="passwordConfig__operation"
                @click="handleChangeCount('waterMaskColor')"
              >
                {{ changeBtnName(statement.waterMaskColor) }}
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

export default {
  data() {
    return {
      loading: false,
      statement: {
        enableWaterMask: false,
        waterMaskScope: false,
        waterMaskLocation: false,
        waterMaskSize: false,
        waterMaskType: false,
        text: false,
        waterMaskStyle: false,
        waterMaskFont: false,
        waterMaskColor: false,
        waterMaskTransparency: false
      },
      waterMaskScope: [], // 水印使用范围
      waterMaskScopeOptions: [
        {
          name: '图片(jpg,jpeg,png)',
          value: '1'
        },
        {
          name: 'pdf',
          value: '2'
        },
        {
          name: 'doc，docx',
          value: '3'
        }
      ],
      waterMaskTypeOptions: [
        {
          name: '关闭',
          value: '0'
        },
        {
          name: '下载',
          value: '1'
        },
        {
          name: '上传',
          value: '2'
        }
      ],
      optionsObj: {
        waterMaskLocationOptions: [
          {
            name: '左上角',
            value: '1'
          },
          {
            name: '右上角',
            value: '2'
          },
          {
            name: '居中',
            value: '5'
          },
          {
            name: '左下角',
            value: '3'
          },
          {
            name: '右下角',
            value: '4'
          },
          {
            name: '平铺',
            value: '6'
          }
        ],
        waterMaskSizeOptions: [
          {
            name: '大',
            value: '3'
          },
          {
            name: '中',
            value: '2'
          },
          {
            name: '小',
            value: '1'
          }
        ],
        waterMaskTypeOptions: [{ name: '文字', value: '1' }],
        waterMaskFontOptions: [{ name: '微软雅黑', value: '1' }],
        waterMaskTransparencyOptions: [
          { name: '10%', value: '0.1f' },
          { name: '20%', value: '0.2f' },
          { name: '30%', value: '0.3f' },
          { name: '40%', value: '0.4f' },
          { name: '50%', value: '0.5f' },
          { name: '60%', value: '0.6f' },
          { name: '70%', value: '0.7f' },
          { name: '80%', value: '0.8f' },
          { name: '90%', value: '0.9f' },
          { name: '100%', value: '1f' }
        ]
      },
      waterMaskStyleOptions: [
        {
          value: '1',
          label: '文字内容',
          children: [
            {
              value: '2',
              label: '人员',
              children: [
                {
                  value: '3',
                  label: '日期时间'
                }
              ]
            },
            {
              value: '3',
              label: '日期时间',
              children: [
                {
                  value: '2',
                  label: '人员'
                }
              ]
            }
          ]
        },
        {
          value: '2',
          label: '人员',
          children: [
            {
              value: '1',
              label: '文字内容',
              children: [
                {
                  value: '3',
                  label: '日期时间'
                }
              ]
            },
            {
              value: '3',
              label: '日期时间',
              children: [
                {
                  value: '1',
                  label: '文字内容'
                }
              ]
            }
          ]
        },
        {
          value: '3',
          label: '日期时间',
          children: [
            {
              value: '2',
              label: '人员',
              children: [
                {
                  value: '1',
                  label: '文字内容'
                }
              ]
            },
            {
              value: '1',
              label: '文字内容',
              children: [
                {
                  value: '2',
                  label: '人员'
                }
              ]
            }
          ]
        }
      ],
      waterMaskStyleOptions1: [
        { name: '文字内容', value: '1' },
        { name: '人员', value: '2' },
        { name: '日期时间', value: '3' }
      ],
      waterMaskStyle: [],
      test: ''
    };
  },
  components: {},
  mounted() {
    this.waterMaskScope =
      this.$store.state.globalConfig.waterConfig.waterMaskScope &&
      this.$store.state.globalConfig.waterConfig.waterMaskScope.split(',');
    this.waterMaskStyle =
      this.$store.state.globalConfig.waterConfig.waterMaskStyle &&
      this.$store.state.globalConfig.waterConfig.waterMaskStyle.split(',');
  },
  computed: {
    loginImg() {
      const url = this.$store.state.globalConfig.waterConfig.homePageLogo;
      // eslint-disable-next-line max-len
      return url && url.substr(0, url.length - 1);
    },
    getValue() {
      // eslint-disable-next-line no-unused-vars
      return function (key) {
        return this.$store.state.globalConfig.waterConfig[key];
      };
    },
    // 左侧配置
    configArr() {
      return [
        {
          name: this.$t('globalConfig.enableWaterMask'),
          col: 12,
          attr: 'enableWaterMask'
        },
        {
          name: this.$t('globalConfig.waterMaskScope'),
          col: 12,
          attr: 'waterMaskScope'
        },
        {
          name: this.$t('globalConfig.waterMaskLocation'),
          col: 12,
          attr: 'waterMaskLocation',
          options: 'waterMaskLocationOptions',
          state: 'waterMaskLocation'
        },
        {
          name: this.$t('globalConfig.waterMaskSize'),
          col: 12,
          attr: 'waterMaskSize',
          options: 'waterMaskSizeOptions',
          state: 'waterMaskSize'
        },
        {
          name: this.$t('globalConfig.waterMaskType'),
          col: 12,
          attr: 'waterMaskType',
          options: 'waterMaskTypeOptions',
          state: 'waterMaskType'
        },
        {
          name: this.$t('globalConfig.text'),
          col: 12,
          attr: 'text'
        },
        // {
        //   name: this.$t('globalConfig.enableStaff'),
        //   col: 12,
        //   attr: 'enableStaff'
        // },
        // {
        //   name: this.$t('globalConfig.enableDate'),
        //   col: 12,
        //   attr: 'enableDate'
        // },
        {
          name: this.$t('globalConfig.waterMaskStyle'),
          col: 12,
          attr: 'waterMaskStyle'
        },
        {
          name: this.$t('globalConfig.waterMaskFont'),
          col: 12,
          attr: 'waterMaskFont',
          options: 'waterMaskFontOptions',
          state: 'waterMaskFont'
        },
        {
          name: this.$t('globalConfig.waterMaskColor'),
          col: 12,
          attr: 'waterMaskColor'
        },
        {
          name: this.$t('globalConfig.waterMaskTransparency'),
          col: 12,
          attr: 'waterMaskTransparency',
          options: 'waterMaskTransparencyOptions',
          state: 'waterMaskTransparency'
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
        // console.log(val);
        const valArr = val.split(',');
        if (valArr.length > 1) {
          const arr = [];
          options.forEach((item) => {
            if (valArr.includes(item.value)) {
              arr.push(item.name);
            }
          });
          return arr.join(',');
        }
        const obj = options.find((item) => item.value === val);
        return obj && obj.name;
      };
    }
  },
  methods: {
    async update(params) {
      // 通用修改
      try {
        await commonUpdate({ list: [params] });
        await this.$store.dispatch('fetchConfigFun', 'WATER_MASK');
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
      const arr = this.$store.state.globalConfig.waterConfigArr || [];
      const currentObj = arr.find((item) => item.attributeKey === key) || {};
      const params = {
        ...currentObj,
        attributeValue: value
      };
      await this.update(params);
    },
    async handleChangeCount(key) {
      if (!this.statement[key]) {
        this.statement[key] = !this.statement[key];
        return;
      }
      // 滑块显示设置
      if (['waterMaskScope', 'waterMaskStyle'].includes(key) && this.statement[key]) {
        await this.changeRadio(this[key].join(','), key);
      }
      if (
        [
          'enableWaterMask',
          'waterMaskLocation',
          'waterMaskSize',
          'text',
          'waterMaskFont',
          'waterMaskColor',
          'waterMaskTransparency'
        ].includes(key) &&
        this.statement[key]
      ) {
        await this.changeRadio(this.$store.state.globalConfig.waterConfig[key], key);
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
          await this.$store.dispatch('fetchConfigFun', 'WATER_MASK');
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
