<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.compId"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span>
          {{ configData.name }}
        </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
    </template>
    <div slot-scope="scope" style="width: 100%; height: 36px">
      <SelectBox
        :curData="scope.row"
        :getIdCompId="getIdCompId"
        :multiEntityArr="multiEntityArr"
        v-if="
          !(
            areaData.lineEditable &&
            showCell === `${scope.column.id}_${scope.row.unique}`
          )
        "
        v-on="$listeners"
        v-bind="$attrs"
      ></SelectBox>
      <div class="column__notEditable switchBox">
        <el-switch
          class="switchBox__switch"
          :class="[{ notShowContent: !configData.showContent }]"
          v-model="scope.row[configData.compId]"
          :disabled="configData.canReadonly"
          active-text="是"
          inactive-text="否"
          :active-value="configData.activeValue"
          :inactive-value="configData.inactiveValue"
          @change="switchChange(scope.row, scope)"
        >
        </el-switch>
      </div>
    </div>
  </el-table-column>
</template>

<script>
import { singleSave } from '@/api/menuConfig';
import { Encrypt } from '@/utils/utils';
import tableCol from '../tableCol';

export default {
  props: {
    getIdCompId: {
      type: String,
    },
    multiEntityArr: {
      type: Array,
      default: () => [],
    },
  },
  name: '',
  mixins: [tableCol],
  data() {
    return {};
  },
  computed: {},
  components: {},
  created() {},
  methods: {
    resolveParams(row) {
      const { userInfo } = this.$store.state.userCenter;
      let logContent = `${userInfo.username}(${userInfo.account}):`;
      const params = {
        formInfo: [],
        removeFileIds: '',
        tableName: this.grandFather.tableInfo.tableName,
        menuId: this.$route.params.id || this.$route.query.menuId,
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId,
        },
      };
      params.formInfo = [
        {
          columnName: 'id',
          columnType: 2,
          columnValue: row[this.getIdCompId],
          compType: 15,
          compId: this.getIdCompId,
          sysMenuDesignId: this.sysMenuDesignId(),
        },
        {
          columnName: this.configData.dataSource.columnName,
          columnType: 2,
          columnValue: row[this.configData.compId],
          compType: 15,
          compId: this.configData.compId,
          sysMenuDesignId: this.sysMenuDesignId(),
        },
      ];
      // 处理操作日志
      if (params.formInfo.str) {
        const operate = '编辑';
        logContent += `[${operate}表(${
          params.tableName
        })数据:${params.formInfo.str.slice(0, -1)}]`;
      }
      delete params.formInfo.str;
      params.logData.content = Encrypt(logContent);
      return params;
    },
    async switchChange(row, scope) {
      this.tableData[scope.$index][this.configData.compId] =
        row[this.configData.compId];
      if (!this.areaData.lineEditable) {
        const params = this.resolveParams(row);
        await singleSave(params);
        this.$message({
          type: 'success',
          message: '更改成功',
        });
      } else {
        this.valueChange(scope.$index);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../col.scss';
.switchBox {
  width: 100%;
  height: 36px;
  position: relative;
  display: block;
  font-size: 13px;
  &__label {
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    line-height: 18px;
    padding-top: 6px;
    width: 100%;
  }
  &__switch {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    &.notShowContent {
      ::v-deep {
        .el-switch__label--left,
        .el-switch__label--right {
          display: none !important;
        }
      }
    }
  }
  ::v-deep {
    .el-switch__label {
      position: absolute;
      margin: 0;
      color: #ffffff !important;
    }
    .el-switch__label--left {
      display: none;
      left: 22px;
      &.is-active {
        display: block;
        z-index: 1;
      }
      span {
        font-size: 12px;
      }
    }
    .el-switch__label--right {
      display: none;
      left: 6px;
      &.is-active {
        display: block;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
</style>
