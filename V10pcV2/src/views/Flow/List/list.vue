<!-- 页面 -->
<template>
  <apiot-sidebar
    ref="sidebar"
    :curIndex.sync="curIndex"
    :groupList="groupList"
    :isNeedNum="false"
    :notNeedOpeArr="[1]"
    :notNeedMoveArr="[1]"
    handle=".icon-zongxiangtuodong"
    @dragEnd="draggableEnd"
    @selectList="selectList"
    @doAddGroup="doAddGroup"
    @deleteGroup="deleteGroup"
    @handleSubmitGroupName="handleSubmitGroupName"
  ></apiot-sidebar>
</template>

<script>
import { addGroup, delGroup, getFlowGroup, switchGroupSno, updateGroup } from '@/api/flow';
import { errorMessageProcessing } from '@/utils/utils';

export default {
  data() {
    return {
      curIndex: 0, // 当前选中item 的下标
      groupList: [], // 分组信息列表
      backGroupList: [],
      renderGroupList: false
    };
  },

  components: {},

  computed: {
    getSidebar() {
      return this.$refs.sidebar || {};
    }
  },

  mounted() {
    this.initGroup();
    this.$bus.$on('renderGroupList', (isRender) => {
      this.renderGroupList = isRender;
    });
  },
  beforeDestroy() {
    this.$bus.$off('renderGroupList', () => {});
  },
  watch: {
    renderGroupList: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue) {
          // console.log('watch');
          this.initGroup(newValue);
        }
      }
    }
  },

  methods: {
    onMove(e) {
      if (e.relatedContext.element.id === 1) return false;
      return true;
    },
    async initGroup() {
      // 初始化列表
      this.$emit('update:asideLoading', true);
      try {
        const res = await getFlowGroup();
        this.groupList = res;
        this.getSidebar.selectList(res[this.curIndex], this.curIndex);
        this.renderGroupList = false;
        this.$bus.$emit('roleGroupList', res);
        this.$emit('update:asideLoading', false);
      } catch (e) {
        this.$emit('update:asideLoading', false);
      }
    },
    handleSubmitGroupName() {
      if (!this.getSidebar.groupname) {
        this.$message({
          showClose: true,
          message: this.$t('role.noGroupName')
        });
        return;
      }
      this.doUpdate(this.getSidebar.groupname);
    },
    async doUpdate(name) {
      this.$emit('update:asideLoading', true);
      try {
        const params = {
          id: this.getSidebar.selectedKey,
          name,
          logData: `${this.$t('role.editGroup')}: ${name}`
        };
        await updateGroup(params);
        this.$emit('update:asideLoading', false);
        await this.initGroup(true);
      } catch (e) {
        const Obj = {
          [`${this.$t('role.group')}${this.$t('role.name')}`]: e.name
        };
        errorMessageProcessing(Obj, (message) => {
          this.$message({
            type: 'warning',
            message
          });
        });
        this.$emit('update:asideLoading', false);
      }
    },
    selectList(item) {
      // 切换分组
      this.$bus.$emit('FlowGroup', item);
    },
    doAfterHide() {
      // 输入框值清空值
      this.input = '';
      this.value = false;
    },
    async doAddGroup() {
      // 新增分组
      if (!this.getSidebar.input) {
        this.$message.warning(this.$t('role.noGroupName'));
        return;
      }
      try {
        const n = this.groupList.length;
        const obj = this.groupList[n - 1] || {};
        const { sno: sno1 } = obj;
        await addGroup({
          sno: (sno1 || 0) + 1,
          name: this.getSidebar.input,
          logData: `新增分组（${this.getSidebar.input}）`
        });
        // this.$message.success();
        this.$message({
          type: 'success',
          message: this.$t('role.addGroupName')
        });
        this.getSidebar.doAfterHide();
        this.curIndex = n;
        await this.initGroup(true);
        // await this.getSidebar.selectList(data, this.groupList.length);
        // setTimeout(() => {
        //
        // }, 200);
      } catch (e) {
        console.log(e);
        this.value = false;
        const Obj = {
          [`${this.$t('role.group')}${this.$t('role.name')}`]: e.name
        };
        errorMessageProcessing(Obj, (message) => {
          this.$message({
            type: 'warning',
            message
          });
        });
      }
    },
    dragEnd() {
      this.isMove = false;
    },
    async draggableEnd(evt, list) {
      // 拖拽结束调用接口
      const params = {
        id: this.groupList[evt.oldIndex].id,
        sno: this.groupList[evt.oldIndex].sno,
        switchSno: this.groupList[evt.newIndex].sno,
        tableName: 'workflow_group',
        logData: {
          operateType: 4,
          name: '角色分组',
          switchName: this.groupList[evt.oldIndex].name
        }
      };
      try {
        await switchGroupSno(params);
        this.groupList = list;
      } catch (err) {
        // 拖拽失败数据还原
        this.initGroup(false);
      }
    },
    async deleteGroup({ id, name }) {
      this.$emit('update:asideLoading', true);
      try {
        await delGroup({
          id,
          logData: `删除数据:(流程分组:${name})`
        });
        this.curIndex = 0;
        this.getSidebar.selectList(this.groupList[this.curIndex], this.curIndex);
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.delete', { name: this.$t('entity.group') })
          })
        });
        this.$emit('update:asideLoading', false);
        await this.initGroup();
      } catch (e) {
        this.$emit('update:asideLoading', false);
      }
    }
  },
  name: 'List'
};
</script>

<style lang='scss' scoped>
</style>
