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
    <div class="conditionConfigWrap">
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
            :label="`条件${item.index+1}`"
            :name="`a_${i}`"
            lazy
        >
          <div>
            <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
              <span class="setTitle">条件</span>
              <el-switch
                  v-model="item.enableConditions"
                  @change="(value) => changeStyles(value, 'enableConditions', i, item)"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
            <div class="propsSetting" v-if="item.enableConditions">
              <p class="setTitle">颜色</p>
              <div>
                <c-color-picker
                    size="small"
                    v-model="item.fieldRelColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'fieldRelColor', i, item)"
                    :predefine="predefineColors">
                </c-color-picker>
              </div>
            </div>
            <div class="propsSetting" v-if="item.enableConditions">
              <p class="setTitle">文字前缀</p>
              <div style="height: 110px;">
                <c-upload
                    ref="cUpload"
                    :before-upload="beforeAvatarUpload"
                    @changeScreenBg="(value) => changeStyles(value, 'fieldRelImagesUrl', i, item)"
                    accept=".png,.jpg,.jpeg,.svg"
                    :url="item.fieldRelImagesUrl"
                >
                  <template v-slot:tip>
                    <div class="el-upload__tip">图片大小不超过50kb</div>
                  </template>
                </c-upload>
              </div>
            </div>

            <ConditiinDetails
                v-if="item.enableConditions"
                :value="item.config"
                @change="(value) => changeStyles(value, 'config', i, item)"
            ></ConditiinDetails>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { predefineColors } from '@/views/HomeMenuConfig/constants/global';
import ConditiinDetails from './Component/ConditionDetails/index';

const CUpload = () => import('@/views/HomeMenuConfig/basicWidgets/CUpload/index');

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
      predefineColors
    };
  },

  components: {
    ConditiinDetails,
    CUpload
  },

  computed: {},
  watch: {
    value: {
      deep: true,
      handler(v) {
        console.log(v);
        this.config = JSON.parse(JSON.stringify(v));
      }
    }
  },
  mounted() {
    this.config = JSON.parse(JSON.stringify(this.value));
    console.log(this.config);
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
      const el = document.querySelector('.conditionConfigWrap .el-tabs__nav');
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
        fieldRelColor: '#fff',
        enableConditions: true,
        fieldRelImagesUrl: '',
        config: {
          status: 2,
          list: []
        }
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
.conditionConfigWrap {
  .propsSetting {
    margin-bottom: 10px;

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

  .flex {
    display: flex;
  }
}
</style>
