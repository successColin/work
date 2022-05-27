<template>
  <section class="rotateImg config">
    <div class="config__header">轮播配置</div>
    <div class="config__body rotateImg__body">
      <draggable
        v-model="activeObj.imgArr"
        group="menu"
        animation="300"
        handle=".icon-zongxiangtuodong"
      >
        <transition-group class="menu__father" tag="ul">
          <li
            class="rotateImg__body--li"
            v-for="(item, index) in activeObj.imgArr"
            :key="item.parperId"
          >
            <div class="rotateImg__body--liHead">
              <i class="iconfont icon-zongxiangtuodong"></i>
              <h2 class="config__body--head">海报{{ index + 1 }}</h2>
              <i class="iconfont icon-guanbi" @click="deleteImg(index)"></i>
            </div>
            <app-upload
              :fileUrl.sync="item.imgUrl"
              fileAccept=".png, .jpg,.jpeg, .gif,.svg"
              :uploadType="2"
            ></app-upload>
            <div class="config__body--tip">
              建议：尺寸750×300px，png、jpg格式，3M以内
            </div>
            <h2 class="config__body--head">导航链接</h2>
            <apiot-input
              v-model="item.targetUrl"
              placeholder="请输入跳转地址"
            ></apiot-input>
          </li>
        </transition-group>
      </draggable>
      <apiot-button
        class="rotateImg__body--addBtn config__body--btn"
        v-if="activeObj.imgArr.length < 5"
        @click="addImg"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>添加海报({{
          activeObj.imgArr.length
        }}/5)
      </apiot-button>
    </div>
  </section>
</template>

<script>
import { createUnique } from '@/utils/utils';
import AppUpload from '../AppUpload';

export default {
  props: {
    activeObj: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {
    AppUpload
  },

  computed: {},

  mounted() {},

  methods: {
    addImg() {
      this.activeObj.imgArr.push({
        parperId: createUnique(),
        imgUrl: '',
        targetUrl: ''
      });
    },
    deleteImg(index) {
      this.activeObj.imgArr.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
.rotateImg {
  &__body {
    padding: 12px 10px 0;
    &--li {
      height: 238px;
      box-sizing: border-box;
      padding: 16px 10px;
      cursor: pointer;
      &:hover {
        background: #fafafa;
      }
    }
    &--liHead {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      .config__body--head {
        margin: 0;
        line-height: 18px;
        margin-left: 10px;
      }
      .iconfont {
        font-size: 16px;
        cursor: pointer;
        color: #aaaaaa;
        &:hover {
          color: $--color-primary;
        }
      }
      .icon-guanbi {
        margin-left: auto;
      }
    }
    &--addBtn {
      margin-left: 10px;
      width: calc(100% - 20px);
    }
  }
}
</style>
