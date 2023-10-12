<!-- 页面 -->
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="$t('role.functionAuthority')" name="function">
      <div class="paneBox" :key="updateKey">
        <div class="paneBox__header">
          <div>{{ $t('role.selectAll') }}</div>
          <div class="paneBox__checkAll">
            <apiot-checkbox
                :checked="checkData.isAll"
                v-model="checkData.isAll"
                @change="checkAll"
            ></apiot-checkbox>
          </div>
        </div>
        <div
            class="paneBox__wrap"
            v-for="item in functionAuthList"
            :key="item.id"
        >
          <div>
            <span class="iconfont" :class="{ [getIconName(item.id)]: true }"></span>{{ item.name }}
          </div>
          <div class="paneBox__checkAll">
            <apiot-checkbox
                @change="(e) => batchChange(e, item)"
                :checked="checkData[item.id]"
                v-model="checkData[item.id]"
            ></apiot-checkbox>
          </div>
        </div>
        <!--        <div class="paneBox__wrap">-->
        <!--          <div><span class="icon-jicheng iconfont"></span>全部从角色继承</div>-->
        <!--          <div class="paneBox__checkAll">-->
        <!--            <apiot-checkbox></apiot-checkbox>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </el-tab-pane>
    <el-tab-pane :label="$t('role.dataRights')" name="dataRights">
      <div class="paneBox" :key="updateKey">
        <div class="paneBox__header">
          <div>{{ $t('role.choice') }}</div>
        </div>
        <div
            class="paneBox__wrap"
            v-for="item in dataAuthList.DATA_AUTHORITY_TYPE"
            :key="item.value"
        >
<!--          <div v-if="item.value === '1'">-->
<!--            <span class="icon-gongsi iconfont"></span>-->
<!--            {{ showRealName(item) }}-->
<!--          </div>-->
<!--          <div v-if="item.value === '2'">-->
<!--            <span class="icon-bumen iconfont"></span>-->
<!--            {{ showRealName(item) }}-->
<!--          </div>-->
<!--          <div v-if="item.value === '4'">-->
<!--            <span class="icon-benren iconfont"></span>-->
<!--            {{ showRealName(item) }}-->
<!--          </div>-->
<!--          <div v-if="item.value === '3'">-->
<!--            <span class="icon-benbumenjixiashubumen iconfont"></span>-->
<!--            {{ showRealName(item) }}-->
<!--          </div>-->
          <div>
            <span :class="`${getDataConfig(item)} iconfont`"></span>
            {{ showRealName(item) }}
          </div>

          <div class="paneBox__checkAll" @click.stop.prevent="() => selectRadio(item)">
            <apiot-radio
                :label="item.value"
                v-model="radioData"
            ></apiot-radio>
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
const dataIconConfig = {
  1: 'icon-gongsi',
  2: 'icon-bumen',
  3: 'icon-benbumenjixiashubumen',
  4: 'icon-benren',
  5: 'icon-shezhi'
};

export default {
  props: {
    functionAuthList: {
      // 菜单权限枚举
      type: Array,
      default: () => []
    },
    dataAuthList: {
      // 数据权限枚举
      type: Object,
      default: () => {
      }
    },
    designObj: {
      // 修改权限的对象
      type: Object,
      default: () => {
      }
    },
    isShowInherit: {
      // 是否显示继承
      type: Boolean,
      default: false
    },
    toggleLoading: {
      type: Function,
      default: () => {
      }
    },
    com: {
      type: String,
      default: 'PCDesign'
    },
    selectModuleKeys: { // 选中的模块
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      updateKey: 0,
      checkData: {}, // 选择所有
      activeName: 'function',
      radioData: '' // 数据权限
    };
  },

  watch: {},
  components: {},

  computed: {
    getDataConfig() {
      return (obj) => {
        const { value } = obj;
        return dataIconConfig[`${value}`];
      };
    },
    getIconName() { // 获取class名称
      return function(id) {
        if (id === 1) {
          return 'icon-chakan';
        }
        if (id === 2) {
          return 'icon-xinzeng';
        }
        if (id === 3) {
          return 'icon-bianji';
        }
        if (id === 4) {
          return 'icon-shanchu';
        }
        if (id === 5) {
          return 'icon-daoru';
        }
        if (id === 6) {
          return 'icon-daochu';
        }
        if (id === 7) {
          return 'icon-dayin';
        }
        if (id === 8) {
          return 'icon-sheji';
        }
        return 'icon-sheji';
      };
    },
    showRealName() {
      return function(obj) {
        const languageType = window.localStorage.getItem('apiotLanguage') || 'zhCN';
        return obj[languageType];
      };
    }
  },

  mounted() {
    this.activeName = 'function';
    this.$bus.$off(`${this.com}_change_batch`).$on(`${this.com}_change_batch`, () => {
      this.checkData = {}; // 初始化
      this.updateKey += 1;
      this.radioData = '';
      this.activeName = 'function';
    });
  },

  methods: {
    selectRadio(obj) {
      console.log(this.designObj, 1111111111);
      if (obj.value === '5') {
        this.$emit('batchUpdateOrg');
        return;
      }
      this.radioData = obj.value;
      this.$emit('changeRadio', obj);
    },
    checkAll(e) {
      // 全选
      const newData = { ...this.checkData };
      if (e) {
        newData.isAll = true;
        this.functionAuthList.forEach((item) => {
          newData[item.id] = true;
        });
      } else {
        Object.keys(newData).forEach((item) => {
          newData[item] = false;
        });
      }
      this.checkData = { ...newData };
      this.$emit('checkAll', { value: e });
    },
    batchChange(e, obj) {
      // 批量单选
      const { id } = obj;
      const newCheckData = JSON.parse(JSON.stringify(this.checkData));
      newCheckData[id] = e;
      delete newCheckData.isAll;
      const trueList = Object.values(newCheckData).filter((item) => item);
      if (trueList.length === this.functionAuthList.length) {
        newCheckData.isAll = true;
      } else {
        newCheckData.isAll = false;
      }
      this.checkData = { ...newCheckData };
      this.$emit('checkItem', {
        value: e,
        obj
      });
    },
    handleClick({ name }) {
      this.activeName = name;
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .is-active {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #4689f5 !important;
  }

  .el-tabs__active-bar {
    min-width: 64px;
  }

  .el-tabs__item {
    padding: 0 50px;
  }
}

.paneBox {
  padding: 0 20px;
  height: 100%;
  overflow: auto;

  .paneBox__header {
    height: 36px;
    //display: flex;
    background: #f6f7fb;
    border-radius: 4px;
    line-height: 36px;

    & > div:first-child {
      float: left;
      padding-left: 30px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      box-sizing: border-box;
      //width: calc(100% - 35px);
      //white-space: nowrap;
      //text-overflow: ellipsis;
      //overflow: hidden;
    }
  }

  .paneBox__wrap {
    height: 32px;
    border-radius: 4px;
    line-height: 32px;
    overflow: hidden;

    &:hover {
      background: $--hover-color;

      & .iconfont {
        color: #4689f5;
      }
    }

    & > div:first-child {
      float: left;
      padding-left: 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      box-sizing: border-box;
      width: calc(100% - 35px);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    & .iconfont {
      margin-right: 12px;
      font-size: 18px;
      color: #bbc3cd;
      vertical-align: middle;
    }
  }

  & .paneBox__checkAll {
    float: right;
    padding-right: 21px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    box-sizing: border-box;

    ::v-deep {
      .el-radio__label {
        display: none;
      }
    }
  }
}
</style>
