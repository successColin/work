/** * @name: synchronism * @author: DELL * @date: 2023/3/1 14:34 *
@description：synchronism * @update: 2023/3/1 14:34 */
<!-- 页面 -->
<template>
  <div class="synchronism">
    <div class="synchronism__header">
      <apiot-button @click="add">
        <i class="iconfont icon-xinzeng m-r-4"></i> 添加实体表
      </apiot-button>
    </div>
    <div class="synchronism__list">
      <div
        class="synchronism__list--item"
        v-for="item in info.commonApiMappingTables"
        :key="item.key"
      >
        <div class="synchronism__list--header">
          <div class="synchronism__list--left">
            <div class="iconfont icon-shujubiao m-r-10"></div>
            <div class="synchronism__list--info">
              <div class="synchronism__info--name" style="margin-bottom: 3px">
                <span class="synchronism__info--title m-r-4">{{
                  item.tableName
                }}</span>
                <span class="iconfont icon-bianji" @click="edit(item)"></span>
              </div>
              <div class="synchronism__info--other">
                <span class="synchronism__info--des">唯一键组合：</span>
                <span class="synchronism__info--title m-r-10">{{
                  item.columnName
                }}</span>
                <span class="synchronism__info--des">权限：</span>
                <span class="synchronism__info--title">{{
                  getAuthName(item.tableAuth)
                }}</span>
              </div>
            </div>
          </div>
          <div>
            <apiot-button @click="addFiled(item)">
              <i class="iconfont icon-xinzeng"></i> 添加字段
            </apiot-button>
            <span class="iconfont icon-guanbi" @click="delConfig(item)"></span>
          </div>
        </div>
        <div class="synchronism__list--table">
          <el-table border :data="item.filedJson" style="width: 100%">
            <el-table-column type="index" width="40"> </el-table-column>
            <el-table-column prop="fieldName" label="字段名">
              <template slot-scope="scope">
                <!--                <el-select placeholder="请选择字段" v-model="scope.row.fieldName">-->
                <!--                  <el-option-->
                <!--                      :key="item.columnName"-->
                <!--                      :label="`${item.columnName}`"-->
                <!--                      :value="item.columnName"-->
                <!--                      v-for="item in getTableFieldSet(item)"-->
                <!--                  >-->
                <!--                  </el-option>-->
                <!--                </el-select>-->
                <filterable-input
                  placeholder="请选择字段"
                  :tableArr="getTableFieldSet(item)"
                  :showInfo="{ columnName: scope.row.fieldName }"
                  :dialogType="2"
                  :tableName="item.tableName"
                  @selectRes="selectColumnRes($event, item, scope.row)"
                ></filterable-input>
              </template>
            </el-table-column>
            <el-table-column prop="attrName" label="属性名">
              <template slot-scope="scope">
                <el-select
                  placeholder="请选择属性名"
                  v-model="scope.row.attrName"
                >
                  <el-option
                    :label="name"
                    :value="name"
                    :key="name"
                    v-for="name in fieldArr"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="defaultValue" label="默认值">
              <template slot-scope="scope">
                <apiot-input
                  placeholder="请输入默认值"
                  v-model="scope.row.defaultValue"
                />
              </template>
            </el-table-column>
            <el-table-column prop="isReturn" label="返回">
              <template slot-scope="scope">
                <apiot-switch
                  v-model="scope.row.isReturn"
                  :activeValue="1"
                  :inactivevalue="0"
                ></apiot-switch>
              </template>
            </el-table-column>
            <el-table-column prop="opea" width="150" label="操作">
              <template slot-scope="scope">
                <div class="dataConver">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="数据转换"
                    placement="left"
                  >
                    <span
                      @click="editDataConver(scope.row, item, scope.$index)"
                      :class="{ active: isActive(scope.row) }"
                      class="icon-shujuzhuanhuan iconfont"
                    ></span>
                  </el-tooltip>
                  <span
                    class="iconfont icon-shanchu"
                    @click="del(item, scope.$index)"
                  ></span>
                </div>
              </template>
            </el-table-column>
            <template v-slot:empty>
              <el-empty
                :image="require('@/assets/img/nodata.png')"
                :image-size="120"
              ></el-empty>
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listSysEntityColumns } from '@/api/entityManage';

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },
    fieldArr: {
      // 字段列表
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      tableFieldSet: {}, // 所有表字段集合
    };
  },

  components: {},

  computed: {
    isActive() {
      return function ({
        transformType,
        tableName,
        keycodeField,
        idFiled,
        sqlScript,
      }) {
        if (transformType === 0) return tableName && keycodeField && idFiled;
        if (transformType === 1) return !!sqlScript;
        return false;
      };
    },
    getTableFieldSet() {
      return function ({ tableName }) {
        return this.tableFieldSet[tableName] || [];
      };
    },
    getAuthName() {
      return function (key) {
        const n = +key;
        const obj = {
          0: '全部',
          1: '新增',
          2: '编辑',
        };
        if (obj[n]) {
          return obj[n];
        }
        return '无';
      };
    },
  },

  mounted() {
    this.$bus.$off('sureTableClick').$on('sureTableClick', (message) => {
      this.updateInfo(message);
    });
    this.$bus
      .$off('sureClickInDataConverDialog')
      .$on('sureClickInDataConverDialog', (message) => {
        this.updateSynchronism(message);
      });
    this.initFields();
  },

  methods: {
    initFields() {
      // 初始化所有表字段
      this.info.commonApiMappingTables.forEach(async (item) => {
        const { tableName } = item;
        const res = await listSysEntityColumns({
          keywords: '',
          tableName,
        });
        this.$set(this.tableFieldSet, tableName, res);
      });
    },
    addFiled(item) {
      item.filedJson.push({
        fieldName: '',
        attrName: '',
        defaultValue: '',
        isReturn: 1,
        transformType: 0,
        tableName: '',
        keycodeField: '',
        idFiled: '',
        sqlScript: '',
      });
    },
    delConfig(item) {
      // 删除配置
      this.$confirm(`将删除${item.tableName}实体表等配置, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const i = this.info.commonApiMappingTables.findIndex(
          (items) => items.key === item.key,
        );
        this.info.commonApiMappingTables.splice(i, 1);
      });
    },
    del(item, i) {
      item.filedJson.splice(i, 1);
    },
    add() {
      // 新增配置
      this.$bus.$emit('addInfoToTable', {
        type: 'add',
        opeaItem: {
          columnName: '',
          tableAuth: '1',
          tableName: '',
        },
      });
    },
    edit(item) {
      // 编辑配置
      this.$bus.$emit('addInfoToTable', {
        type: 'edit',
        opeaItem: item,
      });
    },
    editDataConver(row, sourceData, index) {
      this.$bus.$emit('editDataConver_inApi', {
        ...row,
        sourceDataKey: sourceData.key,
        rowIndex: index,
      });
    },
    selectColumnRes(v, item, row) {
      row.fieldName = v.columnName;
    },
    updateInfo({ type, value, options = [] }) {
      const { tableName, ...rest } = value;
      if (
        !this.tableFieldSet[tableName] ||
        !this.tableFieldSet[tableName].length
      ) {
        this.$set(this.tableFieldSet, tableName, options);
      }
      if (type === 'add') {
        const key = new Date().getTime();
        this.info.commonApiMappingTables.push({
          key,
          ...rest,
          tableName,
          filedJson: [],
        });
      }
      if (type === 'edit') {
        const i = this.info.commonApiMappingTables.findIndex(
          (item) => item.key === value.key,
        );
        this.info.commonApiMappingTables.splice(i, 1, value);
      }
    },
    updateSynchronism({ sourceDataKey, rowIndex, ...rest }) {
      // eslint-disable-next-line max-len
      const Obj = this.info.commonApiMappingTables.find(
        (items) => items.key === sourceDataKey,
      );
      const newObj = Obj.filedJson[rowIndex] || {};
      Obj.filedJson.splice(rowIndex, 1, { ...newObj, ...rest });
    },
  },
  beforeDestroy() {
    this.$bus.$off('sureTableClick');
  },
  name: 'synchronism',
};
</script>

<style lang="scss" scoped>
.synchronism {
  width: 100%;

  .synchronism__header {
    height: 42px;
    line-height: 42px;
  }

  .icon-xinzeng {
    color: #4689f5;
  }

  .icon-guanbi {
    margin-left: 20px;
    color: #bbc3cd;
    cursor: pointer;

    &:hover {
      color: #4689f5;
    }
  }

  .synchronism__list {
    .synchronism__list--item {
      //height: 184px;
      padding: 0 10px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;

      ::v-deep {
        .el-table::before {
          display: none;
        }

        .el-table .cell {
          height: 40px;
          line-height: 40px;
        }

        .el-select {
          width: 100%;
        }

        .filterableInput {
          width: 100%;
        }

        .filterableInput__con .icon-jiahao {
          top: 5px;
        }

        .filterableInput__result {
          top: 4px;
        }
      }
    }

    .synchronism__list--header {
      height: 54px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .synchronism__list--left {
      display: flex;
      height: 28px;
      align-items: center;

      .icon-shujubiao {
        width: 28px;
        height: 28px;
        color: #ffffff;
        background: #5a80ed;
        border-radius: 6px;
        text-align: center;
      }
    }

    .synchronism__list--info {
      height: 36px;
    }

    .synchronism__info--name {
      height: 16px;
      line-height: 16px;

      .icon-bianji {
        color: #bbc3cd;
        cursor: pointer;

        &:hover {
          color: #4689f5;
        }
      }
    }

    .synchronism__info--other {
      height: 14px;
      line-height: 14px;
    }

    .synchronism__info--title {
      height: 16px;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
    }

    .synchronism__info--des {
      height: 14px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      line-height: 14px;
    }

    .synchronism__info--other .synchronism__info--title {
      font-size: 12px;
    }

    .dataConver {
      display: flex;
      align-items: center;
      .iconfont {
        color: #bbc3cd;
        cursor: pointer;
        &.active {
          background: #34c7be;
          color: #ffffff;
          border-radius: 4px;
          &:hover {
            color: #ffffff;
          }
        }
        &:hover {
          color: #4689f5;
        }
      }

      .icon-shujuzhuanhuan {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 16px;
        text-align: center;
        line-height: 20px;
      }
    }
  }
}
</style>
