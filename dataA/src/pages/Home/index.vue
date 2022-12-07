<!-- 页面 -->
<template>
  <div class="page flex-col">
    <Header></Header>
    <div class="main4">
      <div class="tabMain">
        <div
            class="pc tabCommon"
            :class="{pcActive: active === 'PC'}"
            @click="doClick('PC')"
        >PC端看板
        </div>
        <div
            class="app tabCommon"
            :class="{appActive: active === 'APP'}"
            @click="doClick('APP')"
        >移动端看板
        </div>
      </div>
      <div class="section2 flex-row">
        <GroupList
            :type="active"
            ref="groupList"
            :getGroupInfo="getGroupInfo"
            :key="keys"
        />
        <Main :viewList="viewList" :list="list" :type="active" @refresh="refresh"></Main>
      </div>
    </div>
    <CDialog
        :visible.sync="visible"
        :isNeedCancelBtn="false"
        title="创建项目"
        :append-to-body="true"
        @handleOk="handleOk"
    >
      <ProjectConfig
          ref="projectConfig"
          v-if="visible"
          :viewObj="viewObj"
      />
    </CDialog>
  </div>
</template>

<script>
import Bus from '@/utils/bus';
import {getViewByGroup, addView, delView, copyView, updateView, switchViewGroup} from '@/services/home';
// import pcActive from '@/assets/pcActive.svg';
// import pcHover from '@/assets/pcHover.svg';
// import normalBg from '@/assets/mnomarl.svg';
// import mActive from '@/assets/mHover.svg'

const GroupList = () => import('./GroupList/index');
const Main = () => import('./Main/index');
const ProjectConfig = () => import('./ProjectConfig/index');
const Header = () => import('./Header/index');

export default {
  data() {
    return {
      visible: false,
      group: {},
      viewList: [], // 项目列表
      viewObj: {},
      list: [],
      active: 'PC',
      keys: 0
    };
  },

  components: {
    GroupList,
    Main,
    ProjectConfig,
    Header
  },

  mounted() {
    Bus.$off('GroupList').$on('GroupList', (message = []) => {
      this.list = message;
    })
    Bus.$off('doAddProject').$on('doAddProject', (message = {}) => {
      this.viewObj = message;
      this.doAddProject();
    });
    Bus.$on('chooseGroup', (message) => {
      this.group = message;
      this.fetchViewList();
    });
    Bus.$off('delProject').$on('delProject', (message) => {
      this.doDelProject(message);
    });
    Bus.$off('copyProject').$on('copyProject', (message) => {
      this.doCopyProject(message);
    });
    Bus.$off('editProject').$on('editProject', (message = {}) => {
      this.viewObj = JSON.parse(JSON.stringify(message));
      this.doAddProject();
    });
    Bus.$off('switchProject').$on('switchProject', (message) => {
      this.doSwitchProject(message);
    });
    const type = sessionStorage.getItem('homeActive');
    if (type) {
      this.active = type;
    }
  },
  watch: {},
  methods: {
    doClick(type) {
      sessionStorage.setItem('homeActive', type);
      sessionStorage.removeItem('groupDataSelect');
      this.active = type;
    },
    getGroupInfo(message) {
      this.group = message;
      this.fetchViewList();
    },
    refresh() {
      this.fetchViewList();
    },
    async doSwitchProject({info, type}) { // 切换分组
      try {
        await switchViewGroup({groupId: type, id: info.id})
        await this.fetchViewList();
        this.$refs.groupList.init();
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      } catch (e) {
        this.$message({
          type: 'error',
          message: '切换分组失败!'
        });
      }
    },
    async doCopyProject(info) {
      await copyView({
        id: info.id,
        groupId: this.group.id,
        name: `${info.name}(复制)`
      });
      await this.fetchViewList();
    },
    doDelProject(info) { // 删除
      this.$confirm(`此操作将删除${info.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await delView({id: info.id})
          await this.fetchViewList();
          this.$refs.groupList.init();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (e) {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddProject() { // 新增
      if (!this.list.length) {
        this.$message.error('请选择分组再创建项目!');
        return
      };
      this.visible = true;
    },
    async fetchViewList() { // 获取屏幕列表
      const {id} = this.group;
      const data = await getViewByGroup({id});
      this.viewList = data;
    },
    handleOk() { // 新增大屏
      this.$refs.projectConfig.$refs.numberValidateForm.validate((valid) => {
        if (valid) {
          const {obj} = this.$refs.projectConfig;
          const {name, datasourceId} = obj;
          const params = {
            name,
            datasourceId,
            groupId: this.group.id,
            type: this.active
          }
          this.handleSave(params);
        } else {
          return false;
        }
        return false;
      });
    },
    async handleSave(params) {
      try {
        const api = this.viewObj.id ? updateView : addView;
        const param = this.viewObj.id ? {
          ...params,
          id: this.viewObj.id
        } : params;
        await api(param);
        await this.fetchViewList();
        this.visible = false;
        if (!this.viewObj.id) {
          this.keys += 1;
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  beforeDestroy() {
    Bus.$off('doAddProject');
    Bus.$off('chooseGroup');
    Bus.$off('copyProject');
    Bus.$off('delProject');
    Bus.$off('editProject');
    Bus.$off('GroupList');
    Bus.$off('switchProject');
  },
  name: 'home'
};
</script>

<style lang='scss' scoped>
.page {
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(5, 16, 58, 1);
  overflow: hidden;
  justify-content: flex-start;
  padding-top: 0;
}

.main4 {
  z-index: 43;
  height: calc(100% - 191px);
  min-width: 1024px;
  background-color: rgba(19, 30, 69, 1);
  width: calc(100% - 40px);
  justify-content: flex-end;
  padding-bottom: 27px;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 191px;
  transform: translate(-50%, 0);
}

.tabMain {
  width: 100%;
  height: 66px;
  display: flex;
  padding-left: 20px;
  align-items: center;
  box-shadow: inset 0px -1px 0px 0px #2F437F;
  box-sizing: border-box;

  .tabCommon {
    width: 154px;
    height: 36px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #949AB0;
    box-sizing: border-box;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .pc {
    background-image: url('~@/assets/pcActive.png');
  }
  .pcActive {
    color: #ffffff;
    background-image: url('~@/assets/pcHover.png');
  }
  .pc:hover {
    color: #ffffff;
    background-image: url('~@/assets/pcHover.png');
  }

  .app {
    margin-left: 10px;
    background-image: url('~@/assets/mnomarl.png');
  }
  .appActive{
    color: #ffffff;
    background-image: url('~@/assets/mHover.png');
  }
  .app:hover {
    color: #ffffff;
    background-image: url('~@/assets/mHover.png');
  }
}

.section2 {
  z-index: auto;
  width: 100%;
  height: calc(100% - 20px);
  justify-content: space-between;
}

.bd2 {
  z-index: auto;
  width: 211px;
  height: 20px;
}

.box8 {
  z-index: 90;
  height: 36px;
  width: 240px;
  justify-content: center;
  align-items: center;
}

.layer3 {
  z-index: auto;
  width: 211px;
  height: 28px;
  justify-content: space-between;
}

.label4 {
  z-index: 93;
  width: 18px;
  height: 16px;
  margin-top: 6px;
}

.main6 {
  z-index: 91;
  height: 28px;
  border-radius: 2px;
  border: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  width: 186px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 7px;
}

.bd3 {
  z-index: auto;
  width: 43px;
  height: 19px;
  justify-content: space-between;
}

.word3 {
  z-index: 92;
  width: 42px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: left;
  margin-top: 1px;
}

.wrap1 {
  z-index: 98;
  width: 1px;
  height: 19px;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPnga3dc11037dc59bb4dedabb6f5ab562b28fd1d55dfc372f3f921a716f20a736e2) 100% no-repeat;
}

.main9 {
  z-index: 154;
  height: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  width: 52px;
  justify-content: center;
  align-items: center;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

</style>
