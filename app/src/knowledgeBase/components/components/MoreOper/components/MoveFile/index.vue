<!--
 * @Descripttion: 移动
 * @Author: ytx
 * @Date: 2022-01-08 08:34:26
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 08:34:26
-->
<template>
  <apiot-popup :show="show" @close="handleClose">
    <section class="moveFile" :style="{ height: customHeight }">
      <header>
        <div>移动“</div>
        <div class="font__ellipsis header__flex">{{ renameObj.name }}</div>
        <div>”{{ renameObj.type === 1 ? '文件夹' : '文件' }}</div>
      </header>
      <!-- 路径 -->
      <apiot-breadcrumb
        :arr="pathArr"
        @handlePathFun="handlePathFun"
      ></apiot-breadcrumb>
      <div class="moveFile__box">
        <u-radio-group v-model="currentValue" placement="column">
          <div
            v-for="(item, i) in listArr"
            :key="i"
            class="moveFile__box--item"
            @click="handleJump(item)"
          >
            <div class="moveFile__box--left">
              <!-- <image class="moveFile__box--img" :src="imgUrl(item)" alt="" /> -->
              <i class="moveFile__box--img" :class="[imgUrl(item)]"></i>
              <div class="moveFile__box--name">{{ item.sysKlTree.name }}</div>
            </div>
            <u-radio
              :name="item.sysKlTree.id"
              class="moveFile__box--radio"
            ></u-radio>
          </div>
        </u-radio-group>
      </div>
      <footer>
        <u-button class="m-r-12" text="取消" @click="handleReset"></u-button>
        <u-button type="primary" text="确定" @click="handleOk"></u-button>
      </footer>
    </section>
    <apiot-point :obj="currentTipObj"></apiot-point>
  </apiot-popup>
</template>

<script>
// 接口
import { listFiles, moveFolder } from '@/api/knowledgeBase';
import ApiotPoint from '../../../../ApiotPoint';

export default {
  inject: ['fileTypeImg'],
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: false
    },
    classId: {
      type: Number,
      default: 1
    },
    // 当前数据的id
    currentId: {
      type: Number
    },
    renameObj: {
      type: Object,
      default: () => {}
    },
    tipObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listArr: [],
      currentValue: '',
      currentTipObj: {},
      pathArr: [
        {
          name: '全部'
        }
      ]
    };
  },
  components: {
    ApiotPoint
  },
  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    customHeight() {
      let height = 0;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      // #ifndef MP-ALIPAY
      height = this.systemInfo.customBar || 0;
      // #endif
      return `calc(100vh - ${height}px - 30rpx)`;
    },
    imgUrl() {
      return function(name) {
        return this.fileTypeImg(name);
      };
    }
  },
  watch: {
    show(v) {
      if (v) {
        this.resetFun();
        this.getList();
      }
    }
  },
  mounted() {},
  methods: {
    resetFun() {
      this.listArr = [];
      this.currentValue = '';
      this.currentTipObj = {};
      this.pathArr = [
        {
          name: '全部'
        }
      ];
    },
    async getList(params, currentObj) {
      const res = await listFiles({
        classId: this.classId,
        isFolder: 1, // 是否只显示文件夹(1是 0否)
        // keywords: '',
        parentId: 0,
        current: 1,
        size: 9999,
        ...params
      });
      const { records } = res;
      if (records.length !== 0) {
        this.currentValue = '';
        this.listArr = records;
        if (currentObj) {
          const { id, name } = currentObj.sysKlTree;
          this.pathArr.push({
            name,
            id
          });
        }
      } else {
        this.currentTipObj = {
          type: 'warning',
          message: '下一层不存在'
        };
      }
    },
    handlePathFun(v, i) {
      this.pathArr = this.pathArr.slice(0, i + 1);
      const obj = this.pathArr[this.pathArr.length - 1];
      const parentId = obj.id;
      this.getList({ parentId });
    },
    handleJump(v) {
      console.log(v);
      const { id } = v.sysKlTree;
      this.getList(
        {
          parentId: id
        },
        v
      );
    },
    // 取消
    handleReset() {
      this.$emit('update:show', false);
    },
    // 确定
    async handleOk() {
      console.log(this.currentValue);
      try {
        await moveFolder({
          parentId: this.currentValue,
          ids: this.currentId
        });
        this.$emit('update:tipObj', {
          type: 'success',
          message: '移动成功'
        });
        this.$emit('update:show', false);
      } catch (error) {
        this.currentTipObj = {
          type: 'error',
          message: error.message
        };
      }

      this.$emit('refreshFun');
    },
    handleClose() {
      this.$emit('update:show', false);
    }
  }
};
</script>
<style lang='scss' scoped>
.moveFile {
  margin-top: 30rpx;
  display: flex;
  flex-direction: column;
  header {
    font-size: 32rpx;
    @include fontBlob(500);
    color: #333333;
    text-align: center;
    display: flex;
    margin: 0 100rpx;
    justify-content: center;
    .header__flex {
      flex: 1;
      max-width: fit-content;
    }
  }
  &__box {
    flex: 1;
    overflow: auto;
    &--item {
      margin: 0 30rpx;
      display: flex;
      height: 120rpx;
      align-items: center;
    }
    &--img {
      width: 68rpx;
      height: 68rpx;
    }
    &--left {
      display: flex;
      flex: 1;
      align-items: center;
    }
    &--name {
      font-size: 32rpx;
      color: #333333;
      margin-left: 36rpx;
    }
    &--radio {
      height: 100%;
      padding: 0 30rpx;
    }
  }
  footer {
    width: calc(100% - 64rpx);
    display: flex;
    padding: 20rpx 33rpx;
    background: #ffffff;
  }
}
</style>
