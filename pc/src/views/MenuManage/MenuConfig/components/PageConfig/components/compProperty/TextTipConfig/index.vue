<template>
  <div class="config labelConfig">
    <h1 class="config__h1">文本控件</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item style="margin-bottom: 0">
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
      <el-form-item
        label="标题"
        v-show="activeObj.showLabelTitle || relateObj.compName === 'TreeMain'"
      >
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="类型" class="defaultValue">
        <el-select
          v-model="activeObj.defaultValueType"
          placeholder="请选择"
          class="defaultValue__type"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <apiot-input
          :isForbid="false"
          v-if="activeObj.defaultValueType === 1"
          class="defaultValue__input"
          v-model="activeObj.fixedContent"
        ></apiot-input>
        <select-formula
          v-if="activeObj.defaultValueType === 2"
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.formulaContent"
        ></select-formula>
      </el-form-item>
      <el-form-item label="状态">
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.singleStatus === 1 }]"
            @click="activeObj.singleStatus = 1"
            >普通</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 2 }]"
            @click="activeObj.singleStatus = 2"
            v-if="false"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 3 }]"
            @click="activeObj.singleStatus = 3"
            v-if="false"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 4 }]"
            @click="activeObj.singleStatus = 4"
            >隐藏</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="宽度" v-if="false">
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.width === '50%' }]"
            @click="activeObj.width = '50%'"
            >1/2</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '33.33%' }]"
            @click="activeObj.width = '33.33%'"
            >1/3</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '25%' }]"
            @click="activeObj.width = '25%'"
            >1/4</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '66.67%' }]"
            @click="activeObj.width = '66.67%'"
            >2/3</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '75%' }]"
            @click="activeObj.width = '75%'"
            >3/4</el-button
          >
          <el-button
            :class="[{ active: activeObj.width === '100%' }]"
            @click="activeObj.width = '100%'"
            >1/1</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="标题字体" class="font">
        <apiot-color-picker
          v-model="activeObj.titleFont.color"
          class="m-r-8"
          v-show="!activeObj.enableDict"
        >
        </apiot-color-picker>
        <el-select v-model="activeObj.titleFont.size" class="m-r-8">
          <el-option label="12" :value="12"></el-option>
          <el-option label="13" :value="13"></el-option>
          <el-option label="14" :value="14"></el-option>
          <el-option label="15" :value="15"></el-option>
          <el-option label="16" :value="16"></el-option>
          <el-option label="17" :value="17"></el-option>
          <el-option label="18" :value="18"></el-option>
        </el-select>
        <el-select v-model="activeObj.titleFont.style">
          <el-option label="常规字体" :value="1"></el-option>
          <el-option label="加粗字体" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文本字体" class="font">
        <apiot-color-picker
          v-model="activeObj.font.color"
          class="m-r-8"
          v-show="!activeObj.enableDict"
        >
        </apiot-color-picker>
        <el-select v-model="activeObj.font.size" class="m-r-8">
          <el-option label="12" :value="12"></el-option>
          <el-option label="13" :value="13"></el-option>
          <el-option label="14" :value="14"></el-option>
          <el-option label="15" :value="15"></el-option>
          <el-option label="16" :value="16"></el-option>
          <el-option label="17" :value="17"></el-option>
          <el-option label="18" :value="18"></el-option>
        </el-select>
        <el-select v-model="activeObj.font.style">
          <el-option label="常规字体" :value="1"></el-option>
          <el-option label="加粗字体" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="背景"
        class="font"
        v-if="
          relateObj.compName !== 'TreeMain' && activeObj.labelShowStyle !== 2
        "
      >
        <el-select v-model="activeObj.labelBg.style" class="m-r-8">
          <el-option label="无" :value="0"></el-option>
          <el-option label="圆角" :value="1"></el-option>
          <el-option label="椭圆" :value="2"></el-option>
        </el-select>
        <apiot-color-picker
          initColor="#ffffff"
          v-model="activeObj.labelBg.color"
          v-show="activeObj.labelBg.style !== 0 && !activeObj.enableDict"
        >
        </apiot-color-picker>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <p class="switchBox">
          是否启用图标
          <el-switch
            v-model="activeObj.enableIcon"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="图标" class="font" v-if="activeObj.enableIcon">
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected"
          :item="curItem"
          :iconType="2"
          class="m-r-10"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个辨识度高的图标</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import IconSelect from '../../../../../../components/IconSelect';
import SelectFormula from './SelectFormulaStr';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      curItem: {
        icon: '',
        color: '',
        imageUrl: ''
      }
    };
  },

  components: {
    IconSelect,
    SelectFormula
  },

  computed: {},

  created() {
    this.initIcon();
  },

  methods: {
    // 初始化图标
    initIcon() {
      if (this.activeObj.icon) {
        this.curItem.icon = this.activeObj.icon.icon;
        this.curItem.color = this.activeObj.icon.color;
        this.curItem.imageUrl = this.activeObj.icon.imageUrl;
      }
    },
    // 选择图标
    iconSelected(obj) {
      this.activeObj.icon.icon = obj.icon;
      this.activeObj.icon.color = obj.color;
      this.activeObj.icon.imageUrl = obj.imageUrl;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.font {
  ::v-deep {
    .el-form-item__content {
      display: flex;
      .el-color-picker__trigger {
        width: 32px;
        height: 32px;
      }
    }
  }
  .iconSelect__tip {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #aaaaaa;
  }
}
.defaultValue {
  &__type {
    margin-bottom: 10px;
  }
}
</style>
