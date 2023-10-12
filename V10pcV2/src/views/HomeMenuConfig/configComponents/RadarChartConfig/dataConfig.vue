/**
* @name: dataConfig
* @author: DELL
* @date: 2021/11/29 15:56
* @description：dataConfig
* @update: 2021/11/29 15:56
*/
<!-- 页面 -->
<template>
  <div class="dataWrap">
    <el-collapse accordion v-model="activeName">
      <el-collapse-item :name="1">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">静态数据</div>
            <div class="switchWrap">
              <el-switch
                  :value="getComponentInfo.dataType===1"
                  @change="() => changeTitle(1, 'dataType')"
                  @click.stop.native
                  active-color="#4689F5"
                  inactive-color="#DCDFE9">
              </el-switch>
            </div>
          </div>
        </template>
        <div class="staticContent">
          <JsonEditor
              @blur="(value) => changeStyles(value, 'staticValue', 'dataConfig')"
              ref="JsonEditor"
              v-if="activeName===1"
              v-model="getComponentInfo.dataConfig.staticValue"/>
        </div>
      </el-collapse-item>
      <el-collapse-item :name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">SQL获取</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.dataType===3"
                  @change="(value) => changeTitle(value ? 3:1, 'dataType')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE9">
              </el-switch>
            </div>
          </div>
        </template>
        <div class="apiContent">
          <div class="propsSetting">
            <p class="setTitle">SQL</p>
            <SQLEditor
                v-if="activeName===3"
                @blur="(value) => changeStyles(value, 'SQL', 'SqlDataConfig')"
                v-model="getComponentInfo.SqlDataConfig.SQL"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">变量管理</span>
            <el-switch
                :value="getComponentInfo.SqlDataConfig.enableDataManage"
                @change="(value) => changeStyles(value, 'enableDataManage', 'SqlDataConfig')"
                active-color="#4689F5"
                inactive-color="#DCDFE9">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.SqlDataConfig.enableDataManage">
            <VariableManage
                :value="getComponentInfo.SqlDataConfig.variableConfig"
                @change="(value) => changeStyles(value, 'variableConfig', 'SqlDataConfig')"
            ></VariableManage>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">数据过滤器</span>
            <el-switch
                :value="getComponentInfo.SqlDataConfig.enableSQLFilter"
                @change="(value) => changeStyles(value, 'enableSQLFilter', 'SqlDataConfig')"
                active-color="#4689F5"
                inactive-color="#DCDFE9">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.SqlDataConfig.enableSQLFilter">
            <data-filter
                :activeComponent="activeComponent"
                v-model="getComponentInfo.SqlDataConfig.SQLDataFilterId"
                :response="getComponentInfo.SqlDataConfig.SQLResponse"
                @change="(obj) => changeStyles(obj, 'SQLDataFilterId', 'SqlDataConfig') "
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">响应结果（只读）</p>
            <JsonEditor
                v-if="activeName===3"
                :config="apiResponse"
                v-model="getComponentInfo.SqlDataConfig.SQLFilterResponse"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否自动更新</span>
            <el-switch
                :value="getComponentInfo.SqlDataConfig.enableSQLAutoUpdate"
                @change="(value) => changeStyles(value, 'enableSQLAutoUpdate', 'SqlDataConfig')"
                active-color="#4689F5"
                inactive-color="#DCDFE9">
            </el-switch>
          </div>
          <div class="propsSetting">
            <p class="setTitle">间隔时间(秒)</p>
            <el-input-number
                controls-position="right"
                :min="0"
                :value="getComponentInfo.SqlDataConfig.SQLUpdateTime"
                placeholder="自动更新间隔时长"
                @change="(value) => changeStyles(Number(value), 'SQLUpdateTime', 'SqlDataConfig')"
            >
            </el-input-number>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { requestOptions } from '../../constants/global';
import JsonEditor from '../JsonEditor/index';
import SQLEditor from '../SQLEditor/index';
import { changeDataConfig } from '../../constants/common';

export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  data() {
    return {
      apiResponse: {
        readOnly: true
      },
      activeName: 1,
      apiTypeOptions: [{
        label: '直连',
        value: 1
      }, {
        label: '代理',
        value: 2
      }],
      requestOptions
    };
  },

  components: {
    JsonEditor,
    SQLEditor
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) { return {}; }
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
      return Obj;
    },
    getList() {
      return this.list;
    },
    fieldOptions() {
      const { staticValue } = this.getComponentInfo.dataConfig;
      const obj = JSON.parse(staticValue);
      return Object.keys(obj).map((label) => ({
        label,
        value: label
      }));
    }
  },

  mounted() {
    this.activeName = this.getComponentInfo.dataType;
  },

  methods: {
    reduceIndex() {
      const { componentId } = this.activeComponent;
      if (!componentId) { return -1; }
      const index = this.getList.findIndex((item) => item.componentId === componentId);
      return index;
    },
    changeTitle(value, key) {
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;

      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    async changeStyles(value, key, objKey) { // 样式修改
      const info = JSON.parse(JSON.stringify(this.getComponentInfo));
      // eslint-disable-next-line max-len
      const newOObj = await changeDataConfig({ info, value, key, objKey, dataSourceId: this.$route.query.dataId });
      const list = [...this.getList];
      const index = this.reduceIndex();
      // const info = this.getComponentInfo;
      // let dataConfig = info[objKey] || {};
      // const list = [...this.getList];
      // const index = this.reduceIndex();
      const newInfo = {
        ...info,
        [objKey]: newOObj
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    }
  },
  name: 'dataConfig'
};
</script>

<style lang='scss' scoped>
@import '../commonProperty';

.dataWrap {
  margin: 0 20px;

  .staticContent {
    height: 300px;
  }

  .propsSetting {
    margin-bottom: 10px;
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

  .bgSettingWrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .switchWrap {
      margin-right: 10px;

      ::v-deep {
        .el-switch__core {
          width: 28px !important;
          height: 14px;
        }

        .el-switch__core:after {
          content: "";
          position: absolute;
          top: 2px;
          left: 4px;
          border-radius: 100%;
          transition: all .3s;
          width: 8px;
          height: 8px;
          background-color: #FFF;
        }

        .el-switch.is-checked .el-switch__core::after {
          left: 100%;
          margin-left: -11px;
        }
      }
    }
  }

  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
