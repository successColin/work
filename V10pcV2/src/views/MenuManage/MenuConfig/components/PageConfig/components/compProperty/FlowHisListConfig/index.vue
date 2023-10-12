<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>流程日志</h1>
    </header>
    <section class="contentConfig__wrapper">
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          显示标题
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showTitle"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="!isUser">
        <h2 class="contentConfig__hasTab--switchBox">
          是否隐藏该区域
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.notShowArea"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box">
        <h2>关联流程</h2>
        <el-cascader
          clearable
          class="cascader"
          popper-class="cascaderPropsPopper"
          :props="cascaderProps"
          v-model="activeObj.relateBusiComp.flowValue"
          :collapse-tags="true"
          :show-all-levels="false"
        />
      </div>
      <div class="contentConfig__box">
        <h2>关联数据id</h2>
        <select-comp
          class="p-l-10 p-r-10"
          :placeholder="`请选择关联数据id控件`"
          :configData="configData"
          :curTriggerComp="activeObj.relateDataComp"
          :triggerCompMap="triggerCompMap"
          :filterMethods="filterMethods"
          @compChange="compChange1"
        ></select-comp>
      </div>

      <div class="contentConfig__box contentConfig__hasTab" v-if="false">
        <h2>高度</h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否设置高度
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showHeight"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <div v-if="activeObj.showHeight" class="numberText">
          <el-input-number
            class="number"
            placeholder="请输入高度"
            v-model="activeObj.heightPix"
            :min="300"
            :controls="false"
            :precision="0"
          ></el-input-number
          >px
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import { createUnique } from '@/utils/utils';
import { getFlowGroup, getFlowList } from '@/api/flow';
import propertyMixin from '../propertyMixin';
import SelectComp from '../GlobalConfig/components/AddAction/components/SelectComp';

export default {
  mixins: [propertyMixin],
  props: {
    activeObj: {
      type: Object,
    },
    hasTriggerComp: {
      type: Object,
    },
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
  },
  data() {
    return {
      cascaderProps: {
        expandTrigger: 'hover',
        lazy: true,
        label: 'name',
        value: 'id',
        lazyLoad(node, resolve) {
          const { level, data } = node;
          if (level === 0) {
            getFlowGroup().then((res) => {
              const arr = res.map((item) => ({
                ...item,
                level: 1,
                leaf: false,
              }));
              resolve(arr);
            });
            return;
          }
          if (level === 1) {
            getFlowList({ groupId: data.id }).then((res) => {
              const arr = res.map((item) => ({
                ...item,
                level: 2,
                leaf: true,
                name: item.workflowName,
              }));
              resolve(arr);
            });
            return;
          }
          resolve(node);
        },
      },
    };
  },

  components: {
    SelectComp,
  },

  computed: {},
  created() {},
  mounted() {
    if (this.activeObj.relateDataComp.compId) {
      this.compChange1();
    }
    if (this.activeObj.notShowArea == null) {
      this.$set(this.activeObj, 'notShowArea', false);
    }
  },

  methods: {
    filterMethods(data) {
      if (data.dataSource && data.dataSource.columnName) {
        if (data.dataSource.tableName) {
          return false;
        }
        return true;
      }
      return false;
    },
    compChange1() {
      if (this.getAllcheck[this.activeObj.relateDataComp.compId]) {
        this.activeObj.relateDataComp.tableName =
          this.getAllcheck[
            this.activeObj.relateDataComp.compId
          ].dataSource.tableName;
      } else {
        this.activeObj.relateDataComp = {
          compId: '',
          compPath: '',
          compType: '',
          tableName: '',
        };
      }
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.contentConfig {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 10px;
  &__title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
  }
  &__wrapper {
    height: calc(100% - 46px);
    overflow: auto;
  }
  &__box {
    h2 {
      padding-left: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      height: 40px;
      line-height: 40px;
    }
  }
  &__hasTab {
    &--switchBox {
      position: relative;
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
    &--switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    &--list {
      padding: 0 10px;
    }
    &--tab {
      height: 36px;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 16px;
        color: #bbc3cd;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
      .icon-zongxiangtuodong {
        cursor: move;
      }
      .icon-sheweimoren {
        visibility: hidden;
        &.active {
          color: $--color-primary;
          visibility: visible;
        }
      }
      .input {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        flex: 1;
      }
      .columnName {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        &__sort {
          width: 80px;
          margin-left: auto;
          margin-right: 8px;
        }
      }
      &.active,
      &:hover {
        background: $--hover-color;
        .icon-sheweimoren {
          visibility: visible;
        }
      }
    }
    &--addTab {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-bottom: 10px;
    }
  }
  &__pBox {
    padding: 0 10px;
  }
  &__p {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }
  &__select {
    width: 100%;
  }
  .numberText {
    font-size: 13px;
    width: calc(100% - 20px);
    margin-left: 10px;
  }
  .number {
    width: calc(100% - 30px);
    margin-right: 10px;
  }
  .cascader {
    width: calc(100% - 20px);
    margin-left: 10px;
  }
}
</style>
