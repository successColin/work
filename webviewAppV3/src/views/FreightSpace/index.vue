<!--
 * @Descripttion: 货位信息标签打印
 * @Author: ytx
 * @Date: 2023-05-11 15:51:10
 * @Last Modified by: ytx
 * @Last Modified time: 2023-05-11 15:51:10
-->
<template>
  <div class="container">
    <div class="container__box" v-for="(item, index) in dataArr" :key="index">
      <table class="container__box--table">
        <tbody>
          <tr>
            <td width="60"><span class="container__label">货位</span></td>
            <td>
              <span>{{ item.stockLocation || '无' }}</span>
            </td>
            <td rowspan="3" width="120" height="120">
              <div class="container__qrcodeClass">
                <create-qrcode
                  :id="`qrCode_${index}`"
                  :text="item.stockLocation"
                ></create-qrcode>
              </div>
            </td>
          </tr>
          <tr v-for="(v, i) in fieldName" :key="i">
            <td>
              <span class="container__label">{{ v.name }}</span>
            </td>
            <td :colspan="v.colspan">
              <span>{{ item[v.key] || '无' }}</span>
            </td>
          </tr>
          <!-- <tr class="heighten memo">
            <td colspan="3"><span>实物管理标签，不得损毁</span></td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>
  <van-button
    class="container__button"
    type="primary"
    @click="handleClick"
    ref="btn"
  >
    <van-icon name="passed" class="container__button--icon" />
    确定打印
  </van-button>
  <apiot-dialog :isShow="isShow" title="重复打印数量(最小1,最大20)">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <!-- 通过 validator 返回错误提示 -->
        <van-field
          class="container__form--input"
          v-model="number"
          type="number"
          autofocus
          name="validatorMessage"
          placeholder="请输入数量"
          :rules="[{ validator: validatorMessage }]"
        />
      </van-cell-group>
      <div class="dialog__footer">
        <van-button class="footer__btn" @click="handleCancel">
          取消
        </van-button>
        <van-button
          class="footer__btn footer__primary"
          type="primary"
          native-type="submit"
          :loading-text="btn__loading__text"
          loading-type="spinner"
          :loading="btn__state"
        >
          确定
        </van-button>
      </div>
    </van-form>
  </apiot-dialog>
</template>

<script setup lang="ts">
import printMixin from '@/utils/printmixin';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();
const route = currentRoute.value;

const fieldName = reactive([
  {
    name: '物料',
    key: 'sparePartCode',
    colspan: 1,
  },
  {
    name: '名称',
    key: 'sparePartName',
    colspan: 1,
  },
  {
    name: '型号',
    key: 'specifications',
    colspan: 2,
  },
]);

const {
  number,
  isShow,
  dataArr,
  btn__loading__text,
  btn__state,
  getTestData,
  handleClick,
  validatorMessage,
  onSubmit,
  handleCancel,
} = printMixin({
  type: 3,
  ids: route.query.ids, // '453,454,491'
});

console.log(222222222);
onMounted(() => {
  console.log(11111);
  getTestData();
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/print.scss';
.heighten {
  height: 80px !important;
}
table td span {
  margin: 23px 0 23px 20px !important;
  line-height: 40px !important;
}
</style>
