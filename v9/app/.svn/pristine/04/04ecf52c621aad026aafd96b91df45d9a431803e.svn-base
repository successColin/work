<template>
  <view class="readType">
    <m-back-bar>
      <block slot="barTitle">{{ $t('page-readType') }}</block
      ><!--版本信息-->
    </m-back-bar>
    <radio-group @change="radioChange" class="readType__radio">
      <label
        v-for="(item, index) in options"
        :key="index"
        class="readType__radio--label"
      >
        <view class="readType__radio--left">
          <view class="readType__radio--box">
            <m-font-icon
              icon="dukaleixing"
              color="#FFFFFF"
              :iconSize="48"
            ></m-font-icon>
          </view>
          <view style="margin-left: 20rpx">{{ item.label }}</view>
        </view>
        <radio
          :value="`${item.value}`"
          :checked="item.value == typeVal"
          :color="themeColorCode"
        />
      </label>
    </radio-group>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      options: [
        {
          value: 'NFC',
          label: 'NFC',
        },
        {
          value: 'RFID',
          label: 'RFID',
        },
      ],
      typeVal: 'NFC',
    };
  },
  computed: {
    ...mapState(['readCardType', 'themeColor', 'themeColorCode']),
  },
  methods: {
    ...mapMutations(['setGlobelParams']),
    radioChange(v) {
      this.setGlobelParams({
        key: 'readCardType',
        value: v.detail.value,
      });
      uni.setStorageSync('readCardTypeVal', v.detail.value);
    },
  },
  mounted() {
    console.log(this.readCardType);
    this.typeVal = this.readCardType;
  },
};
</script>
<style lang="scss" scoped>
.readType {
  width: 100%;
  &__radio {
    margin: 0 30rpx;
    &--label {
      display: flex;
      margin-top: 20rpx;
      padding-left: 25rpx;
      padding-right: 25rpx;
      height: 110rpx;
      background: #ffffff;
      border-radius: 8rpx;
      border: 1rpx solid #e9e9e9;
      align-items: center;
      justify-content: space-between;
    }
    &--left {
      display: flex;
    }
    &--box {
      width: 58rpx;
      height: 58rpx;
      background: #bbc3cd;
      border-radius: 12rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>