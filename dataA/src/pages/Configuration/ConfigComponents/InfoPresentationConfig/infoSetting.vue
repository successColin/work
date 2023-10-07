/**
* @name: infoSetting
* @author: DELL
* @date: 2022/12/01 10:55
* @description：infoSetting
* @update: 2022/12/01 10:55
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
            :key="`${item.key ||i }`"
            :label="`项目${i + 1}`"
            :name="`${item.key}`"
        >
          <div>
            <div class="propsSetting">
              <p class="setTitle">宽度占比</p>
              <div>
                <c-select
                    :options="solidOptions"
                    :value="item.col"
                    @change="(value) => changeStyles(value, 'col', i, item)"
                >
                </c-select>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">字段</p>
              <div>
                <c-input
                    type="text"
                    :maxlength="36"
                    :value="item.field"
                    @Input-Change="(value) => changeStyles(value, 'field', i, item)"/>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">标签名称</p>
              <div>
                <c-input
                    type="text"
                    :maxlength="16"
                    :value="item.labelName"
                    @Input-Change="(value) => changeStyles(value, 'labelName', i, item)"/>
              </div>
            </div>
            <div class="propsSetting flex around">
              <p class="setTitle">是否显示</p>
              <el-switch
                  @click.stop.native
                  :value="item.isVisible"
                  @change="(value) => changeStyles(value, 'isVisible', i, item)"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
            <div class="propsSetting flex around">
              <p class="setTitle">值是否应用于图片</p>
              <el-switch
                  @click.stop.native
                  :value="item.isApplyToPictures"
                  @change="(value) => changeStyles(value, 'isApplyToPictures', i, item)"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>

            <div v-if="!item.isApplyToPictures">
              <div class="propsSetting">
                <p class="setTitle">默认显示</p>
                <div>
                  <c-input
                      type="text"
                      :maxlength="16"
                      :value="item.labelDefaultName"
                      @Input-Change="(value) => changeStyles(value, 'labelDefaultName', i, item)"/>
                </div>
              </div>
              <TextStylesConfig
                  title="标签样式"
                  title1="标签颜色"
                  fontFamily="微软雅黑"
                  :fontSize="11"
                  fontWeight="normal"
                  color="#FFF"
                  :fontFamilyValue="item.labelFontFamily"
                  :fontWeightValue="item.labelFontWeight"
                  :fontSizeValue="item.labelFontSize"
                  :colorValue="item.labelColor"
                  @change="({value,key}) => changeStyles(value, `label${key}`, i, item)"
              />
              <div class="propsSetting flex around">
                <p class="setTitle">是否允许编辑</p>
                <el-switch
                    @click.stop.native
                    :value="item.isEdit"
                    @change="(value) => changeStyles(value, 'isEdit', i, item)"
                    active-color="#4689F5"
                    inactive-color="#183472">
                </el-switch>
              </div>
              <div class="propsSetting flex around" v-if="!item.isEdit">
                <p class="setTitle">值是否超出省略</p>
                <el-switch
                    @click.stop.native
                    :value="item.isEllipsis"
                    @change="(value) => changeStyles(value, 'isEllipsis', i, item)"
                    active-color="#4689F5"
                    inactive-color="#183472">
                </el-switch>
              </div>
              <div class="propsSetting flex around" v-if="!item.isEdit">
                <p class="setTitle">值是否启用背景</p>
                <el-switch
                    @click.stop.native
                    :value="item.isNeedBg"
                    @change="(value) => changeStyles(value, 'isNeedBg', i, item)"
                    active-color="#4689F5"
                    inactive-color="#183472">
                </el-switch>
              </div>
              <div v-if="item.isNeedBg && !item.isEdit">
                <div class="propsSetting">
                  <p class="setTitle">背景颜色</p>
                  <div>
                    <c-color-picker
                        style="margin-right: 10px;"
                        size="small"
                        v-model="item.bgColor"
                        show-alpha
                        @change="(value) => changeStyles(value, 'bgColor', i, item)"
                        :predefine="predefineColors">
                    </c-color-picker>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">背景倒角</p>
                  <c-input
                      type="number"
                      :step="1"
                      :min="0"
                      :numberValue="item.borderRadius"
                      @Input-Change="(value) => changeStyles(value, 'borderRadius', i, item)"
                  ></c-input>
                </div>

              </div>
            </div>
            <!-- 图片配置 -->
            <div class="propsSetting" v-if="item.isApplyToPictures">
              <p class="setTitle">图片宽度</p>
              <c-input
                  type="number"
                  :step="1"
                  :min="40"
                  :numberValue="item.imgWidth"
                  @Input-Change="(value) => changeStyles(value, 'imgWidth', i, item)"
              ></c-input>
            </div>
            <div class="propsSetting" v-if="item.isApplyToPictures">
              <p class="setTitle">图片高度</p>
              <c-input
                  type="number"
                  :step="1"
                  :min="40"
                  :numberValue="item.imgHeight"
                  @Input-Change="(value) => changeStyles(value, 'imgHeight', i, item)"
              ></c-input>
            </div>
            <!-- 输入框编辑配置 -->
            <div v-if="item.isEdit">
              <div class="propsSetting">
                <p class="setTitle">输入框行数</p>
                <c-input
                    type="number"
                    :step="1"
                    :min="1"
                    :numberValue="item.editRows"
                    @Input-Change="(value) => changeStyles(value, 'editRows', i, item)"
                ></c-input>
              </div>
              <div class="propsSetting">
                <p class="setTitle">边框颜色</p>
                <div>
                  <c-color-picker
                      size="small"
                      v-model="item.editBorderColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'editBorderColor', i, item)"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">悬浮边框颜色</p>
                <div>
                  <c-color-picker
                      size="small"
                      v-model="item.editHoverBorderColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'editHoverBorderColor', i, item)"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">边框倒角</p>
                <c-input
                    type="number"
                    :step="1"
                    :min="0"
                    :numberValue="item.editBorderRadius"
                    @Input-Change="(value) => changeStyles(value, 'editBorderRadius', i, item)"
                ></c-input>
              </div>
              <div class="propsSetting">
                <p class="setTitle">背景颜色</p>
                <div>
                  <c-color-picker
                      size="small"
                      v-model="item.editBgColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'editBgColor', i, item)"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
              <TextStylesConfig
                  title="内容样式"
                  title1="内容字体颜色"
                  fontFamily="微软雅黑"
                  :fontFamilyValue="item.editFontFamily"
                  :fontWeightValue="item.editFontWeight"
                  :fontSizeValue="item.editFontSize"
                  :colorValue="item.editColor"
                  @change="({value,key}) => changeStyles(value, `edit${key}`, i, item)"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import TextStylesConfig from '@/pages/Configuration/ConfigComponents/TextStylesConfig';
import {predefineColors} from '@/constants/global'
import { createUnique } from '@/utils/utils';

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
        icon: 'icon-zuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'icon-youduiqi'
      }],
      sortOptions: [{
        label: '按数据排序',
        value: 'none'
      }, {
        label: '升序',
        value: 'ascending'
      }, {
        label: '降序',
        value: 'descending'
      }],
      orientOptions: [
        {
          label: '纵向',
          value: 'vertical'
        }, {
          label: '横向',
          value: 'horizontal'
        }
      ],
      alignOptions: [
        {
          label: '向左对齐',
          value: 'left'
        }, {
          label: '向右对齐',
          value: 'right'
        }, {
          label: '居中',
          value: 'center'
        }
      ],
      solidOptions: [
        {
          label: '1/1屏',
          value: 24
        }, {
          label: '1/2屏',
          value: 12
        }, {
          label: '1/3屏',
          value: 8
        }, {
          label: '1/4屏',
          value: 6
        }
      ]
    };
  },

  components: {
    TextStylesConfig
  },

  computed: {},
  watch: {},
  mounted() {
    if (this.value.length) {
      this.config = this.value.map((item) => {
        const { key = '', ...rest} = item;
        if (!key) {
          const lastKey = createUnique();
          return {
            ...rest,
            key: lastKey
          }
        }
        return item;
      })
      this.active = this.config[0].key;
    } else {
      this.config = [];
    }
    this.$nextTick(() => {
      this.rowDrop(); //行拖拽效果
    })
  },

  methods: {
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg,png,jpeg,svg 格式!');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 50kb!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    rowDrop() {
      const el = document.querySelector('.columnConfigWrap .el-tabs__nav');
      const _this = this;
      Sortable.create(el, {
        animation: 700,
        onEnd({newIndex, oldIndex}) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.config.splice(oldIndex, 1)[0];
          _this.config.splice(newIndex, 0, currRow);
        }
      })
    },
    removeTab(name) {
      const i = this.config.findIndex((item) => `${item.key}` === `${name}`)
      this.config.splice(i, 1);
      this.$emit('change', this.config);
      if (this.config.length) {
        const obj = this.config.at(-1);
        this.active = `${obj.key}`;
      }
    },
    addTab() {
      const key = createUnique();
      const obj = {
        key,
        col: 12,
        field: '',
        labelName: '',
        labelDefaultName: '默认项目',
        labelFontFamily: 'Arial,苹方,微软雅黑', //标签字体
        labelFontWeight: 'normal', //标签文字粗细
        labelFontSize: 16, // 标签文字大小
        labelColor: '#FFF', // 标签文字颜色
        isApplyToPictures: false, // 是否应用于图片
        imgWidth: 50, // 图片宽度
        imgHeight: 50, // 图片高度
        isNeedBg: false, // 是否需要背景色
        bgColor: 'rgba(31, 147, 255, 0.73)', // 背景色
        borderRadius: 5 // 背景倒角
      }
      this.config.push(obj)
      this.$emit('change', this.config);
      this.active = `${obj.key}`;
    },
    changeStyles(val, key, i, obj) {
      if (!Array.isArray(this.config)) {return;}
      const newObj = {
        ...obj,
        [key]: val
      }
      if (key === 'orient') {
        newObj.labelPosition = 'inside';
      }
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
              background: $component-borderFocus-color !important;
              border-color: $component-borderFocus-color !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 5px 15px;
            border-radius: 0;
            border-color: $component-border-color;
            background: $component-background-color;

            .iconfont {
              color: #FFFFFF;
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
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      text-align: left;
      opacity: .7;
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
          border-radius: 0;
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
  .ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
      color: #FFFFFF;
      opacity: .7;
    }

    .el-tabs__item.is-active {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
      padding-left: 15px;
      padding-right: 15px;
    }

    .el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
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
