<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">Webview</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题" v-if="false">
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
      <el-form-item label="页面类型">
        <el-radio v-model="activeObj.showType" :label="1">内部页面</el-radio>
        <el-radio v-model="activeObj.showType" :label="2">外部页面</el-radio>
        <el-select
          v-model="activeObj.innerLink"
          placeholder="请选择内部页面"
          v-if="activeObj.showType === 1"
        >
          <el-option
            :label="item.menuName"
            :value="`${item.id}`"
            :key="item.id"
            @click.native="innerChange(item)"
            v-for="item in tableData"
          ></el-option>
        </el-select>
        <el-form-item label="外部页面类型" v-if="activeObj.showType === 2">
          <el-select
            v-model="activeObj.externalType"
            placeholder="请选外部页面类型"
          >
            <el-option label="默认" :value="1"></el-option>
            <el-option label="ureport" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <apiot-input
          v-if="activeObj.showType === 2 && activeObj.externalType === 1"
          v-model="activeObj.outerLink"
          :isForbid="false"
          placeholder="请输入显示地址"
        ></apiot-input
        ><filterable-input
          v-if="activeObj.showType === 2 && activeObj.externalType === 2"
          class="m-t-10"
          ref="filterableInput"
          placeholder="请选择文件名"
          title="选择文件名"
          :showInfo="activeObj.ureportObj"
          :hasPagination="true"
          :dialogType="7"
          @selectRes="selectRes"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="尺寸类型">
        <el-select v-model="activeObj.sizeType" placeholder="请选择尺寸类型">
          <el-option label="全屏" :value="1"></el-option>
          <el-option label="尺寸选择" :value="2"></el-option>
          <el-option label="尺寸输入" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宽度" v-show="activeObj.sizeType === 2">
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
      <el-form-item label="高度" v-show="activeObj.sizeType === 2">
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
      <el-form-item label="宽度" v-show="activeObj.sizeType === 3">
        <el-input-number
          class="number"
          placeholder="请输入宽度"
          v-model="activeObj.widthPix"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        >px
      </el-form-item>
      <el-form-item label="高度" v-show="activeObj.sizeType === 3">
        <el-input-number
          class="number"
          placeholder="请输入高度"
          v-model="activeObj.heightPix"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        >px
      </el-form-item>
      <el-form-item label="">
        <apiot-button class="paramsBtn" @click="addParams">
          <i class="iconfont icon-shezhi m-r-4"></i>传入参数
        </apiot-button>
        <ul class="paramsList">
          <li
            class="paramsList__item"
            v-for="(item, index) in activeObj.paramsArr"
            :key="index"
          >
            <h1 class="paramsList__item--title">
              传参{{ index + 1 }}
              <i class="iconfont icon-shanchu" @click="deleteParams(index)"></i>
            </h1>
            <apiot-input
              v-model="item.name"
              class="paramsList__item--name"
              placeholder="请输入传入参数名称"
            ></apiot-input>
            <div class="paramsList__item--box">
              <el-select
                v-model="item.type"
                placeholder="请选择"
                class="paramsList__item--sel"
              >
                <el-option label="固定值" :value="1"></el-option>
                <el-option label="公式" :value="2"></el-option>
              </el-select>
              <apiot-input
                v-model="item.fixed"
                v-if="item.type === 1"
                class="paramsList__item--fixed"
                placeholder="请输入固定值"
              ></apiot-input>
              <select-formula
                :configData="configData"
                v-if="item.type === 2"
                class="paramsList__item--formula"
                :triggerCompMap="triggerCompMap"
                v-model="item.formula"
              ></select-formula>
            </div>
          </li>
        </ul>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFunctionList } from '@/api/homePage';
import propertyMixin from '../propertyMixin';
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      tableData: []
    };
  },

  components: {
    SelectFormula
  },

  computed: {},

  created() {},

  mounted() {
    this.sysMenuList();
  },

  methods: {
    // 获取数据表值
    selectRes(v) {
      this.activeObj.ureportObj = {
        name: v.name
      };
    },
    // 获取列表
    async sysMenuList() {
      try {
        this.contentLoading = true;
        this.transitionName = 'fadeInUp';
        const data = await getFunctionList({ keywords: this.keywords, clientType: this.$route.query.isApp === '1' ? 2 : 1 });
        this.contentLoading = false;
        data.forEach((item) => {
          const { colour, imageUrl, imageName } = item;
          item.state = 1;
          item.type = 'menu';
          item.icon = {
            icon: imageName,
            imageUrl,
            color: colour
          };
        });
        if (data.length) {
          this.tableData = data;
        }
      } catch (error) {
        this.contentLoading = false;
      }
    },
    addParams() {
      this.activeObj.paramsArr.push({
        name: '',
        type: 1,
        fixed: '',
        formula: ''
      });
    },
    deleteParams(index) {
      this.activeObj.paramsArr.splice(index, 1);
    },
    innerChange(item) {
      console.log(item);
      this.activeObj.innerName = item.menuName;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.paramsBtn {
  width: 100%;
  .iconfont {
    color: $--color-primary;
  }
}
.paramsList {
  &__item {
    &--title {
      position: relative;
      height: 30px;
      line-height: 30px;
      margin-top: 4px;
      font-size: 13px;
      font-weight: 500;
      color: #333333;
      i {
        position: absolute;
        right: 0;
        font-weight: normal;
        cursor: pointer;
        color: #d9d9d9;
        &:hover {
          color: $--color-primary;
        }
      }
    }
    &--name {
      margin-bottom: 8px;
    }
    &--box {
      display: flex;
      align-items: center;
    }
    &--sel {
      width: 100px !important;
      margin-right: 10px;
    }
    &--fixed,
    &--formula {
      flex: 1;
    }
  }
}
.number {
  width: calc(100% - 30px);
  margin-right: 10px;
}
</style>
