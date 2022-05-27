<!--
 * @Author: sss
 * @Date: 2021-08-02 08:55:18
 * @Last Modified by: sss
 * @Last Modified time: 2021-08-02 08:55:18
 * @Desc: 服务下拉选择框
-->
<template>
  <section class="serve">
    <apiot-select
      v-model="selectValue"
      ref="selectServe"
      :loading="showLoading"
      @focus="getList"
      @change="change"
    >
      <template slot="selectHeader">
        <section class="serve__add">
          <label>{{ $t('messageTemplate.sendingService') }}</label>
          <div class="serve__add--btn" @click.stop="addServes">
            <i class="iconfont icon-jiahao"></i>
            {{ $t('messageTemplate.more') }}
          </div>
        </section>
      </template>
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.serverName"
        :value="item.id"
      >
      </el-option>
    </apiot-select>
    <dialog-serve
      ref="serveDialog"
      :visible.sync="visible"
      :messageType="messageType"
      :drawerTitle="dialogTilte"
    ></dialog-serve>
  </section>
</template>

<script>
import { getServeList } from '@/api/messageTemplate';
import DialogServe from './DialogServe';

export default {
  components: { DialogServe },

  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    placeholder: String,
    messageType: Number
  },

  data() {
    return {
      showLoading: false,
      visible: false,
      selectValue: '',
      options: [
        {
          value: '',
          name: '无数据请新增'
        }
      ]
    };
  },

  computed: {
    dialogTilte() {
      const serve =
        this.$store.state.dictManage.MESSAGE_TYPE.find((item) => item.value === this.messageType) ||
        {};
      return serve.name;
    }
  },

  watch: {
    value(newValue) {
      this.selectValue = newValue.id;
    }
  },

  methods: {
    // 数据变化
    change(value) {
      const option = this.options.find((item) => item.id === value) || {};
      this.$emit('input', option);
    },
    // 新增服务
    addServes() {
      this.$refs.serveDialog.init();
      this.visible = true;
      this.$refs.selectServe.handleClose();
    },
    // 获取列表
    async getList() {
      this.showLoading = true;
      const { messageType } = this;
      const list = await getServeList({
        messageType
      });
      this.options = [...list];
      this.showLoading = false;
    }
  },

  mounted() {
    this.getList();
  }
};
</script>

<style lang='scss' scoped>
.serve {
  ::v-deep {
    .el-dialog__wrapper {
      z-index: 2008 !important;
    }
  }
  &__add {
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    & label {
      font-weight: 600;
      color: #333333;
    }
    &--btn {
      padding: 9px 20px;
      cursor: pointer;
      color: #4689f5;
    }
  }
}
</style>
