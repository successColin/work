/**
* @name: index
* @author: DELL
* @date: 2021/11/22 8:53
* @description：index
* @update: 2021/11/22 8:53
*/
<!-- 页面 -->
<template>
  <transition name="slide-rightFade">
    <div class="areaDrawingWrap" v-if="visible">
      <div class="headerTitle">{{ this.type ? '批量热区设置' : '热区设置' }}</div>
      <div class="contentConfigWrap">
        <div class="enterEdit" v-if="isEnter">
          <c-button icon="el-icon-right" @click="doEnter">进入编辑</c-button>
        </div>
        <div class="propsSetting" v-if="!type">
          <div class="setTitle">热区名称</div>
          <div>
            <global-input
                placeholder="请输入名称"
                v-model="hotName"
            />
          </div>
        </div>
        <div class="propsSetting" v-if="!type">
          <div class="setTitle">填充色</div>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              v-model="fillColor"
              show-alpha
              @change="(value) => setProperty(value, 'fill')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting" v-if="!type">
          <div class="setTitle">边框颜色</div>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              v-model="borderColor"
              show-alpha
              @change="(value) => setProperty(value, 'stroke')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting" v-if="!type">
          <div class="setTitle">边框宽度</div>
          <c-input
              type="number"
              :min="0"
              :numberValue="borderWidth"
              @Input-Change="(value) => {
                  this.setProperty(value, 'strokeWidth');
                  this.borderWidth = value
              }"/>
        </div>
        <div class="contentAttributeWrap" :style=getAttributeStyles>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="数据源配置" name="1">
              <div class="propsSetting">
                <span class="setTitle">选择数据源</span>
                <CDataSelectionBox
                    :value="{tableName: tableSource}"
                    @handleSelect="handleSelectTableSource"
                    type="tableName"
                ></CDataSelectionBox>
              </div>
              <div class="propsSetting">
                <global-input placeholder="组件参数名" v-model="varTableName"></global-input>
              </div>
              <div class="propsSetting">
                <span class="setTitle">选择数据明细字段</span>
                <c-select
                    :options="fieldArrOptions"
                    multiple
                    filterable
                    collapse-tags
                    v-model="fieldArr"
                ></c-select>
              </div>
              <div class="propsSetting">
                <span class="setTitle">明细主键字段</span>
                <c-select
                    :options="filterFieldArrOptions"
                    filterable
                    v-model="primaryKey"
                ></c-select>
              </div>
              <div class="propsSetting">
                <span class="setTitle">明细反显字段</span>
                <c-select
                    :options="filterFieldArrOptions"
                    filterable
                    v-model="inverseField"
                ></c-select>
              </div>
              <div class="propsSetting" v-if="!type">
                <span class="setTitle">数据明细</span>
                <CDataSelectionBox
                    :value="{[primaryKey]: detailValue, [inverseField]:detailName}"
                    type="dataSource"
                    :selectName="primaryKey"
                    :inverseField="inverseField"
                    @handleSelect="handleSelectFields"
                    :otherParams="{tableName: tableSource, columns: fieldArr.join(',') }"
                    :columnArr="getFieldsColumn"
                ></CDataSelectionBox>
              </div>
              <div class="propsSetting" v-if="!type">
                <global-input placeholder="组件参数名" v-model="varDetail"></global-input>
              </div>

            </el-collapse-item>
            <el-collapse-item name="5">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">显示信息配置</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="enableShowInfo"
                        v-model="enableShowInfo"
                        active-color="#4689F5"
                        inactive-color="#183472">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div class="propsSetting">
                <p class="setTitle">显示信息类型</p>
                <div>
                  <c-select
                      :options="showInfoArr"
                      v-model="showInfoType"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting" v-show="showInfoType===1">
                <p class="setTitle">自定义显示信息</p>
                <div>
                  <global-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入显示信息"
                      v-model="customShowInfo"
                  />
                </div>
              </div>
              <div class="propsSetting" v-show="showInfoType===2">
                <p class="setTitle">配置显示信息</p>
                <global-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入显示信息"
                    v-model="customShowInfoSQL"
                />
<!--                <SQLEditor v-model="customShowInfoSQL"></SQLEditor>-->
              </div>
              <div class="propsSetting">
                <p class="setTitle">文字位置</p>
                <div>
                  <c-select
                      :options="positionOptions"
                      v-model="labelPosition"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting">
                <div class="setTitle">文字左右偏移</div>
                <c-input
                    type="number"
                    :numberValue="offsetPosition"
                    @Input-Change="(value) => {
                    this.offsetPosition = value;
              }"/>
              </div>
              <div class="propsSetting">
                <div class="setTitle">文字上下偏移</div>
                <c-input
                    type="number"
                    :numberValue="offsetRightPosition"
                    @Input-Change="(value) => {
                    this.offsetRightPosition = value;
              }"/>
              </div>

              <TextStylesConfig
                  title="字体样式"
                  title1="字体颜色"
                  :fontFamilyValue="FontFamily"
                  :fontWeightValue="FontWeight"
                  :fontSizeValue="FontSize"
                  :colorValue="Color"
                  @change="({value,key}) => (this.changeValue(value, key))"
              />

            </el-collapse-item>
            <el-collapse-item title="悬浮信息配置" name="2">
              <div class="propsSetting">
                <p class="setTitle">悬浮信息类型</p>
                <div>
                  <c-select
                      :options="tipInfoArr"
                      v-model="tipInfoType"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting" v-if="tipInfoType===1">
                <p class="setTitle">自定义悬浮信息</p>
                <div>
                  <global-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入悬浮信息"
                      v-model="customTipInfo"
                  />
                </div>
              </div>
              <div class="propsSetting" v-if="tipInfoType===2">
                <p class="setTitle">配置悬浮信息</p>
                <FieldConfig
                    v-if="tipInfoType===2"
                    :value="tipInfoConfig"
                    :dataSource="tableSource"
                    @change="changeFieldConfig"
                ></FieldConfig>
              </div>

            </el-collapse-item>
            <el-collapse-item title="动画配置" name="3">
              <div class="propsSetting">
                <p class="setTitle">动画类型</p>
                <div>
                  <c-select
                      :options="animationTypeArr"
                      v-model="animationType"
                  ></c-select>
                </div>
              </div>
              <SQLConditionConfig
                  v-if="animationType===4"
                  v-model="conditionsArr"
                  @change="(value) => this.conditionsArr=value"
              ></SQLConditionConfig>
            </el-collapse-item>
            <el-collapse-item title="交互配置" name="4" v-if="!type">
              <div class="propsSetting" v-if="activeComponent.stylesObj.type === 2">
                <p class="setTitle">关联更新图表</p>
                <div>
                  <c-select
                      multiple
                      collapse-tags
                      filterable
                      :options="allComponentOptions"
                      v-model="updateCharts"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting" v-if="activeComponent.stylesObj.type === 1">
                <span class="setTitle">交互方式</span>
                <div>
                  <el-radio-group
                      size="mini"
                      v-model="interactionMode"
                  >
                    <el-radio-button :label="1">无</el-radio-button>
                    <el-radio-button :label="2">弹框</el-radio-button>
                    <el-radio-button :label="3">链接</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="ellipsisWrap flex propsSetting" v-if="interactionMode===2">
                <div class="InputWrap">
                  <c-input
                      lable="宽:"
                      type="number"
                      :numberValue="bulletWidth"
                      @Input-Change="(value) => {this.bulletWidth = Number(value)}"/>
                  <c-input
                      lable="高:"
                      type="number"
                      :numberValue="bulletHeight"
                      @Input-Change="(value) => { this.bulletHeight = Number(value)}"/>
                </div>
              </div>
              <div class="propsSetting" v-if="interactionMode===2">
                <p class="setTitle">弹框地址</p>
                <c-input
                    type="text"
                    :value="bulletUrl"
                    @Input-Change="(value) => {this.bulletUrl = value}"
                    @blur="(e) => checkIsRight(e.target.value, 'url')"
                />
              </div>
              <div class="propsSetting" v-if="interactionMode===3">
                <el-radio
                    v-model="openType"
                    :label="2"
                >是否打开新页面进入下一页
                </el-radio>
              </div>
              <div class="propsSetting" v-if="interactionMode===3">
                <el-radio
                    v-model="openType"
                    :label="1"
                >是否刷新当前页进入下一页
                </el-radio>
              </div>
              <div class="propsSetting" v-if="interactionMode===3">
                <p class="setTitle">URL地址</p>
                <global-input
                    v-model="url"
                />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="areaDrawingFooter">
        <c-button @click="handleDel" v-if="!type">
          删除
        </c-button>
        <c-button @click="handleCancel">取消</c-button>
        <c-button type="primary" @click="handleSave">确定</c-button>
      </div>
    </div>
  </transition>
</template>

<script>
// import SQLEditor from '../../SQLEditor/index';
import TextStylesConfig from '../../TextStylesConfig/index';
import {uniqBy} from 'lodash';
import Bus from '@/utils/bus';
import {getFieldsList, doAddHotDesign, getHotInfo, editHotInfo, delHotInfo} from '@/services/design';
import {predefineColors} from '@/constants/global'
import {IsURL} from '@/utils/utils';


const FieldConfig = () => import('./FieldConfig/index');
const obj = {
  interactionMode: 1, // 交互方式 1、没有 2、弹框 3、跳转链接
  bulletType: 1, // 1、默认弹框  2、自定义弹框位置 3、 随鼠标位置
  bulletWidth: 600, // 弹框宽度
  bulletHeight: 400, // 弹框高度
  bulletUrl: '', // 弹框地址
  hotName: '',
  fillColor: '',
  borderColor: '',
  borderWidth: 1,
  tipInfoType: 1,
  enableShowInfo: false, // 是否启用显示信息
  showInfoType: 1, // 显示信息类型
  animationType: 1, // 动画类型
  customTipInfo: '',
  customShowInfo: '', // 自定义显示内容
  customShowInfoSQL: '', // 自定义显示内容
  FontFamily: '',
  FontWeight: '',
  FontSize: 14,
  Color: 'rgba(255, 255, 255, 1)',
  conditionsArr: [],
  updateCharts: [],
  openType: 1,
  url: '',
  fieldArr: [], // 表字段列表
  tableSource: '', // 数据源
  detailValue: '', // 明细值
  detailName: '', // 明细反显名称
  varTableName: '', // 数据源变量
  varDetail: '', // 明细变量
  primaryKey: '', // 主键
  offsetPosition: 0,
  offsetRightPosition: 0,
  labelPosition: 'inside', // 文字显示位置
  inverseField: '', // 反显字段
  tipInfoConfig: [] // 悬浮框配置
};

export default {
  props: {
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    fabricCanvas: {
      type: Object
    },
    crumbsArr: { // 面包屑导航
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      type: '', // batch 批量修改
      configMessage: '', // canvas配置信息
      designJson: '{}', // 前端需要的属性
      visible: false,
      activeNames: '1',
      predefineColors,
      tipInfoArr: [
        {
          label: '自定义悬浮信息',
          value: 1
        }, {
          label: '配置悬浮信息',
          value: 2
        }
      ],
      showInfoArr: [
        {
          label: '自定义显示信息',
          value: 1
        }, {
          label: '配置显示信息',
          value: 2
        }
      ],
      fieldArrOptions: [],
      positionOptions: [
        {
          label: '顶部',
          value: 'top'
        }, {
          label: '左边',
          value: 'left'
        }, {
          label: '右边',
          value: 'right'
        }, {
          label: '底部',
          value: 'bottom'
        }, {
          label: '内部',
          value: 'inside'
        }, {
          label: '内左侧',
          value: 'insideLeft'
        }, {
          label: '内右侧',
          value: 'insideRight'
        }, {
          label: '内顶部',
          value: 'insideTop'
        }, {
          label: '内底部',
          value: 'insideBottom'
        }
      ],
      animationTypeArr: [{
        label: '无',
        value: 1
      }, {
        label: '跳动',
        value: 2
      }, {
        label: '缩放',
        value: 3
      }, {
        label: '按条件生效',
        value: 4
      }], // 动画选项
      ...obj
    };
  },

  components: {
    FieldConfig,
    // SQLEditor,
    TextStylesConfig
  },

  computed: {
    isEnter() {
      if (this.type) {
        return false;
      }
      return this.activeComponent.stylesObj.type === 2
    },
    getFieldsColumn() { // 获取字段表头数组
      if (!this.fieldArrOptions.length) {
        return [];
      }
      return this.fieldArr.map((item) => {
        const current = this.fieldArrOptions.find((val) => val.value === item);
        return {
          label: current.label,
          key: current.value
        }
      })

    },
    filterFieldArrOptions() { // 自能在明细字段中选择
      if (!this.fieldArrOptions.length) {
        return [];
      }
      return this.fieldArr.map((item) => {
        return this.fieldArrOptions.find((val) => val.value === item);
      })
    },
    getAttributeStyles() {
      const px = '65px - 65px - 98px';
      return `height: calc(100% - ${this.activeComponent.stylesObj.type === 2 ? `50px - ${px}` : px})`;
    },
    allComponentOptions() {
      const list = this.getList.filter((item) => item.componentId !== this.activeComponent.componentId);
      return list.map((item) => {
        return {
          label: item.name,
          value: item.componentId
        }
      })
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {
    tableSource: {
      deep: true,
      handler() {
        this.fetchFieldsList();
      }
    },
    type: {
      handler(v) {
        console.log(v, 'zz');
      }
    }
  },
  mounted() {
    const name = `${this.activeComponent.componentId}_block_event`;
    Bus.$off(name).$on(name, (valueObj) => {
      const {isFlag, fabricCanvas, type} = valueObj;
      this.visible = isFlag;
      this.type = type;
      if (isFlag && !type) {
        this.init(fabricCanvas);
      } else {
        Object.keys(obj).forEach((item) => {
          this[item] = obj[item];
        })
      }
    })
  },
  methods: {

    changeValue(value, key) {
      console.log(value, key);
      this[key] = value;
    },
    doEnter() { // 进入下一个层级
      if (this.fabricCanvas) {
        let object = this.fabricCanvas.getActiveObject();
        if (!object) {
          return;
        }
        if (!object.id) {
          this.$message.error('请先保存该热区!');
          return;
        }
        let backgroundImage = '';
        if (this.configMessage) {
          const canvasObj = JSON.parse(this.configMessage)
          if (canvasObj.backgroundImage) {
            backgroundImage = canvasObj.backgroundImage.src;
          }
        }
        this.$emit('enterSubHotZone', { // 进入热区编辑
          configMessage: this.configMessage, // canvas配置信息
          designJson: this.designJson, // 前端需要的属性
          backgroundImage,
          crumbsArr: {
            parentHost: object.id,
            name: this.hotName
          }
        })
        this.visible = false;
      }
    },
    async init(fabricCanvas) {
      let object = this.fabricCanvas ? this.fabricCanvas.getActiveObject() : fabricCanvas.getActiveObject();
      if (!object) {
        return;
      }
      const {id = null} = object;
      if (id) {
        const res = await getHotInfo({id}) || {};
        const {
          designJson = '{}',
          filtersJson = '[]',
          detailColumn = '[]',
          messageJson = '[]',
          tableName,
          detailValue,
          tableJson,
          detailJson,
          detailKey,
          messageType,
          configMessage = '',
          name = '',
          customShowInfoSql = '',
          enableShowInfo = false,
          showInfoType = 1
        } = res;
        this.primaryKey = detailKey;
        this.varDetail = detailJson;
        this.varTableName = tableJson;
        this.detailValue = detailValue;
        this.tableSource = tableName;
        this.tipInfoConfig = JSON.parse(messageJson);
        this.fieldArr = JSON.parse(detailColumn);
        this.tipInfoType = messageType;
        this.conditionsArr = JSON.parse(filtersJson);
        this.configMessage = configMessage;
        this.hotName = name;
        this.customShowInfoSQL = customShowInfoSql;
        this.enableShowInfo = enableShowInfo;
        this.showInfoType = showInfoType;
        let newJson = JSON.parse(designJson);
        this.designJson = newJson;
        Object.keys(newJson).forEach((item) => {
          this[item] = newJson[item];
        })
      } else {
        Object.keys(obj).forEach((item) => {
          this[item] = obj[item];
        })
      }
    },
    changeFieldConfig(v) {
      this.tipInfoConfig = v;
    },
    handleSave() { // 保存热区属性
      if (this.type) { // 如果是批量修改，
        this.$emit('batchModify', {
          filtersJson: JSON.stringify(this.conditionsArr),
          messageJson: JSON.stringify(this.tipInfoConfig),
          messageType: this.tipInfoType,
          designJson: JSON.stringify({
            animationType: this.animationType, // 动画类型}),
            customTipInfo: this.customTipInfo,
            inverseField: this.inverseField,
            enableShowInfo: this.enableShowInfo,
            showInfoType: this.showInfoType, // 显示信息类型
            customShowInfo: this.customShowInfo, // 自定义显示内容
            FontFamily: this.FontFamily,
            FontWeight: this.FontWeight,
            FontSize: this.FontSize,
            Color: this.Color,
            labelPosition: this.labelPosition,
            offsetPosition: this.offsetPosition,
            offsetRightPosition: this.offsetRightPosition
          }),
          tableName: this.tableSource,
          detailColumn: JSON.stringify(this.fieldArr),
          tableJson: this.varTableName,
          detailKey: this.primaryKey,
          customShowInfoSql: this.customShowInfoSQL,
          enableShowInfo: this.enableShowInfo,
          showInfoType: this.showInfoType
        });
        return;
      }
      if (this.fabricCanvas) { // 非批量修改
        let object = this.fabricCanvas.getActiveObject();
        if (!object) {
          return;
        }
        const {id = null} = object;
        this.HotInfo(id);
      }
    },
    returnIsTrue() {
      if (!this.tableSource) {
        this.$message.error('请选择数据源!');
        return false;
      }
      if (!this.detailValue) {
        this.$message.error('请选择数据明细!');
        return false;
      }
      if (!this.primaryKey) {
        this.$message.error('请选择明细主键字段!');
        return false;
      }
      if (!this.fieldArr.length) {
        this.$message.error('请选择数据明细字段!');
        return false;
      }
      if (!this.varDetail) {
        this.$message.error('请输入明细参数名!');
        return false;
      }
      return true;
    },
    async HotInfo(id) { // 保存新增或者修改
      if (!this.returnIsTrue()) {
        return
      }
      const designJson = { // 设置配置json
        enableShowInfo: this.enableShowInfo,
        showInfoType: this.showInfoType, // 显示信息类型
        customShowInfo: this.customShowInfo, // 自定义显示内容
        FontFamily: this.FontFamily,
        FontWeight: this.FontWeight,
        FontSize: this.FontSize,
        Color: this.Color,
        labelPosition: this.labelPosition,
        offsetPosition: this.offsetPosition,
        offsetRightPosition: this.offsetRightPosition,
        fillColor: this.fillColor,
        borderColor: this.borderColor,
        borderWidth: this.borderWidth,
        animationType: this.animationType, // 动画类型
        customTipInfo: this.customTipInfo,
        updateCharts: this.updateCharts,
        openType: this.openType,
        url: this.url,
        inverseField: this.inverseField,
        detailName: this.detailName,
        interactionMode: this.interactionMode, // 交互方式 1、没有 2、弹框 3、跳转链接
        bulletType: this.bulletType, // 1、默认弹框  2、自定义弹框位置 3、 随鼠标位置
        bulletWidth: this.bulletWidth, // 弹框宽度
        bulletHeight: this.bulletHeight, // 弹框高度
        bulletUrl: this.bulletUrl // 弹框地址
      }
      const {id: elementId} = this.activeComponent;
      const {parentHost} = this.crumbsArr[this.crumbsArr.length - 1];
      const params = {
        elementId,
        parentHost,
        designJson: JSON.stringify(designJson),
        filtersJson: JSON.stringify(this.conditionsArr),
        messageJson: JSON.stringify(this.tipInfoConfig),
        tableName: this.tableSource,
        detailColumn: JSON.stringify(this.fieldArr),
        detailValue: this.detailValue,
        tableJson: this.varTableName,
        detailJson: this.varDetail,
        detailKey: this.primaryKey,
        messageType: this.tipInfoType,
        name: this.hotName,
        customShowInfoSql: this.customShowInfoSQL,
        enableShowInfo: this.enableShowInfo,
        showInfoType: this.showInfoType,
        varJson: JSON.stringify([{name: this.varTableName, value: this.tableSource}, {
          name: this.varDetail,
          value: this.detailValue
        }])
      }
      try {
        const api = id ? editHotInfo : doAddHotDesign;
        const param = id ? {...params, id} : params;
        const res = await api(param);
        if (this.fabricCanvas && !id) {
          let object = this.fabricCanvas.getActiveObject();
          if (!object) {
            return;
          }
          object.id = res;
          this.fabricCanvas.renderAll();
        }
        this.handleCancel();
        this.$nextTick(() => {
          this.$emit('changeCanvas');
        })
      } catch (e) {
        console.log(e);
      }
    }
    ,
    async fetchFieldsList() { // 获取字段列表
      if (!this.tableSource) {
        this.fieldArrOptions = [];
        return;
      }
      try {
        const res = await getFieldsList({
          dataSourceId: window.atob(this.$route.query.dataId),
          tableName: this.tableSource
        });
        const newRes = uniqBy(res, 'name');
        this.fieldArrOptions = newRes.map((item) => {
          return {
            value: item.name,
            label: `${item.memo}(${item.name})`
          }
        })
      } catch (e) {
        this.fieldArrOptions = [];
      }

    }
    ,
    handleSelectFields(obj) { // 选择明细
      this.detailValue = obj[this.primaryKey];
      this.detailName = obj[this.inverseField];
      this.varDetail = this.primaryKey;
    }
    ,
    handleSelectTableSource(obj) { // 选择数据源
      this.tableSource = obj.tableName;
      this.fieldArr = [];
      this.varTableName = obj.tableName;
    }
    ,
    handleCancel() { // 点击取消
      this.visible = false;
      if (this.fabricCanvas) {
        this.fabricCanvas.discardActiveObject();
        this.fabricCanvas.requestRenderAll();
      }
    },

    async handleDel() { // 删除热区
      if (this.fabricCanvas) {
        let object = this.fabricCanvas.getActiveObject();
        if (!object) {
          return;
        }
        const {id} = object;
        if (id) {
          try {
            await delHotInfo({id});
            this.fabricCanvas.remove(object);
            this.fabricCanvas.renderAll();
            this.handleCancel();
            this.$nextTick(() => {
              this.$emit('changeCanvas');
            })
          } catch (e) {
            console.log(e);
          }
        } else {
          this.fabricCanvas.remove(object);
          this.fabricCanvas.renderAll();
          this.handleCancel();
          this.$nextTick(() => {
            this.$emit('changeCanvas');
          })
        }
      }
    },
    checkIsRight(value, key) {
      if (key === 'url' && value) {
        if (!IsURL(value)) {
          this.$message.error('请输入正确的url地址!');
          return;
        }
      }
    },
    setProperty(v, key) { // 设置填充色
      if (this.fabricCanvas) {
        let object = this.fabricCanvas.getActiveObject();
        if (!object) {
          return;
        }
        object.set(key, v);
        this.fabricCanvas.renderAll();
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.areaDrawingWrap {
  position: fixed;
  width: 300px;
  height: calc(100% - 50px);
  background: #131E45;
  top: 50px;
  right: 0;
  z-index: 2;

  .headerTitle {
    height: 46px;
    padding-left: 20px;
    line-height: 46px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    box-shadow: 0px 1px 0px 0px #2f437f;
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
  .contentConfigWrap {
    width: 100%;
    height: calc(100% - 46px - 50px);
    padding: 10px 20px;
    box-sizing: border-box;
    overflow-y: auto;

    .enterEdit {
      width: 100%;
      margin-bottom: 10px;

      ::v-deep {
        .el-button--default {
          width: 100%;
          color: #B9BDCC;

          .el-icon-right {
            color: #6B798D;
          }
        }
      }
    }

    .propsSetting {
      margin-bottom: 10px;

      .setTitle {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 30px;
        text-align: left;
        opacity: .7;
      }
      .InputWrap {
        display: flex;
        margin-top: 5px;
        width: 100%;
        align-items: center;
        justify-content: space-between;

        ::v-deep {
          .CInputWrap {
            width: 100%;
            display: flex;
            flex: 0 0 calc(50% - 8px);
            align-items: center;

            .inputBox {
              width: 100px;

              .el-input-number {
                width: 100px;

                .el-input__inner {
                  padding-left: 15px;
                  padding-right: 20px;
                }

                .el-input-number__decrease, .el-input-number__increase {
                  width: 20px;
                }
              }
            }
          }
        }
      }


      .drawBox {
        display: flex;
        position: relative;
        height: 32px;
        margin-top: 6px;
        align-items: center;
        background: #192757;
        border: 1px solid #2F437F;
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
          color: #FFFFFF;
        }

        &.active {
          background: rgba(70, 137, 245, 0.3);
          border: 1px dashed #4689F5;

          .drawing {
            display: block;
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
        .el-radio-button {
          width: 60px;

          &.is-active {
            .el-radio-button__inner {
              background: $component-borderFocus-color !important;
              border-color: $component-borderFocus-color !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 8px 15px;
            font-size: 14px;
            border-radius: 0;
            color: #FFFFFF;
            opacity: .7;
            border-color: $component-border-color;
            background: $component-background-color;
          }

          .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background: $component-background-color;
            font-size: 14px;
            color: #FFFFFF;
            opacity: 1;
          }
        }

      }
    }
    .ellipsisWrap {
      justify-content: space-between;
      align-items: center;
    }
    .contentAttributeWrap {
      width: 100%;
      box-sizing: border-box;


      ::v-deep {
        .el-collapse {
          border: none;
        }

        .el-collapse-item__arrow {
          margin: 0 0px 0 auto;
        }

        .el-collapse-item__header {
          height: 30px;
          line-height: 30px;
          background-color: #131E45;
          color: #ffffff;
          font-weight: bold;
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
  }

  .areaDrawingFooter {
    height: 50px;
    width: 100%;
    display: flex;
    padding-right: 25px;
    justify-content: flex-end;
    align-items: center;
    background: #101D44;
    box-sizing: border-box;
  }
}
</style>
