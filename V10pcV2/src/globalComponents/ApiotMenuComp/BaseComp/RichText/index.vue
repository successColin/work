<template>
  <div
    class="RichText"
    :id="configData.compId"
    :style="getWidth"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      :class="[{ 'is-required': isConfig && configData.shouldRequired }]"
    >
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>

      <apiot-input
        v-show="isConfig"
        v-model="parent.form[configData.compId]"
        :placeholder="configData.placeholder"
        :disabled="configData.canReadonly"
        :readonly="configData.singleStatus === 3"
      ></apiot-input>
      <div class="rich" v-if="!isConfig">
        <apiot-wangeditor
          class="editor"
          ref="submit"
          v-if="showEdit"
          v-model="parent.form[configData.compId]"
          :extraToolbarConfig="toolbarConfig"
          :extraEditorConfig="editorConfig"
          :editorStyle="getStyle"
        >
        </apiot-wangeditor>
        <div class="richMask" v-if="configData.singleStatus === 2"></div>
      </div>
    </el-form-item>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import { batchUpload } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      curHeight: 200,
      showEdit: true,
      editor: null,
      html: '',
      toolbarConfig: { excludeKeys: [] },
      editorConfig: { placeholder: this.configData.placeholder },
      mode: 'default' // or 'simple'
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    getWidth() {
      let style = '';
      // if (this.isConfig) {
      //   return 'width:100%;';
      // }
      if (this.configData.sizeType === 1) {
        style += 'width:100%;';
      }
      if (this.configData.sizeType === 2) {
        if (this.configData.width) {
          style += `width:${this.configData.width};`;
        }
      }
      if (this.configData.sizeType === 3) {
        style += `width:${this.configData.widthPix}px;maxWidth: 100%;`;
      }
      return style;
    },
    getStyle() {
      let style = '';
      // if (this.isConfig) {
      //   return 'width:100%;';
      // }
      if (this.configData.sizeType === 1) {
        style += `height:${this.curHeight - 30}px;`;
      }
      if (this.configData.sizeType === 2) {
        if (this.configData.heightMul) {
          style += `height:${this.configData.heightMul * 82}px;`;
        }
      }
      if (this.configData.sizeType === 3) {
        style += `height:${this.configData.heightPix}px;`;
      }
      return style;
    }
  },
  created() {
    if (!this.isConfig) {
      this.initConfig();
    }
  },
  mounted() {
    if (!this.isConfig) {
      this.setTabMianHeight();
    }
  },

  methods: {
    setTabMianHeight() {
      let parent = this.$parent;
      while (!parent.specialParent) {
        parent = parent.$parent;
      }

      this.$nextTick(() => {
        const id = parent.getCurTab;
        if (id && document.getElementById(id)) {
          const height = document.getElementById(id).offsetHeight;
          this.curHeight = height - 20;
        }
      });
    },
    initConfig() {
      this.toolbarConfig.excludeKeys = [];
      //       enableEmoji: true
      // enableGird: true
      // enableImg: true
      // enableLink: true
      // enableVedio: true
      if (!this.configData.enableImg) {
        this.toolbarConfig.excludeKeys.push('uploadImage');
      }
      if (!this.configData.enableVedio) {
        this.toolbarConfig.excludeKeys.push('uploadVideo');
      }
      if (!this.configData.enableGird) {
        this.toolbarConfig.excludeKeys.push('insertTable');
      }
      if (!this.configData.enableLink) {
        this.toolbarConfig.excludeKeys.push('insertLink');
      }

      this.editorConfig = {
        placeholder: this.configData.placeholder,
        // readOnly: this.configData.singleStatus === 2,
        MENU_CONF: {
          uploadImage: {
            // 自定义上传图片
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append('files', file);
              formData.append('menuId', this.$route.params.id || this.$route.query.menuId);
              const res = await batchUpload(formData);
              res.forEach(async (item) => {
                const url = `/api/v1/system/waterMark/addWaterMark?url=${item.url}`;
                insertFn(this.$parseImgUrl(url), item.name, this.$parseImgUrl(url));
              });
            }
          },
          uploadVideo: {
            // 自定义上传视屏
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append('files', file);
              formData.append('menuId', this.$route.params.id || this.$route.query.menuId);
              const res = await batchUpload(formData);
              res.forEach((item) => {
                insertFn(this.$parseImgUrl(item.url), item.name, this.$parseImgUrl(item.url));
              });
            }
          }
        }
      };
    },
    setRichValue() {
      this.$refs.submit.clearContent();
      this.showEdit = false;
      this.$nextTick(() => {
        this.showEdit = true;
        if (this.$refs.submit) {
          this.$refs.submit.setValue(this.parent.form[this.configData.compId]);
        }
      });
      if (this.configData.singleStatus === 2) {
        setTimeout(() => {
          if (this.$refs.submit) {
            this.$refs.submit.editor.blur();
          }
        }, 100);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.RichText {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 20px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-form-item {
      height: 100%;
      margin-bottom: 0;
      .el-form-item__content {
        height: calc(100% - 24px);
      }
      .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
    }
  }
  .rich {
    height: 100%;
    position: relative;
    .richMask {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgb(245, 247, 250, 0.5);
    }
    .editor {
      // height: 100%;
    }
    &__content {
      height: calc(100% - 81px);
      box-sizing: border-box;
      overflow-y: hidden;
      ::v-deep {
        .w-e-text-placeholder {
          top: 0px;
        }
      }
    }
  }
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    p:nth-child(2) {
      color: #333;
      border-top: 1px solid #e9e9e9;
    }
  }
}
</style>
