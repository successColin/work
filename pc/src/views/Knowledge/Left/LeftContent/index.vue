<!-- 知识库 页面 -->
<template>
  <div class="leftWrapContent">
    <div class="searchWrap">
      <search-input
        style="width: 224px"
        @getList="doSearch"
        v-model="input"
      ></search-input>
    </div>
    <div class="opeWrap">
      <div
        class="opeWrap__item"
        @click="changeType(item.baseType)"
        :class="{ active: selectKey === item.baseType }"
        v-for="item in commonlyUsed"
        :key="item.baseType"
      >
        <div class="opeWrap__content">
          <span class="iconfont" :class="item.icon"></span>
          <span>{{ $t(item.name) }}</span>
        </div>
      </div>
      <div class="bottomBorder"></div>
    </div>
    <div class="opeWrap">
      <div
        class="opeWrap__item"
        v-for="item in routine"
        :key="item.baseType"
        @click="changeType(item.baseType)"
        :class="{ active: selectKey === item.baseType }"
      >
        <div class="opeWrap__content">
          <span class="iconfont" :class="item.icon"></span>
          <span>{{ $t(item.name) }}</span>
        </div>
      </div>
      <div class="bottomBorder" v-if="active === 1"></div>
    </div>
    <div class="opeWrap" v-if="active === 1">
      <div
        class="opeWrap__item"
        v-for="item in show"
        :key="item.baseType"
        :class="{ active: selectKey === item.baseType }"
        @click="changeType(item.baseType)"
      >
        <div class="opeWrap__content">
          <span class="iconfont" :class="item.icon"></span>
          <span>{{ $t(item.name) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      commonlyUsed: [
        {
          name: 'knowledge.my_collection',
          icon: 'icon-shoucangxuanzhong',
          baseType: 9
        },
        {
          name: 'knowledge.Recently_used',
          icon: 'icon-zuijinchangyong iconCommon',
          baseType: 10
        }
      ],
      routine: [
        {
          name: 'knowledge.all',
          icon: 'icon-fenzuchangtai',
          baseType: 'all'
        },
        {
          name: 'knowledge.documentation',
          icon: 'icon-wenjian iconCommon',
          baseType: 2
        },
        {
          name: 'knowledge.image',
          icon: 'icon-tupian iconCommon',
          baseType: 3
        },
        {
          name: 'knowledge.video',
          icon: 'icon-shipin iconCommon',
          baseType: 4
        },
        {
          name: 'knowledge.audio',
          icon: 'icon-yinpin iconCommon',
          baseType: 5
        },
        {
          name: 'knowledge.other',
          icon: 'icon-qita iconCommon',
          baseType: 6
        }
      ],
      show: [
        {
          name: 'knowledge.my_share',
          icon: 'icon-fenzuchangtai',
          baseType: 7
        },
        {
          name: 'knowledge.Shared_byothers',
          icon: 'icon-tarengongxiang',
          baseType: 8
        }
      ],
      input: '',
      isActive: false,
      selectKey: 'all'
    };
  },

  components: {},

  computed: {},

  mounted() {},
  watch: {
    active: {
      immediate: true,
      deep: true,
      handler() {
        this.selectKey = 'all';
        this.input = '';
        this.$bus.$emit('group__type', 'all');
      }
    }
  },
  methods: {
    changeType(type = '') {
      this.selectKey = type;
      this.input = '';
      this.$bus.$emit('group__type', type);
    },
    reset() {
      this.$bus.$emit('doSearch', this.input);
    },
    doSearch() {
      this.$bus.$emit('doSearch', this.input);
    }
  },
  name: 'LeftContent'
};
</script>

<style lang='scss' scoped>
.leftWrapContent {
  width: 100%;
  height: 100%;
  padding: 6px 8px;
  box-sizing: border-box;

  .searchWrap {
    overflow: hidden;
    .on {
      color: $--color-primary;
    }

    ::v-deep {
      .el-input__inner {
        width: 100%;
        height: 30px;
        padding-left: 12px;
        font-size: 13px;
        cursor: pointer;
      }

      .el-input__prefix {
        left: auto;
        right: 15px;
        line-height: 30px;
        cursor: pointer;
      }
    }
  }

  .icon-fenzuchangtai,
  .icon-shoucangxuanzhong,
  .icon-tarengongxiang {
    color: #fab71c;
    font-size: 20px;
  }

  .iconCommon {
    color: #bbc3cd;
    font-size: 20px;
    margin-right: 7px !important;
    vertical-align: bottom;
  }

  .opeWrap {
    margin-top: 6px;
    box-sizing: border-box;
    clear: both;
    overflow: hidden;

    .opeWrap__item {
      width: 100%;
      height: 32px;
      cursor: pointer;

      & .opeWrap__content {
        height: 32px;
        float: left;
        margin-left: 31px;
        line-height: 32px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      & .iconfont {
        margin-right: 7px;
        vertical-align: bottom;
      }

      &:hover {
        background: #f1f7ff;
      }

      &.active {
        background: #f1f7ff;

        .iconCommon {
          color: #4689f5;
        }
      }
    }
  }

  .bottomBorder {
    float: left;
    width: 85px;
    margin-left: 31px;
    height: 1px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9e9e9;
  }
}
</style>
