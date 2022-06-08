<!--
* @Description: icon 选择的dialog
* @Author: cmk
* @Date: 2021-04-28 15:34:39
* @Last Modified by: cmk
* @Last Modified time: 2021-04-28 15:34:39
-->
<template>
  <apiot-dialog
    v-on="$listeners"
    v-bind="$attrs"
    @sure-click="iconSelected"
    @clear-click="clearClick"
    :isShowClear="true"
  >
    <el-tabs v-model="curTab" @tab-click="handleClick" class="icon__tabs">
      <el-tab-pane :label="$t('menu.fonticon')" name="1" class="icon__tab">
        <div class="icon__left m-r-10">
          <apiot-sidebar
            ref="iconSidebar"
            :isNeedAdd="false"
            :paddingTop="0"
            :isNeedNum="false"
            :isNeedMove="false"
            :isNeedOperate="false"
            :groupList="iconSet"
            :curIndex.sync="curGroupIndex"
            @selectList="selectList"
          ></apiot-sidebar>
        </div>
        <div class="icon__right">
          <div class="icon__right--color">
            <apiot-input
              class="icon__right--input"
              slotType="prepend"
              :placeholder="
                $t('placeholder.pleaseEnterAny', { any: $t('menu.color') })
              "
              v-model="curColor"
              @focus="backColor = curColor"
              @blur="curColor ? '' : (curColor = backColor)"
            >
              <template slot="prepend">#</template>
            </apiot-input>
            <div class="icon__right--colorBox">
              <div
                class="color__item"
                v-for="item in colorArr"
                :key="item"
                :style="`backgroundColor:${item}`"
                @click="selectColor(item)"
              >
                <i
                  class="el-icon-check"
                  :style="`color:${'#' + curColor === item ? '#fff' : item}`"
                ></i>
              </div>
            </div>
          </div>
          <div
            class="icon__right--value"
            :placeholder="$t('common.noData')"
            :class="[{ apiotNoData: iconArr.length === 0 }]"
          >
            <div
              class="iconfont__box m-b-8"
              v-for="(item, index) in iconArr"
              :key="item.id"
              :class="[
                { active: iconfont === item.value },
                { 'm-r-8': (index + 1) % 4 !== 0 },
              ]"
              :title="item.iconName"
              @click="selectIcon(item)"
            >
              <i
                :class="`iconfont ${item.value}`"
                :style="`color:${
                  iconfont === item.value ? '#' + curColor : '#bbc3cd'
                }`"
              ></i>
              <p class="font__ellipsis">{{ item.iconName }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('menu.selficon')"
        name="2"
        class="icon__tab"
        v-loading="showLoading"
        v-if="showSelfIcon"
      >
        <div class="icon__left m-r-10">
          <apiot-sidebar
            ref="iconSidebar1"
            :isNeedAdd="false"
            :paddingTop="0"
            :isNeedNum="false"
            :isNeedMove="false"
            :isNeedOperate="false"
            :groupList="selfIcon"
            :curIndex.sync="curGroupIndex"
            @selectList="selectSelfList"
          ></apiot-sidebar>
        </div>
        <div class="icon__right">
          <div
            class="icon__right--value"
            :placeholder="$t('common.noData')"
            :class="[{ apiotNoData: imgArr.length === 0 }]"
          >
            <div
              class="iconfont__box m-b-8"
              v-for="(item, index) in imgArr"
              :key="item.id"
              :class="[
                { active: activeImgId === item.id },
                { 'm-r-8': (index + 1) % 4 !== 0 },
              ]"
              :title="item.iconName"
              @click="selectImg(item)"
            >
              <img :src="item.iconUrl" :alt="item.iconName" />
              <p class="font__ellipsis">{{ item.iconName }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <search-input
      @getList="getList"
      v-model="keywords"
      class="icon__search"
    ></search-input>
  </apiot-dialog>
</template>

<script>
import { selectColorArr } from '@/config';
import { getIconList } from '@/api/iconManage';
import { iconSet } from './icon.json';

export default {
  props: {
    // 选中的iconfont
    iconFontClass: {
      type: String,
      default: ''
    },
    // 选中的iconfont的颜色
    iconFontColor: {
      type: String,
      default: ''
    },
    // iconImgUrl
    iconImgUrl: {
      type: String,
      default: ''
    },
    // 是否显示自定义图标
    showSelfIcon: {
      type: Boolean,
      default: false
    },
    // 查询图标 1 是pc 2 是app
    iconType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showLoading: false,
      curTab: '1', // 1 字体图标 2自定义图标
      keywords: '',
      iconSet: [],
      selfIcon: [],
      iconArr: [], // 图标
      imgArr: [], // 自定义图片
      backImgArr: [],
      curGroupIndex: 0,
      colorArr: selectColorArr,
      curColor: '5A80ED', // 当前颜色
      backColor: '5A80ED', // 当前颜色
      iconfont: '', // 当前iconfont
      imgUrl: '', // 当前img
      activeImgId: '' // 当前选中图片的id
    };
  },

  components: {},

  computed: {},

  methods: {
    // 初始化dialog
    initDialog() {
      this.iconSet = iconSet.slice(3);
      this.selfIcon = iconSet.slice(0, 3);
      this.curTab = '1';
      this.curGroupIndex = 0;
      this.iconArr = this.iconSet[this.curGroupIndex].groupArr;
      this.$refs.iconSidebar.selectList(this.iconSet[this.curGroupIndex], this.curGroupIndex);

      this.iconfont = this.iconFontClass;
      if (this.iconFontColor) {
        this.curColor = this.iconFontColor.slice(1);
      }
    },
    // 字体图标切换数据
    selectList() {
      this.iconArr = this.iconSet[this.curGroupIndex].groupArr.filter(
        (item) => item.iconName.indexOf(this.keywords) !== -1
      );
    },
    selectSelfList(item) {
      this.getIconList(item);
    },
    // 选中icon 的确认事件
    iconSelected() {
      this.$emit('update:iconFontClass', this.iconfont);
      this.$emit('update:iconFontColor', `#${this.curColor}`);
      this.$emit('update:iconImgUrl', `${this.imgUrl}`);

      this.$emit('iconSelected', this.iconfont, `#${this.curColor}`, this.imgUrl);
      this.$emit('update:visible', false);
    },
    // 更改tab
    handleClick() {
      this.curGroupIndex = 0;
      this.keywords = '';
      if (this.curTab === '2') {
        // this.getIconList();
        this.$refs.iconSidebar1.selectList(this.selfIcon[this.curGroupIndex], this.curGroupIndex);
      }
      if (this.curTab === '1') {
        this.initDialog();
      }
    },
    selectColor(item) {
      this.curColor = item.slice(1);
    },
    selectIcon(item) {
      this.iconfont = item.value;
      this.imgUrl = '';
    },
    selectImg(item) {
      this.imgUrl = item.iconUrl;
      this.activeImgId = item.id;
      this.iconfont = '';
    },
    getList() {
      if (this.curTab === '1') {
        this.selectList();
      }
      if (this.curTab === '2') {
        this.imgArr = this.backImgArr.filter(
          (value) => value.iconName.indexOf(this.keywords) !== -1
        );
      }
    },
    async getIconList(item) {
      this.showLoading = true;
      try {
        const params = {
          iconClassify: item.id,
          iconType: this.iconType
        };
        const data = await getIconList(params);
        this.showLoading = false;
        this.imgArr = data.filter((value) => value.iconName.indexOf(this.keywords) !== -1);
        this.backImgArr = data;
      } catch (error) {
        this.showLoading = false;
      }
    },
    clearClick() {
      this.iconfont = 'icon-jiahao';
      this.curColor = '';
      this.imgUrl = '';

      this.$emit('update:iconFontClass', this.iconfont);
      this.$emit('update:iconFontColor', `#${this.curColor}`);
      this.$emit('update:iconImgUrl', `${this.imgUrl}`);

      this.$emit('iconSelected', this.iconfont, `#${this.curColor}`, this.imgUrl);
    }
  }
};
</script>

<style lang='scss' scoped>
.icon {
  &__tabs {
    ::v-deep {
      .el-tabs__item {
        height: 32px;
        line-height: 22px;
        padding: 0;
        width: 102px;
        text-align: center;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #e9e9e9;
      }
      .el-tabs__header {
        margin-bottom: 10px;
      }
    }
  }
  &__tab {
    height: 371px;
    overflow: hidden;
    display: flex;
  }
  &__search {
    position: absolute !important;
    right: 20px;
    margin-top: -4px;
  }
  &__left {
    box-sizing: border-box;
    width: 180px;
    height: 100%;
    border: 1px solid #e9e9e9;
    border-bottom: 0 none;
  }
  &__right {
    width: 410px;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    border-bottom: 0 none;
    &--color {
      height: 46px;
      box-sizing: border-box;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
    }
    &--value {
      height: calc(100% - 46px);
      position: relative;
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      padding: 10px 0px 0 10px;
      box-sizing: border-box;
      align-content: flex-start;
      .iconfont__box {
        width: 92px;
        height: 106px;
        border: 1px solid transparent;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;

        cursor: pointer;
        .iconfont {
          margin-top: 22px;
          font-size: 38px;
          color: #bbc3cd;
          will-change: color;
          transition: color 400ms;
        }
        p {
          margin-top: 17px;
          line-height: 16px;
          font-size: 12px;
          font-weight: 400;
          color: #666666;
        }
        &:hover {
          border-color: #e9e9e9;
        }
        &.active {
          background: #fafafa;
          border-color: #e9e9e9;
        }
        img {
          margin-top: 22px;
          width: 38px;
          height: 38px;
        }
      }
    }
    &--input {
      width: 120px;
      margin-left: 10px;
      ::v-deep {
        .el-input-group__prepend {
          padding: 0 9px;
        }
        .el-input__inner {
          height: 28px;
          line-height: 28px;
          padding: 0 10px;
        }
      }
    }
    &--colorBox {
      flex: 1;
      display: flex;
      justify-content: space-evenly;
      .color__item {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #5a80ed;
        border-radius: 4px;
        cursor: pointer;
        .el-icon-check {
          will-change: color;
          transition: color 400ms;
        }
      }
    }
  }
}
</style>
