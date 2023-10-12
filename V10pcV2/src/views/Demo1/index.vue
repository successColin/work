<template>
  <div class="print">
    <!-- 左侧字段 -->
    <div class="field" @click="handleRefresh">
      <div v-for="(item, i) in leftComponents" :key="i">
        <div class="field__title">
          <i class="iconfont icon-jiaose"></i>
          {{ item.title }}
        </div>
        <draggable
          class="field__draggable"
          :list="item.list"
          :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
          draggable=".field__item"
          :sort="false"
          @end="onEnd"
        >
          <div
            v-for="(val, index) in item.list"
            :key="index"
            class="field__item"
          >
            <div class="components-body">
              {{ val.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <!-- 中间excel -->
    <draggable class="content" group="componentsGroup" :disabled="true">
      <my-Print ref="myPrint" :ruleForm="ruleForm"></my-Print>
    </draggable>
    <!-- 右边配置 -->
    <div class="config">
      <el-tabs>
        <el-tab-pane label="模板配置">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            class="configCon"
          >
            <el-form-item label="纸张大小">
              <el-select
                v-model="ruleForm.paperSize"
                placeholder="请选择纸张大小"
                @change="handleChangePaperSize"
              >
                <el-option label="A4" value="A4"></el-option>
                <el-option label="A5" value="A5"></el-option>
                <el-option label="B3" value="B3"></el-option>
                <el-option label="B4" value="B4"></el-option>
                <el-option label="B5" value="B5"></el-option>
                <el-option label="自定义" value="1"></el-option>
              </el-select>
              <section class="configCon__paperSize">
                宽：
                <el-input-number
                  style="width: 40px"
                  v-model="ruleForm.paperSizeWidth"
                  :controls="false"
                  :min="0"
                  :max="1000"
                  :disabled="isPaperSizeCustom"
                ></el-input-number>
                mm 高：
                <el-input-number
                  style="width: 40px"
                  v-model="ruleForm.paperSizeHeight"
                  :controls="false"
                  :min="0"
                  :max="1000"
                  :disabled="isPaperSizeCustom"
                ></el-input-number>
                mm
              </section>
            </el-form-item>
          </el-form>
          <el-button @click="handlePrint">预览</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyPrint from './MyPrint';

export default {
  data() {
    return {
      jsondata: {
        type: '',
        label: ''
      },
      leftComponents: [
        {
          title: '系统字段',
          list: [
            {
              label: '修改人'
            },
            {
              label: '创建人'
            },
            {
              label: '打印人'
            },
            {
              label: '发起人'
            }
          ]
        },
        {
          title: '表单字段',
          list: [
            {
              label: '主任务名称'
            },
            {
              label: '主任务描述'
            }
          ]
        }
      ],
      rules: {},
      // 配置表单
      ruleForm: {
        paperSize: 'A4',
        paperSizeWidth: '210',
        paperSizeHeight: '297'
      },
      // 纸张大小是否自定义
      isPaperSizeCustom: true
    };
  },
  components: {
    MyPrint
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleRefresh() {
      this.$refs.myPrint.refresh();
    },
    // 修改纸张大小
    handleChangePaperSize(v) {
      switch (v) {
        case 'A4':
          this.ruleForm.paperSizeWidth = 210;
          this.ruleForm.paperSizeHeight = 297;
          break;
        case 'A5':
          this.ruleForm.paperSizeWidth = 148;
          this.ruleForm.paperSizeHeight = 210;
          break;
        case 'B3':
          this.ruleForm.paperSizeWidth = 353;
          this.ruleForm.paperSizeHeight = 500;
          break;
        case 'B4':
          this.ruleForm.paperSizeWidth = 250;
          this.ruleForm.paperSizeHeight = 353;
          break;
        case 'B5':
          this.ruleForm.paperSizeWidth = 176;
          this.ruleForm.paperSizeHeight = 250;
          break;
        default:
          break;
      }
      if (v === '1') {
        this.isPaperSizeCustom = false;
        return;
      }
      this.isPaperSizeCustom = true;
    },
    onEnd(obj) {
      // console.log('拖拽结束', obj);
      this.$refs.myPrint.dropAssignment({
        dragEndC: this.$refs.myPrint.dragEndC,
        dragEndR: this.$refs.myPrint.dragEndR,
        val: obj.item.innerText
      });
      // this.xs.cellText(14, 3, obj.item.innerText).reRender();
    },
    handlePrint() {
      this.$refs.myPrint.excelPreview();
    }
  }
};
</script>
<style lang='scss' scoped>
.print {
  display: flex;
  width: 100%;
  height: 100%;
  .field {
    width: 240px;
  }
  .content {
    // flex: 1;
    width: calc(100% - 240px - 240px);
    overflow: hidden;
    #luckysheet {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  .config {
    box-shadow: 0 2px 6px 0 #e3e6ec;
    width: 240px;
    .configCon {
      padding: 16px;
      &__paperSize {
        display: flex;
        margin-top: 10px;
        ::v-deep {
          .el-input__inner {
            padding-left: 0;
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>
