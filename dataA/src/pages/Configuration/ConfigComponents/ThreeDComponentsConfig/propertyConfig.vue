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
    <!--    <div class="propsSetting">-->
    <!--      <p class="setTitle">组件id</p>-->
    <!--      <c-input-->
    <!--          class="businessWrap"-->
    <!--          type="text"-->
    <!--          disabled-->
    <!--          :value="getComponentInfo.componentId"/>-->
    <!--    </div>-->
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
      <el-collapse-item name="1" title="基础设置">
        <div>
          <div class="propsSetting">
            <div class="setTitle">背景色</div>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.bgColor"
                show-alpha
                @change="(value) => changeStyles(value, 'bgColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting">
            <p class="setTitle">上传模型</p>
            <div class="wrap">
              <c-upload
                  :isPublic="true"
                  :url="getComponentInfo.stylesObj.url"
                  :before-upload="(file)=>beforeAvatarUpload(file, accept)"
                  @changeScreenBg="(url) => changeStyles(url, 'url')"
                  :accept="accept"
              >
                <template v-slot:tip>
                  <div class="el-upload__tip">只能上传glb格式的模型</div>
                </template>
              </c-upload>
            </div>
          </div>
          <div class="propsSetting">
            <span class="setTitle">模型大小</span>
            <c-input
                type="number"
                :step="0.1"
                :min="0.1"
                :numberValue="getComponentInfo.stylesObj.zoomLevel"
                @Input-Change="(value) => changeStyles(Number(value), 'zoomLevel')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">模型位置X轴(水平方向)</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.modelPosX"
                @change="(value) => changeStyles(value, 'modelPosX')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">模型位置Y轴(上下方向)</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.modelPosY"
                @change="(value) => changeStyles(value, 'modelPosY')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">模型位置Z轴(前后方向)</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.modelPosZ"
                @change="(value) => changeStyles(value, 'modelPosZ')"/>
          </div>

          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">辅助线</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableAuxiliaryLines"
                @change="(value) => changeStyles(value, 'enableAuxiliaryLines')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">禁用右键平移</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enablePan"
                @change="(value) => changeStyles(value, 'enablePan')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">禁用缩放</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableZoom"
                @change="(value) => changeStyles(value, 'enableZoom')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">禁用旋转</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableRotate"
                @change="(value) => changeStyles(value, 'enableRotate')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用入场动画</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableEnterAnimate"
                @change="(value) => changeStyles(value, 'enableEnterAnimate')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用自动旋转</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableRotateAnimate"
                @change="(value) => changeStyles(value, 'enableRotateAnimate')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.enableRotateAnimate">
            <span class="setTitle">旋转方向</span>
            <c-select
                :value="getComponentInfo.stylesObj.rotationDirection"
                @change="(value) => changeStyles(value, 'rotationDirection')"
                :options="directionOptions"
            ></c-select>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.enableRotateAnimate">
            <span class="setTitle">旋转速度</span>
            <c-input
                type="number"
                :step="0.001"
                :numberValue="getComponentInfo.stylesObj.rotationSpeed"
                @Input-Change="(value) => changeStyles(Number(value), 'rotationSpeed')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">垂直旋转最小角度</span>
            <c-input
                type="number"
                :step="1"
                :min="0"
                :max="180"
                :numberValue="getComponentInfo.stylesObj.minPolarAngle"
                @Input-Change="(value) => changeStyles(Number(value), 'minPolarAngle')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">垂直旋转最大角度</span>
            <c-input
                type="number"
                :step="1"
                :min="0"
                :max="180"
                :numberValue="getComponentInfo.stylesObj.maxPolarAngle"
                @Input-Change="(value) => changeStyles(Number(value), 'maxPolarAngle')"/>
          </div>

        </div>
      </el-collapse-item>




      <el-collapse-item name="2" title="相机视角">
        <div class="propsSetting">
          <span class="setTitle">X轴(水平方向)</span>
          <c-slider
              :min="-200"
              :max="200"
              :value="getComponentInfo.stylesObj.cameraX"
              @change="(value) => changeStyles(value, 'cameraX')"/>
        </div>

        <div class="propsSetting">
          <span class="setTitle">Y轴(上下方向)</span>
          <c-slider
              :min="-200"
              :max="200"
              :value="getComponentInfo.stylesObj.cameraY"
              @change="(value) => changeStyles(value, 'cameraY')"/>
        </div>

        <div class="propsSetting">
          <span class="setTitle">Z轴(前后方向)</span>
          <c-slider
              :min="-200"
              :max="200"
              :value="getComponentInfo.stylesObj.cameraZ"
              @change="(value) => changeStyles(value, 'cameraZ')"/>
        </div>
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">启用重置按钮</span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableResetBtn"
              @change="(value) => changeStyles(value, 'enableResetBtn')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div v-if="getComponentInfo.stylesObj.enableResetBtn">
          <location-properties
              :widthValue="getComponentInfo.stylesObj.resetBtnWidth"
              :heightValue="getComponentInfo.stylesObj.resetBtnHeight"
              :leftValue="getComponentInfo.stylesObj.resetBtnLeft"
              :topValue="getComponentInfo.stylesObj.resetBtnTop"
              widthKey="resetBtnWidth"
              heightKey="resetBtnHeight"
              leftKey="resetBtnLeft"
              topKey="resetBtnTop"
              @changeTitle="({value, key}) => changeStyles(value, key)"
          ></location-properties>
          <div class="propsSetting flexItem">
            <div class="setTitle">背景色</div>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.resetBtnBgColor"
                show-alpha
                @change="(value) => changeStyles(value, 'resetBtnBgColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting flexItem">
            <p class="setTitle">倒角</p>
            <div>
              <c-input
                  type="number"
                  :min="0"
                  :numberValue="getComponentInfo.stylesObj.resetBtnBorderRadius"
                  @Input-Change="(value) => changeStyles(value, 'resetBtnBorderRadius')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">上传背景图</p>
            <div class="wrap">
              <c-upload
                  :isPublic="true"
                  :url="getComponentInfo.stylesObj.resetBtnBgUrl"
                  :before-upload="(file)=>beforeAvatarUpload(file, accept1)"
                  @changeScreenBg="(url) => changeStyles(url, 'resetBtnBgUrl')"
                  :accept="accept1"
              >
                <template v-slot:tip>
                  <div class="el-upload__tip">只能上传jpg,png,svg,jpeg格式的模型</div>
                </template>
              </c-upload>
            </div>
          </div>

          <div class="numberWrap" v-if="getComponentInfo.stylesObj.resetBtnBgUrl">
            <div class="propsSetting flexItem">
              <p class="setTitle">背景图宽</p>
              <div>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.bgUrlWidth"
                    @Input-Change="(value) => changeStyles(value, 'bgUrlWidth')"/>
              </div>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">背景图高</p>
              <div>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.bgUrlHeight"
                    @Input-Change="(value) => changeStyles(value, 'bgUrlHeight')"/>
              </div>
            </div>
          </div>
        </div>

        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">启用自定义视角</span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableSysPresets"
              @change="(value) => changeStyles(value, 'enableSysPresets')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <el-collapse v-if="getComponentInfo.stylesObj.enableSysPresets">
          <el-collapse-item title="预设视角按钮" name="1">
            <location-properties
                title="按钮盒子位置属性"
                :widthValue="getComponentInfo.stylesObj.presetGroupWidth"
                :heightValue="getComponentInfo.stylesObj.presetGroupHeight"
                :leftValue="getComponentInfo.stylesObj.presetGroupLeft"
                :topValue="getComponentInfo.stylesObj.presetGroupTop"
                widthKey="presetGroupWidth"
                heightKey="presetGroupHeight"
                leftKey="presetGroupLeft"
                topKey="presetGroupTop"
                @changeTitle="({value, key}) => changeStyles(value, key)"
            ></location-properties>
            <div class="propsSetting flexItem">
              <p class="setTitle">按钮倒角(px)</p>
              <div>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.presetGroupBorderRadius"
                    @Input-Change="(value) => changeStyles(value, 'presetGroupBorderRadius')"/>
              </div>
            </div>
            <div class="numberWrap">
              <div class="propsSetting flexItem">
                <p class="setTitle">按钮宽</p>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.presetBtnWidth"
                    @Input-Change="(value) => changeStyles(value, 'presetBtnWidth')"/>
              </div>
              <div class="propsSetting flexItem">
                <p class="setTitle">按钮高</p>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.presetBtnHeight"
                    @Input-Change="(value) => changeStyles(value, 'presetBtnHeight')"/>
              </div>
            </div>

            <div class="numberWrap">
              <div class="propsSetting flexItem">
                <p class="setTitle">激活图标</p>
                <c-upload
                    :before-upload="(file)=>beforeAvatarUpload(file, accept1)"
                    @changeScreenBg="(value) => changeStyles(value, 'presetGroupActiveBgUrl')"
                    :isPublic="true"
                    :url="getComponentInfo.stylesObj.presetGroupActiveBgUrl"
                    :accept="accept1"
                >
                </c-upload>
              </div>
              <div class="propsSetting flexItem">
                <p class="setTitle">常态图标</p>
                <div>
                  <c-upload
                      :isPublic="true"
                      :before-upload="(file)=>beforeAvatarUpload(file, accept1)"
                      :url="getComponentInfo.stylesObj.presetGroupNormalBgUrl"
                      @changeScreenBg="(value) => changeStyles(value, 'presetGroupNormalBgUrl')"
                      :accept="accept1"
                  >
                  </c-upload>
                </div>
              </div>
            </div>

            <div class="numberWrap">
              <div class="propsSetting flexItem">
                <p class="setTitle">激活背景色</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.presetGroupActiveBgColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'presetGroupActiveBgColor')"
                    :predefine="predefineColors">
                </c-color-picker>
              </div>
              <div class="propsSetting flexItem">
                <p class="setTitle">常态背景色</p>
                <div>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.presetGroupNormalBgColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'presetGroupNormalBgColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
            </div>
            <div class="numberWrap">
              <div class="propsSetting flexItem">
                <p class="setTitle">激活字体色</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.presetHoverColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'presetHoverColor')"
                    :predefine="predefineColors">
                </c-color-picker>
              </div>
              <div class="propsSetting flexItem">
                <p class="setTitle">常态字体色</p>
                <div>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.presetColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'presetColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
            </div>
            <TextStylesConfig
                :isNeed="false"
                title="字体样式"
                :fontFamilyValue="getComponentInfo.stylesObj.presetFontFamily"
                :fontWeightValue="getComponentInfo.stylesObj.presetFontWeight"
                :fontSizeValue="getComponentInfo.stylesObj.presetFontSize"
                @change="({value, key}) => changeStyles(value, `preset${key}`)"
            ></TextStylesConfig>


          </el-collapse-item>
          <el-collapse-item title="系统预设视角" name="2">
            <SystemPreset
                @change="(value) => changeTitle(value, 'systemPresetsConfig')"
                :value="getComponentInfo.systemPresetsConfig"/>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>





      <el-collapse-item name="3" title="光源设置">
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">环境光
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">该灯光在全局范围内均匀地照亮场景中的所有对象。
该灯光不能用于投射阴影，因为它没有方向。</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <el-switch
              :value="enableAmbientLight"
              @change="(value) => changeStyles(value, 'enableAmbientLight')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div class="propsSetting" v-if="enableAmbientLight">
          <div class="setTitle">环境光颜色</div>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              v-model="getComponentInfo.stylesObj.ambientLightColor"
              show-alpha
              @change="(value) => changeStyles(value, 'ambientLightColor')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting" v-if="enableAmbientLight">
          <div class="setTitle">环境光强度</div>
          <c-input
              type="number"
              :step="0.1"
              :min="0"
              :numberValue="getComponentInfo.stylesObj.ambientLightIntensity"
              @Input-Change="(value) => changeStyles(Number(value), 'ambientLightIntensity')"/>
        </div>

        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">平行光
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">平行光是向特定方向发射的光。这种光的行为就好像它是无限遥远的，并且从它产生的光线都是平行的。这方面的常见用例是模拟日光；太阳离得足够远，它的位置可以被认为是无限的，所有来自它的光线都是平行的。这种光可以投射阴影。</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <el-switch
              :value="enableDirectionLight"
              @change="(value) => changeStyles(value, 'enableDirectionLight')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div v-if="enableDirectionLight">
          <div class="propsSetting">
            <div class="setTitle">平行光颜色</div>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.directionLightColor"
                show-alpha
                @change="(value) => changeStyles(value, 'directionLightColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting">
            <div class="setTitle">平行光强度</div>
            <c-input
                type="number"
                :step="0.1"
                :min="0"
                :numberValue="getComponentInfo.stylesObj.directionLightIntensity"
                @Input-Change="(value) => changeStyles(Number(value), 'directionLightIntensity')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">平行光源X轴(水平方向)位置</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.directionLightX"
                @change="(value) => changeStyles(value, 'directionLightX')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">平行光源Y轴(上下方向)位置</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.directionLightY"
                @change="(value) => changeStyles(value, 'directionLightY')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">平行光源Z轴(前后方向)位置</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.directionLightZ"
                @change="(value) => changeStyles(value, 'directionLightZ')"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">平行光阴影</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableDirectionLightShadow"
                @change="(value) => changeStyles(value, 'enableDirectionLightShadow')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>

        </div>

        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">半球光
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">该灯光位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
此灯光不能用于投射阴影</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <el-switch
              :value="enableHemisphereLight"
              @change="(value) => changeStyles(value, 'enableHemisphereLight')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div v-if="enableHemisphereLight">
          <div class="numberWrap">
            <div class="propsSetting flexItem">
              <div class="setTitle">天空光颜色</div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.hemisphereLightSkyColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'hemisphereLightSkyColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <div class="setTitle">地面光颜色</div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.hemisphereLightGroundColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'hemisphereLightGroundColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <div class="setTitle">半球光强度</div>
            <c-input
                type="number"
                :step="0.1"
                :min="0"
                :numberValue="getComponentInfo.stylesObj.hemisphereLightIntensity"
                @Input-Change="(value) => changeStyles(Number(value), 'hemisphereLightIntensity')"/>
          </div>
        </div>

        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">点状光
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">从一个点向所有方向发射的光。这方面的一个常见用例是灯泡发出的光。
此灯光可以投射阴影。</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <el-switch
              :value="enablePointLight"
              @change="(value) => changeStyles(value, 'enablePointLight')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div v-if="enablePointLight">
          <div class="propsSetting">
            <div class="setTitle">点状光颜色</div>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.pointLightColor"
                show-alpha
                @change="(value) => changeStyles(value, 'pointLightColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting">
            <div class="setTitle">点状光强度</div>
            <c-input
                type="number"
                :step="0.1"
                :min="0"
                :numberValue="getComponentInfo.stylesObj.pointLightIntensity"
                @Input-Change="(value) => changeStyles(Number(value), 'pointLightIntensity')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">点状光源X轴(水平方向)位置</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.pointLightLightX"
                @change="(value) => changeStyles(value, 'pointLightLightX')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">点状光源Y轴(上下方向)位置</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.pointLightLightY"
                @change="(value) => changeStyles(value, 'pointLightLightY')"/>
          </div>

          <div class="propsSetting">
            <span class="setTitle">点状光源Z轴(前后方向)位置</span>
            <c-slider
                :min="-200"
                :max="200"
                :value="getComponentInfo.stylesObj.pointLightLightZ"
                @change="(value) => changeStyles(value, 'pointLightLightZ')"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">点状光阴影</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enablePointLightShadow"
                @change="(value) => changeStyles(value, 'enablePointLightShadow')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" title="后期处理">
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">物体描边</span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableHoverEffects"
              @change="(value) => changeStyles(value, 'enableHoverEffects')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div v-if="getComponentInfo.stylesObj.enableHoverEffects">
          <div class="numberWrap">
            <div class="propsSetting flexItem">
              <div class="setTitle">显示物体描边颜色</div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.visibleEdgeColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'visibleEdgeColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <div class="setTitle">隐藏物体描边颜色</div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.hiddenEdgeColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'hiddenEdgeColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>

          <div class="propsSetting">
            <span class="setTitle">模糊度</span>
            <c-slider
                :min="0.01"
                :max="10"
                :step="0.01"
                :value="getComponentInfo.stylesObj.edgeStrength"
                @change="(value) => changeStyles(value, 'edgeStrength')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">光晕</span>
            <c-slider
                :min="0.01"
                :max="1"
                :step="0.01"
                :value="getComponentInfo.stylesObj.edgeGlow"
                @change="(value) => changeStyles(value, 'edgeGlow')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">强度</span>
            <c-slider
                :min="1"
                :max="10"
                :step="0.01"
                :value="getComponentInfo.stylesObj.edgeThickness"
                @change="(value) => changeStyles(value, 'edgeThickness')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">闪烁频率</span>
            <c-slider
                :min="0"
                :max="10"
                :step="0.01"
                :value="getComponentInfo.stylesObj.pulsePeriod"
                @change="(value) => changeStyles(value, 'pulsePeriod')"/>
          </div>

        </div>
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">外发光</span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableGlowEffects"
              @change="(value) => changeStyles(value, 'enableGlowEffects')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div v-if="getComponentInfo.stylesObj.enableGlowEffects">
          <div class="propsSetting">
            <span class="setTitle">强度</span>
            <c-slider
                :min="0"
                :max="3"
                :step="0.01"
                :value="getComponentInfo.stylesObj.strength"
                @change="(value) => changeStyles(value, 'strength')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">阈值</span>
            <c-slider
                :min="0"
                :max="1"
                :step="0.01"
                :value="getComponentInfo.stylesObj.threshold"
                @change="(value) => changeStyles(value, 'threshold')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">曝光量</span>
            <c-slider
                :min="0.1"
                :max="2"
                :step="0.01"
                :value="getComponentInfo.stylesObj.exposure"
                @change="(value) => changeStyles(value, 'exposure')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">半径</span>
            <c-slider
                :min="0"
                :max="10"
                :step="0.01"
                :value="getComponentInfo.stylesObj.radius"
                @change="(value) => changeStyles(value, 'radius')"/>
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item title="全局属性" name="8">
        <div class="propsSetting">
          <span class="setTitle">模型数据标识符
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">用于标识模型和数据对应</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <c-input
              type="text"
              :maxlength="16"
              :value="getComponentInfo.stylesObj.identifier" @Input-Change="(value) => changeStyles(value, 'identifier')"/>
        </div>
        <div class="propsSetting">
          <span class="setTitle">特殊模型标识符
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">设计模型时对模型添加自定义的标识</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <c-input
              type="text"
              :maxlength="16"
              :value="getComponentInfo.stylesObj.customIdentifier" @Input-Change="(value) => changeStyles(value, 'customIdentifier')"/>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5" title="模型显隐设置">
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">使用特殊模型标识符过滤模型</span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableCustomShowOrHideModels"
              @change="(value) => changeStyles(value, 'enableCustomShowOrHideModels')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>

        <div class="propsSetting">
          <span class="setTitle">需要控制显隐模型</span>
          <c-select
              :options="meshOptions"
              multiple
              filterable
              collapse-tags
              :value="getComponentInfo.stylesObj.needShowOrHideModels"
              @change="(value) => changeModels(value)"
          ></c-select>
        </div>
        <div class="propsSetting">
          <span class="setTitle">显隐设置</span>
          <ShowOrHideModel
              :key="getComponentInfo.componentId"
              @change="(value) => changeTitle(value, 'showOrHideModelsConfig')"
              v-model="getComponentInfo.showOrHideModelsConfig"/>
        </div>
      </el-collapse-item>
      <el-collapse-item title="模型动画控制" name="6">
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">模型动画
            <el-tooltip
                class="item"
                effect="dark"
                popper-class="sqlTooltip"
                placement="top">
                <div slot="content">如果单独设置模型动画条件，与该配置无关</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
          </span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableAllAnimate"
              @change="(value) => changeStyles(value, 'enableAllAnimate')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
        <div class="propsSetting">
          <span class="setTitle">受控动画</span>
          <c-select
              :options="animateOptions"
              multiple
              filterable
              clearable
              collapse-tags
              :value="getComponentInfo.stylesObj.needControlAnimate"
              @change="(value) => changeAnimateModels(value)"
          ></c-select>
        </div>
        <div class="propsSetting">
          <span class="setTitle">动画设置</span>
          <ShowOrHideModel
              label="动画生效"
              :key="getComponentInfo.componentId"
              @change="(value) => changeTitle(value, 'animateConfig')"
              v-model="getComponentInfo.animateConfig"/>
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="7">
        <div class="ellipsisWrap flex propsSetting">
          <span class="setTitle">使用特殊模型标识符过滤模型</span>
          <el-switch
              :value="getComponentInfo.stylesObj.enableCustomOperationModels"
              @change="(value) => changeStyles(value, 'enableCustomOperationModels')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>

        <div class="propsSetting">
          <span class="setTitle">交互模型</span>
          <c-select
              :options="childMesh"
              multiple
              filterable
              clearable
              collapse-tags
              :value="getComponentInfo.stylesObj.needOperationModels"
              @change="(value) => changeOperationModels(value)"
          ></c-select>
        </div>
        <div class="propsSetting">
          <span class="setTitle">交互配置</span>
          <OperateConfig
              :activeComponent="getComponentInfo"
              :key="getComponentInfo.componentId"
              @change="(value) => changeTitle(value, 'operationModelsConfig')"
              v-model="getComponentInfo.operationModelsConfig"
          />
        </div>

      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
import ShowOrHideModel from './components/modelShowOrHideConfig';
import OperateConfig from './components/operateConfig';
import SystemPreset from './components/systemPreset';
import TextStylesConfig from '../TextStylesConfig/index';
import {predefineColors} from '@/constants/global'
import Bus from '@/utils/bus';

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
      meshOptions: [],
      childMesh: [],
      animationOptions: [],
      accept: '.glb', // 支持的模型
      accept1: '.jpg,.png,.svg,.jpeg',
      enable: true,
      directionOptions: [
        {
          label: 'x',
          value: 'x'
        }, {
          label: 'y',
          value: 'y'
        }, {
          label: 'z',
          value: 'z'
        }
      ],
      activeName: '',
      predefineColors
    };
  },

  components: {
    ShowOrHideModel,
    OperateConfig,
    SystemPreset,
    TextStylesConfig
  },

  computed: {
    animateOptions() {
      return this.animationOptions.map((item, i) => ({ label: item.name, value: i }))
    },
    eventKey() {
      const {componentId} = this.getComponentInfo;
      return `threeD_${componentId}`;
    },
    enableAmbientLight() { // 启用环境光
      return this.getComponentInfo.stylesObj.enableAmbientLight;
    },
    enableHemisphereLight() { // 启用半球光
      return this.getComponentInfo.stylesObj.enableHemisphereLight;
    },
    enableDirectionLight() { // 启用平行光
      return this.getComponentInfo.stylesObj.enableDirectionLight;
    },
    enablePointLight() { // 启用点状光
      return this.getComponentInfo.stylesObj.enablePointLight;
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

  mounted() {
    Bus.$off(this.eventKey).$on(this.eventKey, ({meshOptions = [], animationOptions = [], childMesh = []}) => {
      console.log(animationOptions, childMesh);
      this.meshOptions = meshOptions;
      this.animationOptions = animationOptions;
      this.childMesh = childMesh;
    });
    console.log('mounted');
  },
  watch: {},
  methods: {
    beforeAvatarUpload(file, accept) {
      const typeArr = file.type.split('/');
      const type = typeArr[typeArr.length - 1];
      const isJPG = accept.indexOf(type) > -1;

      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('请上传指定格式的文件');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    async changeOperationModels(value) {
      const { operationModelsConfig = [] } = this.getComponentInfo;
      if (!value.length) {
        await this.changeStyles(value, 'needOperationModels');
        await this.changeTitle([], 'operationModelsConfig');
        return;
      }
      const arr = value.reduce((init, pre) => {
        const current = operationModelsConfig.find((item) => item.id === pre);
        if (current) {
          return init.concat([current]);
        }
        const showArr = this.childMesh.find((item) => item.value === pre);
        if (showArr) {
          return init.concat([{...showArr, interactionMode: 1}]);
        }
        return init;
      }, []);
      await this.changeStyles(value, 'needOperationModels');
      await this.changeTitle(arr, 'operationModelsConfig');
    },
    async changeModels(value) {
      const { showOrHideModelsConfig = [] } = this.getComponentInfo;
      if (!value.length) {
        await this.changeStyles(value, 'needShowOrHideModels');
        await this.changeTitle([], 'showOrHideModelsConfig');
        return;
      }
      const arr = value.reduce((init, pre) => {
        const current = showOrHideModelsConfig.find((item) => item.id === pre);
        if (current) {
          return init.concat([current]);
        }
        const showArr = this.meshOptions.find((item) => item.value === pre);
        if (showArr) {
          return init.concat([{...showArr, conditionsArr: []}]);
        }
        return init;
      }, []);
      await this.changeStyles(value, 'needShowOrHideModels');
      await this.changeTitle(arr, 'showOrHideModelsConfig');
    },
    async changeAnimateModels(value) {
      const { animateConfig = [] } = this.getComponentInfo;
      if (!value.length) {
        await this.changeStyles(value, 'needControlAnimate');
        await this.changeTitle([], 'animateConfig');
        return;
      }
      const arr = value.reduce((init, pre) => {
        const current = animateConfig.find((item) => item.value === pre);
        if (current) {
          return init.concat([current]);
        }
        const showArr = this.animateOptions.find((item) => item.value === pre);
        if (showArr) {
          return init.concat([{...showArr, conditionsArr: []}]);
        }
        return init;
      }, []);
      await this.changeStyles(value, 'needControlAnimate');
      await this.changeTitle(arr, 'animateConfig');
    },
    async changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
      if (key === 'url' && !value) {
        styleObj = {
          ...styleObj,
          needShowOrHideModels: [],
          needControlAnimate: [],
          needOperationModels: [],
          enableCustomOperationModels: false,
          enableCustomShowOrHideModels: false
        }
        info.animateConfig = [];
        info.showOrHideModelsConfig = [];
        info.operationModelsConfig = [];
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      await this.$store.dispatch('config/updateComponentList', list);
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
    async changeTitle(value, key) { // 设置组件名称
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      await this.$store.dispatch('config/updateComponentList', list);
    }
  },
  beforeDestroy() {
    Bus.$off(this.eventKey);
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

  .numberWrap {
    display: flex;
    justify-content: space-between;

    .flexItem {
      width: 123px;
    }
    ::v-deep {
      .el-upload--picture-card{
        height: 30px;
      }
    }
  }
}
</style>
