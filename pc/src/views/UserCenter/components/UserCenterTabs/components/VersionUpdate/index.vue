<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-24 13:59:58
 * @Des: 个人中心-版本升级
-->
<template>
  <div class="update-wrap">
    <div class="basic">
      <div class="basic__item">
        <label class="basic__item__label">{{ $t('userCenter.avatar') }}</label>
        <div class="basic__item__content">
          <span>升级</span>
          <div class="basic__item__content__operation">
            <span @click="updateVersion">{{ $t('common.modify') }}</span>
          </div>
        </div>
      </div>
      <div class="basic__item">
        <label class="basic__item__label even-label">{{
          $t('userCenter.name')
        }}</label>
        <div class="basic__item__content">
          <span>版本功能特权</span>
          <div class="basic__item__content__operation">
            <span v-if="!isEditName" @click="updateVersion">{{
              $t('common.modify')
            }}</span>
            <span v-else @click="saveName">{{ $t('common.save') }}</span>
          </div>
        </div>
      </div>
      <div class="basic__item">
        <label class="basic__item__label">{{
          $t('userCenter.telphone')
        }}</label>
        <div class="basic__item__content">
          <span>2021-06-06</span>
          <div class="basic__item__content__operation">
            <span @click="updateVersion('phone')">续费</span>
          </div>
        </div>
      </div>
      <div class="basic__item">
        <label class="basic__item__label even-label">{{
          $t('userCenter.email')
        }}</label>
        <div class="basic__item__content">
          <p>正常</p>
        </div>
      </div>
    </div>
    <p class="update-title">企业订单记录</p>
    <section class="order-list">
      <apiot-table
        :tableData="tableData"
        row-key="tableName"
        :highlight-current-row="true"
        :dropColumnData="columnArr"
        ref="entityTable"
      >
        <el-table-column
          v-for="(item, index) in columnArr"
          resizable
          :key="`${item.prop}_${index}`"
          :label="$t(item.label)"
          :prop="item.prop"
          :index="index + 1"
        ></el-table-column>
      </apiot-table>
    </section>
  </div>
</template>

<script>
import { editUserName, editUserSignature } from '@/api/userCenter.js';

export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isEditName: false,
      tableData: [],
      columnArr: [
        {
          prop: 'name',
          label: '名称',
          showTooltip: true,
          component: 'UserColumn'
        },
        {
          prop: 'amount',
          label: '金额',
          showTooltip: true,
          component: 'NormalColumn'
        },
        {
          prop: 'buytime',
          label: '购买时间',
          showTooltip: true,
          component: 'NormalColumn'
        },
        {
          prop: 'payway',
          label: '支付方式',
          showTooltip: true,
          component: 'StateColumn'
        }
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.info = JSON.parse(JSON.stringify(this.userInfo));
  },

  methods: {
    updateVersion() {
      this.isEditName = true;
    },
    editSign() {
      this.isEditSign = true;
    },
    async saveName() {
      const param = {
        username: this.info.username
      };
      await editUserName(param);
      this.isEditName = false;
      this.$emit('getUserCenterInfo');
    },
    async saveSign() {
      const param = {
        signature: this.info.signature
      };
      await editUserSignature(param);
      this.isEditSign = false;
      this.$emit('getUserCenterInfo');
    },
    editTelphone(type) {
      this.visibleTelphone = true;
      this.changeType = type;
      // console.log(this.changeType);
    },
    editAvatar() {
      this.visibleAvatar = true;
    },
    cutDown() {}
  }
};
</script>

<style lang='scss' scoped>
.update-wrap {
  .basic {
    width: 100%;
    overflow: hidden;
    font-size: 13px;
    border: 1px solid #e9e9e9;
    box-sizing: border-box;
    border-bottom: none;
    &__item {
      width: 50%;
      height: 72px;
      display: inline-flex;
      border-bottom: 1px solid #e9e9e9;
      &__label {
        width: 140px;
        height: 100%;
        background: #fafafa;
        padding: 0 30px;
        line-height: 72px;
        text-align: right;
        box-sizing: border-box;
        flex-shrink: 0;
        border-right: 1px solid #e9e9e9;
      }
      .even-label {
        border-left: 1px solid #e9e9e9;
      }
      &__content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
        &__operation {
          width: 100px;
          text-align: right;
          color: #4689f5;
          flex-shrink: 0;
          span {
            cursor: pointer;
          }
        }
      }
    }
    .whole-line {
      width: 100%;
    }
  }
}
</style>
