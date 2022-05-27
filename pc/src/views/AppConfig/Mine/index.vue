<template>
  <div class="appBox">
    <div class="appBox__left"></div>
    <div class="appBox__center">
      <div class="appBox__scroll">
        <div class="appBox__phone">
          <div class="appBox__phone--wrapper mine">
            <div class="mine__header">
              <span class="mine__header--pos">我的</span>
              <div class="mine__header--rightFunc">
                <app-top-menu
                  v-for="(item, index) in configData.rightFunc"
                  :key="index"
                  :config="item"
                  :activeObj="activeObj"
                  class="m-l-10"
                ></app-top-menu>
              </div>
            </div>
            <div class="mine__body" ref="appScroll">
              <div class="appBox__body--scroll">
                <!-- 个人信息 -->
                <my-info class="m-b-10"></my-info>
                <!-- 功能区 -->
                <func-area
                  :config="configData.funcArea"
                  :activeObj="activeObj"
                  class="m-b-10"
                ></func-area>
                <!-- 固定菜单 -->
                <sys-module
                  :config="configData.sysModule"
                  :activeObj="activeObj"
                ></sys-module>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="appBox__right">
      <component
        :is="activeObj.configCompName"
        :activeObj="activeObj"
        :key="activeObj.compId"
        :configData="configData"
        :backAllConfig="configData"
        parentKey="my"
        @saveFunctionInterface="saveFunctionInterface"
        :scroll="appScroll"
      ></component>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { createUnique } from '@/utils/utils';
import { saveMyInterface, getMyInterface } from '@/api/appConfig';
// 配置
import FixMenuConfig from '../components/Config/FixMenuConfig';
import FuncAreaConfig from '../components/Config/FuncAreaConfig';
import FuncGroupConfig from '../components/Config/FuncGroupConfig';
import DeployMenuConfig from '../components/Config/DeployMenuConfig';
import SysModuleConfig from '../components/Config/SysModuleConfig';
// 组件
import AppTopMenu from '../components/Comp/AppTopMenu';
import FuncArea from '../components/Comp/FuncArea';
import MyInfo from '../components/Comp/MyInfo';
import SysModule from '../components/Comp/SysModule';

export default {
  data() {
    return {
      appScroll: null,
      configData: {
        // 右上角按钮
        rightFunc: [
          {
            compId: createUnique(),
            icon: {
              icon: '',
              color: '',
              imageUrl: ''
            },
            menuName: '',
            enableMenu: 0,
            routeName: '',
            configCompName: 'FixMenuConfig'
          },
          {
            compId: createUnique(),
            icon: {
              icon: '',
              color: '',
              imageUrl: ''
            },
            menuName: '',
            enableMenu: 0,
            routeName: '',
            configCompName: 'FixMenuConfig'
          }
        ],
        // 功能区
        funcArea: {
          compId: createUnique(),
          configCompName: 'FuncAreaConfig',
          groupArr: []
        },
        // 系统菜单
        sysModule: {
          compId: createUnique(),
          configCompName: 'SysModuleConfig',
          enableChangePas: 1,
          enableAboutVersion: 1,
          enableQrCode: 1,
          enableClearCache: 1,
          enableLogin: 0,
          // enableChangeLang: 1,
          enableFeedback: 0
        }
      },
      activeObj: {
        compId: ''
      }
    };
  },

  components: {
    // 配置
    FixMenuConfig,
    FuncAreaConfig,
    FuncGroupConfig,
    DeployMenuConfig,
    SysModuleConfig,
    // 组件
    AppTopMenu,
    FuncArea,
    MyInfo,
    SysModule
  },

  computed: {},

  mounted() {
    this.$bus.$on('selectActive', (obj) => {
      this.activeObj = obj;
      // console.log('当前选中', obj);
    });
    this.initScroll();
    this.getMyInterface();
  },

  methods: {
    initScroll() {
      this.$nextTick(() => {
        this.appScroll = new BScroll(this.$refs.appScroll, {
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          },
          bounce: false
        });
      });
    },
    // 保存功能界面
    async saveFunctionInterface(flag) {
      const a = {
        myInterface: this.backAllConfig,
        id: 1
      };
      await saveMyInterface({ sysAppInterfaceConfig: JSON.stringify(a) });
      if (flag === 1) {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      }
    },
    // 获取功能界面
    async getMyInterface() {
      const data = await getMyInterface({
        id: 1 // 有且仅有一条
      });
      if (data.myInterface) {
        this.configData = {
          ...this.configData,
          ...data.myInterface
        };
      }
      this.backAllConfig = this.configData;
    }
  },

  async beforeRouteLeave(to, from, next) {
    if (to.name === 'login') {
      next();
      return;
    }
    try {
      if (localStorage.token) {
        await this.saveFunctionInterface();
      }
      next();
    } catch (error) {
      // await this.$confirm('当前页面配置保存失败，是否离开', {
      //   confirmButtonText: this.$t('common.sure'),
      //   cancelButtonText: this.$t('common.cancle'),
      //   type: 'warning'
      // });
      next();
    }
  },

  watch: {
    configData: {
      handler() {
        this.$nextTick(() => {
          if (this.appScroll) {
            this.appScroll.refresh();
          }
        });
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.appScroll) {
      this.appScroll.destroy();
    }
    this.$bus.$off('selectActive');
  }
};
</script>

<style lang='scss' scoped>
@import '../app.scss';
.mine {
  &__header {
    display: flex;
    height: 54px;
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid #e9e9e9;
    padding: 0 10px;
    position: relative;
    &--pos {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
    &--rightFunc {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
    &--title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
    .icon-fanhui {
      color: #bbc3cd;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
    }
  }
  &__footer {
    height: 72px;
    border-top: 1px solid #e9e9e9;
    box-sizing: border-box;
  }
  &__body {
    height: calc(100% - 72px - 54px);
    box-sizing: border-box;
    overflow: hidden;
    padding: 10px 0px;
    &.curHeight {
      height: calc(100% - 54px);
    }
  }
}
</style>
