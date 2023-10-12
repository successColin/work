/**
* @name: index
* @author: DELL
* @date: 2022/1/11 9:43
* @description：index
* @update: 2022/1/11 9:43
*/
<!-- 页面 -->
<template>
  <div class="dataColor">
    <div
        v-for="(item, i) in list"
        :key="`${i}_${item.c1}_${item.c2}`"
        class="colorItem"
    >
      <div class="opeWrap">
        <div>颜色{{ i + 1 }}</div>
        <div @click="del(i)"><span class="icon-shanchu iconfont"></span></div>
      </div>
      <div class="colorWrap">
        <c-color-picker
            style="margin-right: 10px;"
            size="small"
            v-model="item.c1"
            show-alpha
            :predefine="predefineColors">
        </c-color-picker>
        <c-color-picker
            v-if="!single"
            style="margin-right: 10px;"
            size="small"
            v-model="item.c2"
            show-alpha
            :predefine="predefineColors">
        </c-color-picker>
      </div>
    </div>
    <div class="addWrap">
      <apiot-button @click="handleAdd" icon="icon-xinzeng iconfont">新增颜色</apiot-button>
    </div>
  </div>

</template>

<script>
import { predefineColors } from '../../constants/global';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    single: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      list: [],
      predefineColors
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.list = JSON.parse(JSON.stringify(this.value));
  },
  watch: {
    list: {
      deep: true,
      handler(v) {
        this.$emit('change', v);
      }
    }
  },

  methods: {
    del(i) {
      this.list.splice(i, 1);
    },
    handleAdd() {
      this.list.push({
        c1: '#fff',
        c2: '#fff'
      });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.dataColor {
  width: 100%;
  height: auto;

  .opeWrap {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;

    & > div {
      color: #333;
      //opacity: .7;
    }

    .icon-shanchu {
      display: none;
      color: #BBC3CD;

      &:hover {
        color: #4689F5;
        opacity: 1;
        cursor: pointer;
      }
    }
  }

  .colorWrap {
    display: flex;
  }

  .colorItem {
    &:hover .icon-shanchu {
      display: block;
    }
  }

  .addWrap {
    margin-top: 10px;
    width: 100%;
    ::v-deep {
      .el-button {
        width: 100%;
      }

      .icon-xinzeng {
        margin-right: 5px;
        color: #4689F5;
        vertical-align: bottom;
      }
    }
  }
}
</style>
