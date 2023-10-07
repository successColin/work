/**
* @name: index
* @author: DELL
* @date: 2022/1/22 14:52
* @description：index
* @update: 2022/1/22 14:52
*/
<!-- 页面 -->
<template>
  <div>
    <div class="tabInterWrap" v-for="(item, index) in config" :key="index">
      <div class="tabInterWrapHead">
        <div class="tabInterWrapName">{{ item.name }}</div>
        <div class="tabInterIcon">
          <el-switch
              v-model="item.enable"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
      </div>
      <div>
        <div class="propsSetting">
          <span class="setTitle">X轴(水平方向)</span>
          <c-slider
              :min="-200"
              :max="200"
              :value.sync="item.x"
              @change="(v) => item.x=v"
          />
        </div>

        <div class="propsSetting">
          <span class="setTitle">Y轴(上下方向)</span>
          <c-slider
              :min="-200"
              :max="200"
              :value.sync="item.y"
              @change="(v) => item.y=v"
          />
        </div>

        <div class="propsSetting">
          <span class="setTitle">Z轴(前后方向)</span>
          <c-slider
              :min="-200"
              :max="200"
              :value.sync="item.z"
              @change="(v) => item.z=v"
          />
        </div>
      </div>
      <c-divider type="dashed" v-if="index!==config.length-1"></c-divider>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/utils';
import {predefineColors} from '@/constants/global'

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      predefineColors,
      config: this.value
    };
  },

  components: {},

  computed: {},
  created() {
    this.debounceFun = debounce(function () {
      this.$emit('change', this.config);
    });
  },
  mounted() {
  },

  methods: {
  },
  watch: {
    value: {
      deep: true,
      handler(){
        this.config = this.value;
      }
    },
    config: {
      deep: true,
      handler() {
        this.debounceFun();
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.tabInterWrap {
  .tabInterWrapHead {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;

    .tabInterWrapName {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
    }

    .tabInterIcon {


      .iconfont {
        margin-left: 10px;
        color: #FFFFFF;
        cursor: pointer;

        &:hover {
          color: #4689F5;
        }
      }

      .iconActive {
        color: #4689F5;
      }
    }
  }
}

.propsSetting {
  margin-bottom: 10px;

  .setTitle {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 30px;
    text-align: left;
    opacity: .7;
  }


  .wrap {
    display: flex;
    text-align: left;
    align-items: center;
    line-height: 35px;

    & > span {
      margin-right: 10px;
      color: #ffffff;
      font-size: 14px;
    }
  }
}

.numberWrap {
  display: flex;
  justify-content: space-between;

  .flexItem {
    width: 123px;
  }
}
</style>
