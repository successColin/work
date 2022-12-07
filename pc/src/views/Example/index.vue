<template>
  <div class="about" style="width: 100%; height: 200px">
    <!-- <apiot-tabs></apiot-tabs> -->
    <apiot-table
      ref="multipleTable"
      :tableData="tableData"
      tooltip-effect="light"
      style="width: 100%; height: 300px"
      row-key="date"
      :isNeedRowDrop="true"
      :isNeedColumnDrop="true"
      :dropColumnData.sync="dropColumnData"
      @selection-change="handleSelectionChange"
      @cell-dblclick="cellDblclick"
    >
      <component
        v-for="(item, index) in dropColumnData"
        :key="`${item.prop}_${index}`"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :is="dropColumnData[index].compName"
        :showInput="showInput"
        @blurInput="blurInput"
      ></component>
    </apiot-table>
    <!-- <apiot-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      :total="400"
    ></apiot-pagination>
    <div style="margin-top: 20px">
      <apiot-button @click="toggleSelection([tableData[1], tableData[2]])"
        >切换第二、第三行的选中状态</apiot-button
      >
      <apiot-button @click="toggleSelection()">取消选择</apiot-button>
    </div>
    <input type="text" />
    <p class="nowColor">测试主题</p>
    <el-color-picker size="medium" @change="changeTheme"> </el-color-picker>
    <apiot-button>默认按钮</apiot-button>
    <apiot-button type="primary">主要按钮</apiot-button>
    <apiot-button type="success">成功按钮</apiot-button>
    <apiot-button type="info">信息按钮</apiot-button>
    <apiot-button type="warning">警告按钮</apiot-button>
    <apiot-button type="danger">危险按钮</apiot-button>
    <apiot-input
      v-model="apiotInputVal"
      placeholder="请输入账号"
      type="text"
      :disabled="false"
      :clearable="true"
      :show-password="false"
      suffix-icon="el-icon-date"
      prefix-icon="el-icon-search"
      size="medium"
      :focus="true"
      :maxlength="18"
      prependText="手机号"
      appendText="appendText"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    </apiot-input>
    <apiot-button
      type="text"
      plain
      round
      circle
      :name="btnName"
      :isGroup="true"
      icon="el-icon-search"
      size="medium"
    ></apiot-button> -->
    <!-- disabled -->
    <!-- <apiot-button :name="btnName1" :isGroup="true" size="small"></apiot-button>
    <apiot-button
      name="提交按钮"
      size="mini"
      icon="el-icon-delete"
      round
    ></apiot-button>
    <i class="iconfont icon-xiazai"></i> -->
    <!-- <div style="width: 100%; height: 100px; margin-top: 50px">
      <filterable-input
        placeholder="请选择关联表"
        title="关联表"
        :dialogType="1"
        :currentValue="filterableValue1"
      ></filterable-input>
      <filterable-input
        placeholder="输入表名称搜索"
        title="关联表"
        :dialogType="1"
        :showInfo="getCurrentTab.tableInfo"
        @selectRes="selectTable"
      ></filterable-input>
      <filterable-input
        style="margin-top: 30px"
        placeholder="请选择字段"
        title="选择字段"
        :dialogType="2"
        :currentValue="filterableValue2"
      ></filterable-input>
    </div> -->
    <div style="display: none; margin-top: 1000px">
      <div class="wangeditor">
        <h1>标题一</h1>
        <p>正文balabala</p>
        <h2>标题二</h2>
        <p>正文balabala</p>
        <h3>标题三</h3>
        <p>正文balabala</p>
        <h4>标题四</h4>
        <p>正文balabala</p>
        <h5>标题五</h5>
        <p>正文balabala</p>
        <h2>标题五</h2>
        <p>正文balabala</p>
        <h3>标题六</h3>
        <p>正文balabala</p>
        <h3>标题七</h3>
        <p>正文balabala</p>
      </div>
      <div id="catalogBox" style="margin-left: 15px"></div>
    </div>
    <div id="echartsMain" ref="echartsMain"></div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import Wangeditor from 'wangeditor';
// import ColumnName from './component/column/ColumnName';
// import ColumnAddress from './component/column/ColumnAddress';
import i18next from 'i18next';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { changeThemeColor } from '@/utils/themeColorClient';

// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, LineChart, GraphChart, CanvasRenderer]);

export default {
  data() {
    return {
      filterableValue1: { value: 1 },
      filterableValue2: { value: 1 },
      apiotInputVal: '',
      btnName: [
        { title: '提交1', icon: 'el-icon-edit', fun: this.handleBtnClick1 },
        { title: '提交2', icon: 'el-icon-share', fun: this.handleBtnClick2 },
        { title: '提交3', icon: 'el-icon-delete', fun: this.handleBtnClick3 }
      ],
      btnName1: [{ title: '提交1', icon: 'el-icon-edit' }, { title: '提交2' }],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      dropColumnData: [
        {
          label: '姓名',
          prop: 'name',
          width: '120',
          compName: 'ElTableColumn'
        },
        {
          label: '地址',
          prop: 'address',
          compName: 'ElTableColumn'
        },
        {
          label: '日期',
          prop: 'date',
          width: '120',
          compName: 'ElTableColumn'
        }
      ],
      multipleSelection: [],
      showInput: ''
    };
  },
  components: {
    // ColumnName,
    // ColumnAddress
  },
  methods: {
    handleBtnClick1() {
      // console.log('按钮1');
    },
    handleBtnClick2() {
      // console.log('按钮2');
    },
    handleBtnClick3() {
      // console.log('按钮3');
    },
    handleChange() {
      // console.log('仅在输入框失去焦点或用户按下回车时触发');
    },
    handleFocus() {
      // console.log('在 Input 获得焦点时触发');
    },
    handleBlur() {
      // console.log('在 Input 失去焦点时触发');
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      // console.log(val);
      this.multipleSelection = val;
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        }
      });
    },

    blurInput(row, prop, value) {
      row[prop] = value;
      this.showInput = '';
    },

    cellDblclick(row, column) {
      this.showInput = column.property + row.date;
      this.$nextTick(() => {
        const ele = this.$refs[this.showInput];
        if (ele) {
          ele.focus();
        }
      });
    },

    changeTheme(newColor) {
      // console.log(newColor);
      changeThemeColor(newColor);
    },

    initEcharts() {
      const mainDom = this.$refs.echartsMain; // 设置dom
      this.myEcharts = echarts.init(mainDom); // 初始化echarts
      const nodes = [
        {
          name: '韦小宝',
          id: '1',
          symbolSize: 30
        },
        {
          name: '方怡',
          id: '2',
          symbolSize: 30
        },
        {
          name: '双儿',
          id: '3',
          symbolSize: 30
        },
        {
          name: '茅十八',
          id: '4',
          symbolSize: 30
        },
        {
          name: '吴六奇',
          id: '5',
          symbolSize: 30
        }
      ];
      const links = [
        {
          source: '1',
          target: '2',
          relation: {
            name: '老婆'
          }
        },
        {
          source: '1',
          target: '3',
          relation: {
            name: '老婆'
          }
        },
        {
          source: '1',
          target: '4',
          relation: {
            name: '兄弟'
          }
        },
        {
          source: '4',
          target: '1',
          relation: {
            name: '兄弟'
          }
        },
        {
          source: '3',
          target: '5',
          relation: {
            name: '义妹'
          }
        }
      ];
      const option = {
        series: [
          {
            type: 'graph',
            layout: 'force',
            nodes,
            links,
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  {
                    offset: 0,
                    color: '#3dd67a' // 0% 处的颜色
                  },
                  {
                    offset: 0.7,
                    color: '#3dd67a' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#95dcb2' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 3
              }
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 5,
              fontSize: 12,
              align: 'center'
            },
            autoCurveness: 0.01,
            edgeLabel: {
              // 边的设置
              show: true,
              position: 'middle',
              fontSize: 12,
              formatter: (params) => params.data.relation.name
            },
            edgeSymbol: ['circle', 'arrow'], // 边两边的类型
            force: {
              repulsion: 100,
              gravity: 0.01,
              edgeLength: 150
            }
          }
        ]
      };
      this.myEcharts.setOption(option);
    }

    // columnDropEnd(evt) {
    //   const oldItem = this.dropColumnData.splice(evt.oldIndex - 1, 1);
    //   this.dropColumnData.splice(evt.newIndex - 1, 0, ...oldItem);
    // },
  },
  created() {},
  mounted() {
    this.initEcharts();
    // console.log(this.$route);
    const editor = new Wangeditor('.wangeditor');
    editor.config.onCatalogChange = function (arr) {
      // 大纲回调
      const box = document.getElementById('catalogBox');
      box.innerHTML = '';
      let level = 1;
      const levelObj = {
        1: '',
        2: '-',
        3: '--'
      };
      arr.forEach((item, index) => {
        // item 里有 tag:H1,H2,H3,H4,H5, text:标签内文本, id:唯一id
        if (index > 0) {
          // 上一级标签
          const prevLevelTag = arr[index - 1].tag;
          // 当前标签
          const levelTag = arr[index].tag;
          // 替换 H 为空
          const currentTagNum = +levelTag.replace('H', '');
          const prevTagNum = prevLevelTag.replace('H', '');
          if (currentTagNum > prevTagNum) {
            if (currentTagNum <= 3) level += 1;
          }
          if (currentTagNum < prevTagNum) level = 1;
        }
        const p = document.createElement('p');
        const a = document.createElement('a');
        // a.href = 'javascript:void(0)';
        a.innerText = levelObj[level] + item.text;
        a.onclick = function () {
          editor.scrollToHead(item.id);
        };
        p.appendChild(a);
        box.appendChild(p);
      });
    };
    editor.config.placeholder = '自定义 placeholder 提示文字';
    // editor.config.colors = ['#000000', '#eeece0', '#1c487f', '#4d80bf'];
    editor.config.pasteFilterStyle = false;
    // editor.config.uploadImgServer = '/api/upload-img';
    /*
      -------------------
      图片：
        默认图片大小限制5m
        配置图片类型:['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        限制一次最多能传几张图片,默认为 100 张
        timeout 即上传接口等待的最大时间，默认是 10 秒钟
    */
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    // 配置上传参数
    // editor.config.uploadImgParams = {
    //   token: 'xxxxx',
    //   x: 100
    // };
    // // 自定义 header
    // editor.config.uploadImgHeaders = {
    //   Accept: 'text/x-json',
    //   a: 100
    // };
    //  忽略粘贴内容中的图片
    // editor.config.pasteIgnoreImg = false;
    // 隐藏插入网络图片的功能
    editor.config.showLinkImg = false;
    // // 配置alt选项
    // editor.config.showLinkImgAlt = false;
    // // 配置超链接
    // editor.config.showLinkImgHref = false;
    editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // console.log('customUploadImg', resultFiles, insertImgFn);
      Array.from(resultFiles).forEach((file) => {
        // console.log(URL.createObjectURL(file));
        insertImgFn(URL.createObjectURL(file));
      });
    };
    /*
      视频：
        默认制视频大小是 1024m
        限制类型：mp4
        timeout 即上传接口等待的最大时间，默认是 5分钟
    */
    editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      // 上传视频，返回结果，将视频地址插入到编辑器中
      Array.from(resultFiles).forEach((file) => {
        // console.log(URL.createObjectURL(file));
        insertVideoFn(URL.createObjectURL(file));
      });
    };
    // 隐藏插入网络视频的功能
    editor.config.showLinkVideo = false;

    // editor.config.lang = 'en';
    editor.i18next = i18next;
    editor.create();
    // console.log(editor.txt.getJSON());
  }
};
</script>

<style lang="scss" scoped>
.nowColor {
  // color: $--color-primary;
  color: #f1f7ff;
}
#echartsMain {
  width: 600px;
  height: 600px;
}
</style>
