<!-- 知识库 页面 -->
<template>
  <div class="leftWrap">
    <div class="checkoutWrap">
      <el-button-group>
        <apiot-button :type="active === 1 ? 'primary' : ''" @click="change(1)">
          {{ $t('knowledge.title_my') }}
        </apiot-button>
        <apiot-button :type="active === 2 ? 'primary' : ''" @click="change(2)">
          {{ $t('knowledge.title_cy') }}
        </apiot-button>
        <apiot-button :type="active === 3 ? 'primary' : ''" @click="change(3)">
          {{ $t('knowledge.title_bu') }}
        </apiot-button>
      </el-button-group>
    </div>
    <div class="groupWrap">
      <left-content
        :active="active"
        v-if="[1, 2].includes(active)"
      ></left-content>
      <menu-left
        v-if="active === 3"
        :active="active"
        isolationSign="knowledge"
      ></menu-left>
    </div>
  </div>
</template>
<script>
import LeftContent from './LeftContent';
import MenuLeft from './MenuList';

export default {
  data() {
    return {
      active: 1
    };
  },

  components: {
    LeftContent,
    MenuLeft
  },

  computed: {},

  mounted() {},

  methods: {
    change(type) {
      // 类型
      this.active = type;
      this.$bus.$emit('showType', type);
    }
  },
  name: 'Left'
};
</script>

<style lang='scss' scoped>
.leftWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .checkoutWrap {
    margin: 6px 8px;

    ::v-deep {
      .el-button-group {
        width: 100%;
        display: flex;

        .el-button {
          flex: 1;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }

        .el-button--primary {
          color: #ffffff !important;
        }
      }
    }
  }

  .groupWrap {
    width: 100%;
    height: calc(100% - 42px);
    overflow-y: auto;
  }

  .active {
    background: #edf3fe;
    cursor: pointer;
    border-color: #4689f5 !important;
  }
}
</style>
