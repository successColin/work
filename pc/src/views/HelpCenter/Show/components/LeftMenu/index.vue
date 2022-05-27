<!--
 * @Descripttion: 左侧导航栏
 * @Author: ytx
 * @Date: 2021-06-04 09:03:02
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-04 09:03:02
-->
<template>
  <el-menu
    class="leftMenu"
    :default-active="activeIndex"
    :unique-opened="true"
    ref="leftMenu"
  >
    <template v-for="(item, b) in sidebarArr">
      <el-submenu
        v-show="menuType === 1"
        :key="`${item.id}_${b}`"
        :index="`${item.id}`"
      >
        <div slot="title" @click.stop="itemClick(item)">
          <i class="iconfont icon-bangzhuwendang"></i>
          <span class="font__ellipsis leftMenu__content" :title="item.name">
            {{ item.name }}
          </span>
        </div>
        <el-menu-item
          v-for="val in item.docList"
          :key="val.id"
          :index="`${val.id}`"
          @click="itemClick(val)"
        >
          <i
            class="leftMenu__circle"
            :class="{
              'leftMenu__circle--hover': activeIndex === `${val.id}`,
            }"
          ></i>
          <span class="font__ellipsis leftMenu__content" :title="val.name">
            {{ val.name }}
          </span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        v-show="menuType === 2"
        :key="item.id"
        :index="`${item.id}`"
        @click="itemClick(item)"
      >
        <i
          class="leftMenu__circle"
          :class="{
            'leftMenu__circle--hover': activeIndex === `${item.id}`,
          }"
        ></i>
        <span class="font__ellipsis leftMenu__content" :title="item.name">
          {{ item.name }}
        </span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { postClicktimesRecord, getlistDetailShow } from '@/api/helpCenter';

export default {
  props: {
    // 菜单数据
    sidebarArr: {
      type: Array,
      default: () => []
    },
    // 菜单类型 1：帮助文档   2：视频教程、常见问题
    menuType: {
      type: Number,
      default: 1
    },
    // 父节点的id
    parentId: {
      type: Number,
      default: 1
    },
    // 默认展开
    activeIndex: {
      type: String,
      default: ''
    },
    // 是否是搜索出来的跳转
    isShowSearchValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentObj: null
    };
  },
  components: {},
  computed: {},
  watch: {
    // 左侧数据的变化
    sidebarArr() {
      if (this.sidebarArr.length !== 0) {
        const obj = this.sidebarArr[0];
        if (obj.docList && obj.docList.length !== 0) {
          this.itemClick(obj.docList[0]);
          this.changeActiveIndexFun(obj.docList[0].id);
        } else {
          this.itemClick(obj);
          this.changeActiveIndexFun(obj.id);
        }
      }
    }
  },
  methods: {
    changeActiveIndexFun(v) {
      this.$emit('update:activeIndex', String(v));
    },
    async itemClick(v) {
      // console.log(v);
      // 如果有 html 是属于三级菜单
      if (this.menuType === 1) {
        // console.log(this.isShowSearchValue);
        if (v.html) {
          this.currentObj = v;
          this.changeActiveIndexFun(v.id);
        } else if (v.docList && v.docList.length !== 0) {
          const { docList } = v;
          const index = 0;
          this.currentObj = docList[index];
          this.changeActiveIndexFun(docList[index].id);
          this.$refs.leftMenu.open(v.id);
        } else {
          this.changeActiveIndexFun(v.id);
          this.currentObj = {};
        }
        if (this.isShowSearchValue) {
          // console.log(this.sidebarArr, v);
          let currentObjDate = {};
          this.sidebarArr.forEach((item) => {
            if (item.docList.length !== 0) {
              item.docList.forEach((val) => {
                if (val.id === v.id) {
                  currentObjDate = val;
                }
              });
            }
          });
          // console.log(currentObjDate);
          this.$emit('currentObj', currentObjDate);
        } else {
          this.$emit('currentObj', this.currentObj);
        }
        if (this.currentObj.parentId || this.currentObj.id) {
          // 点击次数
          await postClicktimesRecord({
            parentId: this.parentId,
            parentSid: this.currentObj.parentId,
            detailId: this.currentObj.id
          });
        }
      } else if (this.menuType === 2) {
        // 查询结果点击跳转为true
        let params = {};
        if (this.isShowSearchValue) {
          this.changeActiveIndexFun(v.parentId);
          params = {
            parentId: this.parentId,
            parentSid: v.parentId
          };
          const currentObjDate = this.sidebarArr.find((item) => item.id === v.parentId);
          this.$emit('currentObj', currentObjDate);
        } else {
          // 正常流程
          this.changeActiveIndexFun(v.id);
          params = {
            parentId: this.parentId,
            parentSid: v.id
          };
          this.$emit('currentObj', v);
        }
        // 获取中间数据
        const currentArr = await getlistDetailShow(params);
        this.$emit('currentArr', currentArr);
        // 点击次数
        await postClicktimesRecord(params);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.leftMenu {
  width: 240px;
  border-right: none;
  margin-right: 40px;
  &__circle {
    display: inline-block;
    width: 4px;
    height: 4px;
    background: #bbc3cd;
    border-radius: 50%;
    margin: 0 12px 0 28px !important;
  }
  &__circle--hover {
    background: $--color-primary;
  }
  &__content {
    display: inline-block;
    width: calc(100% - 100px);
  }
  ::v-deep {
    .el-submenu__title {
      padding: 0px !important;
      height: 36px;
      line-height: 36px;
      i:first-child {
        margin: 0 10px 0 22px;
      }
    }
    .el-menu-item-group__title {
      height: 0;
      padding: 0;
      overflow: hidden;
    }
    .el-menu-item {
      height: 36px;
      line-height: 36px;
      padding: 0 0 0 0px !important;
      position: relative;
      i:first-child {
        margin: 0 10px 0 22px;
      }
    }
    .el-submenu__icon-arrow {
      left: 226px;
      right: auto;
    }
    .el-submenu__icon-arrow {
      left: 220px;
    }
    .el-menu-item.is-active {
      background-color: lighten($--color-primary, 35%) !important;
    }
  }
}
</style>
