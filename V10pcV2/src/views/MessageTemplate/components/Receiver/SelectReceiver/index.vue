<!--
 * @Author: sss
 * @Date: 2021-07-19 14:43:30
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-19 14:43:30
 * @Desc: 接收人类型
-->
<template >
  <el-popover
    class="selectReceiver"
    v-on="$listeners"
    v-bind="$attrs"
    popper-class="custom"
    width="196"
    @show="showPop"
  >
    <apiot-button slot="reference">
      <i class="iconfont icon-xinzeng m-r-4"></i
      >{{
        $t('common.add', {
          name: $t('messageTemplate.receiver'),
        })
      }}
    </apiot-button>
    <section class="SelectReceiver__content">
      <el-checkbox-group v-model="checked" @change="select">
        <el-checkbox
          class="SelectReceiver__content--item"
          v-for="item in $store.state.dictManage.RECEIVER_TYPE"
          :label="item.value"
          :key="item.value"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
    </section>
  </el-popover>
</template>

<script>
export default {
  components: {},

  props: {
    checkedList: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      checked: []
    };
  },

  computed: {},

  methods: {
    showPop() {
      this.checked = [...this.checkedList];
    },
    // 选择变量类型
    select() {
      this.$emit('select', this.checked);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.icon-xinzeng {
  font-size: 16px;
  color: $--color-primary;
  cursor: pointer;
}
.SelectReceiver {
  &__content {
    overflow: auto;
    ::v-deep {
      .el-checkbox-group {
        display: flex;
        flex-direction: column;
      }
    }

    &--item {
      margin: 0;
      padding: 0 12px;
      height: 36px;
      line-height: 36px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      &:hover {
        background: #f1f7ff;
      }
    }
  }
}
</style>
