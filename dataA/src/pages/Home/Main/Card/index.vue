/**
* @name: index
* @author: DELL
* @date: 2021/10/29 16:55
* @description：index
* @update: 2021/10/29 16:55
*/
<!-- 页面 -->
<template>
  <div class="block1 flex-col">
    <div class="main8 flex-col">
      <div class="layer4 flex-col" @click="enterConfig">
        <span class="txt7">进入设计</span>
      </div>
      <div class="layer5">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-tooltip class="item" effect="dark" content="切换分组" placement="bottom">
            <span class="iconfont icon-qiehuan icon2"></span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
                v-for="item in list"
                :key="item.id"
                :command="item.id"
            >{{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip class="item" effect="dark" content="预览" placement="bottom">
          <div slot="content">
            <span v-if="type==='PC'">预览</span>
            <div v-if="type==='APP'">
              <qrcode-vue :value="preUrl"></qrcode-vue>
            </div>
          </div>
          <span class="iconfont icon-yulan icon3" @click="doPreview"></span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="访问应用" placement="bottom">
          <div slot="content">
            <span v-if="type==='PC'">访问应用</span>
            <div v-if="type==='APP'">
              <qrcode-vue :value="preUrl"></qrcode-vue>
            </div>
          </div>
          <span class="iconfont icon-fabuxiaoguoyulan icon3" @click="doVisit"></span>
        </el-tooltip>

        <el-dropdown trigger="click">
          <el-tooltip class="item" effect="dark" content="更多操作" placement="bottom">
            <span class="iconfont icon-gengduocaozuo icon3"></span>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="copy">
                <span class="iconfont icon-fuzhi"></span>
                <span style="vertical-align: top;margin-left: 5px;">复制</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="doEdit">
                <span class="iconfont icon-bianji"></span>
                <span style="vertical-align: top;margin-left: 5px;">编辑</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="doDel">
                <span class="iconfont icon-shanchu"></span>
                <span style="vertical-align: top;margin-left: 5px;">删除</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="layer6 flex-col">
        <div class="box9 flex-row">
          <span class="txt8" :title="info.name">{{ info.name }}</span>
          <span class="word6" :class="{publish: info.publish === 1}">{{ info.publish === 2 ? '未发布' : '已发布' }}</span>
        </div>
      </div>
    </div>
    <div class="switchWrap">
      <el-tooltip
          class="item"
          effect="dark"
          content="发布设置"
          placement="bottom"
      >
        <span class="iconfont icon-shezhi" @click="handleClick"></span>
        <!--        <el-switch-->
        <!--            v-model="info.publish"-->
        <!--            @change="changePublish"-->
        <!--            :active-value="1"-->
        <!--            :inactive-value="2"-->
        <!--            active-color="#4689F5"-->
        <!--            inactive-color="#233E79">-->
        <!--        </el-switch>-->
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import Bus from '@/utils/bus';
import {makeUrl} from '@/utils/utils';
import {getDesignList} from '@/services/design';
// import {getDesignList, doPublish} from '@/services/design';


export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    },
    list: {
      type: Array,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      default() {
        return 'PC';
      }
    }
  },
  data() {
    return {};
  },

  components: {
    QrcodeVue
  },

  computed: {
    makeId() {
      return function (id) {
        return window.btoa(id)
      }
    },
    preUrl() {
      const url = makeUrl();
      return `${url}${this.makeId(this.info.id)}?designTypePreview=APP`;
    }
  },

  mounted() {
    console.log(this.type, 'pc');
  },

  methods: {
    handleClick() {
      this.$emit('doShow', this.info);
    },
    async doVisit() { // 访问应用
      if (this.type === 'APP') {
        return;
      }
      const {id} = this.info;
      const {href} = this.$router.resolve({
        path: `/menu/${this.makeId(id)}`
      });
      window.open(href, '_blank');
    },
    async doPreview() { // 预览
      if (this.type === 'APP') {
        return;
      }
      const {id} = this.info;
      const data = await getDesignList({id});
      const {screenDesignJson, list = []} = data;
      const newList = list.map((item) => {
        const {id, designJson = '{}'} = item;
        const obj = JSON.parse(designJson);
        return {
          ...obj,
          id
        }
      })
      window.localStorage.setItem('list', JSON.stringify(newList));
      window.localStorage.setItem('bg', screenDesignJson);
      setTimeout(() => {
        const {href} = this.$router.resolve({
          name: 'preview'
        });
        window.open(href, '_blank');
      }, 0)
    },
    handleCommand(type) {
      const obj = this.list.find((item) => item.id === type);
      let name = '该';
      if (obj) {
        name = obj.name;
      }
      this.$confirm(`将切换到${name}分组, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        Bus.$emit('switchProject', {info: this.info, type});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    doEdit() {
      Bus.$emit('editProject', this.info)
    },
    enterConfig() {
      sessionStorage.setItem('bgInfo', JSON.stringify(this.info));
      this.$router.push({
        path: '/config',
        query: {id: this.makeId(this.info.id), dataId: this.makeId(this.info.datasourceId)}
      });
    },
    doDel() {
      Bus.$emit('delProject', this.info)
    },
    copy() {
      Bus.$emit('copyProject', this.info)
    }
    // async changePublish(v) {
    //   const {id} = this.info;
    //   try {
    //     await doPublish({publish: v, id})
    //     this.$message.success('操作成功!');
    //   } catch (e) {
    //     console.warn(e);
    //   }
    // }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.block1 {
  position: relative;
  z-index: 100;
  height: 160px;
  //float: left;
  margin-right: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(47, 67, 127, 1);
  background-color: rgba(25, 39, 87, 1);
  //width: calc(33% - 20px);
  justify-content: flex-end;

  &:hover {
    background: rgba(70, 137, 245, 0.18);
  }

  &:hover .layer6 {
    border-top: 1px solid rgba(70, 137, 245, 0.18);
    background: rgba(70, 137, 245, 0.18);
  }
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
  cursor: pointer;
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
  font-size: 19px;
  color: #FFFFFF;
  cursor: pointer;

  &:hover {
    color: $component-borderFocus-color;
  }
}

.icon3 {
  z-index: 118;
  width: 16px;
  height: 16px;
  font-size: 19px;
  color: #FFFFFF;
  cursor: pointer;

  &:hover {
    color: $component-borderFocus-color;
  }
}

.icon4 {
  z-index: 126;
  width: 16px;
  height: 16px;
  font-size: 19px;
  color: #FFFFFF;
  cursor: pointer;

  &:hover {
    color: $component-borderFocus-color;
  }
}

.label6 {
  z-index: 144;
  width: 16px;
  height: 16px;
  font-size: 19px;
  color: #FFFFFF;
  cursor: pointer;

  &:hover {
    color: $component-borderFocus-color;
  }
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
  width: 225px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 18px;
  text-align: left;
  margin-top: 1px;
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

.publish {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4689F5;
  background: #264587;
  border-radius: 11px;
}

.switchWrap {
  position: absolute;
  right: 8px;
  top: 8px;

  .icon-shezhi {
    font-size: 19px;
    color: #FFFFFF;
    cursor: pointer;
  }
  .icon-shezhi:hover {
    color: #4689F5;
  }
}
</style>
