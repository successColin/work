/**
* @name: index
* @author: DELL
* @date: 2021/10/29 16:48
* @description：index
* @update: 2021/10/29 16:48
*/
<!-- 页面 -->
<template>
  <div class="main7 flex-row">
    <el-row>
      <el-col :span="6">
        <div class="block1 flex-col" @click="doAddProject">
          <div class="bd4 flex-col">
            <img
                class="label5"
                referrerpolicy="no-referrer"
                src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng330bf561803e00c0d217bc44bdca0b5face82748b2ef2487cd770c07742fe738"
            />
            <div class="bd5 flex-col">
              <span class="word4">创建空白项目</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-for="item in viewList" :key="item.id">
        <Card :info="item" v-bind="$attrs" @doShow="showPublishConfig"></Card>
      </el-col>
      <CDialog
          :visible.sync="visible"
          :isNeedCancelBtn="false"
          :append-to-body="true"
          title="发布设置"
          @handleOk="handleOk"
      >
        <PublishConfig :info="info" v-if="visible" ref="PublishConfig"></PublishConfig>
      </CDialog>
    </el-row>


  </div>
</template>

<script>
import Bus from '@/utils/bus';
import {updateView} from '@/services/home';

const Card = () => import('./Card/index');
const PublishConfig = () => import('./PublishConfig/index');

export default {
  props: {
    viewList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      info: {}, // 大屏信息
      visible: false
    };
  },

  components: {
    Card,
    PublishConfig
  },

  computed: {},

  mounted() {
  },

  methods: {
    doAddProject() {
      Bus.$emit('doAddProject');
    },
    async handleOk() {
      const {expirationTime, innerUsers, publish, verifyExpires} = this.$refs.PublishConfig;
      const {id, datasourceId} = this.info;
      if (verifyExpires && !expirationTime) {
        this.$message.error('请设置到期时间!');
        return
      }
      if (publish === 3 && !innerUsers.length) {
        this.$message.error('请选择校验的用户!');
        return
      }
      const params = {
        id,
        datasourceId,
        expirationTime,
        innerUsers,
        publish,
        verifyExpires
      }
      try {
        await updateView(params);
        this.$emit('refresh');
        this.visible = false;
        this.$message.success('发布设置成功!');
      } catch (e) {

      }
    },
    showPublishConfig(info) {
      this.visible = true;
      this.info = info;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.main7 {
  display: block !important;
  padding-top: 20px;
  z-index: auto;
  flex: 1;
  height: calc(100% - 80px);
  justify-content: space-between;
  overflow: auto;
  box-sizing: border-box;
}

.block1 {
  z-index: 100;
  height: 160px;
  //float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  //width: calc(33% - 20px);
  justify-content: flex-end;
  cursor: pointer;

  &:hover {
    background: rgba(70, 137, 245, 0.18);
  }

  &:hover .bd5 {
    border-top: 1px solid rgba(70, 137, 245, 0.18);
    background: rgba(70, 137, 245, 0.18);
  }
}

.bd4 {
  z-index: auto;
  width: 100%;
  height: 103px;
}

.label5 {
  z-index: 101;
  width: 16px;
  height: 16px;
  align-self: center;
}

.bd5 {
  z-index: 103;
  height: 40px;
  border-top: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  margin-top: 47px;
  width: 100%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.word4 {
  z-index: 104;
  width: 84px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: center;
}

.block2 {
  z-index: 106;
  height: 160px;
  border: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  width: 220px;
  justify-content: flex-end;
}

.group4 {
  z-index: 107;
  height: 40px;
  border: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  width: 220px;
  justify-content: center;
  align-items: center;
}

.bd6 {
  z-index: auto;
  width: 196px;
  height: 20px;
  justify-content: space-between;
}

.word5 {
  z-index: 111;
  width: 84px;
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

.outer1 {
  z-index: 109;
  height: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  width: 52px;
  justify-content: center;
  align-items: center;
}

.txt6 {
  z-index: 110;
  width: 36px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: left;
}

.block3 {
  z-index: 113;
  height: 160px;
  border: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(17, 27, 61, 1);
  width: 220px;
  justify-content: flex-end;
}

.main8 {
  z-index: auto;
  width: 100%;
  height: 130px;
}

.layer4 {
  z-index: 116;
  height: 30px;
  border-radius: 15px;
  background: linear-gradient(360deg, #4689F5 0%, #43DBFF 100%);
  align-self: center;
  width: 88px;
  justify-content: center;
  align-items: center;
}

.txt7 {
  z-index: 117;
  width: 59px;
  height: 14px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  letter-spacing: 0.7000000476837158px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 14px;
  text-align: center;
}

.layer5 {
  display: flex;
  justify-content: space-between;
  z-index: auto;
  width: 128px;
  height: 16px;
  text-align: center;
  margin: 16px auto 0 auto;
}

.icon2 {
  z-index: 138;
  width: 16px;
  height: 14px;
  margin-top: 1px;
}

.icon3 {
  z-index: 118;
  width: 16px;
  height: 16px;
}

.icon4 {
  z-index: 126;
  width: 16px;
  height: 16px;
}

.label6 {
  z-index: 144;
  width: 16px;
  height: 16px;
}

.layer6 {
  z-index: 152;
  height: 40px;
  border-top: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  margin-top: 28px;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.box9 {
  z-index: auto;
  width: 100%;
  height: 20px;
  padding: 0 12px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.txt8 {
  z-index: 156;
  width: 84px;
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

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.word6 {
  z-index: 155;
  width: 36px;
  height: 18px;
  display: block;
  padding: 0 10px;

  overflow-wrap: break-word;
  background-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  border-radius: 10px;
  line-height: 18px;
  text-align: left;
}
</style>
