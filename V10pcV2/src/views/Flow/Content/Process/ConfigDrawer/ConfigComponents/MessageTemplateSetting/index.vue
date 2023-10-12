/**
* @name: index
* @author: DELL
* @date: 2023/2/3 9:29
* @description：index
* @update: 2023/2/3 9:29
*/
<!-- 页面 -->
<template>
  <div style="margin-top: 10px" >
    <apiot-button class="list-btn" @click="relateDialog = true">
      <i class="icon-shezhi iconfont m-r-4"></i>
      通知消息模板
    </apiot-button>
    <apiot-dialog
        title="选择消息模板"
        :isBigDialog="true"
        :visible="relateDialog"
        :show-close="false"
        @sure-click="handleOk"
        @cancle-click="handleCancel"
    >
      <template slot="btn">
        <apiot-button @click="doReset">清空</apiot-button>
      </template>
      <div class="user-appover-content" v-loading="loading">
        <div class="user-appover-tabs">
          <search-input @getList="getList" v-model.trim="keywords"></search-input>
        </div>
        <apiot-table
            class="tableWrap"
            :height="470"
            :tableData="tableData"
            highlight-current-row
            @selection-change="handleSelectionChange"
            @currentRadioObj="handleSelectionChange"
            :currentRadioObj.sync="selectKeys"
            selectName="id"
            :showRadio="true"
            :showSelection="false"
        >
          <component
              v-for="(item, index) in columnData"
              :is="item.compName"
              :key="`${item.prop}_${index}`"
              :prop="item.prop"
              :label="`${$t(item.label)}`"
              :width="item.width"
              :type="item.type"
              :align="item.align"
              :buttonArr="item.buttonArr"
              :fixed="item.fixed"
              :typesPropName="item.typesPropName"
              :activeValue="true"
              :inactivevalue="false"
              sortable="custom"
              :sort-orders="['ascending', 'descending']"
          ></component>
        </apiot-table>
      </div>
    </apiot-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/messageTemplate';

export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      relateDialog: false,
      tableData: [],
      current: 1,
      size: 99999,
      keywords: '',
      loading: false,
      templateTypes: '2',
      columnData: [
        // 模板名称
        {
          label: 'messageTemplate.templateName',
          prop: 'templateName',
          compName: 'ElTableColumn',
          width: 236
        },
        // 发送服务
        {
          label: 'messageTemplate.sendingService',
          prop: 'supportTypesName',
          typesPropName: 'MESSAGE_TYPE',
          colorIndex: 4,
          compName: 'TypesColumn'
        },
      ],
      selectKeys: {}
    };
  },

  components: {},

  computed: {},
  watch: {
    value() {
      this.selectKeys = JSON.parse(JSON.stringify(this.value));
    }
  },
  mounted() {
    this.$store.dispatch(
      'getCurrentDict',
      'MESSAGE_TYPE'
    );
    this.selectKeys = JSON.parse(JSON.stringify(this.value));
    this.getList();
  },

  methods: {
    handleOk() {
      this.relateDialog = false;
      this.$emit('change', this.selectKeys);
    },
    doReset() {
      this.handleCancel();
      this.$emit('change', {});
    },
    handleCancel() {
      this.relateDialog = false;
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.selectKeys = val;
    },
    // 获取列表
    async getList() {
      this.loading = true;
      const { current, size, keywords, orders, templateTypes } = this;
      const list = await getList({
        current,
        size,
        keywords,
        templateTypes,
        orders
      });
      const { records = [], total = 0 } = list;
      records.map((item) => {
        const { messageTypes = '' } = item;
        // 根据服务类型，获取类型名称
        const supportTypesName = [];
        let supportTypesArry = [];
        if (messageTypes) supportTypesArry = messageTypes.split(',');
        supportTypesArry.forEach((supportType) => {
          // 1-短信；2-邮件；3-企业微信；4-站内信；5-钉钉
          const dicValue = this.$store.state.dictManage.MESSAGE_TYPE.find(
            (dic) => `${dic.value}` === supportType
          );
          supportTypesName.push(dicValue.name);
        });
        item.supportTypesName = supportTypesName;
        item.supportTypes = supportTypesArry;
        return item;
      });
      this.current = current;
      this.total = total;
      this.tableData = records || [];
      this.loading = false;
    },
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.list-btn {
  width: 100%;

  .iconfont {
    margin-right: 5px;
    color: #4689f5;
  }
}
.user-appover-content {
  width: 100%;
  height: 100%;
  .user-appover-tabs {
    height: 32px;
    display: flex;
    padding-bottom: 10px;
    justify-content: flex-end;
    align-items: center;
    .form-item-label {
      margin-right: 10px;
    }
  }
  .tableWrap{
    height: calc(100% - 42px);
  }
}
</style>
