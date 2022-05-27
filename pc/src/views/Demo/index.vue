<template>
  <div class="taskManagement">
    <!--使用draggable组件-->
    <div class="taskManagement__col" v-for="(item, i) in moduleArr" :key="i">
      <div class="taskManagement__title">{{ item.title }}</div>
      <draggable
        v-model="item.arrName"
        group="site"
        animation="300"
        dragClass="dragClass"
        ghostClass="ghostClass"
        chosenClass="chosenClass"
        @start="onStart"
        @end="onEnd"
        class="taskManagement__draggable"
      >
        <transition-group class="taskManagement__group">
          <div class="item" v-for="val in item.arrName" :key="val.id">
            {{ val.name }}
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import { auth } from '@/api/login';

export default {
  components: {},
  data() {
    return {
      drag: false,
      // 定义要被拖拽对象的数组
      moduleArr: [
        {
          title: '创建任务',
          arrName: [
            { id: 1, name: 'www.itxst.com1' },
            { id: 2, name: 'www.jd.com2' },
            { id: 3, name: 'www.baidu.com3' },
            { id: 4, name: 'www.taobao.com4' }
          ]
        },
        {
          title: '进行中',
          arrName: [
            { id: 11, name: 'www.google.com5' },
            { id: 12, name: 'www.msn.com6' },
            { id: 13, name: 'www.ebay.com7' },
            { id: 14, name: 'www.yahoo.com8' }
          ]
        },
        {
          title: '完成',
          arrName: [
            { id: 21, name: 'www.google.com9' },
            { id: 22, name: 'www.msn.com10' },
            { id: 23, name: 'www.ebay.com11' },
            { id: 24, name: 'www.yahoo.com12' }
          ]
        },
        {
          title: '测试',
          arrName: [
            { id: 31, name: 'www.google.com13' },
            { id: 32, name: 'www.msn.com14' },
            { id: 33, name: 'www.ebay.com15' },
            { id: 34, name: 'www.yahoo.com16' }
          ]
        }
      ]
      // arr1: ,
      // arr2:
      // arr3:
      // arr4:
    };
  },
  mounted() {
    // console.log(this.getQueryVariable());
    // eslint-disable-next-line camelcase,no-unused-vars
    const auth_code = this.getQueryVariable('auth_code');
    auth({ authCode: auth_code, oAuthType: 'E_WECHAT' }).then((res) => {
      console.log(res);
    });
  },
  methods: {
    // 开始拖拽事件
    onStart() {
      this.drag = true;
    },
    // 拖拽结束事件
    onEnd() {
      this.drag = false;
    },
    getQueryVariable(variable) {
      const query = window.location.search.substring(1);
      const vars = query.split('&');
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) {
          return pair[1];
        }
      }
      return false;
    }
  }
};
</script>

<style lang='scss' scoped>
.taskManagement {
  display: flex;

  &__col {
    flex: 1;
    padding: 10px;
    border: solid 1px #eee;
    border-radius: 5px;
    margin: 10px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
  }

  &__title {
    padding: 6px 12px;
  }

  &__draggable {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__group {
    height: 100%;
  }

  /*定义要拖拽元素的样式*/
  .ghostClass {
    background-color: blue !important;
  }

  .chosenClass {
    background-color: red !important;
    opacity: 1 !important;
  }

  .dragClass {
    background-color: blueviolet !important;
    opacity: 1 !important;
    box-shadow: none !important;
    outline: none !important;
    background-image: none !important;
  }

  .item {
    padding: 6px 12px;
    margin: 0px 10px 0px 10px;
    border: solid 1px #eee;
    background-color: #f1f1f1;
  }

  .item:hover {
    background-color: #fdfdfd;
    cursor: move;
  }

  .item + .item {
    border-top: none;
    margin-top: 6px;
  }
}
</style>
