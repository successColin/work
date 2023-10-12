/**
* @name: respondTab
* @author: DELL
* @date: 2023/2/23 19:21
* @description：respondTab
* @update: 2023/2/23 19:21
*/
<!-- 页面 -->
<template>
  <div class="respond">
    <div class="respond__content">
      <div class="respond__message">
        <div class="respond__message--left">
          <div class="step__outer">
            <div class="step__inner">1</div>
          </div>
        </div>
        <div class="respond__message--right">
          <Card>
            <template v-slot:title>
              <div class="respond__message--header">
                <span>响应报文</span>
                <apiot-button
                    type="primary"
                    :loading="loading"
                    @click.prevent.stop="doSend"
                >模拟请求</apiot-button>
              </div>
            </template>
            <JsonEdit
                readonly="nocursor"
                :value="respondMessage"
                ref="resMsg"
            />
          </Card>
        </div>
      </div>
      <div class="respond__message m-t-10">
        <div class="respond__message--left">
          <div class="step__outer">
            <div class="step__inner">2</div>
          </div>
        </div>
        <div class="respond__message--right">
          <Card>
            <template v-slot:title>
              <span>解析设置</span>
            </template>
            <div class="respond__message--analysis">
              <el-form
                  label-position="top"
                  :model="analysisData"
                  :rules="rules"
                  label-width="80px"
                  class="m-t-10"
              >
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item
                        label="状态"
                        prop="returnCode">
                      <apiot-input v-model="analysisData.returnCode" placeholder="请输入内容"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="成功时" prop="successFlag">
                      <apiot-input
                          v-model="analysisData.successFlag"
                          placeholder="请输入内容"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                        label="说明"
                        prop="returnMsg"
                    >
                      <apiot-input
                          :isForbid="false"
                          placeholder="请输入内容"
                          v-model="analysisData.returnMsg"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="数据" prop="returnDataPath">
                      <apiot-input
                          :isForbid="false"
                          placeholder="请输入内容"
                          v-model="analysisData.returnDataPath"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </Card>
        </div>
      </div>
      <div class="respond__message m-t-10">
        <div class="respond__message--left">
          <div class="step__outer">
            <div class="step__inner">3</div>
          </div>
        </div>
        <div class="respond__message--right">
          <Card>
            <template v-slot:title>
              <span>数据处理</span>
            </template>
            <div class="dataProcess">
              <div class="dataProcess_choose">
                <el-radio-group v-model="info.commonApiHeader.dataProcess">
                  <apiot-radio :label="0">不处理</apiot-radio>
                  <apiot-radio :label="1">同步到表</apiot-radio>
                </el-radio-group>
              </div>
              <el-tabs
                  :lazy="true"
                  v-model="activeName"
                  v-if="info.commonApiHeader.dataProcess===1">
                <el-tab-pane label="过滤" name="first">
                  <DataFilter
                      @change="changeDataFilterValue"
                      :fieldArr="fieldArr"
                      :value="dataFilterValue"/>
                </el-tab-pane>
                <el-tab-pane label="同步配置" name="second">
                  <Synchronism :fieldArr="fieldArr" :info="info"/>
                </el-tab-pane>
                <el-tab-pane label="后处理" name="third">功能设计中</el-tab-pane>
              </el-tabs>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendRequest } from '@/api/proxy';
import Card from './collapseCard';
import JsonEdit from './jsonEditor';
import DataFilter from './dataFilter';
import Synchronism from './synchronism';

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {
          commonApiHeader: {
            protocol: 0,
            restType: '1',
            authType: 1,
            authBody: '{}',
            dataProcess: 0
          },
          commonApiParams: [],
          commonApiMappingTables: []
        };
      }
    }
  },
  data() {
    return {
      loading: false,
      activeName: 'first',
      respondMessage: '',
      fieldArr: [], // 字段集合
      analysisData: {
        returnCode: '',
        returnMsg: '',
        returnDataPath: '',
        successFlag: ''
      }, // 解析数据
    };
  },

  components: {
    Card,
    JsonEdit,
    DataFilter,
    Synchronism
  },

  computed: {
    dataFilterValue() {
      const { commonApiHeader: { dataFilter = '[]' } } = this.info;
      let arr = [];
      try {
        arr = JSON.parse(dataFilter);
      } catch (e) {
        arr = [];
      }
      return arr;
    },
    rules() {
      return {
        returnCode: [
          {
            required: true,
            message: '请填写状态',
            trigger: 'blur'
          },
        ],
        successFlag: [
          {
            required: true,
            message: '请填写成功时内容',
            trigger: 'blur'
          }
        ],
        returnDataPath: [
          {
            required: true,
            message: '请填写数据',
            trigger: 'blur'
          }
        ],
        returnMsg: [
          {
            required: true,
            message: '请填写说明',
            trigger: 'blur'
          }
        ],
      };
    }
  },

  mounted() {
    this.respondMessage = this.info.commonApiHeader.respondMessage;
    try {
      this.analysisData = JSON.parse(this.info.commonApiHeader.responseBody || '{}');
    } catch (e) {
      this.analysisData = {};
    }
  },
  watch: {
    analysisData: {
      deep: true,
      handler(v) {
        this.info.commonApiHeader.responseBody = JSON.stringify(v);
      }
    }
  },

  methods: {
    changeDataFilterValue(v) {
      this.info.commonApiHeader.dataFilter = JSON.stringify(v);
    },
    async doSend() {
      this.loading = true;
      try {
        const res = await sendRequest(this.info);
        const { rspBody = '', rspData = [], rspTemplate = '{}' } = res;
        this.respondMessage = rspBody;
        this.info.commonApiHeader.respondMessage = rspBody;
        this.fieldArr = rspData;
        this.loading = false;
        try {
          const obj = JSON.parse(rspTemplate);
          const { returnDataPath = '', returnCode = '', returnMsg = '' } = obj;
          if (!this.analysisData.returnCode) {
            // this.analysisData.returnCode = returnCode;
            this.$set(this.analysisData, 'returnCode', returnCode);
          }
          if (!this.analysisData.returnMsg) {
            this.$set(this.analysisData, 'returnMsg', returnMsg);
            // this.analysisData.returnMsg = returnMsg;
          }
          if (!this.analysisData.returnDataPath) {
            this.$set(this.analysisData, 'returnDataPath', returnDataPath);
            // this.analysisData.returnDataPath = returnDataPath;
          }
        } catch (e) {
          console.warn(e);
        }
      } catch (e) {
        this.loading = false;
      }
    }
  },
  name: 'respondTab',
};
</script>

<style lang='scss' scoped>
.respond {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .m-t-10 {
    margin-top: 10px;
  }

  .step__inner {
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    background: #4689F5;
    border-radius: 50%;
  }

  .step__outer {
    display: flex;
    width: 26px;
    height: 26px;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    border: 2px solid #4689F5;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .respond__content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-bottom: 10px;
    box-sizing: border-box;
    z-index: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .respond__message {
    width: 100%;
    position: relative;
    display: flex;

    .respond__message--left {
      width: 26px;
      padding-top: 8px;
      margin-right: 10px;
    }

    .respond__message--right {
      flex: 1;
    }

    .respond__message--header {
      display: flex;
      width: 100%;
      padding-right: 48px;
      align-items: center;
      justify-content: space-between;
    }

    .respond__message--analysis {
      padding: 0 10px;
    }

    .dataProcess {
      min-height: 150px;
      padding: 10px;

      .dataProcess_choose {
        display: flex;
        height: 30px;
        align-items: center;
      }
      ::v-deep{
        .el-tabs__item{
          padding: 0 20px !important;
        }
        .el-tabs__nav-wrap::after{
          display: none;
        }
        .el-tabs__header{
          margin: 0;
          border: 1px solid #EBEBEB;
        }
      }
    }
  }

  &::after {
    display: block;
    content: "";
    background-image: linear-gradient(#D9D9D9 75%, rgba(255, 255, 255, 0) 0%);
    background-position: left;
    background-size: 1px 10px;
    background-repeat: repeat-y;
    width: 100px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 13px;
  }
}
</style>
