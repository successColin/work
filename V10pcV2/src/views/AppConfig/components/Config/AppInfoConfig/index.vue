<template>
  <section class="menuConfig config">
    <div class="config__header">文章配置</div>
    <div class="config__body">
      <h2 class="config__body--head">名称</h2>
      <apiot-input
        v-model="activeObj.name"
        @focus="nameFocus"
        @blur="nameBlur"
      ></apiot-input>
      <h2 class="config__body--head">筛选</h2>
      <el-select class="config__body--select" v-model="activeObj.term">
        <el-option :value="1" label="全部资讯"></el-option>
        <el-option :value="2" label="置顶资讯"></el-option>
      </el-select>
      <h2 class="config__body--head">选择分组</h2>
      <el-select class="config__body--select" v-model="activeObj.groupId">
        <el-option :value="0" label="全部"></el-option>
        <el-option
          :value="item.id"
          :label="item.name"
          v-for="item in groupArr"
          :key="item.id"
        ></el-option>
      </el-select>
      <h2 class="config__body--head">显示条数</h2>
      <el-input-number
        class="config__body--number"
        v-model="activeObj.count"
        :min="3"
        :max="10"
        :controls="false"
      ></el-input-number>
    </div>
  </section>
</template>

<script>
import { listGroup } from '@/api/articleManage';

export default {
  props: {
    activeObj: {
      type: Object
    }
  },
  data() {
    return {
      groupArr: []
    };
  },

  components: {},

  computed: {},

  created() {
    this.initGroup();
  },

  methods: {
    nameFocus() {
      this.activeObj.backName = this.activeObj.name;
    },
    nameBlur() {
      if (!this.activeObj.name) {
        this.activeObj.name = this.activeObj.backName;
      }
    },
    async initGroup() {
      // 初始化列表
      const res = await listGroup();
      this.groupArr = res;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
</style>
