<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">进度条</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item
        style="margin-bottom: 0"
        v-if="
          !['TreeMain', 'MultiTree'].includes(relateObj.compName) &&
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
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <!-- <el-form-item label="占位提示">
        <el-input
          v-model="activeObj.placeholder"
          placeholder="请输入占位提示"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="帮助信息">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <el-form-item v-if="this.relateObj.tableInfo.tableName">
        <span slot="label">
          <span class="span-box">
            <span> 关联数据源 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </span>
        <el-select :value="1" placeholder="请选择数据源" :disabled="true">
          <el-option label="数据表" :value="1"></el-option>
        </el-select>
        <filterable-input
          class="m-t-8"
          :showInfo="relateObj.tableInfo"
          :dialogType="1"
          :disabled="true"
        ></filterable-input>
        <filterable-input
          class="m-t-10"
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.dataSource.tableName"
          :showInfo="activeObj.dataSource"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectColumnRes"
        ></filterable-input>
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
      <el-form-item label="宽度" v-else>
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
      <el-form-item label="展示风格">
        <el-select v-model="activeObj.showStyle" placeholder="请选择风格">
          <el-option label="线条风格" :value="1"></el-option>
          <el-option label="格子风格" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进度条高度">
        <apiot-input
          class="defaultValue__input"
          v-model.number="activeObj.progressBarHeight"
          placeholder="请输入固定值"
        ></apiot-input>
      </el-form-item>
      <el-form-item>
        <div class="title-label" slot="label">
          <span class="span-box">
            <span> 数据区间颜色 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </div>
        <apiot-button class="paramsBtn" @click="addColorArea">
          <i class="iconfont icon-xinzeng m-r-4"></i>添加区间
        </apiot-button>
        <div class="color__areas">
          <div class="color__areas__row" v-for="(item, index) in activeObj.ranges" :key="index">
            <apiot-input
              class="color__areas__input"
              v-if="index === 0"
              value="0"
              placeholder="请输入固定值"
              disabled
            ></apiot-input>
            <apiot-input
              class="color__areas__input"
              v-else
              v-model.number="activeObj.ranges[index - 1].range"
              placeholder="请输入固定值"
              disabled
            ></apiot-input>
            %
            ~
            <apiot-input
              class="color__areas__input"
              value="100"
              placeholder="请输入固定值"
              v-if="index === activeObj.ranges.length - 1"
            ></apiot-input>
            <apiot-input
              class="color__areas__input"
              v-model.number="item.range"
              placeholder="请输入固定值"
              v-else
            ></apiot-input>
            %
            <apiot-color-picker
              v-model="item.color1"
              :predefine="selectColorArr"
            >
            </apiot-color-picker>
            <apiot-color-picker
              v-model="item.color2"
              :predefine="selectColorArr"
            >
            </apiot-color-picker>
            <i class="iconfont icon-guanbi"
              :class="{noShow: index === 0}" @click="deleteColorArea(index)"></i>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="字体"
        class="font"
        v-if="
          !['TreeMain', 'MultiTree'].includes(relateObj.compName)
        "
      >
        <apiot-color-picker
          v-model="activeObj.font.color"
          class="m-r-8"
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
      <el-form-item label="内容显示" v-if="$route.query.isApp !== '1'">
        <el-select v-model="activeObj.progressShowType" placeholder="请选择类型">
          <el-option label="始终显示" :value="1"></el-option>
          <el-option label="鼠标悬停显示" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交类型">
        <el-select
          v-model="activeObj.submitType"
          placeholder="请选择类型"
        >
          <el-option label="始终提交" :value="1"></el-option>
          <el-option label="仅显示时提交" :value="2"></el-option>
          <el-option label="始终不提交" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { selectColorArr } from '@/config';
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      tableArr: [],
      showPanelConfig: false, // 面板配置弹窗是否显示
      selectColorArr: []
    };
  },

  components: {
  },

  computed: {
    getSingleRelate() {
      return this.relateObj.relateTableArr.filter(
        (item) =>
          item.conditionArr[0][0].firstLineTable.tableName === this.relateObj.tableInfo.tableName &&
          item.conditionArr[0][0].firstLineColumn.columnName &&
          item.conditionArr[0][0].secondLineColumn.columnName
      );
    },
    getMultiRelate() {
      return [
        {
          relateName: '主表'
        },
        ...this.getSingleRelate
      ];
    }
  },
  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
    this.selectColorArr = selectColorArr;
  },
  mounted() {
    this.setRequiredRule();
    console.log(this.relateObj, 'this.relateObj');
  },

  methods: {
    addColorArea() {
      const areas = this.activeObj.ranges;
      areas.push({
        color1: '#E74D4D',
        color2: '#FB6F5C',
        range: 100,
      });
      this.activeObj.ranges = areas;
    },
    deleteColorArea(index) {
      if (index === 0) return;
      const areas = this.activeObj.ranges;
      areas.splice(index, 1);
      this.activeObj.ranges = areas;
    },
    // 关系选择切换
    relateChange(item) {
      this.tableArr = [];

      if (item.relateName !== '主表') {
        this.tableArr.push({
          label: '关联表',
          tableName: item.relateTable.tableName,
          alias: item.relateTable.alias
        });
      } else {
        this.tableArr.push({
          label: '主表',
          tableName: this.relateObj.tableInfo.tableName,
          alias: ''
        });
      }
      // this.activeObj.dataSource.mianColumnInfo = item.conditionArr[0][0].firstLineColumn;
      // 单表默认单表 多表默认关联表
      this.tableChange(this.tableArr[0]);
    },
    // 表格切换
    tableChange(table) {
      if (this.activeObj.dataSource.tableName === table.tableName) {
        return;
      }
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
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.color__areas__row{
  width: 100%;
  height: 42px;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ::v-deep {
    .el-color-picker {
      height: 32px;
      width: 32px;
      border-radius: 4px;
      border: 1px solid #E9E9E9;
      box-sizing: border-box;
    }

    .el-color-picker__trigger {
      width: 30px;
      height: 30px;
      border: none;
    }

    .el-color-picker__color {
      border: none;
    }
  }
  .color__areas__input{
    width: 56px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #E9E9E9;
    box-sizing: border-box;
    ::v-deep {
      .el-input__inner{
        border: none;
        height: 100%;
      }
    }
  }
  .onlyone{
    width: 153px;
  }
  .icon-guanbi{
    font-size: 14px;
    color: #BBC3CD;
    cursor: pointer;
    &:hover{
      color: $--color-primary;
    }
  }
  .noShow{
    opacity: 0;
    cursor: inherit;
  }
}
.paramsBtn {
  width: 100%;
  .iconfont {
    color: $--color-primary;
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
