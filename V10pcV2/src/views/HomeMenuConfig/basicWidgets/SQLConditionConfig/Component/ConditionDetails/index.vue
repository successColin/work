/**
* @name: index
* @author: DELL
* @date: 2021/12/29 11:18
* @description：index
* @update: 2021/12/29 11:18
*/
<!-- 页面 -->
<template>
  <div class="conditionWrap">
    <div class="outerStateWrap">
      <div
          :class="{active: config.status===1}"
          class="andWrap common"
          @click="changeActive(1)">并且
      </div>
      <div
          :class="{active: config.status===2}"
          class="orWrap common"
          @click="changeActive(2)">或者
      </div>
    </div>
    <div
        class="conditionContent"
        v-for="(item,i) in config.list"
        :key="`${i}`"
    >
      <div class="conditionInner"
      >
        <span class="icon-fangda iconfont" @click="handleInnerAdd(item.list, i)"></span>
        <div class="outerStateWrap">
          <div
              :class="{active: item.status===1}"
              class="andWrap common"
              @click="changeInnerActive(1,i )">并且
          </div>
          <div
              :class="{active: item.status===2}"
              class="orWrap common"
              @click="changeInnerActive(2,i )">或者
          </div>
        </div>
        <div class="conditionInnerContent">
          <div class="conditionItem" v-for="(items, index) in item.list"
               :key="`${index}_${i}`">
            <div class="selectItemWrap">
              <c-select
                  class="selecterWrap"
                  v-model="items.type"
                  :options="selectType"
                  @change="change"
                  placeholder="类型"></c-select>
              <div class="delWrap" @click="handleInnerDel(item.list, index, i)">
                <span class="icon-shanchu iconfont"></span>
              </div>
            </div>
            <div class="selectItemWrap">
              <apiot-input
                  class="conditionContentWrap"
                  @change="change"
                  v-model="items.content"
                  :isForbid="false"
                  :placeholder="renderPlaceholder(items.type)"></apiot-input>
            </div>
            <div class="selectItemWrap">
              <div class="itemWrap" style="margin-right: 10px;">
                <c-select
                    v-model="items.compare"
                    :options="compareArr"
                    @change="change"
                    placeholder="比较符"></c-select>
              </div>
              <div class="itemWrap">
                <apiot-input @change="change" v-model="items.value" placeholder="值"></apiot-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="addWrap">
      <apiot-button
          type="primary"
          @click="handleAdd"
          icon="icon-xinzeng iconfont">新增条件</apiot-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {
          status: 2,
          list: []
        };
      }
    }
  },
  data() {
    return {
      config: {},
      selectType: [{
        value: 1,
        label: 'SQL'
      }, {
        value: 2,
        label: '固定值'
      }],
      compareArr: [
        {
          value: 1,
          label: '等于'
        },
        {
          value: 2,
          label: '小于'
        },
        {
          value: 3,
          label: '小于等于'
        },
        {
          value: 4,
          label: '大于'
        },
        {
          value: 5,
          label: '大于等于'
        },
        {
          value: 6,
          label: '不等于'
        }
      ]
    };
  },
  watch: {
    value: {
      deep: true,
      handler(v) {
        this.config = JSON.parse(JSON.stringify(v));
      }
    }
  },
  components: {},

  computed: {
    renderPlaceholder() {
      return function (type) {
        if (type === 1) {
          return '请输入SQL';
        }
        if (type === 2) {
          return '请输入值';
        }
        return '';
      };
    }
  },

  mounted() {
    this.config = JSON.parse(JSON.stringify(this.value));
  },

  methods: {
    changeActive(value) { // 修改外层的条件状态
      this.config = {
        ...this.config,
        status: value
      };
      this.$emit('change', this.config);
    },
    changeInnerActive(v, i1) {
      this.config.list[i1].status = v;
      this.$emit('change', this.config);
    },
    handleInnerAdd(list = [], i) {
      list.push({
        field: '',
        compare: 1,
        value: ''
      });
      this.config.list[i].list = list;
      this.$emit('change', this.config);
    },
    handleInnerDel(list = [], index, i) {
      list.splice(index, 1);
      if (!list.length) {
        this.config.list.splice(i, 1);
      } else {
        this.config.list[i].list = list;
      }
      this.$emit('change', this.config);
    },
    change() {
      this.$emit('change', this.config);
    },
    handleAdd() {
      const { list = [] } = this.config;
      const obj = {
        list: [{
          field: '',
          compare: 1,
          value: ''
        }],
        status: 2
      };
      list.push(obj);
      this.config = {
        ...this.config,
        list
      };
      this.$emit('change', this.config);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.conditionWrap {
  width: 100%;

  .outerStateWrap {
    width: 128px;
    height: 25px;
    margin: 0 auto 10px auto;
    display: flex;
    justify-content: space-between;

    .andWrap {
    }

    .orWrap {
    }

    .common {
      width: 55px;
      height: 25px;
      border: 1px solid #E9E9E9;
      border-radius: 5px;
      line-height: 25px;
      font-size: 12px;
      text-align: center;
      background: #FFFFFF;
      color: #333333;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        color: #4689F5;
      }

      &.active {
        color: #FFFFFF;
        background: #4689F5;
      }
    }
  }

  .conditionContent {
    position: relative;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #e9e9e9;

    .conditionInner {
      position: relative;

      .icon-fangda {
        position: absolute;
        left: 50%;
        bottom: -37px;
        font-size: 18px;
        transform: translateX(-50%);
        color: #4689F5;
        cursor: pointer;

        &:hover {
          color: #6ba1f7;
        }
      }

      .conditionInnerContent {
        .conditionItem {
          //display: flex;
          //justify-content: space-between;
          margin-bottom: 10px;

          .selectItemWrap {
            display: flex;
            margin-bottom: 10px;

            .selecterWrap {
              width: calc(100% - 42px);
            }

            .conditionContentWrap {
              width: 100%;
            }

            .delWrap {
              width: 32px;
              height: 32px;
              margin-left: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #FFFFFF;
              border: 1px solid #E9E9E9;
              box-sizing: border-box;
            }

            ::v-deep {
              .el-input__inner {
                box-sizing: border-box;
              }
            }
          }
          .itemWrap {
            width: 50%;

            ::v-deep {
              .el-input__inner {
                padding: 0 0 0 15px;
                box-sizing: border-box;
              }

              .el-input__suffix {
                right: 0;
              }
            }
          }

          .delWrap {
            width: 6%;
            cursor: pointer;

            .icon-shanchu {
              font-size: 16px;
              color: #BBC3CD;

              &:hover {
                color: #4689F5;
              }
            }
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

    }
  }

  .addWrap {
    margin-top: 10px;
    width: 100%;

    ::v-deep {
      .el-button--primary {
        width: 100%;
      }

      .icon-xinzeng {
        vertical-align: bottom;
      }
    }
  }
}
</style>
