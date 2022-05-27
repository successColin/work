<!--
 * @Author: sss
 * @Date: 2021-07-21 08:55:18
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-21 08:55:18
 * @Desc: 接收人区1
-->
<template>
  <section class="receiver">
    <header class="receiver__header">
      <label class="header__label isRequired">{{
        $t('messageTemplate.receiver')
      }}</label>
      <select-receiver
        :checkedList="typeList"
        @select="selectReceiverType"
      ></select-receiver>
    </header>
    <div class="receiver__content">
      <div
        class="receiver__content--item"
        v-for="item in showTypeList"
        :key="`receiver_${item.value}`"
      >
        <label>{{ $t(item.name) }}</label>

        <div class="receiver__content--choose">
          <component
            :is="item.compName"
            :ref="`ref_${item.value}`"
            :value="receiversByType(item.value)"
            :prop="item.value"
            @changeUser="handleUserChange"
            @changeRoles="handleRoleChange"
            @changVars="handleVarChange"
          ></component>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SelectReceiver from './SelectReceiver';
import VariableBox from '../Variable/VariableBox';

export default {
  components: { SelectReceiver, VariableBox },

  props: {
    value: {
      type: Array,
      defalue() {
        return [];
      }
    },
    receiversType: {
      type: Array,
      defalue() {
        return [];
      }
    }
  },

  data() {
    return {
      typeList: [] // 接收人类型
    };
  },

  computed: {
    componentsList() {
      const receiverType = [...this.$store.state.dictManage.RECEIVER_TYPE];
      receiverType.map((item) => {
        if (item.value === 1) item.compName = 'UserBoxFormItem';
        else if (item.value === 2) item.compName = 'RoleBoxFormItem';
        else item.compName = 'VariableBox';
        return item;
      });
      return receiverType;
    },
    showTypeList() {
      return this.componentsList.filter((item) => this.typeList.indexOf(item.value) !== -1) || [];
    },
    receiversByType() {
      return function (type) {
        const receivers = this.value.find((item) => item.receiverType === type) || {};
        const receiverValue = receivers.receiverValue || [];
        if (type === 1) {
          receiverValue.map((item) => {
            const { value, displayName } = item;
            item.id = value;
            item.username = displayName;
            return item;
          });
        } else if (type === 2) {
          receiverValue.map((item) => {
            const { value, displayName } = item;
            item.id = value;
            item.roleName = displayName;
            return item;
          });
        } else {
          receiverValue.map((item) => {
            const { value, displayName } = item;
            item.variableCode = value.replace(/[\\${!}]/g, ''); // cs
            item.variableName = displayName;
            return item;
          });
        }

        return receivers.receiverValue || [];
      };
    }
  },

  watch: {},

  methods: {
    // 选择接收人类型
    selectReceiverType(list) {
      this.typeList = [...list];
      this.$emit('receiverTypeChange', list);
    },
    // 固定人员
    handleUserChange(users) {
      const receiverValue = [];
      users.forEach((element) => {
        receiverValue.push({ value: element.id, displayName: element.username });
      });

      const receiversList = this.value;
      const receiversIndex = receiversList.findIndex((item) => item.receiverType === 1);
      const receivers = receiversList[receiversIndex] || { receiverType: 1 };
      receivers.receiverValue = receiverValue;
      if (receiversIndex === -1) receiversList.push(receivers);
      else receiversList[receiversIndex] = { ...receivers };

      this.$emit('input', receiversList);
      this.$emit('change', receiversList);
    },
    // 固定角色
    handleRoleChange(roles) {
      // 格式数据
      const receiverValue = [];
      roles.forEach((element) => {
        receiverValue.push({ value: element.id, displayName: element.roleName });
      });
      // 合并其它接收人
      const receiversList = this.value;
      const receiversIndex = receiversList.findIndex((item) => item.receiverType === 2);
      const receivers = receiversList[receiversIndex] || { receiverType: 2 };
      receivers.receiverValue = receiverValue;
      if (receiversIndex === -1) receiversList.push(receivers);
      else receiversList[receiversIndex] = { ...receivers };

      this.$emit('input', receiversList);
      this.$emit('change', receiversList);
    },
    // 变量
    handleVarChange(info) {
      const { vars, prop } = info;
      const receiverValue = [];
      vars.forEach((element) => {
        const { variableType, variableCode, variableName } = element;
        // eslint-disable-next-line no-useless-concat
        const value = '$' + `{${variableCode}!}`;
        receiverValue.push({ value, displayName: variableName, variableType });
      });

      const receiversList = this.value;
      const receiversIndex = receiversList.findIndex((item) => item.receiverType === prop);
      const receivers = receiversList[receiversIndex] || { receiverType: prop };
      if (receiverValue.length === 0 && receiversIndex !== -1) {
        receiversList.splice(receiversIndex, 1);
      } else {
        receivers.receiverValue = receiverValue;
        if (receiversIndex === -1) receiversList.push(receivers);
        else receiversList[receiversIndex] = { ...receivers };
      }

      this.$emit('input', receiversList);
      this.$emit('change', receiversList);
    }
  },

  mounted() {
    this.typeList = [...this.receiversType];
  }
};
</script>

<style lang='scss' scoped>
.receiver {
  .header__label {
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
    &.isRequired {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
  .icon-xinzeng {
    color: $--color-primary;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__content {
    margin-top: 10px;
    &--item {
      display: flex;
      border-bottom: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      &:first-child {
        border-top: 1px solid #e9e9e9;
      }
      & label {
        box-sizing: border-box;
        padding-right: 10px;
        flex-shrink: 0;
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: right;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
    &--choose {
      padding: 5px 10px;
      box-sizing: content-box;
      flex: 1;
    }
  }
}
</style>
