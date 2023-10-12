<template>
  <section class="funcGroupConfig config">
    <div class="config__header">分组配置</div>
    <div class="config__body">
      <p class="config__body--switch m-t-10" v-if="!activeObj.isFooter">
        是否显示组名称
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="activeObj.enableGroupName"
        >
        </el-switch>
      </p>
      <h2 class="config__body--head" v-if="!activeObj.isFooter">分组布局</h2>
      <el-select
        v-if="!activeObj.isFooter"
        class="config__body--select"
        v-model="activeObj.rowNum"
      >
        <el-option
          :value="item.rowNum"
          :label="item.label"
          v-for="item in rowNumObj"
          :key="item.rowNum"
        ></el-option>
      </el-select>
      <!-- <apiot-input
        class="layoutInput"
        :value="rowNumObj[activeObj.rowNum]"
        readonly
        v-if="!activeObj.isFooter"
      ></apiot-input> -->
      <!-- <div class="rowNum" v-if="!activeObj.isFooter">
        <div
          v-for="(v, key) in rowNumObj"
          :key="key"
          class="rowNum__boxKey"
          :class="[{ active: +key === activeObj.rowNum }]"
          @click="activeObj.rowNum = +key"
        >
          <div
            v-for="num in +key"
            :key="num"
            :class="`rowNum__boxNum rowNum__boxNum--${key}`"
          ></div>
        </div>
      </div> -->
      <h2 class="config__body--head" v-if="!activeObj.isFooter">展示风格</h2>
      <el-radio-group v-model="activeObj.showStyle" v-if="!activeObj.isFooter">
        <el-radio :label="1" class="m-r-20 p-r-20 m-b-12"
          >图标文字展示类型</el-radio
        >
        <el-radio :label="2">纯图片展示类型</el-radio>
      </el-radio-group>
      <h2 class="config__body--head" v-if="showHeight">图片高度</h2>
      <el-select
        v-if="showHeight"
        class="config__body--select"
        v-model="activeObj.heightPix"
      >
        <el-option
          :value="item.heightPix"
          :label="item.label"
          v-for="item in heightArr"
          :key="item.heightPix"
        ></el-option>
      </el-select>
      <h2 class="config__body--head" v-if="activeObj.menuArr.length">
        包含菜单
      </h2>
      <draggable
        v-model="activeObj.menuArr"
        group="tabs"
        animation="300"
        handle=".icon-zongxiangtuodong"
      >
        <transition-group class="funcGroupConfig__list" tag="ul">
          <li
            class="funcGroupConfig__tab"
            v-for="(child, i) in activeObj.menuArr"
            :key="child.compId"
          >
            <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-10"></i>
            <apiot-input
              class="input"
              v-model="child.menuName"
              @focus="nameFocus(child)"
              @blur="nameBlur(child)"
              placeholder="请输入分组名称"
            ></apiot-input>
            <el-tooltip
              effect="dark"
              content="删除"
              :enterable="false"
              placement="bottom"
            >
              <i
                class="iconfont icon-shanchu m-r-14 m-l-10"
                v-if="!child.isFixed"
                @click="deleteChild(i)"
              ></i
            ></el-tooltip>
          </li>
        </transition-group>
      </draggable>
      <apiot-button
        :loading.sync="loading"
        @click="addConfigMenu(1, true)"
        class="funcGroupConfig__addGroup config__body--btn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '配置菜单' }) }}
      </apiot-button>
      <apiot-button
        :loading.sync="loading"
        @click="addConfigMenu(2, true)"
        class="funcGroupConfig__addGroup config__body--btn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '固定菜单' }) }}
      </apiot-button>
      <apiot-button
        :loading.sync="loading"
        v-if="this.configData.type !== 3 && parentKey !== 'my'"
        @click="addConfigMenu(3, true)"
        class="funcGroupConfig__addGroup config__body--btn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '功能菜单' }) }}
      </apiot-button>
      <apiot-button
        :loading.sync="loading"
        @click="addConfigMenu(4, true)"
        class="funcGroupConfig__addGroup config__body--btn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '自定义菜单' }) }}
      </apiot-button>
    </div>
  </section>
</template>

<script>
import { createUnique } from '@/utils/utils';
import { saveAppMenu, deleteAppMenu } from '@/api/appConfig';

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
      loading: false,
      // rowNumObj: {
      //   1: '行一分之一（一行一个展示）',
      //   2: '行二分之一（一行二个展示）',
      //   3: '行三分之一（一行三个展示）',
      //   4: '行四分之一（一行四个展示）',
      //   5: '行五分之一（一行五个展示）'
      // },
      rowNumObj: [
        {
          rowNum: 1,
          label: '行一分之一（一行一个展示）'
        },
        {
          rowNum: 2,
          label: '行二分之一（一行二个展示）'
        },
        {
          rowNum: 3,
          label: '行三分之一（一行三个展示）'
        },
        {
          rowNum: 4,
          label: '行四分之一（一行四个展示）'
        },
        {
          rowNum: 5,
          label: '行五分之一（一行五个展示）'
        }
      ],
      heightArr: [
        {
          heightPix: 1,
          label: '1.0X'
        },
        {
          heightPix: 2,
          label: '1.5X'
        },
        {
          heightPix: 3,
          label: '2.0X'
        }
      ]
    };
  },

  components: {},

  computed: {
    showHeight() {
      return this.activeObj.showStyle === 2 && [2, 1].includes(this.activeObj.rowNum);
    }
  },

  created() {
    // console.log(this.activeObj);
  },

  methods: {
    // 新增group
    async addConfigMenu(type, isAdd = false, child = { id: '' }) {
      if (
        this.activeObj.isFooter &&
        isAdd &&
        this.configData.footerArea.groupArr[0].menuArr.length >= 5
      ) {
        return this.$message({
          type: 'warning',
          message: '底部菜单最多5个'
        });
      }
      this.loading = true;
      const params = {
        sysMenu: {
          parentId: this.configData.id || '',
          clientType: 2,
          menuLevel: 2,
          menuType: 2,
          menuName: child.id ? child.menuName : `菜单-${createUnique()}`,
          menuCode: child.id ? child.menuCode : '',
          id: this.activeObj.id || child.id || '',
          icon: this.activeObj.icon
        },
        parentKey: this.parentKey,
        // sysAppInterfaceConfig: {},
        routeKey: this.activeObj.routeName || '',
        type
      };
      if ([100, 101].includes(params.sysMenu.id)) {
        params.sysMenu.parentId = 0;
      }
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
      // 区分是否是底部
      if (this.activeObj.isFooter) {
        params.sysMenu.isFooter = true;
        params.sysMenu.selectIcon = {
          icon: '',
          color: '',
          imageUrl: ''
        };
      }
      // 区分是否是菜单模块
      if (type === 3) {
        params.sysMenu.parentId = '';
        params.sysMenu.menuLevel = 1;
      }
      // 新增的时候传routeKey 绑定权限
      if (type === 1) {
        params.routeKey = 'configMenu';
      } else if (type === 2) {
        params.routeKey = 'sysKnowledge';
      } else if (type === 3) {
        params.routeKey = 'applyMenu';
      } else if (type === 4) {
        params.routeKey = 'customMenu';
      }
      params.sysMenu.routeName = params.routeKey;
      try {
        const data = await saveAppMenu({ dto: JSON.stringify(params) });
        this.loading = false;
        if (isAdd) {
          const addObj = {
            ...params.sysMenu,
            compId: createUnique(),
            type,
            compName: 'AppMenu',
            configCompName: 'DeployMenuConfig',
            menuCode: data.sysMenu.menuCode,
            menuName: data.sysMenu.menuName,
            id: data.sysMenu.id,
            menuDesignId: data.menuDesignId || '',
            icon: {
              icon: '',
              color: '',
              imageUrl: ''
            },
            groupCompId: this.activeObj.compId, // 父级的id
            bgColor: '', // 背景色
            enableGradient: 0, // 是否渐变
            // 渐变色
            gradientObj: {
              color1: 'rgba(255,255,255,0)',
              color2: 'rgba(255,255,255,0)',
              color3: 'rgba(255,255,255,0)'
            },
            // 图片
            bgImgUrl: '',
            // 描述
            des: '',
            EnableCornerMarker: false, // 是否启用角标 1 是， 2 否
            hornMarkType: 1, // 角标样式 1数字 2红点
            // 离线点检相关
            offlineCheck: {
              // 路线层
              routeLayer: {
                routePass: true // 启用路线跳过
              },
              // 设备层
              deviceLayer: {
                unlockedType: 1, // 任务结果类型
                enableRFID: true, // 启用rfId
                scanUnlock: true, // 启用扫码解锁
                fillCodeUnlock: true, // 启用填写编码解锁
                workDone: true, // 启用完成工时
                jumpOver: true, // 启用跳过功能
                batchInspection: true // 启用批量点检
              },
              // 任务层
              taskLayer: {
                openFirstTask: true, // 默认展开第一个任务点
                limitFunc: true, // 是否启用上下限功能
                enforceCheck: true, // 是否启用强制点检
                abnormalMemo: true, // 是否启用异常描述
                // 配置任务字段数组
                columnArr: [
                  //  id: createUnique(),
                  // columnObj: {  // 字段
                  //   id: '',
                  //   columnName: '',
                  //   columnTypeDict: ''
                  // },
                  // columnTitle: '', // 名称
                  // compType: 1, // 组件类型
                  // showStatus: 1, // 状态
                  // dictObj: {} // 字典
                ]
              },
              // 任务层
              resultLayer: {
                // 配置任务字段数组
                columnArr: []
              }
            },
            customId: '',
            calendar: {
              viewStyle: 1, // 1-月视图， 2-周视图
              signStyle: 1, // 1-背景色， 2-红点
              enableAnnounce: 1, // 1-启用， 2-不启用
              children: [], // 日历业务列表
            }
          };
          console.log(addObj);
          if (this.activeObj.isFooter && this.backAllConfig.enableMine) {
            this.activeObj.menuArr.splice(-1, 0, addObj);
          } else {
            this.activeObj.menuArr.push(addObj);
          }
          this.$emit('saveFunctionInterface');
        }
      } catch (error) {
        this.loading = false;
      }
    },
    // 删除
    async deleteChild(i) {
      if (this.activeObj.menuArr[i].id) {
        const params = {
          sysMenu: {
            id: this.activeObj.menuArr[i].id
          }
          // sysAppInterfaceConfig: {
          //   functionInterface: this.backAllConfig,
          //   id: 1
          // }
        };
        await deleteAppMenu(params);
        this.activeObj.menuArr.splice(i, 1);
        this.$emit('saveFunctionInterface');
      }
    },
    // 名字的失焦恢复
    nameFocus(child) {
      child.backName = child.menuName;
    },
    async nameBlur(child) {
      if (!child.menuName) {
        child.menuName = child.backName;
      }
      if (child.menuName) {
        if (child.menuName !== child.backName) {
          try {
            if (child.id) {
              this.addConfigMenu(child.type, false, child);
            }
          } catch (error) {
            child.menuName = child.backName;
          }
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
.funcGroupConfig {
  &__tab {
    height: 36px;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 16px;
      color: #bbc3cd;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
    }
    .icon-zongxiangtuodong {
      cursor: move;
    }
    .icon-sheweimoren {
      visibility: hidden;
      &.active {
        color: $--color-primary;
        visibility: visible;
      }
    }
    .input {
      flex: 1;
      ::v-deep {
        .el-input__inner {
          height: 28px;
          line-height: 28px;
        }
      }
    }
    &.active,
    &:hover {
      background: #f1f7ff;
      .icon-sheweimoren {
        visibility: visible;
      }
    }
  }
  &__addGroup {
    margin-top: 10px;
  }
  .layoutInput {
    ::v-deep {
      .el-input__inner {
        background: #f6f6f8;
      }
    }
  }
  .rowNum {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &__boxKey {
      margin-top: 8px;
      margin-right: 8px;
      flex: 0 0 94px;
      box-sizing: border-box;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &.active {
        border-color: $--color-primary;
      }
    }
    &__boxNum {
      height: 16px;
      background: #a5c1e7;
      border-radius: 2px;
      &--1 {
        width: 84px;
      }
      &--2 {
        width: 38px;
      }
      &--3 {
        width: 24px;
      }
      &--4 {
        width: 17px;
      }
      &--5 {
        width: 13px;
      }
    }
  }
}
</style>
