/**
* @name: index
* @author: DELL
* @date: 2023/2/20 16:30
* @description：index
* @update: 2023/2/20 16:30
*/
<!-- 页面 -->
<template>
  <div class="main" v-loading="mLoading">
    <div class="main__content">
      <FormCard ref="formHead" :value="details.commonApiHeader"></FormCard>
      <div class="main__content--config">
        <div class="main__content--var">
          <VarManage
              :value="details.commonApiParams"
              @changeVar=changeCommonApiParams
          ></VarManage>
        </div>
        <div class="main__content--details">
          <VarConfig :info="details" :variables="details.commonApiParams"></VarConfig>
        </div>
      </div>
    </div>
    <div class="main__footer">
      <apiot-button v-if="info.id" @click="del">删除</apiot-button>
      <apiot-button type="primary" @click="saveConfig" :loading="loading">保存</apiot-button>
    </div>
    <EntityTableDialog
        :visible.sync="visible"
        :type="type"
        :details="details"
        :value="opeaItem"/>
    <DataConverDialog
        :visible.sync="visible1"
        :value="formData"
    />
    <LogDetialsDialog
      ref="LogDetialsDialog"
      :visible.sync="visible2"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getApiInfo, doSaveApi, delApi } from '@/api/proxy';
import { IsURL } from '_v/HomeMenuConfig/constants/common';
import EntityTableDialog from './components/entityTableDialog';
import DataConverDialog from './components/dataConverDialog';
import LogDetialsDialog from './components/logDetialsDialog';

const FormCard = () => import('./components/apiHeadForm');
const VarManage = () => import('./components/varManage');
const VarConfig = () => import('./components/varConfig');

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      mLoading: false,
      type: 'add', // 类型
      visible: false, // 弹框
      visible1: false,
      visible2: false,
      formData: {},
      opeaItem: {}, // 操作对象
      loading: false,
      details: {
        commonApiHeader: {
          protocol: 0,
          restType: 1,
          authType: 0,
          authBody: '{}',
          dataProcess: 0
        },
        commonApiParams: [],
        commonApiMappingTables: []
      } // 接口详情
    };
  },

  components: {
    DataConverDialog,
    EntityTableDialog,
    FormCard,
    VarManage,
    VarConfig,
    LogDetialsDialog
  },

  computed: {},

  mounted() {
    if (this.info.id) {
      this.init();
    } else {
      this.details.commonApiHeader.groupId = this.info.groupId;
    }
    this.$bus.$off('addInfoToTable').$on('addInfoToTable', ({ type, opeaItem }) => {
      this.opeaItem = opeaItem;
      this.type = type;
      this.visible = true;
    });
    this.$bus.$off('editDataConver_inApi').$on('editDataConver_inApi', (message) => {
      this.visible1 = true;
      this.formData = message;
    });
    this.$bus.$off('look_api_log').$on('look_api_log', (message) => {
      this.visible2 = true;
      this.$refs.LogDetialsDialog.setValue(message);
    });
  },
  watch: {
    info(v) {
      if (v && v.type === 2 && v.id) {
        this.init();
      } else {
        this.details = {
          commonApiHeader: {
            protocol: 0,
            restType: 1,
            authType: 0,
            authBody: '{}',
            dataProcess: 0,
            groupId: this.info.groupId
          },
          commonApiParams: [],
          commonApiMappingTables: []
        };
      }
    }
  },
  methods: {
    async doSave() {
      this.loading = true;
      try {
        const res = await doSaveApi({ ...this.details });
        this.loading = false;
        this.$message.success('保存成功!');
        this.$bus.$emit('api_tree_change', res);
      } catch (e) {
        this.loading = false;
        this.$message.success('保存失败!');
      }
    },
    async saveConfig() {
      this.$refs.formHead.formDetials().validate(async (flag) => {
        if (flag) {
          await this.doSave();
        } else {
          const { commonApiHeader: { keycode, name, protocol, url, authType = 2, authBody = '{}' } } = this.details;
          if (!keycode) {
            this.$message.error('请填写业务编码!');
            return;
          }
          if (!name) {
            this.$message.error('请填写业务编码!');
            return;
          }
          if (protocol === 0 && (!url || !IsURL(url))) {
            this.$message.error('请填写正确的请求地址!');
            return;
          }
          const obj = JSON.parse(authBody);
          const { username = '', password = '', key = '', value = '', addTo = 'Header' } = obj;
          if (authType === 1 && (!username || !password)) {
            this.$message.error('请填写用户名和密码!');
            return;
          }
          if (authType === 2 && (!key || !value || !addTo)) {
            this.$message.error('请填写属性和值!');
          }
        }
      });
    },
    async init() {
      try {
        this.mLoading = true;
        const res = await getApiInfo({ headerId: this.info.id });
        this.details = res;
        this.mLoading = false;
      } catch (e) {
        this.mLoading = false;
      }
    },
    // 更新变量
    changeCommonApiParams({ type, value }) {
      const { commonApiParams = [], commonApiHeader: { id } } = this.details;
      if (type === 'add') {
        commonApiParams.push({ ...value, commonApiHeaderId: id });
      } else if (type === 'edit') {
        const i = commonApiParams.findIndex((item) => (item.keycode === value.keycode));
        commonApiParams.splice(i, 1, value);
      } else if (type === 'del') {
        const i = commonApiParams.findIndex((item) => item.keycode === value.keycode);
        commonApiParams.splice(i, 1);
      }
    },
    del() {
      this.$confirm(`将删除编码为${this.details.commonApiHeader.keycode}的接口配置, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            await delApi({ headerId: this.details.commonApiHeader.id });
            this.$bus.$emit('del_api_node', this.info);
            this.$message.success('删除成功!');
          } catch (e) {
            this.$message.success('删除失败!');
          }
        });
    }
  },
  beforeDestroy() {
    this.$bus.$off('addInfoToTable');
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.main{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .main__content{
    width: 100%;
    height: calc(100% - 42px);
    padding: 10px 10px 0 10px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .main__content--config{
      flex: 1;
      margin-top: 10px;
      display: flex;
    }
    .main__content--var{
      width: 198px;
      height: 100%;
      margin-right: 12px;
      background: #FFFFFF;
      border-top: 1px solid #EBEBEB;
      border-left: 1px solid #EBEBEB;
      border-right: 1px solid #EBEBEB;
      box-sizing: border-box;
    }
    .main__content--details{
      flex: 1;
      height: 100%;
    }
  }
  .main__footer{
    width: 100%;
    height: 42px;
    position: absolute;
    display: flex;
    padding-right: 10px;
    align-items: center;
    justify-content: right;
    background: #FFFFFF;
    box-shadow: 1px 0px 0px 0px #E9E9E9, inset 0px 1px 0px 0px #EBEBEB;
    z-index: 2;
    box-sizing: border-box;
  }
}
</style>
