<!-- 添加或者编辑字段 -->
<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :title="drawerTitle"
    @sure-click="sureClick"
    :loading.sync="showLoading"
  >
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      class="form"
      ref="addColumn"
    >
      <div class="form--line">
        <el-form-item
          :label="$t('common.name', { name: $t('entity.column') })"
          class="form--child"
          prop="columnName"
        >
          <apiot-input
            maxlength="30"
            v-model="formData.columnName"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                name: $t('entity.column'),
              })
            "
          ></apiot-input>
        </el-form-item>
        <el-form-item :label="this.$t('entity.isRequired')" class="form--child">
          <el-radio-group v-model="formData.requisiteDict">
            <el-radio
              :label="item.value"
              :key="item.value"
              v-for="item in $store.state.dictManage.REQUISITE_TYPE"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item :label="this.$t('common.type')" class="form--child">
          <el-select
            v-model="formData.columnTypeDict"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                name: $t('common.type'),
              })
            "
            @change="typesChange"
          >
            <el-option
              v-for="item in $store.state.dictManage.COLUMNS_TYPE.filter(
                (item) => item.value <= 5
              )"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('entity.defalutValue')"
          class="form--child"
          prop="defaultValue"
        >
          <span class="span-box" slot="label">
            <span> {{ $t('entity.defalutValue') }} </span>
            <el-tooltip
              content="decimal(m,n)类型小数位数有n位长度限制"
              placement="top"
              v-if="formData.columnTypeDict === 4"
            >
              <i class="iconfont icon-bangzhu" style="font-weight: normal" />
            </el-tooltip>
          </span>
          <apiot-input
            :disabled="noLimitArr.includes(formData.columnTypeDict)"
            v-model="formData.defaultValue"
            :placeholder="
              noLimitArr.includes(formData.columnTypeDict)
                ? $t('entity.noDefault')
                : $t('entity.enterDefault')
            "
            :maxlength="getMaxLength"
            @keydown.native="defalutInput"
          ></apiot-input>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item :label="$t('entity.length')" class="form--child">
          <el-select
            v-model="formData.columnLengthId"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                name: $t('entity.length'),
              })
            "
            @change="lengthChange($event, true)"
            :disabled="noLimitArr.includes(formData.columnTypeDict)"
          >
            <el-option
              v-for="item in lengthArr[this.formData.columnTypeDict - 1]"
              :key="item.id"
              :label="
                item.columnLength === '0'
                  ? $t('entity.noLimited')
                  : item.columnLength
              "
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('common.remark', { name: '' })"
          class="form--child"
          prop="memo"
        >
          <apiot-input
            v-model="formData.memo"
            :isForbid="false"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                name: $t('common.remark', { name: '' }),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
      <div
        class="form--line"
        v-if="[1, 2, 5].includes(formData.columnTypeDict)"
      >
        <el-form-item label="字典表" class="form--child half">
          <filterable-input
            ref="filterableInput"
            placeholder="请选择字典"
            :showInfo="dictObj"
            :hasPagination="true"
            :dialogType="3"
            @selectRes="selectDict"
          ></filterable-input>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import { addColumns, listColumnsLength, modifyColumns } from '@/api/entityManage';
import { getDictList } from '@/api/dictManage';
import bus from '@/utils/bus';

export default {
  props: {
    // 当前是新增还是编辑
    curDrawerType: {
      type: Number,
      default: 1
    },
    // 当前表名
    tableName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showLoading: false,
      // 表单数据
      formData: {
        columnName: '',
        memo: '',
        requisiteDict: 2,
        columnTypeDict: 1,
        defaultValue: '',
        columnLengthId: 0,
        typeDict: 2
      },
      dictObj: {
        dictKey: ''
      },
      currentLength: '0',
      lengthArr: [],

      decimalPlace: 0, // 小数位数
      noLimitArr: [3, 5, 6],
      dictArr: []
    };
  },

  components: {},

  computed: {
    drawerTitle() {
      return this.curDrawerType === 1
        ? this.$t('common.add', { name: this.$t('entity.column') })
        : this.$t('common.edit', { name: this.$t('entity.column') });
    },
    getMaxLength() {
      if (this.currentLength === '0') {
        return '';
      }
      if (Number.isNaN(+this.currentLength)) {
        const tempArr = this.currentLength.split(',');
        return +tempArr[0] + 1;
      }

      return +this.currentLength;
    },
    rules() {
      return {
        columnName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAnyName', {
              name: this.$t('entity.column')
            }),
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^[_a-z]+$/,
            // message: '字段名称只支持小写字母和下划线',
            message: this.$t('entity.onlySupportLess', {
              name: this.$t('common.name', { name: this.$t('entity.column') })
            }),
            trigger: 'change'
          }
        ],
        memo: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('common.remark', { name: '' })
            }),
            trigger: 'change'
          }
        ],
        defaultValue: [{ validator: this.validateDefault, trigger: ['change', 'blur'] }]
      };
    }
  },

  mounted() {
    this.listColumnsLength();
  },

  methods: {
    // 初始话dict
    async initDict(dictKey) {
      this.dictObj.dictKey = dictKey;
      if (this.dictArr.length === 0) {
        this.dictArr = await getDictList({ keywords: '' });
      }
      this.dictObj = this.dictArr.find((item) => item.dictKey === dictKey);
    },
    // 字典选择结果
    async selectDict(dict) {
      if (this.dictObj && dict.id === this.dictObj.id) {
        return;
      }
      this.dictObj = dict;
    },
    // 初始化表单数据
    initFormData(row) {
      // console.log(row);
      this.formData = {
        id: row.id || -1,
        columnName: row.columnName || '',
        memo: row.memo || '',
        requisiteDict: row.requisiteDict || 2,
        columnTypeDict: row.columnTypeDict || 1,
        defaultValue: row.defaultValue || '',
        columnLengthId: row.columnLengthId,
        typeDict: row.typeDict
      };
      this.initDict(row.bindDictKey);
      this.listColumnsLength(row.columnLengthId);
    },
    validateDefault(rule, value, callback) {
      if (!value) {
        callback();
      }
      switch (this.formData.columnTypeDict) {
        case 2: {
          callback();
          break;
        }
        case 1: {
          if (!/^[0-9]+$/.test(value)) {
            callback(
              new Error(this.$t('placeholder.pleaseEnterAny', { any: this.$t('common.number') }))
            );
          } else {
            callback();
          }
          break;
        }
        case 4: {
          const reg = new RegExp('^[0-9]+[.]{1}[0-9]+$');
          if (!reg.test(value)) {
            // callback(new Error(`请输入小数,且小数位数为${this.decimalPlace}位`));
            callback(new Error(this.$t('entity.decimalTip')));
          } else {
            callback();
          }
          break;
        }
        default: {
          callback();
        }
      }
    },
    // 输入小数时，默认值限制
    defalutInput(e) {
      if (this.formData.columnTypeDict === 4) {
        const arr = this.formData.defaultValue.split('.');
        const tempArr = this.currentLength.split(',');
        if (arr.length === 2 && arr[1].length === +tempArr[1]) {
          if (e.keyCode !== 8) {
            e.preventDefault();
          }
          return false;
        }
      }
    },
    sureClick() {
      this.$refs.addColumn.validate((valid) => {
        if (valid) {
          this.showLoading = true;
          if (this.curDrawerType === 1) {
            this.addColumns();
          } else {
            this.modifyColumns();
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 新增字段
    async addColumns() {
      try {
        const params = {
          ...this.formData,
          bindDictKey: [1, 2, 5].includes(this.formData.columnTypeDict)
            ? this.dictObj
              ? this.dictObj.dictKey
              : ''
            : '',
          tableName: this.tableName,
          logData: {
            operateType: 1,
            columnName: {
              name: this.$t('entity.fieldTable.columnName')
            },
            memo: {
              name: this.$t('entity.fieldTable.memo')
            },
            requisiteDict: {
              name: this.$t('entity.fieldTable.requisiteDict'),
              transFormArr: this.$store.getters.getCurDict('REQUISITE_TYPE')
            },
            defaultValue: {
              name: this.$t('entity.fieldTable.defaultValue')
            },
            columnTypeDict: {
              name: this.$t('entity.fieldTable.columnTypeDict'),
              transFormArr: this.$store.getters.getCurDict('COLUMNS_TYPE')
            },
            columnLengthId: {
              name: this.$t('entity.fieldTable.columnLength'),
              value: 'id',
              key: 'columnLength',
              transFormArr: this.lengthArr[this.formData.columnTypeDict - 1]
            }
          }
        };
        const data = await addColumns(params);
        this.$emit('update:visible', false);
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('entity.column') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.columnName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('entity.column') })} ${
              error.columnName
            }`
          });
        }
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    // 编辑字段
    async modifyColumns() {
      try {
        const params = {
          ...this.formData,
          bindDictKey: [1, 2, 5].includes(this.formData.columnTypeDict)
            ? this.dictObj
              ? this.dictObj.dictKey
              : ''
            : '',
          tableName: this.tableName,
          logData: {
            operateType: 2,
            columnName: {
              name: this.$t('entity.fieldTable.columnName')
            },
            memo: {
              name: this.$t('entity.fieldTable.memo')
            },
            requisiteDict: {
              name: this.$t('entity.fieldTable.requisiteDict'),
              transFormArr: this.$store.getters.getCurDict('REQUISITE_TYPE')
            },
            defaultValue: {
              name: this.$t('entity.fieldTable.defaultValue')
            },
            columnTypeDict: {
              name: this.$t('entity.fieldTable.columnTypeDict'),
              transFormArr: this.$store.getters.getCurDict('COLUMNS_TYPE')
            },
            columnLengthId: {
              name: this.$t('entity.fieldTable.columnLength'),
              value: 'id',
              key: 'columnLength',
              transFormArr: this.lengthArr[this.formData.columnTypeDict - 1]
            }
          }
        };
        const data = await modifyColumns(params);
        this.$emit('update:visible', false);
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('entity.column') })
          })
        });
      } catch (error) {
        console.log(error);
        this.showLoading = false;
        if (error.columnName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('entity.column') })} ${
              error.columnName
            }`
          });
        }
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    async listColumnsLength(lengthId) {
      // 获取长度数组
      if (!this.lengthArr[this.formData.columnTypeDict - 1]) {
        const data = await listColumnsLength({ columnType: this.formData.columnTypeDict });
        if (this.formData.columnTypeDict === 4) {
          data.forEach((item) => {
            // 小数时，长度为 整数长度 加. 加小数长度
            item.columnLength = `${+item.columnLength},${item.decimalPlace}`;
          });
        }
        this.$set(this.lengthArr, this.formData.columnTypeDict - 1, data);
      }
      // 初始化长度id和长度值
      if (lengthId) {
        this.lengthChange(lengthId);
      } else {
        const lengArr = this.lengthArr[this.formData.columnTypeDict - 1];
        this.formData.columnLengthId = lengArr[0].id;
        this.currentLength = lengArr[0].columnLength;
        // 初始化小数位数
        if (this.formData.columnTypeDict === 4) {
          this.decimalPlace = lengArr[0].decimalPlace;
        }
      }
    },
    // 类型改变
    typesChange() {
      // console.log(12312);
      this.listColumnsLength();
      this.formData.defaultValue = '';
    },
    // 长度改变
    lengthChange(v, flag) {
      const tempLengthArr = this.lengthArr[this.formData.columnTypeDict - 1];
      const index = tempLengthArr.findIndex((item) => item.id === v);
      this.currentLength = tempLengthArr[index].columnLength;
      if (this.formData.columnTypeDict === 4) {
        this.decimalPlace = tempLengthArr[index].decimalPlace;
        // this.$refs.addColumn.validateField('defaultValue');
      }
      if (flag) {
        this.formData.defaultValue = '';
      }
    },
    // 重置数据
    resetForm() {
      this.formData = {
        columnName: '',
        memo: '',
        requisiteDict: 2,
        columnTypeDict: 1,
        defaultValue: '',
        columnLengthId: 0
      };
      this.dictObj = {
        dictKey: ''
      };
      this.listColumnsLength();
      this.$refs.addColumn.resetFields();
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
