/**
* @name: index
* @author: DELL
* @date: 2021/12/6 14:45
* @description：index
* @update: 2021/12/6 14:45
*/
<!-- 页面 -->
<template>
  <div class="positionWrap">
    <el-tooltip
        class="item"
        effect="dark"
        :content="item.content"
        :placement="item.placement"
        v-for="item in config"
        :key="item.type"
    >
      <div class="positionBox" @click="choose(item)" :class="{active: item.type === value}">
        <div :class="item.classList"></div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      config: [
        {
          content: '顶部居左',
          placement: 'top-start',
          classList: 'horizontal tl',
          type: 'tl'
        },
        {
          content: '顶部居中',
          placement: 'top-start',
          classList: 'horizontal tc',
          type: 'tc'
        },
        {
          content: '顶部居右',
          placement: 'top-start',
          classList: 'horizontal tr',
          type: 'tr'
        },
        {
          content: '底部居左',
          placement: 'top-start',
          classList: 'horizontal bl',
          type: 'bl'
        },
        {
          content: '底部居中',
          placement: 'top-start',
          classList: 'horizontal bc',
          type: 'bc'
        },
        {
          content: '底部居右',
          placement: 'top-start',
          classList: 'horizontal br',
          type: 'br'
        },
        {
          content: '左侧居顶',
          placement: 'bottom-start',
          classList: 'vertical lt',
          type: 'lt'
        },
        {
          content: '左侧居中',
          placement: 'bottom-start',
          classList: 'vertical lc',
          type: 'lc'
        }, {
          content: '左侧居底',
          placement: 'bottom-start',
          classList: 'vertical lb',
          type: 'lb'
        },
        {
          content: '右侧居顶',
          placement: 'bottom-start',
          classList: 'vertical rt',
          type: 'rt'
        },
        {
          content: '右侧居中',
          placement: 'bottom-start',
          classList: 'vertical rc',
          type: 'rc'
        },
        {
          content: '右侧居底',
          placement: 'bottom-start',
          classList: 'vertical rb',
          type: 'rb'
        }
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    choose({type}) {
      this.$emit('change', type);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.positionWrap {
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .positionBox {
    width: 36px;
    height: 30px;
    margin-right: 7px;
    margin-bottom: 5px;
    position: relative;
    background: #192757;
    border: 1px solid #2F437F;
    box-sizing: border-box;

    &.active {
      background: #4689F5;

      & > div {
        background-color: #FFFFFF;
      }
    }

    .tl {
      position: absolute;
      left: 6px;
      top: 5px
    }

    .tc {
      position: absolute;
      left: 10.5px;
      top: 5px
    }

    .tr {
      position: absolute;
      right: 6px;
      top: 5px
    }

    .bl {
      position: absolute;
      left: 6px;
      bottom: 5px
    }

    .bc {
      position: absolute;
      left: 10.5px;
      bottom: 5px
    }

    .br {
      position: absolute;
      right: 6px;
      bottom: 5px
    }

    .lt {
      position: absolute;
      left: 6px;
      top: 5px
    }

    .lc {
      position: absolute;
      left: 6px;
      top: 7.5px
    }

    .lb {
      position: absolute;
      left: 6px;
      bottom: 5px
    }

    .rt {
      position: absolute;
      right: 6px;
      top: 5px
    }

    .rc {
      position: absolute;
      right: 6px;
      top: 7.5px
    }

    .rb {
      position: absolute;
      right: 6px;
      bottom: 5px
    }

    .horizontal {
      width: 13px;
      height: 3px;
      background-color: #6B798D;
      border-radius: 1px;
    }

    .vertical {
      width: 3px;
      height: 13px;
      background-color: #6B798D;
      border-radius: 1px;
    }

    &:nth-child(6) {
      margin-right: 0;
    }

    &:nth-child(12) {
      margin-right: 0;
    }

    &:hover {
      background: #223B76;
      border: 1px solid #4689F5;
      cursor: pointer;
    }
  }
}
</style>
