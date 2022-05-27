<!--
 * @Descripttion: 收藏人员列表
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 10:00:33
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-20 09:10:37
-->
<!-- treeTable -->
<template>
  <section class="commonly">
    <div class="commonly__header">{{$t('org.collection')}}</div>
    <user-list
      v-if="listData.length>0"
      :listData.sync="listData"
      :collectUserList.sync="collectUserList"
      v-on="$listeners"
      v-bind="$attrs">
    </user-list>
  </section>
</template>

<script>
// import { getCollectionUserList } from '@/api/orgManage.js';
import userList from '../userList/index';

export default {
  components: {
    userList
  },
  name: 'commonlyTab',
  data() {
    return {
      tableData: [],
    };
  },
  props: {
    checkeduser: {
      type: Array,
      default() {
        return [];
      },
    },
    collectUserList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    listData() {
      const rows = this.collectUserList.map((item) => {
        const arr = this.checkeduser.filter((obj) => String(obj.id) === String(item.id));
        if (arr.length > 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
      return rows;
    },
  },
  mounted() {
    // this.getUserList();
  },
  methods: {},
  watch: {},
};
</script>
<style lang='scss' scoped>
@import './../roleTab/index.scss';
.commonly {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  &__header{
    height: 36px;
    line-height: 36px;
  }
  &__table{
    ::v-deep{
      .el-table__row{
        .collect{
          color: #FAB71C;
          transform: scale(0);
          transition: all .4s;
          display: inline-block;
          cursor: pointer;
        }
        &:hover{
          .collect{
            transform: scale(1);
          }
        }
      }
    }
  }
  ::v-deep {
    .el-table td{
      border-right: none;
    }
    .el-table__body>tbody>tr:first-child>td{
      border-top: 1px solid #e9e9e9;
    }
    .el-tabs__content{
      overflow-y: auto;
    }
    .personnel__content{
      height: calc(100% - 42px);
    }
  }
}
</style>
