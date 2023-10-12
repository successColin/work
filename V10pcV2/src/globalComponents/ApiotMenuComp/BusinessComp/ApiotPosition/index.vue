<template>
  <div
    class="apiotPosition"
    :id="configData.compId"
    :style="`width:${configData.width}`"
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
      <div class="apiotPosition__box">
        <apiot-input
          placeholder="请选择地址"
          readonly
          :value="showArr.length ? showArr[0].name : ''"
        ></apiot-input>
        <i
          class="iconfont icon-jiahao"
          @click="showMap = true"
          v-if="configData.singleStatus !== 2"
        ></i>
      </div>
      <!-- <baidu-map-box
        style="width: 0; height: 0"
        :configData="configData"
        :curValue="parent.form[configData.compId]"
        @changeValue="changeValue"
      ></baidu-map-box> -->
      <baidu-map
        style="width: 0; height: 0; opacity: 0"
        center="金华"
        @ready="ready"
        ak="nuWah68S1WieW2AEwiT8T3Ro"
        v-if="!isConfig"
      ></baidu-map>
    </el-form-item>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
    <apiot-dialog :visible.sync="showMap" @sure-click="showMap = false">
      <baidu-map-box
        :configData="configData"
        :curValue="showArr"
        @changeValue="changeValue"
      ></baidu-map-box>
    </apiot-dialog>
  </div>
</template>

<script>
import compMixin from '../../compMixin';

const { BaiduMap } = window.VueBaiduMap;

export default {
  data() {
    return {
      curCompType: 2,
      showMap: false,
      showArr: [],
      unwatch: null,
      shouldPosition: true,
      BMap: null,
    };
  },
  mixins: [compMixin],

  components: {
    BaiduMap,
  },

  computed: {},

  mounted() {
    this.unwatch = this.$watch(`parent.form.${this.configData.compId}`, (v) => {
      let arr = v;
      let flag = true;
      if (!v) {
        flag = false;
        this.shouldPosition = true;
        this.showArr = [];
        this.setCenter();
        return;
      }
      if (!Array.isArray(v)) {
        try {
          arr = JSON.parse(v);
        } catch (error) {
          console.log(error);
          flag = false;
          this.shouldPosition = true;
          this.showArr = [];
          this.setCenter();
        }
      }
      if (flag) {
        console.log(arr);
        this.shouldPosition = false;
        this.showArr = arr;
      }
    });
  },

  methods: {
    changeValue(v) {
      this.parent.form[this.configData.compId] = [v];
    },
    ready({ BMap }) {
      this.BMap = BMap;
      this.setCenter();
    },
    setCenter() {
      if (
        (this.configData.defaultValueType === 2 || !this.BMap) &&
        this.showArr.length !== 0
      ) {
        return;
      }
      const geolocation = new this.BMap.Geolocation();
      // 开启SDK辅助定位
      geolocation.enableSDKLocation();
      geolocation.getCurrentPosition((r) => {
        if (
          r &&
          this.shouldPosition &&
          !this.parent.form[this.configData.compId]
        ) {
          this.changeValue({
            lng: r.point.lng,
            lat: r.point.lat,
            name: `${r.address.city}`,
          });
        } else {
          console.log('定位失败');
        }
      });
    },
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  },
};
</script>

<style lang="scss" scoped>
.apiotPosition {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.noHover {
    padding: 0px 15px 18px 20px;
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
      margin-bottom: 0;
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
  &__box {
    position: relative;
    .icon-jiahao {
      border-left: 1px solid #e9e9e9;
      position: absolute;
      margin-left: -32px;
      margin-top: 1px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #aaaaaa;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      &:not(.disabled):hover {
        color: $--color-primary;
      }
      &.disabled {
        cursor: default;
      }
    }
  }
}
</style>
