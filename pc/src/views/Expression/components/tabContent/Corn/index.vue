<!--
 * @Author: sss
 * @Date: 2021-07-06 10:18:30
 * @Last Modified by:   sss
 * @Last Modified time: 2021-07-06 10:18:30
 * @dec: cron表达式
 -->

<template>
  <section class="cron">
    <template>
      <header class="cron__header cron__header--haspadding">
        <template v-if="expressionGroup !== 1">
          <apiot-button type="primary" @click="addEx">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{
              $t('common.add', {
                name: $t('expression.expression', {
                  name: $t('expression.cornEx'),
                }),
              })
            }}
          </apiot-button>
          <apiot-button @click="delEx">
            <i class="iconfont icon-shanchu m-r-4"></i
            >{{
              $t('common.delete', {
                name: $t('expression.expression', {
                  name: $t('expression.cornEx'),
                }),
              })
            }}
          </apiot-button>
        </template>
        <search-input
          @getList="searchDict"
          v-model="keywords"
          :isForbid="false"
        ></search-input>
      </header>
      <div class="cron__table cron__table--haspadding">
        <apiot-table
          ref="cronList"
          highlight-current-row
          :tableData="tableData"
          :dropColumnData="columnData"
          :isNeedAsync="true"
          rowKey="id"
          @selection-change="handleSelectionChange"
          @sortChangeColumn="sortChange"
          dropClass=".cron__table"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :buttonArr="getButtonArr(item)"
            :label="`${$t(item.label, { name: '' })}`"
            :width="item.width"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            @editEx="editEx"
          ></component>
        </apiot-table>
      </div>
      <footer class="cron__footer">
        <apiot-pagination
          v-show="total > 0"
          :total="total"
          :current-page.sync="current"
          :selectedNum="multiExpressionArr.length"
          @handle-cancel="handleCancelChecked"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></apiot-pagination>
      </footer>
    </template>
    <add-ex
      ref="exDetail"
      :title="dialogTile"
      :expressionGroup="expressionGroup"
      :expressionType="1"
      :visible.sync="showExDetail"
      @addOrEditClick="sureClick"
    ></add-ex>
  </section>
</template>

<script>
import AddEx from '_v/Expression/components/AddEx';
import { getList } from '@/api/expression';
import tabMixin from '../tabMixin';

export default {
  mixins: [tabMixin],

  components: { AddEx },

  props: {},

  data() {
    return {};
  },

  computed: {
    dialogTile() {
      return this.$t(this.oprationType, {
        name: this.$t('expression.expression', {
          name: this.$t('expression.cornEx')
        })
      });
    }
  },

  methods: {
    // 获取列表
    async getList(current = 1) {
      this.$emit('contentLoading', true);
      const { size, keywords, expressionGroup, orders } = this;
      const list = await getList({
        expressionType: 1,
        expressionGroup,
        size,
        current,
        keywords,
        orders
      });
      this.$emit('contentLoading', false);
      this.current = current;
      this.total = list.total;
      this.tableData = list.records;
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '../index.scss';

//右边样式变量
$--name: 'cron';
$--headerHeight: 42px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);
</style>
