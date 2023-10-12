<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">数据单选框</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <PlacehoderConfig :activeObj="activeObj"></PlacehoderConfig>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <!-- <el-form-item label="字段名" v-if="!isShow">
        <apiot-input
          v-model="activeObj.fieldName"
          placeholder="请填写字段名"
        ></apiot-input>
      </el-form-item> -->
      <!-- 数据源  -->
      <el-form-item label="关联数据源" v-if="!isShow">
        <el-select :value="1" placeholder="请选择数据源" :disabled="true">
          <el-option label="数据库" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="关联数据源"
        v-if="this.relateObj.tableInfo.tableName && getSingleRelate.length"
      >
        <el-select :value="1" placeholder="请选择数据源" :disabled="true">
          <el-option label="数据表" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <!-- 业务表 -->
      <el-form-item label="业务表" v-if="!isShow">
        <filterable-input
          :disabled="canChangeTable"
          placeholder="请选择关联表"
          title="关联表"
          :dialogType="1"
          :showInfo="activeObj.tableInfo"
          @selectRes="selectTable"
        ></filterable-input>
      </el-form-item>
      <!-- 关联表 -->
      <el-form-item
        label="关联表"
        v-if="!isShow && activeObj && activeObj.tableInfo.tableName"
      >
        <apiot-button
          class="relateBox__AssociationTable"
          style="margin-bottom: 10px"
          v-if="activeObj && activeObj.tableInfo.tableName"
          @click="
            currentRadioObj = null;
            relateDialog = true;
          "
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>配置关联表
        </apiot-button>
      </el-form-item>
      <el-form-item
        label="关系"
        v-if="
          (this.relateObj.tableInfo.tableName && getSingleRelate.length) ||
          (!isShow &&
            this.activeObj.tableInfo.tableName &&
            getSingleRelate.length)
        "
      >
        <el-select
          class="relateBox__relate"
          :title="activeObj.dataSource.relateName"
          :value="activeObj.dataSource.relateName"
          placeholder="请选择关系"
        >
          <el-option
            :label="getLabel(item)"
            :value="item.relateName"
            v-for="(item, index) in getSingleRelate"
            :key="index"
            @click.native="relateChange(item)"
          ></el-option>
        </el-select>
        <el-select
          class="relateBox__table"
          :value="activeObj.dataSource.tableName"
          placeholder="请选择表"
          :disabled="true"
          :title="activeObj.dataSource.tableName"
        >
          <el-option
            :value="item.tableName"
            v-for="(item, index) in tableArr"
            :key="index"
            @click.native="tableChange(item)"
          >
            {{ item.tableName }}
          </el-option>
        </el-select>
        <filterable-input
          class="m-t-10"
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.dataSource.tableName"
          :showInfo="activeObj.dataSource"
          :disabled="activeObj.labelNotChange"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectColumnRes"
        ></filterable-input>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0"
        v-if="activeObj.dataSource.columnName && getUserShow"
      >
        <p class="switchBox">
          是否启用字典
          <el-switch
            v-model="activeObj.enableDict"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="enableDictStatus"
          >
          </el-switch>
        </p>
      </el-form-item>
      <!-- activeObj.dataSource.columnName && -->
      <el-form-item label="字典表" v-if="activeObj.enableDict">
        <filterable-input
          ref="filterableInput"
          placeholder="请选择字典"
          :showInfo="activeObj.dataSource.dictObj"
          :hasPagination="true"
          :dialogType="3"
          @selectRes="selectDict"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="文字关联类型" v-if="activeObj.dataSource.columnName">
        <el-radio v-model="activeObj.relateType" :label="1">弹出面板</el-radio>
        <el-radio v-model="activeObj.relateType" :label="2">跳转菜单</el-radio>
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 1"
          @click="showPanelConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
        </apiot-button>
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 2"
          @click="showMenuConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
        </apiot-button>
      </el-form-item>
      <el-form-item label="按钮关联类型" v-if="activeObj.dataSource.columnName">
        <apiot-button class="panelBtn" @click="showBtnPanelConfig = true">
          <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
        </apiot-button>
      </el-form-item>
      <el-form-item
        label="数据选择类型"
        style="margin-bottom: 0"
        v-if="
          $route.query.isApp === '1' &&
          activeObj.dataSource.columnName &&
          activeObj.relateType === 1 &&
          configData[0].paneObj[activeObj.compId] &&
          configData[0].paneObj[activeObj.compId].sysMenuDesignId
        "
      >
        <!-- <p class="switchBox">
          是否启用扫描功能
          <el-switch
            v-model="activeObj.enableScan"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p> -->
        <el-select
          v-model="activeObj.labelShowStyle"
          placeholder="请选择数据选择类型"
        >
          <el-option label="扫一扫" :value="1"></el-option>
          <el-option label="点击选择" :value="2"></el-option>
          <el-option label="扫一扫+点击选择" :value="3"></el-option>
        </el-select>
        <apiot-button
          class="panelBtn"
          v-if="[1, 3].includes(activeObj.labelShowStyle)"
          @click="showScanConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>弹出扫一扫过滤条件
        </apiot-button>
      </el-form-item>
      <el-form-item
        v-if="relateObj && relateObj.compName === 'TableMain' && !isUser"
      >
        <p class="switchBox">
          是否启用表头搜索
          <el-switch
            v-model="activeObj.enableTableSearch"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        v-if="
          relateObj &&
          relateObj.compName === 'TableMain' &&
          !isUser &&
          relateObj.pageType !== 1 &&
          activeObj.enableDict
        "
      >
        <p class="switchBox">
          是否启用列表按钮区搜索
          <el-switch
            v-model="activeObj.enableBtnsSearch"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="enableBtnsSearchChange"
          >
          </el-switch>
        </p>
      </el-form-item>
      <StatusConfig :activeObj="activeObj" v-if="getUserShow"></StatusConfig>
      <el-form-item label="默认值" class="defaultValue" v-if="!isUser">
        <el-select
          v-model="activeObj.defaultValueType"
          placeholder="请选择"
          class="defaultValue__type"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <apiot-input
          v-if="activeObj.defaultValueType === 1"
          class="defaultValue__input"
          v-model="fatherObj.form[activeObj.compId]"
        ></apiot-input>
        <select-formula
          v-if="activeObj.defaultValueType === 2"
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.formulaContent"
        ></select-formula>
      </el-form-item>
      <WidthConfig
        :activeObj="activeObj"
        :relateObj="relateObj"
        :isShow="isShow"
      ></WidthConfig>
      <el-form-item label="验证" v-if="getUserShow">
        <p class="switchBox">
          是否必填
          <el-switch
            v-model="activeObj.shouldRequired"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="提交类型" v-if="isShow && !isUser">
        <el-select
          v-model="activeObj.submitType"
          placeholder="请选择类型"
          :disabled="canChangeSubmit"
        >
          <el-option label="始终提交" :value="1"></el-option>
          <el-option label="仅显示时提交" :value="2"></el-option>
          <el-option label="始终不提交" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 普通面板面板配置弹窗 -->
    <ToPanelConfig
      :visible.sync="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :isSelPanel="false"
      :panelCompId.sync="activeObj.textPanelId"
      :triggerCompMap="triggerCompMap"
      :getAllcheck="getAllcheck"
      :panelRow="panelRow"
    ></ToPanelConfig>
    <!-- 数据选择面板配置弹窗 -->
    <PanelConfig
      :visible.sync="showBtnPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :isSelPanel="true"
      :triggerCompMap="triggerCompMap"
    ></PanelConfig>
    <!-- 面板扫一扫弹窗 -->
    <ScanConfig
      :visible.sync="showScanConfig"
      :showScanConfig="showScanConfig"
      :configData="configData"
      :activeObj="activeObj"
      :isSelPanel="true"
      :triggerCompMap="triggerCompMap"
    ></ScanConfig>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      :visible.sync="showMenuConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
    ></ToMenuConfig>
    <!-- 配置关联表弹窗 -->
    <RelateTableDialog
      v-if="activeObj.tableInfo"
      :visible.sync="relateDialog"
      :getCurrentTab="activeObj"
    ></RelateTableDialog>
  </div>
</template>

<script>
import RelateTableDialog from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/RelateTableDialog';
import PanelConfig from '../ContentConfig/PanelConfig';
import ScanConfig from '../ContentConfig/ScanConfig';
import ToMenuConfig from '../ContentConfig/ToMenuConfig';
import ToPanelConfig from '../ContentConfig/ToPanelConfig';
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      tableArr: [],
      curPaneConfig: [],
      curPaneObj: {
        id: '', // 面板id
        panelName: '', // 面板名称
        sysMenuDesignId: '', // 设计组id
        panelClassify: 1,
        relationMenuDesignId: '', // 外层设计组id
        panelType: '', // 类型
        panelData: [], // 面板传递参数
        panelFilter: [], // 面板过滤条件
      },
      showPanelConfig: false, // 面板配置弹窗是否显示
      showBtnPanelConfig: false, // 按钮的数据选择面包那
      showMenuConfig: false,
      showScanConfig: false,
      relateDialog: false,
    };
  },

  components: {
    SelectFormula,
    PanelConfig,
    ToMenuConfig,
    ScanConfig,
    RelateTableDialog,
    ToPanelConfig,
  },

  computed: {
    // 是否可以更改主表
    canChangeTable() {
      let flag = false;
      const { relateTableArr } = this.activeObj;
      if (relateTableArr && relateTableArr.length !== 0) {
        flag = true;
      }
      return flag;
    },
    getSingleRelate() {
      console.log(this.relateObj);
      return this.isShow
        ? this.relateObj.relateTableArr.filter(
            (item) =>
              item.conditionArr[0][0].firstLineColumn.columnName &&
              item.conditionArr[0][0].secondLineColumn.columnName,
          )
        : this.activeObj.relateTableArr.filter(
            (item) =>
              item.conditionArr[0][0].firstLineColumn.columnName &&
              item.conditionArr[0][0].secondLineColumn.columnName,
          );
    },
    getLabel() {
      return (item) => {
        if (item.relateName === '主表') {
          return item.relateName;
        }
        return `${item.relateName}(${item.conditionArr[0][0].firstLineColumn.columnName})`;
      };
    },
    canChangeSubmit() {
      if (this.activeObj.dataSource.mainTableInfo) {
        if (
          this.activeObj.dataSource.mainTableInfo.tableName !==
            this.relateObj.tableInfo.tableName ||
          this.activeObj.dataSource.mainColumnInfo.columnName === 'id'
        ) {
          return true;
        }
      }
      return false;
    },
    getUserShow() {
      return !(
        this.activeObj.labelNotChange &&
        ['orgid'].includes(this.activeObj.dataSource.mainColumnInfo.columnName)
      );
    },
  },
  mounted() {
    this.setRequiredRule();
    // console.log(this.activeObj.textPanelId);
    // if (!this.activeObj.textPanelId) {
    //   this.activeObj.textPanelId = createUnique();
    // }
  },

  methods: {
    // 更改是否启用字典
    enableDictStatus() {
      if (!this.activeObj.enableDict) {
        this.activeObj.enableBtnsSearch = false;
        this.enableBtnsSearchChange();
      }
    },
    // 选中表格
    selectTable(table) {
      this.activeObj.tableInfo.tableName = table.tableName;
      this.activeObj.tableInfo.id = table.id;
      this.activeObj.tableInfo.nameAlias = table.tableName;
    },
    // 关系选择切换
    relateChange(item) {
      this.tableArr = [];

      if (item.relateName !== '主表') {
        this.tableArr.push({
          label: '关联表',
          relateName: this.getLabel(item),
          tableName: item.relateTable.tableName,
          alias: item.relateTable.alias,
        });
        this.$set(
          this.activeObj.dataSource,
          'mainColumnInfo',
          item.conditionArr[0][0].firstLineColumn,
        );
        this.$set(
          this.activeObj.dataSource,
          'mainTableInfo',
          item.conditionArr[0][0].firstLineTable,
        );
        if (
          item.conditionArr[0][0].firstLineTable.tableName ===
            this.relateObj.tableInfo.tableName &&
          item.conditionArr[0][0].firstLineColumn.columnName !== 'id'
        ) {
          this.activeObj.submitType = 1;
        } else {
          this.activeObj.submitType = 3;
        }
      } else {
        this.tableArr.push({
          label: '主表',
          relateName: '主表',
          tableName: this.relateObj.tableInfo.tableName,
          alias: '',
        });
      }
      // this.$set(
      //   this.activeObj.dataSource,
      //   'mainColumnInfo',
      //   item.conditionArr[0][0].firstLineColumn
      // );
      // 单表默认单表 多表默认关联表
      this.tableChange(this.tableArr[0]);
    },
    // 表格切换
    tableChange(table) {
      if (this.activeObj.dataSource.relateName === table.relateName) {
        return;
      }
      this.activeObj.dataSource.relateName = table.relateName;
      this.activeObj.dataSource.tableName = table.tableName;
      this.activeObj.dataSource.alias = table.alias;
      // 切换表格，重置字段
      this.activeObj.dataSource.columnName = '';
      this.activeObj.dataSource.id = '';
      // 获取字段
      this.$nextTick(() => {
        if (this.$refs.filterableInput) {
          this.$refs.filterableInput.currentRadioObj = null;
        }

        // this.$refs.filterableInput.getList();
      });
    },
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    },
    // 字典选择结果
    async selectDict(dict) {
      if (
        this.activeObj.dataSource.dictObj &&
        dict.id === this.activeObj.dataSource.dictObj.id
      ) {
        return;
      }
      dict.dictValue.forEach((item) => {
        item.value = +item.value;
        if (item[`${localStorage.apiotLanguage}`]) {
          item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
        }
      });
      this.$bus.$emit('changeDictArr', dict.dictKey);
      // this.activeObj.dataSource.dictObj = dict;
      this.$set(this.activeObj.dataSource, 'dictObj', dict);
      this.fatherObj.form[this.activeObj.compId] = '';
    },
    // 设置必填规则,无则设置，有则不变
    setRequiredRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'requiredRule',
        required: true,
        message: `请选择${this.activeObj.name}`,
        trigger: 'change',
      };
      if (ruleArr && ruleArr.length !== 0) {
        const index = ruleArr.findIndex((item) => item.flag === 'requiredRule');
        if (index === -1 && this.activeObj.shouldRequired) {
          ruleArr.push(ruleObj);
        }
        if (index !== -1 && !this.activeObj.shouldRequired) {
          ruleArr.splice(index, 1);
        }
      } else if (this.activeObj.shouldRequired) {
        this.$set(this.fatherObj.rules, this.activeObj.compId, [ruleObj]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../commonConfig';

.relateBox {
  &__relate {
    margin-bottom: 10px;
  }
  &__AssociationTable {
    width: 100%;
    i {
      color: $--color-primary;
    }
  }
}

.defaultValue {
  &__type {
    margin-bottom: 10px;
  }
}
.panelBtn {
  width: 100%;
  margin-top: 10px;
  .iconfont {
    color: $--color-primary;
  }
}
</style>
