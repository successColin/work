<!--
 * @Author: sss
 * @Date: 2021-07-14 09:22:18
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-14 09:22:18
 * @Desc: 消息发生模板
-->
<template>
  <section class="message" v-loading="contentLoading">
    <div class="message__content">
      <header class="message__header">
        <apiot-button type="primary" @click="addMessageTemplate">
          <i class="iconfont icon-xinzeng m-r-4"></i
          >{{
            $t('common.add', {
              name: $t('messageTemplate.messageTemplate'),
            })
          }}
        </apiot-button>

        <search-input @getList="getList" v-model.trim="keywords"></search-input>
      </header>
      <section class="message__main">
        <apiot-table
          ref="dicyionaryTable"
          :tableData="tableData"
          :dropColumnData="columnData"
          highlight-current-row
          dropClass=".message__main"
          @selection-change="handleSelectionChange"
          @currentRadioObj="handleSelectionChange"
          :showSelection="showSelection"
          :showRadio="showRadio"
          :currentRadioObj.sync="selectKeys"
          :selectName="selectName"
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
            @editMessageTemplate="editMessageTemplate"
            @delMessageTemplate="delMessageTemplate"
            @switchChange="handleTempStatus"
            @checkList="doCheckList"
          ></component>
        </apiot-table>
        <!--  -->
      </section>
      <footer class="message__footer">
        <apiot-pagination
          v-show="tableData.length"
          ref="pagination"
          :total="total"
          :size.sync="size"
          :current-page.sync="current"
          :selectedNum="multiExpressionArr.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          v-on:handle-cancel="doUnSelect"
        ></apiot-pagination>
      </footer>
    </div>
    <template-detail
      ref="detail"
      :drawerTitle="drawerTitle"
      :visible.sync="showDetail"
      :isShow="showDetail"
      @addOrEditClick="sureClick"
    ></template-detail>
  </section>
</template>

<script>
import { delTemp, disableTemplate, enableTemplate, getList } from '@/api/messageTemplate';
import TemplateDetail from './components/TemplateDetail';
import templateTypeColumn from './components/TemplateTypeColumn';

export default {
  name: 'MessageTemplate',
  components: {
    TemplateDetail,
    templateTypeColumn
  },

  props: {
    isMute: {
      // 是否多选
      type: Boolean,
      default: true
    },
    showRadio: {
      // 是否显示单选框
      type: Boolean,
      default: false
    },
    showSelection: {
      // 是否显示多选框
      type: Boolean,
      default: true
    },
    selectName: {
      // 单选选中根据哪个字段进行判断
      type: String,
      default: 'id'
    },
    currentRadioObj: {
      // 单选框选中的对象
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      contentLoading: false,
      keywords: '', // 搜索条件关键字
      templateTypes: '', // 类型
      orders: [],
      current: 1,
      total: 0,
      size: 10,
      tableData: [], // 列表数据
      multiExpressionArr: [], // 列表选中的数据
      operateType: 'add',
      showDetail: false,
      columnData: [
        // 模板名称
        {
          label: 'messageTemplate.templateName',
          prop: 'templateName',
          compName: 'ElTableColumn',
          width: 236
        },
        // 模板类型
        {
          label: 'messageTemplate.templateType',
          prop: 'templateType',
          typesPropName: 'MESSAGE_TYPE',
          colorIndex: 4,
          compName: 'templateTypeColumn'
        },
        // 发送服务
        {
          label: 'messageTemplate.sendingService',
          prop: 'supportTypesName',
          typesPropName: 'MESSAGE_TYPE',
          colorIndex: 4,
          compName: 'TypesColumn'
        },
        // 接收人
        {
          label: 'messageTemplate.receiver',
          prop: 'receiversTypeName',
          compName: 'ElTableColumn'
        },
        // 是否启用
        {
          label: 'messageTemplate.enable',
          compName: 'SwitchColumn',
          width: 236
        },
        {
          label: 'common.operate',
          width: 160,
          fixed: 'right',
          compName: 'OperateColumn',
          buttonArr: [
            { name: 'common.edit1', funcName: 'editMessageTemplate' },
            { name: 'common.delete1', funcName: 'delMessageTemplate' }
          ]
        }
      ],
      selectKeys: {} // 单选的值
    };
  },

  computed: {
    drawerTitle() {
      return this.$t(this.operateType, { name: this.$t('messageTemplate.messageTemplate') });
    }
  },

  methods: {
    // 禁用或者启用模板
    async handleTempStatus(row) {
      const { id, enabled } = row;
      if (!enabled) {
        await disableTemplate({ id });
      } else {
        await enableTemplate({ id });
      }
      this.getList();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      if (this.showRadio && !this.isMute) {
        this.selectKeys = val;
        this.$emit('select_template', val);
      } else {
        this.multiExpressionArr = val;
      }
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getList();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getList();
    },
    // 排序
    sortChange(sortInfo) {
      const { prop, order } = sortInfo;
      const orderObj = { column: prop };
      if (order === 'ascending') orderObj.asc = true;
      else if (order === 'descending') orderObj.asc = false;
      this.orders = [orderObj];
      this.getList();
    },
    async doCheckList(data) {
      this.templateTypes = data;
      this.current = 1;
      await this.getList();
    },
    // 获取列表
    async getList() {
      this.contentLoading = true;
      const { current, size, keywords, orders, templateTypes } = this;
      const list = await getList({
        current,
        size,
        keywords,
        templateTypes,
        orders
      });
      const { records } = list;
      records.map((item) => {
        const { receiverTypes = '', messageTypes = '' } = item;
        // 获取接收人类型
        let receiversTypeName = '';
        let receiverTypesArry = [];
        if (receiverTypes) receiverTypesArry = receiverTypes.split(',');
        receiverTypesArry.forEach((type) => {
          // 1-固定人员；2-固定角色；3-变量手机号；4-变量微信号；5-变量邮件；6-变量钉钉号；7-平台账号
          const dicValue = this.$store.state.dictManage.RECEIVER_TYPE.find(
            (dic) => `${dic.value}` === type
          );
          receiversTypeName = `${receiversTypeName}${dicValue.name};`;
        });
        item.receiversTypeName = receiversTypeName;
        item.receiverTypes = receiverTypesArry;

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

      this.contentLoading = false;
      this.current = current;
      this.total = list.total;
      this.tableData = list.records;
    },
    // 添加消息模板
    addMessageTemplate() {
      this.$refs.detail.initFormData({
        id: '',
        templateName: '',
        templateType: 1,
        variables: [],
        receivers: [],
        contents: [],
        templateCode: '',
        sqlScript: '',
        enabled: 1,
        supportTypes: [4],
        receiversTypes: [], // 接收人类型
        enableRepeatCheck: false,
        repeatDetectUnit: '',
        repeatDetectInterval: ''
      });
      this.operateType = 'common.add';
      this.showDetail = true;
    },
    // 编辑消息模板
    async editMessageTemplate(row) {
      await this.$refs.detail.getDetail(row.id);
      this.operateType = 'common.edit';
      this.showDetail = true;
    },
    // 删除消息模板
    async delMessageTemplate(row) {
      const { id } = row;
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.operateType = 'delete';
      await delTemp({
        id,
        logData: {
          name: this.$t('expression.expression'),
          value: 'description',
          deleteArr: this.multiExpressionArr
        }
      });
      this.getList();
      this.$message({
        type: 'success',
        message: this.$t('common.success', {
          name: this.$t('common.delete', {
            name: ''
          })
        })
      });
    },
    // 细节界面操作后回调
    sureClick() {
      this.showDetail = false;
      this.getList();
    },
    // 取消全选
    doUnSelect() {
      this.multiExpressionArr = [];
      this.$refs.dicyionaryTable.clearSelection();
    },
    // 初始化
    init() {
      // 查询 INNER_MAIL_TYPE(站内信类型)、MESSAGE_TYPE(服务类型)、RECEIVER_TYPE(消息接收对象类型)、VARIABLE_TYPE(变量类型)
      // SMS_PROVIDER（短信服务商）
      this.$store.dispatch(
        'getCurrentDict',
        'INNER_MAIL_TYPE,MESSAGE_TYPE,RECEIVER_TYPE,VARIABLE_TYPE,REQUISITE_TYPE,SMS_PROVIDER,ZZD_AGREEMENT'
      );
      this.getList();
    }
  },

  activated() {
    this.getList();
  },

  mounted() {
    if (this.showRadio && !this.isMute) {
      this.selectKeys = this.currentRadioObj;
    }
    this.init();
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

//右边样式变量
$--name: 'message';
$--headerHeight: 42px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);

.message {
  padding: 10px 10px 0 10px;
  background: #fff;
}
</style>
