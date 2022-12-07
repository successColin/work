/**
* @name: index
* @author: DELL
* @date: 2022/11/23 9:36
* @description：index
* @update: 2022/11/23 9:36
*/
<!-- 页面 -->
<template>
  <!-- app 发布成功 -->
  <el-dialog
      class="publishWrap"
      title="发布设置"
      :visible="dialogVisible"
      @close="close"
      width="640px"
  >
    <div>
      <el-radio-group v-model="publish">
        <el-radio :label="2">停止发布</el-radio>
        <br/>
        <el-radio :label="1">公开发布</el-radio>
        <br/>
        <el-radio :label="3">需要token校验</el-radio>
      </el-radio-group>
      <users v-if="publish===3" :innerUserIds=innerUsers @change="changeUser"></users>
      <div class="enableWrap" v-if="publish!==2">
        <div class="enableWrapSetting">
          <span>链接到期时间设置</span>
          <el-switch
              v-model="verifyExpires"
              active-color="#4689F5"
              inactive-color="#233E79">
          </el-switch>
        </div>
        <el-date-picker
            class="timerPickerWrap"
            v-if="verifyExpires&& [1, 3].includes(publish) "
            v-model="expirationTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择到期时间"
            popper-class="timePick"
            :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>

      <div class="publishContent" :class="{appSize: type==='APP'}">
        <div class="qrContent" v-if="type==='APP'">
          <div class="qrWrap">
            <qrcode-vue :value="`${publishUrl}?designTypePreview=APP`"></qrcode-vue>
          </div>
          <div class="qrDes">手机扫码</div>
          <div class="qrDes">预览效果</div>
        </div>
        <div class="urlWrap" :class="{appSpe: type==='APP'}">
          <div class="urlTitle">发布公开地址</div>
          <div class="urlAddress">
            <div class="urlName">{{ publishUrl }}</div>
            <div class="copyWrap" :data-clipboard-text="publishUrl">
              <span class="icon-lianjie iconfont"></span>
              复制链接
            </div>
          </div>
        </div>
      </div>

    </div>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleOk" :loading="loading">更改发布设置</el-button>
  </span>
  </el-dialog>
</template>

<script>
import Clipboard from 'clipboard';
import QrcodeVue from 'qrcode.vue';
import {updateView} from '@/services/home';

const users = () => import('../../Home/Main/Users/index');

export default {
  props: {
    dialogVisible: { // 显示隐藏
      type: Boolean,
      default: false
    },
    type: { // 大屏类型
      type: String,
      default: 'PC'
    },
    publishUrl: { // 发布地址
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      loading: false,
      clipboard: null,
      publish: 1,
      expirationTime: '', // 默认24小时
      verifyExpires: false, // 链接有效时长
      innerUsers: []
    };
  },

  components: {
    QrcodeVue,
    users
  },

  computed: {},

  mounted() {
    this.clipboard = new Clipboard('.copyWrap');
    this.clipboard && this.clipboard.on('success', () => {
      this.$message.success('复制成功！');
    });
    const {info, newInfo} = this.getInfo();
    if (info) {
      if (newInfo.id) {
        const {publish, innerUsers = [], verifyExpires, expirationTime = ''} = newInfo;
        this.publish = publish;
        this.verifyExpires = verifyExpires;
        this.innerUsers = innerUsers;
        this.expirationTime = expirationTime;
      }
    }
  },

  methods: {
    getInfo() {
      const info = sessionStorage.getItem('bgInfo');
      let newInfo
      try {
        newInfo = JSON.parse(info);
      } catch (e) {
        newInfo = {};
      }
      return {
        info,
        newInfo
      };
    },
    async handleOk() {
      const {expirationTime, innerUsers, publish, verifyExpires} = this;
      const {newInfo} = this.getInfo();
      const {id, datasourceId} = newInfo;
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
      this.loading = true;
      try {
        await updateView(params);
        this.$message.success('发布设置成功!');
        this.$emit('close');
        sessionStorage.setItem('bgInfo', JSON.stringify({
          ...newInfo,
          expirationTime,
          innerUsers,
          publish,
          verifyExpires
        }));
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },

    close() {
      this.$emit('close');
    },
    changeUser(usersString) {
      this.innerUsers = usersString;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.publishWrap {
  .appSize {
    margin-top: 20px;
  }

  .publishContent {
    display: flex;

    .qrContent {
      //width: 128px;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-left: 6px;
      padding-right: 36px;
      border-right: 1px solid #2F437F;
    }

    .qrWrap {
      width: 100px;
      height: 100px;
      padding: 5px;
      margin-bottom: 6px;
      background: #192757;
      border: 1px solid #2F437F;
    }

    .qrDes {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 18px;
    }

    .urlWrap {
      margin-top: 10px;
      flex: 1;

      &.appSpe {
        display: block;
        margin-left: 30px;

        .urlAddress {
          display: block;

          & .urlName {
            width: 100%;
          }

          & .copyWrap {
            float: right;
            margin-top: 30px;
          }
        }
      }
    }
  }

  ::v-deep {
    .el-dialog__header {
      height: 54px;
      padding: 0 0 0 20px;
      line-height: 54px;
      background: #131E45;
      border-bottom: 1px solid #2f437f;
      box-sizing: border-box;

      .el-dialog__title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4689F5;
      }
    }

    .el-dialog__body {
      height: 402px;
      background: #131E45;
    }

    .el-dialog__footer {
      padding: 10px 20px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: #182551;
      box-shadow: 0px 0px 1px 0px #2f437f;
    }

    .el-radio-group .el-radio {
      height: 30px;

      .el-radio__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        opacity: 0.7;
      }
    }

  }

  .enableWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    height: 35px;
  }

  .enableWrap .enableWrapSetting > span {
    margin-right: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    opacity: 0.7;
  }

  .enableWrapSetting {
    height: 30px;
    line-height: 30px;
  }

  .timerPickerWrap {
    margin-top: 5px;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        background: #182551;
        color: #f6f6f6;
        border-color: rgb(35, 62, 121);
      }

      .el-input__icon {
        line-height: 30px;
      }
    }
  }

  .urlTitle {
    height: 30px;
    font-size: 14px;
    opacity: 0.7;
    line-height: 30px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }

  .urlAddress {
    height: 32px;
    display: flex;

    & > .urlName {
      flex: 1;
      margin-right: 20px;
      padding-left: 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      background: #192757;
      border: 1px solid #2F437F;
      box-sizing: border-box;
    }

    .copyWrap {
      width: 100px;
      height: 32px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 32px;
      background: #4689F5;
      cursor: pointer;
    }

    .copyWrap:hover {
      background-color: #6CA3FD;
    }
  }
}
</style>
