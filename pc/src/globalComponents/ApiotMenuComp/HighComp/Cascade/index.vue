<template>
  <div
    class="singleLineText"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
      { onelineCalss: isLayoutStyle },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      v-if="!isTable"
      :class="[{ onelineCalss__form: isLayoutStyle }]"
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

      <!-- <apiot-input
        v-model="parent.form[configData.compId]"
        @change="change"
        :placeholder="configData.placeholder"
        :disabled="configData.canReadonly"
        :readonly="configData.singleStatus === 3"
      ></apiot-input> -->
      <el-cascader
        v-model="parent.form[configData.compId]"
        :options="options"
        :props="cascaderProps"
        :show-all-levels="configData.storeType === 1"
        :filterable="configData.enableSearch"
        :placeholder="configData.placeholder"
        :disabled="configData.canReadonly"
      ></el-cascader>
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
import { getCascadeInfo } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'showColumn',
        label: 'showColumn'
      },
      options: []
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {},

  created() {
    this.initProps();
  },

  mounted() {
    if (!this.isConfig) {
      this.getCascadeInfo();
    }
  },

  methods: {
    initProps() {
      if (this.configData.loadType === 2) {
        this.cascaderProps.expandTrigger = 'click';
      }
    },
    async getCascadeInfo() {
      const data = await getCascadeInfo({
        configInfo: JSON.stringify(this.configData.cascadeDataSource)
      });
      this.options = data;
    }
  }
};
</script>

<style lang='scss' scoped>
.singleLineText {
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
    }
    .el-cascader {
      line-height: 32px;
      width: 100%;
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
</style>
