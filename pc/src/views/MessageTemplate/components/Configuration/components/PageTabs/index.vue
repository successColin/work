<!--
 * @Author: sss
 * @Date: 2021-05-19 14:38:06
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-19 14:38:06
 * @Desc: 主页面的tab页
-->
<template>
  <div class="pageTabs">
    <el-tabs class="tabs" type="card" v-on="$listeners" v-bind="$attrs">
      <el-tab-pane
        v-for="item in tabsArr"
        :key="`key_${item.value}`"
        :name="`name_${item.value}`"
        :lazy="true"
      >
        <div slot="label" class="tabs__paneLabel">
          <img
            :src="require(`@/assets/img/message_images/${item.value}.svg`)"
          />
          <span>{{ item.name }}</span>
        </div>

        <slot :name="`com_${item.value}`"></slot>
      </el-tab-pane>
    </el-tabs>
    <article class="btns">
      <slot name="top-btns"></slot>
    </article>
  </div>
</template>

<script>
export default {
  name: 'PageTabs',
  components: {},

  props: {
    tabsArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
$--tabTopHeight: 42px;
.pageTabs {
  position: relative;
}
.tabs {
  &__paneLabel > * {
    vertical-align: middle;
  }
  &__paneLabel img {
    margin-right: 8px;
  }
  ::v-deep {
    .el-tabs__item.is-active {
      background: #f1f7ff;
      border-bottom-color: #e9e9e9;
      color: #333333;
    }
    .el-tabs__nav-scroll {
      border: solid 1px #e9e9e9;
      border-radius: 4px;
    }
    .el-tabs__nav {
      border: none;
      &:last-child {
        border-right: solid 1px #e9e9e9;
      }
    }
  }
}
.btns {
  position: absolute;
  top: 0;
  right: 0;
  height: $--tabTopHeight;
  line-height: $--tabTopHeight;
}
</style>
