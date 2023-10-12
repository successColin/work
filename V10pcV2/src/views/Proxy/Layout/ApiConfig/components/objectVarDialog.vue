<!--
 * @Author: sss
 * @Date: 2021-07-30 11:14:03
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-30 11:14:03
 * @Desc: 弹出框-新增编辑SQL变量1
-->
<template>
  <apiot-dialog
      v-bind="$attrs"
      v-on="$listeners"
      class="viewDialog"
      :isBigDialog="true"
      :loading.sync="showLoading"
      @open="open"
      @sure-click="handleSure"
  >
    <div class="varContent">
      <div class="varInput">
        <div class="varInput__header">选择变量</div>
        <article class="inVariable">
          <p
              v-for="(item, index) in InputVarArr"
              :key="`${item.keycode}_${index}_${item.id}`"
              class="inVariable__varible"
          >
          <span
              :ref="`var_item_${item.dataType}_${index}`"
              class="inVariable__varible--item varibleItem"
              @click.stop="clickVar(item, index)"
          >
            <label class="varibleItem">{{
                item.name
              }}</label>
          </span>
          </p>
        </article>
      </div>
      <div class="varMain">
        <el-form
            :key="updateKey"
            label-position="top"
            label-width="80px"
            class="form"
            ref="objectVarDialog"
            :model="variables"
            :rules="rules"
            @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                  label="变量编码"
                  class="form--child"
                  prop="keycode"
                  ref="entity-form"
              >
                <apiot-input
                    v-model="variables.keycode"
                    placeholder="请输入默认值"
                ></apiot-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                  :label="$t('messageTemplate.variableName')"
                  class="form--child"
                  prop="name"
                  ref="entity-form"
              >
                <apiot-input
                    v-model="variables.name"
                    :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('messageTemplate.variableName'),
              })
            "
                ></apiot-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                  label="查询类型"
                  class="form--child"
                  prop="queryType"
                  ref="entity-form"
              >
                <el-select placeholder="请选择" v-model="variables.queryType">
                  <el-option
                      label="sql"
                      :value="0"
                  >
                  </el-option>
                  <el-option
                      label="静态"
                      :value="1"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                  label="返回类型"
                  class="form--child"
                  prop="returnType"
                  ref="entity-form"
              >
                <el-select placeholder="请选择" v-model="variables.returnType">
                  <el-option
                      label="多条"
                      :value="1"
                  >
                  </el-option>
                  <el-option
                      label="单条"
                      :value="0"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                  label="内容"
                  class="form--child"
                  prop="sqlScript"
                  ref="entity-form"
              >
                <Codemirror
                    ref="sqlInput"
                    key="sqlInput"
                    com="sqlInput"
                    prop="newSqlString"
                    @onCmFocus="onCmFocus"
                    @onCmBlur="onCmBlur"
                    @contentChange="contentChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
    </div>
  </apiot-dialog>
</template>

<script>
import Codemirror from '@/views/MessageTemplate/components/Configuration/components/Codemirror';

export default {
  components: { Codemirror },

  props: {
    type: {
      type: String,
      default: 'add',
    },
    InputVarArr: {
      type: Array,
      default() {
        return [];
      }
    },
    ObjectVarArr: {
      type: Array,
      default() {
        return [];
      }
    },
    variables: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      isFocus: false,
      showLoading: false,
      updateKey: 0,
    };
  },

  computed: {
    rules() {
      const checkValue = (rule, value, callback) => {
        if (!this.variables.sqlScript) {
          callback('请输入内容!');
        } else {
          callback();
        }
      };
      const checkKeycode = (rule, value, callback) => {
        const current = this.ObjectVarArr.find((item) => item.keycode === value);
        if (!value) {
          callback('请输入编码!');
        } else if (current && this.type === 'add') {
          callback('编码重复,请重新填写编码!');
        } else {
          callback();
        }
      };
      return {
        keycode: [
          {
            required: true,
            trigger: 'change',
            validator: checkKeycode
          },
          {
            required: true,
            pattern: /^[A-Za-z_]+$/,
            message: this.$t('messageTemplate.rules.variableCode'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('messageTemplate.variableName')
            }),
            trigger: 'blur'
          }
        ],
        queryType: [
          {
            required: true,
            message: '请选择查询类型',
            trigger: 'blur'
          }
        ],
        returnType: [
          {
            required: true,
            message: '请选择返回类型',
            trigger: 'blur'
          }
        ],
        sqlScript: [
          {
            required: true,
            message: '请填写内容',
            trigger: 'blur',
            validator: checkValue
          }
        ]
      };
    },
  },
  methods: {
    open() {
      this.updateKey += 1;
      this.$nextTick(() => {
        const arr = this.InputVarArr.map((item) => ({ ...item,
          variableCode: item.keycode,
          variableName: item.name,
          variableType: 4 }));
        this.$refs.sqlInput.init({
          content: this.variables.sqlScript || '',
          variables: arr
        });
      });
    },
    // 编辑聚焦时
    onCmFocus() {
      // 编辑器聚焦后通知变量区打开“变量注入功能”，并带给变量区对应的编辑器唯一标识，可以正确注入对应编辑器
      this.isFocus = true;
    },
    onCmBlur() {
      this.isFocus = false;
    },
    // 值发生变化时
    contentChange(value) {
      this.disabled = false;
      this.variables.sqlScript = value.content;
    },
    // 变量选择
    clickVar(variable) {
      this.$refs.sqlInput.setValue({ variable: {
        ...variable,
        variableCode: variable.keycode,
        variableName: variable.name,
        variableType: 4 } });
    },
    // 点击确定
    async handleSure() {
      this.$refs.objectVarDialog.validate((valid) => {
        if (valid) {
          // 验证变量编码是否重复
          this.$emit('sureClick', this.variables);
        }
        this.showLoading = false;
        return false;
      });
    },
  },

  mounted() {
  }
};
</script>

<style lang='scss' scoped>
.viewDialog {
  .varContent {
    display: flex;
    width: 100%;
    //flex-direction: column;
    height: 100%;
  }

  .varInput {
    width: 240px;
    height: calc(100% - 10px);
    margin-right: 20px;
    //margin-bottom: 10px;
    border: solid 1px #e9e9e9;

    .varInput__header {
      height: 36px;
      padding: 0 12px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 36px;
      box-sizing: border-box;
      border-bottom: solid 1px #e9e9e9;
    }

    .inVariable {
      height: calc(100% - 36px);

      &__varible {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
          background: #fafafa;
        }

        &--item {
          flex: 1;

          & label {
            margin: 6px 0 6px 9px;
            padding: 0 10px;
            display: inline-block;
            height: 24px;
            line-height: 24px;
            border-radius: 4px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            background: #FFEDE1;
            color: #FA6400;
            cursor: pointer;
          }

          ::v-deep {
            .el-input__inner {
              height: 28px;
            }
          }
        }

        &--btn {
          flex-shrink: 0;
          width: 28px;
          color: #bbc3cd;
          text-align: center;
          font-size: 8px;

          &:hover {
            color: #4689f5;
          }
        }

        .sepLine {
          width: 1px;
          height: 8px;
          background: #e9e9e9;
        }
      }
    }
  }

  .varMain {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    ::v-deep {
      .el-form-item {
        //margin-bottom: 0;
        .el-select {
          width: 100%;
        }
      }
    }
  }

  &__main {
    flex: 1;
    box-sizing: border-box;
    overflow: hidden;
  }

  ::v-deep {
    .form {
      margin: 20px 0 0 0;
    }

    .el-textarea__inner {
      border: none;
      border-radius: 0;
    }

    .el-button.is-disabled {
      .iconfont {
        color: #c0c4cc !important;
      }
    }
  }
}
</style>
