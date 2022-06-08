<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>关联面板</h1>
    </header>
    <section class="contentConfig__wrapper">
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用搜索
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showSearch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用关联知识库
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showRelateBtn"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用上传本地文件
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showUploadBtn"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否允许新建文件夹
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showNewBtn"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box">
        <h2>关联数据id</h2>
        <select-comp
          class="p-l-10 p-r-10"
          :placeholder="`请选择关联数据id控件`"
          :configData="configData"
          :curTriggerComp="activeObj.relateDataComp"
          :triggerCompMap="triggerCompMap"
          :filterMethods="filterMethods"
          @compChange="compChange1"
        ></select-comp>
      </div>
      <div class="contentConfig__box">
        <h2>关联业务id</h2>
        <select-comp
          class="p-l-10 p-r-10"
          :placeholder="`请选择关联数据id控件`"
          :configData="configData"
          :curTriggerComp="activeObj.relateBusiComp"
          :triggerCompMap="triggerCompMap"
          :filterMethods="filterMethods"
          @compChange="compChange2"
        ></select-comp>
      </div>
      <!-- <div class="contentConfig__pBox m-b-10">
        <p class="contentConfig__p">展示方式</p>
        <el-select
          class="contentConfig__select"
          v-model="activeObj.showType"
          placeholder="请选择类型"
        >
          <el-option label="列表风格+宫格展示" :value="1"></el-option>
          <el-option label="列表风格" :value="2"></el-option>
          <el-option label="宫格展示" :value="3"></el-option>
        </el-select>
      </div> -->
      <div class="contentConfig__box">
        <h2>表头字段显示</h2>
        <draggable
          v-model="activeObj.tableColumn"
          group="tabs"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group class="contentConfig__hasTab--list" tag="ul">
            <li
              class="contentConfig__hasTab--tab"
              v-for="child in activeObj.tableColumn"
              :key="child.column"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
              <span class="input">{{ textObj[child.column] }}</span>
              <el-tooltip
                effect="dark"
                content="隐藏"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-mimaxianshi m-r-12"
                  @click="child.show = false"
                  v-show="child.show"
                ></i
              ></el-tooltip>
              <el-tooltip
                effect="dark"
                content="显示"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-yincang m-r-12"
                  @click="child.show = true"
                  v-show="!child.show"
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="contentConfig__box contentConfig__hasTab">
        <h2>功能设置</h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否允许替换新版本
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showReplaceBtn"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否允许删除
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showDeleteBtn"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否允许预览
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showPreview"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否允许下载
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="activeObj.showDownload"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
    </section>
  </div>
</template>

<script>
// import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import SelectComp from '../GlobalConfig/components/AddAction/components/SelectComp';

export default {
  mixins: [propertyMixin],
  props: {
    activeObj: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    }
  },
  data() {
    return {
      textObj: {
        RelateName: '文件名称',
        RelateUserName: '创建人',
        RelateCreateTime: '创建时间',
        RelateModifyTime: '更新时间',
        RelateSize: '大小',
        RelateType: '文件来源'
      }
    };
  },

  components: {
    SelectComp
  },

  computed: {},
  created() {},
  mounted() {
    if (this.activeObj.relateDataComp.compId) {
      this.compChange1();
    }
    if (this.activeObj.relateBusiComp.compId) {
      this.compChange2();
    }
  },

  methods: {
    filterMethods(data) {
      if (data.dataSource && data.dataSource.columnName) {
        if (data.dataSource.tableName) {
          return false;
        }
        return true;
      }
      return false;
    },
    compChange1() {
      if (this.getAllcheck[this.activeObj.relateDataComp.compId]) {
        this.activeObj.relateDataComp.tableName =
          this.getAllcheck[this.activeObj.relateDataComp.compId].dataSource.tableName;
      } else {
        this.activeObj.relateDataComp = {
          compId: '',
          compPath: '',
          compType: '',
          tableName: ''
        };
      }
    },
    compChange2() {
      if (this.getAllcheck[this.activeObj.relateBusiComp.compId]) {
        this.activeObj.relateBusiComp.tableName =
          this.getAllcheck[this.activeObj.relateBusiComp.compId].dataSource.tableName;
      } else {
        this.activeObj.relateBusiComp = {
          compId: '',
          compPath: '',
          compType: '',
          tableName: ''
        };
      }
    }
  },

  watch: {}
};
</script>

<style lang='scss' scoped>
.contentConfig {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 10px;
  &__title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
  }
  &__wrapper {
    height: calc(100% - 46px);
    overflow: auto;
  }
  &__box {
    h2 {
      padding-left: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      height: 40px;
      line-height: 40px;
    }
  }
  &__hasTab {
    &--switchBox {
      position: relative;
      ::v-deep {
        .el-switch__label {
          position: absolute;
          margin: 0;
          color: #ffffff !important;
        }
        .el-switch__label--left {
          display: none;
          left: 22px;
          &.is-active {
            display: block;
            z-index: 1;
          }
          span {
            font-size: 12px;
          }
        }
        .el-switch__label--right {
          display: none;
          left: 6px;
          &.is-active {
            display: block;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
    &--switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    &--list {
      padding: 0 10px;
    }
    &--tab {
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
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        flex: 1;
      }
      .columnName {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        &__sort {
          width: 80px;
          margin-left: auto;
          margin-right: 8px;
        }
      }
      &.active,
      &:hover {
        background: $--hover-color;
        .icon-sheweimoren {
          visibility: visible;
        }
      }
    }
    &--addTab {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-bottom: 10px;
    }
  }
  &__pBox {
    padding: 0 10px;
  }
  &__p {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }
  &__select {
    width: 100%;
  }
}
</style>
