<template>
  <div
    class="singleBox"
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
      <!-- 日期框 -->
      <el-date-picker
        v-if="!configData.timeInterval"
        :type="getTimeType"
        :placeholder="configData.placeholder"
        :format="getFormatTime"
        :value-format="getFormatTime"
        :editable="false"
        v-model="parent.form[configData.compId]"
        :disabled="configData.canReadonly"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
      <!-- 日期区间框 -->
      <el-date-picker
        v-else
        type="daterange"
        :start-placeholder="configData.startPlaceholder"
        :end-placeholder="configData.endPlaceholder"
        :format="getFormatTime"
        :value-format="getFormatTime"
        :editable="false"
        v-model="dataTime"
        :disabled="configData.canReadonly"
        :picker-options="pickerOptions"
        range-separator="至"
        @change="handleChangePicker"
      >
      </el-date-picker>
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
import { timeShortcuts } from '@/config';
import { formatDate } from '@/utils/utils';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      dataTime: '',
      curCompType: 2,
    };
  },
  computed: {
    getTimeType() {
      return this.configData.timeType || 'date';
    },
    getFormatTime() {
      if (this.configData.timeType === 'year') {
        return 'yyyy';
      }
      if (this.configData.timeType === 'month') {
        return 'yyyy-MM';
      }
      return 'yyyy-MM-dd';
    },
    pickerOptions() {
      const obj = {
        disabledDate: (time) => {
          let minTime = '';
          let maxTime = '';
          const minObj = this.configData.minTimeObj;
          const maxObj = this.configData.maxTimeObj;
          if (minObj) {
            if (minObj.type === 1) {
              minTime = minObj.minTime;
            }
            if (minObj.type === 2) {
              const res = this.resolveFormula(true, minObj.formula);
              if (+res === 0) {
                minTime = '';
              } else {
                minTime = new Date(res).getTime();
              }
            }
          }
          if (maxObj) {
            if (maxObj.type === 1) {
              maxTime = maxObj.maxTime;
            }
            if (maxObj.type === 2) {
              const res = this.resolveFormula(true, maxObj.formula);
              if (+res === 0) {
                maxTime = '';
              } else {
                maxTime = new Date(res).getTime();
              }
            }
          }
          if (minTime) {
            minTime = new Date(
              `${formatDate(new Date(minTime), 'yyyy-MM-dd')} 00:00:00`,
            ).getTime();
          }
          if (maxTime) {
            maxTime = new Date(
              `${formatDate(new Date(maxTime), 'yyyy-MM-dd')} 00:00:00`,
            ).getTime();
          }
          if (minTime && maxTime) {
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
          if (minTime && !maxTime) {
            return time.getTime() < minTime;
          }
          if (!minTime && maxTime) {
            return time.getTime() > maxTime;
          }
          return false;
        },
      };
      if (this.configData.timeInterval) {
        obj.shortcuts = timeShortcuts;
      }
      return obj;
    },
  },
  mixins: [compMixin],
  inject: [
    'resolveFormula',
    'getAllForm',
    'getPanel',
    'getFatherPanel',
    'onlyFlag',
    'sysMenuDesignId',
    'getInitComp',
    'resolveTerm',
    'clickTrigger',
  ],
  components: {},

  mounted() {
    this.initTime();
  },

  watch: {
    'parent.form': {
      handler(v) {
        const copy = JSON.parse(JSON.stringify(v))[this.configData.compId];
        if (!copy) {
          this.dataTime = '';
          return;
        }
        if (copy.indexOf(',') !== -1 && this.configData.timeInterval) {
          const val = copy && copy.split(',');
          const startTime = formatDate(new Date(val[0]), this.getFormatTime);
          const endTime = formatDate(new Date(val[1]), this.getFormatTime);
          this.dataTime = [startTime, endTime];
        } else {
          this.dataTime = copy;
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    handleChangePicker(v) {
      this.parent.form[this.configData.compId] = v && v.join(',');
    },
    initTime() {
      if (this.configData.defaultType === 1) {
        this.parent.form[this.configData.compId] = formatDate(
          new Date(),
          this.getFormatTime,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../index';
.singleBox {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
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
      .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
      .el-input__inner {
        cursor: pointer;
      }
    }
  }
  .isVertical {
    ::v-deep {
      .el-radio {
        display: flex;
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
}
.option {
  &__bg {
    max-width: 100%;
    box-sizing: border-box;
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    height: 24px;
    background: $--color-primary;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
  }
  &__self {
    display: flex;
    align-items: center;
    img {
      width: 24px;
    }
    i {
      font-size: 24px;
      margin-right: 4px;
    }
  }
}
</style>
