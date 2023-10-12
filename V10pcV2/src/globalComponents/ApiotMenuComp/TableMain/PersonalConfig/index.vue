<template>
  <div class="personal" v-loading="loading">
    <header class="personal__header">
      <el-checkbox
        :class="[{ isIndeterminate: isIndeterminate }]"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
      </el-checkbox>
      勾选您要显示的字段
    </header>
    <section class="personal__content">
      <draggable
        v-model="tempColumnData"
        group="tabs"
        animation="300"
        handle=".icon-zongxiangtuodong"
      >
        <transition-group class="personal__content--list" tag="ul">
          <li
            class="personal__content--item"
            v-for="child in tempColumnData"
            :key="child.compId"
          >
            <el-checkbox
              v-model="child.canShow"
              @change="isIndeterminate = true"
            >
            </el-checkbox>
            <span class="input"> {{ child.name }}</span>
            <i class="iconfont icon-zongxiangtuodong"></i>
          </li>
        </transition-group>
      </draggable>
    </section>
    <footer class="personal__footer">
      <apiot-button
        class="m-l-4"
        style="margin-left: 106px"
        @click="cancleClick"
        >取消</apiot-button
      >
      <apiot-button type="primary" @click="sureClick">保存</apiot-button>
    </footer>
  </div>
</template>

<script>
import { saveOrUpdate } from '@/api/menuManage';

export default {
  name: '',
  props: {
    dropColumnData: {
      type: Array,
    },
    showPersonal: {
      type: Boolean,
      default: false,
    },
    configData: {
      type: Object,
    },
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      tempColumnData: [],
      loading: false,
    };
  },
  components: {},
  inject: ['sysMenuDesignId', 'getDesignPersonal'],
  methods: {
    // 初始话操作
    initColumn() {
      this.tempColumnData = [];
      const len = this.dropColumnData.length;
      this.dropColumnData.forEach((item, index) => {
        if (item.dataSource.columnName !== 'id') {
          if (!item.canShow) {
            this.isIndeterminate = true;
          }
          this.tempColumnData.push({
            name: item.name,
            compId: item.compId,
            canShow: item.canShow,
          });
        }
        if (index === len - 1 && !this.isIndeterminate) {
          this.checkAll = true;
        }
      });
    },
    // 全选操作
    handleCheckAllChange(val) {
      this.tempColumnData.forEach((item) => {
        item.canShow = val;
      });
      this.isIndeterminate = false;
    },
    // 取消点击
    cancleClick() {
      this.$emit('update:showPersonal', false);
    },
    // 确认点击
    async sureClick() {
      if (!this.checkAll && !this.isIndeterminate) {
        return this.$message({
          type: 'warning',
          message: '至少选择一列',
        });
      }
      this.$emit('changeTableColumn', this.tempColumnData, false);
      this.$emit('update:showPersonal', false);
      sessionStorage.isColumnChange = true;
      const params = {
        compId: this.configData.compId,
        userid: this.$store.state.userCenter.userInfo.id,
        sysMenuDesignId: this.sysMenuDesignId(),
        designOverallLayout: JSON.stringify(this.tempColumnData),
      };
      if (this.getDesignPersonal()[this.configData.compId]) {
        params.id = this.getDesignPersonal()[this.configData.compId].id;
      }

      await saveOrUpdate(params);
    },
  },
  watch: {
    showPersonal(v) {
      if (v) {
        this.initColumn();
      }
    },
  },
};
</script>

<style lang="scss">
.personal {
  width: 260px;
  color: #333;
  &__header {
    box-sizing: border-box;
    height: 54px;
    border-bottom: 1px solid #e9e9e9;
    padding-left: 16px;
    line-height: 54px;
    .isIndeterminate {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 3px;
        top: 23px;
        width: 8px;
        height: 8px;
        background: #4689f5;
        z-index: 100;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #fff !important;
        border-color: #dcdfe6 !important;
      }
    }
  }
  &__content {
    max-height: 240px;
    padding: 0 16px;
    overflow: auto;
    &--list {
      line-height: 36px;
      .icon-zongxiangtuodong {
        float: right;
        cursor: pointer;
        color: #bbc3cd;
        &:hover {
          color: $--color-primary;
        }
      }
    }
  }
  &__footer {
    box-sizing: border-box;
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    border-top: 1px solid #e9e9e9;
  }
}
</style>
