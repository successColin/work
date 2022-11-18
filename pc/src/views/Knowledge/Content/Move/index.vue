<!-- 页面 -->
<template>
  <div class="contentWrap" v-loading="loading">
    <div class="pathContentWrap">
      <!--      <file-path :pathArr="pathArr" v-on:changePath="changePath"></file-path>-->
      <search-input
        @getList="getFileList"
        v-model.trim="keyWord"
      ></search-input>
    </div>
    <div class="tableWrap">
      <apiot-table
        :tableData="list"
        row-key="id"
        :select-on-indeterminate="true"
        :showSelection="false"
        :isNeedColumnDrop="false"
        lazy
        :isAnimate="false"
        :load="load"
        @row-click="clickRow"
        @expand-change="doExpand"
        :tree-props="{ hasChildren: 'isSonFolder' }"
      >
        <el-table-column
          prop="name"
          show-overflow-tooltip
          :label="$t('knowledge.file_name')"
        >
          <template slot-scope="scope">
            <div
              style="cursor: pointer; display: inline"
              @click.prevent="checkChange(scope.row)"
            >
              <apiot-checkbox
                class="checkBoxWrap"
                :value="isCheck(scope.row)"
                @change="checkChange(scope.row)"
                @click.native.stop
              >
              </apiot-checkbox>
              <img class="listWrap__img" :src="filesSvg" />
              {{ scope.row.sysKlTree.name }}
            </div>
          </template>
        </el-table-column>
      </apiot-table>
    </div>
  </div>
</template>

<script>
import { getKonwledgeList } from '@/api/knowledge';
import filesSvg from '@/assets/img/files.svg';

// const FilePath = () => import('../FilePath/index');
const initPath = {
  name: '全部',
  id: 'all'
};

export default {
  props: {
    fileUrl: {
      type: Function,
      default: () => {}
    },
    showType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      filesSvg,
      pathArr: [initPath],
      keyWord: '',
      selectKeys: [],
      list: [],
      loading: false
    };
  },

  components: {
    // FilePath
  },

  computed: {
    checkIschecked() {
      return function (obj) {
        return this.selectKeys.find((item) => item.sysKlTree.id === obj.sysKlTree.id);
      };
    },
    getFileUrl() {
      return function (obj) {
        return this.fileUrl(obj);
      };
    },
    isCheck() {
      return function (obj) {
        return obj.id === (this.selectKeys && this.selectKeys[0] && this.selectKeys[0].id);
      };
    }
  },

  mounted() {
    const params = {
      classId: this.showType,
      keywords: this.keyWord,
      parentId: 0,
      isFolder: 1
    };
    this.initKonwledge(params);
  },

  methods: {
    clickRow(row) {
      this.checkChange(row);
    },
    doExpand() {
      this.selectKeys = this.dataSelectKeys;
    },
    checkChange(row) {
      this.selectKeys = [row];
      this.dataSelectKeys = [row];
    },
    async load(tree, treeNode, resolve) {
      // 点击进入下一层
      const { treeType, id } = tree.sysKlTree;
      if (treeType === 1) {
        this.selectKeys = [];
        const params = {
          classId: this.showType,
          keywords: this.keywords,
          parentId: id,
          isFolder: 1
        };
        this.loading = true;
        try {
          const treeData = await getKonwledgeList(params);
          this.loading = false;
          const newListData = treeData.map((item) => ({
            ...item,
            id: item.sysKlTree.id
          }));
          resolve(newListData);
        } catch (e) {
          this.loading = false;
        }
      }
    },
    changePath(item) {
      // 更改路径
      const index = this.pathArr.findIndex((obj) => obj.id === item.id);
      let params = {};
      if (!index || index === -1) {
        this.pathArr = [initPath];
        params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: 0,
          isFolder: 1
        };
      } else {
        this.pathArr = this.pathArr.slice(0, index + 1);
        params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: item.id,
          isFolder: 1
        };
      }
      this.selectKeys = [];
      this.initKonwledge(params);
    },
    async initKonwledge(params) {
      // 初始化数据
      this.loading = true;
      try {
        const treeData = await getKonwledgeList(params);
        this.loading = false;
        const newListData = treeData.map((item) => ({
          ...item,
          id: item.sysKlTree.id
        }));
        this.list = newListData;
      } catch (e) {
        this.loading = false;
      }
    },
    changeSelected(row) {
      this.selectKeys = [row];
    },
    //  鼠标移入
    cellMouseEnter(row) {
      row.showIndex = false;
    },
    // 鼠标移出
    cellMouseLeave(row) {
      row.showIndex = true;
    },
    getFileList() {
      // 模糊查询
      const current = this.pathArr[this.pathArr.length - 1];
      const params = {
        classId: this.showType,
        keywords: this.keyWord,
        parentId: current.id === 'all' ? 0 : current.id,
        isFolder: 1
      };
      this.initKonwledge(params);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .pathContentWrap {
    height: 42px;
    padding: 6px 0;
    box-sizing: border-box;
  }

  .tableWrap {
    height: calc(100% - 42px);

    .listWrap__img {
      margin-right: 10px;
      margin-left: 10px;
      vertical-align: middle;
    }
    .checkBoxWrap {
      margin-left: 13px;
    }

    ::v-deep {
      .el-table__expand-icon {
        display: inline-block;
        height: unset;
        margin-right: 0;

        .el-icon-arrow-right {
          font-family: 'iconfont' !important;
          font-size: 13px;
          color: #333;

          &::before {
            content: '\ea22';
          }
        }
      }
      .el-table__expand-icon + div > .checkBoxWrap {
        margin-left: 0;
      }
      .el-table__placeholder {
        width: 7px;
      }
    }
  }
}
</style>
