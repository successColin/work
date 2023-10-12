<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.compId"
  >
    <!-- :prop="configData.dataSource.columnName" -->
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
        v-if="configData.enableTableSearch && !isPreview"
      ></FilterCol>
    </template>
    <div slot-scope="scope" style="width: 100%">
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
      <div class="column__notEditable">
        <div class="imgSmall" v-if="scope.row[`${configData.compId}_`]">
          <img
            :src="$parseImgUrl(item)"
            alt=""
            v-for="(item, i) in scope.row[`${configData.compId}_`].split(',')"
            :key="item"
            @click="$emit('showFileDialog', scope.row, configData.compId, i)"
          />
        </div>
        <div class="imgBox" v-else-if="scope.row[`${configData.compId}`]">
          <div class="imgBox__pic">
            <img src="@/assets/img/imageFile.svg" alt="" />
          </div>
          {{
            scope.row[configData.compId].toString().split(',').length > 99
              ? '99+'
              : scope.row[configData.compId].toString().split(',').length
          }}张
        </div>
      </div>
    </div>
  </el-table-column>
</template>

<script>
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
    return {
      show: false,
    };
  },
  components: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../col.scss';

.column__notEditable {
  vertical-align: top;
  display: flex;
  align-items: center;
  cursor: pointer;
  .imgBox {
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 2px 6px 2px 2px;
    display: flex;
    height: 24px;
    align-items: center;
    color: #fff;
    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }
    &__pic {
      width: 20px;
      height: 20px;
      line-height: 25px;
      text-align: center;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 4px;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .imgSmall {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      margin-right: 2px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
