/**
* @name: funnelSetting
* @author: DELL
* @date: 2022/10/11 10:55
* @description：funnelSetting
* @update: 2022/10/11 10:55
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
            :label="`${item.fieldName}`"
            :name="`${item.key}`"
        >
          <div>
            <div class="propsSetting">
              <p class="setTitle">图表宽度(%)</p>

              <div>
                <c-slider
                    v-model="item.width"
                    @change="(value) => changeStyles(value, 'width', i, item)"
                ></c-slider>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">图表高度(%)</p>
              <div>
                <c-slider
                    v-model="item.height"
                    @change="(value) => changeStyles(value, 'height', i, item)"
                ></c-slider>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">左边距(%)</p>
              <div>
                <c-slider
                    v-model="item.left"
                    @change="(value) => changeStyles(value, 'left', i, item)"
                ></c-slider>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">上边距(%)</p>
              <div>
                <c-slider
                    v-model="item.top"
                    @change="(value) => changeStyles(value, 'top', i, item)"
                ></c-slider>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">排序方式</p>
              <div>
                <c-select
                    :options="sortOptions"
                    :value="item.sort"
                    @change="(value) => changeStyles(value, 'sort', i, item)"
                >
                </c-select>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">漏斗图朝向</p>
              <div>
                <c-select
                    :options="orientOptions"
                    :value="item.orient"
                    @change="(value) => changeStyles(value, 'orient', i, item)"
                >
                </c-select>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">水平方向对齐布局类型</p>
              <div>
                <c-select
                    :options="alignOptions"
                    :value="item.funnelAlign"
                    @change="(value) => changeStyles(value, 'funnelAlign', i, item)"
                >
                </c-select>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">数据图形间距</p>
              <div>
                <el-input-number
                    controls-position="right"
                    :min="0"
                    :step="1"
                    v-model="item.gap"
                    @change="(value) => changeStyles(value, 'gap', i, item)"/>
<!--                <c-input-->
<!--                    type="number"-->
<!--                    :min="0"-->
<!--                    :step="1"-->
<!--                    :numberValue="item.gap"-->
<!--                    @Input-Change="(value) => changeStyles(value, 'gap', i, item)"-->
<!--                ></c-input>-->
              </div>
            </div>
            <div class="propsSetting flex around">
              <p class="setTitle">悬浮提示</p>
              <el-switch
                  @click.stop.native
                  :value="item.isShowTooltip "
                  @change="(value) => changeStyles(value, 'isShowTooltip', i, item)"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
            <div class="propsSetting flex around">
              <p class="setTitle">文本标签</p>
              <el-switch
                  @click.stop.native
                  :value="item.isShowLabel "
                  @change="(value) => changeStyles(value, 'isShowLabel', i, item)"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
            <TextStylesConfig
                v-if="item.isShowLabel"
                title="文本标签样式"
                title1="文本标签颜色"
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
            <div class="propsSetting" v-if="item.isShowLabel">
              <p class="setTitle">标签位置</p>
              <div>
                <c-select
                    :options="labelPositionOptions(item.orient)"
                    :value="item.labelPosition"
                    @change="(value) => changeStyles(value, 'labelPosition', i, item)"
                >
                </c-select>
              </div>
            </div>

            <div class="propsSetting">
              <p class="setTitle">图形边框颜色</p>
              <div>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="item.itemBorderColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'itemBorderColor', i, item)"
                    :predefine="predefineColors">
                </c-color-picker>
              </div>
            </div>

            <div class="propsSetting">
              <p class="setTitle">图形边框大小</p>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :step="1"
                  v-model="item.itemBorderWidth"
                  @change="(value) => changeStyles(value, 'itemBorderWidth', i, item)"/>
<!--              <c-input-->
<!--                  type="number"-->
<!--                  :min="0"-->
<!--                  :step="1"-->
<!--                  :numberValue="item.itemBorderWidth"-->
<!--                  @Input-Change="(value) => changeStyles(value, 'itemBorderWidth', i, item)"-->
<!--              ></c-input>-->
            </div>
            <div class="propsSetting">
              <p class="setTitle">图形边框类型</p>
              <div>
                <c-select
                    :options="solidOptions"
                    :value="item.itemBorderType"
                    @change="(value) => changeStyles(value, 'itemBorderType', i, item)"
                >
                </c-select>
              </div>
            </div>

            <div class="propsSetting">
              <p class="setTitle">图形阴影大小</p>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :step="1"
                  v-model="item.itemShadowBlur"
                  @change="(value) => changeStyles(value, 'itemShadowBlur', i, item)"/>
<!--              <c-input-->
<!--                  type="number"-->
<!--                  :min="0"-->
<!--                  :step="1"-->
<!--                  :numberValue="item.itemShadowBlur"-->
<!--                  @Input-Change="(value) => changeStyles(value, 'itemShadowBlur', i, item)"-->
<!--              ></c-input>-->
            </div>
            <div class="propsSetting">
              <p class="setTitle">图形阴影颜色</p>
              <div>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="item.itemShadowColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'itemShadowColor', i, item)"
                    :predefine="predefineColors">
                </c-color-picker>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">图形阴影水平方向偏移度</p>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :step="1"
                  v-model="item.itemShadowOffsetX"
                  @change="(value) => changeStyles(value, 'itemShadowOffsetX', i, item)"/>
            </div>
            <div class="propsSetting">
              <p class="setTitle">图形阴影垂直方向偏移度</p>
              <el-input-number
                  controls-position="right"
                  :step="1"
                  v-model="item.itemShadowOffsetY"
                  @change="(value) => changeStyles(value, 'itemShadowOffsetY', i, item)"/>
            </div>
            <div class="propsSetting">
              <p class="setTitle">图形透明度</p>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :max="1"
                  :step="0.1"
                  v-model="item.opacity"
                  @change="(value) => changeStyles(value, 'opacity', i, item)"/>
<!--              <c-input-->
<!--                  type="number"-->
<!--                  :min="0"-->
<!--                  :max="1"-->
<!--                  :step="0.1"-->
<!--                  :numberValue="item.opacity"-->
<!--                  @Input-Change="(value) => changeStyles(value, 'opacity', i, item)"-->
<!--              ></c-input>-->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { createUnique } from '_u/utils';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import { predefineColors } from '../../constants/global';

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
          label: '实线',
          value: 'solid'
        }, {
          label: '虚线',
          value: 'dashed'
        }, {
          label: '点线',
          value: 'dotted'
        }
      ]
    };
  },

  components: {
    TextStylesConfig
  },

  computed: {
    labelPositionOptions() {
      return function (type) {
        const obj = [
          {
            label: '漏斗图梯形内部',
            value: 'inside'
          },
          {
            label: '漏斗图梯形内部右侧',
            value: 'insideRight'
          },
          {
            label: '漏斗图梯形内部左侧',
            value: 'insideLeft'
          },
          {
            label: '漏斗图左侧上部',
            value: 'leftTop'
          },
          {
            label: '漏斗图左侧下部',
            value: 'leftBottom'
          },
          {
            label: '漏斗图右侧上部',
            value: 'rightTop'
          },
          {
            label: '漏斗图右侧下部',
            value: 'rightBottom'
          }
        ];
        const obj1 = [
          {
            label: '漏斗图左侧',
            value: 'left'
          },
          {
            label: '漏斗图右侧',
            value: 'right'
          }
        ];
        const obj2 = [
          {
            label: ' 漏斗图上侧',
            value: 'top'
          },
          {
            label: '漏斗图下侧',
            value: 'bottom'
          }
        ];
        if (type === 'vertical') {
          return [...obj1, ...obj];
        }
        if (type === 'horizontal') {
          return [...obj2, ...obj];
        }
        return obj;
      };
    }
  },
  watch: {},
  mounted() {
    // this.config = JSON.parse(JSON.stringify(this.value));
    // this.config = this.value;
    if (this.value.length) {
      this.config = this.value.map((item) => {
        const {
          key = '',
          ...rest
        } = item;
        if (!key) {
          const lastKey = createUnique();
          return {
            ...rest,
            key: lastKey
          };
        }
        return item;
      });
      this.active = this.config[0].key;
    } else {
      this.config = [];
    }
    // this.$nextTick(() => {
    //   this.rowDrop(); //行拖拽效果
    // })
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
          const currRow = _this.config.splice(oldIndex, 1)[0];
          _this.config.splice(newIndex, 0, currRow);
        }
      });
    },
    removeTab(name) {
      const i = this.config.findIndex((item) => `${item.key}` === `${name}`);
      this.config.splice(i, 1);
      this.$emit('change', this.config);
      if (this.config.length) {
        const obj = this.config.at(-1);
        this.active = `${obj.key}`;
      }
    },
    addTab() {
      const n = this.config.length;
      const key = createUnique();
      const obj = {
        key,
        width: 50, // 宽
        height: 50, // 高
        top: 0, // 上边距
        left: 0, // 左边距
        sort: 'descending', // 排序
        orient: 'vertical', // 漏斗图朝向
        funnelAlign: 'center',
        gap: 0, // 图形间距
        fieldName: `配置${n + 1}`,
        isShowLabel: true, // 是否显示文本标签
        isShowTooltip: true, // 是否显示悬浮提示
        labelFontFamily: '微软雅黑',
        labelFontWeight: 'normal',
        labelFontSize: 16,
        labelColor: '#fff',
        labelTextAlign: 'center',
        labelPosition: 'inside', // 标签位置

        itemBorderColor: '#000', // 图形的描边颜色
        itemBorderWidth: 0, // 图形的描边宽度
        itemBorderType: 'solid', // 描边类型
        itemShadowBlur: 0, // 图形阴影的模糊大小
        itemShadowColor: '', // 阴影颜色
        itemShadowOffsetX: 0, // 阴影水平方向上的偏移距离
        itemShadowOffsetY: 0, // 阴影垂直方向上的偏移距离
        opacity: 1 // 透明的
      };
      this.config.push(obj);
      this.$emit('change', this.config);
      this.active = `${obj.key}`;
    },
    changeStyles(val, key, i, obj) {
      if (!Array.isArray(this.config)) {
        return;
      }
      const newObj = {
        ...obj,
        [key]: val
      };
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
@import '../commonProperty';

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

    //.setTitle {
    //  display: inline-block;
    //  margin: 0;
    //  font-size: 14px;
    //  font-family: PingFangSC-Regular, PingFang SC;
    //  font-weight: 400;
    //  color: #FFFFFF;
    //  line-height: 30px;
    //  text-align: left;
    //  opacity: .7;
    //}
    //
    //.InputWrap {
    //  width: 100%;
    //  display: flex;
    //  margin-top: 5px;
    //  align-items: center;
    //  justify-content: space-between;
    //
    //  ::v-deep {
    //    .CInputWrap {
    //      width: 100%;
    //      display: flex;
    //      flex: 0 0 calc(50% - 8px);
    //      align-items: center;
    //
    //      .inputBox {
    //        width: 100px;
    //
    //        .el-input-number {
    //          width: 100px;
    //
    //          .el-input__inner {
    //            padding-left: 15px;
    //            padding-right: 20px;
    //          }
    //
    //          .el-input-number__decrease, .el-input-number__increase {
    //            width: 20px;
    //          }
    //        }
    //      }
    //    }
    //  }
    //}
    //
    //.wrap {
    //  display: flex;
    //  text-align: left;
    //  align-items: center;
    //  line-height: 35px;
    //
    //  & > span {
    //    margin-right: 10px;
    //    color: #ffffff;
    //    font-size: 14px;
    //  }
    //}

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
      color: #333333;
      //opacity: .7;
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
