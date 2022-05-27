<!--
 * @Descripttion: 多语言
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:44:53
-->
<template>
  <div class="myLang">
    <el-dropdown
      @command="handleCommand"
      @visible-change="handleVisible"
      class="myLang__postion"
    >
      <!-- 当前语言 -->
      <span :class="{ 'myLang--cursor': true, myLang__link: isMove }">
        <img :src="currentLangOjb.url" alt="" class="myLang__img" />
        {{ currentLangOjb.name }}
        <i class="el-icon-arrow-up el-icon--right" v-if="isMove"></i>
        <i class="el-icon-arrow-down el-icon--right" v-else></i>
      </span>
      <!-- 下拉框 -->
      <el-dropdown-menu slot="dropdown" class="myLang__dropdown">
        <el-dropdown-item
          v-for="(item, i) in data"
          :key="i"
          :command="item.val"
        >
          <img :src="item.url" alt="" class="myLang__img" />
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import cnImg from '@/assets/img/cn.png';
import enImg from '@/assets/img/en.png';

export default {
  data() {
    return {
      isMove: false,
      localLang: '', // 当前语言 zhCN or enUS
      currentLangOjb: {}, // 当前语言对象
      data: [
        {
          name: '中文',
          url: cnImg,
          val: 'zhCN'
        },
        {
          name: 'EN',
          url: enImg,
          val: 'enUS'
        }
      ]
    };
  },
  components: {},
  computed: {},
  watch: {
    localLang(now) {
      this.currentLangOjb = this.data.find((item) => item.val === now);
      this.$i18n.locale = now;
    }
  },
  mounted() {
    // 获取语言
    this.getSystemLanguage();
  },
  methods: {
    // 先获取localStorage语言，如果没有在获取系统语言
    getSystemLanguage() {
      this.localLang = localStorage.getItem('apiotLanguage');
      if (!this.localLang) {
        let lang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
        lang = lang.replace(/-/, ''); // 截取lang前2位字符
        localStorage.setItem('apiotLanguage', lang);
        this.localLang = localStorage.getItem('apiotLanguage');
      }
    },
    // 点击option，修改语言
    handleCommand(command) {
      this.localLang = command;
      localStorage.setItem('apiotLanguage', command);
      this.$bus.$emit('changeLange');
    },
    // 下拉框出现/隐藏时触发
    handleVisible(val) {
      this.isMove = val;
    }
  }
};
</script>
<style lang='scss' scoped>
.myLang {
  cursor: pointer;
  height: 100%;
  margin-top: 45px;
  &__link {
    background: #f1f3f6;
  }
  &--cursor,
  &__link {
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
  }
  &__link,
  &__dropdown,
  &--cursor {
    display: inline-block;
    color: #333333;
    font-size: 13px;
    border-radius: 4px;
  }
  &__img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
  :focus {
    outline: 0;
  }
}
::v-deep {
  .el-dropdown-menu__item {
    padding-right: 35px;
  }
}
</style>
