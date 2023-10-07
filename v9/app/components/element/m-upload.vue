<template name='sunui-upimg'>
  <!-- 	图片上传控件 -->
  <view
    class="formElemets form-upimg"
    v-if="element.visiabled"
    :class="[element.readonly ? 'readonly' : '']"
  >
    <label
      class="text"
      :class="upload_picture_list.length > 0 ? '' : 'drakcolor'"
    >
      {{ element.label }}
      <span
        v-if="element.requisite"
        class="icon iconfont iconmust-fill2 requisite"
      ></span>
    </label>
    <view class="content">
      <scroll-view scroll-x>
        <view class="sunsin_picture_list">
          <!-- 默认样式 -->
          <view v-if="!element.readonly">
            <view
              class="sunsin_picture_item sunsin_width"
              v-show="
                upload_picture_list.length < upImgConfig.count ||
                upImgConfig.notli
              "
            >
              <view
                class="sunsin_add_image sunsin_width"
                @click="chooseImage(upImgConfig.count)"
                v-show="upImgConfig.isAddImage || true"
              ></view>
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
              v-if="!element.readonly"
              >×</text
            >
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { fileApi } from '@/common/request/api.js';
import state from '@/store/state.js';
import { mapState, mapMutations } from 'vuex';
import EncryptionPSW from '@/static/js/encryptionPSW.js';

export default {
  name: 'sunui-upimg',
  props: {
    element: {
      type: Object,
      default() {
        return {};
      },
    },
    upImgBasic: {
      type: Object,
      default() {
        return {};
      },
    },
    relationId: { type: [Number, String], default: '' },
  },
  data() {
    return {
      upload_after_list: [],
      upload_picture_list: [],
      upload_ready_list: [], //准备上传的图片
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
    gImage(this); //获取图片
  },
  methods: {
    ...mapMutations('verificationRule', ['SET_TAB_RULE']),
    ...mapMutations('common', ['SET_TABS_FORMDATAS']),
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
      ? (config.count = 9)
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
        if (totalLength > config.count) break;

        _this.upload_ready_list.push(res.tempFiles[i]);
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
  if (!_this.element.relationTableName) {
    console.error('没有关联表');
    return;
  }
  if (_this.relationId) {
    await fileApi
      .getRelationFile({
        relationId: _this.relationId,
        relationTableName: _this.element.relationTableName,
        relationpriorityId: _this.element.priorityId,
        relationStateId: _this.element.stateId,
        relationTypeId: _this.element.typeId,
      })
      .then((pics) => {
        _this.upload_picture_list = pics;
        _this.upload_ready_list = [];
        _this.upload_after_list = [];
        _this.$emit('allImgs', {
          element: _this.element,
          value: pics,
          triggerBaseType: 'upImg',
        });
      });
  }
};
// 上传文件
const uImage = async (_this, config) => {
  await upload_file_server(_this, config, _this.upload_ready_list);
};
var upload_file_server;
// #ifdef APP-PLUS
upload_file_server = async (_this, configs, upload_ready_list, j) => {
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
  let param = EncryptionPSW({
    tableName: _this.element.relationTableName || 'workorder',
  });
  param.token = _this.token;
  const upload_task = await uni.uploadFile({
    //开始上传
    url: baseUrl + basicConfig.url,
    header: {
      'content-type': 'multipart/form-data',
      token: _this.token,
    },
    files: imgs,
    formData: param,
    async success(res) {
      if (res.statusCode == 200) {
        let result = JSON.parse(res.data);
        if (result.success) {
          const imags = result.data;
          imags.map((item, index) => {
            //保存成功后将地址和id存入upload_picture_list中
            upload_ready_list[index]['url'] = item.url;
            upload_ready_list[index]['id'] = item.id;

            upload_ready_list[index]['typeId'] = _this.element.typeId;
            upload_ready_list[index]['stateId'] = _this.element.stateId;
            upload_ready_list[index]['priorityId'] = _this.element.priorityId;
            _this.upload_picture_list[upload_picture_list_length + index] =
              upload_ready_list[index];
          });
          await tImage(_this, upload_ready_list, configs.count);
          _this.upload_ready_list = []; //清空可以上传的图片
        }

        uni.hideLoading();
      }
    },
    async fail(err) {
      uni.showLoading({
        title: _this.$t('pageTip-pictureUploadFailed'), //图片上传失败!
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
// #endif

// #ifdef H5
const up_img = function (
  _this,
  configs,
  file,
  index,
  upload_picture_list_length
) {
  let basicConfig = {
    url: configs.basicConfig.url || '',
  };
  let baseUrl = _this.baseUrl || _this.defaultUrl;
  return new Promise((resolve, reject) => {
    let param = EncryptionPSW({
      tableName: _this.element.relationTableName || 'workorder',
    });
    param.token = _this.token;
    const upload_task = uni.uploadFile({
      //开始上传
      url: baseUrl + basicConfig.url,
      header: {
        token: _this.token,
      },
      filePath: file.path,
      name: 'files' + index,
      formData: param,
      success(res) {
        resolve(res);
      },
      fail(err) {
        uni.showLoading({
          title: _this.$t('pageTip-pictureUploadFailed'), //图片上传失败!
        });
        reject(err);
        _this.upload_picture_list = [];
        _this.upload_after_list = [];
        setTimeout(() => {
          uni.hideLoading();
        }, 2000);
        console.warn(err, '请检查是否CORB/CORS错误!');
      },
    });

    _this.upload_picture_list.push(file); //将上传的图片添加到已上传的图片中展示
    upload_task.onProgressUpdate(async (res) => {
      // for (let i = 0, len = upload_ready_list.length; i < len; i++) {
      file['upload_percent'] = await res.progress;
      _this.upload_picture_list[upload_picture_list_length + index] = file;
      // }
    });
  });
};

const uploads = async (
  _this,
  configs,
  upload_ready_list,
  upload_picture_list_length
) => {
  const that = this;
  let arr = [];
  for (let k = 0, len = upload_ready_list.length; k < len; k++) {
    arr[k] = await up_img(
      _this,
      configs,
      upload_ready_list[k],
      k,
      upload_picture_list_length
    ).then((res) => {
      if (res.statusCode == 200) {
        let result = JSON.parse(res.data);
        if (result.success) {
          const imageInfo = result.data[0];
          // imags.map( (item, index) => {
          //保存成功后将地址和id存入upload_picture_list中
          upload_ready_list[k]['url'] = imageInfo.url;
          upload_ready_list[k]['id'] = imageInfo.id;

          upload_ready_list[k]['typeId'] = _this.element.typeId;
          upload_ready_list[k]['stateId'] = _this.element.stateId;
          upload_ready_list[k]['priorityId'] = _this.element.priorityId;
          // _this.upload_picture_list[upload_picture_list_length+k] = upload_ready_list[k]
          // })
        }
        uni.hideLoading();
      }
    });
  }
  return arr;
};

upload_file_server = async (_this, configs, upload_ready_list, j) => {
  //将没有上传的图片批量上传
  const upload_picture_list_length = _this.upload_picture_list.length;
  const upload_tasks = uploads(
    _this,
    configs,
    upload_ready_list,
    upload_picture_list_length
  );
  upload_tasks.then(() => {
    tImage(_this, upload_ready_list, configs.count);
    _this.upload_ready_list = []; //清空可以上传的图片
  });

  /* let imgs = upload_ready_list.map((value, index) => {//转化可上传数据
		    return {
		            name: "files"+index, 
		            uri: value.path
		        }
		})
		const upload_picture_list_length = _this.upload_picture_list.length
		
		
		//上传进度
		_this.upload_picture_list = _this.upload_picture_list.concat(upload_ready_list)//将上传的图片添加到已上传的图片中展示
		upload_task.onProgressUpdate(async (res) => {
			for (let i = 0, len = upload_ready_list.length; i < len; i++) {
				upload_ready_list[i]['upload_percent'] = await res.progress;
				_this.upload_picture_list[upload_picture_list_length+i] = upload_ready_list[i]
			}
		}); */
};
// #endif

// 上传图片子组件->父组件(通用)
const tImage = async (_this, upload_ready_list, count) => {
  await _this.$emit('onUpImg', _this.upload_ready_list);
  _this.$emit('allImgs', {
    element: _this.element,
    value: _this.upload_picture_list,
    triggerBaseType: 'upImg',
  });
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
  const imag = _this.upload_picture_list[index]; //图片信息
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
      _this.$emit('allImgs', {
        element: _this.element,
        value: _this.upload_picture_list,
        triggerBaseType: 'upImg',
      });
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
/* 宽度 */
.sunsin_width {
  width: 150upx !important;
  height: 150upx !important;
}

/* 循环列表样式 */
.sunsin_picture_list {
  width: 96%;
  padding: 2% 0;
  display: flex;
  /* flex-wrap: wrap; */
  text-align: center;
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
  background-image: url(../../static/images/upload.png);
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
</style>
