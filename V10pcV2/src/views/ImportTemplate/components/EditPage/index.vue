<!--
 * @Descripttion: 点击编辑抽屉内容
 * @Author: ytx
 * @Date: 2021-06-29 18:02:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:02:05
-->
<template>
  <section>
    <apiot-drawer
      class="drawer"
      v-on="$listeners"
      v-bind="$attrs"
      :loading.sync="showLoading"
      @sure-click="sureClick"
      @close="handleClose"
    >
      <el-form
        v-if="visibleState"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="drawer__ruleForm"
        label-position="top"
      >
        <div class="form__line">
          <el-form-item
            class="form__child"
            :label="$t('importTemplate.templateName')"
            prop="templateName"
          >
            <apiot-input
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('importTemplate.templateName'),
                })
              "
              v-model="ruleForm.templateName"
              :disabled="isSystem"
            ></apiot-input>
          </el-form-item>
          <el-form-item
            class="form__child"
            :label="$t('importTemplate.templateType')"
            prop="templateTpye"
          >
            <apiot-select
              v-model="ruleForm.templateTpye"
              :options="typeArr"
              :placeholder="
                $t('placeholder.pleaseSelect', {
                  any: $t('importTemplate.templateType'),
                })
              "
              @change="handleChangeType"
              :disabled="isSystem"
            ></apiot-select>
          </el-form-item>
        </div>
        <!-- 数据表（单表） -->
        <div class="form__line" v-if="ruleForm.templateTpye === 1">
          <el-form-item
            class="form__child"
            :label="$t('importTemplate.dataSheet')"
            style="margin-right: 15px"
            prop="table1"
          >
            <filterable-input
              ref="singleTable"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('importTemplate.tableName'),
                })
              "
              :dialogType="1"
              :showInfo="tableInfo1"
              @selectRes="fatherFun"
              :disabled="isSystem"
            ></filterable-input>
          </el-form-item>
          <el-form-item class="form__child">
            <div slot="label">
              {{ $t('importTemplate.isItTreeImport') }}
            </div>
            <el-radio-group v-model="ruleForm.isTree" :disabled="isSystem">
              <!-- 1是 2否 -->
              <el-radio :label="1">{{ $t('common.is') }}</el-radio>
              <el-radio :label="2">{{ $t('common.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 数据表（多表） -->
        <section v-else-if="ruleForm.templateTpye === 2">
          <div class="form__line">
            <el-form-item
              class="form__child"
              :label="$t('importTemplate.dataSheet')"
              prop="table1"
            >
              <filterable-input
                ref="parentTable"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('importTemplate.parentTableName'),
                  })
                "
                :dialogType="1"
                :showInfo="tableInfo1"
                @selectRes="fatherFun"
                :disabled="isSystem"
              ></filterable-input>
            </el-form-item>
            <el-form-item class="form__child" prop="table2">
              <filterable-input
                ref="childTable"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('importTemplate.childTableName'),
                  })
                "
                :dialogType="1"
                :showInfo="tableInfo2"
                @selectRes="childFun"
                style="margin-top: 30px"
                :disabled="isSystem"
              ></filterable-input>
            </el-form-item>
          </div>
          <div class="form__line form__relation">
            <div class="form__relation--title">
              {{ $t('importTemplate.relation') }}
            </div>
            <div class="form__relation--con">
              <apiot-input
                class="m-l-10 form__average"
                :placeholder="$t('importTemplate.parentTableDisplay')"
                :disabled="true"
                v-model="parentTableName"
              ></apiot-input>
              <el-form-item prop="field1" style="margin-bottom: 0">
                <filterable-input
                  ref="parentField"
                  class="m-l-10 form__average"
                  :placeholder="$t('importTemplate.searchField')"
                  :dialogType="2"
                  :tableName="parentTableName"
                  :showInfo="tableInfo3"
                  @selectRes="fatherFieldFun"
                  :disabled="isSystem"
                ></filterable-input>
              </el-form-item>
              <span class="m-l-10 form__equal">==</span>
              <apiot-input
                class="m-l-10 form__average"
                :placeholder="$t('importTemplate.childTableDisplay')"
                :disabled="true"
                v-model="childTableName"
              ></apiot-input>
              <el-form-item prop="field2" style="margin-bottom: 0">
                <filterable-input
                  ref="subField"
                  class="m-l-10 form__average m-r-10"
                  :placeholder="$t('importTemplate.searchField')"
                  :dialogType="2"
                  :tableName="childTableName"
                  :showInfo="tableInfo4"
                  @selectRes="childFieldFun"
                  :disabled="isSystem"
                ></filterable-input>
              </el-form-item>
            </div>
          </div>
          <!-- <div class="form__line">
            <el-form-item class="form__child">
              <div slot="label">
                {{ $t('importTemplate.isItTreeImport') }}
              </div>
              <el-radio-group v-model="ruleForm.isTree" :disabled="isSystem">
                <el-radio :label="2">{{ $t('common.no') }}</el-radio>
                <el-radio :label="1">{{ $t('common.is') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div> -->
        </section>
        <!-- 富文本 -->
        <div class="form__line">
          <el-form-item class="form__child" :label="$t('importTemplate.descr')">
            <apiot-wangeditor
              ref="wangeditor"
              :value="ruleForm.remarksHtml"
              class="wangeditor"
            >
            </apiot-wangeditor>
          </el-form-item>
        </div>
      </el-form>
    </apiot-drawer>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imageUrl" alt="" />
    </el-dialog> -->
  </section>
</template>

<script>
import { insertTemplate, updateModifyTemplate } from '@/api/importTemplate';

export default {
  props: {
    // 新增：true；编辑：fasle
    isAddDrawerState: {
      type: Boolean,
      default: true
    },
    // 左侧分组 id
    groupId: {
      type: Number,
      default: 0
    },
    // 当前值
    currentTableObj: {
      type: Object,
      default: () => {}
    },
    visibleState: {
      type: Boolean,
      default: false
    },
    isSystem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示loading
      showLoading: false,
      // 类型下拉框
      // typeArr: [
      //   {
      //     value: 1,
      //     name: '单表导入(主表)'
      //   },
      //   {
      //     value: 2,
      //     name: '多表导入(父子表)'
      //   }
      // ],
      // 表单
      // ------------  参数  -----------------
      ruleForm: {
        remarks: '', // 备注
        remarksHtml: '',
        sortId: '', // 分组的id
        templateName: '', // 模板名称
        templateRelation: '', // 多表关联关系(table1.id=table2.id ,table2.name=talbe3.name) 英文逗号分隔
        templateTpye: 1, // 模板类型(1单表，2多表)
        table1: '',
        table2: '',
        field1: '',
        field2: '',
        isTree: 2
      },
      // ----------------------------------------
      tableInfo1: {},
      tableInfo2: {},
      tableInfo3: null,
      tableInfo4: null,
      // 数据整合
      integration1: {},
      integration2: {},
      // 富文本
      menus: [
        'head',
        'bold',
        'fontSize',
        // 'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        // 'todo',
        'justify',
        'quote',
        // 'emoticon',
        'image',
        'video',
        'table',
        // 'code',
        'splitLine',
        'undo',
        'redo'
      ]
    };
  },
  computed: {
    rules() {
      const validateTable1 = (rule, value, callback) => {
        if (value === '') {
          callback(
            new Error(
              this.$t('placeholder.pleaseSelect', { any: this.$t('importTemplate.tableName') })
            )
          );
        } else if (this.tableInfo2 && this.tableInfo2.tableName === value) {
          callback(new Error(this.$t('importTemplate.childTableAndParentTableCantRepeat')));
        } else {
          this.$refs.ruleForm.clearValidate('table2');
          callback();
        }
      };
      const validateTable2 = (rule, value, callback) => {
        // console.log(1);
        if (value === '') {
          callback(
            new Error(
              new Error(
                this.$t('placeholder.pleaseSelect', { any: this.$t('importTemplate.tableName') })
              )
            )
          );
        } else if (this.tableInfo1 && this.tableInfo1.tableName === value) {
          callback(new Error(this.$t('importTemplate.childTableAndParentTableCantRepeat')));
        } else {
          this.$refs.ruleForm.clearValidate('table1');
          callback();
        }
      };
      return {
        templateName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('importTemplate.templateName')
            }),
            trigger: 'change'
          }
        ],
        templateTpye: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('importTemplate.templateType')
            }),
            trigger: 'change'
          }
        ],
        table1: [{ required: true, validator: validateTable1, trigger: 'change' }],
        table2: [{ validator: validateTable2, trigger: 'change' }],
        field1: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', { any: this.$t('importTemplate.field') }),
            trigger: 'change'
          }
        ],
        field2: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', { any: this.$t('importTemplate.field') }),
            trigger: 'change'
          }
        ]
      };
    },
    typeArr() {
      return this.$store.getters.getCurDict('TEMPLATE_TYPE');
    },
    templateRelation() {
      if (this.ruleForm.templateTpye === 1) {
        return [this.integration1];
      }
      return [this.integration1, this.integration2];
    },
    parentTableName() {
      return (this.tableInfo1 && this.tableInfo1.tableName) || '';
    },
    childTableName() {
      return (this.tableInfo2 && this.tableInfo2.tableName) || '';
    }
  },
  watch: {
    tableInfo1(v) {
      if (v && v.id) {
        this.integration1 = {
          tableId: v.id,
          tableName: v.tableName,
          sno: 1,
          joinTableId: this.integration2.tableId,
          memo: v.memo
        };
        this.integration2.joinTableId = v.id;
      } else {
        this.integration1 = {};
      }
    },
    tableInfo2(v) {
      if (v && v.id) {
        this.integration2 = {
          tableId: v.id,
          tableName: v.tableName,
          sno: 2,
          joinTableId: this.integration1.tableId,
          memo: v.memo
        };
        this.integration1.joinTableId = v.id;
      } else {
        this.integration2 = {};
      }
    },
    tableInfo3(v) {
      if (v && v.id) {
        this.integration1.foreignId = v.id;
        this.integration1.foreignKey = v.columnName;
      }
    },
    tableInfo4(v) {
      if (v && v.id) {
        this.integration2.foreignId = v.id;
        this.integration2.foreignKey = v.columnName;
      }
    },
    // 赋值
    currentTableObj(v) {
      if (JSON.stringify(v) === '{}') {
        // this.resetFun();
        Object.assign(this.$data, this.$options.data());
        return;
      }
      const { templateName, templateTpye, remarksHtml, relationsList, isTree } = v;
      this.ruleForm.templateName = templateName;
      this.ruleForm.templateTpye = templateTpye;
      this.ruleForm.remarksHtml = remarksHtml;
      if (isTree) {
        this.ruleForm.isTree = isTree;
      }

      this.ruleForm.field1 = true;
      this.ruleForm.field2 = true;
      relationsList.forEach((item) => {
        if (item.sno === 1) {
          this.tableInfo1 = {
            id: item.tableId,
            tableName: item.tableName
          };
          this.ruleForm.table1 = item.tableName;
          this.tableInfo3 = {
            id: item.foreignId,
            columnName: item.foreignKey
          };
        } else if (item.sno === 2) {
          this.tableInfo2 = {
            id: item.tableId,
            tableName: item.tableName
          };
          this.ruleForm.table2 = item.tableName;
          this.tableInfo4 = {
            id: item.foreignId,
            columnName: item.foreignKey
          };
        }
      });
    }
  },
  methods: {
    // 重置
    // resetFun() {
    //   this.$nextTick(() => {
    //     // if (this.ruleForm.templateTpye === 1) {
    //     //   this.$refs.singleTable.currentRadioObj = null;
    //     // } else if (this.ruleForm.templateTpye === 2) {
    //     //   this.$refs.parentTable.currentRadioObj = null;
    //     //   this.$refs.childTable.currentRadioObj = null;
    //     //   this.$refs.parentField.currentRadioObj = null;
    //     //   this.$refs.subField.currentRadioObj = null;
    //     // }
    //     // this.$refs.ruleForm.resetFields();
    //     // this.$refs.wangeditor.clearContent();
    //     // this.tableInfo1 = null;
    //     // this.tableInfo2 = null;
    //     // this.tableInfo3 = null;
    //     // this.tableInfo4 = null;
    //     Object.assign(this.$data, this.$options.data());
    //   });
    // },
    // 按钮__确定
    sureClick() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          delete this.ruleForm.table1;
          delete this.ruleForm.table2;
          delete this.ruleForm.field1;
          delete this.ruleForm.field2;
          this.ruleForm.sortId = this.groupId;
          this.ruleForm.remarks = this.$refs.wangeditor.getHtmlObj().text; // 备注
          this.ruleForm.remarksHtml = this.$refs.wangeditor.getHtmlObj().html; // 备注
          this.ruleForm.templateRelation = JSON.stringify(this.templateRelation); // 多表关联关系
          // console.log(this.ruleForm);
          if (this.isAddDrawerState) {
            // 新增
            await insertTemplate(this.ruleForm);
          } else {
            // 编辑
            const params = {
              id: this.currentTableObj.id,
              ...this.ruleForm
            };
            try {
              await updateModifyTemplate(params);
            } catch (err) {
              this.showLoading = false;
              return;
            }
          }
          this.$emit('getList');
          this.showLoading = false;
          this.$emit('update:visible', false);
          this.$message({
            type: 'success',
            message: this.isAddDrawerState
              ? this.$t('common.newSuccess')
              : this.$t('common.successfullyModified')
          });
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 关闭抽屉
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('update:currentTableObj', {});
    },
    // 父表值
    fatherFun(v) {
      this.ruleForm.table1 = v.tableName;
      this.tableInfo1 = {
        id: v.id,
        tableName: v.tableName,
        memo: v.memo
      };
      if (this.$refs.parentField) {
        this.$refs.parentField.currentRadioObj = null;
        this.tableInfo3 = null;
        this.ruleForm.field1 = '';
      }
    },
    // 选择父表字段
    fatherFieldFun(v) {
      this.ruleForm.field1 = true;
      this.tableInfo3 = {
        id: v.id,
        columnName: v.columnName
      };
    },
    // 子表值
    childFun(v) {
      this.ruleForm.table2 = v.tableName;
      this.tableInfo2 = {
        id: v.id,
        tableName: v.tableName,
        memo: v.memo
      };
      if (this.$refs.subField) {
        this.$refs.subField.currentRadioObj = null;
        this.tableInfo4 = null;
        this.ruleForm.field2 = '';
      }
    },
    // 选择子表字段
    childFieldFun(v) {
      this.ruleForm.field2 = true;
      this.tableInfo4 = {
        id: v.id,
        columnName: v.columnName
      };
    },
    // 类型变化时
    handleChangeType(v) {
      this.ruleForm.templateTpye = v;
      // console.log(this.tableInfo1, this.tableInfo2);
      this.tableInfo1 = null;
      this.tableInfo2 = null;
      this.tableInfo3 = null;
      this.tableInfo4 = null;
      this.ruleForm.table1 = '';
      this.ruleForm.table2 = '';
      this.ruleForm.field1 = '';
      this.ruleForm.field2 = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.drawer {
  &__ruleForm {
    padding: 20px 37px;
    .form__line {
      display: flex;
      width: 100%;
      el-form-item {
        width: 100%;
      }
      .form__child {
        flex: 1;
        margin-bottom: 10px;
        &:nth-child(2n) {
          margin-left: 30px;
        }
      }
    }
    .form__relation {
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      flex-direction: column;
      margin-top: 10px;
      ::v-deep {
        .el-form-item__error {
          margin-left: 10px;
        }
      }
      &--title {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        padding: 10px;
      }
      &--con {
        display: flex;
        margin-bottom: 20px;
        align-items: center;
        .form__equal {
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #333333;
        }
        .form__average {
          flex: 1;
        }
      }
    }
    .wangeditor {
      // height: 50vh;
      ::v-deep {
        .w-e-scroll {
          height: calc(100vh - 480px);
        }
      }
    }
    ::v-deep {
      .el-form-item__label {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-top: 10px;
      }
    }
  }
}
</style>
