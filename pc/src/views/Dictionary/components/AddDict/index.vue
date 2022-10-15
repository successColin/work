<!--
 * @Author: sss
 * @Date: 2021-05-06 10:36:54
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-06 10:36:54
 * @Descripttion: 数字字典详细信息
-->
<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :title="drawerTitle"
    :loading.sync="showLoading"
    :hasFooter="currentPageType !== 2"
    @sure-click="sureClick"
  >
    <section class="addDict" v-if="isShow">
      <header class="addDict__header" v-if="currentPageType === 1">
        <el-alert
          :title="$t('dictionary.changDictTip')"
          type="info"
          show-icon
          :closable="false"
        >
        </el-alert>
      </header>

      <el-form
        label-position="top"
        label-width="80px"
        class="form"
        ref="addDict"
        :model="formData"
        :rules="rules"
      >
        <div class="form--line">
          <el-form-item
            :label="$t('dictionary.dictionaryEntry')"
            class="form--child"
            prop="dictName"
            ref="entity-form"
          >
            <apiot-input
              v-model="formData.dictName"
              :disabled="isDisabled"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('dictionary.dictionaryEntry'),
                })
              "
            ></apiot-input>
          </el-form-item>
          <el-form-item :label="$t('dictionary.group')" class="form--child">
            <el-select
              v-model="formData.dictType"
              :disabled="isDisabled"
              :placeholder="
                $t('placeholder.pleaseSelect', {
                  any: $t('dictionary.group'),
                })
              "
            >
              <el-option
                v-for="item in $store.state.dictManage.DICT_TYPE"
                v-show="item.value !== 1"
                :label="item.name"
                :value="item.value"
                :key="item.value"
                ><i class="iconfont icon-fenzuchangtai"></i
                >{{ item.name }}</el-option
              >
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="addDict__table">
        <p>{{ $t('dictionary.enumValue') }}</p>
        <dict-value-table
          ref="dictValueTable"
          class="addDict__tanble--main"
          :tableData.sync="formData.dictValue"
          :showSelection="false"
          :isEdit="!isEdit"
        ></dict-value-table>
      </div>
    </section>
  </apiot-drawer>
</template>

<script>
import { editDict, insertDict } from '@/api/dictManage';
import DictValueTable from '../DictValueTable';

export default {
  components: { DictValueTable },
  props: {
    // 当前页面类型：0-新增；1-编辑；2-查看
    currentPageType: {
      type: Number,
      default: 0
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表单数据
      formData: {},
      rules: {
        dictName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('dictionary.dictionaryEntry')
            }),
            trigger: 'change'
          }
        ]
      },
      showLoading: false,
      dictValueTableKey: ''
    };
  },
  computed: {
    drawerTitle() {
      const showTitleArry = ['common.add', 'common.edit', 'common.look'];
      return this.$t(showTitleArry[this.currentPageType], {
        name: this.$t('dictionary.dictionary')
      });
    },
    isEdit() {
      if (this.formData.dictType === 1) return true;
      return false;
    },
    isDisabled() {
      if (this.formData.dictType === 1) return true;
      if (this.formData.dictType === 6) return true;
      return false;
    }
  },
  methods: {
    // 初始化表单信息
    initFormData(row) {
      this.formData = { ...this.formData, ...row };
    },
    async addDictTables() {
      try {
        const logData = {
          dictName: {
            name: this.$t('dictionary.dictionaryEntry')
          },
          dictType: {
            name: this.$t('dictionary.group'),
            transFormArr: this.$store.getters.getCurDict('DICT_TYPE')
          },
          dictValue: {
            name: this.$t('dictionary.enumValue')
          }
        };
        const data = await insertDict({ ...this.formData, logData });
        this.$emit('addOrEditClick', { data, reload: true });
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('dictionary.dictionary') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        const dictNameError = error && error.dictName;
        this.$message.error(
          `${this.formData.dictName}${dictNameError || this.$t('dictionary.dictionary')}`
        );
      }
    },
    async editDictTables() {
      try {
        const logData = {
          dictKey: {
            name: this.$t('dictionary.kecode')
          },
          dictName: {
            name: this.$t('dictionary.dictionaryEntry')
          },
          dictType: {
            name: this.$t('dictionary.group'),
            transFormArr: this.$store.getters.getCurDict('DICT_TYPE')
          },
          dictValue: {
            name: this.$t('dictionary.enumValue')
          }
        };
        const data = await editDict({ ...this.formData, logData });
        this.$emit('addOrEditClick', { data, reload: true });
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('dictionary.dictionary') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        const dictNameError = error && error.dictName;
        this.$message.error(`${this.$t('dictionary.dictionary')}${dictNameError}`);
      }
    },
    sureClick() {
      if (this.formData.dictValue.length === 0) {
        // 枚举值不能为空
        this.$message.error(
          `${this.$t('common.notEmpty', { name: this.$t('dictionary.enumValue') })}`
        );
        this.showLoading = false;
        return false;
      }
      this.$refs.addDict.validate((valid) => {
        const dictValueTable = this.$refs.dictValueTable.verificationList();
        if (valid && dictValueTable) {
          this.showLoading = true;
          if (this.currentPageType === 0) {
            this.addDictTables();
          } else {
            this.$confirm(this.$t('dictionary.sureToUpdate'), this.$t('common.tip'), {
              confirmButtonText: this.$t('common.sure'),
              cancelButtonText: this.$t('common.cancle'),
              type: 'warning'
            })
              .then(() => {
                this.editDictTables();
              })
              .catch(() => {
                this.showLoading = false;
              });
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.addDict {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.addDict__header {
  flex-shrink: 0;
  padding: 10px 37px 0 37px;
  ::v-deep {
    .el-alert {
      height: auto;
      border: none !important;
    }

    .el-alert__title {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
    .el-alert__icon {
      font-size: 18px;
      width: 18px;
      color: #bbc3cd;
    }
  }
}
.addDict__table {
  flex: 1;
  height: 100%;
  padding: 0 37px;
  display: flex;
  flex-direction: column;
  p {
    flex-shrink: 0;
    height: 42px;
    line-height: 42px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
    border-bottom: 1px solid #ebebeb;
  }
  &--main {
    flex: 1 1 0;
  }
}
// 字体图标颜色更改
.icon-fenzuchangtai {
  font-size: 22px;
  color: #fab71c;
  margin-right: 10px;
}
</style>
