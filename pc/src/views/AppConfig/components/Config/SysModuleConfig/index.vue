<template>
  <section class="funcConfig config">
    <div class="config__header">固定模块</div>
    <div class="config__body">
      <p class="config__body--switch m-t-12">
        启用修改密码
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableChangePas"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        启用关于版本
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableAboutVersion"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        启用我的二维码
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableQrCode"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        启用清空缓存
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableClearCache"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        启用注销登录
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableLogin"
        >
        </el-switch>
      </p>
      <!-- <p class="config__body--switch">
        启用多语言切换
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableChangeLang"
        >
        </el-switch>
      </p> -->
      <p class="config__body--switch">
        启用意见反馈
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.sysModule.enableFeedback"
        >
        </el-switch>
      </p>
    </div>
  </section>
</template>

<script>
import { createUnique } from '@/utils/utils';

export default {
  props: {
    configData: {
      type: Object
    },
    scroll: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    // console.log(24234);
  },

  methods: {
    updateScroll() {
      this.$nextTick(() => {
        if (this.scroll) {
          this.scroll.refresh();
        }
      });
    },
    changeMine() {
      // console.log(this.configData.footerArea.groupArr[0].menuArr.length);
      if (
        this.configData.footerArea.groupArr[0].menuArr.length >= 5 &&
        !this.configData.enableMine
      ) {
        return this.$message({
          type: 'warning',
          message: '底部菜单最多5个'
        });
      }
      if (this.configData.enableMine) {
        this.configData.enableMine = 0;
      } else {
        this.configData.enableMine = 1;
      }
      if (this.configData.enableMine === 1) {
        this.configData.footerArea.groupArr[0].menuArr.push({
          compId: createUnique(),
          type: 2,
          isFooter: true,
          compName: 'AppMenu',
          configCompName: 'DeployMenuConfig',
          menuName: '我的',
          routeName: '',
          icon: {
            icon: '',
            color: '',
            imageUrl: ''
          },
          groupCompId: '',
          isFixed: true
        });
      } else {
        this.configData.footerArea.groupArr[0].menuArr.splice(-1, 1);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
</style>
