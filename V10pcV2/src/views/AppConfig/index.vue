<template>
  <section class="appConfig">
    <el-tabs
      class="appConfig__header"
      v-model="activeName"
      @tab-click="handleSelect"
    >
      <el-tab-pane
        v-for="item in tabsArr"
        :label="item.label"
        :key="item.routeName"
        :name="item.routeName"
      >
      </el-tab-pane>
    </el-tabs>
    <router-view ref="routeView" />
    <!-- <history-keep-alive alive-ref="routeView" /> -->
    <apiot-button
      @click="exportMenu"
      class="exportBtn"
      v-if="activeName !== 'paramPage'"
    >
      <i class="iconfont icon-daochu m-r-4"></i
      >{{ $t('common.export', { name: $t('menu.menu') }) }}
    </apiot-button>
    <el-upload
      class="uploadBtn"
      action=""
      :on-success="uploadSuccess"
      :before-upload="beforeUpload"
      :http-request="doUpload"
      :show-file-list="false"
      accept="txt"
    >
      <apiot-button :loading="loading" v-if="activeName !== 'paramPage'">
        <i class="iconfont icon-daoru m-r-4"></i
        >{{ $t('common.import', { name: $t('menu.menu') }) }}
      </apiot-button>
    </el-upload>
    <apiot-button
      v-if="activeName !== 'paramPage'"
      type="primary"
      @click="saveLayout()"
      class="saveBtn"
      >保存</apiot-button
    >
    <MenuSelect
      :visible.sync="showMenu"
      :tableData="menuArr"
      :showMenu="showMenu"
      :isApp="true"
      @sureClick="sureClick"
    ></MenuSelect>
  </section>
</template>

<script>
import { exportAppMenu, importAppMenu } from '@/api/appConfig';
import { createUnique } from '@/utils/utils';
import MenuSelect from '../MenuManage/components/MenuSelect';

export default {
  data() {
    return {
      activeName: 'funcPage',
      loading: false,
      showMenu: false,
      menuArr: [],
    };
  },

  components: {
    MenuSelect,
  },
  provide() {
    return {
      isConfig: true,
    };
  },
  computed: {
    tabsArr() {
      return [
        // {
        //   label: '登录界面',
        //   routeName: 'login'
        // },
        // {
        //   label: '信息维护',
        //   routeName: 'infoMaintain'
        // },
        {
          label: '功能界面',
          routeName: 'funcPage',
        },
        {
          label: '我的界面',
          routeName: 'mine',
        },
        {
          label: '参数设定',
          routeName: 'paramPage',
        },
      ];
    },
  },
  activated() {
    console.log(333);
    this.$bus.$off('selectActive').$on('selectActive', (obj) => {
      this.$refs.routeView.selectActive(obj);
      // console.log('当前选中', obj);
    });
    this.$bus.$off('enterDetail').$on('enterDetail', (menu) => {
      console.log(menu);
      this.$refs.routeView.enterDetail(menu);
    });
    // console.log(this.$route.name);
    this.$nextTick(() => {
      this.activeName = this.$route.name;
    });
  },
  mounted() {
    console.log(222);
    this.$bus.$off('selectActive').$on('selectActive', (obj) => {
      this.$refs.routeView.selectActive(obj);
      // console.log('当前选中', obj);
    });
    this.$bus.$off('enterDetail').$on('enterDetail', (menu) => {
      console.log(menu);
      this.$refs.routeView.enterDetail(menu);
    });

    // console.log(this.$route.name);
    this.$nextTick(() => {
      this.activeName = this.$route.name;
    });
  },

  methods: {
    handleSelect() {
      this.$router.replace({ path: `/appConfig/${this.activeName}` });
    },
    saveLayout() {
      this.$broadcast('saveFunctionInterface', 1);
      // this.$refs.routeView.saveFunctionInterface(1);
    },
    // 获取配置
    getAllConfig() {
      if (this.$refs.routeView) {
        return (
          this.$refs.routeView.backAllConfig && this.$refs.routeView.configData
        );
      }
      return null;
    },
    // 上传成功
    async uploadSuccess() {
      if (this.uploadTrue) {
        this.uploadTrue = false;
        this.loading = false;
        this.$message({
          type: 'success',
          message: '导入成功',
        });
      }
      //  else {
      //   this.$message({
      //     type: 'warning',
      //     message: '导入失败',
      //   });
      // }
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve) => {
        resolve(file);
      });
    },
    // 自定义上传
    async doUpload(param) {
      const { file } = param;
      const formData = new FormData();
      formData.append('file', file);
      this.loading = true;
      try {
        const data = await importAppMenu(formData);
        console.log(JSON.parse(data));
        const { menuConfig, menuIdMap, sysMenuList } = JSON.parse(data);

        const config = this.getAllConfig();
        const groupObj = {
          compId: createUnique(),
          compName: 'FuncGroup',
          configCompName: 'FuncGroupConfig',
          name: '',
          menuArr: [],
          enableGroupName: 1,
          rowNum: 4, // 个数
          showStyle: 1, // 展示风格
          heightPix: 1, // 高度
        };
        groupObj.name = `导入分组(${groupObj.compId})`;
        JSON.parse(menuConfig).forEach((menu) => {
          const newId = menuIdMap[menu.id];
          const obj = sysMenuList.find((m) => m.sysMenu.id === newId);
          if (obj) {
            delete menu.isChecked;
            delete menu.index;
            delete menu.showIndex;
            groupObj.menuArr.push({
              ...menu,
              id: obj.sysMenu.id,
              menuName: obj.sysMenu.menuName,
              menuDesignId: obj.sysMenu.menuDesignId || '',
              parentId: '',
              compId: createUnique(),
              groupCompId: groupObj.compId,
            });
          }
        });
        config.funcArea.groupArr.unshift(groupObj);
        this.$refs.routeView.saveFunctionInterface(false);
        this.uploadTrue = true;
        console.log(config);
      } catch (error) {
        this.uploadTrue = false;
        this.loading = false;
      }
    },
    // 导出菜单
    exportMenu() {
      const config = this.getAllConfig();
      if (config) {
        this.menuArr = [];
        config.funcArea.groupArr.forEach((group) => {
          if (group.menuArr) {
            group.menuArr.forEach((menu) => {
              if (menu.type === 1) {
                this.menuArr.push(menu);
              }
              if (menu.type === 3) {
                if (menu.childPageConfig) {
                  menu.childPageConfig.funcArea.groupArr.forEach(
                    (childGroup) => {
                      childGroup.menuArr.forEach((m) => {
                        if (m.type === 1) {
                          this.menuArr.push(m);
                        }
                      });
                    },
                  );
                }
              }
            });
          }
        });
        this.showMenu = true;
      }
    },
    // 到处菜单接口
    async sureClick(arr) {
      console.log(arr);
      const params = {
        sysAppMenuListDTO: {
          dto: [],
          menuConfig: JSON.stringify(arr),
        },
      };
      const parentKey = this.$route.name === 'funcPage' ? 'home' : 'my';
      arr.forEach((menu) => {
        const obj = {
          sysMenu: {
            routeName: 'configMenu',
            parentId: menu.parentId || '',
            clientType: 2,
            menuLevel: 2,
            menuType: 2,
            menuName: menu.menuName,
            menuCode: '',
            id: '',
            icon: menu.icon,
          },
          parentKey,
          routeKey: 'configMenu',
          type: 1,
          oldMenuId: menu.id,
          sysAppInterfaceConfig: {
            functionInterface: null,
            myInterface: null,
            id: 1,
          },
        };
        params.sysAppMenuListDTO.dto.push(obj);
      });
      params.sysAppMenuListDTO = JSON.stringify(params.sysAppMenuListDTO);
      const blob = await exportAppMenu(params);
      console.log(blob);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        const a = document.createElement('a');
        a.download = 'app导出菜单.txt';
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    },
  },

  beforeDestroy() {
    console.log(111);
    if (!['funcPage', 'mine'].includes(this.$route.name)) {
      this.$bus.$off('selectActive');
      this.$bus.$off('enterDetail');
    }
  },
};
</script>

<style lang="scss" scoped>
.appConfig {
  position: relative;
  .iconfont {
    color: $--color-primary;
  }
  .saveBtn {
    position: absolute;
    right: 10px;
    top: 6px;
  }
  .exportBtn {
    position: absolute;
    right: 75px;
    top: 6px;
  }
  .uploadBtn {
    position: absolute;
    right: 190px;
    top: 6px;
  }
  &__header {
    background-color: #fff;
    ::v-deep {
      .el-tabs__header {
        width: 100%;
        margin-bottom: 0;
      }
      .el-tabs__nav-wrap {
        display: flex;
        justify-content: center;
        height: 42px;
      }
      .el-tabs__content {
        display: none;
      }
      .el-tabs__nav-scroll {
        margin-left: 20px;
      }
      .el-tab-pane {
        height: 100%;
      }
      .el-tabs__nav {
        height: 42px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__item {
        font-size: 14px;
      }
      .is-active {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
      }
    }
  }
}
</style>
