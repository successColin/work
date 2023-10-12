/**
* @name: inndex
* @author: DELL
* @date: 2021/9/14 14:21
* @description：inndex
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="contentWrap">
    <div class="config-property">
      <div class="form-item">
        <div class="form-item-label">选择触发源</div>
        <div class="form-item-content trigger-source">
          <el-select
            v-model="value"
            placeholder="请选择触发源"
            :class="{ prefixIcon: !value, showBg: value }"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            >
              <div>
                <span
                  class="iconfont icon-shujubiao"
                  style="
                    font-size: 24px;
                    margin-right: 4px;
                    color: #5a80ed;
                    vertical-align: sub;
                    font-weight: 400;
                  "
                ></span>
                <span>{{ item }}</span>
              </div>
            </el-option>
            <template v-slot:prefix>
              <span
                v-show="value"
                class="iconfont icon-shujubiao"
                style="
                  font-size: 18px;
                  width: 24px;
                  display: inline-block;
                  height: 24px;
                  line-height: 24px;
                "
              ></span>
            </template>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">触发方式</div>
        <div class="form-item-content">
          <apiot-radio v-model="radio" label="SAVEOREDIT"
            >当新增或更新记录时触发</apiot-radio
          ><br />
          <div class="select-field" v-if="radio === 'SAVEOREDIT'">
            <div class="form-item-label">
              触发字段
              <el-tooltip
                class="item"
                effect="dark"
                content="当以上指定的其中一个字段更新时将触发流程，如未指定则表示任何字段更新时都会触发"
                placement="top"
              >
                <span class="iconfont icon-bangzhu"></span>
              </el-tooltip>
            </div>
            <div>
              <el-select
                v-model="value1"
                multiple
                filterable
                placeholder="请选择触发字段"
              >
                <el-option
                  v-for="item in fieldOptions"
                  :key="item.columnName"
                  :label="item.memo"
                  :value="item.columnName"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <apiot-radio v-model="radio" label="ONLYSAVE"
            >仅新增记录时触发</apiot-radio
          >
          <br />
          <apiot-radio v-model="radio" label="ONLYEDIT"
            >仅更新记录时触发</apiot-radio
          >
          <br />
          <div class="select-field" v-if="radio === 'ONLYEDIT'">
            <div class="form-item-label">
              触发字段
              <el-tooltip
                class="item"
                effect="dark"
                content="当以上指定的其中一个字段更新时将触发流程，如未指定则表示任何字段更新时都会触发"
                placement="top"
              >
                <span class="iconfont icon-bangzhu"></span>
              </el-tooltip>
            </div>
            <div>
              <apiot-select
                v-model="value1"
                multiple
                filterable
                placeholder="请选择触发字段"
              >
                <el-option
                  v-for="item in fieldOptions"
                  :key="item.columnName"
                  :label="item.memo"
                  :value="item.columnName"
                >
                </el-option>
              </apiot-select>
            </div>
          </div>
          <apiot-radio v-model="radio" label="DELETE"
            >删除记录时触发</apiot-radio
          >
        </div>
      </div>
      <div>
        <apiot-button class="list-btn" @click="showDataFiltering">
          <i class="icon-shezhi iconfont"></i>
          设置筛选条件
        </apiot-button>
      </div>
    </div>
    <apiot-dialog
      :visible.sync="visible"
      title="设置筛选条件"
      @sure-click="handleSaveDataFiltering"
    >
      <ActionTerm
        ref="dataFiltering"
        :configData="configData"
        businessType="flow"
        :lambdaArr="lambdaArr"
        :value="termObj"
        :triggerCompMap="triggerCompMap"
      />
    </apiot-dialog>
  </div>
</template>

<script>
import { getFields } from '@/api/flow';
import { lambdaArr } from '@/config/index';
import ActionTerm from '../../../../../PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ActionTerm';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [],
      value: '', // 表
      value1: '', // 请选择触发字段
      radio: 'ONLYSAVE', // 触发方式
      fieldOptions: [], // 表字段
      visible: false, // 条件筛选弹框显示隐藏
      configData: [], // 页面配置信息
      lambdaArr,
      termObj: '' // 设置筛选条件的值
    };
  },

  components: {
    ActionTerm
  },

  computed: {
    // 获取所有的校验单位
    getAllcheck() {
      const obj = {};
      if (this.configData[0] && this.configData[0].children.length) {
        const compPath = `${this.configData[0].name}`;
        this.configData[0].children.forEach((bigArea) => {
          const bigPath = `${compPath}/${bigArea.name}`;
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj[tab.compId] = JSON.parse(JSON.stringify(tab));
              obj[tab.compId].compType = 'TAB';
              const tabPath = `${bigPath}/${tab.compId}`;
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                        obj[comp.compId].compPath = areaPath;
                      });
                    }
                  } else {
                    obj[area.compId] = JSON.parse(JSON.stringify(area));
                    obj[area.compId].compType = 'AREA';
                    const areaPath = `${tabPath}/${area.name}`;
                    if (area.children.length) {
                      area.children.forEach((smallArea) => {
                        if (smallArea.children) {
                          smallArea.children.forEach((comp) => {
                            obj[comp.compId] = JSON.parse(JSON.stringify(comp));
                            obj[comp.compId].compPath = areaPath;
                          });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
        // console.log(obj, 2);
        return obj;
      }
      // console.log(obj, 1);
      return obj;
    },
    triggerCompMap() {
      const curInfo = {};
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        curInfo[key] = {};
        curInfo[key].compName = this.getAllcheck[key].name;
        curInfo[key].compType = this.getAllcheck[key].compType;
        curInfo[key].compPath = this.getAllcheck[key].compPath;
      });
      return curInfo;
    }
  },

  mounted() {
    const configData = sessionStorage.getItem('configData');
    if (configData) {
      this.configData = JSON.parse(configData);
      this.getDataSource(this.configData);
    }
    if (JSON.stringify(this.nodeInfo) !== '{}') {
      this.$nextTick(() => {
        this.value = this.nodeInfo.tableName || '';
        this.radio = this.nodeInfo.triggerCond.type || 'ONLYSAVE';
        this.value1 = this.nodeInfo.triggerCond.fieldNames;
        this.termObj = this.nodeInfo.triggerPreCond ? this.nodeInfo.triggerPreCond : '';
      });
    }
  },
  watch: {
    radio: {
      immediate: true,
      deep: true,
      handler(v) {
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(v) && this.value) {
          this.getFieldList();
          return;
        }
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(v)) {
          if (!this.value) {
            this.$message.warning('请选择触发源');
          }
        }
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler() {
        if (['SAVEOREDIT', 'ONLYEDIT'].includes(this.radio) && this.value) {
          this.getFieldList();
        }
      }
    }
  },

  methods: {
    handleSaveDataFiltering() {
      const { termObj } = this.$refs.dataFiltering;
      this.visible = false;
      this.termObj = JSON.stringify(termObj);
    },
    showDataFiltering() {
      this.visible = true;
    },
    async getFieldList() {
      // 获取字段列表
      this.fieldOptions = await getFields({
        columnTypes: '',
        tableName: this.value
      });

      // console.log('获取');
    },
    getDataSource(obj) {
      // 获取页面配置的数据源
      const tableNameObj = []; // 表名集合
      const getTableName = (arr, targetObj) => {
        if (Array.isArray(arr) && arr.length) {
          arr.forEach((item) => {
            // eslint-disable-next-line no-prototype-builtins
            if (Object.prototype.hasOwnProperty.call(item, 'tableInfo')) {
              if (item.tableInfo.tableName) {
                const index = targetObj.findIndex((items) => items === item.tableInfo.tableName);
                if (index === -1) targetObj.push(item.tableInfo.tableName);
              }
            } else {
              getTableName(item.children, targetObj);
            }
          });
        }
      };
      getTableName(obj, tableNameObj);
      this.options = tableNameObj;
    }
  },
  name: 'inndex'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: auto;

  .config-property {
    padding: 10px 20px;
    box-sizing: border-box;

    .form-item {
      margin-bottom: 10px;

      .form-item-label {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        text-align: left;
      }

      .form-item-content {
        text-align: left;

        &.trigger-source {
          ::v-deep {
            .el-select {
              width: 100%;

              .el-input__suffix {
                display: none;
              }

              .el-input__prefix {
                box-sizing: border-box;
                background: #4689f5;
                color: #fff;
                position: absolute;
                height: calc(100% - 8px);
                left: 5px;
                top: 4px;
                text-align: center;
                transition: all 0.3s;
                bottom: 5px;
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
              }

              .el-input {
                display: block;
                position: relative;
                height: 32px;
              }

              .el-input__inner {
                border: 1px dashed #d9d9d9;

                &:hover {
                  border-color: #4689f5;
                }
              }
            }
          }

          .prefixIcon {
            ::v-deep {
              .el-input--prefix .el-input__inner {
                padding-left: 10px;
              }
            }
          }

          .showBg {
            ::v-deep {
              .el-input.el-input--prefix.el-input--suffix::after {
                content: '';
                position: absolute;
                background: #e5f0ff;
                width: calc(100% - 34px);
                height: 24px;
                left: 29px;
                top: 4px;
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
              }

              .el-input__inner {
                position: absolute;
                left: 0;
                padding-left: 34px;
                background: none;
                z-index: 1;
              }
            }
          }
        }

        ::v-deep {
          .el-radio {
            height: 30px;
            line-height: 30px;

            .el-radio__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

        .select-field {
          .icon-bangzhu {
            font-size: 13px;
            color: #aaaaaa;
            font-weight: normal;
            cursor: pointer;

            &:hover {
              color: #4689f5;
            }
          }

          ::v-deep {
            .el-select {
              width: 100%;
            }

            .el-input__inner {
              border: 1px solid #e9e9e9;
            }

            .el-select {
              .el-input__inner:hover {
                border-color: #c0c4cc;
              }
            }

            .el-input__suffix {
              display: none;
            }

            .el-input {
              height: auto;
            }

            .el-icon-close {
              background: none;
              color: #78a7e5;

              &:hover {
                color: #4689f5;
              }
            }
          }
        }
      }
    }

    .list-btn {
      width: 100%;

      .iconfont {
        margin-right: 5px;
        color: #4689f5;
      }
    }
  }

  ::v-deep {
    .el-dialog__header {
      text-align: left;
    }

    .formula__box--header {
      text-align: left;
    }

    .formula__box--main {
      text-align: left;
    }
  }
}
</style>
