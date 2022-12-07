/**
* @name: index
* @author: DELL
* @date: 2022/11/21 9:08
* @description：index
* @update: 2022/11/21 9:08
*/
<!-- 页面 -->
<template>
  <div class="configWrap">
    <el-radio-group v-model="publish">
      <el-radio :label="2">停止发布</el-radio>
      <br/>
      <el-radio :label="1">公开发布</el-radio>
      <br/>
      <el-radio :label="3">需要token校验</el-radio>
    </el-radio-group>
    <users v-if="publish===3" :innerUserIds=innerUsers @change="changeUser"></users>
    <div class="enableWrap" v-if="publish!==2">
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
    <!--    <c-input-->
    <!--        type="number"-->
    <!--        :min="1"-->
    <!--        :step="0.5"-->
    <!--        :numberValue="expirationTime"-->
    <!--        @Input-Change="(v) => expirationTime=v"-->
    <!--    ></c-input>-->
  </div>
</template>

<script>
const users = () => import('../Users/index');
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      publish: 1,
      expirationTime: '', // 默认24小时
      verifyExpires: false, // 链接有效时长
      innerUsers: []
    };
  },

  components: {
    users
  },

  computed: {},

  mounted() {
    if (this.info.id) {
      const {publish, innerUsers = [], verifyExpires, expirationTime = '' } = this.info;
      this.publish = publish;
      this.verifyExpires = verifyExpires;
      this.innerUsers = innerUsers;
      this.expirationTime = expirationTime;
    }
  },

  methods: {
    changeUser(usersString) {
      this.innerUsers = usersString;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.configWrap {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 40px;
  box-sizing: border-box;

  ::v-deep {
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
    margin-top: 10px;
  }

  .enableWrap > span {
    margin-right: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    opacity: 0.7;
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
}
</style>
