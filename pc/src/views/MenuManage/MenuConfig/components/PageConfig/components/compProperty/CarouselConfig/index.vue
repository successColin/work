<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">轮播图</h1>
    <el-form label-position="top" :model="activeObj">
      <!-- <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="帮助信息" v-if="false">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <el-form-item>
        <p class="switchBox">
          显示标题
          <el-switch
            v-model="activeObj.showLabelTitle"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item> -->
      <el-form-item label="高度">
        <el-select v-model="activeObj.heightMul" placeholder="请选择高度">
          <el-option label="1x" :value="1"></el-option>
          <el-option label="2x" :value="2"></el-option>
          <el-option label="3x" :value="3"></el-option>
          <el-option label="4x" :value="4"></el-option>
          <el-option label="5x" :value="5"></el-option>
          <el-option label="6x" :value="6"></el-option>
          <el-option label="7x" :value="7"></el-option>
          <el-option label="8x" :value="8"></el-option>
          <el-option label="9x" :value="9"></el-option>
          <el-option label="10x" :value="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展现形式">
        <el-select v-model="activeObj.showType" placeholder="请选择展现形式">
          <el-option label="普通展示" :value="1"></el-option>
          <el-option label="卡片化展示" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="边框样式">
        <el-select v-model="activeObj.borderType" placeholder="请选择边框样式">
          <el-option label="直角" :value="1"></el-option>
          <el-option label="圆角" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指示器样式">
        <el-select
          v-model="activeObj.indicatorType"
          placeholder="请选择展现形式"
        >
          <el-option label="线条展示" :value="1"></el-option>
          <el-option label="圆点展示" :value="2"></el-option>
          <el-option label="数字展示" :value="3"></el-option>
          <el-option
            label="全数字展示"
            :value="4"
            v-if="$route.isApp === '1'"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片上传">
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
                <i class="iconfont icon-zongxiangtuodong m-r-10"></i>
                <h2 class="rotateImg__body--head">海报{{ index + 1 }}</h2>
                <i class="iconfont icon-guanbi" @click="deleteImg(index)"></i>
              </div>
              <app-upload
                :fileUrl.sync="item.imgUrl"
                fileAccept=".png, .jpg,.jpeg, .gif,.svg"
                :uploadType="2"
                :isPc="true"
              ></app-upload>
              <div class="config__body--tip">建议：png、jpg格式，3M以内</div>
              <h2 class="rotateImg__body--head">导航链接</h2>
              <apiot-input
                v-model="item.targetUrl"
                placeholder="请输入跳转地址"
              ></apiot-input>
            </li>
          </transition-group>
        </draggable>
        <apiot-button
          class="rotateImg__body--addBtn"
          v-if="activeObj.imgArr.length < 5"
          @click="addImg"
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>添加海报({{
            activeObj.imgArr.length
          }}/5)
        </apiot-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import AppUpload from '../../../../../../../AppConfig/components/Config/AppUpload';

export default {
  mixins: [propertyMixin],
  data() {
    return {};
  },

  components: {
    AppUpload
  },

  computed: {},

  created() {},

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
@import '../commonConfig';

.dividingType {
  position: absolute;
  margin-top: -58px;
  // cursor: pointer;
  ::v-deep {
    .el-input__inner {
      height: 64px;
      line-height: 64px;
      background-color: rgba(0, 0, 0, 0);
      color: rgba(0, 0, 0, 0);
    }
  }
}
.dividingTypeShow {
  background-color: #fff;
  width: 210px;
}
.typeBox {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}
.rotateImg {
  &__body {
    &--li {
      height: 238px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background: #fafafa;
      }
    }
    &--head {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
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
      margin-top: 20px;
      width: 100%;
      i {
        color: $--color-primary;
      }
    }
  }
}
</style>
<style  lang='scss'>
.dividingTypeSelect {
  .el-select-dropdown__item {
    height: 54px;
    padding: 0 10px;
    margin-bottom: 10px;
  }
}
</style>
