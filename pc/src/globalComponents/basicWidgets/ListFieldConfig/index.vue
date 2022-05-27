/**
* @name: index
* @author: DELL
* @date: 2021/12/23 9:30
* @description：index
* @update: 2021/12/23 9:30
*/
<!-- 页面 -->
<template>
  <div>
    <div class="columnConfigWrap">
      <el-tabs
          v-model="active"
          :editable="true"
          type="card"
          closable
          @tab-remove="removeTab"
          @tab-add="addTab"
      >
        <el-tab-pane
            v-for="(item, i) in config"
            :key="`a_${i}`"
            :label="`列${item.index+1}`"
            :name="`a_${i}`"
            lazy
        >
          <div>
            <div class="propsSetting">
              <p class="setTitle">列字段名</p>
              <div>
                <apiot-input
                    type="text"
                    v-model="item.field"
                    @change="(value) => changeStyles(value, 'field', i, item)"
                ></apiot-input>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">列显示名</p>
              <div>
                <apiot-input
                    v-model="item.fieldName"
                    @change="(value) => changeStyles(value, 'fieldName', i, item)"
                ></apiot-input>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">列宽占比(%)</p>
              <div>
                <c-slider
                    v-model="item.fieldWidth"
                    @change="(value) => changeStyles(value, 'fieldWidth', i, item)"
                ></c-slider>
              </div>
            </div>
            <div class="propsSetting flex around">
              <p class="setTitle">是否应用于图片</p>
              <el-switch
                  @click.stop.native
                  :value="item.isApplyPicture"
                  @change="(value) => changeStyles(value, 'isApplyPicture', i, item)"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
            <TextStylesConfig
                v-if="!item.isApplyPicture"
                title="字体样式"
                title1="字体颜色"
                fontFamily="微软雅黑"
                :fontSize="11"
                fontWeight="normal"
                color="#FFF"
                :fontFamilyValue="item.fieldFontFamily"
                :fontWeightValue="item.fieldFontWeight"
                :fontSizeValue="item.fieldFontSize"
                :colorValue="item.fieldColor"
                @change="({value,key}) => changeStyles(value, `field${key}`, i, item)"
            />
            <div class="propsSetting">
              <p class="setTitle">字体对齐方式</p>
              <el-radio-group
                  class="alignWrap"
                  v-model="item.fieldTextAlign"
                  size="mini"
                  @change="(value) => changeStyles(value, 'fieldTextAlign', i, item)"
              >
                <el-radio-button
                    :label="items.value"
                    v-for="items in options"
                    :key="items.value"
                >
                  <span class="iconfont" :class="{[items.icon]:true}"></span>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="propsSetting" v-if="!item.isApplyPicture">
              <p class="setTitle">文字前缀</p>
              <div style="height: 110px;">
                <c-upload
                    ref="cUpload"
                    :before-upload="beforeAvatarUpload"
                    @changeScreenBg="(value) => changeStyles(value, 'fieldPrefix', i, item)"
                    accept=".png,.jpg,.jpeg,.svg"
                    :url="item.fieldPrefix"
                >
                  <template v-slot:tip>
                    <div class="el-upload__tip">图片大小不超过50kb</div>
                  </template>
                </c-upload>
              </div>
            </div>
            <div class="propsSetting" v-if="!item.isApplyPicture && item.fieldPrefix">
              <p class="setTitle">文字前缀宽度</p>
              <div>
                <el-input-number
                    controls-position="right"
                    :min="0"
                    v-model="item.fieldPrefixWidth"
                    @change="(value) => changeStyles(value, 'fieldPrefixWidth', i, item)"/>
              </div>
            </div>
            <div class="propsSetting" v-if="!item.isApplyPicture && item.fieldPrefix">
              <p class="setTitle">文字前缀高度</p>
              <div>
                <el-input-number
                    controls-position="right"
                    :min="0"
                    v-model="item.fieldPrefixHeight"
                    @change="(value) => changeStyles(value, 'fieldPrefixHeight', i, item)"/>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">列条件</p>
              <condition-config
                  :value="item.conditionsArr"
                  @change="(value) => changeStyles(value, 'conditionsArr', i, item)"
              ></condition-config>
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { predefineColors } from '@/views/HomeMenuConfig/constants/global';
import CUpload from '@/views/HomeMenuConfig/basicWidgets/CUpload/index';

const TextStylesConfig = () => import('@/views/HomeMenuConfig/Layout/TextStylesConfig/index');

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      config: null,
      active: null,
      predefineColors,
      options: [{
        label: '左对齐',
        value: 'left',
        icon: 'icon-juzuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'icon-juyouduiqi'
      }]
    };
  },

  components: {
    TextStylesConfig,
    CUpload
  },

  computed: {},
  watch: {},
  mounted() {
    this.config = JSON.parse(JSON.stringify(this.value));
    if (this.config.length) {
      this.active = 'a_0';
    }
    this.$nextTick(() => {
      this.rowDrop(); // 行拖拽效果
    });
  },

  methods: {
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg,png,jpeg,svg 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 50kb!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
    rowDrop() {
      const el = document.querySelector('.columnConfigWrap .el-tabs__nav');
      const _this = this;
      Sortable.create(el, {
        animation: 700,
        onEnd({
          newIndex,
          oldIndex
        }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.config.splice(oldIndex, 1)[0]; // 鼠标拖拽当前的el-tabs-pane
          _this.config.splice(newIndex, 0, currRow); // tableData 是存放所以el-tabs-pane的数组
        }
      });
    },
    removeTab(name) {
      const i = +name.split('_')[1];
      this.config.splice(i, 1);
      this.$emit('change', this.config);
      this.active = `a_${this.config.length - 1}`;
    },
    addTab() {
      const n = this.config.length;
      this.config.push({
        index: n,
        name: 1,
        title: `列${n + 1}`,
        field: '',
        fieldWidth: 20,
        fieldName: '',
        fieldFontFamily: '微软雅黑',
        fieldFontWeight: 'normal',
        fieldFontSize: 16,
        fieldColor: '#fff',
        fieldTextAlign: 'center',
        enableConditions: false,
        conditionsArr: [], // 条件数组，二维数组，子数组对象，包括状态 并且---或者
        isApplyPicture: false // 是否应用与图片
      });
      this.$emit('change', this.config);
      this.active = `a_${this.config.length - 1}`;
    },
    changeStyles(val, key, i, obj) {
      const newObj = {
        ...obj,
        [key]: val
      };
      this.config.splice(i, 1, newObj);
      this.$emit('change', this.config);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.columnConfigWrap {
  .propsSetting {
    margin-bottom: 10px;

    .alignWrap {
      width: 100%;
      display: flex;

      ::v-deep {
        .el-radio-button {
          width: calc(100% / 3);

          &.is-active {
            .el-radio-button__inner {
              background: #E5F0FF !important;
              border-color: $component-borderFocus-color !important;
            }

            .iconfont {
              color: #4689f5 !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 5px 15px;
            border-color: $component-border-color;
            background: $component-background-color;

            .iconfont {
              color: #BBC3CD;
              font-size: 18px;
            }
          }

          .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background: $component-background-color;
          }
        }
      }
    }

    .setTitle {
      display: inline-block;
      margin: 0;
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 30px;
      color: #333333;
    }

    .InputWrap {
      width: 100%;
      display: flex;
      margin-top: 5px;
      align-items: center;
      justify-content: space-between;

      ::v-deep {
        .CInputWrap {
          width: 100%;
          display: flex;
          flex: 0 0 calc(50% - 8px);
          align-items: center;

          .inputBox {
            width: 100px;

            .el-input-number {
              width: 100px;

              .el-input__inner {
                padding-left: 15px;
                padding-right: 20px;
              }

              .el-input-number__decrease, .el-input-number__increase {
                width: 20px;
              }
            }
          }
        }
      }
    }

    .wrap {
      display: flex;
      text-align: left;
      align-items: center;
      line-height: 35px;

      & > span {
        margin-right: 10px;
        color: #ffffff;
        font-size: 14px;
      }
    }

    ::v-deep {
      .el-radio-button {
        width: 60px;

        &.is-active {
          .el-radio-button__inner {
            background: $component-borderFocus-color !important;
            border-color: $component-borderFocus-color !important;
          }
        }

        .el-radio-button__inner {
          width: 100%;
          padding: 8px 15px;
          font-size: 14px;
          color: #FFFFFF;
          opacity: .7;
          border-color: $component-border-color;
          background: $component-background-color;
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: $component-background-color;
          font-size: 14px;
          color: #FFFFFF;
          opacity: 1;
        }
      }
    }
  }

  .around {
    justify-content: space-between;
    align-items: center;
  }

  .flex {
    display: flex;
  }

  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;

    ::v-deep {
      .el-slider {
        width: 200px;
        margin: 0 auto;
      }
    }
  }

  ::v-deep {
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border: none;
    }

    .el-tabs--card > .el-tabs__header {
      border: none;
    }

    .el-tabs__item {
      padding: 0 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    .el-tabs__item.is-active {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
      padding-left: 15px;
      padding-right: 15px;
    }

    .el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
      padding-left: 15px;
    }

    .el-tabs__nav-next, .el-tabs__nav-prev {
      line-height: 40px;
      color: #FFFFFF;

      &:hover {
        color: #4689F5;
      }
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs__item .el-icon-close:hover {
      background: none;
      color: #4689F5;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
      top: -2px;
      right: 3px;
    }

    .el-tabs__new-tab {
      border: none;
      outline: none;
    }

    .el-tabs__header {
      margin: 0;
    }
  }
}
</style>
