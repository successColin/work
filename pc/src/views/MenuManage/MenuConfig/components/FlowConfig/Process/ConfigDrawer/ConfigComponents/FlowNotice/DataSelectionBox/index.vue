/**
* @name: index
* @author: DELL
* @date: 2021/10/27 11:38
* @description：数据选择框
* @update: 2021/10/27 11:38
*/
<!-- 页面 -->
<template>
  <section class="SelectCycle">
    <div class="SelectCycle__con" :class="[{ disabled: disabled }]">
      <!-- 搜索框 -->
      <el-select
        v-bind="$attrs"
        :value="relValue"
        :disabled="disabled"
        filterable
        class="SelectCycle__select"
        ref="select"
        @blur="showRes = true"
      >
        <el-option
          v-for="item in options"
          :key="item[showValueKey]"
          :label="item[showName]"
          :value="item[showValueKey]"
          @click.native="select(item)"
          class="SelectCycle__option"
        >
          <span class="SelectCycle__option--label">{{ item[showName] }}</span>
        </el-option>
      </el-select>
      <i
        class="iconfont icon-jiahao"
        @click="handleAdd"
        :class="[{ disabled: disabled }]"
      ></i>
      <div
        class="SelectCycle__result"
        v-if="selectedKey && showRes"
        @click="changeRes"
      >
        <div class="SelectCycle__result--table">
          <span class="font__ellipsis" :title="getSelectedName">{{
            getSelectedName
          }}</span>
        </div>
      </div>
    </div>
    <transition name="slide-bottom">
      <ContentList
        :isShow.sync="dialogVisible"
        v-if="dialogVisible"
        @chooseTemplate="handleChooseTemplate"
        :currentRadioObj="{ id: relValue }"
      />
    </transition>
  </section>
</template>

<script>
import { getTemplateList } from '@/api/timedTask';
import ContentList from './ContentList/index';

export default {
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dataType: {
      type: String,
      default() {
        return 'noticeTemplate';
      }
    },
    showName: {
      type: String,
      default() {
        return 'name';
      }
    },
    showValueKey: {
      type: String,
      default() {
        return 'id';
      }
    },
    value: {
      type: Number,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      relValue: '',
      // 下拉选择
      options: [],
      // 是否显示弹出框
      dialogVisible: false,
      // 当前选中数据
      selectedKey: null,
      showRes: true
    };
  },
  components: { ContentList },
  computed: {
    getSelectedName() {
      if (!this.selectedKey) return '';
      const obj = this.options.find(
        (item) => item[this.showValueKey] === this.selectedKey[this.showValueKey]
      );
      if (!obj) return '';
      return obj[this.showName];
    }
  },
  mounted() {
    // 获取数据
    this.fetchData();
  },
  watch: {
    value: {
      handler(v) {
        this.relValue = v;
      }
    }
  },
  methods: {
    getQueryApi() {
      // 获取接口
      if (this.dataType === 'noticeTemplate') {
        return getTemplateList;
      }
      return getTemplateList;
    },
    getQueryParams() {
      if (this.dataType === 'noticeTemplate') {
        return {};
      }
      return {};
    },
    // eslint-disable-next-line no-empty-function
    async fetchData() {
      const api = this.getQueryApi();
      const params = this.getQueryParams();
      try {
        const list = (await api(params)) || [];
        if (this.dataType === 'noticeTemplate') {
          this.options = list;
        }
        this.$nextTick(() => {
          this.relValue = this.value;
          const obj = list.find((item) => item.id === Number(this.value));
          if (obj) {
            this.$emit('toMakeOptions', obj.messageTypes);
          }
        });
      } catch (e) {
        // console.log(e);
      }
    },
    // 获取列表数据
    async getOptionList() {
      if (this.disabled) {
        return;
      }
      this.options = this.optionArray;
    },
    // 按钮__添加
    async handleAdd() {
      if (this.disabled) {
        return false;
      }
      this.dialogVisible = true;
    },
    // 弹出框值
    async getPopupsList(params) {
      const popupsList = this.getListFun(params);
      return popupsList;
    },
    // 单选值
    select(item) {
      this.selectedKey = item;
      this.$refs.select.blur();
      this.relValue = item[this.showValueKey];
      this.$emit('handleSelect', this.selectedKey);
    },
    // 更改展现形式
    changeRes() {
      if (this.disabled) {
        return false;
      }
      this.showRes = false;
      this.$refs.select.focus();
    },
    // 选择数据
    handleChooseTemplate(obj) {
      this.relValue = obj[this.showValueKey];
      this.selectedKey = obj;
      this.$emit('handleSelect', obj);
    }
  }
};
</script>
<style lang='scss' scoped>
.SelectCycle {
  position: relative;
  &__select {
    width: 100%;
    &:focus-within + .icon-jiahao {
      border-color: $--color-primary;
      background: #f1f7ff;
      color: $--color-primary;
    }
  }
  &__option {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 24px;
      margin-right: 8px;
      color: #5a80ed;
      font-weight: normal;
    }
    &--label {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
  }
  &__result {
    position: absolute;
    height: 32px;
    left: 0;
    bottom: 0;
    right: 32px;
    &--table {
      display: flex;
      align-items: center;
      position: absolute;
      top: 3px;
      right: 3px;
      bottom: 3px;
      left: 3px;
      background: #e5f0ff;
      border-radius: 4px;
      cursor: pointer;
      i {
        width: 28px;
        height: 100%;
        background: #5a80ed;
        line-height: 24px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        border-radius: 4px 0 0 4px;
        margin-right: 4px;
      }
      span {
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-left: 6px;
      }
    }
  }
  &__con {
    &:hover:not(.disabled) {
      .icon-jiahao {
        border-color: $--color-primary;
        background: #f1f7ff;
        color: $--color-primary;
      }
      ::v-deep {
        .el-input__inner {
          border-color: $--color-primary;
        }
      }
    }
    &.disabled {
      .SelectCycle__result--table {
        cursor: not-allowed;
        background: #f1f3f6;
      }
      .icon-shujubiao {
        background-color: #bbc3cd;
      }
    }
    .icon-jiahao {
      font-size: 18px;
      color: #aaaaaa;
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      cursor: pointer;
      border-left: 1px dashed #d9d9d9;
      transition: border-color 300ms ease-in-out;
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}
::v-deep {
  .el-input__inner {
    // border: 1px dashed #d9d9d9;
    border-style: dashed;
    border-color: #d9d9d9;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-radio__label {
    display: none;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 12px;
  }
  .el-select {
    width: 100%;
    height: 32px;
  }
}
</style>
