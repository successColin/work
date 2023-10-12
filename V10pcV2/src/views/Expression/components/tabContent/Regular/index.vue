<!--
 * @Author: sss
 * @Date: 2021-07-06 10:18:30
 * @Last Modified by:   sss
 * @Last Modified time: 2021-07-06 10:18:30
 * @dec: 正则表达式
 -->

<template>
  <section class="regular">
    <template>
      <header class="regular__header regular__header--haspadding">
        <template v-if="expressionGroup !== 1">
          <apiot-button type="primary" @click="addEx('expression.regEx')">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{
              $t('common.add', {
                name: $t('expression.expression', {
                  name: $t('expression.regEx'),
                }),
              })
            }}
          </apiot-button>
          <apiot-button @click="delEx">
            <i class="iconfont icon-shanchu m-r-4"></i
            >{{
              $t('common.delete', {
                name: $t('expression.expression', {
                  name: $t('expression.regEx'),
                }),
              })
            }}
          </apiot-button>
        </template>
        <search-input
          @getList="getList"
          v-model.trim="keywords"
          :isForbid="false"
        ></search-input>
      </header>
      <div class="regular__table regular__table--haspadding">
        <apiot-table
          ref="regularList"
          row-key="description"
          highlight-current-row
          :tableData="tableData"
          :dropColumnData="columnData"
          :isNeedAsync="true"
          rowKey="id"
          @selection-change="handleSelectionChange"
          @sortChangeColumn="sortChange"
          dropClass=".regular__table"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :buttonArr="getButtonArr(item)"
            :prop="item.prop"
            :label="`${$t(item.label, { name: '' })}`"
            :width="item.width"
            :fixed="item.fixed"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            @editEx="editEx"
          ></component>
        </apiot-table>
      </div>
      <footer class="regular__footer">
        <apiot-pagination
          v-show="total > 0"
          :total="total"
          :selectedNum="multiExpressionArr.length"
          :current-page.sync="current"
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
      :expressionType="2"
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
          name: this.$t('expression.regEx')
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
        expressionType: 2,
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
$--name: 'regular';
$--headerHeight: 42px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);
</style>
