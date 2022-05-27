<template>
  <div class="config coding">
    <h1 class="config__h1">编码</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
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
      <el-form-item>
        <apiot-button class="btn" @click="showRule = true"
          ><i class="iconfont icon-shezhi m-r-4"></i>设置编码规则</apiot-button
        >
        <ul v-if="configData[0].codeRuleList" class="ruleShow">
          <li
            v-for="item in configData[0].codeRuleList[getCompIndex]
              .codeRuleList"
            :key="item.id"
            class="ruleShow__item"
          >
            <span>{{ getName(item) }}：</span>
            <span v-show="item.type !== 'FORMULA'">{{ item.value }}</span>
            <span v-if="item.start" v-show="item.type !== 'FORMULA'"
              >(起始值{{ item.start }})</span
            >
            <span v-show="item.type === 'FORMULA'">已设置</span>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="状态">
        <el-button-group>
          <el-button
            v-if="false"
            :class="[{ active: activeObj.singleStatus === 1 }]"
            @click="activeObj.singleStatus = 1"
            >普通</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 2 }]"
            @click="activeObj.singleStatus = 2"
            >只读</el-button
          >
          <el-button
            v-if="false"
            :class="[{ active: activeObj.singleStatus === 3 }]"
            @click="activeObj.singleStatus = 3"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 4 }]"
            @click="activeObj.singleStatus = 4"
            >隐藏</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="宽度">
        <span slot="label">
          <span class="span-box">
            <span> 宽度 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </span>
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
    </el-form>
    <!-- 设置编码规则 -->
    <set-coding
      :visible.sync="showRule"
      :activeObj="activeObj"
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      :getCompIndex="getCompIndex"
    ></set-coding>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import SetCoding from './SetCoding';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      showRule: false,
      dropdownList: [
        {
          type: 'STR',
          name: '固定字符'
        },
        {
          type: 'DATE',
          name: '提交日期'
        },
        {
          type: 'INCREMENT',
          name: '自增位数'
        },
        {
          type: 'FORMULA',
          name: '公式'
        }
      ]
    };
  },

  components: {
    SetCoding
  },

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
    // 在顶级配置加入自己的编码规则
    this.addOwnCodeRule();
  },

  computed: {
    getCompIndex() {
      if (!this.configData[0].codeRuleList) {
        this.$set(this.configData[0], 'codeRuleList', []);
      }
      const index = this.configData[0].codeRuleList.findIndex(
        (rule) => rule.compId === this.activeObj.compId
      );
      return index;
    }
  },

  inject: ['isPanel', 'sysMenuDesignId'],

  mounted() {},

  methods: {
    // 获取名称
    getName(item) {
      const obj = this.dropdownList.find((v) => v.type === item.type);
      if (obj) {
        return obj.name;
      }
      return '';
    },
    // 在顶级配置加入自己的编码规则
    addOwnCodeRule() {
      if (this.getCompIndex !== -1) {
        return false;
      }
      this.configData[0].codeRuleList.push({
        // sysMenuDesignId: this.sysMenuDesignId,
        compId: this.activeObj.compId,
        codeRuleList: [
          {
            id: createUnique(),
            start: 1,
            type: 'INCREMENT',
            value: 1
          }
        ],
        tableName: this.activeObj.dataSource.tableName,
        primaryKey: '',
        autoIncrementRecord: '',
        operationType: 1 //  1 新增 2 修改 3 删除 4 不变
      });
    },
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    }
  },

  watch: {
    'activeObj.dataSource.columnName': function (v) {
      if (this.getCompIndex !== -1) {
        const curRule = this.configData[0].codeRuleList[this.getCompIndex];
        curRule.primaryKey = v;
        // 重置起始值
        const index = curRule.codeRuleList.findIndex((rule) => rule.type === 'INCREMENT');
        if (index !== -1) {
          curRule.autoIncrementRecord = curRule.codeRuleList[index].start;
        }
      }
    },
    'activeObj.dataSource.tableName': function (v) {
      if (v) {
        this.configData[0].codeRuleList[this.getCompIndex].tableName = v;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';
.coding {
  .btn {
    margin: 0;
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
}
.ruleShow {
  margin-top: 8px;
  padding: 12px 0 12px 15px;
  background: #fafafa;
  border-radius: 4px;
  &__item {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 4px;
    span:nth-child(1) {
      color: #808080;
    }
    span:nth-child(2) {
      color: #333;
    }
    span:nth-child(3) {
      color: #333;
    }
  }
}
</style>
