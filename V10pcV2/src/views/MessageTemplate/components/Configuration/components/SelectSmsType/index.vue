<!--
 * @Author: sss
 * @Date: 2021-07-19 14:43:30
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-19 14:43:30
 * @Desc: 邮件类型
-->
<template>
  <el-popover
    class="selectEmailType__btn"
    v-on="$listeners"
    v-bind="$attrs"
    popper-class="custom"
    width="200"
  >
    <apiot-button type="primary" slot="reference">
      <i class="iconfont icon-shezhi m-r-4"></i
      >{{ $t('messageTemplate.service') }}
    </apiot-button>
    <section class="selectEmailType__content">
      <header class="selectEmailType__header">发送类型</header>
      <div class="selectEmailType__content--items">
        <el-checkbox-group
          v-model="checked"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            class="selectEmailType__content--item"
            v-for="item in $store.state.dictManage.MESSAGE_TYPE"
            :label="item.value"
            :key="item.value"
          >
            <div class="item">
              <img
                :src="require(`@/assets/img/message_images/${item.value}.svg`)"
              />
              <span>{{ item.name }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </section>
  </el-popover>
</template>

<script>
export default {
  components: {},

  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 消息支持类型
    checkedTypes: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      activitedValue: 1,
      checked: [1]
    };
  },

  computed: {
    showTypeList() {
      return (
        this.$store.state.dictManage.MESSAGE_TYPE.filter(
          (item) => this.checked.indexOf(item.value) !== -1
        ) || []
      );
    }
  },

  methods: {
    // 选择变量类型
    handleCheckedCitiesChange() {
      let typeIndex = this.showTypeList.findIndex((item) => item.value === this.activitedValue);
      let smsType = {};
      if (this.showTypeList.length > 0 && typeIndex === -1) {
        this.activitedValue = this.showTypeList[0].value;
        typeIndex = 0;
      } else if (this.showTypeList.length === 0) {
        this.activitedValue = -1;
      }
      if (this.activitedValue !== -1) smsType = this.showTypeList[typeIndex];
      this.$emit('checkTypes', { checkTypes: this.checked, acticitedType: smsType });
    },
    // 点击消息类型
    selectType(type) {
      this.activitedValue = type.value;
      this.$emit('input', type);
    }
  },

  mounted() {
    this.checked = [...this.checkedTypes];
  }
};
</script>

<style lang='scss' scoped>
.selectEmailType {
  &__btn {
    margin-right: 5px;
  }
  &__header {
    padding-left: 20px;
    height: 36px;
    line-height: 36px;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  &__content {
    padding: 10px 0;
    &--items {
      ::v-deep {
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
        }
      }
    }

    &--item {
      margin: 0;
      padding-left: 20px;
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
      .item > * {
        vertical-align: middle;
      }
      .item img {
        margin-right: 8px;
      }
    }
  }
}
</style>
