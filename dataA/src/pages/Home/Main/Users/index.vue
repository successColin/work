/**
* @name: index
* @author: DELL
* @date: 2022/11/21 14:55
* @description：index
* @update: 2022/11/21 14:55
*/
<!-- 页面 -->
<template>
  <div class="usersWrap">
    <div class="usersContent">
      <el-tag
          size="small"
          closable
          @close="del(i)"
          v-for="(user, i) in innerUserIds" :key="user.id">{{ user.account }}</el-tag>
    </div>
    <div class="usersOper" @click="visible=true">+</div>
    <CDialog
        :visible.sync="visible"
        :isNeedCancelBtn="false"
        :append-to-body="false"
        title="用户列表"
        @handleOk="handleOk"
    >
      <userList ref="userList" v-if="visible" :users="innerUserIds"></userList>
    </CDialog>
  </div>
</template>

<script>
const userList = () => import('./UserList/index');
export default {
  props: {
    innerUserIds : {
      type: Array,
      default(){
        return [];
      }
    }
  },
  data() {
    return {
      visible: false,
      selectKeys: []
    };
  },

  components: {
    userList
  },

  computed: {
  },

  mounted() {},
  watch: {
    innerUserIds:{
      handler(v){
        console.log(v);
      }
    }
  },
  methods: {
    del(i) {
      const arr = [...this.innerUserIds];
      arr.splice(i, 1);
      this.$emit('change', arr);
    },
    handleOk() {
      const {selectKeys = []} = this.$refs.userList
      if (!selectKeys.length) {
        this.$message.error('请选择用户!');
        return
      }
      // this.selectKeys = selectKeys;
      this.$emit('change', selectKeys);
      this.visible = false;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.usersWrap {
  width: 100%;
  height: 32px;
  display: flex;
  background: #192757;

  box-sizing: border-box;

  .usersContent {
    flex: 1;
    line-height: 30px;
    border-top: 1px solid #2F437F;
    border-left: 1px solid #2F437F;
    border-bottom: 1px solid #2F437F;
    overflow: hidden;
    //white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;

    ::v-deep {
      .el-tag {
        margin-left: 5px;
        background: rgba(70, 137, 245, 0.4);
        border-radius: 15px;
        color: #FFFFFF;
        border-color: rgba(70, 137, 245, 0.4);
      }

      .el-tag__close {
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        color: #666666;
      }

      .el-tag__close:hover {
        color: #FFFFFF;
      }
    }
  }

  .usersOper {
    width: 32px;
    height: 32px;
    text-align: center;
    background: #192757;
    line-height: 30px;
    color: #4689F5;
    border: 1px solid #2F437F;
    //border-right: 1px solid #2F437F;
    //border-bottom: 1px solid #2F437F;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>
