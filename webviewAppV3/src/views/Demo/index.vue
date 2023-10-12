<template>
  <div class="piniaClass">pinia 案例</div>
  <div class="container">我是:{{ user.name }},今年{{ user.age }}</div>
  <div class="container">
    解构出来的：<br />
    我是:{{ name }},今年{{ age }}
  </div>
  <div>getters: {{ user.fullName }}</div>
  <van-button
    class="container__button"
    type="primary"
    @click="handleAdd"
    ref="btn"
  >
    增加年龄
  </van-button>
  <van-button
    class="container__button"
    type="primary"
    @click="handleClick"
    ref="btn"
  >
    重置
  </van-button>
  {{ pinia.userName }}
</template>

<script setup lang='ts'>
import { usePiniaState, useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
const user = useUserStore();

const pinia = usePiniaState();

// 结构出来没有响应式
const { name, age } = storeToRefs(user);

// 1、user.age++
// 2、user.$patch({}) 对象
// 3、user.$patch(() => {}) 函数
// 4、user.$state
// 5、使用 actions

user.$subscribe(
  (arg, state) => {
    console.log(arg, state);
  },
  { detached: true }
);

user.$onAction((arg) => {
  console.log(arg);
}, true);

const handleAdd = () => {
  console.log('我要给你年龄+1');
  // user.age++;
  // user.name = '天翔';
  // user.$patch({
  //   name: '天翔',
  //   age: 30,
  // });
  // user.$patch((state) => {
  //   state.name = '天翔',
  //   state.age = 30;
  // });
  // user.$state = {
  //   name: '天翔',
  //   age: 30,
  // };
  user.updateAge();
};

const handleClick = () => {
  user.$reset();

  pinia.getUserNmae('给我 hello 变 金箍棒');
};
</script>

<style scoped lang="scss">
.piniaClass {
  font-size: 40px;
  text-align: center;
  margin-bottom: 30px;
}
.container {
  &__button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>