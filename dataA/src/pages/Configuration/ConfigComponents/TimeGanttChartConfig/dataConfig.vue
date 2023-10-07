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
              v-model="getComponentInfo.dataConfig.staticValue"/>
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
                v-if="activeName===2"
                @blur="(value) => changeStyles(value, 'requestHeader', 'apiDataConfig')"
                v-model="getComponentInfo.apiDataConfig.requestHeader"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">参数</p>
            <JsonEditor
                v-if="activeName===2"
                @blur="(value) => changeStyles(value, 'requestParams', 'apiDataConfig')"
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
                  popper-class="sqlTooltip"
                  placement="top">
                <SQLTooltipText slot="content"></SQLTooltipText>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </p>
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
      <el-collapse-item :name="4" v-if="getComponentInfo.mqttDataConfig">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">MQTT获取</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.dataType===4"
                  @change="(value) => changeTitle(value ? 4:1, 'dataType')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div class="apiContent">
          <div class="propsSetting">
            <span class="setTitle">MQTT配置</span>
            <MQTT-filter
                :activeComponent="activeComponent"
                v-model="getComponentInfo.mqttDataConfig.mqttSourceId"
                @change="(obj) => changeStyles(obj, 'mqttSourceId', 'mqttDataConfig') "
            />
          </div>
          <div class="propsSetting">
            <span class="setTitle">订阅主题</span>
            <div>
              <c-input
                  type="text"
                  :maxlength="16"
                  :value="getComponentInfo.mqttDataConfig.topic"
                  @Input-Change="changeStyles1($event, 'topic', 'mqttDataConfig')"
                  @blur="(e) => changeStyles1(e.target.value, 'topic', 'mqttDataConfig')"/>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">数据过滤器</span>
            <el-switch
                :value="getComponentInfo.mqttDataConfig.enableMqttFilter"
                @change="(value) => changeStyles1(value, 'enableMqttFilter', 'mqttDataConfig')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.mqttDataConfig.enableMqttFilter">
            <data-filter
                :activeComponent="activeComponent"
                v-model="getComponentInfo.mqttDataConfig.mqttDataFilterId"
                :response="getComponentInfo.mqttDataConfig.mqttResponse"
                @change="(obj) => changeStyles(obj, 'mqttDataFilterId', 'mqttDataConfig') "
            />
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
import {requestOptions} from '@/constants/global';
import JsonEditor from '../JsonEditor/index';
import SQLEditor from '../SQLEditor/index';
import {changeDataConfig} from '@/utils/common';

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
    }
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
    },
    fieldOptions() {
      const staticValue = this.getComponentInfo.dataConfig.staticValue;
      const obj = JSON.parse(staticValue);
      return Object.keys(obj).map((label) => {
        return {
          label,
          value: label
        }
      });
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
    async changeStyles1(value, key, objKey) { // 样式修改
      const info = JSON.parse(JSON.stringify(this.getComponentInfo));
      const list = [...this.getList];
      const index = this.reduceIndex();
      const newOObj = {
        ...info[objKey],
        [key]: value
      }
      const newInfo = {
        ...info,
        [objKey]: newOObj
      };
      list.splice(index, 1, newInfo);
      await this.$store.dispatch('config/updateComponentList', list);
    },
    async changeStyles(value, key, objKey) { // 样式修改
      const info = JSON.parse(JSON.stringify(this.getComponentInfo));
      const newOObj = await changeDataConfig({info, value, key, objKey, dataSourceId: this.$route.query.dataId});
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
      padding: 5px 0;
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
