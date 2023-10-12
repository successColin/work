<template name='sunui-upimg'>
  <view
    class="upimg"
    v-show="static_visiabled"
    :class="[static_readonly ? 'readonly' : '']"
  >
    <label v-if="!uploadType" class="text">
      {{ elementLable }}
      <span
        v-if="static_requisite"
        class="icon iconfont iconmust-fill2 requisite"
      ></span>
    </label>
    <!-- 个人资质样式 -->
    <view
      class="qualification-upload-content"
      v-if="uploadType == 'qualiflcation'"
    >
      <view
        class="upload-item"
        @click="chooseImage(upImgConfig.count)"
        v-show="
          upload_picture_list.length < upImgConfig.count || upImgConfig.notli
        "
      >
        <m-font-icon
          icon="iconpaizhaozhaoxiangji"
          color="#D9D9D9"
          :iconSize="90"
        ></m-font-icon>
        <view>{{ $t('page-personal') }}</view>
        <!-- 中文：上传个人资质 -->
      </view>
    </view>
    <!-- 头像上传 -->
    <view
      v-if="uploadType == 'touxiang'"
      class="userinfo-upload"
      @click="chooseImage(1)"
    >
      <image :src="defaultpicpath" mode="aspectFill" ref="uImage"></image>
    </view>
    <scroll-view
      v-if="uploadType != 'touxiang'"
      scroll-x
      :class="uploadType == 'qualiflcation' ? 'noscroll' : ''"
    >
      <view
        class="sunsin_picture_list"
        :class="
          uploadType == 'qualiflcation'
            ? 'sunsin_picture_list_qualification'
            : ''
        "
      >
        <!-- 默认样式 -->
        <view v-if="uploadType != 'qualiflcation' && !static_readonly">
          <view
            class="sunsin_picture_item sunsin_width"
            v-show="
              upload_picture_list.length < upImgConfig.count ||
              upImgConfig.notli
            "
            v-if="
              upImgConfig.iconReplace == '' ||
              upImgConfig.iconReplace == undefined
            "
          >
            <view
              class="sunsin_add_image sunsin_width"
              style="background-image: url(../../static/images/upload.png)"
              @click="chooseImage(upImgConfig.count)"
              v-show="upImgConfig.isAddImage || true"
            ></view>
          </view>

          <view
            class="sunsin_picture_item sunsin_width"
            v-show="
              upload_picture_list.length < upImgConfig.count ||
              upImgConfig.notli
            "
            v-else
          >
            <view
              class="sunsin_add_image sunsin_width"
              style="background-image: url(../../static/images/upload.png)"
              @click="chooseImage(upImgConfig.count)"
              v-show="upImgConfig.isAddImage || true"
              v-if="!static_readonly"
            >
              <!-- <image src="../../static/images/upload.png" class="icon_replace"></image> -->
            </view>
          </view>
        </view>
        <view
          v-for="(item, index) in upload_picture_list"
          :key="index"
          class="sunsin_picture_item"
        >
          <image
            v-show="item.upload_percent < 100"
            class="sunsin_width"
            :src="item.path"
            mode="aspectFill"
          ></image>
          <image
            v-show="item.upload_percent == 100"
            class="sunsin_width"
            :data-src="item.url"
            :src="item.url"
            mode="aspectFill"
            :data-idx="index"
            @click="previewImgs"
          ></image>
          <view
            class="sunsin_upload_progress sunsin_width"
            v-show="item.upload_percent < 100"
            :data-index="index"
            @click="previewImg"
            >{{ item.upload_percent }}%</view
          >
          <text
            class="del iconfont icon-shanchu"
            :class="
              upImgConfig.delBtnLocation == 'left'
                ? 'left'
                : upImgConfig.delBtnLocation == 'right'
                ? 'right'
                : upImgConfig.delBtnLocation == 'bleft'
                ? 'bleft'
                : upImgConfig.delBtnLocation == 'bright'
                ? 'bright'
                : 'right'
            "
            @click="deleteImg"
            :data-url="item.url"
            :data-index="index"
            :style="
              'color:' +
              upImgConfig.delIconText +
              ';background-color:' +
              upImgConfig.delIconColor
            "
            :hidden="upImgConfig.isDelIcon || false"
            v-if="!static_readonly"
            >×</text
          >
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { fileApi } from '@/common/request/api.js';
import state from '@/store/state.js';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'sunui-upimg',
  props: {
    upImgBasic: {
      type: Object,
      default() {
        return {};
      },
    },
    getPicParams: {
      //请求图片时额外参数
      type: Object,
      default() {
        return {};
      },
    },
    label: {
      //文本框title
      type: String,
      default: 'elementLable',
    },
    elementId: Number,
    mobileTabId: Number,
    relationId: [String, Number],
    relationTableName: [String, Number],
    stateId: [String, Number],
    typeId: [String, Number],
    priorityId: [String, Number],
    visiabled: {
      type: [Number, Boolean],
      default: 1,
    }, //是否显示
    requisite: {
      type: [Number, Boolean],
      default: 0,
    }, //是否必填
    disabled: {
      type: [Number, Boolean],
      default: 0,
    }, //是否便捷
    uploadType: String,
    picpath: String, //头像路径
  },
  data() {
    return {
      elementValue: '',
      elementLable: this.label,
      upload_after_list: [],
      upload_picture_list: [],
      upload_ready_list: [], //准备上传的图片
      static_visiabled: this.visiabled,
      static_requisite: this.requisite,
      static_readonly: this.disabled,
      defaultpicpath: '',
    };
  },
  computed: {
    ...mapState(['baseUrl', 'defaultUrl', 'token']),
    upImgConfig() {
      const basicImgConfig = {
        // 后端图片接口地址
        basicConfig: {
          url: 'https://p.dns06.net.cn/index.php?m=Api&c=index&a=upload',
        },
        // 是否开启提示(提醒上传图片的数量)
        tips: true,
        // 是否开启notli(开启的话就是选择完直接上传，关闭的话当count满足数量时才上传)
        notli: false,
        // 图片数量
        count: 9,
        // 相机来源(相机->camera,相册->album,两者都有->all,默认all)
        sourceType: 'all',
        // 是否压缩上传照片(仅小程序生效)
        sizeType: true,
        // 上传图片背景修改
        upBgColor: '#fff',
        // 上传icon图标颜色修改(仅限于iconfont)
        upIconColor: '#D9D9D9',
        // 上传svg图标名称
        upSvgIconName: 'icon-card',
        // 上传文字描述(仅限四个字)
        upTextDesc: this.$t('pageTip-uploadImg'), // 中文：上传图片
        // 删除按钮位置(left,right,bleft,bright),默认右上角
        delBtnLocation: '',
        // 是否隐藏添加图片
        isAddImage: false,
        // 是否隐藏删除图标
        isDelIcon: false,
        // 删除图标定义背景颜色
        delIconColor: '',
        // 删除图标字体颜色
        delIconText: '',
        // 上传图标替换(+),是个http,https图片地址(https://www.playsort.cn/right.png)
        iconReplace: '',
      };
      return Object.assign(basicImgConfig, this.upImgBasic);
    },
  },
  created() {
    //设置默认值
    let value = this.relationId;
    try {
      //有起始值的转化成json
      value = JSON.parse(value);
    } catch (e) {}

    if (value && typeof value === 'object') {
      this.elementValue = value.id || '';
    } else {
      this.elementValue = value || '';
    }
    gImage(this); //获取图片
    if (this.picpath) this.defaultpicpath = this.picpath.replace(/[\r\n]/g, '');

    //设置校验规则
    this.setVerificationRule();
  },
  watch: {
    static_requisite() {
      //是否必填
      this.setVerificationRule();
    },
    upload_picture_list(newVal, oldVal) {
      //图片值
      if (!this.mobileTabId || !this.elementId) return;
      this.SET_TABS_FORMDATAS({
        //设置表单数据
        tabId: this.mobileTabId,
        elementId: this.elementId,
        params: newVal,
      });
    },
  },
  methods: {
    ...mapMutations('verificationRule', ['SET_TAB_RULE']),
    ...mapMutations('common', ['SET_TABS_FORMDATAS']),
    setVerificationRule() {
      //设置验证规则
      if (!this.mobileTabId || !this.elementId) return;
      const rule = {
        name: this.elementId,
        checkType: this.static_requisite ? 'imgnotnull' : '',
        checkRule: '',
        errorMsg: this.elementLable + this.$t('check-notNull'), // 中文：不能为空
      };
      this.SET_TAB_RULE({
        tabId: this.mobileTabId,
        rule: rule,
      });
    },
    initServerImage(e) {
      this.upload_picture_list = e;
    },
    chooseImage(count) {
      cImage(this, parseInt(count), this.upImgConfig);
    },
    uploadimage(e) {
      uImage(this, e);
    },
    deleteImg(e) {
      dImage(e, this);
    },
    previewImg(e) {
      pImage(e, this);
    },
    previewImgs(e) {
      puImage(e, this);
    },
  },
};

// 选择图片(通用)
const cImage = (_this, count, configs) => {
  let config = {
    basicConfig: {
      url: configs.basicConfig.url,
    },
    count,
    notli: configs.notli,
    sourceType: configs.sourceType,
    sizeType: configs.sizeType,
    tips: configs.tips || false,
  };
  uni.chooseImage({
    count: config.notli
      ? config.count
      : _this.upload_after_list.length == 0
      ? config.count
      : config.count - _this.upload_after_list.length,
    sizeType:
      config.sizeType == '' ||
      config.sizeType == undefined ||
      config.sizeType == true
        ? ['compressed']
        : ['original'],
    sourceType:
      config.sourceType == '' || config.sourceType == undefined
        ? ['album', 'camera']
        : config.sourceType == 'camera'
        ? ['camera']
        : config.sourceType == 'album'
        ? ['album']
        : ['album', 'camera'],

    success: async (res) => {
      for (let i = 0, len = res.tempFiles.length; i < len; i++) {
        res.tempFiles[i]['upload_percent'] = 0;
        res.tempFiles[i]['url'] = '';
        res.tempFiles[i]['id'] = '';

        let totalLength =
          _this.upload_picture_list.length + _this.upload_ready_list;

        _this.upload_ready_list.push(res.tempFiles[i]);
        if (_this.uploadType == 'touxiang') {
          _this.defaultpicpath = res.tempFiles[i];
        }
      }
      // 过滤多出的预览图片
      await fImage(_this, res, config);
    },
  });
};

// 过滤超出的预览图片以及上传(通用)
const fImage = (_this, res, config) => {
  !config.notli && config.count == _this.upload_ready_list.length
    ? uImage(_this, config)
    : '';
  config.notli && _this.upload_ready_list.length !== 0
    ? uImage(_this, config)
    : '';
  _this.upload_after_list = _this.upload_after_list
    .concat(res.tempFilePaths)
    .slice(0, config.count);
};

//获取文件
const gImage = async (_this, config) => {
  if (!_this.relationTableName) {
    console.error('没有关联表');
    return;
  }
  if (_this.uploadType == 'feedback') {
    //意见反馈不获取图片
    return;
  }
  if (_this.elementValue) {
    await fileApi
      .getRelationFile({
        relationId: _this.elementValue,
        relationTableName: _this.relationTableName,
        relationpriorityId: _this.priorityId,
        relationStateId: _this.stateId,
        relationTypeId: _this.typeId,
      })
      .then((pics) => {
        _this.upload_picture_list = pics;
        _this.upload_ready_list = [];
        _this.upload_after_list = [];
        if (_this.uploadType == 'touxiang') {
          if (pics.length > 0) {
            _this.defaultpicpath = pics[0].url;
            //_this.$emit('onUpImg', pics);
            _this.$emit('isExist', pics);
          } else {
            _this.defaultpicpath = _this.picpath;
          }
        }
      });
  }
};
// 上传文件
const uImage = async (_this, config) => {
  await upload_file_server(_this, config, _this.upload_ready_list);
  // for (let j = 0, len = _this.upload_picture_list.length; j < len; j++) {
  // 	if (_this.upload_picture_list[j]['upload_percent'] == 0) {
  // 		await upload_file_server(_this, config, _this.upload_picture_list, j)
  // 	}
  // }
};
const upload_file_server = async (_this, configs, upload_ready_list, j) => {
  //将没有上传的图片批量上传
  let basicConfig = {
    url: configs.basicConfig.url || '',
  };

  let imgs = upload_ready_list.map((value, index) => {
    //转化可上传数据
    return {
      name: 'files' + index,
      uri: value.path,
    };
  });
  let baseUrl = _this.baseUrl || _this.defaultUrl;
  const upload_picture_list_length = _this.upload_picture_list.length;
  const upload_task = await uni.uploadFile({
    //开始上传
    url: baseUrl + basicConfig.url,
    header: {
      'content-type': 'multipart/form-data',
      token: _this.token,
    },
    files: imgs,
    // filePath: upload_picture_list[j]['path'],
    // name: 'files',
    formData: EncryptionPSW({
      tableName: _this.relationTableName || 'workorder',
    }),
    async success(res) {
      if (res.statusCode == 200) {
        let result = JSON.parse(res.data);
        if (result.success) {
          const imags = result.data;
          imags.map((item, index) => {
            //保存成功后将地址和id存入upload_picture_list中
            upload_ready_list[index]['url'] = item.url;
            upload_ready_list[index]['id'] = item.id;

            upload_ready_list[index]['typeId'] = _this.typeId;
            upload_ready_list[index]['stateId'] = _this.stateId;
            upload_ready_list[index]['priorityId'] = _this.priorityId;
            _this.upload_picture_list[upload_picture_list_length + index] =
              upload_ready_list[index];

            if (_this.uploadType == 'touxiang') {
              _this.defaultpicpath = item.url;
            }
          });
          await tImage(_this, upload_ready_list, configs.count);
          _this.upload_ready_list = []; //清空可以上传的图片
        }

        uni.hideLoading();
      }
    },
    async fail(err) {
      uni.showLoading({
        title: this.$t('pageTip-pictureUploadFailed'), //中文：`上传失败!`
      });
      _this.upload_picture_list = [];
      _this.upload_after_list = [];
      setTimeout(() => {
        uni.hideLoading();
      }, 2000);
      console.warn(err, '请检查是否CORB/CORS错误!');
    },
  });

  //上传进度
  _this.upload_picture_list =
    _this.upload_picture_list.concat(upload_ready_list); //将上传的图片添加到已上传的图片中展示
  upload_task.onProgressUpdate(async (res) => {
    for (let i = 0, len = upload_ready_list.length; i < len; i++) {
      upload_ready_list[i]['upload_percent'] = await res.progress;
      _this.upload_picture_list[upload_picture_list_length + i] =
        upload_ready_list[i];
    }
  });
};

// 上传图片子组件->父组件(通用)
const tImage = async (_this, upload_ready_list, count) => {
  await _this.$emit('onUpImg', _this.upload_ready_list);
};

// 删除图片(通用)
const dImage = (e, _this) => {
  const index = e.currentTarget.dataset.index;
  uni.showModal({
    title: _this.$t('basic-inquiry'),
    content: _this.$t('choiceTip-isDelete'),
    success: function (res) {
      if (res.confirm) {
        dImageView(_this, index);
      }
    },
  });
};
const dImageView = async (_this, index) => {
  //删除节点
  console.log('dImageView========================');

  const imag = _this.upload_picture_list[index]; //图片信息
  console.log(JSON.stringify(imag));
  if (imag.relationId) {
    //如果存在业务id需要删除业务关系
    await fileApi.filesRelationDel(imag.id);
  } else {
    //没有业务关系时分图片是否已经上传至文件服务器
    if (imag.id) {
      let params = [];
      params.push({
        id: imag.id,
      });
      await fileApi.fileDelete(params);
      _this.$emit('onImgDel', imag.id);
    }
  }
  _this.upload_picture_list.splice(index, 1);
  _this.upload_after_list.splice(index, 1);
  _this.upload_picture_list = _this.upload_picture_list;
};

// 上传前预览图片(通用)
const pImage = (e, _this) => {
  uni.previewImage({
    current: _this.upload_after_list[e.currentTarget.dataset.index],
    urls: _this.upload_after_list,
  });
};

// 上传后预览(通用)
const puImage = async (e, _this) => {
  let prevImgArr = [];
  for (let i = 0, len = _this.upload_picture_list.length; i < len; i++) {
    prevImgArr.push(_this.upload_picture_list[i].url);
  }
  uni.previewImage({
    current: e.currentTarget.dataset.src,
    urls: prevImgArr,
  });
};
</script>


<style lang="scss" scoped>
@import '@/static/scss/common/_function.scss';
.icon-text {
  font-size: 0.2em;
}

/* 宽度 */
.sunsin_width {
  width: 150upx !important;
  height: 150upx !important;
  /* line-height: 150upx !important; */
}

/* 循环列表样式 */
.sunsin_picture_list {
  width: 96%;
  padding: 2% 0;
  display: flex;
  /* flex-wrap: wrap; */
  text-align: center;
}
.sunsin_picture_list.wrap {
  flex-wrap: wrap;
}

.sunsin_picture_list image {
  width: 40upx;
  height: 40upx;
  margin: 0 4%;
}
.sunsin_picture_list image.icon_replace {
  width: 150upx;
  height: 150upx;
}

/* 添加图片样式 */
.sunsin_add_image {
  color: #ddd;
  font-size: 24upx;
  text-align: center;
  line-height: 0 !important;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border: 1px dashed rgba(217, 217, 217, 1);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60%;
}

/* 预览图片 */
.sunsin_picture_item {
  position: relative;
  margin-right: 30upx;
}

/* 删除按钮样式 */
.sunsin_picture_item .del {
  position: absolute;
  color: #fff;
  border-radius: -4upx;
  border-top-right-radius: 6upx;
  width: 40upx;
  height: 40upx;
  line-height: 40upx;
  z-index: 2;
  text-align: center;
  background-color: #808080;
  border-radius: 50%;
}

/* 删除图标位置(上左) */
.sunsin_picture_item .del.left {
  top: 0;
  left: 0;
  margin-left: 4%;
  border-top-right-radius: 0;
  border-top-left-radius: 6upx;
}

/* 删除图标位置(上右) */
.sunsin_picture_item .del.right {
  top: 0;
  right: -4.2%;
}

/* 删除图标位置(下左) */
.sunsin_picture_item .del.bleft {
  bottom: 0;
  left: 4%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 6upx;
}

/* 删除图标位置(下右) */
.sunsin_picture_item .del.bright {
  right: -4.2%;
  bottom: 0;
  border-top-right-radius: 0;
}

/* 进度遮罩层样式 */
.sunsin_upload_progress {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  font-size: 24upx;
  text-align: center;
  line-height: 160upx;
  margin-left: 4%;
  border-radius: 8upx;
  background-color: rgba(0, 0, 0, 0.7);
}

/* 自定义添加图片样式 */
.sunsin_picture_item image {
  box-shadow: 6upx 6upx 12upx rgba(112, 128, 144, 0.7);
  border-radius: 15upx;
}

/* 个人资质上传图片样式 */
// .qualification-upload-content{
// 	padding: pxToREM(30) ;
// 	background: #fff;
// 	width: 100%;
// }
.upload-item {
  width: 100%;
  height: pxToREM(345);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fafafa;
  border-radius: pxToREM(12);
  color: #d9d9d9;
  font-size: pxToREM(28);
  line-height: pxToREM(90);
}
.sunsin_picture_list_qualification {
  display: flex;
  justify-content: flex-start;
  margin-top: pxToREM(25);
  width: 100%;
  flex-wrap: wrap;
  border: none;
}
.sunsin_picture_list_qualification > view {
  flex-grow: 0;
  width: 30%;
  height: pxToREM(214);
  margin: 5px 1.5%;
}
.sunsin_picture_list_qualification > view > image.sunsin_width,
.sunsin_picture_list_qualification > view > view.sunsin_width {
  width: 100% !important;
  height: 100% !important;
  margin: 0;
}
.sunsin_picture_list_qualification .del.right {
  right: 0;
}
.noscroll {
  overflow-x: hidden;
}
.userinfo-upload {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.userinfo-upload image {
  width: pxToREM(110);
  height: pxToREM(110);
}
</style>
