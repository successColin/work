<!--
 * @Descripttion: 设置页眉页脚
 * @Author: ytx
 * @Date: 2022-08-26 08:24:30
 * @Last Modified by: ytx
 * @Last Modified time: 2022-08-26 08:24:30
-->
<template>
  <apiot-dialog
    class="ConfigPage"
    v-on="$listeners"
    v-bind="$attrs"
    destroy-on-close
    @sure-click="handleReleaseSubmit"
    @close="handleReset"
  >
    <el-form label-position="top" :model="ruleForm">
      <el-form-item label="页眉" :key="1">
        <apiot-wangeditor
          v-if="show1"
          ref="wangeditor1"
          v-model="ruleForm.pageHeader"
          :extraToolbarConfig="toolbarConfig"
          class="ConfigPage__wangeditor"
        >
        </apiot-wangeditor>
      </el-form-item>
      <el-form-item label="页脚" :key="2">
        <apiot-wangeditor
          v-if="show2"
          ref="wangeditor2"
          v-model="ruleForm.pageFooter"
          :extraToolbarConfig="toolbarConfig"
          class="ConfigPage__wangeditor"
        >
        </apiot-wangeditor>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    ruleForm: {
      type: Object,
      default: () => {}
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      toolbarConfig: {
        toolbarKeys: [
          'fontSize',
          'fontFamily',
          'bold',
          'color',
          'bgColor',
          'italic',
          {
            key: 'group-justify',
            title: '对齐',
            iconSvg: `
            <svg viewBox="0 0 1024 1024">
              <path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z">
              </path>
            </svg>
         `,
            menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
          }
        ],
        insertKeys: {
          index: 0, // 插入的位置，基于当前的 toolbarKeys
          keys: ['dateMenu', 'timeMenu', 'pageNum']
        }
      },
      show1: false,
      show2: false
    };
  },
  methods: {
    handleReleaseSubmit() {
      this.$emit('update:visible', false);
    },
    handleReset() {}
  },
  components: {},
  watch: {
    dialogVisible(v) {
      if (v) {
        this.show1 = false;
        this.show2 = false;
        this.$nextTick(() => {
          this.show1 = true;
          setTimeout(() => {
            this.show2 = true;
          }, 100);
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.ConfigPage {
  &__wangeditor {
    height: 200px;
  }
  ::v-deep {
    .el-form {
      overflow: auto;
    }
  }
}
</style>
