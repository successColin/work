<template>
  <section class="menuConfig config">
    <div class="config__header">菜单配置</div>
    <div class="config__body">
      <h2 class="config__body--head">名称</h2>
      <apiot-input
        @focus="nameFocus"
        @blur="nameBlur"
        v-model="activeObj.menuName"
        placeholder="请输入菜单名称"
      ></apiot-input>
      <h2 class="config__body--head" v-if="!activeObj.isFooter">所属分组</h2>
      <el-select
        v-if="!activeObj.isFooter"
        class="config__body--select"
        v-model="activeObj.groupCompId"
        @change="changeGroup"
      >
        <el-option
          :value="item.compId"
          :label="item.name"
          v-for="item in configData.funcArea.groupArr"
          :key="item.compId"
        ></el-option>
      </el-select>
      <h2 class="config__body--head" v-if="showBg">菜单背景色</h2>
      <apiot-color-picker
        v-model="activeObj.bgColor"
        :predefine="selectColorArr"
        v-if="showBg"
      >
      </apiot-color-picker>
      <h2 class="config__body--head" v-if="this.getGroup.showStyle === 1">
        常态图标
      </h2>
      <div class="iconSelect" v-if="this.getGroup.showStyle === 1">
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected"
          :item="curItem"
          :iconType="2"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个对应功能识别度高的图标</p>
      </div>
      <h2
        class="config__body--head"
        v-if="this.getGroup.showStyle === 1 && activeObj.isFooter"
      >
        选中图标
      </h2>
      <div
        class="iconSelect"
        v-if="this.getGroup.showStyle === 1 && activeObj.isFooter"
      >
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected1"
          :item="curItem1"
          :iconType="2"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个对应功能识别度高的图标</p>
      </div>
      <h2
        class="config__body--head"
        v-if="this.getGroup.showStyle === 1 && this.getGroup.rowNum === 1"
      >
        描述
      </h2>
      <apiot-input
        v-model="activeObj.des"
        placeholder="请输入描述文字"
        v-if="this.getGroup.showStyle === 1 && this.getGroup.rowNum === 1"
      ></apiot-input>
      <p class="config__body--switch m-t-10" v-if="showGradient">
        是否显示渐变色
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="activeObj.enableGradient"
        >
        </el-switch>
      </p>
      <h2
        class="config__body--head"
        v-if="showGradient && activeObj.enableGradient"
      >
        渐变色
      </h2>
      <div class="gradient" v-if="showGradient && activeObj.enableGradient">
        <apiot-color-picker
          :key="2"
          v-model="activeObj.gradientObj.color1"
          :predefine="selectColorArr"
        >
        </apiot-color-picker>
        <apiot-color-picker
          :key="3"
          v-model="activeObj.gradientObj.color2"
          :predefine="selectColorArr"
        >
        </apiot-color-picker>
        <apiot-color-picker
          :key="4"
          v-model="activeObj.gradientObj.color3"
          :predefine="selectColorArr"
        >
        </apiot-color-picker>
      </div>
      <h2 class="config__body--head" v-if="this.getGroup.showStyle === 2">
        菜单图片
      </h2>
      <app-upload
        :fileUrl.sync="activeObj.bgImgUrl"
        fileAccept=".png, .jpg,.jpeg, .gif,.svg"
        :uploadType="2"
        v-if="this.getGroup.showStyle === 2"
      ></app-upload>
      <div class="config__body--tip" v-if="this.getGroup.showStyle === 2">
        建议：尺寸690×140px，png、jpg格式，3M以内
      </div>
      <apiot-button
        @click="enterConfig"
        class="config__body--btn"
        v-if="activeObj.type === 1"
      >
        <i class="iconfont icon-shezhi m-r-4"></i>进入配置页面
      </apiot-button>
      <apiot-button
        @click="enterFuncPage"
        class="config__body--btn"
        v-if="activeObj.type === 3"
      >
        <i class="iconfont icon-shezhi m-r-4"></i>进入功能界面
      </apiot-button>
      <h2
        class="config__body--head"
        v-if="activeObj.type === 2 && !activeObj.isFooter"
      >
        固定菜单
      </h2>
      <el-select
        class="config__body--select"
        v-model="activeObj.routeName"
        v-if="activeObj.type === 2 && !activeObj.isFooter"
        @change="changeRouteName"
      >
        <el-option
          :value="item.routeName"
          :label="item.label"
          v-for="item in appRouteArr"
          :key="item.routeName"
        ></el-option>
      </el-select>
      <OfflineCheck
        class="m-t-10"
        v-if="
          activeObj.type === 2 &&
          !activeObj.isFooter &&
          activeObj.offlineCheck &&
          activeObj.routeName === 'inspection'
        "
        :offlineCheck="activeObj.offlineCheck"
      ></OfflineCheck>
    </div>
  </section>
</template>

<script>
import { appRouteArr, selectColorArr } from '@/config';
import { saveAppMenu } from '@/api/appConfig';
import IconSelect from '../../../../MenuManage/components/IconSelect';
import AppUpload from '../AppUpload';
import OfflineCheck from './OfflineCheck';

export default {
  props: {
    activeObj: {
      type: Object
    },
    configData: {
      type: Object
    },
    // 父节点
    parentKey: {
      type: String
    },
    // 所有配置
    backAllConfig: {
      type: Object
    }
  },
  data() {
    return {
      // 选中前
      curItem: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      // 选中后
      curItem1: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      oldIndex: 0,
      appRouteArr: [],
      selectColorArr: []
    };
  },

  components: {
    IconSelect,
    AppUpload,
    OfflineCheck
  },

  computed: {
    getGroup() {
      const obj = this.configData.funcArea.groupArr.find(
        (item) => item.compId === this.activeObj.groupCompId
      );
      if (obj) {
        return obj;
      }
      return {
        rowNum: 4,
        showStyle: 1
      };
    },
    showBg() {
      if (this.getGroup) {
        return [2, 3].includes(this.getGroup.rowNum) && this.getGroup.showStyle === 1;
      }
      return false;
    },
    showGradient() {
      if (this.getGroup) {
        return (
          this.getGroup.showStyle === 1 &&
          this.activeObj.icon.imageUrl === '' &&
          !this.activeObj.isFooter
        );
      }
      return false;
    }
  },

  created() {
    this.appRouteArr = appRouteArr;
    this.getOldIndex();
    this.initIcon();
    this.selectColorArr = selectColorArr;
  },

  methods: {
    initIcon() {
      this.curItem.icon = this.activeObj.icon.icon;
      this.curItem.color = this.activeObj.icon.color;
      this.curItem.imageUrl = this.activeObj.icon.imageUrl;
      if (this.activeObj.selectIcon) {
        this.curItem1.icon = this.activeObj.selectIcon.icon;
        this.curItem1.color = this.activeObj.selectIcon.color;
        this.curItem1.imageUrl = this.activeObj.selectIcon.imageUrl;
      }
    },

    iconSelected(obj) {
      this.activeObj.icon.icon = obj.icon;
      this.activeObj.icon.color = obj.color;
      this.activeObj.icon.imageUrl = obj.imageUrl;
      this.addConfigMenu();
    },
    iconSelected1(obj) {
      this.activeObj.selectIcon.icon = obj.icon;
      this.activeObj.selectIcon.color = obj.color;
      this.activeObj.selectIcon.imageUrl = obj.imageUrl;
      this.addConfigMenu();
    },
    changeRouteName() {
      this.addConfigMenu();
    },
    // 名字的失焦恢复
    nameFocus() {
      this.activeObj.backName = this.activeObj.menuName;
    },
    async nameBlur() {
      const child = this.activeObj;
      if (!child.menuName) {
        child.menuName = child.backName;
      }
      if (child.menuName) {
        if (child.menuName !== child.backName) {
          try {
            if (child.id) {
              this.addConfigMenu();
            }
          } catch (error) {
            child.menuName = child.backName;
          }
        }
      }
    },
    getOldIndex() {
      // 记下就得分组的下标
      this.oldIndex = this.configData.funcArea.groupArr.findIndex(
        (item) => item.compId === this.activeObj.groupCompId
      );
    },
    // 更改分组
    changeGroup() {
      // 找到组件的位置
      // console.log(this.oldIndex);
      const compIndex = this.configData.funcArea.groupArr[this.oldIndex].menuArr.findIndex(
        (item) => item.compId === this.activeObj.compId
      );
      this.configData.funcArea.groupArr[this.oldIndex].menuArr.splice(compIndex, 1);
      // 重新记录分组下标
      this.getOldIndex();
      // 把数据插入新的分组中
      this.configData.funcArea.groupArr[this.oldIndex].menuArr.push(this.activeObj);
    },
    // 进入配置页面
    async enterConfig() {
      // await this.$emit('saveFunctionInterface');
      sessionStorage.menuBackPath = this.$route.path;
      this.$router.push(
        `/menuRole/${this.activeObj.id}?menuName=${this.activeObj.menuName}&isApp=1`
      );
    },
    // 进入功能界面
    enterFuncPage() {
      this.$bus.$emit('enterDetail', this.activeObj);
    },
    // 新增group
    async addConfigMenu() {
      const params = {
        sysMenu: {
          parentId: this.configData.id || '',
          clientType: 2,
          menuLevel: 2,
          menuType: 2,
          menuName: this.activeObj.menuName,
          menuCode: this.activeObj.menuCode,
          id: this.activeObj.id || '',
          icon: this.activeObj.icon
        },
        parentKey: this.parentKey,
        // sysAppInterfaceConfig: {},
        routeKey: this.activeObj.routeName || '',
        type: this.activeObj.type
      };
      // 区分首页跟我的
      if (this.parentKey === 'home') {
        params.sysAppInterfaceConfig = {
          functionInterface: this.backAllConfig,
          id: 1
        };
      } else {
        params.sysAppInterfaceConfig = {
          myInterface: this.backAllConfig,
          id: 1
        };
      }
      if (this.activeObj.isFooter) {
        params.sysMenu.isFooter = true;
      }
      if (this.activeObj.type === 3) {
        params.sysMenu.parentId = '';
        params.sysMenu.menuLevel = 1;
      }
      // 新增的时候传routeKey 绑定权限
      if (this.activeObj.type === 1) {
        params.routeKey = 'configMenu';
      } else if (this.activeObj.type === 2) {
        params.routeKey = this.activeObj.routeName;
      } else {
        params.routeKey = 'applyMenu';
      }
      console.log(params);
      await saveAppMenu({ dto: JSON.stringify(params) });
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
.config__body--btn {
  margin-top: 10px;
}
</style>
