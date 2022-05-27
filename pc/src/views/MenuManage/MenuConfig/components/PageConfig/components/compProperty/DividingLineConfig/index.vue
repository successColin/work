<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">分割线</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
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
      </el-form-item>
      <el-form-item label="样式">
        <DividingShow
          class="dividingTypeShow"
          :dividingName="activeObj.name"
          :showTitle="activeObj.showLabelTitle"
          :dividingType="activeObj.dividingType"
        ></DividingShow>
        <el-select
          v-model="activeObj.dividingType"
          placeholder=""
          class="dividingType"
          popper-class="dividingTypeSelect"
        >
          <el-option :label="item" :value="item" v-for="item in 4" :key="item">
            <div class="typeBox">
              <DividingShow
                :dividingName="activeObj.name"
                :showTitle="activeObj.showLabelTitle"
                :dividingType="item"
              ></DividingShow>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {};
  },

  components: {},

  computed: {},

  created() {},

  mounted() {},

  methods: {}
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
