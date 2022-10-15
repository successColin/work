<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
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
    <div slot-scope="scope">
      <SelectBox
        :curData="scope.row"
        :getIdCompId="getIdCompId"
        :multiEntityArr="multiEntityArr"
        v-on="$listeners"
        v-bind="$attrs"
      ></SelectBox>
      <div
        class="column__editable"
        v-if="
          areaData.lineEditable &&
          showCell === `${scope.column.id}_${scope.row.unique}`
        "
      >
        <el-select
          @visible-change="visibleChange"
          @change="valueChange(scope.$index)"
          v-model="tableData[scope.$index][configData.compId]"
          :placeholder="configData.placeholder"
          :multiple="isMulti"
          :collapse-tags="isMulti"
          :filterable="configData.filterable"
          :disabled="configData.canReadonly"
        >
          <el-option
            v-for="item in effectArr"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
            <el-radio
              v-model="scope.row[configData.compId]"
              :label="item.value"
              style="display: flex; align-items: center"
            >
              <div class="option" v-if="configData.dropDownStyle === 2">
                <span class="option__bg" :style="getStyle(item)">{{
                  item.name
                }}</span>
              </div>
              <div
                class="option"
                v-else-if="configData.dropDownStyle === 3 && item.icon"
              >
                <span class="option__self">
                  <img
                    :src="$parseImgUrl(item.icon.imgUrl)"
                    v-if="item.icon.imgUrl"
                  />
                  <i
                    v-else
                    :class="`iconfont ${item.icon.icon}`"
                    :style="`color:${item.icon.color}`"
                  ></i
                  >{{ item.name }}</span
                >
              </div>
              <div class="option" v-else>
                {{ item.name }}
              </div>
            </el-radio>
          </el-option>
        </el-select>
      </div>
      <div class="column__notEditable" v-else>
        <div
          v-for="(item, index) in getDictRes(scope.row[configData.compId])"
          :key="index"
        >
          <div class="option" v-if="configData.dropDownStyle === 2">
            <span class="option__bg" :style="getStyle(item)">{{
              item.name
            }}</span>
          </div>
          <div
            class="option"
            v-else-if="configData.dropDownStyle === 3 && item.icon"
          >
            <span class="option__self">
              <img
                :src="$parseImgUrl(item.icon.imgUrl)"
                v-if="item.icon.imgUrl"
              />
              <i
                v-else
                :class="`iconfont ${item.icon.icon}`"
                :style="`color:${item.icon.color}`"
              ></i
              >{{ item.name }}</span
            >
          </div>
          <div class="option" v-else>
            {{ item.name }}
          </div>
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
    return {};
  },
  computed: {
    getStyle() {
      return (item) => {
        let style = '';
        if (item.color) {
          style += `background:${item.color};`;
        }
        if (item.fontColor) {
          style += `color:${item.fontColor};`;
        }
        return style;
      };
    },
    getDictKey() {
      return this.configData.dataSource.dictObj.dictKey;
    },
    getDictArr() {
      let tempData = [];
      tempData = this.$store.getters.getCurDict(this.getDictKey);
      if (Array.isArray(tempData)) {
        tempData = JSON.parse(JSON.stringify(tempData));
        if (this.configData.sort === 2) {
          tempData.reverse();
        }
        if (tempData.length) {
          return tempData;
        }
      }
      return [];
    },
    // 是否是多选
    isMulti() {
      if (this.configData.compType === 2) {
        if (this.configData.dropDownType === 1) {
          return false;
        }
        return true;
      }
      if (this.configData.compType === 3) {
        return false;
      }
      if (this.configData.compType === 4) {
        return true;
      }
      return false;
    },
    // 获取label值
    getDictLabel() {
      return (v) => {
        if (this.isMulti) {
          if (v) {
            const arr = v.split(',');
            const tempArr = [];
            arr.forEach((item) => {
              const index = this.getDictArr.findIndex((dict) => dict.value === +item);
              if (index !== -1) {
                tempArr.push(this.getDictArr[index].name);
              }
            });
            return tempArr.join();
          }
        } else {
          const index = this.getDictArr.findIndex((dict) => dict.value === +v);
          if (index !== -1) {
            return this.getDictArr[index].name;
          }
        }
        return '';
      };
    },
    // 获取结果数组
    getDictRes() {
      return (v) => {
        if (!v) {
          return [];
        }
        if (this.isMulti) {
          if (v) {
            const arr = v.split(',');
            const tempArr = [];
            arr.forEach((item) => {
              const index = this.getDictArr.findIndex((dict) => dict.value === +item);
              if (index !== -1) {
                const tempObj = JSON.parse(JSON.stringify(this.getDictArr[index]));
                tempObj.resValue = item;
                tempArr.push(tempObj);
              }
            });
            return tempArr;
          }
        } else {
          const index = this.getDictArr.findIndex((dict) => dict.value === +v);
          if (index !== -1) {
            const tempObj = JSON.parse(JSON.stringify(this.getDictArr[index]));
            tempObj.resValue = v;
            return [tempObj];
          }
        }
        return [];
      };
    }
  },
  components: {},
  created() {
    // console.log(this.configData.dropDownStyle);
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../col.scss';

.column__editable {
  ::v-deep {
    .el-icon-arrow-up {
      font-family: 'iconfont' !important;
      font-size: 16px !important;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transform: rotate(180deg) !important;
      &::before {
        content: '\eaad';
      }
    }
  }
}
</style>
