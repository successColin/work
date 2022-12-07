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
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div class="staticContent">
          <JsonEditor
              @blur="(value) => changeStyles(value, 'staticValue', 'dataConfig')"
              ref="JsonEditor"
              v-if="activeName===1"
              :value="getComponentInfo.dataConfig.staticValue"/>
        </div>
      </el-collapse-item>
      <el-collapse-item :name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">接口获取</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.dataType===2"
                  @change="(value) => changeTitle(value ? 2:1, 'dataType')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div class="apiContent">
          <div class="propsSetting">
            <p class="setTitle">接口地址</p>
            <c-input
                type="text"
                v-model="getComponentInfo.apiDataConfig.apiUrl"
                placeholder="请输入接口地址"
                @change="(value) => changeStyles(value, 'apiUrl', 'apiDataConfig')"
            >
            </c-input>
          </div>
          <!--          <div class="propsSetting">-->
          <!--            <p class="setTitle">接口类型</p>-->
          <!--            <c-select-->
          <!--                :options="apiTypeOptions"-->
          <!--                :value="getComponentInfo.dataConfig.apiType"-->
          <!--                @change="(value) => changeStyles(value, 'apiType')"-->
          <!--            >-->
          <!--            </c-select>-->
          <!--          </div>-->
          <div class="propsSetting">
            <p class="setTitle">请求方式</p>
            <c-select
                :options="requestOptions"
                :value="getComponentInfo.apiDataConfig.requestType"
                @change="(value) => changeStyles(value, 'requestType', 'apiDataConfig')"
            >
            </c-select>
          </div>
          <div class="propsSetting">
            <p class="setTitle">请求Header</p>
            <JsonEditor
                @blur="(value) => changeStyles(value, 'requestHeader', 'apiDataConfig')"
                v-if="activeName===2"
                v-model="getComponentInfo.apiDataConfig.requestHeader"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">参数</p>
            <JsonEditor
                @blur="(value) => changeStyles(value, 'requestParams', 'apiDataConfig')"
                v-if="activeName===2"
                v-model="getComponentInfo.apiDataConfig.requestParams"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">数据过滤器</span>
            <el-switch
                :value="getComponentInfo.apiDataConfig.enableApiFilter"
                @change="(value) => changeStyles(value, 'enableApiFilter', 'apiDataConfig')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.apiDataConfig.enableApiFilter">
            <data-filter
                :activeComponent="activeComponent"
                v-model="getComponentInfo.apiDataConfig.apiDataFilterId"
                :response="getComponentInfo.apiDataConfig.apiResponse"
                @change="(obj) => changeStyles(obj, 'apiDataFilterId', 'apiDataConfig') "
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">响应结果（只读）</p>
            <JsonEditor
                v-if="activeName===2"
                :config="apiResponse"
                v-model="getComponentInfo.apiDataConfig.apiFilterResponse"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否自动更新</span>
            <el-switch
                :value="getComponentInfo.apiDataConfig.enableApiAutoUpdate"
                @change="(value) => changeStyles(value, 'enableApiAutoUpdate', 'apiDataConfig')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting">
            <p class="setTitle">间隔时间(秒)</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.apiDataConfig.apiUpdateTime"
                placeholder="自动更新间隔时长"
                @change="(value) => changeStyles(Number(value), 'apiUpdateTime', 'apiDataConfig')"
            >
            </c-input>
          </div>
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
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div class="apiContent">
          <div class="propsSetting">
            <p class="setTitle">SQL
              <el-tooltip
                  class="item"
                  effect="dark"
                  content='如果sql条件值是文字，请添加双引号，例如:select * from user where name="${name}"'
                  placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </p>
            <SQLEditor
                @blur="(value) => changeStyles(value, 'SQL', 'SqlDataConfig')"
                v-if="activeName===3"
                v-model="getComponentInfo.SqlDataConfig.SQL"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">变量管理</span>
            <el-switch
                :value="getComponentInfo.SqlDataConfig.enableDataManage"
                @change="(value) => changeStyles(value, 'enableDataManage', 'SqlDataConfig')"
                active-color="#4689F5"
                inactive-color="#183472">
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
                inactive-color="#183472">
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
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting">
            <p class="setTitle">间隔时间(秒)</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.SqlDataConfig.SQLUpdateTime"
                placeholder="自动更新间隔时长"
                @change="(value) => changeStyles(Number(value), 'SQLUpdateTime', 'SqlDataConfig')"
            >
            </c-input>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import {requestOptions} from '@/constants/global';
import {changeDataConfig} from '@/utils/common';
import JsonEditor from '../JsonEditor/index';
import SQLEditor from '../SQLEditor/index';
// import {dynamicGetData} from "@/services/design";

export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
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
      const {componentId} = this.activeComponent;
      if (!componentId) {return {};}
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return Obj;
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
    this.activeName = this.getComponentInfo.dataType;
  },

  methods: {
    reduceIndex() {
      const {componentId} = this.activeComponent;
      if (!componentId) {return -1;}
      const index = this.getList.findIndex((item) => {
        return item.componentId === componentId
      });
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
      this.$store.dispatch('config/updateComponentList', list);
    },
    async changeStyles(value, key, objKey) { // 样式修改
      const info = JSON.parse(JSON.stringify(this.getComponentInfo));
      const newOObj = await changeDataConfig({info, value, key, objKey, dataSourceId: this.$route.query.dataId});
      // let dataConfig = JSON.parse(JSON.stringify(info[objKey])) || {};
      // if (['apiDataFilterId', 'SQLDataFilterId'].includes(key) && ['apiDataConfig', 'SqlDataConfig'].includes(objKey)) {
      //   const {id, response, filterFun} = value;
      //   const isTrue = objKey === 'SqlDataConfig';
      //   dataConfig = {
      //     ...dataConfig,
      //     [key]: id,
      //     [isTrue ? 'SQLFilterResponse' : 'apiFilterResponse']: response,
      //     [isTrue ? 'SQLFilterFun' : 'apiFilterFun']: filterFun,
      //   }
      // }
      // // sql 或者apj 启用关闭数据过滤器
      // if (key === 'enableApiFilter' && value && objKey === 'apiDataConfig' && dataConfig.apiDataFilterId && dataConfig.apiFilterFun) {
      //   const fun = new Function(`'use strict';
      //             return ${dataConfig.apiFilterFun}`);
      //   const result = fun()(JSON.parse(dataConfig.apiResponse)) || '{}'
      //   dataConfig.apiFilterResponse = JSON.stringify(result);
      // } else if (key === 'enableApiFilter' && !value) { // 关闭api数据过滤器，数据还原
      //   dataConfig.apiFilterResponse = dataConfig.apiResponse;
      // } else if (key === 'enableSQLFilter' && !value) { // 关闭api数据过滤器，数据还原
      //   dataConfig.SQLFilterResponse = dataConfig.SQLResponse;
      // } else if (key === 'enableSQLFilter' && value && objKey === 'SqlDataConfig' && dataConfig.SQLDataFilterId && dataConfig.SQLFilterFun) {
      //   const fun = new Function(`'use strict';
      //             return ${dataConfig.SQLFilterFun}`);
      //   const result = fun()(JSON.parse(dataConfig.SQLResponse)) || '{}'
      //   dataConfig.SQLFilterResponse = JSON.stringify(result);
      // }
      // let newOObj = {};
      // if ((key !== 'apiDataFilterId' && objKey === "apiDataConfig") || (key !== 'SQLDataFilterId' && objKey === "SqlDataConfig")) {
      //   newOObj = {
      //     ...dataConfig,
      //     [key]: value,
      //     dataSourceId: this.$route.query.dataId
      //   };
      // } else {
      //   newOObj = {
      //     ...dataConfig,
      //     dataSourceId: this.$route.query.dataId
      //   };
      // }
      // if (objKey === 'apiDataConfig' && ['apiUrl', 'requestType', 'requestParams', 'requestHeader'].includes(key)) {
      //   const params = {
      //     dataJson: JSON.stringify(newOObj),
      //     dataType: 2
      //   }
      //   try {
      //     const data = await dynamicGetData(params);
      //     let res = data[0].response || '{}';
      //     try {
      //       JSON.parse(res);
      //     } catch (e) {
      //       res = JSON.stringify({
      //         isErr: true,
      //         message: res
      //       })
      //     }
      //     newOObj.apiResponse = res || '{}';
      //     newOObj.apiFilterResponse = res || '{}';
      //     const {apiDataFilterId, enableApiFilter, apiFilterFun} = newOObj;
      //     if (apiDataFilterId && enableApiFilter && apiFilterFun) {
      //       const fun = new Function(`return ${apiFilterFun}`);
      //       const result = fun()(JSON.parse(res));
      //       newOObj.apiFilterResponse = JSON.stringify(result) || '{}';
      //     }
      //   } catch (e) {
      //     const data = e.data;
      //     console.log(e);
      //     newOObj.apiResponse = JSON.stringify(data);
      //   }
      // }
      // if (objKey === 'SqlDataConfig' && key === 'SQL') {
      //   const params = {
      //     dataJson: JSON.stringify(newOObj),
      //     dataType: 3,
      //   }
      //   try {
      //     const data = await dynamicGetData(params);
      //     newOObj.SQLResponse = JSON.stringify(data) || '{}';
      //     newOObj.SQLFilterResponse = JSON.stringify(data) || '{}';
      //     const {SQLDataFilterId, enableSQLFilter, SQLFilterFun} = newOObj;
      //     if (SQLDataFilterId && enableSQLFilter && SQLFilterFun) {
      //       const fun = new Function(`return ${SQLFilterFun}`);
      //       const result = fun()(data);
      //       newOObj.SQLFilterResponse = JSON.stringify(result) || '{}';
      //     }
      //   } catch (e) {
      //     const data = e.data;
      //     console.log(e, 'errr');
      //     newOObj.SQLResponse = JSON.stringify(data);
      //   }
      // }

      const list = [...this.getList];
      const index = this.reduceIndex();
      const newInfo = {
        ...info,
        [objKey]: newOObj
      };
      list.splice(index, 1, newInfo);
      await this.$store.dispatch('config/updateComponentList', list);
    }
  },
  name: 'dataConfig'
};
</script>

<style lang='scss' scoped>
.dataWrap {
  margin: 0 20px;

  ::v-deep {
    .el-collapse {
      border: none;
    }

    .el-collapse-item__arrow {
      margin: 0 0px 0 auto;
    }

    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background-color: #131E45;
      color: #ffffff;
      font-weight: bold;
      border-bottom: none;

      &:hover {
        color: $component-borderFocus-color;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0;
      background-color: #131E45;

      & .propsSetting:last-child {
        margin-bottom: 10px;
      }
    }

    .el-collapse-item__wrap {
      background-color: #131E45;
      border: none;
    }
  }

  .staticContent {
    height: 300px;
  }

  .propsSetting {
    margin-bottom: 10px;

    .setTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      text-align: left;
      opacity: .7;
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
