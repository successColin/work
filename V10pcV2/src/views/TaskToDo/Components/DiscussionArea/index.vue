/**
* @name: index
* @author: DELL
* @date: 2021/9/24 10:36
* @description：index
* @update: 2021/9/24 10:36
*/
<!-- 页面 -->
<template>
  <div class="areaWrap">
    <div class="areaBox">
      <div class="areaItem" v-for="item in list" :key="item.id">
        <div class="itemTitle">
          <Users :row="item" userid="userid" prop="userName"></Users>
          <span class="m-l-4 Comment">发表评论</span>
          <span
            class="del"
            v-if="$store.state.userCenter.userInfo === item.userid"
            >删除</span
          >
        </div>
        <div class="itemContent">
          {{ item.message }}
        </div>
        <div class="itemFiles" v-if="item.fileArr.length">
          <div class="file" v-for="obj in item.fileArr" :key="obj.url">
            <div class="fileModal">
              <el-tooltip
                class="item"
                effect="dark"
                content="预览"
                placement="top"
              >
                <i
                  class="iconfont icon-mimaxianshi"
                  @click="preview(obj.url)"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top"
              >
                <i class="iconfont icon-xiazai" @click="downLoad(obj.url)"></i>
              </el-tooltip>
            </div>
            <el-image class="imgWrap" :src="obj.url" fit="cover"></el-image>
          </div>
        </div>
        <div class="itemTime">{{ item.time }}</div>
      </div>
    </div>
    <div class="currentUser">
      <Users
        :row="$store.state.userCenter.userInfo"
        userid="id"
        prop="username"
      ></Users>
    </div>
    <div class="submitContent">
      <apiot-input
        resize="none"
        v-model="textValue"
        type="textarea"
        placeholder="讨论让工作更轻松…"
      ></apiot-input>
    </div>
    <div class="footer">
      <apiot-button type="primary">发表</apiot-button>
    </div>
    <apiot-dialog :visible.sync="visible">
      <img :src="$parseImgUrl(url)" alt="" />
    </apiot-dialog>
  </div>
</template>

<script>
import Users from '@/views/Users/Main/UserColumn/Users/index';
import { getBlob, saveAs } from '@/utils/utils';

export default {
  data() {
    return {
      textValue: '', // 发表的内容
      url: '',
      visible: false,
      list: [
        {
          userName: '测试',
          userid: 1,
          id: 1,
          message: '订单明细那里少了一条，就昨天才生成的，记得加上去哦！',
          time: '2020-12-30 16:45',
          fileArr: []
        },
        {
          userName: '测试1',
          userid: 12,
          id: 2,
          message: '订单明细那里少了一条，就昨天才生成的，记得加上去哦！',
          time: '2020-12-30 16:45',
          fileArr: [
            { url: 'https://wx2.sinaimg.cn/mw690/003aTFYJly1guol98bdn9j60u01hcmyd02.jpg' },
            { url: 'https://wx4.sinaimg.cn/mw690/003aTFYJly1guol99aajdj60u01hctae02.jpg' },
            { url: 'https://pic2.zhimg.com/v2-df3f5161119e69bb81c911b24353150a_xs.jpg' },
            {
              url:
                'https://pic3.zhimg.com/80/v2-1025b7a19a6a08f9bcd0e14c31557042_720w.jpg?source=1940ef5c'
            }
          ]
        }
      ]
    };
  },

  components: { Users },

  computed: {},

  mounted() {
    // console.log(this.$store.state.userCenter.userInfo);
  },

  methods: {
    preview(url) {
      this.url = url;
      this.visible = true;
    },
    // eslint-disable-next-line no-unused-vars
    downLoad(url) {
      getBlob(
        {
          url,
          token: ''
        },
        (res) => {
          saveAs(res, url);
        }
      );
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.areaWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  ::v-deep {
    .el-dialog__body {
      overflow-y: auto;

      & > img {
        width: 100%;
      }
    }
  }

  .areaBox {
    width: 100%;
    height: calc(100% - 42px - 141px - 42px);
    overflow-y: auto;
    background: #fafafa;

    .areaItem {
      padding: 13px 10px;

      .itemTitle {
        margin-bottom: 8px;
        position: relative;
        overflow: hidden;

        & > .Comment {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
          vertical-align: sub;
        }

        .del {
          display: none;
          position: absolute;
          right: 0;
          top: 6px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          cursor: pointer;
        }

        &:hover .del {
          display: block;
        }
      }

      .itemContent {
        margin-bottom: 3px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }

      .itemTime {
        height: 20px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        line-height: 20px;
      }

      .itemFiles {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 10px;

        .file {
          position: relative;
          margin-bottom: 5px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 4px;

          .fileModal {
            position: absolute;
            display: none;
            width: 81px;
            height: 81px;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: 1;

            .iconfont {
              color: #ffffff;
              font-size: 16px;
              cursor: pointer;
            }

            .icon-mimaxianshi {
              margin-right: 10px;
            }
          }

          &:hover .fileModal {
            display: block;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .imgWrap {
          width: 81px;
          height: 81px;
          border-radius: 4px;
        }
      }
    }
  }

  .currentUser {
    height: 42px;
    display: flex;
    padding-left: 10px;
    align-items: center;
    border-top: 1px solid #e9e9e9;
    background: #fafafa;
    box-sizing: border-box;
  }

  .submitContent {
    height: 141px;
    padding: 5px 10px 10px 10px;
    box-sizing: border-box;
    background: #fafafa;

    ::v-deep {
      .el-textarea {
        height: 100%;

        .el-textarea__inner {
          height: 100%;
        }
      }
    }
  }

  .footer {
    height: 42px;
    padding-right: 10px;
    line-height: 42px;
    border-top: 1px solid #e9e9e9;
    text-align: right;
    box-sizing: border-box;
  }
}
</style>
