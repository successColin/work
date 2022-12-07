<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">定位</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">
          <span class="span-box">
            <span> 占位提示 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </span>
        <el-input
          v-model="activeObj.placeholder"
          placeholder="请输入占位提示"
        ></el-input>
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
      <el-form-item label="状态">
        <el-button-group>
          <el-button
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
      <el-form-item label="默认值" class="defaultValue">
        <el-select
          v-model="activeObj.defaultValueType"
          placeholder="请选择"
          class="defaultValue__type"
          @change="fatherObj.form[activeObj.compId] = ''"
        >
          <el-option label="自动定位" :value="1"></el-option>
          <el-option label="地图选择" :value="2"></el-option>
        </el-select>
        <div
          class="defaultValue__type--box m-t-10"
          v-if="activeObj.defaultValueType === 2"
        >
          <apiot-input
            placeholder="请选择地址"
            readonly
            :value="
              fatherObj.form[activeObj.compId] &&
              fatherObj.form[activeObj.compId][0].name
            "
          ></apiot-input>
          <i class="iconfont icon-jiahao" @click="showMap = true"></i>
        </div>
      </el-form-item>
      <el-form-item label="提交类型">
        <el-select v-model="activeObj.submitType" placeholder="请选择类型">
          <el-option label="始终提交" :value="1"></el-option>
          <el-option label="仅显示时提交" :value="2"></el-option>
          <el-option label="始终不提交" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <apiot-dialog :visible.sync="showMap" @sure-click="showMap = false">
      <baidu-map-box
        v-if="activeObj.defaultValueType === 2"
        :configData="activeObj"
        :curValue="fatherObj.form[activeObj.compId]"
        :isConfig="true"
        @changeValue="changeValue"
      ></baidu-map-box>
    </apiot-dialog>
  </div>
</template>

<script>
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      showMap: false
    };
  },

  components: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {},

  methods: {
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    },
    changeValue(v) {
      this.fatherObj.form[this.activeObj.compId] = [v];
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.relateBox {
  &__relate,
  &__table {
    width: 48% !important;
  }
  &__relate {
    margin-right: 4%;
  }
}
.defaultValue {
  &__type {
    &--box {
      ::v-deep {
        .el-form-item {
          margin-bottom: 0;
        }
        &:not(.disabled) > .el-form-item {
          & .el-form-item__content:hover {
            .icon-jiahao {
              border-color: $--color-primary;
              background-color: #edf3fe;
              color: $--color-primary;
            }
            input {
              border-color: $--color-primary !important;
            }
          }
          & > .el-form-item__label {
            padding-top: 0px;
            line-height: 18px;
            font-size: 13px;
            font-weight: 600;
            color: #333333;
            display: flex;
          }
          & > .el-form-item__content .el-input input {
            border: 1px solid #e9e9e9;
            padding-right: 31px;
          }
        }
      }
      .icon-jiahao {
        border-left: 1px solid #e9e9e9;
        position: absolute;
        margin-left: -32px;
        margin-top: 1px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #aaaaaa;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        &:not(.disabled):hover {
          color: $--color-primary;
        }
        &.disabled {
          cursor: default;
        }
      }
    }
  }
}
.numberLength {
  position: relative;
  &__inputBox {
    position: absolute;
    right: 0;
    top: 0;
  }
  &__input {
    width: 63px;
    height: 32px;
    border-radius: 4px;
  }
  &__input1 {
    width: 140px;
    height: 32px;
    border-radius: 4px;
  }
}
.toPage {
  position: relative;
  &__more {
    position: absolute;
    right: 0;
    font-size: 13px;
    font-weight: 400;
    color: $--color-primary;
  }
}
.highRule {
  display: flex;
  align-items: center;
  .iconfont {
    font-size: 20px;
    color: #bbc3cd;
    margin-right: 10px;
  }
  &__label {
    font-size: 13px;
    font-weight: 400;
    color: #333333;
  }
}
</style>
