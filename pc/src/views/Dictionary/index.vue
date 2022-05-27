<!--
 * @Author: sss
 * @Date: 2021-04-26 15:48:12
 * @Last Modified by: sss
 * @Last Modified time: 2021-04-26 15:48:12
 * @Descripttion: 数字字典
-->
<template>
  <apiot-content
    class="dictionary"
    :asideLoading="asideLoading"
    :contentLoading="contentLoading"
  >
    <template v-slot:sidebar>
      <apiot-sidebar
        ref="sidebar"
        :curIndex.sync="dictGroupNodeSelected.curIndex"
        :isNeedAdd="false"
        :isNeedNum="false"
        :isNeedMove="false"
        :isNeedOperate="false"
        :groupList="gropList"
        @selectList="selectList"
      ></apiot-sidebar>
    </template>
    <template>
      <div class="dictionary__content">
        <header class="dictionary__header dictionary__header--haspadding">
          <apiot-button
            type="primary"
            v-show="dictGroupNodeSelected.curIndex"
            @click="addDict"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{
              $t('common.add', {
                name: $t('dictionary.dictionary'),
              })
            }}
          </apiot-button>
          <search-input
            @getList="searchDict"
            v-model="dictKeywords"
          ></search-input>
        </header>
        <section class="dictionary__main dictionary__main--haspadding">
          <apiot-table
            ref="dicyionaryTable"
            :tableData="tableData"
            :showSelection="false"
            :dropColumnData="dictionaryColumnData"
            highlight-current-row
            dropClass=".dictionary__main"
          >
            <component
              v-for="(item, index) in dictionaryColumnData"
              :is="item.compName"
              :key="`${item.prop}_${index}`"
              :prop="item.prop"
              :label="`${$t(item.label)}`"
              :width="item.width"
              :type="item.type"
              :align="item.align"
              :buttonArr="getButtonArr(item)"
              :fixed="item.fixed"
              @deleteDict="deleteDict"
              @editDict="editDict"
              @lookDict="lookDict"
            ></component>
          </apiot-table>
          <!--  -->
        </section>
        <footer class="dictionary__footer">
          <apiot-pagination
            v-if="tableData.length"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></apiot-pagination>
        </footer>
      </div>
      <add-dict
        ref="dictDetail"
        :visible.sync="showDictPage"
        :isShow="showDictPage"
        :currentPageType="currentPageType"
        @addOrEditClick="sureClick"
      ></add-dict>
    </template>
  </apiot-content>
</template>

<script>
import { listDictByType, deleteDictById } from '@/api/dictManage';
import AddDict from './components/AddDict';

export default {
  name: 'dictionary',
  components: { AddDict },
  data() {
    return {
      asideLoading: true,
      contentLoading: true,
      showDictPage: false, // 是否显示详情界面
      currentPageType: 0, // 0-新增；1-编辑；2-查看
      currentRowkey: '', // 当前行的key
      dictGroupNodeSelected: { node: {}, curIndex: 0 }, // 当前选中的分组信息
      tableData: [],
      current: 1,
      total: 0,
      size: 10,
      dictKeywords: '',
      dictionaryColumnData: [
        // 序号
        {
          type: 'index',
          align: 'center',
          compName: 'ElTableColumn',
          width: 40,
          fixed: 'left'
        },
        // 编码
        {
          label: 'dictionary.kecode',
          prop: 'dictKey',
          compName: 'ElTableColumn',
          width: 220
        },
        // 字典项
        {
          label: 'dictionary.dictionaryEntry',
          prop: 'dictName',
          compName: 'ElTableColumn',
          width: 220
        },
        // 枚举值
        {
          label: 'dictionary.enumValue',
          prop: 'dictValueFormat',
          compName: 'TypesColumn'
        },
        // 操作
        {
          label: 'common.operate',
          width: 200,
          fixed: 'right',
          compName: 'OperateColumn'
        }
      ]
    };
  },

  computed: {
    gropList() {
      return this.$store.state.dictManage.DICT_TYPE.map((item) => {
        const { value, zhCN } = item;
        item.id = value;
        item.name = zhCN;
        return item;
      });
    },
    getGropSide() {
      return this.$refs.sidebar;
    },
    // 系统分组，只有查看按钮，没有新增、编辑、删除按钮
    getButtonArr() {
      return function(column) {
        if (column.compName === 'OperateColumn') {
          if (this.dictGroupNodeSelected.curIndex === 0) {
            return [{ name: 'common.look1', funcName: 'lookDict' }];
          }
          return [
            { name: 'common.edit1', funcName: 'editDict' },
            { name: 'common.delete1', funcName: 'deleteDict' }
          ];
        }
        return [];
      };
    }
  },
  methods: {
    // 新增字典项
    addDict() {
      this.$refs.dictDetail.initFormData({
        id: '',
        dictKey: '',
        dictName: '',
        dictType: this.dictGroupNodeSelected.node.value,
        dictValue: []
      });
      this.currentPageType = 0;
      this.showDictPage = true;
    },
    // 编辑字典项
    editDict(row) {
      this.$refs.dictDetail.initFormData(row);
      this.currentPageType = 1;
      this.showDictPage = true;
    },
    // 查看字典项
    lookDict(row) {
      this.$refs.dictDetail.initFormData(row);
      this.currentPageType = 2;
      this.showDictPage = true;
    },
    // 删除字典项
    async deleteDict(row) {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.contentLoading = true;
      await deleteDictById({
        id: row.id,
        logData: {
          name: this.$t('dictionary.kecode'),
          value: 'dictKey',
          deleteArr: [row]
        }
      });
      this.current = 1;
      this.getDictListByType();
      this.$message({
        type: 'success',
        message: this.$t('common.success', {
          name: this.$t('common.delete', { name: this.$t('dictionary.dictionary') })
        })
      });
    },
    // 搜索字典项
    searchDict() {
      this.getDictListByType();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getDictListByType();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getDictListByType();
    },
    // 根据分组类型获取字典项列表
    async getDictListByType() {
      this.contentLoading = true;
      const { value: dictType } = this.dictGroupNodeSelected.node;
      const { current, size, dictKeywords } = this;
      const dictResult = await listDictByType({
        dictType,
        current,
        size,
        keywords: dictKeywords
      });
      const dictList = dictResult.records.map((item) => {
        const dictValueFormatArry = item.dictValue.map((value) => value.zhCN);
        item.dictValueFormat = dictValueFormatArry.join(',');
        return item;
      });
      this.contentLoading = false;
      this.tableData = dictList;
      this.total = dictResult.total;
    },
    // 获取首屏分组列表
    async getGroupList() {
      await this.$store.dispatch('getCurrentDict', 'DICT_TYPE');
      this.asideLoading = false;
      this.getGropSide.selectList(this.gropList[0], 0);
    },
    // 切换分组时做的操作
    selectList(node) {
      this.dictKeywords = '';
      this.dictGroupNodeSelected.node = node;
      this.current = 1;
      this.total = 0;
      this.size = 10;
      this.getDictListByType();
    },
    // 添加编辑字典项，成功需要属性列表
    sureClick() {
      this.showDictPage = false;
      this.getDictListByType();
    }
  },
  activated() {
    this.getDictListByType();
  },
  mounted() {
    this.getGroupList();
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';

//右边样式变量
$--name: 'dictionary';
$--headerHeight: 42px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);
</style>
