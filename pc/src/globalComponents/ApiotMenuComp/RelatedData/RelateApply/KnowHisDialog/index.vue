<template>
  <apiot-drawer
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    :title="$t('knowledge.his_version')"
    class="hisDialog"
    :size="512"
    :append-to-body="true"
    :hasFooter="false"
  >
    <section class="hisBody">
      <div class="hisBody__file">
        <img :src="fileUrl(hisObj)" class="hisBody__file--img" v-if="hisObj" />
        <div class="hisBody__file--info">
          <p class="hisBody__file--name" :title="getCurObj.name">
            {{ renderFileName(getCurObj.name) }}
          </p>
          <p class="hisBody__file--normal">
            {{ calculateSize(getCurObj.size) }}
          </p>
          <p class="hisBody__file--normal">
            创建人：{{ getCurObj.uploadUserName }}
          </p>
          <p class="hisBody__file--normal">
            创建时间：{{ getCurObj.uploadTime }}
          </p>
        </div>
      </div>
      <ul class="hisBody__list">
        <li
          class="hisBody__item"
          v-for="(item, index) in hisArr"
          :key="item.id"
        >
          <div class="hisBody__item--person">
            <div class="avtorBox">
              <span class="avtor" :style="getColor(item)">
                {{ renderAvtor(item) }}
              </span>
              {{ item.uploadUserName }}
            </div>
            <span class="des">更新了版本{{ hisArr.length - index }}</span>
            <span class="time">{{ item.modifyTime }}</span>
          </div>
          <div
            class="hisBody__item--memo font__ellipsis"
            v-show="item.memo"
            :title="item.memo"
          >
            {{ item.memo }}
          </div>
          <div
            class="hisBody__item--file"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
          >
            <img class="hisBody__item--img" :src="fileUrl(item)" alt="" />
            <span class="hisBody__item--fileName">{{
              renderFileName(item.name)
            }}</span>
            <span
              class="hisBody__item--fileDown"
              v-show="hoverIndex === index"
              :class="[{ mlu: hoverIndex === index }]"
              @click="download(item)"
            >
              <i class="iconfont icon-xiazai"></i>
              下载
            </span>
            <span
              class="hisBody__item--fileSize"
              :class="[{ mlu: hoverIndex !== index }]"
              >{{ calculateSize(item.size) }}</span
            >
          </div>
        </li>
      </ul>
    </section>
  </apiot-drawer>
</template>

<script>
import cnchar from 'cnchar';
import { getHistory } from '@/api/knowledge';
import { getBlob, saveAs } from '@/utils/utils';

export default {
  name: '',
  props: {
    hisObj: {
      type: Object
    },
    fileUrl: {
      type: Function,
      default: () => {}
    },
    showHis: {
      type: Boolean
    }
  },
  data() {
    return {
      hisArr: [],
      hoverIndex: -1
    };
  },

  computed: {
    // 获取当前对象
    getCurObj() {
      if (this.hisObj) {
        return this.hisObj.sysKlTree;
      }
      return {};
    },
    // 处理名称
    renderFileName() {
      return function (name) {
        if (!name) {
          return '';
        }
        const realNameArr = name.split('.');
        if (realNameArr[0].length > 10) {
          realNameArr[0] = `${realNameArr[0].slice(0, 5)}...${realNameArr[0].slice(
            -2,
            realNameArr[0].length
          )}`;
        }
        return realNameArr.join('.');
      };
    },
    renderAvtor() {
      return (obj) => {
        let avtor = obj.uploadUserName ? cnchar.spell(obj.uploadUserName, 'first', 'up') : '';
        const len = avtor.length;
        avtor = avtor.substr(len - 2, 2);
        return avtor;
      };
    },
    getColor() {
      return (obj) => {
        const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
        const index = obj.uploadUser || 0;
        const color = `background:${colors[index % 5]}`;
        return color;
      };
    }
  },

  mounted() {},

  methods: {
    calculateSize(size) {
      const kb = 1024;
      const mb = kb * 1024;
      const gb = mb * 1024;
      // eslint-disable-next-line no-unused-vars
      let ret = '';

      if (size >= gb) {
        ret = `${(size / (gb * 1.0)).toFixed(0)} GB`;
      } else if (size >= mb) {
        ret = `${(size / (mb * 1.0)).toFixed(0)} MB`;
      } else if (size >= kb) {
        ret = `${(size / (kb * 1.0)).toFixed(0)} KB`;
      } else if (size > 0) {
        ret = `${(size / 1.0).toFixed(0)} KB`;
      } else {
        ret = '0 KB';
      }
      return ret;
    },
    async getHistory() {
      if (!this.getCurObj.id) {
        return;
      }
      const data = await getHistory({ id: this.getCurObj.id });
      this.hisArr = data.map((item) => ({
        ...this.getCurObj,
        ...item
      }));
    },
    download(item) {
      getBlob({ url: item.url }, (blob) => {
        saveAs(blob, item.name);
      });
    }
  },

  components: {},

  watch: {
    showHis(v) {
      if (v) {
        this.getHistory();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.hisBody {
  height: 100%;
  box-sizing: border-box;
  padding: 20px 30px 10px;
  overflow: hidden;
  &__file {
    height: 130px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: #fafafa;
    border-radius: 8px;
    &--img {
      width: 60px;
      height: 60px;
      margin-right: 14px;
    }
    &--info {
      flex: 1;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    &--name {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    &--normal {
      margin-top: 3px;
      font-size: 14px;
      font-weight: 400;
      color: #808080;
      line-height: 20px;
    }
  }
  &__list {
    height: calc(100% - 130px);
    overflow: auto;
  }
  &__item {
    padding: 12px 0 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    &--person {
      display: flex;
      align-items: center;
      .avtorBox {
        height: 24px;
        line-height: 24px;
        background: #f1f3f6;
        border-radius: 12px;
        padding-right: 6px;
        width: max-content;

        line-height: 14px;
        .avtor {
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          line-height: 24px;
          text-align: center;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
      .des {
        color: #666666;
        margin-left: 6px;
      }
      .time {
        margin-left: auto;
        color: #aaaaaa;
      }
    }
    &--memo {
      color: #808080;
      line-height: 18px;
      margin-top: 10px;
    }
    &--file {
      margin-top: 10px;
      padding: 0 10px 0 8px;
      height: 36px;
      line-height: 16px;
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
    }
    &--img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
    .mlu {
      margin-left: auto;
    }
    &--fileDown {
      position: relative;
      display: inline-flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
        i {
          color: $--color-primary;
        }
      }
      i {
        color: #bbc3cd;
        font-size: 16px;
        margin-right: 2px;
      }
      &:after {
        content: '';
        position: absolute;
        right: -10px;
        width: 1px;
        height: 14px;
        background-color: #e9e9e9;
      }
    }
    &--fileSize {
      color: #808080;
    }
  }
}
</style>
