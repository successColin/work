<!-- 页面 -->
<template>
  <div class="leftWrap">
    <div class="checkoutWrap">
      <el-button-group>
        <apiot-button :type="active === 1 ? 'primary' : ''" @click="change(1)">
          {{ $t('icon.pc') }}
        </apiot-button>
        <apiot-button :type="active === 2 ? 'primary' : ''" @click="change(2)">
          {{ $t('icon.mobile') }}
        </apiot-button>
      </el-button-group>
    </div>
    <div class="groupWrap">
      <div class="groupWrap__item">
        <div class="groupWrap__title">{{ $t('icon.fontIcon') }}</div>
        <div
          class="groupWrap__group"
          v-for="item in iconConfigJson.slice(3, iconConfigJson.length)"
          :key="item.id"
          :class="{ active: selectKey === item.id }"
          @click="choose(item)"
        >
          <i
            class="iconfont"
            :class="
              selectKey === item.id ? 'icon-fenzuzhankai' : 'icon-fenzuchangtai'
            "
          ></i>
          {{ item.name }}
        </div>
      </div>
      <div class="groupWrap__item">
        <div class="groupWrap__title">{{ $t('icon.Customicon') }}</div>
        <div
          class="groupWrap__group"
          v-for="item in iconConfigJson.slice(0, 3)"
          :key="item.id"
          :class="{ active: selectKey === item.id }"
          @click="choose(item)"
        >
          <i
            class="iconfont"
            :class="
              selectKey === item.id ? 'icon-fenzuzhankai' : 'icon-fenzuchangtai'
            "
          ></i>
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { iconSet } from '@/globalComponents/ApiotDialog/IconDialog/icon.json';

export default {
  data() {
    return {
      active: 1,
      iconConfigJson: [], // 静态图标维护
      selectKey: 1,
      selected: {}
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.iconConfigJson = iconSet;
    const obj = iconSet[3];
    const { id } = obj;
    this.selectKey = id;
    this.selected = obj;
    setTimeout(() => {
      this.$bus.$emit('iconArr', {
        data: obj,
        baseType: this.active
      });
    }, 0);
  },

  methods: {
    change(type) {
      // 类型
      this.active = type;
      this.$bus.$emit('iconArr', {
        data: this.selected,
        baseType: this.active
      });
    },
    async choose(obj) {
      // 选择分组
      this.selectKey = obj.id;
      this.selected = obj;
      this.$bus.$emit('iconArr', {
        data: obj,
        baseType: this.active
      });
    }
  },
  name: 'Left'
};
</script>

<style lang='scss' scoped>
.leftWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .checkoutWrap {
    margin: 6px 8px;

    ::v-deep {
      .el-button-group {
        width: 100%;
        display: flex;

        .el-button {
          flex: 1;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        .el-button--primary {
          color: #ffffff !important;
        }
      }
    }
  }

  .groupWrap {
    width: 100%;
    height: calc(100% - 42px);
    overflow-y: auto;

    .groupWrap__title {
      height: 34px;
      padding-left: 41px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      line-height: 34px;
    }

    .groupWrap__group {
      position: relative;
      height: 36px;
      display: flex;
      line-height: 36px;
      border-radius: 2px;
      border-left: 3px solid #fff;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      &:hover {
        background: #edf3fe;
        cursor: pointer;
      }

      .icon-fenzuchangtai,
      .icon-fenzuzhankai {
        margin-left: 38px;
        margin-right: 5px;
        color: #fab71c;
        font-size: 20px;
      }
    }
  }

  .active {
    background: #edf3fe;
    cursor: pointer;
    border-color: #4689f5 !important;
  }
}
</style>
