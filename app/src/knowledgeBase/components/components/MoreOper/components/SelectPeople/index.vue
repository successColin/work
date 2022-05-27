<!--
 * @Descripttion: 选择人/分享
 * @Author: ytx
 * @Date: 2022-01-08 08:34:26
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 08:34:26
-->
<template>
  <apiot-popup :show="show" @close="$emit('update:show', false)">
    <section
      class="selectPeople"
      :style="{ height: customHeight }"
      v-show="isSwitch"
    >
      <div class="selectPeople__header">
        <div class="selectPeople__header--title">分享</div>
        <div class="selectPeople__header--select" v-if="getSelectLeng !== 0">
          已选择({{ getSelectLeng }})
        </div>
      </div>
      <apiot-input
        class="selectPeople__search"
        prefixIcon="appIcon-sousuo"
        placeholder="请输入关键字搜索"
      ></apiot-input>
      <nav class="selectPeople__nav">
        <div
          :class="[
            'selectPeople__nav--type',
            item.state ? 'selectPeople__nav--select' : '',
          ]"
          v-for="(item, i) in navArr"
          :key="i"
          @click="handleSelect(item)"
        >
          {{ item.name }}
        </div>
      </nav>
      <div class="selectPeople__content">
        <!-- 全部 -->
        <common-user
          v-if="showName === 'allUser'"
          :isAll="true"
          @giveSelected="getSelect"
        ></common-user>
        <!-- 常用 -->
        <common-user
          v-else-if="showName === 'commonUser'"
          @giveSelected="getSelect"
        ></common-user>
        <!-- 按角色 -->
        <pass-role
          v-else-if="showName === 'passRole'"
          :isSwitch.sync="isSwitch"
        ></pass-role>
        <!-- 按组织 -->
        <pass-org
          v-else-if="showName === 'passOrg'"
          :isSwitch.sync="isSwitch"
        ></pass-org>
        <!-- 按职位 -->
        <pass-position
          v-else-if="showName === 'passPosition'"
          :isSwitch.sync="isSwitch"
        ></pass-position>
      </div>

      <footer>
        <u-button class="m-r-12" text="取消" @click="handleReset"></u-button>
        <u-button type="primary" text="确定" @click="handleOk"></u-button>
      </footer>
    </section>
    <!-- 按角色、按住址、按职位 -->
    <switch-page
      v-show="!isSwitch"
      :style="{ height: switchPageHeight }"
      :isSwitch.sync="isSwitch"
    ></switch-page>
  </apiot-popup>
</template>

<script>
import CommonUser from './components/CommonUser';
import PassRole from './components/PassRole';
import PassOrg from './components/PassOrg';
import PassPosition from './components/PassPosition';
import SwitchPage from './SwitchPage';

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 切换，默认（）
      isSwitch: true,
      getSelectLeng: 0,
      showName: 'allUser',
      navArr: [
        {
          name: '全部',
          state: true,
          show: 'allUser'
        },
        {
          name: '常用',
          state: false,
          show: 'commonUser'
        },
        {
          name: '按角色',
          state: false,
          show: 'passRole'
        },
        {
          name: '按组织',
          state: false,
          show: 'passOrg'
        },
        {
          name: '按职位',
          state: false,
          show: 'passPosition'
        }
      ]
    };
  },
  components: {
    CommonUser,
    PassRole,
    PassOrg,
    PassPosition,
    SwitchPage
  },
  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    customHeight() {
      let height = 0;
      // #ifdef MP-DINGTALK
      height = 0;
      // #endif
      // #ifndef MP-DINGTALK
      height = this.systemInfo.customBar || 0;
      // #endif
      return `calc(100vh - ${height}px - 30rpx)`;
    },
    switchPageHeight() {
      let height = 0;
      // #ifdef MP-DINGTALK
      height = 0;
      // #endif
      // #ifndef MP-DINGTALK
      height = this.systemInfo.customBar || 0;
      // #endif
      return `calc(100vh - ${height}px - 30rpx)`;
    }
  },
  watch: {
    show: {
      deep: true,
      handler(v) {
        this.isSwitch = v;
      }
    }
  },
  mounted() {},
  methods: {
    getSelect(v) {
      this.getSelectLeng = v;
    },
    handleSelect(v) {
      this.navArr.forEach((item) => {
        item.state = false;
      });
      v.state = true;
      this.showName = v.show;
    },
    handleReset() {
      this.$emit('update:show', false);
    },
    handleOk() {}
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';

// class 变量名
$--name: 'selectPeople';

@include setLayout($--name);
</style>
