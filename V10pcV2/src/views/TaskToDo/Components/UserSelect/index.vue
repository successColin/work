/**
* @name: index
* @author: DELL
* @date: 2023/3/21 19:03
* @description：index
* @update: 2023/3/21 19:03
*/
<!-- 页面 -->
<template>
  <div class="userSelect">
    <div class="manage-item">
            <span
                class="add-manage m-r-6"
                @click="showSelectUserDialog('user')"
            >
              <i class="iconfont icon-jiahao"></i>
            </span>
      <span
          class="manage-tag m-r-6"
          v-for="item in value || []"
          :key="item.id"
      >
              <!-- <span class="imageName m-r-6" :style="item.styleColor">{{item.imageName}}</span>
              {{item.username}} -->
              <user-avatar :userItem="item"></user-avatar>
              <i
                  class="iconfont icon-guanbi m-l-6"
                  @click="deleteLeader(item)"
              ></i>
            </span>
      <input
          type="text"
          v-model="leaderKeywords"
          ref="leader"
          class="search-manage"
          :placeholder="$t('org.searchUser')"
          @input="leaderSearchAsync"
          @compositionend="handleComposition"
          @compositionstart="handleComposition"
      />
      <div
          class="leader-wrap"
          v-show="leaderList.length > 0 && leaderKeywords"
      >
        <p>
          {{ $t('common.search') }}"
          <span>{{ leaderKeywords }}</span>
          "{{ $t('org.searchResult', { num: leaderList.length }) }}
        </p>
        <ul class="leader-list">
          <li
              v-for="item in leaderList"
              @click="selectLeader(item)"
              :key="'select_' + item.id"
          >
            <user-avatar :userItem="item"></user-avatar>
          </li>
        </ul>
      </div>
    </div>
    <user-dialog
        ref="selectDialog"
        v-if="userDialogVisible"
        :visible.sync="userDialogVisible"
        :leaders="value"
        :isSingle="!isMute"
        :title="$t('org.addManage')"
        @updateUser="updateUser"
        v-on="$listeners"
        v-bind="$attrs"
    >
    </user-dialog>
  </div>
</template>

<script>
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import userDialog from '@/views/orgManage/components/detail/components/userDialog/index';
import { getUserPage } from '@/api/orgManage';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    isMute: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      leaderKeywords: '',
      userDialogVisible: false,
      isOnComposition: false,
      leaderList: [],
      showLeadRequired: false,
    };
  },

  components: {
    userAvatar,
    userDialog
  },

  computed: {},

  mounted() {
  },

  methods: {
    // 打开人员选择弹窗
    showSelectUserDialog() {
      this.userDialogVisible = !this.userDialogVisible;
    },
    // 删除管理人员
    deleteLeader(row) {
      const i = this.value.findIndex((item) => item.id === row.id);
      this.value.splice(i, 1);
      this.$emit('change', this.value);
    },
    handleComposition(e) {
      if (e.type === 'compositionend') {
        this.isOnComposition = false;
        setTimeout(() => {
          this.leaderSearchAsync();
        }, 100);
      } else {
        this.isOnComposition = true;
      }
    },
    // 人员实时搜索
    leaderSearchAsync() {
      if (this.isOnComposition) return;
      const params = {
        keywords: this.leaderKeywords,
        size: 99,
        current: 1,
        orders: [
          {
            asc: true,
            column: ''
          }
        ]
      };
      if (this.isChecked) return;
      getUserPage(params).then((res) => {
        if (res.records.length) {
          this.leaderList = res.records;
        } else {
          this.leaderList = [];
        }
      });
    },
    selectLeader(row) {
      const i = this.value.findIndex((item) => item.id === row.id);
      if (i === -1) {
        if (this.isMute) {
          this.value.push(row);
        } else {
          this.$emit('change', [row]);
          this.leaderKeywords = '';
          this.leaderList = [];
          this.$refs.leader.focus();
          return;
        }
      }
      this.$emit('change', this.value);
    },
    updateUser(rows) {
      this.$emit('change', rows);
      this.userDialogVisible = !this.userDialogVisible;
      // this.$refs.detail.validateField('leaderId');
    },
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.userSelect{
  ::v-deep{
    .el-dialog{
      margin: 0 auto;
    }
  }
}
.manage-item {
  width: 100%;
  line-height: 32px;
  display: flex;
  flex-wrap: wrap;
  position: relative;

  .add-manage {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px dashed #4689f5;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4689f5;
    flex-shrink: 0;
    margin-bottom: 6px;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
      background: #edf3fe;
    }
  }

  .manage-tag {
    padding-right: 6px;
    flex-shrink: 0;
    height: 28px;
    line-height: 28px;
    background: #f1f3f6;
    border-radius: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    // .imageName {
    //   width: 24px;
    //   height: 24px;
    //   border-radius: 14px;
    //   color: #fff;
    //   font-size: 12px;
    //   text-align: center;
    //   line-height: 24px;
    // }
    .iconfont {
      font-size: 12px;
      cursor: pointer;
      color: #bbc3cd;

      &:hover {
        color: #6b798d;
      }
    }
  }

  .search-manage {
    width: 100px;
    height: 28px;
    flex-shrink: 0;
    border: none;
    outline: #4689f5;

    input {
      width: 100px;
      height: 28px;
      border: none;
      outline: #4689f5;
    }
  }

  .leader-wrap {
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    padding: 10px 0;
    z-index: 3;

    p {
      height: 36px;
      line-height: 36px;
      font-size: 13px;
      color: #333333;
      padding: 0 20px;

      span {
        color: #4689f5;
      }
    }

    .leader-list {
      width: 100%;
      max-height: 110px;
      overflow-y: auto;

      li {
        display: flex;
        height: 36px;
        line-height: 36px;
        font-size: 13px;
        color: #333333;
        padding: 0 20px;

        &:hover {
          background: #f1f7ff;
        }

        // .imageName {
        //   display: inline-block;
        //   width: 28px;
        //   height: 28px;
        //   border-radius: 14px;
        //   color: #fff;
        //   font-size: 12px;
        //   text-align: center;
        //   line-height: 28px;
        // }
      }
    }
  }
}
</style>
