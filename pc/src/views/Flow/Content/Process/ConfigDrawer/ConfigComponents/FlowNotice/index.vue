/**
* @name: index
* @author: DELL
* @date: 2021/10/27 11:04
* @description：index
* @update: 2021/10/27 11:04
*/
<!-- 页面 -->
<template>
  <div class="contentWrap" :key="key">
    <div class="config-property">
      <div class="form-item">
        <div class="form-item-label">消息模板</div>
        <div class="form-item-content">
          <DataSelectionBox
            showName="templateName"
            showValueKey="id"
            :value="template ? template.id : null"
            @handleSelect="handleSelectTemplate"
            @toMakeOptions="makeOptions"
          ></DataSelectionBox>
        </div>
      </div>
      <div class="form-item">
        <div class="form-item-label">消息渠道</div>
        <div class="form-item-content">
          <apiot-select
            v-model="value1"
            :options="typeArr"
            multiple
            placeholder="请选择"
          >
          </apiot-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsersState } from '@/api/user';
import DataSelectionBox from './DataSelectionBox';

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
      key: 0,
      value1: [],
      template: null, // 消息模板信息
      typeArr: [],
      messageType: []
    };
  },

  components: {
    DataSelectionBox
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

  computed: {},
  mounted() {
  },

  methods: {
    init() {
      if (this.nodeInfo && JSON.stringify(this.nodeInfo) !== '{}') {
        this.template = this.nodeInfo.template || this.template;
        this.value1 = this.nodeInfo.messageTypes || [];
      } else {
        this.template = null;
        this.value1 = [];
      }
      this.key += 1;
    },
    async makeOptions(supportTypes = '') {
      if (!supportTypes) return;
      const messageTypes = supportTypes.split(',');
      if (!this.messageType.length) {
        await this.getDict();
      }
      // eslint-disable-next-line max-len
      this.typeArr = messageTypes.map((item) =>
        this.messageType.find((type) => type.value === Number(item)));
    },
    handleSelectTemplate(template) {
      this.template = template;
      const { messageTypes } = template;
      this.value1 = [];
      this.makeOptions(messageTypes);
    },
    async getDict() {
      const data = await getUsersState({ dictKeys: 'MESSAGE_TYPE' });
      const list = data.MESSAGE_TYPE || [];
      this.messageType = list.map((item) => {
        const { value } = item;
        const lang = window.localStorage.getItem('apiotLanguage');
        return {
          value,
          name: item[lang]
        };
      });
    }
  },
  name: 'index'
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

        .item-content-box {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          width: 100%;
          height: 46px;
          line-height: 46px;

          .box-left {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }

        ::v-deep {
          .el-checkbox {
            height: 30px;
            line-height: 30px;

            .el-checkbox__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }

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
