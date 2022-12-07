/**
* @name: SingleLineTextConfig
* @author: DELL
* @date: 2021/8/21 15:20
* @description：SingleLineTextConfig
* @update: 2021/8/21 15:20
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <c-input
          type="text"
          :maxlength="16"
          :value="getComponentInfo.name" @Input-Change="(value) => changeTitle(value, 'name')"/>
    </div>
    <location-properties
        :widthValue="getComponentInfo.width"
        :heightValue="getComponentInfo.height"
        :leftValue="getComponentInfo.left"
        :topValue="getComponentInfo.top"
        @changeTitle="({value, key}) => changeTitle(value, key)"
    ></location-properties>
    <!--    <div class="propsSetting">-->
    <!--      <p class="setTitle">内容</p>-->
    <!--      <c-input-->
    <!--          type="text"-->
    <!--          :value="getComponentInfo.content" @Input-Change="(value) => changeTitle(value, 'content')"/>-->
    <!--    </div>-->
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <c-input
          type="number"
          :numberValue="getComponentInfo.stylesObj.zIndex"
          @Input-Change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <div class="ellipsisWrap flex propsSetting">
      <span class="setTitle">固定组件</span>
      <el-switch
          :value="getComponentInfo.isFixed"
          @change="(value) => changeTitle(value, 'isFixed')"
          active-color="#4689F5"
          inactive-color="#183472">
      </el-switch>
    </div>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="2" title="地图区域配置">
        <div>
          <div class="propsSetting">
            <div>
              <el-radio
                  v-model="getComponentInfo.stylesObj.areaType"
                  :label="1"
                  @change="(value) => changeStyles(value, 'areaType')"
              >中国全部省份</el-radio><br/>
<!--              <el-radio-->
<!--                  v-model="getComponentInfo.stylesObj.areaType"-->
<!--                  :label="2"-->
<!--                  @change="(value) => changeStyles(value, 'areaType')"-->
<!--              >中国全部城市</el-radio><br/>-->
              <el-radio
                  v-model="getComponentInfo.stylesObj.areaType"
                  :label="3"
                  @change="(value) => changeStyles(value, 'areaType')"
              >省份</el-radio><br/>
              <el-radio
                  v-model="getComponentInfo.stylesObj.areaType"
                  :label="4"
                  @change="(value) => changeStyles(value, 'areaType')"
              >城市</el-radio><br/>
              <el-radio
                  v-model="getComponentInfo.stylesObj.areaType"
                  :label="5"
                  @change="(value) => changeStyles(value, 'areaType')"
              >自定义geoJSON</el-radio>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.areaType===3">
            <p class="setTitle">省份</p>
            <div>
              <c-select
                  filterable
                  :options="PROVINCE_LIST"
                  :value="getComponentInfo.stylesObj.provinceCode"
                  @change="(value) => changeStyles(value, 'provinceCode')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.areaType===4">
            <p class="setTitle">城市</p>
            <div>
              <c-select
                  filterable
                  :options="CITY_LIST"
                  :value="getComponentInfo.stylesObj.cityCode"
                  @change="(value) => changeStyles(value, 'cityCode')"
              ></c-select>
            </div>
          </div>
          <div
              class="propsSetting"
              v-if="getComponentInfo.stylesObj.areaType===5"
              style="margin-bottom: 30px;">
            <div class="wrap">
              <c-upload
                  :isPublic="true"
                  :before-upload="beforeAvatarUpload"
                  @changeScreenBg="(url) => changeScreenBgUrl(url, 'geoJSONUrl')"
                  accept=".json"
                  :url="getComponentInfo.stylesObj.geoJSONUrl"
              >
              </c-upload>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">地图背景色</p>
            <div style="display:flex;text-align: left;margin-top: 6px;">
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.bgColor1"
                  show-alpha
                  @change="(value) => changeStyles(value, 'bgColor1')"
                  :predefine="predefineColors"
              >
              </c-color-picker>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.bgColor2"
                  show-alpha
                  @change="(value) => changeStyles(value, 'bgColor2')"
                  :predefine="predefineColors"
              >
              </c-color-picker>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否允许缩放滚动</span>
            <el-switch
                :value="getComponentInfo.stylesObj.roam"
                @change="changeStyles($event, 'roam')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.areaType===1">
            <p class="setTitle">地图中心点</p>
            <c-input
                type="text"
                :maxlength="16"
                :value="getComponentInfo.stylesObj.center" @Input-Change="(value) => changeStyles(value, 'center')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">地图层级</p>
            <c-input
                type="number"
                :min="1"
                :max="3"
                :step="0.1"
                :numberValue="getComponentInfo.stylesObj.zoom"
                @Input-Change="(value) => changeStyles(Number(value), 'zoom')"/>
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item name="1" title="自定义区域样式">
        <div>
          <div class="numberWrap">
            <div class="propsSetting flexItem">
              <p class="setTitle">行政边界颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.adminBoundaryColor"
                  :colorValue="getComponentInfo.stylesObj.adminBoundaryColor"
                  @change="(value) => changeStyles(value, 'adminBoundaryColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">行政边界宽度</p>
              <c-input
                  type="number"
                  :min="0"
                  :numberValue="getComponentInfo.stylesObj.adminBoundaryBorderWidth"
                  @Input-Change="(value) => changeStyles(Number(value), 'adminBoundaryBorderWidth')"/>
            </div>
          </div>
          <div class="numberWrap">
            <div class="propsSetting flexItem">
              <p class="setTitle">行政边界阴影色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.adminBoundaryShadowColor"
                  :colorValue="getComponentInfo.stylesObj.adminBoundaryShadowColor"
                  @change="(value) => changeStyles(value, 'adminBoundaryShadowColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">行政边界阴影大小</p>
              <c-input
                  type="number"
                  :min="0"
                  :numberValue="getComponentInfo.stylesObj.adminBoundaryShadowSize"
                  @Input-Change="(value) => changeStyles(Number(value), 'adminBoundaryShadowSize')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影水平偏移</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.shadowHorizontalOffset"
                placeholder=">0 右偏移，<0 左偏移"
                @Input-Change="(value) => changeStyles(Number(value), 'shadowHorizontalOffset')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影垂直偏移</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.shadowVerticalOffset"
                placeholder=">0 下偏移，<0 上偏移"
                @Input-Change="(value) => changeStyles(Number(value), 'shadowVerticalOffset')"/>
          </div>

          <div class="numberWrap">
            <div class="propsSetting flexItem">
              <p class="setTitle">区域默认颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.areaDefaultColor"
                  :colorValue="getComponentInfo.stylesObj.areaDefaultColor"
                  @change="(value) => changeStyles(value, 'areaDefaultColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">区域高亮颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :colorValue="getComponentInfo.stylesObj.areaHighlightColor"
                  :value="getComponentInfo.stylesObj.areaHighlightColor"
                  @change="(value) => changeStyles(value, 'areaHighlightColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否显示文字</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableShow"
                @change="changeStyles($event, 'enableShow')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>

          <div class="numberWrap" v-if="getComponentInfo.stylesObj.enableShow">
            <div class="propsSetting flexItem">
              <p class="setTitle">文字颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.textColor"
                  :colorValue="getComponentInfo.stylesObj.textColor"
                  @change="(value) => changeStyles(value, 'textColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">高亮文字颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :colorValue="getComponentInfo.stylesObj.highlightTextColor"
                  :value="getComponentInfo.stylesObj.highlightTextColor"
                  @change="(value) => changeStyles(value, 'highlightTextColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="数据风格配置" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">展示类型</p>
            <div>
              <el-radio
                  v-model="getComponentInfo.stylesObj.displayType"
                  :label="1"
                  @change="(value) => changeStyles(value, 'displayType')"
              >散点图</el-radio><br/>
              <el-radio
                  v-model="getComponentInfo.stylesObj.displayType"
                  :label="2"
                  @change="(value) => changeStyles(value, 'displayType')"
              >热力图</el-radio><br/>
              <el-radio
                  v-model="getComponentInfo.stylesObj.displayType"
                  :label="3"
                  @change="(value) => changeStyles(value, 'displayType')"
              >自定义</el-radio>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===1">
            <p class="setTitle">数据映射字段</p>
            <c-input
                type="text"
                :maxlength="16"
                :value="getComponentInfo.stylesObj.dataMappingField"
                @Input-Change="(value) => changeStyles(value, 'dataMappingField')"/>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===1">
            <p class="setTitle">散点边框大小</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.scatterBorder"
                @Input-Change="(value) => changeStyles(Number(value), 'scatterBorder')"/>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===1">
            <p class="setTitle">散点图标</p>
            <div>
              <c-select
                  :options="scatterIconArr"
                  v-model="getComponentInfo.stylesObj.scatterIcon"
                  @change="(value) => changeStyles(value, 'scatterIcon')"
              ></c-select>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting" v-if="getComponentInfo.stylesObj.displayType===1">
            <span class="setTitle">是否显示文字</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableShowLabel"
                @change="changeStyles($event, 'enableShowLabel')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="numberWrap" v-if="isShowLabel">
            <div class="propsSetting flexItem">
              <p class="setTitle">文字颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.labelColor"
                  :colorValue="getComponentInfo.stylesObj.labelColor"
                  @change="(value) => changeStyles(value, 'labelColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">文字大小</p>
              <c-input
                  type="number"
                  :min="0"
                  :numberValue="getComponentInfo.stylesObj.labelSize"
                  @Input-Change="(value) => changeStyles(Number(value), 'labelSize')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="isShowLabel">
            <p class="setTitle">文字位置</p>
            <div>
              <c-select
                  filterable
                  :options="labelPosition"
                  :value="getComponentInfo.stylesObj.labelPosition"
                  @change="(value) => changeStyles(value, 'labelPosition')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" v-if="isShowLabel">
            <p class="setTitle">文字显示类型</p>
            <div>
              <c-select
                  filterable
                  :options="labelShowTypeArr"
                  :value="getComponentInfo.stylesObj.labelShowType"
                  @change="(value) => changeStyles(value, 'labelShowType')"
              ></c-select>
            </div>
          </div>
          <PointStylesConfig
              v-if="getComponentInfo.stylesObj.displayType===1"
              :scatterConfig="getComponentInfo.stylesObj.scatterConfig"
              @change="changeStyles($event, 'scatterConfig')"
          />
          <div class="addWrap" v-if="getComponentInfo.stylesObj.displayType===1">
            <c-button
                @click="addScatterConfig"
                icon="icon-xinzeng iconfont"
            >新增颜色</c-button>
          </div>


          <div class="numberWrap" v-if="getComponentInfo.stylesObj.displayType===2">
            <div class="propsSetting flexItem">
              <p class="setTitle">权重最大值</p>
              <c-input
                  type="number"
                  :min="0"
                  @Input-Change="(value) => changeStyles(Number(value), 'pointSize')"
                  :numberValue="getComponentInfo.stylesObj.pointSize"
              />
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">权重最小值</p>
              <c-input
                  type="number"
                  :min="0"
                  @Input-Change="(value) => changeStyles(Number(value), 'dotBlurSize')"
                  :numberValue="getComponentInfo.stylesObj.dotBlurSize"
              />
            </div>
          </div>
          <data-color
              v-if="getComponentInfo.stylesObj.displayType===2"
              :value="getComponentInfo.stylesObj.hotDataColor"
              :single="true"
              @change="(value) => changeStyles(value, 'hotDataColor')"
          />
<!--          <div class="numberWrap" v-if="getComponentInfo.stylesObj.displayType===2">-->
<!--            <div class="propsSetting flexItem">-->
<!--              <p class="setTitle">最小透明度</p>-->
<!--              <c-input-->
<!--                  type="number"-->
<!--                  :min="0"-->
<!--                  @Input-Change="(value) => changeStyles(Number(value), 'minPellucidity')"-->
<!--                  :numberValue="getComponentInfo.stylesObj.minPellucidity"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="propsSetting flexItem">-->
<!--              <p class="setTitle">最大透明度</p>-->
<!--              <c-input-->
<!--                  type="number"-->
<!--                  :min="0"-->
<!--                  @Input-Change="(value) => changeStyles(Number(value), 'maxPellucidity')"-->
<!--                  :numberValue="getComponentInfo.stylesObj.maxPellucidity"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===3">
            <p class="setTitle">数据映射字段</p>
            <c-input
                type="text"
                :maxlength="16"
                :value="getComponentInfo.stylesObj.customDataMappingField"
                @Input-Change="(value) => changeStyles(value, 'customDataMappingField')"/>
          </div>
          <div class="numberWrap" v-if="getComponentInfo.stylesObj.displayType===3">
            <div class="propsSetting flexItem">
              <p class="setTitle">图片宽度</p>
              <c-input
                  type="number"
                  :min="0"
                  @Input-Change="(value) => changeStyles(Number(value), 'imageWidth')"
                  :numberValue="getComponentInfo.stylesObj.imageWidth"
              />
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">图片高度</p>
              <c-input
                  type="number"
                  :min="0"
                  @Input-Change="(value) => changeStyles(Number(value), 'imageHeight')"
                  :numberValue="getComponentInfo.stylesObj.imageHeight"
              />
            </div>
          </div>

          <CustomDisplayConfig
              :labelShowTypeArr="labelShowTypeArr"
              :labelPosition="labelPosition"
              v-if="getComponentInfo.stylesObj.displayType===3"
              :customDisplay="getComponentInfo.stylesObj.customDisplay"
              @change="changeStyles($event, 'customDisplay')"
              style="padding-bottom: 10px;"
          />
          <div
              class="addWrap"
              style="margin: 0"
              v-if="getComponentInfo.stylesObj.displayType===3"
          >
            <c-button
                @click="addCustomConfig"
                icon="icon-xinzeng iconfont"
            >新增字段值</c-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">ToolTip展示</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableTooltip"
                  @change="(value) => changeTitle(value, 'enableTooltip')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">显示信息类型</p>
            <div>
              <c-select
                  :options="showInfoArr"
                  v-model="getComponentInfo.stylesObj.showInfoType"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.showInfoType===1">
            <p class="setTitle">自定义悬浮信息</p>
            <div>
              <global-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入悬浮信息"
                  v-model="getComponentInfo.stylesObj.customTipInfo"
              />
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.showInfoType===2">
            <p class="setTitle">配置悬浮信息</p>
          </div>
          <InfoConfig
              v-if="getComponentInfo.stylesObj.showInfoType===2"
              :value="getComponentInfo.stylesObj.infoConfig"
              @change="changeStyles($event, 'infoConfig')"/>

<!--          <div class="ellipsisWrap flex propsSetting" >-->
<!--            <span class="setTitle">鼠标移入覆盖物</span>-->
<!--            <el-switch-->
<!--                :value="getComponentInfo.stylesObj.enableMouseover"-->
<!--                @change="changeStyles($event, 'enableMouseover')"-->
<!--                active-color="#4689F5"-->
<!--                inactive-color="#183472">-->
<!--            </el-switch>-->
<!--          </div>-->
          <div class="ellipsisWrap flex propsSetting" v-if="getComponentInfo.stylesObj.showInfoType===3">
            <div class="InputWrap">
              <c-input
                  lable="宽:"
                  type="number"
                  :min="0"
                  :numberValue="getComponentInfo.stylesObj.overBulletWidth"
                  @Input-Change="(value) => changeStyles(Number(value), 'overBulletWidth')"/>
              <c-input
                  lable="高:"
                  type="number"
                  :min="0"
                  :numberValue="getComponentInfo.stylesObj.overBulletHeight"
                  @Input-Change="(value) => changeStyles(Number(value), 'overBulletHeight')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.showInfoType===3">
            <p class="setTitle">弹框地址
              <el-tooltip
                  class="item"
                  effect="dark"
                  content='链接带参数，例如: http://47.110.141.124/dataA/menu/124?name={name}'
                  placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </p>
            <c-input
                type="text"
                :value="getComponentInfo.stylesObj.overBulletUrl"
                @Input-Change="(value) => changeStyles(value, 'overBulletUrl')"
            />
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="6">
        <div>
          <div class="ellipsisWrap flex propsSetting" >
            <span class="setTitle">鼠标点击覆盖物</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableMouseClick"
                @change="changeStyles($event, 'enableMouseClick')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.enableMouseClick">
            <span class="setTitle">交互方式</span>
            <div>
              <el-radio-group
                  class="radioGroup"
                  size="mini"
                  v-model="getComponentInfo.stylesObj.interactionMode"
                  @change="(value) => changeStyles(value, 'interactionMode')"
              >
                <el-radio-button :label="1">下钻</el-radio-button>
                <el-radio-button :label="2">弹框</el-radio-button>
                <el-radio-button :label="3">链接</el-radio-button>
                <el-radio-button :label="4">联动</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div
              class="propsSetting"
              v-if="getIsShow"
          >
            <p class="setTitle">地图区域下钻获取geoJSON方式</p>
            <c-select
                :options="GeoJsonTypeArr"
                v-model="getComponentInfo.stylesObj.fetchGeoJsonType"
                @change="(value) => changeStyles(value, 'fetchGeoJsonType')"
            ></c-select>
          </div>
          <div
              class="propsSetting"
              v-if="getIsShow"
          >
            <p class="setTitle">地图区域下钻回调字段</p>
            <c-input
                type="text"
                :value="getComponentInfo.stylesObj.areaCallbackField"
                @Input-Change="(value) => changeStyles(value, 'areaCallbackField')"
            />
          </div>
          <div
              class="propsSetting"
              v-if="getIsShow"
          >
            <p class="setTitle">地图数据下钻回调字段</p>
            <paramsFieldsConfig
                :value="getComponentInfo.stylesObj.dataCallbackFieldConfig"
                @change="(value) => changeStyles(value, 'dataCallbackFieldConfig')"
            />
          </div>
          <div
              class="propsSetting"
              v-if="getIsShow"
          >
            <p class="setTitle">地图数据下钻结束字段</p>
            <c-input
                type="text"
                :value="getComponentInfo.stylesObj.dataEndField"
                @Input-Change="(value) => changeStyles(value, 'dataEndField')"
            />
          </div>
          <div
              class="ellipsisWrap flex propsSetting"
              v-if="getComponentInfo.stylesObj.interactionMode===2 && getComponentInfo.stylesObj.enableMouseClick"
          >
            <div class="InputWrap">
              <c-input
                  lable="宽:"
                  type="number"
                  :numberValue="getComponentInfo.stylesObj.clickBulletWidth"
                  @Input-Change="(value) => changeStyles(Number(value), 'clickBulletWidth')"/>
              <c-input
                  lable="高:"
                  type="number"
                  :numberValue="getComponentInfo.stylesObj.clickBulletHeight"
                  @Input-Change="(value) => changeStyles(Number(value), 'clickBulletHeight')"/>
            </div>
          </div>
          <div
              class="propsSetting"
              v-if="getComponentInfo.stylesObj.interactionMode===2&&getComponentInfo.stylesObj.enableMouseClick"
          >
            <p class="setTitle">弹框地址
              <el-tooltip
                class="item"
                effect="dark"
                content='链接带参数，例如: http://47.110.141.124/dataA/menu/124?name={name}'
                placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </p>
            <c-input
                type="text"
                :value="getComponentInfo.stylesObj.clickBulletUrl"
                @Input-Change="(value) => changeStyles(value, 'clickBulletUrl')"
            />
          </div>
          <div
              class="propsSetting"
              v-if="getComponentInfo.stylesObj.interactionMode===3&& getComponentInfo.stylesObj.enableMouseClick"
          >
            <p class="setTitle">超链接
              <el-tooltip
                class="item"
                effect="dark"
                content='链接带参数，例如: http://47.110.141.124/dataA/menu/124?name={name}'
                placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </p>
            <c-input
                type="text"
                :value="getComponentInfo.stylesObj.url"
                @Input-Change="(value) => changeStyles(value, 'url')"
            />
          </div>
          <div
              class="ellipsisWrap flex propsSetting"
              v-if="getComponentInfo.stylesObj.interactionMode===3&& getComponentInfo.stylesObj.enableMouseClick"
          >
            <span class="setTitle">是否打开新窗口</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableOpenNewWindow"
                @change="(value) => changeStyles(value, 'enableOpenNewWindow')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div
              v-if="getComponentInfo.stylesObj.interactionMode===4 && getComponentInfo.stylesObj.enableMouseClick"
              class="propsSetting"
          >
            <p class="setTitle">关联更新图表</p>
            <div>
              <c-select
                  multiple
                  collapse-tags
                  filterable
                  :options="allComponentOptions"
                  :value="getComponentInfo.stylesObj.updateChart"
                  @change="(value) => changeStyles(value, 'updateChart')"
              ></c-select>
            </div>
          </div>
          <div
              v-if="getComponentInfo.stylesObj.interactionMode===4 && getComponentInfo.stylesObj.enableMouseClick"
              class="propsSetting">
            <p class="setTitle">传参字段设置</p>
            <div>
              <paramsFieldsConfig
                :value="getComponentInfo.stylesObj.paramsFieldsConfig"
                @change="(value) => changeStyles(value, 'paramsFieldsConfig')"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item
          title="geoJSON管理"
          name="7"
          v-if="getIsShow && getComponentInfo.stylesObj.fetchGeoJsonType === 1"
      >
        <div>
          <geoJSONConfig
              :geoJsonConfig="getComponentInfo.stylesObj.geoJsonConfig"
              @change="(value) => changeStyles(value, 'geoJsonConfig')"
          />
          <div class="addWrap">
            <c-button
                @click="addGeoJson"
                icon="icon-xinzeng iconfont"
            >新增geoJSON文件</c-button>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
import {predefineColors, PROVINCE_LIST, CITY_LIST, labelPosition} from '@/constants/global'

const PointStylesConfig = () => import('./Components/pointStylesConfig');
const CustomDisplayConfig = () => import('./Components/customDisplay');
const InfoConfig = () => import('./Components/infoConfig');
const paramsFieldsConfig = () => import('./Components/paramsFieldsConfig');
const geoJSONConfig = () => import('./Components/geoJsonConfig');

export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      predefineColors,
      PROVINCE_LIST,
      CITY_LIST,
      labelPosition,
      labelShowTypeArr: [
        {
          label: '名称',
          value: 1
        }, {
          label: '值',
          value: 2
        }
      ],
      showInfoArr: [
        {
          label: '自定义悬浮信息',
          value: 1
        }, {
          label: '配置悬浮信息',
          value: 2
        }, {
          label: '配置悬浮弹框信息',
          value: 3
        }
      ],
      GeoJsonTypeArr: [
        {
          label: '区域编码',
          value: 1
        },
        {
          label: 'geoJson 文件地址',
          value: 2
        }
      ],
      scatterIconArr: [
        {
          label: '实心圆',
          value: 'circle'
        }, {
          label: '正方形',
          value: 'rect'
        }, {
          label: '三角形',
          value: 'triangle'
        }, {
          label: '菱形',
          value: 'diamond'
        }, {
          label: '气泡',
          value: 'pin'
        }, {
          label: '箭头',
          value: 'arrow'
        }
      ],
      enable: true,
      activeName: ''
    };
  },

  components: {
    PointStylesConfig,
    CustomDisplayConfig,
    InfoConfig,
    paramsFieldsConfig,
    geoJSONConfig
  },

  computed: {
    getIsShow() {
      const { stylesObj: { enableMouseClick, interactionMode } } = this.getComponentInfo;
      return enableMouseClick && interactionMode === 1;
    },
    isShowLabel() {
      const { stylesObj: { enableShowLabel, displayType } } = this.getComponentInfo;
      return enableShowLabel && displayType === 1;
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
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return Obj;
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  methods: {
    addGeoJson() {
      const { stylesObj: { geoJsonConfig = []} } = this.getComponentInfo;
      geoJsonConfig.push({
        areaCode: '',
        memo: '',
        geoJSONUrl: ''
      })
      this.changeStyles(geoJsonConfig, 'geoJsonConfig');
    },
    beforeAvatarUpload(file) {
      const isJPG = ['application/json'].includes(file.type);
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('只能上传 JSON 文件!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    changeScatterConfig(v, i) {
      const { stylesObj: { scatterConfig = []} } = this.getComponentInfo;
      const list = [...scatterConfig];
      const newList = list.splice(i, 1, v);
      this.changeStyles(newList, 'scatterConfig');
    },
    addCustomConfig() { // 新增自定义
      const { stylesObj: { customDisplay = []} } = this.getComponentInfo;
      customDisplay.push({
        fieldValue: '',
        customUrl: '',
        enableShowLabel: false,
        labelShowType: 1,
        labelColor: '#ffffff',
        labelSize: 12,
        labelPosition: 'right',
        shadowHorizontalOffset: 0,
        shadowVerticalOffset: 0
      })
      this.changeStyles(customDisplay, 'customDisplay');
    },
    addScatterConfig(){ // 新增颜色
      const { stylesObj: { scatterConfig = []} } = this.getComponentInfo;
      scatterConfig.push({
        fieldValue: null,
        scatterSize: 15,
        scatterHighlightSize: 15,
        scatterColor: '',
        scatterHighlightColor: '',
        scatterBorderColor: '',
        scatterBorderHighlight: ''
      })
      this.changeStyles(scatterConfig, 'scatterConfig');
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
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
      this.$store.dispatch('config/updateComponentList', list);
    },
    reduceIndex() {
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return -1;
      }
      const index = this.getList.findIndex((item) => {
        return item.componentId === componentId
      });
      return index;
    },
    changeScreenBgUrl(url, key) { // 修改背景图片
      this.changeStyles(url, key);
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
      this.$store.dispatch('config/updateComponentList', list);
    }
  },
  name: 'SingleLineTextConfig'
};
</script>

<style lang='scss' scoped>
.bgContentWrap {
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;

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

  .propsSetting {
    margin-bottom: 10px;

    .businessWrap {
      .inputBox {
        width: 100%;
      }
    }

    .fontSizeWrap {
      display: flex;
      align-items: center;
      margin-top: 6px;

      ::v-deep {
        .selectWrap {
          flex: 0 0 170px;
          margin-right: 10px;

          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }

        .CInputWrap {
          .el-input-number.is-controls-right .el-input__inner {
            padding-right: 23px;
          }
        }
      }
    }

    .borderWrap {
      display: flex;
      align-items: center;
      margin-top: 6px;

      ::v-deep {
        .selectWrap {
          flex: 0 0 calc(50% - 5px);

          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }

        .CInputWrap {
          flex: 0 0 calc(50% - 5px);
          margin-right: 10px;

          .el-input-number.is-controls-right .el-input__inner {
            padding-right: 23px;
          }
        }
      }
    }

    .alignWrap {
      width: 100%;
      display: flex;

      ::v-deep {
        .el-radio-button {
          width: calc(100% / 3);

          &.is-active {
            .el-radio-button__inner {
              background: $component-borderFocus-color !important;
              border-color: $component-borderFocus-color !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 5px 15px;
            border-radius: 0;
            border-color: $component-border-color;
            background: $component-background-color;

            .iconfont {
              color: #FFFFFF;
              font-size: 18px;
            }
          }

          .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background: $component-background-color;
          }
        }
      }
    }

    .setTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      text-align: left;
      opacity: .7;
    }

    .radioGroup{
      width: 100%;
      display: flex;
      ::v-deep{
        .el-radio-button{
          flex: 1;
        }
      }
    }

    .InputWrap {
      display: flex;
      width: 100%;
      //margin-top: 5px;
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
      ::v-deep{
        .urlWrap {
          margin-top: -10px;
        }

      }
    }

    ::v-deep{
      .el-icon-question {
        cursor: pointer;
      }
      .el-radio .el-radio__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        opacity: 0.69;
      }
      .el-radio.is-checked .el-radio__label {
        opacity: 1;
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
  .numberWrap {
    display: flex;
    justify-content: space-between;

    .flexItem {
      width: 123px;
    }
  }

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

  .addWrap {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;

    ::v-deep {
      .el-button {
        width: 100%;
      }

      .icon-xinzeng {
        margin-right: 5px;
        vertical-align: bottom;
      }
    }
  }

}
</style>
