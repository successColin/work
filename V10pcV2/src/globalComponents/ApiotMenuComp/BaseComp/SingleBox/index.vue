<template>
  <div
    class="singleBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      v-if="!isTable"
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

      <el-radio-group
        :class="[{ isVertical: configData.anyway === 2 }]"
        v-model="parent.form[configData.compId]"
        :disabled="configData.canReadonly"
      >
        <el-radio
          v-for="item in effectArr"
          :key="item.value"
          :label="item.value"
          :disabled="configData.canReadonly"
        >
          <div class="option" v-if="configData.dropDownStyle === 2">
            <span
              class="option__bg"
              :style="`background:${getDictInfo(
                item.value,
                'color',
              )};color:${getDictInfo(item.value, 'fontColor')}`"
              >{{ item.name }}</span
            >
          </div>
          <div
            class="option"
            v-else-if="configData.dropDownStyle === 3 && item.icon"
          >
            <span class="option__self">
              <img
                :src="$parseImgUrl(item.icon.imgUrl)"
                v-if="item.icon.imgUrl"
              />
              <i
                v-else
                :class="`iconfont ${item.icon.icon}`"
                :style="`color:${item.icon.color}`"
              ></i
              >{{ item.name }}</span
            >
          </div>
          <div class="option" v-else-if="configData.dropDownStyle === 4">
            <span class="option__self">
              <i class="circle" :style="`background:${item.color}`"></i
              >{{ item.name }}</span
            >
          </div>
          <div class="option" v-else>
            {{ item.name }}
          </div>
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <div class="table" v-else>
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw">数据占位</p>
    </div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    getDictKey() {
      if (this.configData.dataSource.dictObj) {
        return this.configData.dataSource.dictObj.dictKey;
      }
      return '';
    },
    getDictArr() {
      let tempData = [];
      if (this.isConfig && this.configData.dataSource.dictObj) {
        tempData = this.configData.dataSource.dictObj.dictValue;
      } else if (this.getDictKey) {
        tempData = this.$store.getters.getCurDict(this.getDictKey);
      }
      if (Array.isArray(tempData)) {
        tempData = JSON.parse(JSON.stringify(tempData));
        if (this.configData.sort === 2) {
          tempData.reverse();
        }
        if (tempData.length) {
          return tempData;
        }
      }
      if (this.isConfig || this.isPreview) {
        return [
          {
            name: '选项1',
            value: 1,
          },
          {
            name: '选项2',
            value: 2,
          },
        ];
      }
      return [];
    },
    getDictObj() {
      const obj = {};
      if (this.getDictArr.length) {
        this.getDictArr.forEach((dict) => {
          obj[dict.value] = dict;
        });
      }
      return obj;
    },
    getDictInfo() {
      // info: color 背景色
      // info: fontColor 字体色
      // icon: icon 图标
      return (item, info) => {
        if (this.getDictObj[item]) {
          return this.getDictObj[item][info] || '';
        }
        return '';
      };
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
.singleBox {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 20px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
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
      .el-radio {
        display: inline-flex;
        align-items: center;
        height: 32px;
        &:not(.is-disabled):hover {
          .option {
            color: $--color-primary;
          }
          .el-radio__inner {
            border-color: $--color-primary;
          }
        }
      }
      .el-radio__input {
        height: 14px;
        &.is-focus {
          .el-radio__inner {
            border-color: #dcdfe6;
          }
        }
        &.is-disabled.is-checked {
          .el-radio__inner {
            border-color: $--hover-bgColor;
            &:after {
              background-color: $--hover-bgColor;
            }
          }
        }
      }
    }
  }
  .isVertical {
    ::v-deep {
      .el-radio {
        display: flex;
      }
    }
  }
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    p:nth-child(2) {
      color: #333;
      border-top: 1px solid #e9e9e9;
    }
  }
}
.option {
  color: #333;
  &__bg {
    max-width: 100%;
    box-sizing: border-box;
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    height: 24px;
    background: $--color-primary;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
  }
  &__self {
    display: flex;
    align-items: center;
    img {
      width: 24px;
    }
    i {
      font-size: 24px;
      margin-right: 4px;
    }
    .circle {
      display: inline-block;
      font-size: 0;
      width: 8px;
      height: 8px;
      background-color: $--color-primary;
      border-radius: 50%;
    }
  }
}
</style>
