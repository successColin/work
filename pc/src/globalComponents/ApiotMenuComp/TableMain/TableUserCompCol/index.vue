<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :prop="configData.dataSource.columnName"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span
          :class="[
            {
              'is-required': areaData.lineEditable && configData.shouldRequired,
            },
          ]"
        >
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
      <FilterCol
        ref="filterCol"
        :configData="configData"
        :grandFather="grandFather"
        v-if="configData.enableTableSearch"
      ></FilterCol>
    </template>
    <div slot-scope="scope" style="height: 36px">
      <SelectBox
        :curData="scope.row"
        :getIdCompId="getIdCompId"
        :multiEntityArr="multiEntityArr"
        v-on="$listeners"
        v-bind="$attrs"
      ></SelectBox>
      <div class="column__notEditable">
        <UserColAvatar :userIds="scope.row[configData.compId]"></UserColAvatar>
      </div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  props: {
    getIdCompId: {
      type: String
    },
    multiEntityArr: {
      type: Array,
      default: () => []
    }
  },
  name: '',
  mixins: [tableCol],
  data() {
    return {
      curValue: ''
    };
  },

  computed: {},

  components: {},

  created() {},

  inject: ['getAllForm', 'getPanel', 'onlyFlag', 'sysMenuDesignId', 'resolveFormula'],

  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../col.scss';

.column__editable {
  display: flex;
  align-items: center;
  ::v-deep {
    .el-input-group__append {
      padding: 0;
      border-right: 1px solid #e9e9e9;
      border-left: 0;
      background-color: #fff;
      &:hover {
        .iconfont {
          color: $--color-primary;
        }
      }
    }
    .fieldSelect--item {
      height: 32px;
    }
  }
  .selectBtn {
    border-radius: 4px;
    border: 1px dashed #d9d9d9;
    width: 68px;
    height: 32px;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 400;
    margin-right: 4px;
    &:hover {
      border-color: $--color-primary !important;
      .iconfont {
        color: $--color-primary;
      }
    }
    .iconfont {
      font-weight: normal;
      font-size: 13px;
      color: #aaaaaa;
      margin-right: 4px;
    }
  }
  .selectBtn__tag {
    width: calc(100% - 72px);
    height: 32px;
  }
  .showData {
    position: absolute;
    left: 12px;
    right: 42px;
    margin-top: 0px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
