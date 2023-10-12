/**
* @name: index
* @author: DELL
* @date: 2022/9/26 8:54
* @description：index
* @update: 2022/9/26 8:54
*/
<!-- 页面 -->
<template>
  <apiot-dialog
    :title="title"
    :isBigDialog="true"
    :visible="configVisible"
    :show-close="false"
    @sure-click="handleOk"
    @cancle-click="handleCancel"
  >
    <div class="user-appover-content">
      <div class="user-appover-tabs">
        <div class="form-item-label">面板选择</div>
        <div class="form-item-content">
          <apiot-select v-model="panelActive" @change="changeConfig">
            <el-option
              v-for="item in panelOptions"
              :value="item.value"
              :key="item.index"
              :label="item.name"
            ></el-option>
          </apiot-select>
        </div>
      </div>
      <el-table
        v-if="configVisible"
        v-loading="loading"
        class="tableWrap"
        :height="466"
        :data="configData"
        style="width: 100%; margin-bottom: 20px"
        row-key="compId"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="组件名称" sortable width="250">
          <template slot-scope="scope">
            <span class="name-component"
              ><img
                v-if="scope.row.compType"
                :src="require(`@/assets/img/menu_images/${scope.row.imgUrl}`)"
              />{{ scope.row.name }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="address" label="显示" :key="key1">
          <template slot="header">
            <apiot-checkbox
              class="m-r-5"
              :value="isShowCheckAll"
              :indeterminate="isShowTitle"
              @change="
                handleCheckAllChange($event, 'canShowCheckbox', 'canShow')
              "
            >
            </apiot-checkbox>
            显示
          </template>
          <template slot-scope="scope">
            <apiot-checkbox
              :compId="scope.row.compId"
              class="canShowCheckbox"
              v-if="isShowCheckbox(scope.row, 'canShow')"
              :value="getIsHide(scope.row, 'canShow')"
              @change="
                changeCommonCheck(
                  $event,
                  scope.row,
                  'canShow',
                  'canShowCheckbox'
                )
              "
            >
            </apiot-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="编辑">
          <template slot="header">
            <apiot-checkbox
              class="m-r-5"
              :value="isEditCheckAll"
              :indeterminate="isEditTitle"
              @change="
                handleCheckAllChange($event, 'canEditCheckbox', 'canEdit')
              "
            >
            </apiot-checkbox>
            编辑
          </template>
          <template slot-scope="scope">
            <apiot-checkbox
              :compId="scope.row.compId"
              class="canEditCheckbox"
              v-if="isShowCheckbox(scope.row, 'canReadonly')"
              :value="getIsEdit(scope.row, 'canEdit')"
              @change="
                changeCommonCheck(
                  $event,
                  scope.row,
                  'canEdit',
                  'canEditCheckbox'
                )
              "
            >
            </apiot-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="必填">
          <template slot="header">
            <apiot-checkbox
              class="m-r-5"
              :value="isRequireCheckAll"
              :indeterminate="isRequireTitle"
              @change="
                handleCheckAllChange(
                  $event,
                  'canRequireCheckbox',
                  'shouldRequired'
                )
              "
            >
            </apiot-checkbox>
            必填
          </template>
          <template slot-scope="scope">
            <apiot-checkbox
              :compId="scope.row.compId"
              class="canRequireCheckbox"
              :value="getIsCheck(scope.row, 'shouldRequired')"
              v-if="isShowCheckbox(scope.row, 'shouldRequired')"
              @change="
                changeCommonCheck(
                  $event,
                  scope.row,
                  'shouldRequired',
                  'canRequireCheckbox'
                )
              "
            >
            </apiot-checkbox>
          </template>
        </el-table-column>
        <!--通过-->
        <el-table-column
            prop="abstract"
            label="关联通过按钮"
            v-if="isNeedPassAndRejectBtn"
        >
          <template slot-scope="scope">
            <apiot-checkbox
                :value="getIsCheck(scope.row, 'isRelationPass')"
                v-if="isSaveBtn(scope.row)"
                @change="(value) => changeCheck(value, scope.row, 'isRelationPass')"
            >
            </apiot-checkbox>
          </template>
        </el-table-column>
        <el-table-column
            prop="abstract"
            label="关联驳回按钮"
            v-if="isNeedPassAndRejectBtn"
        >
          <template slot-scope="scope">
            <apiot-checkbox
                :value="getIsCheck(scope.row, 'isRelationReject')"
                v-if="isSaveBtn(scope.row)"
                @change="(value) => changeCheck(value, scope.row, 'isRelationReject')"
            >
            </apiot-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="abstract"
          label="关联提交按钮"
          v-if="isNeedAbstract"
        >
          <template slot-scope="scope">
            <apiot-checkbox
              :value="getIsCheck(scope.row, 'isRelation')"
              v-if="isSaveBtn(scope.row)"
              @change="(value) => changeCheck(value, scope.row, 'isRelation')"
            >
            </apiot-checkbox>
          </template>
        </el-table-column>
        <el-table-column
            prop="abstract"
            label="关联确定按钮"
            v-if="isShowPassBtn"
        >
          <template slot-scope="scope">
            <apiot-checkbox
                :value="getIsCheck(scope.row, 'isRelationPass')"
                v-if="isSaveBtn(scope.row)"
                @change="(value) => changeCheck(value, scope.row, 'isRelationPass')"
            >
            </apiot-checkbox>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </apiot-dialog>
</template>

<script>
import { getDesignMenu } from '@/api/menuConfig';

export default {
  props: {
    title: {
      type: String,
      default: '界面配置'
    },
    configVisible: {
      // 弹框显示
      type: Boolean,
      default: false
    },
    appCheckFormConfigJSON: {
      // app面板配置
      type: Array,
      default() {
        return [];
      }
    },
    checkFormConfigJSON: {
      // pc面板配置
      type: Array,
      default() {
        return [];
      }
    },
    appCheckAgreeFormConfig: {
      // app通过面板配置
      type: Array,
      default() {
        return [];
      }
    },
    checkAgreeFormConfig: {
      // pc通过面板配置
      type: Array,
      default() {
        return [];
      }
    },
    checkType: {
      // 操作类型
      type: String,
      default: ''
    },
    isNeedAbstract: {
      // 是否需要关联按钮
      type: Boolean,
      default: false
    },
    isNeedPassAndRejectBtn: {
      // 是否关联通过驳回按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      isShowPassBtn: false,
      key1: 0,
      isShowTitle: false, // 显示表头全选
      isShowCheckAll: false, // 显示表头全选
      isEditTitle: false, // 编辑全选
      isEditCheckAll: false, // 编辑表头全选
      isRequireTitle: false, // 必填全选
      isRequireCheckAll: false, // 必填全选
      panelOptions: [], // 面板下拉
      panelActive: '', // 选中的面板
      configData: [] // 面板的配置信息
    };
  },

  components: {},

  computed: {
    isSaveBtn() { // 是否是保存按钮
      return function (row) {
        return row.buttonType === 1 && row.compName === 'FormButton';
      };
    },
    returnDomLength() {
      // 查找选中的dom和所有的的dom节点
      return function (classKey) {
        const dom = document.querySelectorAll(`.tableWrap .${classKey}`);
        console.log(dom, 'dom');
        const domChecked = document.querySelectorAll(`.tableWrap .${classKey}.is-checked`);
        const obj = {
          all: dom.length,
          checked: domChecked.length,
          dom,
          domChecked
        };
        return obj;
      };
    },
    checkTabOrForm() {
      return function (obj) {
        const check = (v, name) => Object.prototype.hasOwnProperty.call(v, name);
        const { compName } = obj;
        const tabFlag = check(obj, 'showTabBtn') && check(obj, 'tabBtnPos');
        return (tabFlag || compName === 'MenuMain');
      };
    },
    checkTab() { // 判断是否是表单或者是tab
      return function (obj) {
        const check = (v, name) => Object.prototype.hasOwnProperty.call(v, name);
        return check(obj, 'showTabBtn') && check(obj, 'tabBtnPos');
      };
    },
    checkForm() { // 判断是否是表单或者是tab
      return function (obj) {
        const { compName } = obj;
        return compName === 'MenuMain';
      };
    },
    isShowCheckbox() {
      return function (obj, key) {
        const check = (v, name) => Object.prototype.hasOwnProperty.call(v, name);
        if ((this.checkTab(obj) || this.checkForm(obj)) && key === 'canShow') {
          return true;
        }
        return check(obj, key);
      };
    },
    getIsHide() {
      return function (obj, key) {
        const arr = this.getRealValue;
        const index = arr.findIndex((item) => item.compId === obj.compId);

        if (index !== -1) {
          if (this.isShowCheckbox(arr[index], key)) {
            return arr[index][key];
          }
          const { singleStatus } = obj;
          return singleStatus !== 4;
        }
        if (this.checkTab(obj)) {
          return !obj.notShowTab;
        }
        if (this.checkForm(obj)) {
          return !obj.notShowArea;
        }
        const { singleStatus } = obj;
        return singleStatus !== 4;
      };
    },
    getIsEdit() {
      return function (obj, key) {
        const arr = this.getRealValue;
        const index = arr.findIndex((item) => item.compId === obj.compId);
        if (index !== -1) {
          if (this.isShowCheckbox(arr[index], key)) {
            return arr[index][key] || false;
          }
          const { singleStatus } = obj;
          return ![2, 3].includes(singleStatus);
        }
        const { singleStatus } = obj;
        return ![2, 3].includes(singleStatus);
      };
    },
    getRealValue() {
      if (this.checkType === 'app' && !this.isShowPassBtn) {
        return this.appCheckFormConfigJSON;
      }
      if (this.checkType === 'pc' && !this.isShowPassBtn) {
        return this.checkFormConfigJSON;
      }
      if (this.checkType === 'pc' && this.isShowPassBtn) {
        return this.checkAgreeFormConfig;
      }
      if (this.checkType === 'app' && this.isShowPassBtn) {
        return this.appCheckAgreeFormConfig;
      }
      return [];
    },
    getIsCheck() {
      // 根据组件id获取配置的显示隐藏
      return function (obj, key) {
        const arr = this.getRealValue;
        const index = arr.findIndex((item) => item.compId === obj.compId);
        if (index !== -1) {
          if (this.isShowCheckbox(arr[index], key)) {
            return arr[index][key] || false;
          }
          return obj[key];
        }
        return obj[key];
      };
    }
  },

  mounted() {},
  watch: {
    configVisible: {
      handler(v) {
        console.log(v);
        if (!v) {
          this.isShowPassBtn = false;
        }
      }
    }
  },
  methods: {
    async init({ key, appPanelName, pcPanelName, pcPanelId, appPanelId, key2 }) {
      if (key2 && key2 === 'agree') {
        this.isShowPassBtn = true;
      }
      // 初始化数据
      const res = await getDesignMenu({ panelId: key === 'pc' ? pcPanelId : appPanelId });
      this.configData = res[0].designOverallLayout || [];
      this.panelActive = res[0].panelId;
      const paneObj = this.configData[0].paneObj || {};
      const options = [
        {
          name: key === 'app' ? appPanelName : pcPanelName,
          value: this.panelActive
        }
      ];
      Object.keys(paneObj).forEach((item, i) => {
        const { panelName, id, panelClassify } = paneObj[item] || {};
        // eslint-disable-next-line no-shadow
        if (panelName && panelClassify !== 2 && !options.find((item) => item.value === id)) {
          options.push({
            value: id,
            name: panelName,
            key: i
          });
        }
      });
      this.panelOptions = options;
      this.checkType = key;
      // this.configVisible = true;
      this.$nextTick(() => {
        this.initThead();
      });
    },
    async changeConfig(v) {
      // 获取其他面板的配置
      this.loading = true;
      const res = await getDesignMenu({ panelId: v });
      this.configData = res[0].designOverallLayout || [];
      this.panelActive = res[0].panelId;
      this.$nextTick(() => {
        this.loading = false;
        this.initThead();
      });
    },
    handleOk() {
      // 点击保存的时候，以修改的数据为主
      if (!this.checkType) return;
      this.$emit('handleOk', this.getRealValue);
    },
    handleCancel() {
      this.$emit('handleCancel');
    },
    async changeCommonCheck(value, obj, key, key2) {
      await this.changeCheck(value, obj, key);
      await this.initShow(key2);
    },
    initThead() {
      // 初始化表头
      this.initShow('canShowCheckbox');
      this.initShow('canEditCheckbox');
      this.initShow('canRequireCheckbox');
    },
    initShow(key2) {
      const { all, checked } = this.returnDomLength(key2);
      if (key2 === 'canShowCheckbox') {
        if (checked > 0 && checked < all) {
          this.isShowTitle = true;
          this.isShowCheckAll = false;
        } else if (checked === all) {
          this.isShowTitle = false;
          this.isShowCheckAll = true;
        } else {
          this.isShowTitle = false;
          this.isShowCheckAll = false;
        }
      }
      if (key2 === 'canEditCheckbox') {
        if (checked > 0 && checked < all) {
          this.isEditTitle = true;
          this.isEditCheckAll = false;
        } else if (checked === all) {
          this.isEditTitle = false;
          this.isEditCheckAll = true;
        } else {
          this.isEditTitle = false;
          this.isEditCheckAll = false;
        }
      }
      if (key2 === 'canRequireCheckbox') {
        if (checked > 0 && checked < all) {
          this.isRequireTitle = true;
          this.isRequireCheckAll = false;
        } else if (checked === all) {
          this.isRequireTitle = false;
          this.isRequireCheckAll = true;
        } else {
          this.isRequireTitle = false;
          this.isRequireCheckAll = false;
        }
      }
      this.key1 += 1;
    },
    handleCheckAllChange(v, key, key2) {
      if (key === 'canShowCheckbox') {
        this.isShowCheckAll = v;
        this.isShowTitle = false;
        this.key1 += 1;
      }
      if (key === 'canEditCheckbox') {
        this.key1 += 1;
        this.isEditTitle = false;
        this.isEditCheckAll = v;
      }
      if (key === 'canRequireCheckbox') {
        this.key1 += 1;
        this.isRequireTitle = false;
        this.isRequireCheckAll = v;
      }
      this.reduceData(key, key2, v);
    },
    reduceData(key, key2, v) {
      const { dom } = this.returnDomLength(key);
      console.log(this.returnDomLength(key), 'aa');
      dom.forEach(async (domKey) => {
        const compId = domKey.getAttribute('compid');
        await this.changeCheck(v, { compId }, key2);
      });
    },
    async changeCheck(value, obj, key) {
      // 修改属性
      const arr = this.getRealValue;
      const index = arr.findIndex((item) => item.compId === obj.compId);
      let currentObj = {};
      if (key === 'isRelationPass' && value) {
        currentObj = {
          ...currentObj,
          isRelationReject: false,
        };
        arr.forEach((item, i) => {
          if (item.isRelationPass) {
            item.isRelationPass = !item.isRelationPass;
            this.$set(arr, i, item);
          }
        });
      }
      if (key === 'isRelationReject' && value) {
        currentObj = {
          ...currentObj,
          isRelationPass: false,
        };
        arr.forEach((item, i) => {
          if (item.isRelationReject) {
            item.isRelationReject = !item.isRelationReject;
            this.$set(arr, i, item);
          }
        });
      }
      if (index !== -1) {
         currentObj = {
          ...arr[index],
          ...currentObj,
          [key]: value
        };
        this.$set(arr, index, currentObj);
        return;
      }
      arr.push({ ...currentObj, [key]: value, compId: obj.compId });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.user-appover-content {
  width: 100%;
  height: 100%;
  .user-appover-tabs {
    height: 46px;
    display: flex;
    align-items: center;
    .form-item-label {
      margin-right: 10px;
    }
  }
  .name-component {
    & > img {
      width: 20px;
      height: 20px;
      margin-right: 6px;
      vertical-align: middle;
    }
  }

  ::v-deep {
    .el-icon-arrow-right {
      font-family: 'iconfont' !important;
      font-size: 13px;
      color: #333;
    }

    .el-icon-arrow-right:before {
      content: '\ea22';
    }
  }
}
</style>
