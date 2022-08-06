<!--
 * @Descripttion: 左侧列表
 * @Author: ytx
 * @Date: 2021-06-02 14:46:53
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-02 14:46:53
-->
<template>
  <apiot-sidebar
    ref="sidebar"
    :curIndex.sync="curIndex"
    :groupList="groupList"
    :itemIconArr="[]"
    :isNeedNum="false"
    :isEllipsis="true"
    class="leftWrap"
    @dragEnd="draggableEnd"
    @selectList="selectList"
    @doAddGroup="doAddGroup"
    @deleteGroup="deleteGroup"
    @handleSubmitGroupName="handleSubmitGroupName"
  ></apiot-sidebar>
</template>

<script>
import {
  changeGroupPos,
  getListModelMenu,
  postDeleteModel,
  postInsertModel,
  postModifyModel
} from '@/api/helpCenter';

export default {
  props: {
    parentId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      curIndex: 0, // 当前选中item 的下标
      groupList: [], // 分组信息列表
      backGroupList: []
    };
  },
  components: {},
  computed: {
    getSidebar() {
      return this.$refs.sidebar || {};
    }
  },
  activated() {
    this.getSidebarList();
  },

  methods: {
    // 修改名字
    async handleSubmitGroupName() {
      const params = {
        // 一级父节点ID (帮助文档-1 视频教程-2 常见问题-3 更新日志-4)
        parentId: this.parentId,
        // 模块名称
        name: this.getSidebar.groupname,
        // 二级父节点ID
        parentSid: this.getSidebar.selectedKey
      };
      this.handleSidebarFun(params, 'edit');
    },
    selectList(item) {
      // 切换分组
      this.$emit('changeGroup', item);
    },
    // 操作侧边栏的方法
    async handleSidebarFun(params, type) {
      try {
        if (type === 'add') {
          const data = await postInsertModel(params);
          this.groupList.push(data);
          this.getSidebar.selectList(data, this.groupList.length - 1);
          this.getSidebar.doAfterHide();
          this.$message({
            type: 'success',
            message: this.$t('common.success', {
              name: this.$t('common.add', { name: this.$t('common.group') })
            })
          });
        } else if (type === 'edit') {
          await postModifyModel(params);
          this.getSidebar.isEditKey = -1;
          this.getSidebar.oldGroupname = '';
          this.getSidebar.groupList[this.curIndex].name = this.getSidebar.groupname;
          this.$message({
            type: 'success',
            message: this.$t('common.success', {
              name: this.$t('common.edit', { name: this.$t('entity.group') })
            })
          });
        }
      } catch (error) {
        // 需要校验
        if (type === 'edit') {
          this.getSidebar.isEditKey = -1;
          if (error.code === 'W0001') {
            // 并发 分组不存在
            this.resetGroup();
          }
        }
        if (error.name) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('common.group') })}${error.name}`
          });
        }
      }
    },
    // 新增取消
    doAfterHide() {
      // 输入框值清空值
      this.input = '';
      this.value = false;
    },
    // 新增分组
    async doAddGroup() {
      const params = {
        // 一级父节点ID (帮助文档-1 视频教程-2 常见问题-3 更新日志-4)
        parentId: this.parentId,
        // 模块名称
        name: this.getSidebar.input
      };
      this.handleSidebarFun(params, 'add');
    },
    // 改变数字
    changeTableTotal(num) {
      this.groupList[this.curIndex].tableTotal = num;
    },
    // 删除分组
    async deleteGroup(item) {
      if (item.tableTotal) {
        return this.$message({
          type: 'warning',
          message: this.$t('helpCenter.contentUnderThisgroupAndCannotBeDeleted')
        });
      }
      this.$emit('update:asideLoading', true);
      try {
        await postDeleteModel({
          // 一级父节点ID (帮助文档-1 视频教程-2 常见问题-3 更新日志-4)
          parentId: this.parentId,
          // 二级父节点ID
          parentSid: item.id
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
      const params = {
        parentId: this.parentId,
        isModel: 1,
        id: this.groupList[evt.oldIndex].id,
        sno: this.groupList[evt.newIndex].sno
      };
      this.groupList = list;
      this.changeGroupPos(params);
    },
    // 移动分组
    async changeGroupPos(params) {
      await changeGroupPos(params);
      // this.getSidebarList();
      this.groupList.forEach((item, index) => {
        item.sno = index + 1;
      });
    },
    // 获取分组列表
    async getSidebarList() {
      this.$emit('update:asideLoading', true);
      try {
        // 帮助文档-1 视频教程-2  常见问题-3 更新日志-4
        const data = await getListModelMenu({ parentId: this.parentId });
        this.groupList = data;
        // this.selectList(data[this.curIndex], this.curIndex);
        this.getSidebar.selectList(data[this.curIndex], this.curIndex);
        this.$emit('update:asideLoading', false);
      } catch (error) {
        this.$emit('update:asideLoading', false);
      }
    },
    // 重置分组
    resetGroup() {
      this.curIndex = 0;
      this.getSidebarList();
    }
  }
};
</script>
<style lang='scss' scoped>
.iconfont {
  font-size: 18px;
}

.leftWrap {
  ::v-deep {
    .sidebar__list--text {
      flex: 0 0 138px;
      max-width: 138px;
    }
  }
}
</style>
