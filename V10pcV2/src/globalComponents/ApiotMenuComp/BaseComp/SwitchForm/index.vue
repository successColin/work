<template>
  <div
    class="singleBox switchBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      v-if="!isTable"
      :class="[{ 'is-required': isConfig && configData.shouldRequired }]"
    >
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <el-switch
        class="switchBox__switch"
        :class="[{ notShowContent: !configData.showContent }]"
        v-model="parent.form[configData.compId]"
        :disabled="configData.canReadonly"
        active-text="是"
        inactive-text="否"
        :active-value="configData.activeValue"
        :inactive-value="configData.inactiveValue"
      >
      </el-switch>
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
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
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
        if (tempData.length) {
          return tempData;
        }
      }
      return [];
    },
    getDictObj() {
      const obj = {};
      if (this.getDictArr.length) {
        this.getDictArr.forEach((dict) => {
          obj[dict.value] = dict;
        });
      }
      return obj;
    },
    getDictInfo() {
      // info: color 背景色
      // info: fontColor 字体色
      // icon: icon 图标
      return (item, info) => {
        if (this.getDictObj[item]) {
          return this.getDictObj[item][info] || '';
        }
        return '';
      };
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.singleBox {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
  margin-bottom: 0;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 20px;
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
}
.switchBox {
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
