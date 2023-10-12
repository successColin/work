<!--
 * @Descripttion: 选择人/分享
 * @Author: ytx
 * @Date: 2022-01-08 08:34:26
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 08:34:26
-->
<template>
  <apiot-popup :show="show" @close="$emit('update:show', false)">
    <!-- v-show="isSwitch" -->
    <section class="selectPeople" :style="{ height: customHeight }">
      <div class="selectPeople__header">
        <div class="selectPeople__header--title">分享</div>
        <div class="selectPeople__header--select" v-if="getSelectLength !== 0">
          已选择({{ getSelectLength }})
        </div>
      </div>
      <apiot-input
        class="selectPeople__search"
        prefixIcon="appIcon-sousuo"
        placeholder="请输入关键字搜索"
        v-model="keyworld"
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
          v-if="showValue === 1"
          :isAll="true"
          :listObj="listObj"
          :listArr="listArr"
          @giveSelected="getSelectFun"
        ></common-user>
        <!-- 常用 -->
        <common-user
          v-else-if="showValue === 2"
          @giveSelected="getSelectFun"
          :listArr="listArr"
        ></common-user>
        <!-- 按角色 -->
        <!-- :isSwitch.sync="isSwitch" -->
        <pass-role v-else-if="showValue === 3"></pass-role>
        <!-- 按组织 -->
        <!-- :isSwitch.sync="isSwitch" -->
        <!-- <pass-org v-else-if="showValue === 4"></pass-org> -->
        <!-- 按职位 -->
        <!-- :isSwitch.sync="isSwitch" -->
        <!-- <pass-position v-else-if="showValue === 5"></pass-position> -->
      </div>

      <footer>
        <u-button class="m-r-12" text="取消" @click="handleReset"></u-button>
        <u-button type="primary" text="确定" @click="handleOk"></u-button>
      </footer>
    </section>
    <!-- 按角色、按住址、按职位 -->
    <!-- :isSwitch.sync="isSwitch" -->
    <!-- <switch-page
      v-show="!isSwitch"
      :style="{ height: switchPageHeight }"
    ></switch-page> -->
    <apiot-point :obj="tipObj"></apiot-point>
  </apiot-popup>
</template>

<script>
import CommonUser from './components/CommonUser';
import PassRole from './components/PassRole';
import ApiotPoint from '../../../../ApiotPoint';
// import PassOrg from './components/PassOrg';
// import PassPosition from './components/PassPosition';
// import SwitchPage from './SwitchPage';
// 接口
import { pageSysUser, listCollectionUser, fileShare } from '@/api/knowledgeBase';

export default {
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: false
    },
    classId: {
      type: Number,
      default: 1
    },
    // 当前数据的id
    currentId: {
      type: Number
    }
  },
  data() {
    return {
      // 切换，默认（）
      tipObj: {}, // 提示
      listArr: [], // 常用用户
      listObj: {}, // 全部用户
      keyworld: '',
      isSwitch: true,
      getSelectArr: [], // 选中的数组
      showValue: 1,
      navArr: [
        {
          name: '全部',
          state: true,
          id: 1
        },
        {
          name: '常用',
          state: false,
          id: 2
        },
        {
          name: '按角色',
          state: false,
          id: 3
        },
        {
          name: '按组织',
          state: false,
          id: 4
        },
        {
          name: '按职位',
          state: false,
          id: 5
        }
      ]
    };
  },
  components: {
    CommonUser,
    PassRole,
    ApiotPoint
    // PassOrg,
    // PassPosition
    // SwitchPage
  },
  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    customHeight() {
      let height = 0;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      // #ifndef MP-ALIPAY
      height = this.systemInfo.customBar || 0;
      // #endif
      return `calc(100vh - ${height}px - 30rpx)`;
    },
    switchPageHeight() {
      let height = 0;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      // #ifndef MP-ALIPAY
      height = this.systemInfo.customBar || 0;
      // #endif
      return `calc(100vh - ${height}px - 30rpx)`;
    },
    // 选中的长度
    getSelectLength() {
      return this.getSelectArr.length;
    },
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    }
  },
  watch: {
    show: {
      deep: true,
      handler(v) {
        console.log(v);
        // this.isSwitch = v;
        const state = this.showValue;
        if (state === 1) {
          this.getSysUser();
        } else if (state === 2) {
          console.log(1);
        } else if (state === 3) {
          console.log(1);
        } else if (state === 4) {
          console.log(1);
        } else if (state === 5) {
          console.log(1);
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 获取全部人员接口
    async getSysUser() {
      this.listObj = await pageSysUser({
        size: 20,
        current: 1,
        orders: [
          {
            asc: true,
            column: ''
          }
        ]
      });
      this.listArr = await listCollectionUser({});
    },
    getSelectFun(v) {
      this.getSelectArr = v;
    },
    handleSelect(v) {
      this.navArr.forEach((item) => {
        item.state = false;
      });
      v.state = true;
      this.showValue = v.id;
    },
    handleReset() {
      this.$emit('update:show', false);
    },
    // 确定
    async handleOk() {
      console.log(this.getSelectArr.join(','));
      await fileShare({
        classId: this.classId,
        ids: this.currentId,
        ownid: this.getUserId,
        shareType: 1,
        userids: this.getSelectArr.join(',')
      });
      this.tipObj = {
        type: 'success',
        message: '分享成功'
      };
      this.$emit('update:show', false);
    }
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';

// class 变量名
$--name: 'selectPeople';

@include setLayout($--name);
</style>
