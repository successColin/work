<!--
 * @Descripttion: 密码框
 * @Author: ytx
 * @Date: 2021-04-14 17:43:39
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:22:40
-->
<template>
  <section class="inputPassword">
    <!-- 如果 密码大于6小于18提示 -->
    <div class="inputPassword__tips" v-show="isShowTips" v-if="isShow">
      <div
        v-for="(item, i) in degreeArr"
        :key="i"
        :class="{ fontColor: item.state }"
      >
        <i
          class="iconfont icon-xuanzhong inputPassword__tips--icon"
          :class="{ iconColor: item.state }"
          v-if="item.state"
        ></i>
        <i
          class="iconfont icon-weixuanzhong inputPassword__tips--icon"
          :class="{ iconColor: item.state }"
          v-else
        ></i>
        {{ item.label }}
      </div>
    </div>
    <!-- input 密码框 -->
    <apiot-input
      v-bind="$attrs"
      v-on="$listeners"
      class="inputPassword__input"
      autocomplete="new-password"
      :placeholder="placeholder"
      :slotType="slotType"
      :type="pwdType"
      :isForbid="false"
      @input="handleChange"
      @blur="handleBlur"
    >
      <i
        slot="suffix"
        :class="[
          'iconfont',
          'iconHover',
          pwdType ? 'icon-mimayincang' : 'icon-mimaxianshi',
        ]"
        @click="showPwdFun"
      >
      </i>
      <div :style="styleWidth" slot="prepend">
        {{ prependText }}
      </div>
    </apiot-input>
  </section>
</template>

<script>
import { securityCheckTwo, securityCheckFour } from '@/utils/validationRules';

export default {
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: ''
    },
    // 插槽类型
    slotType: {
      type: String,
      default: 'suffix'
    },
    // 左侧插槽内容
    prependText: {
      type: String,
      default: ''
    },
    // 左侧插槽宽度
    prependWidth: {
      type: String,
      default: ''
    },
    // 是否显示密码大于6小于18提示
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 密码类型
      pwdType: 'password',
      // 密码强度提示
      degreeArr: [
        { label: this.$t('login.comprisedOfAnyNumberLetterOrPunctuationCharacter'), state: true },
        {
          label: this.$t('login.comprisedOfAnyTwoCharactersNumeralsLettersAndPunctuationMarks'),
          state: false
        },
        { label: this.$t('login.anyTwoTypesOfNumbersLettersAndPunctuationMarks'), state: false }
      ],
      // 是否显示密码强度提示
      isShowTips: false
    };
  },
  computed: {
    styleWidth() {
      return `min-width: ${this.prependWidth}`;
    }
  },
  methods: {
    showPwdFun() {
      this.pwdType = this.pwdType === 'password' ? '' : 'password';
    },
    // input change 事件
    handleChange(val) {
      const { length } = val;
      // val = this.chineseChar2englishChar(val);
      if (length >= 8) {
        let num = 1;
        if (securityCheckFour.test(val)) {
          num = 3;
        } else if (securityCheckTwo.test(val)) {
          num = 2;
        }
        this.isShowTips = true;
        this.degreeArr.forEach((item, i) => {
          i += 1;
          if (i <= num) {
            item.state = true;
          } else {
            item.state = false;
          }
        });
      } else {
        this.isShowTips = false;
      }
    },
    // // 中文字符转英文字符
    // chineseChar2englishChar(chineseChar) {
    //   // 将单引号‘’都转换成'，将双引号“”都转换成"
    //   let str = chineseChar.replace(/’|‘/g, "'").replace(/“|”/g, '"');
    //   // 将中括号【】转换成[]，将大括号｛｝转换成{}
    //   str = str
    //     .replace(/【/g, '[')
    //     .replace(/】/g, ']')
    //     .replace(/｛/g, '{')
    //     .replace(/｝/g, '}')
    //     .replace(/！/g, '!');
    //   // 将逗号，转换成,，将：转换成:
    //   str = str.replace(/，/g, ',').replace(/：/g, ':');
    //   return str;
    // },
    // input 失去焦点时 不显示 tips
    handleBlur() {
      this.isShowTips = false;
    }
  }
};
</script>
<style lang='scss' scoped>
$paddingVal: 15px;
.inputPassword {
  position: relative;
  // 提示
  &__tips {
    position: absolute;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    // padding: 10px 15px;
    padding: 0 0 10px $paddingVal;
    z-index: 9999;
    top: -110px;
    text-align: left;
    font-size: 12px;
    color: #333333;
    width: 450px; // calc(100% - #{$paddingVal})
    div {
      height: 30px;
      display: flex;
      color: #808080;
      align-items: center;
      .inputPassword__tips--icon {
        margin-right: 6px;
        font-size: 13px;
        margin-top: 2px;
      }
      .iconColor {
        color: #4689f5;
      }
    }
    .fontColor {
      color: #333333 !important;
    }
  }
  .iconfont {
    margin-right: 10px;
    color: #bbc3cd;
    font-size: 20px;
    line-height: 40px;
  }
  .iconfont:hover {
    cursor: pointer;
    color: $--hover-iconColor;
  }
  &__input {
    .icon-mimayincang,
    .icon-mimaxianshi {
      font-size: 20px;
    }
  }
}
</style>
