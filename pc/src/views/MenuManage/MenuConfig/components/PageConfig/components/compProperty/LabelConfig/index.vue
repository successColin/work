<template>
  <div class="config labelConfig">
    <h1 class="config__h1">label控件</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item style="margin-bottom: 0" v-if="false">
        <p class="switchBox">
          是否不可更改
          <el-switch
            v-model="activeObj.labelNotChange"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0"
        v-if="
          relateObj.compName !== 'TreeMain' &&
          relateObj.compName !== 'TableMain'
        "
      >
        <p class="switchBox">
          显示标题
          <el-switch
            v-model="activeObj.showLabelTitle"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        label="标题"
        v-show="activeObj.showLabelTitle || relateObj.compName === 'TreeMain'"
      >
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="背景" class="font" v-if="showLableType">
        <el-select v-model="activeObj.labelShowStyle" class="m-r-8">
          <el-option label="普通" :value="1"></el-option>
          <el-option label="小水滴" :value="2"></el-option>
        </el-select>
        <apiot-color-picker
          v-model="activeObj.waterColor"
          v-show="activeObj.labelShowStyle === 2"
        >
        </apiot-color-picker>
      </el-form-item>
      <el-form-item label="帮助信息" v-if="relateObj.compName !== 'TreeMain'">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="关联数据源"
        v-if="this.relateObj.tableInfo.tableName && getMultiRelate.length"
      >
        <el-select :value="1" placeholder="请选择数据源" :disabled="true">
          <el-option label="数据表" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="关系"
        v-if="this.relateObj.tableInfo.tableName && getMultiRelate.length"
      >
        <el-select
          class="relateBox__relate"
          :value="activeObj.dataSource.relateName"
          :title="activeObj.dataSource.relateName"
          placeholder="请选择关系"
        >
          <el-option
            :label="getLabel(item)"
            :value="item.relateName"
            v-for="(item, index) in getMultiRelate"
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
          placeholder="请选择字段"
          :tableName="activeObj.dataSource.tableName"
          :showInfo="activeObj.dataSource"
          :dialogType="2"
          @selectRes="selectColumnRes"
        ></filterable-input>
      </el-form-item>
      <el-form-item
        label="时间显示风格"
        v-if="+this.activeObj.dataSource.columnTypeDict === 3"
      >
        <el-select v-model="activeObj.timeShowType" class="m-r-8">
          <el-option label="日期(yyyy-MM-dd)" :value="1"></el-option>
          <el-option
            label="日期时间(yyyy-MM-dd hh:mm:ss)"
            :value="2"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0"
        v-if="
          activeObj.dataSource.columnName &&
          activeObj.dataSource.relateName === '主表' &&
          relateObj.compName !== 'TreeMain'
        "
      >
        <p class="switchBox">
          是否多选字段
          <el-switch
            v-model="activeObj.enableMultiColumn"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        label="多选值来源"
        v-if="activeObj.dataSource.columnName && activeObj.enableMultiColumn"
      >
        <filterable-input
          placeholder="请选择表"
          :showInfo="activeObj.multiTable.table"
          :dialogType="1"
          @selectRes="selectMultiTable"
        ></filterable-input>
        <filterable-input
          class="m-t-10"
          placeholder="请选择字段"
          :tableName="activeObj.multiTable.table.tableName"
          :showInfo="activeObj.multiTable.column"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectMultiColumn"
        ></filterable-input>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0"
        v-if="activeObj.dataSource.columnName"
      >
        <p class="switchBox">
          是否启用字典
          <el-switch
            v-model="activeObj.enableDict"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        label="字典表"
        v-if="activeObj.dataSource.columnName && activeObj.enableDict"
      >
        <filterable-input
          ref="filterableInput"
          placeholder="请选择字典"
          :showInfo="activeObj.dataSource.dictObj"
          :hasPagination="true"
          :dialogType="3"
          @selectRes="selectDict"
        ></filterable-input>
      </el-form-item>
      <el-form-item
        label="关联类型"
        v-if="
          activeObj.dataSource.columnName &&
          relateObj.compName !== 'TreeMain' &&
          relateObj.compName !== 'CardMain'
        "
      >
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
      <el-form-item label="状态" v-if="relateObj.compName !== 'TreeMain'">
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.singleStatus === 1 }]"
            @click="activeObj.singleStatus = 1"
            >普通</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 2 }]"
            @click="activeObj.singleStatus = 2"
            v-if="false"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 3 }]"
            @click="activeObj.singleStatus = 3"
            v-if="false"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 4 }]"
            @click="activeObj.singleStatus = 4"
            >隐藏</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item
        label="最小宽度"
        v-if="relateObj && relateObj.compName === 'TableMain'"
      >
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.05' }]"
            @click="activeObj.tableWidth = '0.05'"
            >5%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.1' }]"
            @click="activeObj.tableWidth = '0.1'"
            >10%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.15' }]"
            @click="activeObj.tableWidth = '0.15'"
            >15%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.2' }]"
            @click="activeObj.tableWidth = '0.2'"
            >20%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.25' }]"
            @click="activeObj.tableWidth = '0.25'"
            >25%</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="宽度" v-if="relateObj.compName === 'CardMain'">
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.width === '50%' }]"
            @click="activeObj.width = '50%'"
            >1/2</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '33.33%' }]"
            @click="activeObj.width = '33.33%'"
            >1/3</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '25%' }]"
            @click="activeObj.width = '25%'"
            >1/4</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '66.67%' }]"
            @click="activeObj.width = '66.67%'"
            >2/3</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '75%' }]"
            @click="activeObj.width = '75%'"
            >3/4</el-button
          >
          <el-button
            :class="[{ active: activeObj.width === '100%' }]"
            @click="activeObj.width = '100%'"
            >1/1</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item
        label="对齐方式"
        v-if="$route.query.isApp === '1' && relateObj.compName === 'CardMain'"
      >
        <el-select v-model="activeObj.alignStyle" class="m-r-8">
          <el-option label="左对齐" :value="1"></el-option>
          <el-option label="右对齐" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="字体"
        class="font"
        v-if="
          relateObj.compName !== 'TreeMain' && activeObj.labelShowStyle !== 2
        "
      >
        <apiot-color-picker
          v-model="activeObj.font.color"
          class="m-r-8"
          v-show="!activeObj.enableDict"
        >
        </apiot-color-picker>
        <el-select v-model="activeObj.font.size" class="m-r-8">
          <el-option label="12" :value="12"></el-option>
          <el-option label="13" :value="13"></el-option>
          <el-option label="14" :value="14"></el-option>
          <el-option label="15" :value="15"></el-option>
          <el-option label="16" :value="16"></el-option>
        </el-select>
        <el-select v-model="activeObj.font.style">
          <el-option label="常规字体" :value="1"></el-option>
          <el-option label="加粗字体" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="背景"
        class="font"
        v-if="
          relateObj.compName !== 'TreeMain' && activeObj.labelShowStyle !== 2
        "
      >
        <el-select v-model="activeObj.labelBg.style" class="m-r-8">
          <el-option label="无" :value="0"></el-option>
          <el-option label="圆角" :value="1"></el-option>
          <el-option label="椭圆" :value="2"></el-option>
        </el-select>
        <apiot-color-picker
          initColor="#ffffff"
          v-model="activeObj.labelBg.color"
          v-show="activeObj.labelBg.style !== 0 && !activeObj.enableDict"
        >
        </apiot-color-picker>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0"
        v-show="activeObj.enableDict"
        v-if="
          relateObj.compName !== 'TreeMain' && activeObj.labelShowStyle !== 2
        "
      >
        <p class="switchBox">
          是否显示字典图标
          <el-switch
            v-model="activeObj.enableDictIcon"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        style="margin-bottom: 0"
        v-if="
          relateObj.compName !== 'TreeMain' && activeObj.labelShowStyle !== 2
        "
      >
        <p class="switchBox">
          是否显示label图标
          <el-switch
            v-model="activeObj.enableIcon"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        label="图标"
        class="font"
        v-if="activeObj.enableIcon && activeObj.labelShowStyle !== 2"
      >
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected"
          :item="curItem"
          :iconType="2"
          class="m-r-10"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个辨识度高的图标</p>
      </el-form-item>
    </el-form>
    <!-- 面板配置弹窗 -->
    <PanelConfig
      :visible.sync="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
      :getAllcheck="getAllcheck"
    ></PanelConfig>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      :visible.sync="showMenuConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
    ></ToMenuConfig>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import IconSelect from '../../../../../../components/IconSelect';
import PanelConfig from '../ContentConfig/PanelConfig';
import ToMenuConfig from '../ContentConfig/ToMenuConfig';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      curItem: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      tableArr: [],
      // 弹窗类型数组
      dialogNameArr: [
        { value: 'PanelDialog', label: '弹出式' },
        { value: 'PanelDrawer', label: '抽屉式' },
        { value: 'PanelFull', label: '全屏式' }
      ],
      showLableType: false,
      showPanelConfig: false, // 面板配置弹窗是否显示
      showMenuConfig: false // 菜单配置弹窗是否显示
    };
  },

  components: {
    IconSelect,
    PanelConfig,
    ToMenuConfig
  },

  computed: {
    getSingleRelate() {
      if (this.relateObj.relateTableArr) {
        return this.relateObj.relateTableArr.filter(
          (item) =>
            item.conditionArr[0][0].firstLineColumn.columnName &&
            item.conditionArr[0][0].secondLineColumn.columnName
        );
      }
      return [];
    },
    getMultiRelate() {
      return [
        {
          relateName: '主表'
        },
        ...this.getSingleRelate
      ];
    },
    getLabel() {
      return (item) =>
        (item.relateName === '主表'
          ? item.relateName
          : `${item.relateName}(${item.conditionArr[0][0].firstLineColumn.columnName})`);
    }
  },

  created() {
    this.initIcon();
    this.initLabel();
  },

  methods: {
    // 初始化不同区域的label
    initLabel() {
      if (this.relateObj.compName === 'TableMain') {
        this.showLableType = true;
      } else if (this.relateObj.compName === 'MenuMain') {
        this.activeObj.width = '100%';
      } else if (this.relateObj.compName === 'TreeMain') {
        this.activeObj.showLabelTitle = true;
        if (this.relateObj.isSidebar) {
          this.activeObj.width = '100%';
        }
      }
    },
    // 初始化图标
    initIcon() {
      if (this.activeObj.icon) {
        this.curItem.icon = this.activeObj.icon.icon;
        this.curItem.color = this.activeObj.icon.color;
        this.curItem.imageUrl = this.activeObj.icon.imageUrl;
      }
    },
    // 选择图标
    iconSelected(obj) {
      this.activeObj.icon.icon = obj.icon;
      this.activeObj.icon.color = obj.color;
      this.activeObj.icon.imageUrl = obj.imageUrl;
    },
    // 关系选择切换
    relateChange(item) {
      this.tableArr = [];

      if (item.relateName !== '主表') {
        this.tableArr.push({
          label: '关联表',
          relateName: this.getLabel(item),
          tableName: item.relateTable.tableName,
          alias: item.relateTable.alias
        });
        this.$set(
          this.activeObj.dataSource,
          'mainColumnInfo',
          item.conditionArr[0][0].firstLineColumn
        );
        this.$set(
          this.activeObj.dataSource,
          'mainTableInfo',
          item.conditionArr[0][0].firstLineTable
        );
        this.activeObj.enableMultiColumn = false;
      } else {
        this.tableArr.push({
          label: '主表',
          relateName: '主表',
          tableName: this.relateObj.tableInfo.tableName,
          alias: ''
        });
      }

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
    },
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    },
    // 字典选择结果
    async selectDict(dict) {
      // console.log(dict);
      if (this.activeObj.dataSource.dictObj && dict.id === this.activeObj.dataSource.dictObj.id) {
        return;
      }
      dict.dictValue.forEach((item) => {
        item.value = +item.value;
        if (item[`${localStorage.apiotLanguage}`]) {
          item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
        }
      });
      this.$bus.$emit('changeDictArr', dict.dictKey);
      this.activeObj.dataSource.dictObj = dict;
      this.fatherObj.form[this.activeObj.compId] = '';
    },
    // 设置必填规则,无则设置，有则不变
    setRequiredRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'requiredRule',
        type: this.activeObj.dropDownType === 1 ? 'number' : 'array',
        required: true,
        message: `${this.activeObj.name}不能为空`,
        trigger: 'change'
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
    deleteParam(index) {
      this.activeObj.pane.paramArr.splice(index, 1);
    },
    selectMultiTable(table) {
      this.activeObj.multiTable.table.id = table.id;
      this.activeObj.multiTable.table.tableName = table.tableName;
      this.activeObj.multiTable.table.alias = `${table.tableName}__${createUnique()}`;
      this.activeObj.multiTable.column.id = '';
      this.activeObj.multiTable.column.columnName = '';
      this.activeObj.multiTable.column.columnTypeDict = '';
    },
    selectMultiColumn(table) {
      this.activeObj.multiTable.column.id = table.id;
      this.activeObj.multiTable.column.columnName = table.columnName;
      this.activeObj.multiTable.column.columnTypeDict = table.columnTypeDict;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.relateBox {
  &__relate {
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
.paneParam {
  position: relative;
  height: 158px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e9e9e9;
  padding: 0 10px;
  margin-top: 8px;
  &:hover {
    background: #fafafa;
  }
  h1 {
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }
  .formula {
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #bbc3cd;
    line-height: 14px;
    &:hover {
      color: $--color-primary;
    }
    .iconfont {
      font-size: 13px;
    }
  }
  &__equal {
    position: absolute;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    top: 60px;
    left: 117px;
    line-height: 24px;
    text-align: center;
    background: #fafafa;
    border-radius: 50%;
    border: 1px solid #e9e9e9;
  }
}
.font {
  ::v-deep {
    .el-form-item__content {
      display: flex;
      .el-color-picker__trigger {
        width: 32px;
        height: 32px;
      }
    }
  }
  .iconSelect__tip {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #aaaaaa;
  }
}
</style>
