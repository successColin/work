<!--
 * @Descripttion: 文件服务器相关选项
 * @Author: ytx
 * @Date: 2022-08-03 15:46:48
 * @Last Modified by: ytx
 * @Last Modified time: 2022-08-03 15:46:48
-->
<template>
  <section class="homeConfig" v-loading="loading">
    <div class="head">
      <apiot-button
        class="operation"
        @click="operationServer('add')"
      >
        <i class="iconfont icon-xinzeng"></i>
        {{ $t('common.add', { name: '' }) }}
      </apiot-button>
    </div>
    <div class="list">
      <ul
        v-for="(item, i) in fileStorages"
        :key="`${item.name}_${i}`">
        <el-row>
          <el-col :span="24" class="top">
            <div class="server">
              <span class="serverLogo">
                <img
                  v-if="item.class !== 'Local'"
                  :src="require(`@/assets/img/file_server/${item.class}.png`)"/>
                  <span v-else class="iconfont icon-PCduan"></span>
              </span>
              {{serverName(item)}}
            </div>
            <div class="rightFloat">
              <apiot-button
                class="operation"
                @click="deleteServer(item, i)"
              >
                <span class="iconfont icon-shanchu"></span>
                {{ $t('common.delete', { name: '' }) }}
              </apiot-button>
              <apiot-button
                class="operation"
                @click="operationServer('edit', item)"
              >
                <span class="iconfont icon-bianji"></span>
                {{ $t('common.edit', { name: '' }) }}
              </apiot-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="item.class === 'Local'">
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  基础目录
                </div>
              </div>
              <div class="common">
                {{item.basePath}}
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  访问域名
                </div>
              </div>
              <div class="common">
                {{item.domain}}
              </div>
            </li>
          </el-col>
          <el-col :span="24">
            <li>
              <div class="leftName">
                <div>
                  系统默认存储
                </div>
              </div>
              <div class="common">
                {{item.defaultStorage ? '是' : '否'}}
              </div>
            </li>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="24">
            <li>
              <div class="leftName">
                <div>
                  平台编码
                </div>
              </div>
              <div class="common">
                {{item.platform}}
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  地址
                </div>
              </div>
              <div class="common">
                <div class="path" :title="item.endPoint">{{item.endPoint}}</div>
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  账号
                </div>
              </div>
              <div class="common">
                {{item.accessKey}}
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  密钥
                </div>
              </div>
              <div class="common">
                <!-- {{item.secretKey}} -->
                <input-password
                  class="secretKey"
                  v-model="item.secretKey"
                  prependWidth="70px"
                  :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
                  :isShow="true"
                  :disabled="true"
                >
                </input-password>
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  存储桶
                </div>
              </div>
              <div class="common">
                {{item.bucketName}}
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  基础目录
                </div>
              </div>
              <div class="common">
                {{item.basePath}}
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  访问域名
                </div>
              </div>
              <div class="common">
                <div class="path" :title="item.domain">{{item.domain}}</div>
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  系统默认存储
                </div>
              </div>
              <div class="common">
                <ApiotSwitch
                  v-model="item.defaultStorage"
                  @change="(value) => changeRadio(value, 'defaultStorage', item, i)"
                  :activeValue="true"
                  :inactivevalue="false"
                ></ApiotSwitch>
              </div>
            </li>
          </el-col>
          <el-col :span="12">
            <li>
              <div class="leftName">
                <div>
                  是否启用服务
                </div>
              </div>
              <div class="common">
                <ApiotSwitch
                  v-model="item.enableStorage"
                  @change="(value) => changeRadio(value, 'enableStorage', item, i)"
                  :activeValue="true"
                  :inactivevalue="false"
                ></ApiotSwitch>
              </div>
            </li>
          </el-col>
        </el-row>
      </ul>
    </div>
    <AddFileServer :visible.sync="visible"
      :fileStorages="fileStorages"
      :curData.sync="curData" :type="type" :configArr="configArr"></AddFileServer>
  </section>
</template>

<script>
import { commonUpdate, deleteFileStorageVerify, updateFileStorageServers } from '@/api/globalConfig';
import AddFileServer from './AddFileServer/index';

export default {
  data() {
    return {
      loading: false,
      params: {},
      statement: {
        isUreportUrl: false,
        isMinioUrl: false
      },
      curData: {},
      type: 'add',
      visible: false,
      platformOptions: [
        {
          name: 'MinIO',
          value: 'MinIO'
        },
        {
          name: '阿里云',
          value: 'AliyunOss'
        },
        {
          name: 'AWS S3',
          value: 'AwsS3'
        },
        {
          name: '百度云',
          value: 'BaiduBos'
        },
        {
          name: '华为云',
          value: 'HuaweiObs'
        },
        {
          name: '本地',
          value: 'Local'
        },
        {
          name: '七牛云',
          value: 'QiniuKodo'
        },
        {
          name: '腾讯云',
          value: 'TencentCos'
        },
        {
          name: '又拍云',
          value: 'UpyunUSS'
        }
      ],
    };
  },
  components: {
    AddFileServer
  },
  mounted() {
    // console.log(this.config);
    // console.log(this.configArr);
    // console.log(this.fileStorages);
  },
  computed: {
    config() {
      return this.$store.state.globalConfig.fileConfig;
    },
    configArr() {
      return this.$store.state.globalConfig.fileConfigArr;
    },
    fileStorages() {
      return JSON.parse(this.$store.state.globalConfig.fileConfig.fileStorages);
    },
  },
  methods: {
    async update(params) {
      // 通用修改
      try {
        this.loading = true;
        await commonUpdate({ list: [params] });
        await this.$store.dispatch('fetchConfigFun', 'FILE_SERVER');
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    operationServer(type, obj = {}) {
      this.type = type;
      this.curData = obj;
      this.visible = true;
    },
    async deleteServer(item, index) {
      try {
        this.loading = true;
        await deleteFileStorageVerify({ platform: item.platform });
        const fileStorages = [...this.fileStorages];
        fileStorages.splice(index, 1);
        // const param = {
        //   parameterKey: 'FILE_SERVER',
        //   attributeKey: 'fileStorages',
        //   attributeValue: JSON.stringify(fileStorages)
        // };
        const params = {
          ...this.configArr[0],
          attributeValue: JSON.stringify(fileStorages)
        };
        await commonUpdate({ list: [params] });
        await this.$store.dispatch('fetchConfigFun', 'FILE_SERVER');
        await updateFileStorageServers({ infos: JSON.stringify(fileStorages) });
        this.$message({
          type: 'success',
          message: this.$t('common.successfullyModified')
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    serverName(obj) {
      return this.platformOptions.filter((item) => item.value === obj.class)[0].name;
    },
    async changeRadio(value, key, obj, i) {
      const fileStorages = this.fileStorages.filter(() => 1 !== 2);
      if (key === 'defaultStorage' && !value) {
        this.$message({
          type: 'warning',
          message: '有且只能有一个默认服务器'
        });
        console.log(obj, 'obj');
        const item = {
          ...obj,
          defaultStorage: true
        };
        this.fileStorages.splice(i, 1, item);
        await this.$store.dispatch('fetchConfigFun', 'FILE_SERVER');
        return;
      }
      this.$confirm('是否确定修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          if (key === 'defaultStorage' && value) {
            const oldIndex = fileStorages.findIndex((item) => item.defaultStorage
              && item.platform !== obj.platform);
            if (oldIndex !== -1) {
              const oldData = {
                ...fileStorages[oldIndex],
                defaultStorage: false
              };
              fileStorages.splice(oldIndex, 1, oldData);
            }
          }
          const data = {
            ...obj,
            [key]: value
          };
          fileStorages.splice(i, 1, data);
          const params = {
            ...this.configArr[0],
            attributeValue: JSON.stringify(fileStorages)
          };
          await commonUpdate({ list: [params] });
          await this.$store.dispatch('fetchConfigFun', 'FILE_SERVER');
          await updateFileStorageServers({ infos: JSON.stringify(fileStorages) });
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang='scss' scoped>
$borderColor: 1px solid #e9e9e9;
.homeConfig {
  width: 100%;
  height: 100%;
  ::v-deep{
    .iconfont{
      margin-right: 4px;
      color: $--color-primary;
      // color: #4689f5;
    }
    .el-input__inner{
      color: #333333 !important;
    }
  }
  .list {
    margin: 10px 10px 0 10px;
    background: #ffffff;
    border-bottom: 0;
    height: calc(100% - 50px);
    overflow-y: auto;
    ::v-deep{
      .secretKey{
        width: 100%;
      }
      .el-input__inner{
        background: transparent;
        border: none;
        padding-left: 0;
      }
      ul{
        margin-bottom: 10px;
        border: $borderColor;
        border-bottom: none;
      }
      .el-col-12:nth-child(even){
        border-right: $borderColor;
      }
      .top{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        border-bottom: 1px solid #E9E9E9;
      }
      .server{
        display: flex;
        align-items: center;
        .serverLogo{
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #E9E9E9;
          display: flex;
          align-items: center;
          margin-right: 15px;
          overflow: hidden;
          img{
            width: 100%;
            height: auto;
          }
        }
      }
    }
    li {
      display: flex;
      height: 36px;
      border-bottom: $borderColor;

      & > div:first-child {
        width: 200px;
        min-width: 200px;
        background: #fafafa;
        display: flex;
        justify-content: center;
        text-align: right;
        font-size: 13px;
        color: #666666;
        flex-direction: column;
        border-right: $borderColor;
        box-sizing: border-box;
        padding-right: 20px;

        & > div:first-child > div:first-child {
          margin-bottom: 6px;
        }
      }

      & > .common {
        width: calc(100% - 200px);
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        color: #333333;
        box-sizing: border-box;
        .path{
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .themeStyle {
          display: flex;
        }
        & .colorWrap {
          display: flex;
          & > div {
            display: flex;
            margin-right: 40px;
            & > .name {
              margin-left: 8px;
              line-height: 36px;
            }
          }
          & .colorBox {
            flex-grow: 1;
            width: 20px;
            height: 20px;
            margin: 8px 2.7px;
            cursor: pointer;
            border-radius: 4px;
            text-align: center;
            line-height: 20px;

            & .el-icon-check {
              color: #fff;
              opacity: 1;
              transition: opacity 1s;
            }
          }
        }
      }
    }
  }
  .head{
    padding-top: 10px;
  };
  .operation{
    // display: flex;
    // align-items: center;
    // border-radius: 4px;
    // box-sizing: border-box;
    // border: 1px solid #E9E9E9;
    // padding: 0 10px;
    margin-left: 10px;
  }
  .rightFloat{
    float: right;
    display: flex
  }
}

::v-deep {
  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    border-color: #4689f5;
    background-color: #4689f5;
    opacity: 0.5;
  }

  // .el-col-12:nth-child(odd) {
  //   box-sizing: border-box;
  //   border-right: 1px solid #e9e9e9;
  // }

  .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
    background-color: white;
  }

  .el-upload--picture-card {
    width: 48px;
    height: 48px;
    line-height: 48px;

    .el-upload--picture-card i {
      font-size: 16px !important;
    }
  }

  .el-upload-list--picture-card .el-upload-list__item {
    width: 48px;
    height: 48px;
  }
  .el-checkbox {
    line-height: 20px;
  }
}
</style>
