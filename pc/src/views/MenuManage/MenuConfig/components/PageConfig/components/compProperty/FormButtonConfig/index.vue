<template>
  <div class="config formButtonConfig">
    <h1 class="config__h1">按钮组件</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="帮助信息">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="activeObj.buttonType"
          placeholder="请选择按钮类型"
          @change="btnTypeChange"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in getAllowType"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="导出类型" v-if="activeObj.buttonType === 13">
        <el-select v-model="activeObj.exportType" placeholder="请选择按钮类型">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in exportTypeArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="操作区域"
        v-if="[2, 9, 10].includes(activeObj.buttonType) && activeObj.isTabBtn"
      >
        <el-select v-model="activeObj.deleteArea" placeholder="请选择删除区域">
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getArea"
            :key="item.compId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="按钮样式"
        v-if="
          fatherObj.appStyle === 3 ||
          $route.query.isApp !== '1' ||
          (this.getParentObj(1) &&
            this.getParentObj(1).tableCompName === 'OperateCol')
        "
      >
        <el-select
          v-model="activeObj.buttonStyle"
          placeholder="请选择按钮样式"
          v-if="
            $route.query.isApp !== '1' ||
            (this.getParentObj(1) &&
              this.getParentObj(1).tableCompName === 'OperateCol')
          "
          :disabled="isTreeBtn"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in buttonStyleArr"
            :key="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-show="
            activeObj.buttonStyle !== 'text' && activeObj.buttonStyle !== ''
          "
          class="buttonColor m-t-10"
          popper-class="buttonColor"
          v-model="activeObj.iconColor"
          placeholder="请选择颜色"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in selectColorArr"
            :key="item.value"
          >
            <div :style="`background:${item}`" class="colorContent">
              <i
                class="iconfont el-icon-check"
                v-if="item === activeObj.iconColor"
              ></i></div
          ></el-option>
        </el-select>
        <div
          v-show="
            activeObj.buttonStyle !== 'text' && activeObj.buttonStyle !== ''
          "
          class="buttonColor__res"
          :style="`background:${activeObj.iconColor};`"
        ></div>
      </el-form-item>
      <el-form-item label="展示风格">
        <el-select
          :disabled="isTreeBtn"
          v-model="activeObj.buttonForm"
          placeholder="请选择按钮样式"
          class="m-b-10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in buttonFormArr"
            :key="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-show="activeObj.buttonForm !== 1"
          class="buttonColor buttonIcon"
          popper-class="buttonColor buttonIcon"
          @dblclick.prevent.stop
          v-model="activeObj.iconFont"
          placeholder="请选择图标"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in buttonIconArr"
            :key="item.value"
          >
            <div
              class="iconContent"
              :class="[{ active: item === activeObj.iconFont }]"
            >
              <i :class="`iconfont ${item}`"></i></div
          ></el-option>
        </el-select>
        <div class="buttonIcon__res" v-show="activeObj.buttonForm !== 1">
          <i :class="`iconfont ${activeObj.iconFont}`"></i>
        </div>
      </el-form-item>
      <!-- <h2 class="formButtonConfig__sureSub">
        启用表单提交
        <el-switch
          class="formButtonConfig__sureSub--switch"
          v-model="activeObj.submitEnable"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </h2> -->
      <apiot-button
        class="formButtonConfig__btn"
        v-if="isShow"
        @click="showRuleDialog = true"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>提交前检验
      </apiot-button>
      <apiot-button
        class="formButtonConfig__btn saveALL__btn"
        v-if="activeObj.isTabBtn && activeObj.buttonType === 1"
        @click="paramsDialog = true"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>全部保存参数设置
      </apiot-button>
      <el-form-item label="关联打印模板" v-if="activeObj.buttonType === 15">
        <filterable-input
          ref="filterableInput"
          placeholder="请选择关联打印模板"
          :showInfo="activeObj.printTemp"
          :hasPagination="false"
          :dialogType="8"
          @selectRes="selectDict"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="状态" v-if="isShow">
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.singleStatus === 1 }]"
            @click="activeObj.singleStatus = 1"
            >普通</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 2 }]"
            @click="activeObj.singleStatus = 2"
            >禁用</el-button
          >
          <el-button
            v-if="false"
            :class="[{ active: activeObj.singleStatus === 3 }]"
            @click="activeObj.singleStatus = 3"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 4 }]"
            @click="activeObj.singleStatus = 4"
            >隐藏</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item
        label="关联类型"
        v-if="![1, 2, 7, 8, 9, 14, 15].includes(activeObj.buttonType) && isShow"
      >
        <el-radio v-model="activeObj.relateType" :label="1">弹出面板</el-radio>
        <el-radio
          v-model="activeObj.relateType"
          :label="2"
          v-if="activeObj.buttonType === 5"
          >跳转菜单</el-radio
        >
        <el-radio
          v-model="activeObj.relateType"
          :label="3"
          v-if="activeObj.buttonType === 5"
          >跳转外部地址</el-radio
        >
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 1"
          @click="showPanelConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
        </apiot-button>
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 2"
          @click="showMenuConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
        </apiot-button>
        <apiot-input
          v-if="activeObj.relateType === 3"
          v-model="activeObj.outerLink"
          placeholder="请输入外部地址"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label=""
        v-if="activeObj.relateType === 3 && activeObj.outerLink"
      >
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
      <el-form-item
        label="操作日志"
        v-if="[1, 2, 7, 8, 9, 14].includes(activeObj.buttonType)"
      >
        <p class="switchBox">
          是否启用操作日志
          <el-switch
            v-model="activeObj.enableLog"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <el-select
          v-model="activeObj.logComp"
          multiple
          placeholder="请选择操作日志字段"
          v-if="activeObj.enableLog && activeObj.buttonType === 1"
        >
          <el-option-group
            v-for="group in getAreaComp"
            :key="group.compId"
            :label="group.name"
          >
            <el-option
              v-for="item in group.children"
              :key="item.compId"
              :label="item.name"
              :value="item.compId"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item
        label="执行函数"
        v-if="activeObj.isTabBtn && activeObj.buttonType === 1"
      >
        <p class="switchBox">
          是否启用执行函数
          <el-switch
            v-model="activeObj.execFunc"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <select-formula
          v-if="activeObj.execFunc"
          :configData="configData"
          class="action__term--formula"
          :showType="[3]"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.execFuncName"
        ></select-formula>
      </el-form-item>
      <el-form-item
        label="流程类型"
        v-show="[1, 2].includes(activeObj.buttonType)"
      >
        <el-select
          v-model="activeObj.flowType"
          placeholder="请选择流程类型"
          class="m-b-10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in flowType"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="提交前提示"
        v-show="[1, 2, 5, 9, 10].includes(activeObj.buttonType)"
      >
        <el-select
          v-model="activeObj.beforeSubmit.type"
          placeholder="请选择提示类型"
          class="m-b-10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in buttonTips"
            :key="item.value"
          ></el-option>
        </el-select>
        <apiot-button
          class="tipBtn"
          v-if="activeObj.beforeSubmit.type === 3"
          @click="
            submitObj = activeObj.beforeSubmit;
            tipDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>自定义提示
        </apiot-button>
      </el-form-item>
      <el-form-item
        label="提交后提示"
        v-show="[1, 2, 5, 9, 10].includes(activeObj.buttonType)"
      >
        <el-select
          v-model="activeObj.afterSubmit.type"
          placeholder="请选择提示类型"
          class="m-b-10"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in buttonTips"
            :key="item.value"
          ></el-option>
        </el-select>
        <apiot-button
          class="tipBtn"
          v-if="activeObj.afterSubmit.type === 3"
          @click="
            submitObj = activeObj.afterSubmit;
            tipDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>自定义提示
        </apiot-button>
      </el-form-item>
      <el-form-item
        label="刷新类型"
        v-show="![7, 8, 14].includes(activeObj.buttonType) && isShow"
      >
        <el-select v-model="activeObj.refreshType" placeholder="请选择">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in refreshTypeArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="importLabelCom('label')"
        v-if="[7, 8].includes(activeObj.buttonType)"
      >
        <filterable-input
          :placeholder="importLabelCom('placeholder')"
          :title="importLabelCom('title')"
          :dialogType="5"
          :hasPagination="true"
          :showInfo="activeObj.templateInfo"
          @selectRes="getTemplateInfo"
        ></filterable-input>
        <apiot-button
          class="panelBtn"
          @click="showExtraColumn = true"
          v-if="activeObj.templateInfo.tableArr && activeObj.buttonType === 7"
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>新增导入额外字段
        </apiot-button>
        <el-select
          v-if="activeObj.buttonType === 7"
          v-model="activeObj.refreshType"
          placeholder="请选择"
          class="m-t-10"
        >
          <el-option label="无" :value="0"></el-option>
          <el-option label="刷新当前页" :value="1"></el-option>
          <el-option label="刷新当前区域" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label=""
        v-show="
          [8].includes(activeObj.buttonType) &&
          [1, 2].includes(activeObj.exportSetting)
        "
      >
        <p class="switchBox">
          导出数据库表字段
          <el-switch
            v-model="activeObj.needField"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        label="下载数据类型"
        v-if="[14].includes(activeObj.buttonType)"
      >
        <el-select
          v-model="activeObj.downLoadType"
          placeholder="请选择"
          class="m-t-10"
        >
          <el-option
            :label="item.name"
            v-for="item in filesTypeOption"
            :key="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="业务文件字段配置"
        v-if="
          [1, 2].includes(activeObj.downLoadType) && activeObj.buttonType === 14
        "
      >
        <el-select
          v-model="activeObj.fileColumns"
          placeholder="请选择"
          class="m-t-10"
          multiple
          filterable
          collapse-tags
        >
          <el-option
            :label="`${item.columnName}(${item.memo})`"
            v-for="item in filesOption"
            :key="item.columnName"
            :value="item.columnName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="导出文件命名"
        v-if="[14].includes(activeObj.buttonType)"
      >
        <apiot-input
          v-model="activeObj.downloadName"
          placeholder="请输入文件名称"
        ></apiot-input>
      </el-form-item>

      <apiot-button
        class="formButtonConfig__btn"
        @click="levelVisible = true"
        v-if="[14].includes(activeObj.buttonType)"
      >
        <i class="iconfont icon-shezhi m-r-4"></i>导出文件层级设置
      </apiot-button>
      <el-form-item
        label="导出设置"
        v-show="[8].includes(activeObj.buttonType)"
      >
        <el-radio-group v-model="activeObj.exportSetting">
          <el-radio
            :label="item.value"
            :key="item.value"
            v-for="(item, i) in exportSettingOption"
            class="config__radio"
          >
            {{ item.name }}
            <el-tooltip
              content="导出的文件，无法重新导入"
              placement="top"
              v-show="i === 2 || i === 3"
            >
              <i class="iconfont icon-bangzhu" />
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 自定义提示 -->
    <tip-dialog
      v-if="tipDialog"
      :visible.sync="tipDialog"
      :activeObj="activeObj"
      :configData="configData"
      :getCompArr="getCompArr"
      :submitObj="submitObj"
    ></tip-dialog>
    <!-- 提交前提示 -->
    <rule-dialog
      :visible.sync="showRuleDialog"
      :showRuleDialog="showRuleDialog"
      :activeObj="activeObj"
      :configData="configData"
      :triggerCompMap="triggerCompMap"
    ></rule-dialog>
    <!-- 面板配置弹窗 -->
    <PanelConfig
      :visible.sync="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
      :getAllcheck="getAllcheck"
    ></PanelConfig>
    <!-- 保存全部参数弹窗 -->
    <SaveAllParams
      :visible.sync="paramsDialog"
      v-if="paramsDialog"
      :relateObj="relateObj"
      :saveAreaArr.sync="activeObj.saveAreaArr"
    ></SaveAllParams>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      :visible.sync="showMenuConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
    ></ToMenuConfig>
    <!-- 额外字段 -->
    <ExtraColumn
      :visible.sync="showExtraColumn"
      v-if="showExtraColumn"
      :extraColumnArr="activeObj.extraColumn"
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      :tableArr="activeObj.templateInfo.tableArr || []"
    ></ExtraColumn>
    <!--层级设置-->
    <levelSetting
      :visible.sync="levelVisible"
      :showOrHide="levelVisible"
      :value="activeObj.layeredStrategy"
      :filesOption="filesOption"
      :tableName="getTableName"
      @saveLayeredStrategy="saveLayeredStrategy"
    />
  </div>
</template>

<script>
import { getFields } from '@/api/flow';
import { selectColorArr } from '@/config';
import ruleDialog from './ruleDialog.vue';
import SaveAllParams from './saveAllParams.vue';
import tipDialog from './tipDialog.vue';
import propertyMixin from '../propertyMixin';
import PanelConfig from '../ContentConfig/PanelConfig';
import ToMenuConfig from '../ContentConfig/ToMenuConfig';
import ExtraColumn from './ExtraColumn';
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';

const levelSetting = () => import('./levelSetting');

export default {
  mixins: [propertyMixin],
  props: {
    activeObj: {
      type: Object
    },
    configData: {
      type: Array
    },
    // 所有区域平坦化
    getAllcheck: {
      type: Object
    }
  },
  data() {
    return {
      levelVisible: false,
      // 表字段
      filesOption: [],
      // 按钮样式
      buttonStyleArr: [
        {
          label: '次要按钮',
          value: ''
        },
        {
          label: '主要按钮',
          value: 'primary'
        },
        {
          label: '纯文字按钮',
          value: 'text'
        }
      ],
      // 按钮类型
      buttonTypeArr: [
        {
          label: '保存',
          value: 1
        },
        {
          label: '删除',
          value: 2
        },
        {
          label: '新增',
          value: 3
        },
        {
          label: '编辑',
          value: 4
        },
        {
          label: '普通',
          value: 5
        },
        {
          label: '确定(数据选择框)',
          value: 6
        },
        {
          label: '导入',
          value: 7
        },
        {
          label: '导出',
          value: 8
        },
        {
          label: '批量删除',
          value: 9
        },
        {
          label: '批量普通',
          value: 10
        },
        {
          label: '查询',
          value: 11
        },
        {
          label: '重置',
          value: 12
        },
        {
          label: '导出',
          value: 13
        },
        {
          label: '下载资料',
          value: 14
        },
        {
          label: '打印',
          value: 15
        }
      ],
      // 按钮表现形式
      buttonFormArr: [
        {
          label: '文字按钮',
          value: 1
        },
        {
          label: '图标文字按钮',
          value: 2
        },
        {
          label: '图标按钮',
          value: 3
        }
      ],
      exportTypeArr: [
        {
          label: 'EXCEL',
          value: 1
        },
        {
          label: 'WORD',
          value: 2
        },
        {
          label: 'PDF',
          value: 3
        }
      ],
      // 颜色选择数组
      selectColorArr: [],
      // 图标选择数组
      buttonIconArr: [
        'icon-bianji',
        'icon-fangda',
        'icon-lishi',
        'icon-piliangcaozuo',
        'icon-daochu',
        'icon-daoru',
        'icon-qiehuan',
        'icon-dayin',
        'icon-shanchu',
        'icon-qianyi',
        'icon-xiazai',
        'icon-shangchuan',
        'icon-guanxiguanlian',
        'icon-fuzhi',
        'icon-zhengquequeding',
        'icon-xinzeng',
        'icon-suoxiao',
        'icon-quxiaocuowu',
        'icon-gengxin',
        'icon-jibenxinxi',
        'icon-anniuicon_1',
        'icon-anniuicon_2',
        'icon-anniuicon_3',
        'icon-anniuicon_4',
        'icon-anniuicon_5',
        'icon-anniuicon_6',
        'icon-anniuicon_7',
        'icon-anniuicon_8',
        'icon-anniuicon_9',
        'icon-anniuicon_10',
        'icon-anniuicon_11',
        'icon-anniuicon_12',
        'icon-anniuicon_13',
        'icon-anniuicon_14',
        'icon-anniuicon_15',
        'icon-anniuicon_16',
        'icon-anniuicon_17',
        'icon-anniuicon_18',
        'icon-anniuicon_19',
        'icon-anniuicon_20',
        'icon-anniuicon_21',
        'icon-anniuicon_22',
        'icon-anniuicon_23',
        'icon-anniuicon_24',
        'icon-anniuicon_25',
        'icon-anniuicon_26',
        'icon-anniuicon_27',
        'icon-anniuicon_28',
        'icon-anniuicon_29',
        'icon-anniuicon_30',
        'icon-anniuicon_31',
        'icon-anniuicon_32'
      ],
      buttonTips: [
        {
          label: '无',
          value: 1
        },
        {
          label: '系统默认',
          value: 2
        },
        {
          label: '自定义提示',
          value: 3
        }
      ],
      flowType: [
        {
          label: '无',
          value: 1
        },
        {
          label: '存为草稿',
          value: 2
        },
        {
          label: '发起流程',
          value: 3
        }
      ],
      // 弹窗类型数组
      dialogNameArr: [
        { value: 'PanelDialog', label: '弹出式' },
        { value: 'PanelDrawer', label: '抽屉式' },
        { value: 'PanelFull', label: '全屏式' }
      ],
      showRuleDialog: false,
      // 刷新类型的数组
      refreshTypeArr: [
        {
          label: '无',
          value: 0
        },
        {
          label: '刷新当前页',
          value: 1
        },
        {
          label: '刷新上一页',
          value: 8
        },
        {
          label: '更新上一页树',
          value: 9
        },
        {
          label: '关闭当前页',
          value: 2
        },
        {
          label: '关闭并刷新上一页',
          value: 3
        },
        {
          label: '刷新当前菜单',
          value: 4
        },
        {
          label: '更新当前树',
          value: 6
        },
        {
          label: '关闭并更新上一页树',
          value: 7
        },
        {
          label: '更新当前树表',
          value: 10
        },
        {
          label: '关闭并更新上一页树表',
          value: 11
        },
        {
          label: '刷新当前区域',
          value: 5
        }
      ],
      exportSettingOption: [
        {
          name: '按模板导出全部',
          value: 1
        },
        {
          name: '按模板导出选中部分',
          value: 2
        },
        {
          name: '按界面导出全部',
          value: 3
        },
        {
          name: '按界面导出选中部分',
          value: 4
        }
      ],
      filesTypeOption: [
        {
          name: '全部',
          value: 1
        },
        {
          name: '仅业务文件',
          value: 2
        },
        {
          name: '仅关联资料',
          value: 3
        }
      ],
      submitObj: null, // 自定义类型的对象
      tipDialog: false, // 是否展示自定义提示
      showPanelConfig: false, // 面板配置弹窗是否显示
      showMenuConfig: false,
      paramsDialog: false, // 面板显示隐藏
      showExtraColumn: false // 额外字段
    };
  },

  components: {
    ruleDialog,
    SaveAllParams,
    tipDialog,
    PanelConfig,
    ToMenuConfig,
    ExtraColumn,
    SelectFormula,
    levelSetting
  },
  watch: {
    'activeObj.buttonType': {
      immediate: true,
      handler(v) {
        if (v === 14) {
          this.initDownLoadFiles();
        }
      }
    }
  },
  computed: {
    getTableName() {
      if (this.getParentObj(2).tableInfo) {
        return this.getParentObj(2).tableInfo.tableName;
      }
      return '';
    },
    getCompArr() {
      const arr = [];
      if (this.activeObj.isTabBtn) {
        this.relateObj.children.forEach((area) => {
          if (area.areaType === 1 && area.children) {
            area.children.forEach((child) => {
              child.children.forEach((comp) => {
                if (comp.areaType === 1) {
                  arr.push(comp);
                }
              });
            });
          }
        });
      } else {
        this.relateObj.children.forEach((area) => {
          if (area.areaType === 1 && area.children) {
            area.children.forEach((child) => {
              arr.push(child);
            });
          }
        });
      }
      return arr;
    },

    // 获取允许的按钮类型
    getAllowType() {
      if (this.activeObj.btnTypesArr) {
        return this.buttonTypeArr.filter((item) => this.activeObj.btnTypesArr.includes(item.value));
      }
      return this.buttonTypeArr;
    },
    // 获取所有的区域
    getArea() {
      const curInfo = [];
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        const curComp = this.getAllcheck[key];
        if (curComp.compType === 'AREA' && this.activeObj.compId !== curComp.compId) {
          if (this.$route.query.isApp !== '1') {
            if (
              curComp.compName !== 'CardMain' &&
              curComp.compName !== 'TreeMain' &&
              curComp.compName !== 'MultiTree' &&
              curComp.tabId === this.activeObj.tabId
            ) {
              curInfo.push(curComp);
            }
          } else {
            curInfo.push(curComp);
          }
        }
      });
      return curInfo;
    },
    // 获取该按钮下面区域的组件
    getAreaComp() {
      if (this.activeObj.isTabBtn) {
        const arr = [];
        this.relateObj.children.forEach((area) => {
          if (area.compName !== 'BtnsArea') {
            const tempArr = [];
            arr.push({
              name: area.name,
              compId: area.compId,
              children: tempArr
            });

            area.children.forEach((block) => {
              if (block.areaType === 1) {
                block.children.forEach((comp) => {
                  if (
                    (comp.compType <= 10 && comp.singleStatus === 1) ||
                    (comp.dataSource && comp.dataSource.columnName === 'id')
                  ) {
                    tempArr.push({
                      name: comp.name,
                      compId: comp.compId
                    });
                  }
                });
              }
            });
          }
        });
        return arr;
      }
      const arr = [];
      const tempArr = [];
      arr.push({
        name: this.relateObj.name,
        compId: this.relateObj.compId,
        children: tempArr
      });
      this.relateObj.children.forEach((block) => {
        if (block.areaType === 1) {
          block.children.forEach((comp) => {
            if (
              (comp.compType <= 10 && comp.singleStatus === 1) ||
              (comp.dataSource && comp.dataSource.columnName === 'id')
            ) {
              tempArr.push({
                name: comp.name,
                compId: comp.compId
              });
            }
          });
        }
      });
      return arr;
    },
    // 是不是树的按钮或者cardTable的按钮
    isTreeBtn() {
      if (
        this.getParentObj(3) &&
        ['TreeMain', 'MultiTree'].includes(this.getParentObj(3).compName)
      ) {
        return true;
      }
      return false;
    },
    importLabelCom() {
      return function (v) {
        if (this.activeObj.buttonType === 7) {
          if (v === 'label') {
            return '导入模板';
          }
          if (v === 'placeholder') {
            return '搜索或选择导入模板';
          }
          if (v === 'title') {
            return '导入模板';
          }
        }
        if (this.activeObj.buttonType === 8) {
          if (v === 'label') {
            return '导出模板';
          }
          if (v === 'placeholder') {
            return '搜索或选择导出模板';
          }
          if (v === 'title') {
            return '导出模板';
          }
        }
        return '';
      };
    }
  },
  mounted() {
    this.selectColorArr = selectColorArr;
    if (this.fatherObj.tabBtnArea) {
      // tab按钮区的按钮没有刷新当前区域
      this.refreshTypeArr.pop();
    }
    this.initTreeBtn();
    if (this.activeObj.buttonType === 14) {
      this.initDownLoadFiles();
    }
    if (this.activeObj.logComp) {
      this.initLogComp();
    }
  },

  methods: {
    // 选择关联打印模板
    async selectDict(dict) {
      if (this.activeObj.printTemp && dict.id === this.activeObj.printTemp.id) {
        return;
      }
      this.activeObj.printTemp = dict;
    },
    saveLayeredStrategy(v) {
      this.activeObj.layeredStrategy = v;
      this.$set(this.activeObj, 'layeredStrategy', v);
    },
    async initDownLoadFiles() {
      const {
        tableInfo: { tableName }
      } = this.getParentObj(2);
      this.filesOption = await getFields({ columnTypes: '', tableName });
    },
    initTreeBtn() {
      if (
        this.getParentObj(3) &&
        ['TreeMain', 'MultiTree'].includes(this.getParentObj(3).compName)
      ) {
        this.activeObj.buttonStyle = 'text';
        this.activeObj.buttonForm = 3;
      }
    },
    initLogComp() {
      const arr = [];
      this.activeObj.logComp.forEach((compId) => {
        if (this.getAllcheck[compId] && this.getAreaComp[compId]) {
          arr.push(compId);
        }
      });
      this.activeObj.logComp = arr;
    },
    nameFocus() {
      this.activeObj.backName = this.activeObj.name;
    },
    nameBlur() {
      if (!this.activeObj.name) {
        this.activeObj.name = this.activeObj.backName;
      }
    },
    // 按钮类型更改重置某些东西
    btnTypeChange() {
      this.activeObj.ruleArr = [];

      // 自定义提示重置
      this.activeObj.beforeSubmit.type = 1;
      // 删除默认有提交前提示
      if (this.activeObj.buttonType === 2) {
        this.activeObj.beforeSubmit.type = 2;
      }
      this.activeObj.beforeSubmit.html = '';
      this.activeObj.afterSubmit.type = 1;
      // 删除 保存默认有提交前提示
      if (this.activeObj.buttonType === 2 || this.activeObj.buttonType === 1) {
        this.activeObj.afterSubmit.type = 2;
      }
      this.activeObj.afterSubmit.html = '';

      // 面板相关重置
      this.activeObj.relateType = 1;
      // this.configData[0].paneObj[this.activeObj.compId] = { id: '' };
      // if (this.configData[0].menuObj && this.configData[0].menuObj[this.activeObj.compId]) {
      //   this.configData[0].menuObj[this.activeObj.compId] = [];
      // }
      // tab按钮区转为删除时，删除区域，默认第一个
      if (
        this.activeObj.buttonType === 2 &&
        this.activeObj.isTabBtn &&
        !this.activeObj.deleteArea
      ) {
        this.activeObj.deleteArea = this.getArea[0].compId;
      }
    },
    // Excel填入字段
    getTemplateInfo(v) {
      const tableArr = [];
      if (v.relationsList) {
        v.relationsList.forEach((item) => {
          tableArr.push(item.tableName);
        });
      }
      this.activeObj.templateInfo = {
        templateName: v.templateName,
        tableArr,
        id: v.id,
        isTree: v.isTree === 1,
        sortId: v.sortId
      };
    },
    // 添加外部链接参数
    addParams() {
      if (!this.activeObj.paramsArr) {
        this.activeObj.paramsArr = [];
      }
      this.activeObj.paramsArr.push({
        name: '',
        type: 1,
        fixed: '',
        formula: ''
      });
    },
    deleteParams(index) {
      this.activeObj.paramsArr.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.formButtonConfig {
  &__sureSub {
    position: relative;
    font-size: 13px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
    padding-left: 10px;
    bottom: 8px;
    ::v-deep {
      .el-switch__label {
        position: absolute;
        margin: 0;
        color: #ffffff !important;
      }
      .el-switch__label--left {
        display: none;
        left: 22px;
        &.is-active {
          display: block;
          z-index: 1;
        }
        span {
          font-size: 12px;
        }
      }
      .el-switch__label--right {
        display: none;
        left: 6px;
        &.is-active {
          display: block;
        }
        span {
          font-size: 12px;
        }
      }
    }
    &--switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &__btn {
    width: 100%;
    margin-bottom: 10px;
    .iconfont {
      font-size: 16px;
      color: $--color-primary;
    }
  }
  .buttonColor {
    width: 100%;
    display: inline-flex;

    &__res {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      margin-top: -26px;
      margin-left: 12px;
    }
    ::v-deep {
      .el-input__inner {
        color: transparent;
        font-size: 0px;
      }
    }
  }
  .buttonIcon__res {
    position: absolute;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    margin-top: -26px;
    margin-left: 12px;
    i {
      color: $--color-primary;
    }
  }

  ::v-deep {
    .custom__varible {
      width: 100px;
      box-sizing: border-box;
      padding: 0 10px;
      display: inline-block;
      border: 0;
      height: 24px;
      line-height: 24px;
      font-weight: 400;
      background: #e5f0ff;
      word-wrap: normal;
      border-radius: 4px;
      text-align: center;
      color: #4689f5 !important;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
    }
    .w-e-panel-container {
      width: 260px !important;
    }
  }
  .panelBtn {
    width: 100%;
    margin-top: 10px;
    .iconfont {
      color: $--color-primary;
    }
  }
  .tipBtn {
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
}
.saveALL__btn {
  margin-left: 0;
}
</style>
<style lang='scss'>
.buttonColor.el-select-dropdown {
  min-width: 260px !important;
  max-width: 260px;
  .el-select-dropdown__list {
    display: flex;
    flex-wrap: wrap;
  }
  .colorContent {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    text-align: center;
    line-height: 20px;
    color: #ffffff;
  }
}
.buttonIcon {
  .el-select-dropdown__list {
    padding-left: 10px;
  }
  .el-select-dropdown__item {
    padding: 0 4px;
  }
  .iconContent {
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    text-align: center;
    line-height: 24px;
    color: #bbc3cd;
    border-radius: 4px;
    font-weight: normal;
    &.active {
      background-color: #f1f7ff;
      color: $--color-primary;
    }
  }
}
.config__radio {
  margin-top: 12px;
}
.config__radio:nth-child(1) {
  margin-top: 5px;
}
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
</style>
