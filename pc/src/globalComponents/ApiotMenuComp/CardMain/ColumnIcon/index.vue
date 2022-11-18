<template>
  <div
    class="imgBox"
    @mouseenter="showNum = true"
    @mouseleave="showNum = false"
    @click.stop="showPreview"
  >
    <img v-if="fileList.length" :src="fileList[0].url" alt="" />
    <span class="imgBox__num" v-if="fileList.length > 1" v-show="showNum"
      >+
      {{ fileList.length - 1 }}
    </span>
  </div>
</template>

<script>
import { getFileList } from '@/api/menuConfig';

export default {
  name: '',
  props: {
    item: {
      type: Object
    },
    configData: {
      type: Object
    }
  },
  data() {
    return {
      fileList: [],
      showNum: false
    };
  },
  computed: {
    getForm() {
      if (this.configData.pageType === 2) {
        return this.configData.children[1].form;
      }
      return this.configData.children[0].form;
    }
  },
  created() {
    this.getFileList();
  },
  methods: {
    async getFileList() {
      if (this.item[this.configData.iconColumn.compId]) {
        const data = await getFileList({
          ids: this.item[this.configData.iconColumn.compId]
        });
        console.log(data);
        this.fileList = data;
      }
    },
    showPreview() {
      this.$emit('showPreview', this.fileList);
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.imgBox {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  img {
    width: calc(100% - 10px);
  }
  &__num {
    position: absolute;
    right: 10px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    height: 16px;
    line-height: 16px;
    text-align: center;
    padding: 0 6px;
  }
}
</style>
