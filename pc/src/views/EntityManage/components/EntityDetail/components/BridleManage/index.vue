<!-- 约束管理 -->
<template>
  <section class="bridle__content">
    <header class="bridle__header">
      <apiot-button type="primary" @click="addBridle">
        <i class="iconfont icon-xinzeng m-r-4"></i>新增约束
      </apiot-button>
      <apiot-button @click="deleteBridle">
        <i class="iconfont icon-shanchu m-r-4"></i>删除约束
      </apiot-button>
      <div class="bridle__search">
        <apiot-input
          placeholder="输入关键字搜索"
          v-model="searchValue"
        ></apiot-input>
        <i class="iconfont icon-sousuo"></i>
      </div>
    </header>
    <section class="bridle__main">
      <apiot-table
        :tableData="tableData"
        row-key="date"
        :dropColumnData="dropColumnData"
        dropClass=".bridle__main"
      >
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="item.label"
          :prop="item.prop"
          :typesPropArr="item.typesPropArr"
          :colorIndex="item.colorIndex"
          :width="item.width"
          :is="dropColumnData[index].compName"
          @edit="editBridle"
        ></component>
      </apiot-table>
    </section>
    <add-bridle
      :curDrawerType="curDrawerType"
      :visible.sync="drawer"
    ></add-bridle>
  </section>
</template>

<script>
import { bridleTypeDict } from '@/config';
import AddBridle from './AddBridle';

export default {
  data() {
    return {
      searchValue: '',
      tableData: [
        {
          constraintName: '实体1',
          columnName: '字段1,字段2',
          typeDict: 1,
          memo: '备注1',
          enabled: 1
        }
      ], // 表格结果数据
      dropColumnData: [
        {
          label: '约束名称',
          prop: 'constraintName',
          compName: 'ElTableColumn'
        },
        {
          label: '包含字段',
          prop: 'columnName',
          colorIndex: 4,
          compName: 'TypesColumn'
        },
        {
          label: '约束类型',
          prop: 'typeDict',
          typesPropArr: bridleTypeDict,
          compName: 'TypesColumn'
        },
        {
          label: '约束内容',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        {
          label: '是否执行',
          compName: 'SwitchColumn'
        },
        {
          label: '操作',
          compName: 'OperateColumn'
        }
      ], // 表格列数据
      curDrawerType: 1, // 1 是新增 2是编辑
      drawer: false
    };
  },

  components: {
    AddBridle
  },

  computed: {},

  mounted() {},

  methods: {
    // 修改分页尺寸
    handleSizeChange() {},
    // 修改分页页码
    handleCurrentChange() {},
    // 添加操作
    addBridle() {
      this.curDrawerType = 1;
      this.drawer = true;
    },
    // 删除操作
    deleteBridle() {},
    editBridle(row) {
      // console.log('编辑约束', row);
      this.curDrawerType = 2;
      this.drawer = true;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'bridle';
// 头部的高度
$--headHeight: 48px;
// 计算表格宽度时减去的距离
$--desWidth: calc(100vw - 20px - 20px);
// 计算表格最短宽度
$--minWidth: calc(1024px - 20px);

@include setLayout($--name, $--headHeight, $--desWidth, $--minWidth);
</style>
