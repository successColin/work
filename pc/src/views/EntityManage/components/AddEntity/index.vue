<!-- 添加或者编辑entity -->
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
      ref="addEntity"
    >
      <div class="form--line">
        <el-form-item
          :label="$t('common.name', { name: '' })"
          class="form--child"
          prop="tableName"
          ref="entity-form"
        >
          <apiot-input
            v-model="formData.tableName"
            maxlength="27"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                name: $t('entity.entity'),
              })
            "
            slotType="prepend"
          >
            <template slot="prepend">ct_</template></apiot-input
          >
        </el-form-item>
        <el-form-item :label="$t('common.type')" class="form--child">
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
              :label="item.name"
              :value="item.value"
              v-for="item in $store.state.dictManage.TABLES_TYPE"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('common.remark', { name: $t('entity.entity') })"
          class="form--child"
          prop="memo"
        >
          <apiot-input
            v-model="formData.memo"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('common.remark', { name: $t('entity.entity') }),
              })
            "
          ></apiot-input>
        </el-form-item>
        <el-form-item
          :label="$t('entity.belongingToTheGroup')"
          class="form--child"
        >
          <el-select
            v-model="formData.groupId"
            :placeholder="
              $t('placeholder.pleaseSelect', {
                name: $t('entity.belongingToTheGroup'),
              })
            "
            :disabled="curDrawerType === 1"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in groupArr"
              :key="item.id"
            >
              <i class="iconfont icon-fenzuchangtai"></i>{{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('entity.isTree')"
          class="form--child"
          v-if="curDrawerType === 1"
        >
          <apiot-switch
            v-model="formData.treeDict"
            :activeValue="1"
            :inactivevalue="2"
          ></apiot-switch>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import { addSysEntityTables, editSysEntityTables } from '@/api/entityManage';

export default {
  props: {
    // 当前是新增还是编辑
    curDrawerType: {
      type: Number,
      default: 1
    },
    // 当前分组
    groupId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 表单数据
      formData: {
        id: -1,
        tableName: '',
        typeDict: 2,
        groupId: this.groupId,
        memo: '',
        treeDict: 2
      },

      showLoading: false
    };
  },

  components: {},

  computed: {
    drawerTitle() {
      return this.curDrawerType === 1
        ? this.$t('common.add', { name: this.$t('entity.entity') })
        : this.$t('common.edit', { name: this.$t('entity.entity') });
    },
    groupArr() {
      return this.$store.state.entityManage.entityGroup.slice(1);
    },
    rules() {
      return {
        tableName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAnyName', {
              name: this.$t('entity.entity')
            }),
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^[_a-z]+$/,
            // message: '实体名称只支持小写字母和下划线',
            message: this.$t('entity.onlySupportLess', {
              name: this.$t('common.name', { name: this.$t('entity.entity') })
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
        tableName: row.tableName ? row.tableName.slice(3) : '',
        typeDict: row.typeDict || 2,
        groupId: row.groupId || 1,
        memo: row.memo || '',
        treeDict: row.treeDict || 2
      };
    },
    // 确认按钮
    sureClick() {
      this.$refs.addEntity.validate((valid) => {
        if (valid) {
          this.showLoading = true;
          if (this.curDrawerType === 1) {
            this.addSysEntityTables();
          } else {
            this.editSysEntityTables();
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 新增数据
    async addSysEntityTables() {
      try {
        const params = {
          ...this.formData,
          tableName: `ct_${this.formData.tableName}`,
          logData: {
            operateType: 1,
            tableName: {
              name: this.$t('entity.entityTable.tableNameLabel')
            },
            typeDict: {
              name: this.$t('entity.entityTable.typeDictLabel'),
              transFormArr: this.$store.getters.getCurDict('TABLES_TYPE')
            },
            groupId: {
              name: this.$t('entity.belongingToTheGroup'),
              value: 'id',
              transFormArr: this.groupArr
            },
            memo: {
              name: this.$t('entity.entityTable.memoLabel')
            }
          }
        };
        const data = await addSysEntityTables(params);
        this.$emit('update:visible', false);
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('entity.entity') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.tableName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('entity.entity') })} ${
              error.tableName
            }`
          });
        }
        if (error.code === 'TG0002') {
          this.$emit('update:visible', false);
          this.$emit('resetGroup');
        }
      }
    },
    // 编辑数据
    async editSysEntityTables() {
      try {
        const params = {
          ...this.formData,
          tableName: `ct_${this.formData.tableName}`,
          logData: {
            operateType: 2,
            tableName: {
              name: this.$t('entity.entityTable.tableNameLabel')
            },
            typeDict: {
              name: this.$t('entity.entityTable.typeDictLabel'),
              transFormArr: this.$store.getters.getCurDict('TABLES_TYPE')
            },
            groupId: {
              name: this.$t('entity.belongingToTheGroup'),
              value: 'id',
              transFormArr: this.groupArr
            },
            memo: {
              name: this.$t('entity.entityTable.memoLabel')
            }
          }
        };
        const data = await editSysEntityTables(params);
        this.$emit('update:visible', false);
        this.$emit('addOrEditClick', data);
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('entity.entity') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.tableName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('entity.entity') })} ${
              error.tableName
            }`
          });
        }
      }
    },
    // 重置数据
    resetForm() {
      this.formData = {
        id: -1,
        tableName: '',
        typeDict: 2,
        groupId: this.groupId,
        memo: ''
      };
      this.$refs.addEntity.resetFields();
    }
  }
};
</script>

<style lang='scss' scoped>
// 字体图标颜色更改
.icon-fenzuchangtai {
  font-size: 22px;
  color: #fab71c;
  margin-right: 10px;
}
</style>
