<!--
 * @Descripttion: 人员列表
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 10:00:33
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-27 11:29:05
-->
<!-- treeTable -->
<template>
  <div class="wrap" :class="{ hasPage: type === 'whole' }">
    <ul class="org__select__content__list">
      <li
        v-for="item in userListData"
        :key="'user_' + item.id"
        @click="rowClick(item)"
      >
        <span class="block">
          <el-checkbox
            v-model="item.checked"
            @click.native.stop
            @change="(val) => checkChange(val, item)"
          >
          </el-checkbox>
        </span>
        <span class="title titleClass manage-tag m-r-6">
          <user-avatar :userItem="item"></user-avatar>
        </span>
        <span class="block">
          <i
            class="iconfont m-r-6 collect"
            :class="
              item.isCollect
                ? 'icon-shoucangxuanzhong'
                : 'icon-shoucangweixuanzhong'
            "
            @click.stop="collectUser(item)"
          ></i>
        </span>
      </li>
    </ul>
    <div class="checkAll" v-if="!isSingle">
      <el-checkbox
        v-model="checkAll"
        @click.native.stop
        @change="checkAllChange"
      >
        全选
      </el-checkbox>
    </div>
  </div>
</template>

<script>
import { addCollectionUser, deleteCollectionUser } from '@/api/orgManage.js';
import userAvatar from '../../../userAvatar/index';

export default {
  components: {
    userAvatar,
  },
  name: 'userlist',
  data() {
    return {
      selection: [],
    };
  },
  props: {
    isSingle: {
      type: Boolean,
    },
    checkeduser: {
      type: Array,
      default() {
        return [];
      },
    },
    listData: {
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
    type: {
      type: String,
      default() {
        return '';
      },
    },
  },
  mounted() {},
  computed: {
    userListData() {
      const rows = this.listData.map((item) => {
        const index = this.collectUserList.findIndex(
          (obj) => obj.id === item.id,
        );
        if (index >= 0) {
          item.isCollect = true;
        } else {
          item.isCollect = false;
        }
        return item;
      });
      return rows;
    },
    checkAll() {
      const len = this.listData.filter((item) => !item.checked).length;
      return this.listData.length && !len;
    },
  },
  inject: ['getCollectUserList'],
  methods: {
    rowClick(row) {
      row.checked = !row.checked;
      this.$emit('updateSelection', row);
    },
    checkChange(val, row) {
      // console.log(row);
      // row.checked = val;
      this.$emit('updateSelection', row);
    },
    checkAllChange(val) {
      this.$emit('updateAllSelection', this.userListData, val);
    },
    collectUser(obj) {
      let api = addCollectionUser;
      let params = {
        collectionUserId: obj.id,
      };
      let str = '';
      if (obj.isCollect) {
        api = deleteCollectionUser;
        params = {
          userId: obj.id,
        };
        str += this.$t('org.cancelCollection');
      } else {
        str += this.$t('org.collection');
      }
      str += `${this.$t('org.user')}:(${this.$t('org.user')}${this.$t(
        'common.name',
        {
          name: '',
        },
      )}:${obj.username})`;
      params.logData = str;
      api(params).then(() => {
        this.getCollectUserList();
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.imageName {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 28px;
}

.titleClass {
  width: calc(100% - 46px - 52px) !important;
  ::v-deep {
    .username {
      width: calc(100% - 28px);
    }
  }
}
</style>
