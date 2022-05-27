<template>
  <div class="appBox">
    <div class="appBox__left">
      <func-config :configData="configData" :scroll="appScroll"></func-config>
    </div>
    <div class="appBox__center">
      <div class="appBox__scroll">
        <div class="appBox__phone">
          <div class="appBox__phone--wrapper appFunc">
            <div class="appFunc__header" v-if="configData.type !== 3">
              <span class="appFunc__header--pos" v-show="configData.enablePos"
                >上海区工厂</span
              >
              <div
                class="appFunc__header--rightFunc"
                v-show="configData.enableRightFunc"
              >
                <app-top-menu
                  v-for="(item, index) in configData.rightFunc"
                  :key="index"
                  :config="item"
                  :activeObj="activeObj"
                  class="m-l-10"
                ></app-top-menu>
              </div>
            </div>
            <div class="appFunc__header" v-else>
              <i class="iconfont icon-fanhui" @click="returnBack"></i>
              <span class="appFunc__header--title">{{
                configData.menuName
              }}</span>
              <div
                class="appFunc__header--rightFunc"
                v-show="configData.enableRightFunc"
              >
                <app-top-menu
                  v-for="(item, index) in configData.rightFunc"
                  :key="index"
                  :config="item"
                  :activeObj="activeObj"
                  class="m-l-10"
                ></app-top-menu>
              </div>
            </div>
            <div
              class="appFunc__body"
              ref="appScroll"
              :class="[{ curHeight: !configData.enableFooter }]"
            >
              <div class="appBox__body--scroll p-t-10">
                <!-- 轮播 -->
                <rotate-img
                  v-show="configData.enableRotation"
                  :config="configData.rotateImg"
                  :activeObj="activeObj"
                  class="m-b-10 m-l-10 m-r-10"
                ></rotate-img>
                <!-- 公告 -->
                <notice
                  v-show="configData.enableNotice"
                  v-if="configData.type !== 3"
                  :config="configData.notice"
                  :activeObj="activeObj"
                  class="m-b-10 m-l-10 m-r-10"
                ></notice>
                <!-- 功能区 -->
                <func-area
                  :config="configData.funcArea"
                  :activeObj="activeObj"
                  class="m-b-10"
                ></func-area>
                <!-- 公告 -->
                <app-info
                  v-show="configData.enableInfo"
                  v-if="configData.type !== 3"
                  :config="configData.info"
                  :activeObj="activeObj"
                  class="m-b-10 m-l-10 m-r-10"
                ></app-info>
              </div>
            </div>
            <div
              class="appFunc__footer"
              v-if="configData.enableFooter && configData.type !== 3"
            >
              <!-- 功能区 -->
              <func-area
                :config="configData.footerArea"
                :activeObj="activeObj"
                :isFooter="true"
              ></func-area>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="appBox__right" v-if="activeObj.compId">
      <component
        :is="activeObj.configCompName"
        :activeObj="activeObj"
        :key="activeObj.compId"
        :configData="configData"
        :backAllConfig="backAllConfig"
        parentKey="home"
        @saveFunctionInterface="saveFunctionInterface"
      ></component>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { createUnique } from '@/utils/utils';
import { saveFunctionInterface, getFunctionInterface } from '@/api/appConfig';
// 配置
import FuncConfig from '../components/Config/FuncConfig';
import FixMenuConfig from '../components/Config/FixMenuConfig';
import RotateImgConfig from '../components/Config/RotateImgConfig';
import NoticeConfig from '../components/Config/NoticeConfig';
import FuncAreaConfig from '../components/Config/FuncAreaConfig';
import FuncGroupConfig from '../components/Config/FuncGroupConfig';
import DeployMenuConfig from '../components/Config/DeployMenuConfig';
import AppInfoConfig from '../components/Config/AppInfoConfig';
// 组件
import AppTopMenu from '../components/Comp/AppTopMenu';
import RotateImg from '../components/Comp/RotateImg';
import Notice from '../components/Comp/Notice';
import FuncArea from '../components/Comp/FuncArea';
import AppInfo from '../components/Comp/AppInfo';

export default {
  data() {
    return {
      appScroll: null,
      configData: {
        // 是否启用位置
        enablePos: 0,
        // 是否启用右上角
        enableRightFunc: 1,
        // 是否启用轮播
        enableRotation: 1,
        // 其否启用公告栏
        enableNotice: 1,
        // 是否启用资讯
        enableInfo: 0,
        // 是否启用底部
        enableFooter: 1,
        // 是否启用我的
        enableMine: 0,
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
        // 轮播
        rotateImg: {
          compId: createUnique(),
          configCompName: 'RotateImgConfig',
          imgArr: []
        },
        // 公告信息
        notice: {
          compId: createUnique(),
          configCompName: 'NoticeConfig',
          rotateSpeed: 5,
          rotateType: 1, // 1 是横向 2是纵向
          style: 1 // 普通风格
        },
        // 功能区
        funcArea: {
          compId: createUnique(),
          configCompName: 'FuncAreaConfig',
          groupArr: []
        },
        // 资讯
        info: {
          compId: createUnique(),
          configCompName: 'AppInfoConfig',
          name: '行业资讯',
          term: 1,
          time: 1
        },
        // 底部
        footerArea: {
          compId: createUnique(),
          configCompName: 'FuncAreaConfig',
          isFooter: true,
          groupArr: [
            {
              compId: createUnique(),
              compName: 'FuncGroup',
              isFooter: true,
              configCompName: 'FuncGroupConfig',
              name: '',
              enableGroupName: 1,
              rowNum: 4,
              showStyle: 1,
              menuArr: [
                {
                  compId: createUnique(),
                  type: 2,
                  isFooter: true,
                  compName: 'AppMenu',
                  configCompName: 'DeployMenuConfig',
                  menuName: '首页',
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
                  isSy: true
                }
              ]
            }
          ]
        }
      },
      backAllConfig: null,
      activeObj: {
        compId: ''
      }
    };
  },

  components: {
    // 配置
    FuncConfig,
    FixMenuConfig,
    RotateImgConfig,
    NoticeConfig,
    FuncAreaConfig,
    FuncGroupConfig,
    DeployMenuConfig,
    AppInfoConfig,
    // 组件
    AppTopMenu,
    RotateImg,
    Notice,
    FuncArea,
    AppInfo
  },

  computed: {},

  mounted() {
    this.$bus.$on('selectActive', (obj) => {
      this.activeObj = obj;
      // console.log('当前选中', obj);
    });
    this.$bus.$on('enterDetail', this.enterDetail);
    this.initScroll();
    this.getFunctionInterface();
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
    // 进入详细页面
    enterDetail(menu) {
      if (!menu.childPageConfig) {
        const obj = {
          type: menu.type,
          id: menu.id,
          menuName: menu.menuName,
          // 是否启用右上角
          enableRightFunc: 1,
          // 是否启用轮播
          enableRotation: 1,
          // 是否启用资讯
          enableInfo: 0,
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
            }
          ],
          // 轮播
          rotateImg: {
            compId: createUnique(),
            configCompName: 'RotateImgConfig',
            imgArr: []
          },
          // 功能区
          funcArea: {
            compId: createUnique(),
            configCompName: 'FuncAreaConfig',
            groupArr: []
          }
        };
        this.$set(menu, 'childPageConfig', obj);
      }
      this.configData = menu.childPageConfig;
      this.activeObj = {
        compId: ''
      };
    },
    // 返回
    returnBack() {
      this.configData = this.backAllConfig;
      this.activeObj = {
        compId: ''
      };
    },
    // 保存功能界面
    async saveFunctionInterface(flag) {
      const a = {
        functionInterface: this.backAllConfig,
        id: 1
      };
      await saveFunctionInterface({ sysAppInterfaceConfig: JSON.stringify(a) });
      if (flag === 1) {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      }
    },
    // 获取功能界面
    async getFunctionInterface() {
      const data = await getFunctionInterface({
        id: 1 // 有且仅有一条
      });
      if (data.functionInterface) {
        this.configData = {
          ...this.configData,
          ...data.functionInterface
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
      await this.$confirm('当前页面配置自动保存失败，是否离开', {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
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
    this.$bus.$off('enterDetail');
  }
};
</script>

<style lang='scss' scoped>
@import '../app.scss';
.appFunc {
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
    &.curHeight {
      height: calc(100% - 54px);
    }
  }
}
</style>
