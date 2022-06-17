<!-- 页面 -->
<template>
  <div class="listWrap listWrap1">
    <apiot-table
      dropClass=".listWrap1"
      :tableData="list"
      row-key="id"
      ref="Tables"
      :select-on-indeterminate="true"
      :showSelection="false"
      :isNeedColumnDrop="false"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
    >
      <el-table-column width="40">
        <template #header slot-scope>
          <el-checkbox
            :value="isCheckAll()"
            :checked="isCheckAll()"
            @change="handleCheckAllChange"
          >
          </el-checkbox>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.showIndex && !checkIschecked(scope.row)">{{
            scope.$index + 1
          }}</span>
          <el-checkbox
            v-else
            :value="!!checkIschecked(scope.row)"
            @change="changeSelected(scope.row, !checkIschecked(scope.row))"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        :label="$t('knowledge.file_name')"
      >
        <template slot-scope="scope">
          <div @click="preView(scope.row)" class="inputWrap">
            <img class="listWrap__img" :src="getFileUrl(scope.row)" />
            <span v-if="!isEdit(scope.row)">
              {{
                renderFileName(
                  scope.row.name || scope.row.sysKlTree.name,
                  scope.row
                )
              }}
            </span>
            <apiot-input
              style="width: calc(100% - 38px)"
              v-model="editFileName"
              @blur="handleSubmitFileName"
              @keyup.enter.native="enterInput"
              @keydown.native="keyDown"
              @click.native.stop.prevent
              ref="input1"
              v-if="isEdit(scope.row)"
            >
            </apiot-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        :label="$t('knowledge.bus_size')"
        v-if="!isDialog"
      >
        <template slot-scope="scope">
          <span>{{ calculateSize(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="uploadUserName"
        :label="$t('knowledge.bus_create')"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.uploadUserName ||
              (scope.row.sysKlTree && scope.row.sysKlTree.uploadUserName)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" :label="$t('knowledge.bus_time')">
        <template slot-scope="scope">
          <span>
            {{ scope.row.uploadTime || scope.row.sysKlTree.uploadTime }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="groupType === '7'"
        :label="$t('knowledge.list_opea')"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="updateShare(scope.row)">{{
            $t('knowledge.list_set')
          }}</el-button>
        </template>
      </el-table-column>
    </apiot-table>
  </div>
</template>

<script>
import { getShareList } from '@/api/knowledge';

export default {
  props: {
    groupType: {
      type: String,
      default: 'all'
    },
    updateData: {
      type: Function,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: false
    },
    selectList: {
      type: Function,
      default: () => {}
    },
    selectKeys: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    fileUrl: {
      type: Function,
      default: () => {}
    },
    getFilterIds: {
      type: Array,
      default: () => []
    },
    isDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: [],
      checkAll: false,
      editFileName: ''
    };
  },

  components: {},

  computed: {
    renderFileName() {
      return function (name, obj) {
        if (
          obj &&
          ((obj.treeType && obj.treeType !== 1) ||
            (obj.sysKlTree && obj.sysKlTree.treeType && obj.sysKlTree.treeType !== 1))
        ) {
          const realNameArr = name.split('.');
          const len = realNameArr.length;
          const newRealName = realNameArr.slice(0, len - 1);
          return newRealName.join('.');
        }
        return name;
      };
    },
    calculateSize() {
      // 计算文件大小
      return function (item) {
        const { size } = item.sysKlTree || item;
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;
        // eslint-disable-next-line no-unused-vars
        let ret = '';

        if (size >= gb) {
          ret = `${(size / (gb * 1.0)).toFixed(0)} GB`;
        } else if (size >= mb) {
          ret = `${(size / (mb * 1.0)).toFixed(0)} MB`;
        } else if (size >= kb) {
          ret = `${(size / (kb * 1.0)).toFixed(0)} KB`;
        } else if (size > 0) {
          ret = `${(size / 1.0).toFixed(0)} KB`;
        } else {
          ret = '0 KB';
        }
        return ret;
      };
    },
    isEdit() {
      return function (item) {
        return (
          this.edit &&
          this.selectKeys.length === 1 &&
          this.selectKeys[0].sysKlTree.id === item.sysKlTree.id
        );
      };
    },
    checkIschecked() {
      return function (obj) {
        return this.selectKeys.find((item) => {
          if (item.sysKlTree && obj.sysKlTree) {
            return item.sysKlTree.id === obj.sysKlTree.id;
          }
          return item.id === obj.id;
        });
      };
    },
    isCheckAll() {
      return function () {
        if (!this.selectKeys.length && !this.list.length) return false;
        return this.selectKeys.length === this.list.length;
      };
    },
    getFileUrl() {
      return function (obj) {
        return this.fileUrl(obj);
      };
    }
  },

  mounted() {
    // console.log('list');
  },

  methods: {
    async updateShare(row) {
      // 修改分享人
      try {
        const shareUserList = await getShareList({
          id: row.id || row.sysKlTree.id,
          userId: this.$store.state.userCenter.userInfo.id,
          keywords: ''
        });
        this.$emit('showShareUserList', {
          row,
          shareUserList: shareUserList || []
        });
      } catch (e) {
        // console.log(e);
      }
    },
    preView(item) {
      this.$emit('preview', item);
    },
    // 不允许空格
    keyDown(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return false;
      }
    },
    enterInput(e) {
      e.target.blur();
    },
    handleSubmitFileName() {
      const obj = this.selectKeys[0];
      let submitValue = this.editFileName;
      const { name, treeType } = obj.sysKlTree;
      if (treeType !== 1) {
        const realNameArr = name.split('.');
        const len = realNameArr.length;
        const newRealName = realNameArr[len - 1];
        submitValue += `.${newRealName}`;
      }
      this.$emit('editFileName', submitValue, this.selectKeys[0].sysKlTree.id);
      // this.$emit('editFileName', this.editFileName, this.selectKeys[0].sysKlTree.id);
    },
    handleCheckAllChange(e) {
      const list = e ? this.list : [];
      this.checkAll = e;
      this.selectList(list);
      this.updateData('edit', false);
    },
    //  鼠标移入
    cellMouseEnter(row) {
      if (!this.getFilterIds.includes(row.id || row.sysKlTree.id)) {
        row.showIndex = false;
      }
    },
    // 鼠标移出
    cellMouseLeave(row) {
      row.showIndex = true;
    },
    handleSelectionChange(row) {
      const newRow = JSON.parse(JSON.stringify(row));
      const arr = [];
      if (row.length) {
        newRow.forEach((item) => {
          const obj = {
            ...item,
            showIndex: false
          };
          arr.push(obj);
        });
      }
      this.selectList(arr);
      this.updateData('edit', false);
    },
    changeSelected(row) {
      const list = [...this.selectKeys];
      const index = list.findIndex((item) => {
        if (row.sysKlTree && item.sysKlTree) {
          const istrue = item.sysKlTree.id === row.sysKlTree.id;
          return istrue;
        }
        if (!row.sysKlTree && item.sysKlTree) {
          const istrue = item.sysKlTree.id === row.id;
          return istrue;
        }
        if (row.sysKlTree && !item.sysKlTree) {
          const istrue = item.id === row.sysKlTree.id;
          return istrue;
        }
        if (!row.sysKlTree && !item.sysKlTree) {
          const istrue = item.id === row.id;
          return istrue;
        }
        return false;
      });
      if (index === -1) {
        list.push(row);
      } else {
        list.splice(index, 1);
      }
      this.checkAll = this.list.length === list.length;
      this.selectList(list);
      this.updateData('edit', false);
    }
  },
  watch: {
    edit: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue && this.selectKeys.length === 1) {
          const obj = this.selectKeys[0];
          const { name, treeType } = obj.sysKlTree;
          if (treeType !== 1) {
            const realNameArr = name.split('.');
            const len = realNameArr.length;
            const newRealName = realNameArr.slice(0, len - 1);
            this.editFileName = newRealName.join('.');
          } else {
            this.editFileName = name;
          }
          this.$nextTick(() => {
            if (this.$refs.input1) {
              this.$refs.input1.focus();
              this.$refs.input1.select();
            }
          });
        }
      }
    }
  },
  name: 'ListContent'
};
</script>

<style lang='scss' scoped>
.listWrap {
  height: 100%;
  margin: 0 10px;
  .inputWrap {
    ::v-deep {
      .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .listWrap__img {
    margin-right: 14px;
    vertical-align: middle;
    cursor: pointer;

    & + span {
      cursor: pointer;
    }
  }
}
</style>
