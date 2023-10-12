/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <apiot-input
          :maxlength="16"
          :value="getComponentInfo.name"
          @input="(value) => changeTitle(value, 'name')"/>
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
          :value="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(value, 'zIndex')"
      />
    </div>
    <div class="propsSetting">
      <p class="setTitle">属性设置</p>
      <div>
        <el-checkbox v-model="getComponentInfo.stylesObj.controls">是否显示操作栏</el-checkbox>
        <el-checkbox v-model="getComponentInfo.stylesObj.autoplay">是否自动播放</el-checkbox>
        <el-checkbox v-model="getComponentInfo.stylesObj.loop">是否循环播放</el-checkbox>
        <el-checkbox v-model="getComponentInfo.stylesObj.playbackRates">是否显示倍速</el-checkbox>
        <el-checkbox v-model="getComponentInfo.stylesObj.isfullScreen">是否显示全屏按钮</el-checkbox>
      </div>
    </div>
    <div class="propsSetting" style="margin-bottom: 30px;">
      <p class="setTitle">上传视频</p>
      <div class="wrap">
        <el-upload
            class="upload-demo"
            :multiple="false"
            :limit="1"
            :on-remove="doRemove"
            :before-upload="beforeAvatarUpload1"
            :on-success="uploadSuccess"
            :action="getUploadUrl"
            :headers="getUploadHeader"
            :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只限.ogv,.mp4,.3gp, avi视频</div>
        </el-upload>
      </div>
    </div>
    <div class="propsSetting" style="margin-bottom: 30px;">
      <p class="setTitle">上传海报</p>
      <div class="wrap">
        <c-upload
            :before-upload="beforeAvatarUpload"
            @changeScreenBg="(url) => changeScreenBgUrl(url, 'poster')"
            accept=".png,.jpg,.jpeg"
            :url="getComponentInfo.stylesObj.poster"
        >
          <template v-slot:tip>
            <div class="el-upload__tip">只能上传png,jpg,jpeg图片，且不超过100kb</div>
          </template>
        </c-upload>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">变量参数设置</p>
      <div>
        <c-select
            :options="supportOptions"
            v-model="getComponentInfo.stylesObj.supportParameters"
        ></c-select>
      </div>
    </div>
  </div>
</template>

<script>
import { PREFIX, VERSION } from '@/config';
import { Decrypt } from '_u/utils';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import CUpload from '../../basicWidgets/CUpload/index';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
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
      fileList: [],
      supportOptions: [
        {
          label: '无',
          value: 3
        },
        {
          label: '路径参数',
          value: 1
        }, {
          label: '变量参数',
          value: 2
        }]
    };
  },

  components: {
    LocationProperties,
    CUpload
  },

  computed: {
    getUploadUrl() {
      return `${PREFIX}/${VERSION}/system/helpCenterEdit/uploadHelp`;
    },
    getUploadHeader() {
      return {
        token: Decrypt(localStorage.getItem('token') || '')
      };
    },
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
    this.init();
  },
  methods: {
    init() {
      const {
        stylesObj: {
          urlName,
          url
        }
      } = this.getComponentInfo;
      console.log(this.getComponentInfo);
      if (!urlName && !url) {
        this.fileList = [];
      } else {
        this.fileList = [{
          url,
          name: urlName
        }];
      }
    },
    changeScreenBgUrl(url, key) { // 修改背景图片
      this.changeStyles(url, key);
    },
    uploadSuccess(response, file) {
      const { data, code } = response;
      if (code === '00000') {
        const { name } = file;
        this.changeStyles(data, 'url');
        setTimeout(() => {
          this.changeStyles(name, 'urlName');
        }, 0);
        setTimeout(() => {
          this.init();
        }, 0);
      }
    },
    doRemove(file, fileList) {
      if (!fileList.length) {
        this.changeStyles('', 'url');
        setTimeout(() => {
          this.changeStyles('', 'urlName');
        }, 0);
        setTimeout(() => {
          this.init();
        }, 0);
      }
    },
    beforeAvatarUpload1(file) {
      const { name } = file;
      const arr = name.split('.');
      const n = arr.length;
      const type = arr[n - 1];
      const isJPG = ['mp4', '3gp', 'avi', 'ogv'].includes(type);
      const isLt2M = file.size / 1024 / 1024 < 300;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('只限.ogv,.mp4,.3gp, avi格式视频!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传视频大小不能超过300MB!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type);
      const isLt2M = file.size / 1024 < 100;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过100kb!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
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
    },
    changeStyles(value, key) { // 样式修改
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
    }
  },
  name: 'ImageConfig'
};
</script>

<style lang='scss' scoped>
@import '../commonProperty';

.bgContentWrap {
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;

  .upload-demo{
    width: 100%;
  }
  ::v-deep {
    .el-checkbox__label {
      padding-left: 6px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 24px;
      color: #333333;
    }

    .el-collapse {
      border: none;
    }

    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background-color: #131E45;
      color: #ffffff;
      border-bottom: none;

      &:hover {
        color: $component-borderFocus-color;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0;
      background-color: #131E45;

      & .propsSetting:last-child {
        margin-bottom: 10px;
      }
    }

    .el-collapse-item__wrap {
      background-color: #131E45;
      border: none;
    }
  }
}
</style>
