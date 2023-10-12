/**
* @name: SingleLineTextConfig
* @author: DELL
* @date: 2021/8/21 15:20
* @description：SingleLineTextConfig
* @update: 2021/8/21 15:20
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap" :class="{ mb: crumbsArr.length>1 }" :key="activeComponent.componentId">
    <div class="headerTitle" v-if="crumbsArr.length>1">热区底图及绘制热区</div>
    <div class="propsSetting" v-if="crumbsArr.length<2">
      <p class="setTitle">组件名称</p>

      <apiot-input
          :maxlength="16"
          :value="getComponentInfo.name"
          @input="(value) => changeTitle(value, 'name')"/>
    </div>
    <location-properties
        v-if="crumbsArr.length<2"
        :widthValue="getComponentInfo.width"
        :heightValue="getComponentInfo.height"
        :leftValue="getComponentInfo.left"
        :topValue="getComponentInfo.top"
        @changeTitle="({value, key}) => changeTitle(value, key)"
    ></location-properties>
    <div class="propsSetting" v-if="crumbsArr.length<2">
      <p class="setTitle">图层</p>
      <el-input-number
          controls-position="right"
          v-model="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <div class="ellipsisWrap flex propsSetting" v-if="crumbsArr.length<2">
      <span class="setTitle">固定组件</span>
      <el-switch
          :value="getComponentInfo.isFixed"
          @change="(value) => changeTitle(value, 'isFixed')"
          active-color="#4689F5"
          inactive-color="#DCDFE6">
      </el-switch>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="2" title="底图设置">
        <div>
          <div class="propsSetting" style="margin-bottom: 30px;">
            <p class="setTitle">上传图片</p>
            <div class="wrap">
              <c-upload
                  ref="cUpload"
                  :before-upload="beforeAvatarUpload"
                  @changeScreenBg="changeScreenBgUrl"
                  accept=".png,.jpg,.jpeg"
                  :url="getBackgroundImage"
              >
                <template v-slot:tip>
                  <div class="el-upload__tip">只能上传png,jpg,jpeg图片，且不超过10MB</div>
                </template>
              </c-upload>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="热区绘制" name="1">
        <div>
          <div class="propsSetting">
            <p class="setTitle">绘制对象</p>
            <div>
              <div
                  class="drawBox"
                  v-for="item in drawList"
                  :key="item.name"
                  @click="(e)=>changeDrawType(item.type, e)"
                  :class="{active: drawType===item.type}"
              >
                <div><img :src="item.url" :alt="item.name"></div>
                <div v-if="item.type!==6" class="drawName"> {{ item.name }}</div>
                <div v-if="item.type===6" class="drawName">
                  <el-upload
                      style="width: 100%;"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      accept=".png,.jpg,.jpeg,.svg"
                      action=""
                      :multiple="false"
                      :http-request="doUpload"
                  >
                    <div>{{ item.name }}</div>
                  </el-upload>
                </div>
                <div class="drawing">绘制中</div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="热区属性批量配置" name="5">
        <div>
          <div class="propsSetting">
            <p class="setTitle">热区选择</p>
            <div class="selectWrap">
              <c-select
                  @focus="doFocus"
                  :options="hotArrOptions"
                  multiple
                  filterable
                  collapse-tags
                  v-model="selectedHot"
              ></c-select>
              <el-checkbox
                  class="selectAll"
                  v-model="checked"
                  @change="chooseHotAll"
              >
                全选
              </el-checkbox>
            </div>
          </div>
          <div class="batchBtn">
            <apiot-button type="primary" style="width: 100%;" @click="doBatch">批量配置</apiot-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="其他配置" name="3">
        <div>
<!--          <div class="propsSetting" v-if="crumbsArr.length===1">-->
<!--            <apiot-radio-->
<!--                :value="getType"-->
<!--                :label="2"-->
<!--                @change="() => changeStyles(2, 'type')"-->
<!--            >是否允许热区下钻-->
<!--            </apiot-radio>-->
<!--          </div>-->
<!--          <div class="propsSetting" v-if="crumbsArr.length === 1">-->
<!--            <apiot-radio-->
<!--                :value="getType"-->
<!--                :label="1"-->
<!--                @change="() => changeStyles(1, 'type')"-->
<!--            >是否允许url跳转-->
<!--            </apiot-radio>-->
<!--          </div>-->
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否自动更新</span>
            <el-switch
                :value="getEnableAutoUpdate"
                @change="(value) => changeTitle(value, 'enableAutoUpdate')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getEnableAutoUpdate"  >
            <p class="setTitle">间隔时间(秒)</p>
            <el-input-number
                controls-position="right"
                :min="0"
                :value="getUpdateTime"
                placeholder="自动更新间隔时长"
                @change="(value) =>  changeStyles(value, 'updateTime')"
            >
            </el-input-number>
          </div>
          <div class="propsSetting" v-if="crumbsArr.length<2">
            <p class="setTitle">路径颜色</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.pathColor"
                show-alpha
                @change="(value) => changeStyles(value, 'pathColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" v-if="crumbsArr.length<2">
        <template slot="title">
          初始化交互
          <el-tooltip class="item" effect="dark" content="点击路径全部时触发的交互" placement="top">
            <i class="icon-bangzhu iconfont"></i>
          </el-tooltip>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">关联更新图表</p>
            <div>
              <c-select
                  multiple
                  collapse-tags
                  filterable
                  :options="allComponentOptions"
                  @change="changeStyles($event, 'associatedControls')"
                  v-model="getComponentInfo.stylesObj.associatedControls"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">数据源变量</p>
            <div>
              <apiot-input
                  :value="getComponentInfo.stylesObj.dataSourceVar"
                  @input="changeStyles($event, 'dataSourceVar')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">数据源明细值</p>
            <div>
              <apiot-input
                  :value="getComponentInfo.stylesObj.dataSourceValue"
                  @input="changeStyles($event, 'dataSourceValue')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">数据明细变量</p>
            <div>
              <apiot-input
                  :value="getComponentInfo.stylesObj.dataDetailVar"
                  @input="changeStyles($event, 'dataDetailVar')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">数据明细值</p>
            <div>
              <apiot-input
                  :value="getComponentInfo.stylesObj.dataDetailValue"
                  @input="changeStyles($event, 'dataDetailValue')"/>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="areaDrawingWrap">
      <AreaDrawingConfig
          :crumbsArr="crumbsArr"
          :activeComponent="activeComponent"
          :fabricCanvas="fabricCanvas"
          @changeCanvas="changeCanvas"
          @enterSubHotZone="enterSubHotZone"
          @batchModify="doBatchModify"
          :list="list"
      />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import Bus from '@/utils/bus';
import { batch, editHotInfo, getZoomByPage } from '@/api/design';
import { postUploadHelp } from '@/api/helpCenter';
import { predefineColors } from '../../constants/global';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import CUpload from '../../basicWidgets/CUpload/index';

const AreaDrawingConfig = () => import('./AreaDrawingConfig/index');

export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      subHotZone: {}, // 子热区数据详情
      crumbsArr: [], // 面包屑
      predefineColors,
      activeName: 2,
      radio: '1', // 其他配置
      drawType: null, // 绘制对象
      enableAutoUpdate: false,
      updateTime: 15,
      drawList: [
        { name: '矩形', url: require('@/assets/img/rectangle.svg'), type: 1 },
        { name: '圆形', url: require('@/assets/img/cirlcle.svg'), type: 2 },
        { name: '三角形', url: require('@/assets/img/triangle1.svg'), type: 3 },
        { name: '椭圆形', url: require('@/assets/img/ellipse.svg'), type: 4 },
        { name: '自定义形状', url: require('@/assets/img/custom.svg'), type: 5 },
        { name: '图片热区', url: require('@/assets/img/images.svg'), type: 6 }
      ],
      fabricCanvas: null,
      hotList: [], // 热区列表
      selectedHot: [], // 选中的热区
      checked: false, // 是否全选
      timer: null
    };
  },

  components: {
    CUpload,
    AreaDrawingConfig,
    LocationProperties
  },
  mounted() {
    /**
     * todo 可以用vuex进行数据管理，写完才想起来
     */
    console.log('属性mounted');
    const { componentId } = this.activeComponent;
    Bus.$off(`${componentId}_fabric`).$on(`${componentId}_fabric`, (fabric) => {
      console.log('接受', fabric);
      this.fabricCanvas = fabric;
    });
    Bus.$off(`${componentId}_polygon_end`).$on(`${componentId}_polygon_end`, (message) => {
      this.drawType = message;
    });
    Bus.$off(`${componentId}_crumbsArrChange_href`).$on(`${componentId}_crumbsArrChange_href`, (message) => { // 维护面包屑数据
      this.crumbsArr = message;
    });
    Bus.$off(`${componentId}_polygon_end`).$on(`${componentId}_polygon_end`, (message) => {
      this.drawType = message;
    });
    // 监听配置页面传过来的面包屑
    Bus.$off(`${componentId}_crumbsArrChange_by_config`).$on(`${componentId}_crumbsArrChange_by_config`, (message) => {
      this.enterSubHotZoneByConfig(message);
    });
    if (!this.crumbsArr.length) {
      this.crumbsArr.push({
        parentHost: 0,
        name: '全部'
      });
    }
    this.changeHotNumber();
  },
  computed: {
    allComponentOptions() {
      // eslint-disable-next-line max-len
      const list = this.getList.filter((item) => item.componentId !== this.activeComponent.componentId);
      return list.map((item) => ({
        label: item.name,
        value: item.componentId
      }));
    },
    getType() {
      if (this.crumbsArr.length < 2) {
        return this.getComponentInfo.stylesObj.type || 1;
      }
      return this.subHotZone.designJson.dillType || 1;
    },
    getUpdateTime() { // 获取更新时间
      if (this.crumbsArr.length < 2) {
        return this.getComponentInfo.stylesObj.updateTime;
      }
      return this.subHotZone.designJson.updateTime;
    },
    getEnableAutoUpdate() { // 是否开启自动更新
      if (this.crumbsArr.length < 2) {
        return this.getComponentInfo.enableAutoUpdate;
      }
      return this.subHotZone.designJson.enableAutoUpdate;
    },
    hotArrOptions() {
      if (this.fabricCanvas) {
        const arr = [];
        this.fabricCanvas.forEachObject((item) => {
          const current = this.hotList.find((obj) => obj.id === item.id);
          // eslint-disable-next-line no-unused-expressions
          !!current && arr.push({ value: current.id, label: current.name });
        });
        return arr;
      }
      return this.hotList.map(({ id, name }) => ({ value: id, label: name }));
    },
    getBackgroundImage() { // 获取底图
      if (this.crumbsArr.length < 2) {
        return this.getComponentInfo.stylesObj.backgroundImage;
      }
      return this.subHotZone.backgroundImage;
    },
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
      return cloneDeep(Obj);
    },
    getList() {
      return this.list;
    }
  },
  watch: {
    selectedHot: {
      deep: true,
      handler(v) {
        if (v.length === this.hotList.length) {
          this.checked = true;
        } else {
          this.checked = false;
        }
      }
    }
  },
  methods: {
    chooseHotAll(v) { // 是否全选
      if (v && this.hotList.length) {
        this.selectedHot = this.hotList.map((item) => item.id);
      } else {
        this.selectedHot = [];
      }
    },
    doFocus() {
      this.changeHotNumber();
    },
    async doBatchModify(obj) { // 批量修改热区
      const params = {
        ids: this.selectedHot.join(','),
        ...obj
      };
      try {
        await batch(params);
        this.selectedHot = [];
        this.checked = false;
        Bus.$emit(`${this.activeComponent.componentId}_block_event`, { isFlag: false, type: '' });
        this.$message.success('保存成功!');
      } catch (e) {
        console.log(e);
      }
    },
    doBatch() {
      if (!this.selectedHot.length) {
        this.$message.error('请选择热区!');
        return;
      }
      Bus.$emit(`${this.activeComponent.componentId}_block_event`, { isFlag: true, type: 'batch' });
    },
    async changeHotNumber() { // 获取热区列表
      const { id } = this.activeComponent;
      if (!id) {
        return;
      }
      const { parentHost } = this.crumbsArr[this.crumbsArr.length - 1] || {};
      const res = await getZoomByPage({ elementId: id,
        parentHost: parentHost || 0,
        size: 99999,
        current: 1,
      });
      this.hotList = res.records || [];
    },
    enterSubHotZoneByConfig({ crumbsArr, ...rest }) { // 点击面包屑进入热区
      this.$refs.cUpload.clear();
      this.selectedHot = [];
      this.checked = false;
      this.crumbsArr = crumbsArr;
      Bus.$emit(`crumbsArrChange_${this.activeComponent.componentId}`, crumbsArr);
      this.subHotZone = JSON.parse(JSON.stringify(rest));
      Bus.$emit(`subHotZone_${this.activeComponent.componentId}`, { message: rest, isFlag: true });
    },
    enterSubHotZone({ crumbsArr, ...rest }) { // 进入编辑， 通知界面要重新更新
      this.$refs.cUpload.clear();
      this.crumbsArr.push(crumbsArr);
      Bus.$emit(`crumbsArrChange_${this.activeComponent.componentId}`, this.crumbsArr);
      this.subHotZone = JSON.parse(JSON.stringify(rest));
      Bus.$emit(`subHotZone_${this.activeComponent.componentId}`, { message: rest, isFlag: true });
      this.selectedHot = [];
      this.checked = false;
    },
    changeDrawType(type, e) {
      const data = this.fabricCanvas && this.fabricCanvas.toJSON();
      console.log(data);
      if ((data && !data.backgroundImage) || !data) {
        e.stopPropagation();
        e.preventDefault();
        this.$message.error('请设底图!');
        return;
      }
      if (this.drawType === type) {
        this.drawType = null;
      } else {
        this.drawType = type;
      }
      Bus.$emit(`drawType_${this.activeComponent.componentId}`, this.drawType);
      // this.changeStyles(this.drawType, 'drawType');
    },
    modifyInfo(param, n) {
      const { id: elementId } = this.activeComponent;
      const cId = this.crumbsArr[n - 1]; // 获取当前图层id
      const pId = this.crumbsArr[n - 2]; // 父图层

      const params = {
        parentHost: pId.parentHost || 0,
        elementId,
        id: cId.parentHost,
        ...param
      };
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        editHotInfo(params);
      }, 100);
    },
    changeCanvas() { // 更新canvas配置
      const n = this.crumbsArr.length;
      const visualMapJSON = this.fabricCanvas.toJSON(['id']);
      if (n > 1) {
        this.modifyInfo({ configMessage: JSON.stringify(visualMapJSON) }, n);
        return;
      }
      this.changeTitle(JSON.stringify(visualMapJSON), 'designObject');
    },
    changeDillConfig(n, value, key) { // 修改下钻图层的配置信息
      const { designJson } = this.subHotZone;
      const newDesignJson = { ...designJson, [key === 'type' ? 'dillType' : key]: value };
      this.$set(this.subHotZone, 'designJson', newDesignJson);
      this.modifyInfo({ designJson: JSON.stringify(newDesignJson) }, n);
    },
    changeStyles(value, key) { // 样式修改
      const n = this.crumbsArr.length;
      if (n > 1) {
        this.changeDillConfig(n, value, key);
        return;
      }
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
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
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 10;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
    changeScreenBgUrl(url) { // 修改背景图片
      if (this.crumbsArr.length < 2) {
        this.changeStyles(url, 'backgroundImage');
      } else {
        this.$set(this.subHotZone, 'backgroundImage', url);
        Bus.$emit(`subHotZone_${this.activeComponent.componentId}`, { message: this.subHotZone, isFlag: false });
      }
    },
    async doUpload(param) {
      const { file } = param;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await postUploadHelp(formData);
        Bus.$emit(`customPicture_${this.activeComponent.componentId}`, res);
        this.drawType = null;
      } catch (e) {
        console.warn(e);
      }
    },
    changeTitle(value, key) { // 设置组件名称
      const n = this.crumbsArr.length;
      if (n > 1) {
        // 确定是下钻功能
        this.changeDillConfig(n, value, key);
        return;
      }
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
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  position: relative;
  box-sizing: border-box;
  overflow-y: auto;
  &.mb{
    padding-top: 56px;
  }
  .headerTitle {
    height: 46px;
    padding-left: 10px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 46px;
    background: #ffffff;
    box-shadow: inset 0px -1px 0px 0px #e9e9e9;
    box-sizing: border-box;
    position: absolute;
    width: calc(100%);
    left: 0;
    top: 0;
  }
  .bgSettingWrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .switchWrap {
      margin-right: 10px;

      ::v-deep {
        .el-switch__core {
          width: 28px !important;
          height: 14px;
        }

        .el-switch__core:after {
          content: "";
          position: absolute;
          top: 2px;
          left: 4px;
          border-radius: 100%;
          transition: all .3s;
          width: 8px;
          height: 8px;
          background-color: #FFF;
        }

        .el-switch.is-checked .el-switch__core::after {
          left: 100%;
          margin-left: -11px;
        }
      }
    }
  }
  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }

  .propsSetting {
    margin-bottom: 10px;
    .drawBox {
      display: flex;
      position: relative;
      height: 32px;
      margin-top: 6px;
      align-items: center;
      background: #FFFFFF;
      border: 1px dashed #D9D9D9;
      box-sizing: border-box;
      cursor: pointer;

      & > div {
        display: flex;
        align-items: center;
        margin-left: 11px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;;
      }
      .drawName{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      & > div:nth-child(1) {
        width: 20px;
      }

      & > div:nth-child(2) {
        flex: 1;

        & > div {
          ::v-deep {
            .el-upload {
              width: 100%;
              text-align: left;
            }
          }
        }
      }

      .drawing {
        margin-right: 10px;
        display: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }

      &.active {
        background: rgba(70, 137, 245, 0.3);
        border: 1px dashed #4689F5;

        .drawing {
          display: block;
          color: #4689F5;
        }
        .drawName{
          color: #4689F5;
        }
      }

      &:hover {
        background: rgba(70, 137, 245, 0.3);
        border: 1px dashed #4689F5;
      }
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

    .selectWrap {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .selectAll {
        margin-left: 10px;

        ::v-deep {
          .el-checkbox__label {
            color: #333333;
          }
        }
      }
    }

    ::v-deep {
      .el-radio {
        .el-radio__label {
          color: #FFFFFF;
        }

        &.is-checked {
          .el-radio__label {
            color: #4689F5;
          }
        }
      }
    }
  }

}
</style>
