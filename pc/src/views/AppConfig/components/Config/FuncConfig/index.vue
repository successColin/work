<template>
  <section class="funcConfig config">
    <div class="config__header">首页全局配置</div>
    <div class="config__body">
      <p class="config__body--switch m-t-12" v-if="configData.type !== 3">
        是否启用定位
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.enablePos"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否启用右上角功能
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.enableRightFunc"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否启用轮播图
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.enableRotation"
        >
        </el-switch>
      </p>
      <p class="config__body--switch" v-if="configData.type !== 3">
        是否启用公告栏
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.enableNotice"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否启用资讯区
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.enableInfo"
        >
        </el-switch>
      </p>
      <p class="config__body--switch" v-if="configData.type !== 3">
        是否启用底部功能区
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="configData.enableFooter"
          @change="updateScroll"
        >
        </el-switch>
      </p>
      <p class="config__body--switch" v-if="configData.type !== 3">
        是否启用我的
        <el-switch
          @change="changeMine"
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          :value="configData.enableMine"
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

  mounted() {},

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
          type: 'error',
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
          selectIcon: {
            icon: '',
            color: '',
            imageUrl: ''
          },
          groupCompId: '',
          isFixed: true,
          isMine: true
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
