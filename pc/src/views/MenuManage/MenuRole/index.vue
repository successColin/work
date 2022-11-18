<template>
  <section class="menuRole">
    <header class="menuRole__header">
      <apiot-button class="menuRole__return" @click="returnBack">
        <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
      </apiot-button>
    </header>
    <div class="menuRole__wrapper" ref="menuRoleWrapper">
      <h1>对“{{ $route.query.menuName }}”进行页面设计</h1>
      <p>
        支持对不同角色显示不同的页面，默认为对全部角色及用户进行统一的页面设计；
      </p>
      <p>你也可以配置好默认后，复制到特定的角色组进行调整。</p>
      <p>如启用流程设定后，已配置的所有角色组均使用默认全部设计。</p>
      <div class="menuRole__switch" v-if="configArr.length">
        <i class="iconfont icon-liucheng"></i>
        是否启用流程设定
        <el-switch
          class="menuRole__switch--switch"
          @change="changeSwitch"
          :value="configArr[0].enableWorkflow"
          :active-value="1"
          :inactive-value="2"
        >
        </el-switch>
      </div>
      <ul class="menuRole__list">
        <li
          class="menuRole__item m-b-14"
          @click="toConfig(item)"
          v-for="(item, index) in configArr"
          :key="item.id"
        >
          <i
            class="iconfont icon-shejijiaose"
            :style="`color:${colors[(index + 1) % 5]}`"
          ></i>
          <div class="menuRole__item--detail">
            <h2>
              <div
                class="menuRole__item--designName font__ellipsis"
                :title="item.designName"
              >
                {{ item.designName }}
              </div>
              <el-tooltip
                v-if="index !== 0"
                effect="dark"
                :content="`${item.enable === 1 ? '停用' : '启用'}`"
                :enterable="false"
                placement="bottom"
              >
                <el-switch
                  :value="item.enable"
                  :active-value="1"
                  :inactive-value="0"
                  class="menuRole__item--switch"
                  @click.stop.native="changeEnable(item)"
                >
                </el-switch>
              </el-tooltip>
            </h2>
            <div class="menuRole__item--person" v-if="item.log">
              <!-- <user-headname
                :userInfo="item.log"
                class="m-r-10"
              ></user-headname> -->
              <span
                style="
                  font-size: 13px;
                  margin-right: 5px;
                  color: #333;
                  vertical-align: top;
                  line-height: 20px;
                "
                >{{ item.log.username }}</span
              >
              <span class="menuRole__item--opeTime"
                >{{ item.log.operationTime
                }}{{ item.log.operationContent }}</span
              >
              <el-tooltip
                effect="dark"
                content="更多记录"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-gengduocaozuo m-l-5"
                  @click.stop="moreHis(item)"
                ></i>
              </el-tooltip>
              <div class="menuRole__item--operate">
                <el-tooltip
                  effect="dark"
                  content="复制设计器"
                  :enterable="false"
                  placement="bottom"
                >
                  <i
                    class="iconfont icon-fuzhi"
                    v-if="item.enableWorkflow === 2"
                    @click.stop="copyConfig(item)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="index !== 0"
                  effect="dark"
                  content="设置"
                  :enterable="false"
                  placement="bottom"
                >
                  <i
                    class="iconfont icon-shezhi"
                    @click.stop="configRole(item)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  v-if="index !== 0"
                  effect="dark"
                  content="删除"
                  :enterable="false"
                  placement="bottom"
                >
                  <i
                    class="iconfont icon-shanchu"
                    @click.stop="deleteDesign(item, index)"
                  ></i>
                </el-tooltip>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <apiot-dialog
        :visible.sync="hasVisible"
        title="更新记录"
        :isShowSure="false"
        v-on:sure-click="handleChooseRoles"
        v-on:cancle-click="hasVisible = false"
      >
        <update-his
          v-if="hasVisible"
          :sysMenuDesignId="curSysMenu.id"
        ></update-his>
      </apiot-dialog>
      <apiot-dialog
        :visible.sync="visible"
        title="复制到角色"
        v-on:sure-click="handleChooseRoles"
        v-on:cancle-click="visible = false"
      >
        <roles :roles="roles" ref="roles" v-if="visible"></roles>
      </apiot-dialog>
    </div>
  </section>
</template>

<script>
import Roles from '_v/Users/Main/FormItem/AssRoles/Roles/roles';
import {
  copyDesign,
  deleteDesign,
  enableDesign,
  enableWorkflow,
  listRole,
  listSysDesignMenu,
  modifyDesign
} from '@/api/menuConfig';
import UpdateHis from './UpdateHis';

export default {
  data() {
    return {
      hasVisible: false,
      visible: false,
      roles: [],
      configArr: [], // 当前设计数组
      curSysMenu: null, // 当前设计对象
      colors: ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'], // 5中颜色循环
      curOpeType: 1 // 1 是复制 2 是配置修改
    };
  },

  components: {
    Roles,
    UpdateHis
  },

  computed: {
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },

  mounted() {
    this.listSysDesignMenu();
  },

  methods: {
    // 更多历史
    moreHis(item) {
      this.hasVisible = true;
      this.curSysMenu = item;
    },
    // 复制配置
    copyConfig(item) {
      this.roles = [];
      this.visible = true;
      this.curSysMenu = item;
      this.curOpeType = 1;
    },
    // 改变是否显示
    async changeEnable(item) {
      // console.log(item);
      this.curSysMenu = item;
      this.curOpeType = 2;
      const params = {
        enable: item.enable === 1 ? 2 : 1,
        sysDesignMenuId: this.curSysMenu.id
      };
      try {
        await enableDesign(params);
        item.enable = params.enable;
        this.$message({
          type: 'success',
          message: '启用成功'
        });
      } catch (error) {
        // console.log(error);
      }
    },
    // 配置角色
    configRole(item) {
      // this.visible = true;
      this.curSysMenu = item;
      this.curOpeType = 2;
      this.listRole();
    },
    // 获取角色列表
    async listRole() {
      const data = await listRole({ sysMenuDesignId: this.curSysMenu.id });
      // console.log(data);
      data.forEach((item) => {
        item.id = item.roleId;
      });
      this.roles = data;
      this.visible = true;
    },
    async handleChooseRoles() {
      let designName = '';
      let roleIds = '';
      if (this.$refs.roles && this.$refs.roles.selectKeys.length) {
        // console.log(this.$refs.roles.selectKeys);
        this.$refs.roles.selectKeys.forEach((item) => {
          designName += `${item.roleName},`;
          roleIds += `${item.id},`;
        });
      } else {
        return this.$message({
          type: 'warning',
          message: '请选择角色'
        });
      }
      const params = {
        designName: designName.slice(0, -1),
        menuId: this.$route.params.id || this.$route.query.menuId,
        id: this.curSysMenu.id,
        releaseStatus: 2,
        roleIds: roleIds.slice(0, -1)
        // designOverallLayout: this.curSysMenu.designOverallLayout
      };
      try {
        if (this.curOpeType === 1) {
          await copyDesign(params);
          await this.listSysDesignMenu();
          this.$nextTick(() => {
            this.$refs.menuRoleWrapper.scrollTop = 9999999;
          });
          this.$message({
            type: 'success',
            message: '复制成功'
          });
        } else {
          const data = await modifyDesign(params);
          this.curSysMenu.designName = data.designName;
          data.log.username = this.userInfo.username;
          data.log.icon = this.userInfo.icon;
          this.curSysMenu.log = data.log;
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        }
        this.visible = false;
      } catch (error) {
        // console.log(error);
      }
    },
    toConfig(item) {
      // console.log(item);
      if (item.designOverallLayout) {
        sessionStorage.enableWorkflow = this.configArr[0].enableWorkflow;
        sessionStorage.configData = JSON.stringify(item.designOverallLayout);
      }
      let str = `/menuConfig/${this.$route.params.id || this.$route.query.menuId}?menuName=${
        this.$route.query.menuName
      }&id=${item.id}`;
      if (this.$route.query.isApp) {
        str = `/menuConfig/${this.$route.params.id || this.$route.query.menuId}?menuName=${
          this.$route.query.menuName
        }&id=${item.id}&isApp=${this.$route.query.isApp}`;
      }
      this.$router.push(str);
    },

    async listSysDesignMenu() {
      const data = await listSysDesignMenu({
        menuId: this.$route.params.id || this.$route.query.menuId
      });
      this.configArr = data;
    },
    // 删除配置
    async deleteDesign(item, index) {
      try {
        await this.$confirm('是否删除', '提示', {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        });
        await deleteDesign({
          sysDesignMenuId: item.id
        });
        this.configArr.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功'
        });
      } catch (error) {
        // console.log(error);
      }
    },
    returnBack() {
      if (sessionStorage.menuBackPath) {
        this.$router.replace(sessionStorage.menuBackPath);
      } else {
        this.$router.replace('/menuManage');
      }
    },
    // 改变是否展示流程
    async changeSwitch(v) {
      // console.log(v);
      await enableWorkflow({
        sysDesignMenuId: this.configArr[0].id,
        enableWorkflow: v
      });
      this.configArr[0].enableWorkflow = v;
      this.listSysDesignMenu();
    }
  }
};
</script>

<style lang='scss' scoped>
.menuRole {
  height: 100%;
  background: #f6f6f8;
  &__header {
    position: relative;
    height: 46px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  }
  &__return {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 1px 0 0;
    border-color: #ebebeb;
    border-radius: 0;
    color: #333333;
    font-size: 16px;

    i {
      font-size: 20px;
      margin-right: 8px;
      color: #9b9b9b;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: #ebebeb !important;
      background-color: #fff !important;
      i {
        color: $--color-primary;
      }
    }
  }
  &__wrapper {
    box-sizing: border-box;
    height: calc(100% - 46px);
    padding-top: 80px;
    line-height: 1;
    overflow: auto;
    & > h1 {
      text-align: center;
      font-size: 30px;
      color: #333333;
      line-height: 42px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    & > p {
      position: relative;
      width: 504px;
      margin: 0 auto;
      font-size: 13px;
      color: #808080;
      line-height: 20px;
      margin-bottom: 6px;
      &:after {
        content: '';
        position: absolute;
        left: -9px;
        top: 7px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #bbc3cd;
      }
    }
  }
  &__list {
    margin: 14px auto 0;
    width: 620px;
  }
  &__item {
    cursor: pointer;
    // width: 620px;
    padding-right: 20px;
    height: 120px;
    background: #ffffff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    &:hover {
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.14);
    }
    .icon-shejijiaose {
      margin: 0 18px 0 25px;
      font-size: 48px;
      // color: #ee5e5e;
    }
    &--detail {
      width: 100%;
      h2 {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        .menuRole__item--designName {
          display: inline-block;
          width: 456px;
        }
      }
    }
    &--person {
      display: flex;
      align-items: center;
    }
    &--switch {
      float: right;
    }
    &--opeTime {
      font-size: 13px;
      color: #808080;
      line-height: 20px;
    }
    .icon-gengduocaozuo {
      color: #bbc3cd;
      background-color: #f1f3f6;
      cursor: pointer;
      border-radius: 50%;
      &:hover {
        color: $--color-primary;
        background-color: $--hover-color;
      }
    }
    &--operate {
      margin-left: auto;
      .iconfont {
        cursor: pointer;
        color: #bbc3cd;
        &:hover {
          color: $--color-primary;
        }
      }
      .icon-shezhi,
      .icon-shanchu {
        position: relative;
        margin-left: 20px;
        &::after {
          content: '';
          position: absolute;
          top: 2px;
          left: -10px;
          width: 1px;
          height: 12px;
          background: #e9e9e9;
        }
      }
    }
  }
  &__switch {
    margin: 40px auto 0;
    width: 620px;
    height: 48px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 6px;
    padding-left: 30px;
    padding-right: 20px;
    box-sizing: border-box;
    .iconfont {
      color: #ee5e5e;
      font-size: 24px;
      margin-right: 10px;
    }
    &--switch {
      margin-left: auto;
    }
  }
}
</style>
