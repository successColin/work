/**
* @name: inndex
* @author: DELL
* @date: 2021/9/14 14:21
* @description：inndex
* @update: 2021/9/14 14:21
*/
<!-- 页面 -->
<template>
  <div class="contentWrap" :key="key">
    <div class="config-property">
<!--      <div class="form-item">-->
<!--        <div class="form-item-label">请求类型</div>-->
<!--        <div class="form-item-content">-->
<!--          <el-radio v-model="requestMethod" label="GET">GET</el-radio>-->
<!--          <el-radio v-model="requestMethod" label="POST">POST</el-radio>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="form-item">-->
<!--        <div class="form-item-label">URL</div>-->
<!--        <div class="form-item-content">-->
<!--          <el-input-->
<!--              v-model="requestUrl"-->
<!--              plcaeholder="请输入请求地址"-->
<!--          ></el-input>-->
<!--        </div>-->
<!--      </div>-->
      <div class="form-item">
        <div class="form-item-label">代理接口编码</div>
        <div class="form-item-content">
<!--          <el-input-->
<!--            v-model="apiCode"-->
<!--            plcaeholder="请输入代理接口编码"-->
<!--          ></el-input>-->
          <el-select
              style="width: 100%;"
              v-model="apiCode"
              filterable
              plcaeholder="请选择代理接口"
              @change="choose"
          >
            <el-option
                v-for="item in apiList"
                :key="item.businessCode"
                :label="item.businessName"
                :value="item.businessCode"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">
          参数设置
<!--          <apiot-button class="headers-add" @click="addHeader">-->
<!--            <i class="icon-xinzeng common-style_fontColor iconfont m-r-4"></i>-->
<!--            新增参数-->
<!--          </apiot-button>-->
        </div>
        <div class="form-item-content">
          <SetHeaders :value="params" @deleteHeader="doDel" />
        </div>
<!--        <div class="form-item-content">-->
<!--          <SetHeaders :value="requestHeadersList" @deleteHeader="doDel" />-->
<!--        </div>-->
      </div>
<!--     <div class="form-item" v-if="requestMethod === 'POST'">-->
<!--        <div class="form-item-label">-->
<!--          Body-->
<!--          <apiot-button class="headers-add" @click="showCompTree = true">-->
<!--            <i class="icon-xinzeng common-style_fontColor iconfont m-r-4"></i>-->
<!--            添加控件-->
<!--          </apiot-button>-->
<!--        </div>-->
<!--        <div class="form-item-content">-->
<!--          <json-editor-->
<!--            v-if="requestMethod === 'POST'"-->
<!--            v-model="requestParameter"-->
<!--            :triggerCompMap="triggerCompMap"-->
<!--            ref="jsonEditor"-->
<!--          ></json-editor>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div>-->
<!--        <apiot-button class="list-btn" @click="showReturnValue = true">-->
<!--          <i class="icon-shezhi iconfont"></i>-->
<!--          设置返回值-->
<!--        </apiot-button>-->
<!--      </div>-->
      <transition name="slide-bottom">
        <comp-tree
          :visible.sync="showCompTree"
          v-if="showCompTree"
          :configData="configData"
          @getSelectComp="getSelectComp"
          :triggerComp="triggerComp"
        ></comp-tree>
      </transition>
      <transition name="slide-bottom">
        <return-value
          :visible.sync="showReturnValue"
          v-if="showReturnValue"
          :triggerCompMap="triggerCompMap"
          :triggerComp="triggerComp"
          :configData="configData"
          v-model="returnValue"
        ></return-value>
      </transition>
    </div>
  </div>
</template>

<script>
import { fetchApiList } from '@/api/flow';
import CompTree from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/CompTree';
import ReturnValue from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ReturnValue';
// eslint-disable-next-line max-len
// import JsonEditor from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/JsonEditor';
import SetHeaders from './SetHeaders';

export default {
  props: {
    nodeInfo: {
      // 节点流程配置信息
      type: Object,
      default: () => {}
    },
    // 当前触发控件
    triggerComp: {
      type: Object
    }
  },
  data() {
    return {
      key: 0,
      showCompTree: false,
      showReturnValue: false,
      configData: {},
      requestMethod: 'GET',
      requestUrl: '',
      requestHeadersList: [],
      params: [],
      requestParameter: '{}',
      returnValue: '',
      apiCode: '',
      apiList: [],
      name: ''
    };
  },

  components: {
    SetHeaders,
    CompTree,
    // JsonEditor,
    ReturnValue
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
        return obj;
      }
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
    this.initList();
  },
  watch: {
    nodeInfo: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      }
    }
  },

  methods: {
    async initList() {
      this.apiList = await fetchApiList();
    },
    init() {
      if (this.nodeInfo && JSON.stringify(this.nodeInfo) !== '{}') {
        this.$nextTick(() => {
          this.requestMethod = this.nodeInfo.requestMethod || 'GET';
          this.requestUrl = this.nodeInfo.requestUrl || '';
          this.requestHeadersList = this.nodeInfo.requestHeadersList || [];
          this.params = this.nodeInfo.params || [];
          this.returnValue = this.nodeInfo.returnValue || '';
          this.requestParameter = this.nodeInfo.requestParameter || '{}';
          this.apiCode = this.nodeInfo.apiCode || '';
          this.name = this.nodeInfo.name || '';
        });
      } else {
        this.requestMethod = 'GET';
        this.requestUrl = '';
        this.requestHeadersList = [];
        this.params = [];
        this.returnValue = '';
        this.requestParameter = '{}';
        this.apiCode = '';
        this.name = '';
      }
      this.key += 1;
    },
    addHeader() {
      // 添加请求参数
      const uuid = `${Date.parse(new Date())}${Math.random() * 100}`;
      // this.requestHeadersList.unshift({
      //   uuid,
      //   name: '',
      //   valueType: 1,
      //   content: ''
      // });
      this.params.unshift({
        uuid,
        name: '',
        valueType: 1,
        content: ''
      });
    },
    choose(v) {
      const current = this.apiList.find((item) => item.businessCode === v);
      if (!current) return;
      const { params = [], businessName = '' } = current;
      this.name = businessName;
      this.params = params.map(({ code, comment }) => {
        const uuid = `${Date.parse(new Date())}${Math.random() * 100}`;
        return {
          uuid,
          name: code,
          showName: comment,
          valueType: 1,
          content: ''
        };
      });
    },
    doDel(index) {
      // this.requestHeadersList.splice(index, 1);
      this.params.splice(index, 1);
    },
    getSelectComp(comp) {
      this.$refs.jsonEditor.setValue(comp);
    }
  },
  name: 'WebHook'
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
        position: relative;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        text-align: left;

        .headers-add {
          position: absolute;
          right: 0;
        }
      }

      .form-item-content {
        text-align: left;
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
