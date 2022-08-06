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
      <h2 class="config__body--head">图标</h2>
      <div class="iconSelect">
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected"
          :item="curItem"
          :iconType="2"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个对应功能识别度高的图标</p>
      </div>
      <h2 class="config__body--head">固定菜单</h2>
      <el-select
        class="config__body--select"
        v-model="activeObj.routeName"
        @change="changeRouteName"
      >
        <el-option
          :value="item.routeName"
          :label="item.label"
          v-for="item in appRouteArr"
          :key="item.routeName"
        ></el-option>
      </el-select>
      <p class="config__body--switch m-t-10">
        是否启用
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          @change="changeValue"
          :value="activeObj.enableMenu"
        >
        </el-switch>
      </p>
    </div>
  </section>
</template>

<script>
import { deleteAppMenu, saveAppMenu } from '@/api/appConfig';
import { appRouteArr } from '@/config';
import IconSelect from '../../../../MenuManage/components/IconSelect';

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
      curItem: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      appRouteArr: []
    };
  },

  components: {
    IconSelect
  },

  computed: {},

  created() {
    this.appRouteArr = appRouteArr;
    this.curItem.icon = this.activeObj.icon.icon;
    this.curItem.color = this.activeObj.icon.color;
    this.curItem.imageUrl = this.activeObj.icon.imageUrl;
  },

  methods: {
    // 图标选定
    iconSelected(obj) {
      this.activeObj.icon.icon = obj.icon;
      this.activeObj.icon.color = obj.color;
      this.activeObj.icon.imageUrl = obj.imageUrl;
      if (this.activeObj.id) {
        this.changeValue(true);
      }
    },
    // 改变固定菜单
    changeRouteName() {
      if (this.activeObj.id) {
        this.changeValue(true);
      }
    },
    async changeValue(flag = false) {
      if (!this.activeObj.menuName) {
        return this.$message({
          type: 'warning',
          message: '请输入菜单名单'
        });
      }
      if (!this.activeObj.routeName) {
        return this.$message({
          type: 'warning',
          message: '请选择固定菜单'
        });
      }
      if (this.activeObj.enableMenu && !flag) {
        // 为 1 删除菜单
        const params = {
          sysMenu: {
            id: this.activeObj.id
          }
        };
        await deleteAppMenu(params);
        this.activeObj.enableMenu = 0;
        this.$emit('saveFunctionInterface');
      } else {
        this.activeObj.enableMenu = 1;
        // 为 0 新增菜单
        const params = {
          sysMenu: {
            parentId: this.configData.id || '',
            clientType: 2,
            menuLevel: 2,
            menuType: 2,
            menuName: this.activeObj.menuName,
            menuCode: '',
            id: this.activeObj.id || '',
            icon: this.activeObj.icon
          },
          parentKey: this.parentKey,
          // sysAppInterfaceConfig: {},
          routeKey: this.activeObj.routeName,
          type: 2
        };
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
        this.saveAppMenu({ dto: JSON.stringify(params) });
      }
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
              this.changeValue(true);
            }
          } catch (error) {
            child.menuName = child.backName;
          }
        }
      }
    },
    async saveAppMenu(params) {
      try {
        const data = await saveAppMenu(params);
        if (!this.activeObj.id) {
          this.activeObj.id = data.sysMenu.id;
          this.$emit('saveFunctionInterface');
        }
        // console.log(data);
      } catch (error) {
        this.activeObj.enableMenu = 0;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
</style>
