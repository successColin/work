<!-- 添加或者编辑 索引 -->
<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :loading.sync="showLoading"
    :title="drawerTitle"
    @sure-click="sureClick"
  >
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      :rules="rules"
      class="form"
      ref="addIndex"
    >
      <div class="form--line">
        <el-form-item
          :label="$t('common.name', { name: $t('entity.indexes') })"
          class="form--child"
          prop="indexesName"
        >
          <apiot-input
            maxlength="24"
            v-model="formData.indexesName"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                name: $t('entity.indexes'),
              })
            "
            slotType="prepend"
          >
            <template slot="prepend">index_</template>
          </apiot-input>
        </el-form-item>
        <el-form-item :label="this.$t('entity.isExecuted')" class="form--child">
          <el-radio-group v-model="formData.enabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('common.name', { name: $t('entity.column') })"
          class="form--child"
          prop="multiStr"
        >
          <apiot-input :value="formData.multiStr" v-show="false"></apiot-input>
          <multi-form-item
            :itemTheme="1"
            :multiStr.sync="multiStr"
            :multiArr.sync="multiArr"
            @multiSelect="showMultiSelect"
            @getSearchResArr="getSearchResArr"
            showProp="columnName"
            :resArr="resArr"
          >
            <template v-slot:dialog>
              <multi-dialog
                ref="multiDialog"
                :visible.sync="multiVisible"
                :multiVisible="multiVisible"
                :itemTheme="1"
                :multiStr.sync="multiStr"
                :multiArr.sync="multiArr"
              ></multi-dialog>
            </template>
          </multi-form-item>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item :label="this.$t('common.type')" class="form--child">
          <el-select
            v-model="formData.typeDict"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                name: $t('common.type'),
              })
            "
            disabled
          >
            <el-option
              v-for="item in $store.state.dictManage.INDEXES_TYPE"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('entity.indexMethod')" class="form--child">
          <el-select
            v-model="formData.methodDict"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                name: $t('entity.method'),
              })
            "
            disabled
          >
            <el-option
              v-for="item in $store.state.dictManage.INDEXES_METHOD"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('common.remark', { name: '' })"
          class="form--child"
          prop="memo"
        >
          <apiot-input
            v-model="formData.memo"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                name: $t('common.remark', { name: '' }),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import { addSysIndexes, listSysEntityColumns, modifyIndexes } from '@/api/entityManage';
import bus from '@/utils/bus';
import MultiDialog from '../../MultiDialog';

export default {
  props: {
    curDrawerType: {
      type: Number,
      default: 1
    },
    // 当前表名
    tableName: {
      type: String,
      default: ''
    },
    tableMemo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showLoading: false,
      // 表单数据
      formData: {
        id: -1,
        indexesName: '',
        enabled: 2,
        memo: '',
        typeDict: 1,
        methodDict: 1,
        multiStr: ''
      },

      // 多选字符串
      multiStr: '',
      // 多选数组
      multiArr: [],
      // 是否显示多选
      multiVisible: false,
      resArr: [] // 搜索结果数据
    };
  },

  components: {
    MultiDialog
  },

  computed: {
    drawerTitle() {
      return this.curDrawerType === 1
        ? this.$t('common.add', { name: this.$t('entity.indexes') })
        : this.$t('common.delete', { name: this.$t('entity.indexes') });
    },
    rules() {
      return {
        indexesName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAnyName', {
              name: this.$t('entity.indexes')
            }),
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^[_a-z]+$/,
            // message: '索引名称只支持小写字母和下划线',
            message: this.$t('entity.onlySupportLess', {
              name: this.$t('common.name', { name: this.$t('entity.indexes') })
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
        multiStr: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('entity.column')
            }),
            trigger: 'change'
          }
        ]
      };
    }
  },

  mounted() {},

  methods: {
    // 初始化表单数据
    initFormData(row) {
      this.formData = {
        id: row.id || -1,
        // indexesName: row.indexesName || '',
        indexesName: row.indexesName ? row.indexesName.slice(6) : '',
        enabled: row.enabled || 2,
        memo: row.memo || '',
        typeDict: row.typeDict || 1,
        methodDict: row.methodDict || 1,
        multiStr: row.columnName || ''
      };

      this.multiStr = row.columnName || '';
      if (row.columnIds) {
        const arr = this.multiStr.split(',');
        row.columnIds.split(',').forEach((item, index) => {
          this.multiArr.push({ id: item, columnName: arr[index] });
        });
      }
    },
    // 新增编辑弹窗层的确认
    sureClick() {
      this.$refs.addIndex.validate((valid) => {
        if (valid) {
          if (!this.multiStr) {
            this.showLoading = false;
            return this.$message({
              type: 'warning',
              message: this.$t('placeholder.pleaseSelect', {
                any: this.$t('entity.column')
              })
            });
          }
          this.showLoading = true;
          if (this.curDrawerType === 1) {
            this.addSysIndexes();
          } else {
            this.modifyIndexes();
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    async addSysIndexes() {
      try {
        const tempArr = [];
        this.multiArr.forEach((item) => {
          tempArr.push(item.id);
        });
        // console.log(this.multiArr);
        const params = {
          ...this.formData,
          tableName: this.tableName,
          columnIds: tempArr.join(','),
          indexesName: `index_${this.formData.indexesName}`,
          logData: {
            operateType: 1,
            indexesName: {
              name: this.$t('entity.indexesTable.indexesName')
            },
            memo: {
              name: this.$t('entity.indexesTable.memo')
            },
            columnIds: {
              name: this.$t('entity.indexesTable.columnName'),
              key: 'columnName',
              transFormArr: this.multiArr
            },
            typeDict: {
              name: this.$t('entity.indexesTable.typeDict'),
              transFormArr: this.$store.getters.getCurDict('INDEXES_TYPE')
            },
            methodDict: {
              name: this.$t('entity.indexesTable.methodDict'),
              transFormArr: this.$store.getters.getCurDict('INDEXES_METHOD')
            },
            enabled: {
              name: this.$t('entity.indexesTable.isExecuted'),
              transFormArr: [
                { name: '是', value: 1 },
                { name: '否', value: 2 }
              ]
            }
          }
        };
        const data = await addSysIndexes(params);
        this.$emit('update:visible', false);
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('entity.indexes') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.indexesName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('entity.indexes') })} ${
              error.indexesName
            }`
          });
        }
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    // 编辑索引
    async modifyIndexes() {
      try {
        const tempArr = [];
        this.multiArr.forEach((item) => {
          tempArr.push(item.id);
        });
        const params = {
          ...this.formData,
          tableName: this.tableName,
          columnIds: tempArr.join(','),
          indexesName: `index_${this.formData.indexesName}`,
          logData: {
            operateType: 2,
            indexesName: {
              name: this.$t('entity.indexesTable.indexesName')
            },
            memo: {
              name: this.$t('entity.indexesTable.memo')
            },
            columnIds: {
              name: this.$t('entity.indexesTable.columnName'),
              key: 'columnName',
              transFormArr: this.multiArr
            },
            typeDict: {
              name: this.$t('entity.indexesTable.typeDict'),
              transFormArr: this.$store.getters.getCurDict('INDEXES_TYPE')
            },
            methodDict: {
              name: this.$t('entity.indexesTable.methodDict'),
              transFormArr: this.$store.getters.getCurDict('INDEXES_METHOD')
            },
            enabled: {
              name: this.$t('entity.indexesTable.isExecuted'),
              transFormArr: [
                { name: '是', value: 1 },
                { name: '否', value: 2 }
              ]
            }
          }
        };
        const data = await modifyIndexes(params);
        this.$emit('update:visible', false);
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('entity.indexes') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.indexesName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('entity.indexes') })} ${
              error.indexesName
            }`
          });
        }
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    showMultiSelect() {
      this.multiVisible = true;
      this.$nextTick(() => {
        this.$refs.multiDialog.getTableData(
          this.tableName,
          this.tableMemo,
          this.multiStr,
          this.multiArr
        );
      });
    },
    // 重置数据
    resetForm() {
      this.formData = {
        id: -1,
        indexesName: '',
        enabled: 2,
        memo: '',
        typeDict: 1,
        methodDict: 1,
        multiStr: ''
      };
      this.multiStr = '';
      this.multiArr = [];
      this.$refs.addIndex.resetFields();
    },
    getSearchResArr(v) {
      this.getColumnList(v);
    },
    async getColumnList(v) {
      try {
        this.showLoading = true;
        const params = {
          keywords: v,
          tableName: this.tableName
          // typeDict: 2
        };
        const data = await listSysEntityColumns(params);
        this.resArr = data;
        // console.log(data);
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    }
  },

  watch: {
    multiStr(v) {
      this.formData.multiStr = v;
      // console.log(this.formData.multiStr);
    }
  }
};
</script>

<style lang='scss' scoped>
.notShowError {
  ::v-deep {
    .el-form-item__error {
      display: none;
    }
  }
}
</style>
