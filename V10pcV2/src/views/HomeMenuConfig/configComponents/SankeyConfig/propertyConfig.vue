/**
* @name: 桑葚图
* @author: DELL
* @date: 2022/10/10 15:20
* @description：桑葚图
* @update: 2022/10/10 15:20
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <apiot-input
          :maxlength="16"
          :value="getComponentInfo.name"
          @input="(value) => changeTitle(value, 'name')"
      />
    </div>
    <location-properties
        :widthValue="getComponentInfo.width"
        :heightValue="getComponentInfo.height"
        :leftValue="getComponentInfo.left"
        :topValue="getComponentInfo.top"
        @changeTitle="({value, key}) => changeTitle(value, key)"
    ></location-properties>
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <el-input-number
          controls-position="right"
          v-model="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"
      />
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1" title="图形属性">
        <div>
          <div class="propsSetting">
            <p class="setTitle">背景颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.backgroundColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'backgroundColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <span class="setTitle">左边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'left')"
                v-model="getComponentInfo.stylesObj.left"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">上边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'top')"
                v-model="getComponentInfo.stylesObj.top"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">右边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'right')"
                v-model="getComponentInfo.stylesObj.right"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">下边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'bottom')"
                v-model="getComponentInfo.stylesObj.bottom"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">宽度(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'width')"
                v-model="getComponentInfo.stylesObj.width"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">高度(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'height')"
                v-model="getComponentInfo.stylesObj.height"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">矩形节点宽度</span>
            <c-slider
                @change="(value) => changeStyles(value, 'nodeWidth')"
                v-model="getComponentInfo.stylesObj.nodeWidth"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">矩形节点间距</span>
            <c-slider
                @change="(value) => changeStyles(value, 'nodeGap')"
                v-model="getComponentInfo.stylesObj.nodeGap"
                :min="0"
                :max="100"
            ></c-slider>
          </div>

          <div class="propsSetting" style="margin-top: 10px;">
            <p class="setTitle">对齐方式</p>
            <div>
              <c-select
                  :options="showOptions"
                  :value="getComponentInfo.stylesObj.nodeAlign"
                  @change="(value) => changeStyles(value, 'nodeAlign')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" style="margin-top: 10px;">
            <p class="setTitle">布局方向</p>
            <div>
              <c-select
                  :options="orientOptions"
                  :value="getComponentInfo.stylesObj.orient"
                  @change="(value) => changeStyles(value, 'orient')"
              ></c-select>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
            <span class="setTitle">是否允许拖动</span>
            <el-switch
                :value="getComponentInfo.stylesObj.draggable"
                @change="(value) => changeStyles(value, 'draggable')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">层级配置</div>
          </div>
        </template>
        <div>
          <LevelConfig
              :value="getComponentInfo.levels"
              @change="(value) => changeTitle(value, 'levels')"/>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">颜色配置</div>
          </div>
        </template>
        <div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义颜色</span>
            <data-color
                :single="true"
                :value="getComponentInfo.stylesObj.colorArr"
                @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import LevelConfig from './levelConfig';
import { predefineColors } from '../../constants/global';
import DataColor from '../../basicWidgets/DataColor';
// import LocationProperties from '../../basicWidgets/CLocationProperties/index';
// import CUpload from '../../basicWidgets/CUpload/index';

export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
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
      enable: true,
      showOptions: [
        {
          label: '节点双端对齐',
          value: 'justify'
        }, {
          label: '节点左对齐',
          value: 'left'
        }, {
          label: '节点右对齐',
          value: 'right'
        }
      ],
      orientOptions: [
        {
          label: '水平',
          value: 'horizontal'
        }, {
          label: '垂直',
          value: 'vertical'
        }
      ],
      activeName: '',
      color1: '#ffffff',
      color2: '#ffffff',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors,
      options: [{
        label: '左对齐',
        value: 'left',
        icon: 'icon-zuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'icon-youduiqi'
      }]
    };
  },

  components: {
    LevelConfig,
    DataColor
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
      return Obj;
    },
    getList() {
      return this.list;
    }
  },

  mounted() {
  },
  watch: {
    // getComponentInfo: {
    //   deep: true,
    //   handler(val, oldVal) { // 普通的watch监听
    //     console.log("a: " + val, oldVal);
    //   },
    // }
  },
  methods: {
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) {
        value = '';
      }
      if (['color1', 'color2'].includes(key) && !value) {
        value = '#fff';
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    reduceIndex() {
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return -1;
      }
      const index = this.getList.findIndex((item) => item.componentId === componentId);
      return index;
    },
    changeTitle(value, key) { // 设置组件名称
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    }
  },
  name: 'SingleLineTextConfig'
};
</script>

<style lang='scss' scoped>
@import '../commonProperty';
.bgContentWrap {
  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;

    ::v-deep {
      .el-slider {
        width: 200px;
        margin: 0 auto;
      }
    }
  }

}
</style>
