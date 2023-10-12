/**
* @name: index
* @author: DELL
* @date: 2021/8/20 9:13
* @description：index
* @update: 2021/8/20 9:13
*/
<!-- 页面 -->
<template>
  <apiot-dialog
      :visible.sync="dialogVisible"
      append-to-body
      title="素材库"
      :isBigDialog="true"
      @sure-click="sureClick"
      class="materialLibraryDialog"
  >
    <div class="materialLibrary">
      <div class="iconType">
        <div class="checkoutWrap">
          <el-button-group>
            <apiot-button :type="active === 1 ? 'primary' : ''" @click="active=1">
              {{ $t('icon.pc') }}
            </apiot-button>
            <apiot-button :type="active === 2 ? 'primary' : ''" @click="active=2">
              {{ $t('icon.mobile') }}
            </apiot-button>
          </el-button-group>
        </div>
        <div class="groupWrap">
          <div class="groupWrap__item">
            <div class="groupWrap__title">{{ $t('icon.Customicon') }}</div>
            <div
                class="groupWrap__group"
                v-for="item in iconConfigJson.slice(0, 3)"
                :key="item.id"
                :class="{ active: selectKey === item.id }"
                @click="choose(item)"
            >
              <i
                  class="iconfont"
                  :class="
              selectKey === item.id ? 'icon-fenzuzhankai' : 'icon-fenzuchangtai'
            "
              ></i>
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="contentWrap iconMain" v-loading="loading">
        <div class="searchWrap">
          <div class="searchWrap_selectAll">
<!--            <apiot-checkbox @change="selectAll" :value="isCheckAll()">-->
<!--              {{ $t('role.selectAll') }}({{ selectedArr.length }})-->
<!--            </apiot-checkbox>-->
          </div>
          <div class="searchWrap__box">
            <search-input
                v-model="input"
            ></search-input>
          </div>
          <div class="searchWrap_btn">
            <el-upload
                :show-file-list="false"
                :limit="15"
                :before-upload="beforeUpload"
                action="/"
                multiple
                ref="upload"
                :http-request="doUpload"
            >
              <apiot-button type="primary" style="margin-right: 0px">
                <i class="icon-shangchuan iconfont"></i>
                {{ $t('icon.UploadIcon') }}
              </apiot-button>
            </el-upload>
          </div>
        </div>
        <div class="iconWrap">
          <div
              v-for="item in iconArr()"
              :key="item.id"
              class="iconWrap__box"
              :class="{checked: ( selectedIcon.id === item.id),}"
              @click="changeIcon(item)"
          >
            <img
                class="imgWrap"
                :src="$parseImgUrl(item.iconUrl)"
                alt=""
            />
            <p class="iconWrap__name">{{ item.iconName }}</p>
<!--            <apiot-checkbox-->
<!--                :value="selectedArr.includes(item.id)"-->
<!--                class="checkStyle"-->
<!--                @change="changeIcon(item.id)"-->
<!--            >-->
<!--            </apiot-checkbox>-->
            <span class="icon-shanchu iconfont checkStyle" @click="del(item.id)"></span>
          </div>
          <!-- <apiot-nodata v-if="!iconArr().length"> </apiot-nodata> -->
          <div
              v-if="!iconArr().length"
              class="apiotNoData"
              :placeholder="$t('common.noData')"
          ></div>
        </div>
      </div>
    </div>
  </apiot-dialog>
</template>

<script>
//
import { iconSet } from '@/globalComponents/ApiotDialog/IconDialog/icon.json';
import { batchDeleteIcon, getIconList, batchUpload } from '@/api/iconManage';
import { definedIconGroupID } from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {},
  data() {
    return {
      dialogVisible: false,
      active: 1,
      iconConfigJson: iconSet,
      selectKey: 1,
      selected: {},
      hoverKey: '',
      loading: false,
      selectedArr: [],
      selectedIcon: {},
      groupArr: [],
      input: ''
    };
  },
  watch: {
    active() {
      this.fetchIcon(this.selectKey);
    }
  },

  components: {},

  computed: {
    accept() {
      if (this.selectKey === 2) {
        return '.png,.svg,.eps,.jpg,jpeg';
      }
      return '.png,.svg,.eps';
    },
    text() {
      if (this.selectKey === 2) {
        return '1MB';
      }
      return '25KB';
    },
    isCheckAll() {
      // 是否是全选
      return function () {
        const arr = this.groupArr.filter((item) => item.iconType === this.active) || [];
        if (!arr.length || !this.selectedArr.length) return false;
        return arr.length === this.selectedArr.length;
      };
    },
    iconArr() {
      // 模糊查询
      return function () {
        const groupArr = this.groupArr || [];
        const arr =
            groupArr.filter((item) => item.iconName.toLowerCase().indexOf(this.input) !== -1) || [];
        return arr;
      };
    },
  },

  mounted() {
    this.fetchIcon(1);
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    async choose(obj) {
      // 选择分组
      this.selectKey = obj.id;
      this.selected = obj;
      await this.fetchIcon(obj.id);
    },
    selectAll(value) {
      // 全选操作
      if (value) {
        const arr = this.groupArr.filter((item) => item.iconType === this.active) || [];
        this.selectedArr = arr.map((item) => item.id) || [];
      } else {
        this.selectedArr = [];
      }
    },
    async doUpload(a,) {
      const formData = new FormData();
      formData.append('files', a.file);
      formData.append('iconClassify', this.selectKey);
      formData.append('iconType', this.active);
      try {
        await batchUpload(formData);
        await this.fetchIcon(this.selectKey);
        this.selectedArr = [];
        this.selectedIcon = {};
      } catch (e) {
        this.$refs.upload.clearFiles();
      }
    },
    changeOnly({ iconUrl }) {
      console.log(2);
      this.$emit('change', iconUrl);
      this.dialogVisible = false;
    },
    sureClick() {
      const { iconUrl } = this.selectedIcon;
      if (!iconUrl) {
        this.$message.error('请选择图片');
        return;
      }
      this.$emit('change', iconUrl);
      this.dialogVisible = false;
      this.selectedArr = [];
      this.selectedIcon = {};
    },
    changeIcon(item) {
      this.selectedIcon = item;
      // // 单选
      // const index = this.selectedArr.findIndex((item) => item === id);
      // if (index === -1) {
      //   this.selectedArr.push(id);
      // } else {
      //   this.selectedArr.splice(index, 1);
      // }
    },
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr.at(-1);
        const diff = this.selectKey === 2 ? 1024 : 25;
        const newSize = size / 1024 < diff;
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        if (!newSize) {
          this.$message({
            type: 'warning',
            message: this.$t('icon.beforeUploading', { num: this.text })
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    async del(ids) {
      // if (!this.selectedArr.length) {
      //   this.$message({ type: 'warning', message: this.$t('icon.pleaseUploadFileToDelete') });
      //   return;
      // }
      // const ids = this.selectedArr.join(',');
      try {
        await this.$confirm(this.$t('icon.sureDel'), this.$t('common.tip'), { type: 'warning' });
        await batchDeleteIcon({ ids });
        this.selectedArr = [];
        this.selectedIcon = {};
        await this.fetchIcon(this.selectKey);
        this.$message({
          type: 'success',
          message: this.$t('icon.deleteSuccess')
        });
      } catch (e) {
        // console.log(e);
      }
    },
    async fetchIcon(id) {
      if (definedIconGroupID.includes(id)) {
        this.selectedArr = [];
        const params = {
          iconClassify: id,
          iconType: this.active
        };
        this.loading = true;
        try {
          this.groupArr = await getIconList(params);
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }
    },

  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.materialLibraryDialog {
  ::v-deep{
    .el-dialog__body{
      padding: 0;
    }
  }
  .materialLibrary {
    width: 100%;
    height: 100%;
    display: flex;

    .iconType {
      width: 240px;
      border-right: 1px solid #e9e9e9;
    }
    .checkoutWrap {
      margin: 6px 8px;

      ::v-deep {
        .el-button-group {
          width: 100%;
          display: flex;

          .el-button {
            flex: 1;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
          .el-button--primary {
            color: #ffffff !important;
          }
        }
      }
    }
    .groupWrap {
      width: 100%;
      height: calc(100% - 42px);
      overflow-y: auto;

      .groupWrap__title {
        height: 34px;
        padding-left: 41px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        line-height: 34px;
      }

      .groupWrap__group {
        position: relative;
        height: 36px;
        display: flex;
        line-height: 36px;
        border-radius: 2px;
        border-left: 3px solid #fff;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;

        &:hover {
          background: #edf3fe;
          cursor: pointer;
        }

        .icon-fenzuchangtai,
        .icon-fenzuzhankai {
          margin-left: 38px;
          margin-right: 5px;
          color: #fab71c;
          font-size: 20px;
        }
      }
    }

    .active {
      background: #edf3fe;
      cursor: pointer;
      border-color: #4689f5 !important;
    }
    .iconMain{
      flex: 1;
    }
    .contentWrap {
      width: 100%;
      height: 100%;
      overflow: hidden;

      .on {
        color: $--color-primary;
      }

      .searchWrap {
        padding: 5.5px 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #e9e9e9;
        overflow: hidden;

        .searchWrap_selectAll {
          float: left;
          line-height: 29px;
          ::v-deep {
            .el-checkbox__label {
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

        .searchWrap_btn {
          float: right;
          display: flex;
          height: 30px;
          margin-right: 10px;

          .icon-shanchu {
            color: $--color-primary;
            margin-right: 4px;
            vertical-align: bottom;
          }

          .icon-shangchuan {
            margin-right: 4px;
            vertical-align: bottom;
          }

          ::v-deep {
            .el-icon-plus {
              border: 1px solid;
            }
          }
        }

        .searchWrap__box {
          width: 200px;
          float: right;
          height: 30px;
          line-height: 30px;
          //text-align: right;

          //::v-deep {
          //  .el-input__inner {
          //    width: 98%;
          //    height: 30px;
          //    padding-left: 12px;
          //    font-size: 13px;
          //    cursor: pointer;
          //  }
          //
          //  .el-input__prefix {
          //    left: auto;
          //    right: 15px;
          //    cursor: pointer;
          //  }
          //}
        }
      }

      .iconWrap {
        width: 100%;
        height: calc(100% - 42px);
        padding: 10px;
        box-sizing: border-box;
        overflow-y: auto;
      }
      .uploadWrap {
        width: 100%;
        height: 100%;
        position: relative;

      }

      .iconWrap__box {
        float: left;
        width: 96px;
        height: 106px;
        position: relative;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 10px;
        text-align: center;
        cursor: pointer;

        &.checked {
          box-shadow: 0px 0px 0px 1px #e9e9e9;
          background: #fafafa;
          transition: all 0.2s ease-in;
        }
        &:hover >.checkStyle {
          display: block;
          color: gray;
          &:hover{
            color: #4689f5;
          }
        }

        .checkStyle {
          display: none;
          position: absolute;
          top: 6px;
          right: 6px;
        }
      }

      .imgWrap {
        width: 38px;
        height: 38px;
        display: inline-block;
        margin: 22px 29px;
      }

      .iconWrap__name {
        padding: 0 5px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 16px;
        overflow: hidden;
        box-sizing: border-box;
      }
    }

  }
}
</style>
