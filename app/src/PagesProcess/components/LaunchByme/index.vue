<!--
 * @Author: sss
 * @Date: 2022-05-25 11:49:22
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:49:22
 * @Desc: 我发起的
-->
<template>
  <view
    class="launchByme"
    v-if="computedHeight > 0"
    :style="{ height: `${computedHeight}px` }"
  >
    <view v-if="computedHeight > 0" :style="{ height: `${computedHeight}px` }">
      <apiot-toast
        v-if="isLoading && listData.length === 0"
        status="loading"
        :isFull="true"
      ></apiot-toast>
      <u-list
        v-if="listData.length > 0"
        ref="card"
        :height="computedHeight"
        :preLoadScreen="3"
        :pagingEnabled="true"
        @scrolltolower="scrolltolower"
      >
        <u-list-item
          v-for="(item, index) in listData"
          :key="index"
          :anchor="item.id"
          >123</u-list-item
        >
        <apiot-toast
          :status="loadMoreInfo"
          @clickLoadMore="clickLoadMore"
        ></apiot-toast>
      </u-list>
      <apiot-list-nodata
        v-else-if="!isLoading && listData.length === 0"
      ></apiot-list-nodata>
    </view>
  </view>
</template>

<script>
import { getIInitiatedList } from '@/api/pagesProcess.js';
import tabMixin from '../tabMixin';

export default {
  components: {},

  mixins: [tabMixin],

  props: {},

  data() {
    return {
      searchParam: {}
    };
  },

  computed: {},

  methods: {
    // 获得我发起的数据
    async getData(loadType = '') {
      this.isLoading = true;
      try {
        // 分页
        let page = this.current;
        let pageSize = this.size;
        if (loadType === 'loadnext') {
          this.current += 1;
          page = this.current;
        } else if (loadType === 'reload') {
          page = 1;
          pageSize *= page;
        } else {
          this.current = 1;
          page = 1;
        }
        const params = { current: page, size: pageSize };
        const result = await getIInitiatedList(params);

        let list = null;
        if (loadType === 'loadnext') {
          list = this.listData.concat(result.records);
        } else {
          this.totalPage = Math.ceil(result.total / pageSize);
          list = result.records;
        }

        this.listData = [...list];
        this.isLoading = false;
        console.log(result);
      } catch (error) {
        this.isLoading = false;
        console.error(error);
      }
    }
  },

  mounted() {},

  created() {
    this.getData();
  }
};
</script>

<style lang='scss' scoped>
</style>
