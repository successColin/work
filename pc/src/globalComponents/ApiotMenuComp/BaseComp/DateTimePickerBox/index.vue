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

      <el-date-picker
        v-if="configData.timeInterval"
        :type="pickerType"
        :placeholder="configData.placeholder"
        range-separator="至"
        :start-placeholder="configData.startPlaceholder"
        :end-placeholder="configData.endPlaceholder"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
        v-model="dataTime"
        :disabled="configData.canReadonly"
        :picker-options="pickerOptions"
        @change="handleChangePicker"
      >
      </el-date-picker>
      <el-date-picker
        v-else
        :type="pickerType"
        :placeholder="configData.placeholder"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
        v-model="parent.form[configData.compId]"
        :disabled="configData.canReadonly"
        :picker-options="pickerOptions"
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
import { formatDate } from '@/utils/utils';
import { timeShortcuts } from '@/config';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      dataTime: ''
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    pickerType() {
      return this.configData.timeInterval ? 'datetimerange' : 'datetime';
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
              minTime = new Date(this.resolveFormula(true, minObj.formula)).getTime();
            }
          }
          if (maxObj) {
            if (maxObj.type === 1) {
              maxTime = maxObj.maxTime;
            }
            if (maxObj.type === 2) {
              maxTime = new Date(this.resolveFormula(true, maxObj.formula)).getTime();
            }
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
        }
      };
      if (this.configData.timeInterval) {
        obj.shortcuts = timeShortcuts;
      }
      return obj;
    }
  },

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
          const startTime = formatDate(new Date(val[0]), 'yyyy-MM-dd hh:mm:ss');
          const endTime = formatDate(new Date(val[1]), 'yyyy-MM-dd hh:mm:ss');
          this.dataTime = [startTime, endTime];
        } else {
          this.dataTime = copy;
        }
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    handleChangePicker(v) {
      if (v instanceof Array) {
        this.parent.form[this.configData.compId] = v.join(',');
      } else {
        this.parent.form[this.configData.compId] = v;
      }
    },
    initTime() {
      if (this.configData.defaultType === 1) {
        if (!this.configData.timeInterval) {
          this.parent.form[this.configData.compId] = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        } else {
          const t = new Date(new Date().toLocaleDateString()).getTime() + 3600 * 1000 * 24;
          const end = new Date(t - 1000);
          const start = new Date(t - 3600 * 1000 * 24 * 1);
          const endTime = formatDate(end, 'yyyy-MM-dd hh:mm:ss');
          const startTime = formatDate(start, 'yyyy-MM-dd hh:mm:ss');
          this.parent.form[this.configData.compId] = `${startTime},${endTime}`;
        }
      } else if (this.configData.defaultType === 2) {
        const copy =
          (this.parent.form[this.configData.compId] &&
            JSON.parse(JSON.stringify(this.parent.form[this.configData.compId]))) ||
          '';
        if (copy && this.configData.timeInterval) {
          const val = copy && copy.split(',');
          const startTime = formatDate(new Date(val[0]), 'yyyy-MM-dd hh:mm:ss');
          const endTime = formatDate(new Date(val[1]), 'yyyy-MM-dd hh:mm:ss');
          this.parent.form[this.configData.compId] = `${startTime},${endTime}`;
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../index';
.singleBox {
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
      .el-input__inner {
        width: 100%;
      }
      .el-range-editor .el-range-input {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: inherit;
        color: #333333;
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
