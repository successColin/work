/**
* @name: index
* @author: DELL
* @date: 2021/8/6 17:01
* @description：index
* @update: 2021/8/6 17:01
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="headerTitle">大屏设置</div>
    <div class="propsSetting">
      <p class="setTitle">标题</p>
      <c-input
          type="text"
          :value="getBgConfig.title" @Input-Change="(value) => changeTitle(value, 'title')"/>
    </div>
    <div class="propsSetting" v-if="type === 'APP'">
      <p class="setTitle">常用尺寸</p>
      <c-select
          :options="appSizeOptions"
          :value="computedSize"
          @change="(value) => changeSize(value)"
      ></c-select>
    </div>
    <div class="propsSetting">
      <p class="setTitle">尺寸</p>
      <div class="InputWrap">
        <c-input
            lable="宽:"
            type="number"
            :numberValue="getBgConfig.width"
            @Input-Change="(value) => changeTitle(Number(value), 'width')"/>
        <c-input
            lable="高:"
            type="number"
            :numberValue="getBgConfig.height"
            @Input-Change="(value) => changeTitle(Number(value), 'height')"/>
      </div>
    </div>
    <div class="propsSetting">
      <div class="wrap flex">
        <span>启用栅格</span>
        <el-switch
            v-model="getBgConfig.enable"
            active-color="#4689F5"
            inactive-color="#183472">
        </el-switch>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">栅格大小</p>
      <c-input
          type="number"
          :numberValue="getBgConfig.gridSize"
          @Input-Change="(value) => changeTitle(Number(value), 'gridSize')"/>
    </div>
    <div class="propsSetting">
      <p class="setTitle">页面展示方式</p>
      <c-select
          :options="Options"
          :value="getBgConfig.showType"
          @change="(value) => changeTitle(value, 'showType')"
      ></c-select>
    </div>
    <div class="propsSetting">
      <p class="setTitle">背景色</p>
      <c-color-picker
          size="small"
          v-model="getBgConfig.bgColor"
          show-alpha
          @change="changeColor"
          :predefine="predefineColors">
      </c-color-picker>
    </div>
    <div class="propsSetting">
      <p class="setTitle">主题背景设置</p>
      <div class="wrap">
        <c-upload
            :isPublic="true"
            :url="getBgConfig.bgImage"
            :before-upload="(file)=>beforeAvatarUpload(file, accept)"
            @changeScreenBg="(url) => changeScreenBgUrl(url, 'bgImage')"
            :accept="accept"
        >
          <template v-slot:tip>
            <div class="el-upload__tip">只能上传png,jpg,jpeg图片，且不超过200M</div>
          </template>
        </c-upload>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">缩略图</p>
      <div class="wrap">
        <c-upload
            :isPublic="true"
            :url="getBgConfig.thumbnail"
            :before-upload="(file)=>beforeAvatarUpload(file, accept1)"
            @changeScreenBg="(url) => changeScreenBgUrl(url, 'thumbnail')"
            :accept="accept1"
        >
          <template v-slot:tip>
            <div class="el-upload__tip">支持上传jpg、png格式，且不超过200M</div>
          </template>
        </c-upload>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: String,
      default: 'PC'
    }
  },
  data() {
    return {
      accept1: '.png,.jpg',
      accept: '.png,.jpg,.jpeg,.mp4,.avi',
      color: '#4689F5',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      Options: [
        {
          label: '全屏铺满',
          value: 1
        }, {
          label: '等比例缩放宽度铺满',
          value: 2
        }, {
          label: '等比例缩放高度铺满',
          value: 3
        }, {
          label: '按设计图比例显示',
          value: 4
        }
      ],
      appSizeOptions: [
        {
          label: '自定义',
          value: ''
        },
        {
          label: '360*640',
          value: '360*640'
        },
        {
          label: '360*720',
          value: '360*720'
        },
        {
          label: '360*760',
          value: '360*760'
        },
        {
          label: '375*667',
          value: '375*667'
        },
        {
          label: '375*812',
          value: '375*812'
        },
        {
          label: '414*736',
          value: '414*736'
        },{
          label: '414*896',
          value: '414*896'
        }
      ]
    };
  },

  components: {},
  computed: {
    computedSize() {
      const { width, height } = this.getBgConfig;
      const v = `${width}*${height}`;
      const current = this.appSizeOptions.find((item) => item.value === v);
      if (current) return v;
      return '';
    },
    getBgConfig() {
      return this.$store.getters.bgConfig;
    }
  },

  mounted() {
  },

  methods: {
    beforeAvatarUpload(file, accept) {
      const typeArr = file.type.split('/');
      const type = typeArr[typeArr.length - 1];
      const isJPG = accept.indexOf(type) > -1;
      const isLt2M = file.size / 1024 / 1024 < 200;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('请上传指定格式的文件');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('文件大小不能超过 200MB!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    changeColor(color) { // 背景色修改
      const getBgConfig = this.getBgConfig;
      this.$store.dispatch('config/setBgConfig', {
        ...getBgConfig,
        bgColor: color
      });
    },
    changeScreenBgUrl(url, key) { // 修改背景图片
      const getBgConfig = this.getBgConfig;
      this.$store.dispatch('config/setBgConfig', {
        ...getBgConfig,
        [key]: url
      });
    },
    changeTitle(value, key) { // 设置大屏标题
      const getBgConfig = this.getBgConfig;
      this.$store.dispatch('config/setBgConfig', {
        ...getBgConfig,
        [key]: value
      });
    },
    changeSize(v) { // 选择尺寸
      if (!v) return;
      const arr = v.split('*');
      const getBgConfig = this.getBgConfig;
      this.$store.dispatch('config/setBgConfig', {
        ...getBgConfig,
        width: +arr[0],
        height: +arr[1]
      });
      // console.log(v);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.bgContentWrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;

  .headerTitle {
    height: 46px;
    margin-bottom: 10px;
    padding-left: 20px;
    line-height: 46px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    box-shadow: 0px 1px 0px 0px #2F437F;
  }

  .propsSetting {
    padding: 0 20px 0px 20px;
    margin-bottom: 10px;

    .setTitle {
      color: #ffffff;
      line-height: 30px;
      text-align: left;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      opacity: .7;
    }

    .wrap {
      margin-top: 2px;
      &>span{
        opacity: .7;
      }
      ::v-deep {
        .el-color-picker__trigger {
          border: 1px solid $component-border-color;
        }
      }
    }

    .InputWrap {
      display: flex;
      margin-top: 10px;
      align-items: center;
      justify-content: space-between;

      ::v-deep {
        .CInputWrap {
          width: 100%;
          display: flex;
          flex: 0 0 calc(50% - 8px);
          align-items: center;

          .inputBox {
            width: 100px;

            .el-input-number {
              width: 100px;

              .el-input__inner {
                padding-left: 15px;
                padding-right: 20px;
              }

              .el-input-number__decrease, .el-input-number__increase {
                width: 20px;
              }
            }
          }
        }
      }
    }

    .wrap {
      display: flex;
      justify-content: space-between;
      text-align: left;
      align-items: center;
      line-height: 35px;

      & > span {
        margin-right: 10px;
        color: #ffffff;
        font-size: 14px;
      }
    }

    ::v-deep {

      .el-input-number {
        width: 100%;

        .el-input-number__decrease, .el-input-number__increase {
          width: 20px;
        }
      }
    }
  }
}
</style>
