/**
* @name: index
* @author: DELL
* @date: 2023/2/16 16:10
* @description：index
* @update: 2023/2/16 16:10
*/
<!-- 页面 -->
<template>
  <div class="approvalMain">
    <div class="approvalMain__content">
      <div class="approvalMain__header">
        <apiot-button
            class="approvalMain__header--return"
            @click="doBack"
        >
          <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
        </apiot-button>
      </div>
      <div class="approvalMain__ListContent">
        <List
            sceneType="customPage"
            :isNeedStatus="isNeedStatus"
            :com="getCom"
            :otherParams="getParams"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { initiatedArr } from '_v/HomeMenuConfig/constants/global';

const List = () => import('@/views/TaskToDo/Components/List');

export default {
  props: {
    approvalConfig: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },

  components: {
    List
  },

  computed: {
    isNeedStatus() {
      const { stylesObj: { flowType } } = this.approvalConfig;
      return flowType === 'IInitiatedIt';
    },
    getCom() {
      const { stylesObj: { flowType } } = this.approvalConfig;
      if ([...initiatedArr, 'IInitiatedIt'].includes(flowType)) {
        return 'IInitiatedIt';
      }
      return flowType;
    },
    getParams() {
      const { stylesObj: { flowGroups = [], flowType } } = this.approvalConfig;
      const params = { flowGroupIds: flowGroups.join(',') };
      if (initiatedArr.includes(flowType)) {
        params.instanceStatus = flowType;
      }
      return params;
    }
  },

  mounted() {
  },

  methods: {
    doBack() {
      this.$emit('update:visible', false);
      this.$bus.$emit(`approval${this.approvalConfig.componentId}`);
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.approvalMain {
  position: fixed;
  z-index: 102;
  left: 0;
  top: 0;
  right: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);

  &__content {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f6f6f8;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
  }

  &__header {
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
    height: 46px;
    line-height: 46px;

    &--return {
      width: 100px;
      height: 46px;
      border-width: 0 1px 0 0;
      border-color: #ebebeb;
      border-radius: 0;
      color: #333;
      font-size: 16px;
      i {
        font-size: 20px;
        margin-right: 8px;
        color: #9b9b9b;
      }

      &:hover,
      &:active,
      &:focus {
        border-color: #ebebeb !important;
        background-color: #fff !important;
        color: $--color-primary;
        i {
          color: $--color-primary;
        }
      }
    }
  }
  &__ListContent{
    height: calc(100% - 46px - 10px);
    margin: 10px 10px 0;
    background-color: #fff;
  }
}
</style>
