<!-- 页面 -->
<template>
  <apiot-sidebar
    ref="sidebar"
    :curIndex.sync="curIndex"
    :groupList="groupList"
    :notNeedOpeArr="[-10]"
    :notNeedMoveArr="[-10]"
    :isNeedNum="false"
    @dragEnd="draggableEnd"
    @selectList="selectList"
    @doAddGroup="doAddGroup"
    @deleteGroup="deleteGroup"
    @handleSubmitGroupName="handleSubmitGroupName"
  ></apiot-sidebar>
</template>

<script>
import {
  addInsertSort,
  changeModifySortSon,
  getListSort,
  deleteSort,
  updateModifySort
} from '@/api/importTemplate';

export default {
  name: 'EntityList',
  data() {
    return {
      curIndex: 0, // 当前选中item 的下标
      groupList: [], // 分组信息列表
      backGroupList: []
    };
  },

  computed: {
    getSidebar() {
      return this.$refs.sidebar || {};
    }
  },

  mounted() {
    this.getListSort();
  },

  methods: {
    // 修改名字
    async handleSubmitGroupName() {
      try {
        await updateModifySort({
          id: this.getSidebar.selectedKey,
          name: this.getSidebar.groupname
          // logData: {
          //   operateType: 2,
          //   name: {
          //     name: this.$t('entity.entityGroup')
          //   }
          // }
        });
        this.getSidebar.isEditKey = -1;
        this.getSidebar.oldGroupname = '';
        this.getSidebar.groupList[this.curIndex].name = this.getSidebar.groupname;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('entity.group') })
          })
        });
      } catch (error) {
        this.getSidebar.isEditKey = -1;
        if (error.name) {
          return this.$message({
            type: 'error',
            message: `${this.$t('common.name', { name: this.$t('entity.group') })}${error.name}`
          });
        }
        if (error.code === 'W0001') {
          // 并发 分组不存在
          this.resetGroup();
        }
      }
    },
    selectList(item) {
      // 切换分组
      this.$emit('changeGroup', item);
    },
    // 新增取消
    doAfterHide() {
      // 输入框值清空值
      this.input = '';
      this.value = false;
    },
    // 新增分组
    async doAddGroup() {
      try {
        const data = await addInsertSort({
          name: this.getSidebar.input
          // sno: this.groupList[this.groupList.length - 1].sno + 1,
          // logData: {
          //   operateType: 1,
          //   name: {
          //     name: this.$t('entity.entityGroup')
          //   }
          // }
        });
        this.groupList.push(data);
        this.getSidebar.selectList(data, this.groupList.length - 1);
        this.getSidebar.doAfterHide();
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('entity.group') })
          })
        });
      } catch (error) {
        if (error.name) {
          return this.$message({
            type: 'error',
            message: `${this.$t('common.name', { name: this.$t('entity.group') })}${error.name}`
          });
        }
      }
    },
    // 删除分组
    async deleteGroup(item) {
      // console.log(item);
      if (item.tableTotal) {
        return this.$message({
          type: 'error',
          message: this.$t('importTemplate.groupHasTemplateNoDelete')
        });
      }
      this.$emit('update:asideLoading', true);
      try {
        await deleteSort({
          id: item.id
          // logData: {
          //   operateType: 3,
          //   name: this.$t('entity.entityGroup'),
          //   value: 'name',
          //   deleteArr: [item]
          // }
        });
        this.groupList.splice(this.curIndex, 1);
        this.$emit('update:asideLoading', false);
        this.curIndex = 0;
        this.getSidebar.selectList(this.groupList[this.curIndex], this.curIndex);
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.delete', { name: this.$t('entity.group') })
          })
        });
      } catch (error) {
        this.$emit('update:asideLoading', false);
      }
    },
    // 拖拽结束
    draggableEnd(evt, list) {
      // console.log(evt, list);
      const params = {
        id: this.groupList[evt.oldIndex].id,
        sno: evt.newIndex
        // id: this.groupList[evt.oldIndex].id,
        // idOne: this.groupList[evt.oldIndex].id,
        // idTwo: this.groupList[evt.newIndex].id
        // tableName: 'sys_entity_table_group',
        // logData: {
        //   operateType: 4,
        //   name: this.$t('entity.entityGroup'),
        //   switchName: this.groupList[evt.oldIndex].name
        // }
      };
      this.groupList = list;
      this.changeModifySortSon(params);
    },
    // 移动分组
    async changeModifySortSon(params) {
      await changeModifySortSon(params);
      this.groupList.forEach((item, index) => {
        item.sno = index + 1;
      });
    },
    // 获取分组列表
    async getListSort() {
      this.$emit('update:asideLoading', true);
      try {
        const data = await getListSort();
        data.unshift({
          id: -10,
          sno: -10,
          name: this.$t('importTemplate.systemModule')
        });
        this.groupList = data;
        this.getSidebar.selectList(data[this.curIndex], this.curIndex);
        this.$emit('update:asideLoading', false);
      } catch (error) {
        this.$emit('update:asideLoading', false);
      }
    },

    // 改变数字
    changeTableTotal(num) {
      this.groupList[this.curIndex].tableTotal = num;
    },

    // 重置分组
    resetGroup() {
      this.curIndex = 0;
      this.getListSort();
    }
  },

  watch: {
    groupList: {
      handler(v) {
        this.$store.commit('setEntityGroup', v);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.iconfont {
  font-size: 18px;
}

.leftWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left_div_addBtn_wrap {
    margin: 6px 8px;
    width: 224px;
    height: 30px;

    ::v-deep {
      .el-button--default {
        padding: 0 !important;
        width: 100%;
        height: 30px;
      }
    }
  }
}

.left_div_addBtn_wrap_btnGroup {
  display: flex;
  margin-top: 10px;

  ::v-deep {
    .el-button {
      padding: 0 !important;
      width: 100%;
      height: 30px;
    }
  }
}

.leftWrap_ul_listWrap {
  height: calc(100% - 42px);
  overflow: auto;
}

.leftWrap_li_liWrap {
  position: relative;
  height: 36px;
  display: flex;
  line-height: 36px;
  border-radius: 2px;
  border-left: 3px solid #fff;

  .leftWrap_li_liWrap_ope {
    flex: 1;
    display: flex;
    position: relative;
    align-items: center;

    ::v-deep {
      .el-input__inner {
        padding: 0 !important;
        width: 168px;
        height: 28px;
        margin-left: 4px;
      }
    }
    .number {
      display: none;
      margin-left: 10px;
      box-sizing: border-box;
      text-align: center;
      padding: 0 8px;
      min-width: 28px;
      height: 20px;
      line-height: 20px;
      background: $--color-primary;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .leftWrap_li_liWrap_folder {
    flex: 0 0 55px;
  }
}
.icon-xinzengwenjianjia {
  color: $--color-primary;
}

.icon-zongxiangtuodong {
  position: absolute;
  display: none;
  color: $--color-primary;
  left: 10px;
}
.icon-fenzuchangtai,
.icon-fenzuzhankai {
  color: #fab71c;
  margin-left: 38px;
}
.active,
.leftWrap_li_liWrap:hover {
  background: $--hover-color;
  cursor: pointer;

  .left_span_eslcape {
    color: $--color-primary;
  }

  .left_span_count {
    background: $--color-primary;
  }

  .icon-zongxiangtuodong {
    display: block;
  }

  .number {
    display: block !important;
  }
}
.leftWrap_li_liWrap:hover {
  border-color: transparent;
}
.active {
  border-color: $--color-primary !important;
}

.flex {
  line-height: 36px;
}

.left_span_name {
  display: inline-block;
  height: 36px;
  width: 110px;
  margin-left: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #333333;
}

.left_span_eslcape {
  line-height: 36px;
  font-size: 18px;
  color: #ffffff;
}

.left_span_count {
  width: 28px;
  height: 20px;
  display: inline-block;
  margin-top: 8px;
  margin-left: 10px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
  border-radius: 10px;
}
</style>
