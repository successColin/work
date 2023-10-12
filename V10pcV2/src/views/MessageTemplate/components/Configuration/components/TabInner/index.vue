<!--
 * @Author: sss
 * @Date: 2021-07-26 14:15:40
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-26 14:15:40
 * @Desc: 站内信
-->
<template>
  <article class="inner">
    <div class="configuration--line title">
      <label class="header__label isRequired">{{
        $t('messageTemplate.title')
      }}</label>
      <codemirror
        ref="innerTitle"
        key="innerTitle"
        com="innerTitle"
        prop="title"
        :height="34"
        @onCmFocus="onCmFocus"
        @contentChange="titleChange"
      ></codemirror>
    </div>
    <!-- <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.address')
      }}</label>
    </div> -->
    <div class="configuration--line">
      <label class="header__label">交互方式</label>
      <div class="interaction">
        <apiot-radio
          @change="(value) => changeRadio(value)"
          v-model="contentProps.interactionType"
          label="1"
          >跳转地址
        </apiot-radio>
        <apiot-radio
          @change="(value) => changeRadio(value)"
          v-model="contentProps.interactionType"
          label="2"
          >跳转面板
        </apiot-radio>
        <apiot-radio
          @change="(value) => changeRadio(value)"
          v-model="contentProps.interactionType"
          label="3"
          >跳转菜单
        </apiot-radio>
      </div>
      <div>
        <apiot-input
          v-if="contentProps.interactionType === '1'"
          v-model="contentProps.jumpLink"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('messageTemplate.address'),
            })
          "
        ></apiot-input>
        <apiot-button
          v-if="contentProps.interactionType === '2'"
          class="panelBtn"
          @click="handleJumpPaneConfig(1)"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>PC跳转面板配置
        </apiot-button>
        <apiot-button
          v-if="contentProps.interactionType === '2'"
          class="panelBtn"
          @click="handleJumpPaneConfig(2)"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>APP跳转面板配置
        </apiot-button>
        <apiot-button
          v-if="contentProps.interactionType === '3'"
          class="panelBtn"
          @click="handleJumpMenuConfig(1)"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>PC跳转菜单配置
        </apiot-button>
        <apiot-button
          v-if="contentProps.interactionType === '3'"
          class="panelBtn"
          @click="handleJumpMenuConfig(2)"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>APP跳转菜单配置
        </apiot-button>
      </div>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.contentTemplate')
      }}</label>
      <codemirror
        ref="innerContent"
        key="innerContent"
        com="innerContent"
        prop="content"
        :height="187"
        @onCmFocus="onCmFocus"
        @contentChange="contentChange"
      ></codemirror>
    </div>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      ref="ToMenuConfig"
      v-if="showMenuConfig"
      :visible.sync="showMenuConfig"
      :activeObj="menuType === 1 ? skipMenuConfig : skipMenuConfigApp"
      :sourceType="1"
      :isApp="menuType === 2 ? 1 : 0"
      :variables="variables"
      @cancle-click="handleMenuCancel"
    ></ToMenuConfig>
    <PanelConfig
      v-if="paneVisible"
      :visible.sync="paneVisible"
      :tabPaneConfig="menuType === 1 ? tabPaneConfig : tabPaneConfigApp"
      :activeObj="activeObj"
      :isSelPanel="false"
      :otherParams="{ panelType: 5, unDesign: 1, panelClassify: 1 }"
      @cancle-click="handleCancel"
      :isCustomPage="true"
      :treeType="5"
      :isApp="menuType === 2 ? 1 : 0"
      :variables="variables"
      ref="panelConfig"
    ></PanelConfig>
  </article>
</template>

<script>
import ToMenuConfig from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
import PanelConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import Codemirror from '../Codemirror';

export default {
  components: { Codemirror, ToMenuConfig, PanelConfig },

  inject: ['getVariables'],

  props: {
    content: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      contentProps: { title: '', jumpLink: '', innerMailCategory: 3, interactionType: '' },
      contentTemplate: '',
      variables: [],
      showMenuConfig: false,
      skipMenuConfig: [],
      skipMenuConfigApp: [],
      menuType: 1,
      activeObj: { dialogTitle: '', dialogName: 'PanelDialog' },
      paneVisible: false
    };
  },

  computed: {
    curContent() {
      const { contentTemplate, contentProps } = this;
      return {
        ...this.content,
        ...{ contentProps: JSON.stringify(contentProps), content: contentTemplate, messageType: 4 }
      };
    },
    menuContent() {
      return {
        ...this.curContent,
        compId: `inner_${this.curContent.id}`
      };
    },
    tabPaneConfig() {
      const { panelConfig } = this.contentProps;
      const { curPaneObj } = panelConfig || {};
      return curPaneObj || {};
    },
    tabPaneConfigApp() {
      const { panelConfigApp } = this.contentProps;
      const { curPaneObj } = panelConfigApp || {};
      return curPaneObj || {};
    }
  },

  watch: {
    contentProps: {
      handler() {
        this.$emit('change', this.curContent);
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    init() {
      this.contentTemplate = this.content.content || '';
      const { contentProps } = this.content;
      if (contentProps) this.contentProps = JSON.parse(contentProps);
      const { panelConfig, skipMenuConfig = '', skipMenuConfigApp = '' } = this.contentProps;
      this.skipMenuConfig = skipMenuConfig ? JSON.parse(skipMenuConfig) : [];
      this.skipMenuConfigApp = skipMenuConfigApp ? JSON.parse(skipMenuConfigApp) : [];
      const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
      this.activeObj = panelConfig ? panelConfig.activeObj || initObj : initObj;

      this.variables = this.getVariables();
      this.$refs.innerTitle.init({ content: this.contentProps.title, variables: this.variables });
      this.$refs.innerContent.init({ content: this.contentTemplate, variables: this.variables });
    },
    // 编辑聚焦时
    onCmFocus(codemirrorValInfo) {
      // 编辑器聚焦后通知变量区打开“变量注入功能”，并带给变量区对应的编辑器唯一标识，可以正确注入对应编辑器
      this.$bus.$emit('codemirrorVal_open', {
        codemirrorKey: `${codemirrorValInfo.com}_codemirror_markVal`
      });
    },
    // 标题发生变化时
    titleChange(value) {
      this.contentProps.title = value.content;
      // this.$emit('change', this.curContent);
    },
    changeRadio(value) {
      this.contentProps.interactionType = value;
    },
    // 值发生变化时
    contentChange(value) {
      this.contentTemplate = value.content;
      this.$emit('change', this.curContent);
    },
    handleCancel() {
      const { curPaneObj, activeObj } = this.$refs.panelConfig;
      const value = {
        curPaneObj,
        activeObj
      };
      const vars = {};
      this.variables.map((item) => {
        // eslint-disable-next-line prefer-template
        vars[item.variableCode] = '${' + item.variableCode + '!}';
        return item;
      });
      if (this.menuType === 1) {
        this.contentProps = {
          ...this.contentProps,
          panelConfig: value,
          variablesStr: JSON.stringify(vars)
        };
      } else {
        this.contentProps = {
          ...this.contentProps,
          panelConfigApp: value,
          variablesStr: JSON.stringify(vars)
        };
      }
    },
    handleMenuCancel() {
      const { menuList = [] } = this.$refs.ToMenuConfig;
      const vars = {};
      this.variables.map((item) => {
        // eslint-disable-next-line prefer-template
        vars[item.variableCode] = '${' + item.variableCode + '!}';
        return item;
      });
      if (this.menuType === 1) {
        this.contentProps = {
          ...this.contentProps,
          skipMenuConfig: menuList,
          variablesStr: JSON.stringify(vars)
        };
      } else {
        this.contentProps = {
          ...this.contentProps,
          skipMenuConfigApp: menuList,
          variablesStr: JSON.stringify(vars)
        };
      }
      // this.changeTitle(menuList, 'skipMenuConfig');
    },
    changeTitle(value, key) {
      // 设置组件名称
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.content;

      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    handleJumpMenuConfig(type) {
      // 1 pc端, 2 app
      this.menuType = type;
      this.showMenuConfig = true;
    },
    handleJumpPaneConfig(type) {
      // 1 pc端, 2 app
      this.menuType = type;
      this.paneVisible = true;
    }
  },

  mounted() {
    this.init();

    // 向标题注入变量
    this.$bus.$on('innerTitle_codemirror_markVal', (info) => {
      this.$refs.innerTitle.setValue(info);
    });
    // 向内容模板注入变量
    this.$bus.$on('innerContent_codemirror_markVal', (info) => {
      console.log(info);
      this.$refs.innerContent.setValue(info);
    });
  },

  beforeDestroy() {
    this.$bus.$off('innerTitle_codemirror_markVal');
    this.$bus.$off('innerContent_codemirror_markVal');
  }
};
</script>

<style lang='scss' scoped>
@import '../tab.scss';
.title {
  ::v-deep {
    .codemirror {
      padding: 0 0 0 12px;
      & .CodeMirror pre.CodeMirror-line {
        padding: 0;
      }
    }
  }
}
.inner {
  ::v-deep {
    .ToMenuConfig__li--select {
      width: 200px;
    }
    .icon-shezhi {
      color: #4689f5;
    }
  }
}
</style>
