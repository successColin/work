/**
* @name: index
* @author: DELL
* @date: 2021/11/22 8:53
* @description：index
* @update: 2021/11/22 8:53
*/
<!-- 页面 -->
<template>
  <div class="layerWrap">
    <!--    <div class="layerOperation">-->
    <!--      <div class="operation">-->
    <!--        <div class="operationBox" @click="putTop">-->
    <!--          <el-tooltip class="item" effect="dark" content="置顶" placement="top">-->
    <!--            <span class="icon-zhiyudingceng iconfont"></span>-->
    <!--          </el-tooltip>-->
    <!--        </div>-->
    <!--        <div class="operationBox" @click="bringForward">-->
    <!--          <el-tooltip class="item" effect="dark" content="上移" placement="top">-->
    <!--            <span class="icon-shangyiyiceng iconfont"></span>-->
    <!--          </el-tooltip>-->
    <!--        </div>-->
    <!--        <div class="operationBox" @click="sendBackward">-->
    <!--          <el-tooltip class="item" effect="dark" content="下移" placement="top">-->
    <!--            <span class="icon-xiayiyiceng iconfont"></span>-->
    <!--          </el-tooltip>-->
    <!--        </div>-->
    <!--        <div class="operationBox" @click="putBottom">-->
    <!--          <el-tooltip class="item" effect="dark" content="置底" placement="top">-->
    <!--            <span class="icon-zhiyudiceng iconfont"></span>-->
    <!--          </el-tooltip>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="split"></div>-->
    <!--      <div class="del">-->
    <!--        <el-tooltip class="item" effect="dark" content="删除" placement="top">-->
    <!--          <span class="icon-shanchu iconfont" @click="del"></span>-->
    <!--        </el-tooltip>-->
    <!--      </div>-->
    <!--    </div>-->
    <search-input
        class="searchBox"
        placeholder="请输入图层关键字"
        v-model="input"
    ></search-input>
    <div class="layerList">
      <draggable animation="200" @sort="onEnd">
        <transition-group tag="ul">
          <div
            class="componentBox"
            v-for="(item, index) in newList"
            :key="item.componentId"
            :class="{
              active: item.componentId === activeComponent.componentId,
            }"
            @click="choose(item)"
          >
            <div class="componentImgBox">
              <img :src="require(`@/assets/img/${item.imgUrl}`)" alt="" />
            </div>
            <div class="componentNameBox">{{ item.name }}</div>
            <div class="componentOpear">
              <span
                class="iconfont"
                :class="{
                  'icon-jiesuotuceng': item.isLock,
                  block: item.isLock,
                }"
                @click="changeShowStatus(item, index, 'isLock')"
              ></span>
              <span
                class="iconfont"
                :class="{
                  'icon-mimaxianshi': item.isShow,
                  block: !item.isShow,
                  'icon-xianshituceng': !item.isShow,
                }"
                @click="changeShowStatus(item, index, 'isShow')"
              ></span>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { delComponent } from '@/api/design';

export default {
  props: {
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      record: {},
      input: ''
    };
  },

  components: {},

  computed: {
    newList() {
      if (!this.input) return this.list;
      return this.list.filter((item) => item.name && item.name.indexOf(this.input) > -1);
    }
  },

  mounted() {},

  methods: {
    onEnd(e) {
      const { newIndex, oldIndex } = e;
      const cloneList = cloneDeep(this.list); // 复制出来的数组
      const current = this.list[oldIndex]; // 原位置
      const target = cloneList[newIndex]; // 新位置
      if (newIndex > oldIndex) {
        // 如果是前值往后移，目标位置的后面的图层等级需要修改
        cloneList.splice(oldIndex, 1);
        const lastArr = cloneList.slice(newIndex);
        const firstArr = cloneList.slice(0, newIndex);
        const beforeOne = firstArr[firstArr.length - 1];
        const v = beforeOne.stylesObj.zIndex;
        current.stylesObj.zIndex = v - 1 < 0 ? 0 : v;
        lastArr.forEach((item, index) => {
          item.stylesObj.zIndex = v - (2 + index) < 0 ? 0 : v - (2 + index);
        });
        const newArr = [...firstArr, current, ...lastArr];
        this.$emit('updateList', newArr);
        return;
      }
      if (newIndex < oldIndex) {
        // 如果是后面的数据往前移，一最新的数据为分割点，后面的数据后移
        cloneList.splice(oldIndex, 1);
        const lastArr = cloneList.slice(newIndex);
        const firstArr = cloneList.slice(0, newIndex);
        const {
          stylesObj: { zIndex }
        } = target;
        current.stylesObj.zIndex = zIndex;
        lastArr.forEach((item, index) => {
          const v = zIndex - index - 1;
          item.stylesObj.zIndex = v < 0 ? 0 : v;
        });
        const newArr = [...firstArr, current, ...lastArr];
        this.$emit('updateList', newArr);
      }
    },
    changeShowStatus(item, index, key) {
      // 控制图层显示隐藏
      const list = [...this.list];
      const newInfo = {
        ...item,
        [key]: !item[key]
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    choose(item) {
      this.$emit('updateActiveComponent', item);
    },
    del() {
      if (JSON.stringify(this.activeComponent) === '{}') {
        this.$message.warning('请选择图层再删除!');
        return;
      }
      this.$confirm(`此操作将删除${this.activeComponent.name}图层`, '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const index = this.list.findIndex(
            (item) => item.componentId === this.activeComponent.componentId
          );
          const list = [...this.list];
          try {
            if (this.activeComponent.id) {
              await delComponent({ id: this.activeComponent.id });
            }
            list.splice(index, 1);
            this.$emit('updateActiveComponent', list[0] || {});
            this.$emit('updateList', list);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } catch (e) {
            console.log(e);
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    updateConfigList(activeComponent) {
      const index = this.list.findIndex((item) => item.componentId === activeComponent.componentId);
      const list = [...this.list];
      list.splice(index, 1, activeComponent);
      this.$emit('updateList', list);
    },
    putTop() {
      // 置顶
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const list = [...this.list];
      const zIndexArr = list.map((o) => o.stylesObj.zIndex);
      const max = Math.max(...zIndexArr);
      const obj = { ...this.activeComponent };
      if (max === obj.stylesObj.zIndex) {
        return;
      }
      obj.stylesObj.zIndex = max + 1;
      this.updateConfigList(obj);
    },
    putBottom() {
      // 置底
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const list = [...this.list];
      const arr = list.map((o) => o.stylesObj.zIndex);
      const mix = Math.min(...arr);
      const obj = { ...this.activeComponent };
      obj.stylesObj.zIndex = mix - 1;
      this.updateConfigList(obj);
    },
    bringForward() {
      // 上移一层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const list = [...this.list];
      const index = list.findIndex((item) => item.componentId === this.activeComponent.componentId);
      if (index === 0) {
        return;
      }
      const {
        stylesObj: { zIndex }
      } = list[index - 1];
      const obj = { ...this.activeComponent };
      obj.stylesObj.zIndex = zIndex + 1;
      this.updateConfigList(obj);
    },
    sendBackward() {
      // 下移一层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const index = this.list.findIndex(
        (item) => item.componentId === this.activeComponent.componentId
      );
      if (index === this.list.length - 1) {
        return;
      }
      const {
        stylesObj: { zIndex }
      } = this.list[index + 1];
      const obj = { ...this.activeComponent };
      const n = zIndex - 1;
      obj.stylesObj.zIndex = n < 0 ? 0 : n;
      this.updateConfigList(obj);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.layerWrap {
  width: 100%;
  height: calc(100%);
  padding: 10px;
  overflow-y: auto;
  box-sizing: border-box;

  .layerOperation {
    width: 100%;
    height: 42px;
    //padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .operation {
      width: 180px;
      height: 28px;
      display: flex;
      //border: 1px solid #2F437F;
      border-right: none;
      box-sizing: border-box;

      .operationBox {
        flex: 1;
        text-align: center;
        line-height: 26px;
        border: 1px solid #e9e9e9;
        border-right: none;

        .iconfont {
          font-size: 18px;
          color: #bbc3cd;
          cursor: pointer;
        }

        &:hover + .operationBox {
          border-left: 1px solid #4689f5;
        }

        &:hover {
          border-color: #4689f5;
        }

        &:hover .iconfont {
          color: #4689f5;
        }
      }

      .operationBox:last-child {
        border: 1px solid #e9e9e9;

        &:hover {
          border-color: #4689f5;
        }

        &:hover .iconfont {
          color: #4689f5;
        }
      }
    }

    .split {
      width: 1px;
      height: 20px;
      background: #bbc3cd;
    }

    .del {
      width: 45px;
      height: 28px;
      background: #fff;
      text-align: center;
      line-height: 26px;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;

      .iconfont {
        font-size: 18px;
        color: #bbc3cd;
        cursor: pointer;
      }

      &:hover {
        border-color: #4689f5;
      }

      &:hover .iconfont {
        color: #4689f5;
      }
    }
  }
  .searchBox{
    display: block;
    height: 30px;
    width: 100%;
  }
  .layerList {
    //height: calc(100% - 46px - 42px);
    height: calc(100% - 30px);
    width: 100%;
    padding: 10px 0;
    overflow: auto;
    box-sizing: border-box;

    .componentBox {
      width: calc(100%);
      height: 34px;
      padding: 0 14px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background: #f1f7ff;
      }

      &:hover .iconfont {
        color: #bbc3cd;
      }
      .block {
        display: block !important;
      }

      &.active {
        background: #f1f7ff;
      }

      &.active .componentOpear {
        display: flex;

        .icon-yulan {
          display: block;
        }
      }

      &:hover .componentOpear {
        display: flex;

        .icon-yulan,
        .iconfont {
          display: block;
        }
      }

      &:active .iconfont {
        color: #bbc3cd;
      }
      &.active .iconfont {
        display: block;
      }

      .componentImgBox {
        width: 20px;
        height: 20px;
        box-sizing: border-box;

        & > img {
          width: 100%;
        }
      }

      .componentNameBox {
        width: calc(100% - 46px - 12px - 24px);
        margin-left: 10px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
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
        .iconfont:last-child {
          margin-left: 5px;
        }
      }

      .iconfont {
        display: none;
        color: #bbc3cd;
        font-size: 18px;
        opacity: 0.7;
        cursor: pointer;

        &:hover {
          color: #4689f5;
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
          color: #4689f5;
          opacity: 1;
        }
      }
    }
  }
}
</style>
