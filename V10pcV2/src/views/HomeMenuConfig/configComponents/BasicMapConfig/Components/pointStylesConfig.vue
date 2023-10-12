/**
* @name: pointStylesConfig
* @author: DELL
* @date: 2022/8/4 15:54
* @description：pointStylesConfig
* @update: 2022/8/4 15:54
*/
<!-- 页面 -->
<template>
  <div>
    <div v-for="(configItem, i) in scatterConfig"
         :key="i"
    >
      <div class="titleWrap">
        <span class="titleLeft">
          类型{{ i + 1 }}
        </span>
        <span @click="del(i)" class="icon-shanchu iconfont"></span>
      </div>
      <div class="propsSetting">
        <p class="setTitle">字段映射值</p>
        <apiot-input
            :value="configItem.fieldValue"
            @input="(value) => change(value, 'fieldValue', i, configItem)"/>
      </div>
      <div class="numberWrap">
        <div class="propsSetting flexItem">
          <p class="setTitle">散点大小</p>
          <el-input-number
              controls-position="right"
              v-model="configItem.scatterSize"
              @change="(value) =>  change(Number(value), 'scatterSize', i, configItem)"/>
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">散点高亮大小</p>
          <el-input-number
              controls-position="right"
              v-model="configItem.scatterHighlightSize"
              @change="(value) =>  change(Number(value), 'scatterHighlightSize', i, configItem)"/>
        </div>
      </div>
      <div class="numberWrap">
        <div class="propsSetting flexItem">
          <p class="setTitle">散点颜色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.scatterColor"
              @change="(value) => change(value, 'scatterColor',  i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">散点高亮颜色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.scatterHighlightColor"
              @change="(value) => change(value, 'scatterHighlightColor',  i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="numberWrap">
        <div class="propsSetting flexItem">
          <p class="setTitle">散点边框色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.scatterBorderColor"
              @change="(value) => change(value, 'scatterBorderColor', i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">散点边框高亮色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.scatterBorderHighlight"
              @change="(value) => change(value, 'scatterBorderHighlight', i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { predefineColors } from '../../../constants/global';

export default {
  props: {
    scatterConfig: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      predefineColors,
      config: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    // this.config = JSON.parse(JSON.stringify(this.scatterConfig));
  },

  methods: {
    del(i) {
      const list = [...this.scatterConfig];
      list.splice(i, 1);
      this.$emit('change', list);
    },
    change(v, key, i, configItem) {
      const list = [...this.scatterConfig];
      const newObj = {
        ...configItem,
        [key]: v
      };
      list.splice(i, 1, newObj);
      this.$emit('change', list);
    }
  },
  name: 'pointStylesConfig'
};
</script>

<style lang='scss' scoped>
.ellipsisWrap {
  justify-content: space-between;
  align-items: center;
}

.flex {
  display: flex;
}

.titleWrap {
  display: flex;
  justify-content: space-between;

  .titleLeft {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }

  .iconfont {
    color: #BBC3CD;
    cursor: pointer;
  }

  .iconfont:hover {
    color: #4689F5;
  }
}

.propsSetting {
  margin-bottom: 10px;

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

.setTitle {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  text-align: left;
}

.numberWrap {
  display: flex;
  justify-content: space-between;

  .flexItem {
    width: 123px;
  }
}

</style>
