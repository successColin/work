<!--
 * @Descripttion: 模板设置
 * @Author: ytx
 * @Date: 2021-09-07 11:48:59
 * @Last Modified by: ytx
 * @Last Modified time: 2021-09-07 11:48:59
-->
<template>
  <div class="configParams">
    <h1 class="configParams__h1">
      {{ showGlobal ? '模版设置' : '单元格属性' }}
    </h1>
    <el-form label-position="top" v-if="showGlobal">
      <el-form-item label="模板名称">
        <apiot-input
          placeholder="请输入模板名称"
          v-model="ruleForm.name"
        ></apiot-input>
      </el-form-item>
      <el-form-item>
        <div slot="label">
          打印类型
          <el-tooltip class="item" effect="dark" content="" placement="top">
            <div slot="content">
              用于连续打印表单所有内容。<br />
              注意：从上至下一次打印表单<br />
              表单内容且不重复，同打印<br />
              word文档
            </div>
            <i class="iconfont icon-bangzhu configParams__iconBangzhu"></i>
          </el-tooltip>
        </div>
        <apiot-select
          v-model="ruleForm.type"
          placeholder="请选择打印类型"
          :options="typeOption"
        >
        </apiot-select>
      </el-form-item>
      <el-form-item label="纸张大小">
        <apiot-select
          v-model="ruleForm.paperSize"
          placeholder="请选择纸张大小"
          :options="paperSizeOption"
          @change="handleChangePaperSize"
        >
        </apiot-select>
        <section class="configParams__paperSize">
          宽：
          <el-input-number
            class="configParams__paperSize--width"
            v-model="ruleForm.paperWidth"
            :controls="false"
            :min="0"
            :max="1000"
            :disabled="isPaperSizeCustom"
          ></el-input-number>
          mm
          <div class="m-r-15"></div>
          高：
          <el-input-number
            class="configParams__paperSize--height"
            v-model="ruleForm.paperHeight"
            :controls="false"
            :min="0"
            :max="1000"
            :disabled="isPaperSizeCustom"
          ></el-input-number>
          mm
        </section>
      </el-form-item>
      <el-form-item label="纸张方向">
        <el-radio-group
          v-model="ruleForm.direction"
          @change="handleChangeDirection"
        >
          <el-radio :label="1">纵向</el-radio>
          <el-radio :label="2">横向</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="页边距">
        <section class="configParams__paperSize">
          <span class="m-r-10">上</span>
          <el-input-number
            class="configParams__paperSize--width"
            v-model="ruleForm.marginTop"
            :controls="false"
            :min="0"
            :max="100"
          ></el-input-number>
          <span class="m-l-5">mm</span>
          <div class="m-r-15"></div>
          <span class="m-r-10">下</span>
          <el-input-number
            class="configParams__paperSize--height"
            v-model="ruleForm.marginBottom"
            :controls="false"
            :min="0"
            :max="100"
          ></el-input-number>
          <span class="m-l-5">mm</span>
        </section>
        <section class="configParams__paperSize">
          <span class="m-r-10">左</span>
          <el-input-number
            class="configParams__paperSize--width"
            v-model="ruleForm.marginLeft"
            :controls="false"
            :min="0"
            :max="100"
          ></el-input-number>
          <span class="m-l-5">mm</span>
          <div class="m-r-15"></div>
          <span class="m-r-10">右</span>
          <el-input-number
            class="configParams__paperSize--height"
            v-model="ruleForm.marginRight"
            :controls="false"
            :min="0"
            :max="100"
          ></el-input-number>
          <span class="m-l-5">mm</span>
        </section>
      </el-form-item>
    </el-form>
    <el-form label-position="top" v-else>
      <el-form-item label="单元格">
        <apiot-input v-model="ruleForm1.cell" disabled></apiot-input>
      </el-form-item>
      <el-form-item label="数据列" v-show="ruleForm1.columnName">
        <apiot-input v-model="ruleForm1.columnName" disabled></apiot-input>
      </el-form-item>
      <el-form-item label="元素类型">
        <apiot-select
          v-model="ruleForm1.elementType"
          placeholder="请选择元素类型"
          :options="elementType"
          disabled
        >
        </apiot-select>
      </el-form-item>
      <!-- <el-form-item label="公式"> </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    globalConfig: {
      type: Object,
      default: () => {}
    },
    showGlobal: {
      type: Boolean,
      default: () => {}
    },
    excelPosition: {
      type: String,
      default: ''
    },
    copyDropObj: {
      type: Object,
      default: () => {}
    },
    excelSelectedObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isPaperSizeCustom: true,
      ruleForm: {
        name: '',
        type: 1,
        paperSize: 1,
        paperWidth: 210,
        paperHeight: 297,
        direction: 1,
        marginTop: 0,
        marginLeft: 0,
        marginBottom: 0,
        marginRight: 0
      },
      ruleForm1: {
        cell: '',
        columnName: '',
        elementType: 2
      },
      paperSizeOption: [
        {
          value: 1,
          name: 'A4'
        },
        {
          value: 2,
          name: 'A5'
        },
        {
          value: 3,
          name: 'B3'
        },
        {
          value: 4,
          name: 'B4'
        },
        {
          value: 5,
          name: 'B5'
        },
        {
          value: 6,
          name: '自定义'
        }
      ]
    };
  },
  components: {},
  computed: {
    typeOption() {
      return this.$store.getters.getCurDict('DICT-00128');
    },
    elementType() {
      return this.$store.getters.getCurDict('DICT-00131');
    }
  },
  watch: {
    excelPosition(v) {
      this.ruleForm1.cell = v;
    },
    copyDropObj(v) {
      this.ruleForm1.columnName = v.dataSource && v.dataSource.columnName;
      // this.ruleForm.tableName = v.dataSource && v.dataSource.tableName;
    },
    excelSelectedObj(v) {
      // console.log(v);
      this.ruleForm1.columnName = v.columnName;
      this.ruleForm1.elementType = v.elementType || 2;
    },
    globalConfig(v) {
      // console.log(v);
      this.ruleForm = v;
    }
  },
  mounted() {},
  methods: {
    giveRuleForm() {
      this.$emit('update:globalConfig', this.ruleForm);
    },
    // handleChangeElementType(v) {},
    // 选择纸张
    handleChangePaperSize(v) {
      this.$emit('update:globalConfig', this.ruleForm);
      switch (v) {
        // 'A4'
        case 1:
          this.ruleForm.paperWidth = 210;
          this.ruleForm.paperHeight = 297;
          break;
        // A5
        case 2:
          this.ruleForm.paperWidth = 148;
          this.ruleForm.paperHeight = 210;
          break;
        // B3
        case 3:
          this.ruleForm.paperWidth = 353;
          this.ruleForm.paperHeight = 500;
          break;
        // B4
        case 4:
          this.ruleForm.paperWidth = 250;
          this.ruleForm.paperHeight = 353;
          break;
        // B5
        case 5:
          this.ruleForm.paperWidth = 176;
          this.ruleForm.paperHeight = 250;
          break;
        default:
          break;
      }
      if (v === 6) {
        this.isPaperSizeCustom = false;
        return;
      }
      this.isPaperSizeCustom = true;
    },
    handleChangeDirection() {
      const { paperWidth } = this.ruleForm;
      const { paperHeight } = this.ruleForm;
      this.ruleForm.paperWidth = paperHeight;
      this.ruleForm.paperHeight = paperWidth;
      this.$emit('update:globalConfig', this.ruleForm);
    }
  }
};
</script>
<style lang='scss' scoped>
.configParams {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  height: 100%;
  width: 100%;
  &__h1 {
    height: 46px;
    line-height: 46px;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 12px;
  }
  &__paperSize {
    display: flex;
    margin-top: 10px;
    &--width,
    &--height {
      flex: 1;
    }
  }
  &__iconBangzhu {
    color: #aaaaaa;
    cursor: pointer;
  }
  .btn {
    margin: 0;
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
  .triggerAction {
    margin-bottom: 8px;
  }
  ::v-deep {
    .el-form {
      padding: 0 10px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
