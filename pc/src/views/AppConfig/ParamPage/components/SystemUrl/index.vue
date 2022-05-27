<!--
 * @Author: sss
 * @Date: 2022-05-11 08:49:30
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-11 08:49:30
 * @Desc:系统环境
-->
<template>
  <div class="systemUrl">
    <div class="systemUrl__content">
      <div class="systemUrl__content--left">
        <qrcode-down :value="allServe" title="全部环境"></qrcode-down>
      </div>
      <div class="systemUrl__content--right">
        <el-form
          label-position="top"
          label-width="80px"
          class="form"
          ref="addDict"
          :model="formData"
        >
          <div class="form--line">
            <el-form-item
              label="正式环境"
              class="form--child"
              prop="production"
            >
              <apiot-input
                v-model="formData.production"
                slotType="suffix,prepend"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: '正式环境',
                  })
                "
              >
                <el-select
                  v-model="formSelect.production"
                  slot="prepend"
                  placeholder="请选择"
                >
                  <el-option label="http://" value="http://"></el-option>
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
                <qrcode-input
                  v-if="formData.production"
                  slot="suffix"
                  title="正式环境"
                  :value="production"
                ></qrcode-input>
              </apiot-input>
            </el-form-item>
          </div>
          <div class="form--line">
            <el-form-item
              label="外网测试环境"
              class="form--child"
              prop="testExtranet"
            >
              <apiot-input
                v-model="formData.testExtranet"
                slotType="suffix,prepend"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: '外网测试环境',
                  })
                "
              >
                <el-select
                  v-model="formSelect.testExtranet"
                  slot="prepend"
                  placeholder="请选择"
                >
                  <el-option label="http://" value="http://"></el-option>
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
                <qrcode-input
                  v-if="formData.testExtranet"
                  slot="suffix"
                  title="外网测试环境"
                  :value="testExtranet"
                ></qrcode-input>
              </apiot-input>
            </el-form-item>
          </div>
          <div class="form--line">
            <el-form-item
              label="内网测试环境"
              class="form--child"
              prop="testIntranet"
            >
              <apiot-input
                v-model="formData.testIntranet"
                slotType="suffix,prepend"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: '内网测试环境',
                  })
                "
              >
                <el-select
                  v-model="formSelect.testIntranet"
                  slot="prepend"
                  placeholder="请选择"
                >
                  <el-option label="http://" value="http://"></el-option>
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
                <qrcode-input
                  v-if="formData.testIntranet"
                  slot="suffix"
                  title="内网测试环境"
                  :value="testIntranet"
                ></qrcode-input>
              </apiot-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <footer class="systemUrl__footer">
      <apiot-button type="primary" @click="saveUrl()" class="saveBtn"
        >保存</apiot-button
      >
    </footer>
  </div>
</template>

<script>
import QrcodeInput from '../QrcodeInput';
import QrcodeDown from '../QrcodeDown';

export default {
  components: {
    QrcodeInput,
    QrcodeDown
  },

  props: {},

  data() {
    return {
      url: 'https://www.baidu.com/',
      formData: {
        production: '',
        testExtranet: '',
        testIntranet: ''
      },
      formSelect: {
        production: 'http://',
        testExtranet: 'http://',
        testIntranet: 'http://'
      }
    };
  },

  computed: {
    production() {
      const { production: url } = this.formData;
      const { production: http } = this.formSelect;

      if (!url) return '';
      return { production: `${http}${url}` };
    },
    testExtranet() {
      const { testExtranet: url } = this.formData;
      const { testExtranet: http } = this.formSelect;

      if (!url) return '';
      return { testExtranet: `${http}${url}` };
    },
    testIntranet() {
      const { testIntranet: url } = this.formData;
      const { testIntranet: http } = this.formSelect;

      if (!url) return '';
      return { testIntranet: `${http}${url}` };
    },
    allServe() {
      const { production, testExtranet, testIntranet } = this;
      if (!production && !testExtranet && !testIntranet) return '';
      const serve = {
        ...production,
        ...testExtranet,
        ...testIntranet
      };
      return serve;
    }
  },

  methods: {
    saveUrl() {}
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'systemUrl';
@include setListLayout($--name);
.systemUrl {
  &__content {
    &--left {
      flex-shrink: 0;
    }
    &--right {
      margin-left: 40px;
      padding-left: 40px;
      flex: 1;
    }
  }
}
</style>
