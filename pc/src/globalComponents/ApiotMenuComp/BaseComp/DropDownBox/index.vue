<template>
  <div
    class="dropDownBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
      { onelineCalss: isQueryEle },
      { boxPadding: isQueryEle && !isConfig },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      v-if="!isTable"
      :class="[
        { onelineCalss__form: isQueryEle },
        { 'is-required': isConfig && configData.shouldRequired },
      ]"
    >
      <span class="span-box" slot="label">
        <span style="white-space: nowrap"> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <div
        class="dropDownBox__res"
        v-if="getResArr.length && configData.dropDownType !== 2"
      >
        <SelectRes
          :configData="configData"
          :item="item"
          v-for="item in getResArr"
          :key="item.value"
        ></SelectRes>
      </div>
      <el-select
        class="dropDownBox__sel"
        :class="[
          {
            hasRes:
              !configData.canReadonly &&
              getResArr.length &&
              configData.dropDownType !== 2,
          },
        ]"
        v-model="parent.form[configData.compId]"
        :placeholder="configData.placeholder"
        :multiple="configData.dropDownType === 2"
        :collapse-tags="configData.dropDownType === 2"
        :filterable="configData.filterable"
        :disabled="configData.canReadonly"
        @change="handleSelect"
      >
        <el-option
          v-for="item in optionsArr"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
          <SelectRes :configData="configData" :item="item"></SelectRes>
        </el-option>
      </el-select>
    </el-form-item>
    <div class="table" v-else>
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw">数据占位</p>
    </div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import { allOption } from '@/config';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      oldSeleValue: []
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    allSeleValue() {
      return this.optionsArr.map((v) => v.value);
    },
    optionsArr() {
      if (this.configData.enableAll === 1) {
        return [allOption, ...this.effectArr];
      }
      return this.effectArr;
    },
    getDictKey() {
      if (this.configData.dataSource.dictObj) {
        return this.configData.dataSource.dictObj.dictKey;
      }
      return '';
    },
    getDictArr() {
      let tempData = [];
      if (this.isConfig && this.configData.dataSource.dictObj) {
        tempData = this.configData.dataSource.dictObj.dictValue;
      } else if (this.getDictKey) {
        tempData = this.$store.getters.getCurDict(this.getDictKey);
      }
      if (Array.isArray(tempData)) {
        tempData = JSON.parse(JSON.stringify(tempData));
        if (this.configData.sort === 2) {
          tempData.reverse();
        }
        return tempData;
      }
      return [];
    },

    getResArr() {
      if (this.parent.form[this.configData.compId]) {
        const arr = this.parent.form[this.configData.compId].toString().split(',');
        const tempArr = [];
        arr.forEach((v) => {
          const obj = this.optionsArr.find((item) => +item.value === +v);
          if (obj) {
            tempArr.push(obj);
          }
        });
        return tempArr;
      }
      return [];
    }
  },

  mounted() {
    if (this.configData.dropDownType === 2) {
      this.handleSelect(this.parent.form[this.configData.compId]);
    }
  },

  methods: {
    handleSelect(val) {
      if (this.configData.dropDownType === 2) {
        // 用来储存上一次的值，可以进行对比
        const oldVal = this.oldSeleValue;
        // 若是全部选择
        if (val.includes(0)) {
          this.parent.form[this.configData.compId] = Object.assign([], this.allSeleValue);
        }
        // 取消全部选中 上次有 当前没有 表示取消全选
        if (oldVal.includes(0) && !val.includes(0)) {
          this.parent.form[this.configData.compId] = [];
        }
        // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (oldVal.includes(0) && val.includes(0)) {
          const index = val.indexOf(0);
          val.splice(index, 1); // 排除全选选项
          this.parent.form[this.configData.compId] = val;
        }
        // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (!oldVal.includes(0) && !val.includes(0) && this.configData.enableAll === 1) {
          if (val.length === this.effectArr.length) {
            this.parent.form[this.configData.compId] = [0, ...val];
          }
        }
        // 储存当前最后的结果 作为下次的老数据
        this.oldSeleValue = this.parent.form[this.configData.compId] || [];
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../index';
.dropDownBox {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 35px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
      &__content {
        position: relative;
      }
      .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    p:nth-child(2) {
      color: #333;
      border-top: 1px solid #e9e9e9;
    }
  }
  &__res {
    padding: 0 31px 0 13px;
  }
  &__sel {
    position: absolute;
    top: 0;
    &.hasRes {
      ::v-deep {
        .el-input__inner {
          background-color: rgba(0, 0, 0, 0);
          color: rgba(0, 0, 0, 0);
        }
      }
    }
  }
}
</style>
