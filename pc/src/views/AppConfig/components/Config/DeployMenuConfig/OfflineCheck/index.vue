<template>
  <el-collapse v-model="activeNames" :accordion="true" class="offlineCheck">
    <el-collapse-item :title="$t('appconfig.routeLayer')" name="1">
      <p class="offlineCheck--switch">
        {{ $t('appconfig.routePass') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.routeLayer.routePass"
        >
        </el-switch>
      </p>
    </el-collapse-item>
    <el-collapse-item :title="$t('appconfig.deviceLayer')" name="2">
      <h2 class="offlineCheck--head">{{ $t('appconfig.unlockedType') }}</h2>
      <el-select
        class="offlineCheck--select m-b-10"
        v-model="offlineCheck.deviceLayer.unlockedType"
      >
        <el-option
          :value="item.value"
          :label="$t(`appconfig.${item.content}`)"
          v-for="item in unlockedArr"
          :key="item.value"
        ></el-option>
      </el-select>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.enableRFID') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.deviceLayer.enableRFID"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.scanUnlock') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.deviceLayer.scanUnlock"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.fillCodeUnlock') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.deviceLayer.fillCodeUnlock"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.workDone') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.deviceLayer.workDone"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.jumpOver') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.deviceLayer.jumpOver"
        >
        </el-switch>
      </p>
    </el-collapse-item>
    <el-collapse-item :title="$t('appconfig.taskLayer')" name="3">
      <p class="offlineCheck--switch">
        {{ $t('appconfig.openFirstTask') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.taskLayer.openFirstTask"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.limitFunc') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.taskLayer.limitFunc"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch">
        {{ $t('appconfig.enforceCheck') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.taskLayer.enforceCheck"
        >
        </el-switch>
      </p>
      <p class="offlineCheck--switch m-b-10">
        {{ $t('appconfig.abnormalMemo') }}
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          v-model="offlineCheck.taskLayer.abnormalMemo"
        >
        </el-switch>
      </p>
      <apiot-button class="offlineCheck--btn" @click="showColumnDialog = true">
        <i class="iconfont icon-shezhi m-r-4"></i
        >{{ $t('appconfig.taskColumn') }}
      </apiot-button>
      <TaskColumn
        :visible.sync="showColumnDialog"
        :showColumnDialog="showColumnDialog"
        :columnArr.sync="offlineCheck.taskLayer.columnArr"
      ></TaskColumn>
    </el-collapse-item>
    <el-collapse-item :title="$t('appconfig.resultLayer')" name="4">
      <apiot-button class="offlineCheck--btn" @click="showResultColumnDialog = true">
        <i class="iconfont icon-shezhi m-r-4"></i
        >{{ $t('appconfig.taskColumn') }}
      </apiot-button>
      <ResultColumn
        :visible.sync="showResultColumnDialog"
        :showColumnDialog="showResultColumnDialog"
        :columnArr.sync="offlineCheck.resultLayer.columnArr"
      ></ResultColumn>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import TaskColumn from '../TaskColumn';
import ResultColumn from '../ResultColumn';

export default {
  name: '',
  props: {
    offlineCheck: {
      type: Object
    }
  },
  data() {
    return {
      activeNames: '',
      unlockedArr: [
        { value: 1, content: 'unlockedType1' },
        { value: 2, content: 'unlockedType2' },
        { value: 3, content: 'unlockedType3' }
      ],
      showColumnDialog: false,
      showResultColumnDialog: false,
    };
  },
  mounted() {
    // 获取事件字典
    this.$store.dispatch('getCurrentDict', 'DICT-00321');
  },
  methods: {},
  components: {
    TaskColumn,
    ResultColumn
  }
};
</script>

<style lang='scss' scoped>
.offlineCheck {
  border: 0 none;
  ::v-deep {
    .el-collapse-item__header {
      border-bottom: 0 none;
      height: 30px;
      line-height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    .el-collapse-item__wrap {
      border-bottom: 0px none;
    }
    .el-collapse-item__content {
      padding-bottom: 10px;
    }
  }
  &--head {
    line-height: 30px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  &--select {
    width: 100%;
  }
  &--switch {
    position: relative;
    display: flex;
    height: 30px;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
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
  &--btn {
    width: 100%;
    height: 30px;
    margin: 0;
    .iconfont {
      color: $--color-primary;
    }
  }
}
</style>
