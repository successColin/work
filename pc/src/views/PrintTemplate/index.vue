<!--
 * @Descripttion: 打印模板
 * @Author: ytx
 * @Date: 2021-09-03 11:15:21
 * @Last Modified by: ytx
 * @Last Modified time: 2021-09-03 11:15:21
-->
<template>
  <!-- 打印模板 -->
  <section class="printTemplate">
    <!-- 头部 -->
    <header class="printTemplate__header">
      <apiot-button class="printTemplate__return" @click="handleBack">
        <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
      </apiot-button>
      <div class="printTemplate__header--operation">
        <apiot-button @click="handlePreview"> 预览 </apiot-button>
        <apiot-button type="primary" @click="handleSave"> 保存 </apiot-button>
      </div>
    </header>
    <!-- 打印内容 -->
    <section class="printTemplate__wrapper" ref="printTemplateWrapper">
      <!-- 左侧 -->
      <config-sidebar
        :configData="configData"
        :isMove.sync="isMove"
        :dropObj.sync="dropObj"
        class="printTemplate__wrapper--left"
      ></config-sidebar>
      <!-- 中间 -->
      <edit-excel
        :ruleForm="ruleForm"
        ref="myPrint"
        :dropObj="dropObj"
        :isMove="isMove"
        :isFill="isFill"
        :excelArr.sync="excelArr"
        :excelImg.sync="excelImg"
        :globalConfig.sync="globalConfig"
        :excelPosition.sync="excelPosition"
        :fillExcelArr.sync="fillExcelArr"
        :excelSelectedObj.sync="excelSelectedObj"
        :imgArr.sync="imgArr"
        :previewObj.sync="previewObj"
        :areaHeight.sync="areaHeight"
        :areaWidth.sync="areaWidth"
        class="printTemplate__wrapper--center"
      ></edit-excel>
      <!-- 右边 -->
      <div class="printTemplate__wrapper--right">
        <config-params
          ref="configParams"
          :globalConfig.sync="globalConfig"
          :showGlobal="showGlobal"
          :excelPosition="excelPosition"
          :copyDropObj="copyDropObj"
          :excelSelectedObj.sync="excelSelectedObj"
        ></config-params>
        <apiot-button
          class="printTemplate__wrapper--globalBtn"
          @click="showGlobal = !showGlobal"
        >
          <i class="iconfont icon-shezhi m-r-4"></i
          >{{ showGlobal ? '组件配置' : '全局配置' }}
        </apiot-button>
      </div>
    </section>

    <!-- 拖拽内容 -->
    <div
      :style="`position: absolute; left: ${dragX}px; top: ${dragY}px; z-index: 999`"
      v-if="isMove"
    >
      <section class="printTemplate__drop">
        {{ dropObj.name }}
      </section>
    </div>

    <!-- 预览 -->
    <apiot-tabs
      class="printTemplate__tabs"
      :showTabs.sync="showTabs"
      :tabsArr="tabsArr"
      value="ContentPreview"
      icon="icon-guanbi"
    >
      <template slot="ContentPreview">
        <content-preview
          :previewObj="previewObj"
          :areaHeight="areaHeight"
          :areaWidth="areaWidth"
          :globalConfig="globalConfig"
        ></content-preview>
      </template>
    </apiot-tabs>
  </section>
</template>

<script>
import { getSysDesignMenu } from '@/api/menuConfig';
import { insertSysPrintTemplate, editSysPrintTemplate } from '@/api/printTemplate';
import { postUploadHelp } from '@/api/helpCenter';
import ConfigSidebar from './components/ConfigSidebar';
import EditExcel from './components/EditExcel';
import ConfigParams from './components/ConfigParams';
import ContentPreview from './components/ContentPreview';

export default {
  data() {
    return {
      // ----------------------------
      // 需要存 json
      excelArr: [],
      globalConfig: {},
      excelImg: {},
      imgArr: [],
      areaWidth: '176mm',
      areaHeight: '257mm',

      excelPosition: '', // 选中位置
      copyDropObj: {},
      fillExcelArr: [], // 拖入的值

      excelSelectedObj: {}, // excel 选中对象
      // ---------------------

      configData: [], // 左侧数据值
      rules: {},
      // 配置表单
      ruleForm: {
        paperSize: 'A4',
        paperSizeWidth: '210',
        paperSizeHeight: '297'
      },
      // 纸张大小是否自定义
      isPaperSizeCustom: true,
      drag: {
        dragX: 0,
        dragY: 0
      },
      isMove: false,
      dropObj: {},
      isFill: false,
      showGlobal: true,
      detailId: '',
      showTabs: false,
      previewObj: {}
    };
  },

  components: {
    ConfigSidebar,
    EditExcel,
    ConfigParams,
    ContentPreview
  },

  watch: {},

  computed: {
    dragX() {
      return this.drag.dragX - 10;
    },
    dragY() {
      return this.drag.dragY - 10;
    },
    menuId() {
      return this.$route.query.id;
    },
    menuName() {
      return this.$route.query.menuName;
    },
    // tabs标题
    tabsArr() {
      // console.log(this.globalConfig);
      return [
        {
          label: `${this.globalConfig.name || ''}打印模板`,
          compName: 'ContentPreview',
          key: 'ContentPreview'
        }
      ];
    }
  },

  mounted() {
    this.$store.dispatch('getCurrentDict', 'DICT-00128,DICT-00131');
    this.getSysDesignMenu();
    document.addEventListener(
      'mousemove',
      (e) => {
        e = e || window.event;
        this.drag.dragX = e.pageX;
        this.drag.dragY = e.pageY;
        if (e.pageX > 290) {
          this.isFill = true;
        } else {
          this.isFill = false;
        }
      },
      true
    );
    document.addEventListener(
      'mouseup',
      () => {
        setTimeout(() => {
          if (this.isMove) {
            this.$refs.myPrint.getPosition();
            this.showGlobal = false;
            this.copyDropObj = JSON.parse(JSON.stringify(this.dropObj));
            this.dropObj = {};
          }
          this.isMove = false;
        }, 100);
      },
      true
    );
  },

  methods: {
    base64toFile(dataurl, filename = 'file') {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const suffix = mime.split('/')[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      // eslint-disable-next-line no-plusplus
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },
    // 回退
    handleBack() {
      this.$router.replace(
        `/menuConfig/${this.$route.params.id}?menuName=${this.menuName}&id=${this.menuId}&compName=ParamsConfig`
      );
    },
    // 预览
    handlePreview() {
      this.$refs.configParams.giveRuleForm();
      this.$refs.myPrint.excelPreview();
      this.showTabs = true;
    },

    uploadImg() {
      return new Promise((resolve) => {
        // console.log(this.excelImg);
        const len = Object.keys(this.excelImg).length;
        let num = 0;
        this.imgArr = [];
        if (!len) {
          resolve(this.imgArr);
        }
        Object.keys(this.excelImg).forEach(async (key) => {
          if (key.indexOf('img_') !== -1) {
            const { src } = this.excelImg[key];
            const formData = new FormData();
            const file = this.base64toFile(src, key);
            formData.append('file', file);
            const res = await postUploadHelp(formData);
            this.imgArr.push({
              ...this.excelImg[key],
              src: res
            });
            num += 1;
          } else {
            this.imgArr.push({
              ...this.excelImg[key]
            });
            num += 1;
          }
          if (len === num) {
            resolve(this.imgArr);
          }
        });
      });
    },
    // 保存
    async handleSave() {
      // console.log('保存');
      this.$refs.myPrint.changeExcelObj();
      this.$refs.configParams.giveRuleForm();
      const { name, type } = this.globalConfig;
      if (!name) {
        this.$message({
          type: 'error',
          message: '请填写模板名称'
        });
        return;
      }
      if (this.excelImg) {
        await this.uploadImg();
      }
      const designJson = {
        globalConfig: this.globalConfig,
        excelArr: this.excelArr,
        imgArr: this.imgArr
      };
      // 新增
      if (this.detailId) {
        // console.log('修改');
        const params = {
          id: this.detailId,
          name,
          designJson: JSON.stringify(designJson),
          typeId: type
        };
        await editSysPrintTemplate(params);
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
      } else {
        const params = {
          templateName: name,
          menuId: this.menuId,
          designJson: JSON.stringify(designJson),
          typeId: type
        };
        const res = await insertSysPrintTemplate(params);
        this.detailId = res.id;
        this.$message({
          type: 'success',
          message: this.$t('common.newSuccess')
        });
      }
    },
    // 获取配置值
    async getSysDesignMenu() {
      this.detailId = this.$route.query.detailId;
      // 获取树的数据
      // console.log(this.menuId);
      const data = await getSysDesignMenu({ sysMenuDesignId: this.menuId });
      this.configData = data &&
        data.designOverallLayout && [JSON.parse(JSON.stringify(data.designOverallLayout[0]))];
    }
  }
};
</script>

<style lang='scss' scoped>
.printTemplate {
  height: 100%;
  background: #f6f6f8;
  overflow: hidden;
  &__header {
    position: relative;
    height: 46px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    z-index: 1;
    &--operation {
      margin-right: 20px;
    }
  }
  &__return {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 1px 0 0;
    border-color: #ebebeb;
    border-radius: 0;
    color: #333333;
    font-size: 16px;
    i {
      font-size: 20px;
      margin-right: 8px;
      color: #9b9b9b;
    }
    &:hover,
    &:active,
    &:focus {
      border-color: #ebebeb !important;
      background-color: #fff !important;
      i {
        color: $--color-primary;
      }
    }
  }
  &__wrapper {
    height: calc(100% - 46px);
    display: flex;
    &--left {
      height: 100%;
      flex: 0 0 280px;
    }
    &--center {
      position: relative;
      box-sizing: border-box;
      padding: 10px 10px 0;
      // background-color: #f6f6f8;
      height: 100%;
      flex: 1;
      overflow: hidden;
    }
    &--right {
      position: relative;
      height: 100%;
      flex: 0 0 280px;
      max-width: 280px;
    }
    &--globalBtn {
      position: absolute;
      top: 8px;
      right: -1px;
      width: 104px;
      height: 30px;
      line-height: 30px;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
      border-radius: 100px 0px 0px 100px;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
  &__drop {
    outline: 1px dashed #107fff;
    padding: 5px 10px;
    cursor: move;
  }
  &__tabs {
    ::v-deep {
      .tabs__return {
        left: auto;
        right: 0;
        border-width: 0 0 0 1px;
      }
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__content {
        margin-right: 0;
      }
      .el-tabs__item.is-active {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .el-tabs__nav-scroll {
        height: 46px;
      }
      .el-tabs__nav {
        position: absolute;
        top: 0;
        left: 20px;
      }
      .el-tabs__item.is-active {
        font-size: 16px;
        color: #333333 !important;
      }
    }
  }
  ::v-deep {
    .tabs {
      z-index: 999;
    }
    .el-tabs__content {
      background-color: transparent;
    }
  }
}
</style>
