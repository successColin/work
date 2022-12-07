/**
* @name: index
* @author: DELL
* @date: 2021/11/22 8:53
* @description：index
* @update: 2021/11/22 8:53
*/
<!-- 页面 -->
<template>
  <transition name="slide-fade">
    <div class="layerWrap" v-if="zoomVisible">
      <div class="layerTitle">图层管理</div>
      <div class="layerOperation">
        <div class="operation">
          <div class="operationBox" @click="putTop">
            <el-tooltip class="item" effect="dark" content="置顶" placement="top">
              <span class="icon-zhiyudingceng iconfont"></span>
            </el-tooltip>
          </div>
          <div class="operationBox" @click="bringForward">
            <el-tooltip class="item" effect="dark" content="上移" placement="top">
              <span class="icon-shangyiyiceng iconfont"></span>
            </el-tooltip>
          </div>
          <div class="operationBox" @click="sendBackward">
            <el-tooltip class="item" effect="dark" content="下移" placement="top">
              <span class="icon-xiayiyiceng iconfont"></span>
            </el-tooltip>
          </div>
          <div class="operationBox" @click="putBottom">
            <el-tooltip class="item" effect="dark" content="置底" placement="top">
              <span class="icon-zhiyudiceng iconfont"></span>
            </el-tooltip>
          </div>
        </div>
        <div class="split"></div>
        <div class="del">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <span class="icon-shanchu1 iconfont" @click="del"></span>
          </el-tooltip>
        </div>
      </div>
      <div class="layerList">
        <div
            class="componentBox"
            v-for="(item, index) in configArr"
            :key="item.id"
            :class="{active: item.componentId===activeComponent.componentId}"
            @click="choose(item)"
        >
          <div class="componentImgBox"><img :src="item.thumbnail" alt=""></div>
          <div class="componentNameBox">{{ item.name }}</div>
          <div class="componentOpear">
            <span
                class="iconfont"
                :class="{'icon-jiesuo': item.isLock}"
                @click="changeShowStatus(item, index,'isLock')"
            ></span>
            <span
                class="iconfont"
                :class="{'icon-yulan': item.isShow, 'icon-yincangtuceng': !item.isShow}"
                @click="changeShowStatus(item, index, 'isShow')"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import { getMax } from '@/utils/utils'

import {delComponent} from '@/services/design';

export default {
  props: {
    zoomVisible: {
      type: Boolean,
      default: false
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      record: {}
    };
  },

  components: {},

  computed: {
    configArr() { // 设计区域的组件
      const list = this.$store.getters.list;
      return list.sort((a, b) => b.stylesObj.zIndex - a.stylesObj.zIndex);
    },
    initConfigArr() { // 设计区域的组件
      return this.$store.getters.list;
    }
  },

  mounted() {
  },

  methods: {
    changeShowStatus(item, index, key) { // 控制图层显示隐藏
      const list = [...this.configArr];
      const newInfo = {
        ...item,
        [key]: !item[key]
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    choose(item) {
      this.$emit('updateActiveComponent', item);
    },
    del() {
      if (JSON.stringify(this.activeComponent) === '{}') {
        this.$message.error('请选择图层再删除!');
        return;
      }
      this.$confirm(`此操作将删除${this.activeComponent.name}图层`, '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const index = this.configArr.findIndex((item) => item.componentId === this.activeComponent.componentId);
        const list = [...this.configArr];
        try {
          if (this.activeComponent.id) {
            await delComponent({id: this.activeComponent.id})
          }
          list.splice(index, 1);
          this.$emit('updateActiveComponent', list[0] || {});
          await this.$store.dispatch('config/updateComponentList', list);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (e) {
          console.log(e);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    putTop() { // 置顶
      if (JSON.stringify(this.activeComponent) === '{}') {return;}
      const list = this.initConfigArr;
      this.$store.dispatch('config/putTop', {list, activeComponent: this.activeComponent});
    },
    putBottom() { // 置底
      if (JSON.stringify(this.activeComponent) === '{}') {return;}
      const list = this.initConfigArr;
      this.$store.dispatch('config/putBottom', {list, activeComponent: this.activeComponent});
    },
    bringForward() { // 上移一层
      if (JSON.stringify(this.activeComponent) === '{}') {return;}
      const list = this.initConfigArr;
      this.$store.dispatch('config/bringForward', {list, activeComponent: this.activeComponent});
    },
    sendBackward() { // 下移一层
      if (JSON.stringify(this.activeComponent) === '{}') {return;}
      const list = this.initConfigArr;
      this.$store.dispatch('config/sendBackward', {list, activeComponent: this.activeComponent});
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.layerWrap {
  position: absolute;
  left: 0;
  top: 50px;
  width: 240px;
  height: calc(100% - 50px);
  background: #14214B;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.36);

  .layerTitle {
    height: 46px;
    padding-left: 14px;
    line-height: 46px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    box-shadow: 0px 1px 0px 0px #2f437f;
  }

  .layerOperation {
    width: 240px;
    height: 42px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .operation {
      width: 152px;
      height: 28px;
      display: flex;
      //border: 1px solid #2F437F;
      border-right: none;
      box-sizing: border-box;

      .operationBox {
        flex: 1;
        text-align: center;
        line-height: 26px;
        border: 1px solid #2F437F;
        border-right: none;

        .iconfont {
          font-size: 18px;
          color: #FFFFFF;
          cursor: pointer;
        }

        &:hover + .operationBox {
          border-left: 1px solid #4689F5;
        }

        &:hover {
          border-color: #4689F5;
        }

        &:hover .iconfont {
          color: #4689F5;
        }
      }

      .operationBox:last-child {
        border: 1px solid #2F437F;

        &:hover {
          border-color: #4689F5;
        }

        &:hover .iconfont {
          color: #4689F5;
        }
      }
    }

    .split {
      width: 1px;
      height: 20px;
      background: #2F437F;
    }

    .del {
      width: 38px;
      height: 28px;
      background: #192757;
      text-align: center;
      line-height: 26px;
      border: 1px solid #2F437F;
      box-sizing: border-box;

      .iconfont {
        font-size: 18px;
        color: #FFFFFF;
        cursor: pointer;
      }

      &:hover {
        border-color: #4689F5;
      }

      &:hover .iconfont {
        color: #4689F5;
      }
    }
  }

  .layerList {
    height: calc(100% - 46px - 42px);
    padding: 10px 0;
    overflow: auto;
    box-sizing: border-box;

    .componentBox {
      width: calc(100%);
      height: 40px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background: #1D3469;
      }

      &:hover .iconfont {
        color: #FFFFFF;
      }

      &.active {
        background: #1D3469;
      }

      &.active .componentOpear {
        display: flex;

        .icon-yulan {
          display: block;
        }
      }

      &:hover .componentOpear {
        display: flex;

        .icon-yulan {
          display: block;
        }
      }

      &:active .iconfont {
        color: #FFFFFF;
      }

      .componentImgBox {
        width: 46px;
        height: 30px;
        padding: 5px 7px;
        background: #192757;
        border: 1px solid #2F437F;
        box-sizing: border-box;

        & > img {
          width: 100%;
        }
      }

      .componentNameBox {
        width: calc(100% - 46px - 12px - 24px - 24px);
        margin-left: 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .componentOpear {
        width: 48px;
        display: flex;
        justify-content: flex-end;
        text-align: right;
      }

      .iconfont {
        color: #FFFFFF;
        font-size: 18px;
        opacity: 0.7;
        cursor: pointer;

        &:hover {
          color: #4689F5;
          opacity: 1;
        }
      }

      .icon-yulan {
        margin-left: 6px;
        display: none;
      }

      .icon-yincangtuceng {
        margin-left: 6px;
        display: block;
      }

      .icon-jiesuo {
        display: block;

        &:hover {
          color: #4689F5;
          opacity: 1;
        }
      }
    }
  }
}
</style>
