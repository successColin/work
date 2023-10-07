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
          type="card"
      >
        <el-tab-pane
            v-for="(item, i) in config"
            :key="item.value"
            :label="item.label"
            :name="item.label"
        >
          <div>
            <div class="propsSetting">
              <span class="setTitle">模型数据标识符值</span>
              <c-input
                  type="text"
                  :maxlength="16"
                  :value="item.identifierValue"
                  @Input-Change="(value) => changeStyles(value, 'identifierValue', i, item)"/>
            </div>
            <div class="propsSetting">
              <span class="setTitle">交互方式</span>
              <div>
                <el-radio-group
                    class="radioGroup"
                    size="mini"
                    v-model="item.interactionMode"
                    @change="(value) => changeStyles(value, 'interactionMode', i, item)"
                >
                  <el-radio-button :label="1">无</el-radio-button>
                  <el-radio-button :label="2">弹框</el-radio-button>
                  <el-radio-button :label="3">链接</el-radio-button>
                  <el-radio-button :label="4">联动</el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <!--2-->
            <div
                class="ellipsisWrap flex propsSetting"
                v-if="item.interactionMode===2"
            >
              <div class="InputWrap">
                <c-input
                    lable="宽:"
                    type="number"
                    :numberValue="item.clickBulletWidth"
                    @Input-Change="(value) => changeStyles(Number(value), 'clickBulletWidth',i, item)"/>
                <c-input
                    lable="高:"
                    type="number"
                    :numberValue="item.clickBulletHeight"
                    @Input-Change="(value) => changeStyles(Number(value), 'clickBulletHeight',i, item)"/>
              </div>
            </div>
            <div
                class="propsSetting"
                v-if="item.interactionMode===2"
            >
              <p class="setTitle">弹框地址
                <el-tooltip
                    class="item"
                    effect="dark"
                    content='链接带参数，例如: http://47.110.141.124/dataA/menu/124?name=${name}'
                    placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </p>
              <c-input
                  type="text"
                  :value="item.clickBulletUrl"
                  @Input-Change="(value) => changeStyles(value, 'clickBulletUrl',i, item)"
              />
            </div>
            <!--3-->
            <div
                class="propsSetting"
                v-if="item.interactionMode===3"
            >
              <p class="setTitle">超链接
                <el-tooltip
                    class="item"
                    effect="dark"
                    content='链接带参数，例如: http://47.110.141.124/dataA/menu/124?name={name}'
                    placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </p>
              <c-input
                  type="text"
                  :value="item.url"
                  @Input-Change="(value) => changeStyles(value, 'url', i, item)"
              />
            </div>
            <div
                class="ellipsisWrap flex propsSetting"
                v-if="item.interactionMode===3"
            >
              <span class="setTitle">是否打开新窗口</span>
              <el-switch
                  :value="item.enableOpenNewWindow"
                  @change="(value) => changeStyles(value, 'enableOpenNewWindow', i, item)"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
            <!--4-->
            <div
                v-if="item.interactionMode===4"
                class="propsSetting"
            >
              <p class="setTitle">关联更新图表</p>
              <div>
                <c-select
                    multiple
                    collapse-tags
                    filterable
                    :options="allComponentOptions"
                    :value="item.updateChart"
                    @change="(value) => changeStyles(value, 'updateChart', i, item)"
                ></c-select>
              </div>
            </div>
            <div
                v-if="item.interactionMode===4"
                class="propsSetting">
              <p class="setTitle">传参字段设置</p>
              <div>
                <paramsFieldsConfig
                    :value="item.paramsFieldsConfig"
                    @change="(value) => changeStyles(value, 'paramsFieldsConfig',  i, item)"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
const paramsFieldsConfig = () => import('../../NationalProvinceMapConfig/Components/paramsFieldsConfig');

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      config: [],
      active: ''
    };
  },

  components: {
    paramsFieldsConfig
  },

  computed: {
    getList() {
      return this.$store.getters.list;
    },
    allComponentOptions() {
      const list = this.getList.filter((item) => item.componentId !== this.activeComponent.componentId);
      return list.map((item) => {
        return {
          label: item.name,
          value: item.componentId
        }
      })
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v, o) {
        this.config = v;
        const vn = v.length;
        if (!o && !vn) {
          this.active = '';
          return
        }
        if (!o && vn) {
          this.active = v[0]?.label;
          return
        }
        const on = o.length;
        if (vn !== on ){
          this.active = v.at(-1)?.label;
        }
      }
    }
  },
  mounted() {
    // this.config = JSON.parse(JSON.stringify(this.value));
    // this.config = this.value;
    // if (this.value.length) {
    //   this.config = this.value;
    //   this.active = this.config[0].label;
    // } else {
    //   this.config = [];
    // }
  },

  methods: {
    changeStyles(val, key, i, obj) {
      if (!Array.isArray(this.config)) {return;}
      const newObj = {
        ...obj,
        [key]: val
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


    .radioGroup {
      width: 100%;
      display: flex;

      ::v-deep {
        .el-radio-button {
          width: calc(100% / 4);

          &.is-active {
            .el-radio-button__inner {
              background: $component-borderFocus-color !important;
              border-color: $component-borderFocus-color !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
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
