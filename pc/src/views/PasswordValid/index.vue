<!-- 字段管理 -->
<template>
  <section class="field__content" v-loading="showLoading">
    <header class="field__header">
      <apiot-button type="primary" @click="addField">
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{
          $t('passwordValid.set', {
            name: $t('passwordValid.userPasswordValid'),
          })
        }}
      </apiot-button>
      <apiot-button @click="deleteField">
        <i class="iconfont icon-shanchu m-r-4"></i
        >{{
          $t('common.delete', { name: $t('passwordValid.userPasswordValid') })
        }}
      </apiot-button>
      <search-input
        @getList="getColumnList"
        v-model.trim="keyWord"
      ></search-input>
    </header>
    <section class="field__main">
      <apiot-table
        :tableData="tableData"
        row-key="columnName"
        :highlight-current-row="true"
        :current-row-key="currentRowkey"
        :dropColumnData="dropColumnData"
        @selection-change="handleSelectionChange"
        ref="fieldTable"
        dropClass=".field__main"
      >
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="$t(item.label)"
          :prop="item.prop"
          :keyName="item.prop"
          :type="item.type"
          :nameValue="item.nameValue"
          :objName="item.objName"
          :typesPropName="item.typesPropName"
          :colorIndex="item.colorIndex"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          :show-overflow-tooltip="item.showTooltip"
          :width="item.width"
          :is="dropColumnData[index].compName"
          :fixed="item.fixed"
          @edit="editField"
        ></component>
      </apiot-table>
    </section>
    <footer class="field__footer">
      <ApiotPagination
        :selectedNum="multiEntityArr.length"
        :total="total"
        :size.sync="size"
        :current-page.sync="current"
        @handle-cancel="handleCancel"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></ApiotPagination>
    </footer>
    <AddPasswordValid
      :curDrawerType="curDrawerType"
      :visible.sync="drawer"
      :drawer="drawer"
      @refreshPage="refreshPage"
      ref="addPasswordValid"
    ></AddPasswordValid>
  </section>
</template>

<script>
import { deleteSysUserValid, listSysUserValid } from '@/api/passwordValid.js';
import bus from '@/utils/bus';
import AddPasswordValid from './AddPasswordValid';

export default {
  props: {},
  data() {
    return {
      showLoading: false,
      keyWord: '', // 搜索关键字
      tableData: [], // 表格结果数据
      dropColumnData: [
        // 用户名
        {
          prop: 'username',
          label: 'passwordValid.user',
          showTooltip: false,
          compName: 'UserColumn',
          sortable: 'custom'
        },
        // 账号
        {
          prop: 'account',
          label: 'passwordValid.account',
          showTooltip: false,
          compName: 'ElTableColumn'
        },
        // 所属组织
        {
          prop: 'orgName',
          label: 'passwordValid.ownOrg',
          minWidth: 150,
          showTooltip: false,
          compName: 'OrgAndRole',
          type: 'org'
        },
        // 所属职位
        {
          prop: 'userPostName',
          label: 'passwordValid.ownPost',
          minWidth: 150,
          showTooltip: false,
          compName: 'OrgAndRole',
          type: 'pos'
        },
        // 所属角色
        {
          prop: 'roleNames',
          label: 'passwordValid.ownRole',
          minWidth: 150,
          showTooltip: true,
          compName: 'RoleColumn',
          nameValue: 'roleArr',
          objName: 'roleName'
        },
        // 密码有效期
        {
          prop: 'validTime',
          label: 'passwordValid.passwordValid',
          showTooltip: false,
          compName: 'ElTableColumn'
        },
        // 到期操作
        {
          prop: 'validType',
          label: 'passwordValid.expirationAction',
          showTooltip: false,
          typesPropName: 'PASSWORD_VALID',
          colorIndex: [1, 2],
          compName: 'TypesColumn'
        },
        // 操作
        {
          compName: 'OperateColumn',
          showTooltip: false,
          fixed: 'right'
        }
      ], // 表格列数据
      curDrawerType: 1, // 新增为 1 编辑为2
      drawer: false, // 是否展示新增、编辑
      currentRowkey: '', // 当前行
      multiEntityArr: [],
      total: 0,
      current: 1,
      size: 20
    };
  },

  components: {
    AddPasswordValid
  },

  computed: {
    // 多选数据ids的集合
    multiStringObj() {
      let ids = '';
      let columnNames = '';
      this.multiEntityArr.forEach((item) => {
        ids += `${item.id},`;
        columnNames += `${item.columnName},`;
      });
      return { ids, columnNames };
    }
  },

  mounted() {
    this.$store.dispatch('getCurrentDict', 'PASSWORD_VALID');
    this.getColumnList();
  },

  methods: {
    // 取消
    handleCancel() {
      this.$refs.fieldTable.clearSelection();
      this.multiEntityArr = [];
    },
    // 每页大小改变
    sizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getColumnList();
    },
    // 改变页码
    currentChange(current) {
      this.current = current;
      this.getColumnList();
    },
    // 添加操作
    addField() {
      this.curDrawerType = 1;
      this.$nextTick(() => {
        this.$refs.addPasswordValid.initFormData(this.multiEntityArr);
        this.drawer = true;
      });
    },
    // 删除操作
    deleteField() {
      if (!this.multiEntityArr.length) {
        return this.$message({
          type: 'warning',
          message: this.$t('entity.selectDelData')
        });
      }
      this.batchDeleteColumns();
    },
    async batchDeleteColumns() {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.showLoading = true;
      try {
        await deleteSysUserValid({
          ids: this.multiStringObj.ids,
          logData: {
            operateType: 3,
            name: this.$t('entity.fieldTable.columnName'),
            value: 'columnName',
            deleteArr: this.multiEntityArr
          }
        });
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.delete', { name: this.$t('passwordValid.passwordValid') })
          })
        });
        this.getColumnList();
      } catch (error) {
        this.showLoading = false;
        if (error.code === 'T0006') {
          bus.$emit('updateTable');
        }
      }
    },
    // 编辑
    editField(row) {
      // console.log('编辑', row);
      this.curDrawerType = 2;
      console.log(this.curDrawerType);
      this.$nextTick(() => {
        this.$refs.addPasswordValid.initFormData(row);
        this.drawer = true;
      });
    },
    refreshPage() {
      this.current = 1;
      this.getColumnList();
    },
    async getColumnList() {
      try {
        this.showLoading = true;
        const params = {
          keywords: this.keyWord,
          current: this.current,
          size: this.size
        };
        const data = await listSysUserValid(params);
        data.records.forEach((item) => {
          item.roleArr = this.reduceArr(item.roleIds, item.roleNames);
        });
        this.tableData = data.records;
        console.log(this.tableData);
        this.total = data.total;
        // this.$refs.fieldTable.clearSelection();
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 多选更改
    handleSelectionChange(val) {
      this.multiEntityArr = val;
    },
    reduceArr(str1 = '', str2 = '') {
      // 将字符串处理成数组
      if (!str1) return [];
      const str1Arr = str1.split(',');
      const str2Arr = str2.split(',');
      const arr = [];
      str1Arr.forEach((item, index) => {
        arr.push({
          id: item,
          roleName: str2Arr[index]
        });
      });
      return arr;
    }
  },

  watch: {
    drawer(v) {
      // drawer 关闭的时候统一清空输入内容
      if (!v && this.$refs.addPasswordValid) {
        this.$refs.addPasswordValid.resetForm();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'field';
// 头部的高度
$--headHeight: 48px;
// 计算表格宽度时减去的距离
$--desWidth: calc(100vw - 20px - 20px);
// 计算表格最短宽度
$--minWidth: calc(1024px - 20px);

@include setLayout($--name, $--headHeight, $--desWidth, $--minWidth);
.field__content {
  min-width: $--minWidth;
  height: calc(100% - 10px);
}
</style>
