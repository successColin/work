<template>
  <section class="configSidebar">
    <el-button-group class="configSidebar__tab">
      <apiot-button
        class="configSidebar__tab--item"
        :class="[{ active: curType === 1 }]"
        @click="curType = 1"
        >组件库</apiot-button
      >
      <apiot-button
        class="configSidebar__tab--item"
        :class="[{ active: curType === 2 }]"
        @click="curType = 2"
        >配置树</apiot-button
      >
    </el-button-group>
    <div class="configSidebar__wrapper">
      <div class="configSidebar__tabArea" v-show="curType === 1">
        <ul
          class="configSidebar__comp"
          v-for="(group, index) in areaArr"
          :key="index + 1000"
        >
          <li class="configSidebar__comp--group">
            <h1
              class="triangle"
              :class="`${group.isClose ? '' : 'open'}`"
              @click="group.isClose = !group.isClose"
            >
              {{ group.name }}
            </h1>
            <draggable
              v-show="!group.isClose"
              v-model="group.children"
              v-bind="{
                group: { name: 'area', pull: 'clone' },
                sort: false,
              }"
              animation="300"
              dragType="comp"
              @start="dragAreaStart($event, index)"
              @end="dragAreaEnd($event, index, areaArr)"
              :move="dragAreaMove"
            >
              <transition-group class="configSidebar__comp--compList" tag="ul">
                <li
                  class="configSidebar__comp--compItem"
                  :class="[{ btnBox: comp.areaType === 2 }]"
                  v-for="comp in group.children"
                  :key="comp.compType"
                >
                  <img
                    v-if="comp.imgUrl"
                    :src="require(`@/assets/img/menu_images/${comp.imgUrl}`)"
                  />
                  <p>{{ comp.name }}</p>
                </li>
              </transition-group>
            </draggable>
          </li>
        </ul>
        <ul
          class="configSidebar__comp"
          v-for="(group, index) in compArr"
          :key="index"
        >
          <li class="configSidebar__comp--group">
            <h1
              class="triangle"
              :class="`${group.isClose ? '' : 'open'}`"
              @click="group.isClose = !group.isClose"
            >
              {{ group.name }}
            </h1>
            <draggable
              v-show="!group.isClose"
              v-model="group.children"
              v-bind="{
                group: { name: 'comp', pull: 'clone' },
                sort: false,
              }"
              dragType="comp"
              animation="300"
              @start="dragStart($event, index)"
              @end="dragEnd($event, index)"
              :move="dragMove"
            >
              <transition-group class="configSidebar__comp--compList" tag="ul">
                <li
                  class="configSidebar__comp--compItem"
                  :class="[{ btnBox: comp.areaType === 2 }]"
                  v-for="comp in group.children"
                  :key="comp.compType"
                >
                  <img
                    v-if="comp.imgUrl"
                    :src="require(`@/assets/img/menu_images/${comp.imgUrl}`)"
                  />
                  <p>{{ comp.name }}</p>
                </li>
              </transition-group>
            </draggable>
          </li>
        </ul>
        <ul
          class="configSidebar__comp"
          v-for="(group, index) in busiArr"
          :key="index + 2000"
        >
          <li class="configSidebar__comp--group">
            <h1
              class="triangle"
              :class="`${group.isClose ? '' : 'open'}`"
              @click="group.isClose = !group.isClose"
            >
              {{ group.name }}
            </h1>
            <draggable
              v-show="!group.isClose"
              v-model="group.children"
              v-bind="{
                group: { name: 'area', pull: 'clone' },
                sort: false,
              }"
              animation="300"
              dragType="comp"
              @start="dragAreaStart($event, index)"
              @end="dragAreaEnd($event, index, busiArr)"
              :move="dragAreaMove"
            >
              <transition-group class="configSidebar__comp--compList" tag="ul">
                <li
                  class="configSidebar__comp--compItem"
                  :class="[{ btnBox: comp.areaType === 2 }]"
                  v-for="comp in group.children"
                  :key="comp.compType"
                >
                  <img
                    v-if="comp.imgUrl"
                    :src="require(`@/assets/img/menu_images/${comp.imgUrl}`)"
                  />
                  <p>{{ comp.name }}</p>
                </li>
              </transition-group>
            </draggable>
          </li>
        </ul>
      </div>
      <div class="configSidebar__tabArea" v-show="curType === 2">
        <el-tree
          v-if="showTree"
          ref="configTree"
          :data="configData"
          node-key="compId"
          class="configSidebar__tree"
          default-expand-all
          @node-click="nodeClick"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
        >
          <div
            slot-scope="{ data, node }"
            :key="data.compId || data.name"
            class="configSidebar__treeItem"
          >
            <img
              v-if="data.compType"
              :src="require(`@/assets/img/menu_images/${data.imgUrl}`)"
            />
            {{ getTreeName(data, node) }}
          </div>
        </el-tree>
      </div>
    </div>
  </section>
</template>

<script>
import { createUnique } from '@/utils/utils';
import {
  TextCom,
  SelectCom,
  DataOneBoxCom,
  DataMultiBoxCom,
  DateTimeCom,
  ButtonCom,
  dateBox
} from './comParams';

export default {
  props: {
    configData: {
      type: Array
    },
    activeObj: {
      type: Object
    }
  },
  data() {
    return {
      curType: 1,
      areaArr: [
        {
          name: '区域组件',
          isClose: false,
          children: [
            {
              name: '表单',
              compType: 1000,
              propertyCompName: 'MenuMainConfig',
              imgUrl: 'areaComp/MenuMain.svg',
              compId: createUnique(),
              compName: 'MenuMain',
              pageType: 1,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              layoutStyle: 1, // 1 是上下布局 2是左右布局
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: false // 是否是树区
            },
            {
              name: '表格',
              compType: 1001,
              propertyCompName: 'TableMainConfig',
              imgUrl: 'areaComp/TableMain.svg',
              compId: createUnique(),
              compName: 'TableMain',
              pageType: 1,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: false, // 是否是树区
              personalConfig: false, // 是否启用个性化配置
              required: false, // 是否必填
              showNum: true, // 是否显示序号
              selectType: 1, // 多选类型 0 无 1 是多选 2是单选
              canOperate: false, // 是否启用操作列
              operateName: '操作', // 操作列名称
              operateWidth: '0.2', // 操作列宽度
              showLine: 5, // 显示行数
              lineEditable: false, // 是否启用行编辑
              fixedLeft: 0, // 左侧固定列
              fixedRight: 0, // 右侧固定列
              hasPagination: true, // 是否启用分页
              rowNum: 10, // 分页条数
              sortArr: [], // 排序数组
              sortStr: '' // 排序字符串
            },
            {
              name: '卡片',
              compType: 1002,
              propertyCompName: 'CardMainConfig',
              imgUrl: 'areaComp/CardMain.svg',
              compId: createUnique(),
              compName: 'CardMain',
              pageType: 1,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              canOperate: false, // 是否启用操作列
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: false, // 是否是树区
              hasPagination: true, // 是否启用分页
              rowNum: 10, // 分页条数
              sortArr: [], // 排序数组
              sortStr: '', // 排序字符串
              relateType: 1, // 弹窗类型 1是面板 2是菜单
              dialogName: 'PanelDialog', // 弹窗风格
              dialogTitle: '', // 弹窗名称
              hasCardIcon: false, // 是否有卡片图标
              iconFrom: 1, // 图标来源
              iconId: '', // 卡片图标来源的组件id
              iconColorId: '', // 卡片图标颜色来源的组件id,
              iconColumn: {
                columnName: '',
                id: '',
                columnTypeDict: 0,
                compId: ''
              }, // 字段图标来源
              heightMul: 1 // 高度倍数
            },
            {
              name: '配置树',
              compType: 1003,
              propertyCompName: 'TreeMainConfig',
              imgUrl: 'areaComp/TreeMain.svg',
              compId: createUnique(),
              compName: 'TreeMain',
              pageType: 2,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: true, // 是否是树区
              hasTreeIcon: false, // 是否有树区固定图标
              treeIcon: {
                icon: '',
                color: '',
                imageUrl: ''
              }, // 树的固定图标
              linkSymbol: '', // 链接符
              hasCardIcon: false, // 是否启用组件字典图标
              iconId: '', // 组件字典图标来源的组件id
              iconColorId: '' // 组件字典图标颜色来源的组件id
            },
            {
              name: '多表树',
              compType: 1007,
              propertyCompName: 'MultiTreeConfig',
              imgUrl: 'areaComp/MultiTableTreeMain.svg',
              compId: createUnique(),
              compName: 'MultiTree',
              pageType: 2,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              // cascadeDataSource: [
              //   {
              //     relateColumn: {
              //       id: '',
              //       columnName: ''
              //     },
              //     tableInfo: {
              //       id: '',
              //       tableName: ''
              //     },
              //     showColumn: {
              //       id: '',
              //       columnName: ''
              //     }
              //   }
              // ],
              multiDataSource: [
                {
                  name: '一级表',
                  treeIcon: {
                    icon: '',
                    color: '',
                    imageUrl: ''
                  },
                  hasCardIcon: false, // 是否启用组件字典图标
                  iconId: '', // 组件字典图标来源的组件id
                  iconColorId: '', // 组件字典图标颜色来源的组件id
                  tableInfo: {
                    id: '',
                    tableName: ''
                  },
                  lastLevelColumn: {
                    id: '',
                    columnName: ''
                  },
                  selfLevelColumn: {
                    id: '',
                    columnName: '',
                    start: 0,
                    startId: ''
                  },
                  filterTermType: 1, // 1 是普通 2是sql
                  filterTermStr: '', // 普通字符串
                  filterTermSql: '', // sql字符串
                  termParams: '' // 过滤条件需要的组件参数id
                },
                {
                  name: '二级表',
                  treeIcon: {
                    icon: '',
                    color: '',
                    imageUrl: ''
                  },
                  hasCardIcon: false, // 是否启用组件字典图标
                  iconId: '', // 组件字典图标来源的组件id
                  iconColorId: '', // 组件字典图标颜色来源的组件id
                  tableInfo: {
                    id: '',
                    tableName: ''
                  },
                  lastLevelColumn: {
                    id: '',
                    columnName: '',
                    columnTypeDict: ''
                  },
                  selfLevelColumn: {
                    id: '',
                    columnName: '',
                    columnTypeDict: '',
                    start: 0,
                    startId: ''
                  },
                  filterTermType: 1, // 1 是普通 2是sql
                  filterTermStr: '', // 普通字符串
                  filterTermSql: '', // sql字符串
                  termParams: '' // 过滤条件需要的组件参数id
                }
              ], // 数据多选框数据源
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: true, // 是否是树区
              hasTreeIcon: false, // 是否有树区固定图标
              treeIcon: {
                icon: '',
                color: '',
                imageUrl: ''
              }, // 树的固定图标
              linkSymbol: '', // 链接符
              hasCardIcon: false, // 是否启用组件字典图标
              iconId: '', // 组件字典图标来源的组件id
              iconColorId: '' // 组件字典图标颜色来源的组件id
            },
            // 查询区
            {
              name: '查询区',
              compType: 1008,
              propertyCompName: 'QueryMainConfig',
              imgUrl: 'areaComp/QueryMain.svg',
              compId: createUnique(),
              compName: 'QueryMain',
              pageType: 1,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              layoutStyle: 1, // 1 是上下布局 2是左右布局
              displayStyle: 1, // 1 默认样式 2是间隔样式
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              reloadArea: [], // 要刷新的区域
              isTree: false // 是否是树区
            },
            // 树表区
            {
              name: '树表',
              compType: 1009,
              propertyCompName: 'TreeTableConfig',
              imgUrl: 'areaComp/TableMain.svg',
              compId: createUnique(),
              compName: 'TreeTable',
              pageType: 1,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: '',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: false, // 是否是树区
              required: false, // 是否必填
              showNum: true, // 是否显示序号
              selectType: 1, // 多选类型 0 无 1 是多选 2是单选
              canOperate: false, // 是否启用操作列
              operateName: '操作', // 操作列名称
              operateWidth: '0.2', // 操作列宽度
              showLine: 5, // 显示行数
              lineEditable: false, // 是否启用行编辑
              fixedLeft: 0, // 左侧固定列
              fixedRight: 0, // 右侧固定列
              hasPagination: false, // 是否启用分页
              rowNum: 10, // 分页条数
              sortArr: [], // 排序数组
              sortStr: '' // 排序字符串
            }
          ]
        }
      ],
      compArr: [
        {
          name: '基础组件',
          isClose: false,
          children: [
            TextCom, // 单行文本
            SelectCom,
            {
              name: '单选框',
              areaType: 1, // 表示内容区
              dragTable: true, // 能否拖入表格区
              imgUrl: 'baseComp/SingleBox.svg',
              compType: 3,
              compId: createUnique(),
              compName: 'SingleBox',
              tableCompName: 'TableSingleCol',
              propertyCompName: 'SingleBoxConfig',
              labelName: '单选框',
              helpInfo: '', // 帮助信息
              anyway: 1, // 1 是横向排列 2 是纵向排列
              dataSource: {
                relateName: '主表', // 关系名称
                tableName: '', //  表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 别名
                dictObj: null // 字典表数据
              },
              sort: 1, // 1 升序 2 降序
              effectDict: [], // 字典生效值
              dropDownStyle: 1, // 1 普通风格 2 背景展示风格 3 个性图标风格
              enableTableSearch: false, // 是否启用表头搜索
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '50%',
              tableWidth: '0.1',
              shouldRequired: false,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '多选框',
              areaType: 1, // 表示内容区
              dragTable: true, // 能否拖入表格区
              imgUrl: 'baseComp/MultiBox.svg',
              compType: 4,
              compId: createUnique(),
              compName: 'MultiBox',
              tableCompName: 'TableMultiCol',
              propertyCompName: 'MultiBoxConfig',
              labelName: '多选框',
              helpInfo: '', // 帮助信息
              anyway: 1, // 1 是横向排列 2 是纵向排列
              dataSource: {
                relateName: '主表', // 关系名称
                tableName: '', //  表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 别名
                dictObj: null // 字典表数据
              },
              sort: 1, // 1 升序 2 降序
              effectDict: [], // 字典生效值
              dropDownStyle: 1, // 1 普通风格 2 背景展示风格 3 个性图标风格
              enableTableSearch: false, // 是否启用表头搜索
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '50%',
              tableWidth: '0.1',
              shouldRequired: false,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            ButtonCom,
            DataOneBoxCom,
            DataMultiBoxCom,
            dateBox,
            DateTimeCom,
            {
              name: '数值框',
              areaType: 1, // 表示内容区
              dragTable: true, // 能否拖入表格区
              imgUrl: 'baseComp/NumberBox.svg',
              compType: 10,
              compId: createUnique(),
              compName: 'NumberBox',
              tableCompName: 'TableNumberCol',
              propertyCompName: 'NumberBoxConfig',
              labelName: '数值',
              numberType: 1, // 1 是整数型 2 是浮点型
              decorateType: 1, // 1 是前缀 2是后缀
              decorateContent: '', // 修饰内容
              thousandSign: false, // 是否显示千分位
              decimalPlaces: 1, // 小数点位数
              maxPlace: 4, // 最大小数位数
              placeholder: '请输入数值',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              enableTableSearch: false, // 是否启用表头搜索
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '50%',
              tableWidth: '0.1',
              shouldRequired: false,
              minNumber: '', // 最大数值
              maxNumber: '', // 最小数值
              minNumberObj: {
                enable: false, // 是否启用
                type: 1, // 1 是固定值 2 是公式
                value: '', // 固定值的值
                formula: '' // 公式的值
              },
              maxNumberObj: {
                enable: false, // 是否启用
                type: 1, // 1 是固定值 2 是公式
                value: '', // 固定值的值
                formula: '' // 公式的值
              },
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '多行文本',
              areaType: 1, // 表示内容区
              imgUrl: 'baseComp/MultiLineText.svg',
              compType: 11,
              compId: createUnique(),
              compName: 'MultiLineText',
              propertyCompName: 'MultiLineTextConfig',
              labelName: '多行文本',
              placeholder: '请输入多行文本',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              tableWidth: '0.1',
              shouldRequired: false,
              maxlength: 1000, // 最大长度
              maxRow: 3, // 最大行数
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: 'label控件',
              areaType: 1, // 表示内容区
              dragTable: true,
              dragCard: true, // 能否拖入卡片区
              dragTree: true, // 能否拖入卡片区
              imgUrl: 'baseComp/Label.svg',
              compType: 15,
              compId: createUnique(),
              compName: 'Label',
              tableCompName: 'TableLabelCol',
              propertyCompName: 'LabelConfig',
              labelName: 'label',
              labelShowStyle: 1, // label 展示风格
              waterColor: '#333', // 小水滴颜色
              dropDownType: 15,
              placeholder: '请选择数据',
              showLabelTitle: true, // 是否显示label的标题
              helpInfo: '', // 帮助信息
              enableMultiColumn: false, // 是否多选字段
              labelNotChange: false, // label 不可更改
              enableDict: false, // 是否字典值
              enableCascade: false, // 是否是级联组件
              dataSource: {
                relateName: '', // 关系名称
                tableName: '', //  表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 别名
                dictObj: null, // 字典表数据
                mainColumnInfo: null // 主表相关信息
              },
              timeShowType: 1, // 1 是日期 2是日期时间
              numberShowType: 1, // 1 是普通 2是千分位
              multiTable: {
                table: {
                  tableName: '',
                  alias: '',
                  id: ''
                },
                column: {
                  columnName: '',
                  id: '',
                  columnTypeDict: 0
                }
              },
              enableTableSearch: false, // 是否启用表头搜索
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '50%',
              tableWidth: '0.1',
              alignStyle: 1, // 1 是左对齐 2右对齐
              font: {
                color: '#333333', // 字体颜色
                size: 13, // 字体大小
                style: 1 // 1 常规 2 加粗
              }, // 字体大小
              labelBg: {
                color: '#ffffff', // 背景颜色
                style: 0 // 0 无 1 方角 2 圆角
              }, // label 背景色
              enableIcon: false, // 是否允许label图标
              enableDictIcon: false, // 是否允许字典图标
              showTreeText: true, // 树节点上展示内容
              icon: {
                icon: '',
                color: '',
                imageUrl: ''
              }, // label 图标
              relateType: 1, // 弹窗类型 1是面板 2是菜单 3是外部地址
              dialogName: 'PanelDialog', // 弹窗风格
              dialogTitle: '', // 弹窗标题
              shouldRequired: false,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '搜索框',
              canSearch: true,
              areaType: 2, // 表示在按钮区
              dragCard: true,
              imgUrl: 'baseComp/SearchCondition.svg',
              compType: 16,
              compId: createUnique(),
              compName: 'SearchCondition',
              propertyCompName: 'SearchConditionConfig',
              placeholder: '请输入关键字搜索',
              searchCompArr: [], // 普通搜索的组件数组
              enableScan: false, // 是否启用扫描
              shouldHigh: false, // 是否启用高级搜索
              highStyle: 2, // 高级搜索按钮类型
              highCompArr: [], // 高级搜索包含组件类型
              hisSearch: false, // 是否启用高级历史搜索
              canShow: true,
              canReadonly: false
            },
            {
              name: '编码',
              areaType: 1, // 表示内容区
              imgUrl: 'baseComp/Coding.svg',
              compType: 17,
              compId: createUnique(),
              compName: 'Coding',
              propertyCompName: 'CodingConfig',
              labelName: '编码',
              placeholder: '自动生成',
              helpInfo: '',
              dataSource: {
                relateName: '主表', // 关系名称
                tableName: '', // 表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 表别名
                dictObj: null // 字典表数据
              }, // 数据源
              singleStatus: 2, // 组件状态
              canShow: true,
              canReadonly: false,
              width: '50%',
              shouldRequired: false, // 是否必填
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '分割线',
              showLabelTitle: true, // 是否显示分割线的标题
              areaType: 1,
              imgUrl: 'baseComp/DividingLine.svg',
              compType: 18,
              compId: createUnique(),
              compName: 'DividingLine',
              propertyCompName: 'DividingLineConfig',
              placeholder: '',
              helpInfo: '',
              width: '100%',
              dividingType: 1, // 分割线显示类型
              canShow: true,
              canReadonly: false
            },
            {
              name: '文本提示',
              areaType: 1, // 表示内容区
              dragTable: false,
              dragCard: false, // 能否拖入卡片区
              dragTree: false, // 能否拖入卡片区
              imgUrl: 'baseComp/TextTip.svg',
              compType: 20,
              compId: createUnique(),
              compName: 'TextTip',
              // tableCompName: 'TableLabelCol',
              propertyCompName: 'TextTipConfig',
              labelName: 'text',
              showLabelTitle: true, // 是否显示label的标题
              defaultValueType: 1, // 1 是固定值 2 是公式
              fixedContent: '', // 固定值字符串
              formulaContent: '', // 公式字符串
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              titleFont: {
                color: '#333333', // 字体颜色
                size: 16, // 字体大小
                style: 2 // 1 常规 2 加粗
              }, // 字体大小
              font: {
                color: '#808080', // 字体颜色
                size: 13, // 字体大小
                style: 1 // 1 常规 2 加粗
              }, // 字体大小
              labelBg: {
                color: '#F6F6F8', // 背景颜色
                style: 1 // 0 无 1 方角 2 圆角
              }, // label 背景色
              enableIcon: false, // 是否允许label图标
              icon: {
                icon: '',
                color: '',
                imageUrl: ''
              }, // label 图标
              shouldRequired: false,
              submitType: 3 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '富文本',
              areaType: 1, // 表示内容区
              dragTable: false,
              dragCard: false, // 能否拖入卡片区
              dragTree: false, // 能否拖入卡片区
              imgUrl: 'baseComp/RichText.svg',
              compType: 21,
              compId: createUnique(),
              compName: 'RichText',
              // tableCompName: 'TableLabelCol',
              propertyCompName: 'RichTextConfig',
              labelName: '富文本',
              placeholder: '请输入富文本',
              helpInfo: '', // 帮助信息
              sizeType: 1, // 尺寸类型
              heightMul: 3, // 高度倍数 1,2,3
              widthPix: 200, // 宽度pix
              heightPix: 200, // 高度pix
              dataSource: {
                relateName: '', // 关系名称
                tableName: '', //  表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 别名
                dictObj: null, // 字典表数据
                mainColumnInfo: null // 主表相关信息
              },
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              enableEmoji: true, // 是否启用表情包
              enableImg: true, // 是否启用图片上传
              enableVedio: true, // 是否启用视频上传
              enableLink: true, // 是否启用外部链接
              enableGird: true, // 是否启用表格
              shouldRequired: false,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '评分',
              showLabelTitle: true, // 是否显示分割线的标题
              dragTable: true,
              dragCard: true, // 能否拖入卡片区
              areaType: 1,
              imgUrl: 'baseComp/Evaluation.svg',
              compType: 23,
              compId: createUnique(),
              compName: 'Evaluation',
              tableCompName: 'TableEvaluationCol',
              propertyCompName: 'EvaluationConfig',
              placeholder: '',
              helpInfo: '',
              dataSource: {
                relateName: '', // 关系名称
                tableName: '', //  表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 别名
                dictObj: null, // 字典表数据
                mainColumnInfo: null // 主表相关信息
              },
              tableWidth: '0.1',
              width: '50%',
              maxScore: 5, // 最大打分分值
              showContent: false, // 是否展示内容
              dividingType: 1, // 分割线显示类型
              canShow: true,
              canReadonly: false,
              submitType: 1
            }
          ]
        },
        {
          name: '高级组件',
          isClose: false,
          children: [
            {
              name: '图片',
              showLabelTitle: true, // 是否显示图片的标题
              areaType: 1, // 表示内容区
              imgUrl: 'highComp/Image.svg',
              compType: 12,
              compId: createUnique(),
              compName: 'ImgAndVideo',
              propertyCompName: 'ImgAndVideoConfig',
              labelName: '图片',
              placeholder: '请上传图片',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              showType: 1, // 1 大图 2 小图
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              shouldRequired: false,
              maxFileCount: 0, // 最大文件个数
              maxFileSize: 200, // 单个文件最大体积
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '视频',
              showLabelTitle: true, // 是否显示视屏的标题
              areaType: 1, // 表示内容区
              imgUrl: 'highComp/Video.svg',
              compType: 24,
              compId: createUnique(),
              compName: 'ImgAndVideo',
              propertyCompName: 'ImgAndVideoConfig',
              labelName: '视频',
              placeholder: '请上传视频',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              showType: 1, // 1 大图 2 小图
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              shouldRequired: false,
              maxFileCount: 5, // 最大文件个数
              maxFileSize: 200, // 单个文件最大体积
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '附件',
              showLabelTitle: true, // 是否显示附件的标题
              areaType: 1, // 表示内容区
              imgUrl: 'highComp/Enclosure.svg',
              compType: 13,
              compId: createUnique(),
              compName: 'Enclosure',
              propertyCompName: 'EnclosureConfig',
              labelName: '附件',
              placeholder: '请上传附件',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              shouldRequired: false,
              maxFileCount: 5,
              maxFileSize: 200,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: '证件',
              showLabelTitle: true, // 是否显示证件的标题
              areaType: 1, // 表示内容区
              imgUrl: 'highComp/PapersUpload.svg',
              compType: 14,
              compId: createUnique(),
              compName: 'PapersUpload',
              propertyCompName: 'PapersUploadConfig',
              labelName: '证件',
              placeholder: '请上传证件',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '100%',
              shouldRequired: false,
              maxFileCount: 2,
              tipsArr: [],
              maxFileSize: 50,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            },
            {
              name: 'Webview',
              showLabelTitle: true, // 是否显示分割线的标题
              areaType: 1,
              imgUrl: 'highComp/Webview.svg',
              compType: 19,
              compId: createUnique(),
              compName: 'Webview',
              propertyCompName: 'WebviewConfig',
              placeholder: '',
              helpInfo: '',
              sizeType: 1, // 尺寸类型
              width: '100%',
              heightMul: 3, // 高度倍数 1,2,3
              widthPix: 200, // 宽度pix
              heightPix: 200, // 高度pix
              showType: 1, // 1 内部页面 2外部页面
              externalType: 1, // 1 默认 2ureport
              ureportObj: {
                name: ''
              },
              innerName: '', // 内部页面名称
              innerLink: '', // 内部页面地址
              outerLink: '', // 外部页面地址
              paramsArr: [], // 传入参数
              canShow: true,
              canReadonly: false
            },
            {
              name: '进度条',
              showLabelTitle: true, // 是否显示分割线的标题
              areaType: 1,
              dragTable: true, // 能否拖入表格区
              dragCard: true, // 能否拖入卡片区
              imgUrl: 'highComp/ProgressBar.svg',
              compType: 22,
              compId: createUnique(),
              compName: 'DeployProgressBar',
              propertyCompName: 'DeployProgressBarConfig',
              tableCompName: 'TableProgressBarCol',
              tableWidth: '0.1',
              placeholder: '',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              canShow: true,
              canReadonly: false,
              width: '100%',
              shouldRequired: false,
              progressBarHeight: 8,
              font: {
                color: '#333333', // 字体颜色
                size: 13, // 字体大小
                style: 1 // 1 常规 2 加粗
              }, // 字体大小
              colors: {
                color1: '#E74D4D',
                color2: '#FB6F5C',
                color3: '#EC6434',
                color4: '#FD922B',
                color5: '#F2A917',
                color6: '#F5DC00',
                color7: '#34C7BE',
                color8: '#32D0F5'
              },
              ranges: [
                {
                  color1: '#E74D4D',
                  color2: '#FB6F5C',
                  range: 100
                }
              ],
              showStyle: 1, // 1 线条风格 2 格子风格
              submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
              progressShowType: 1 // 1 始终显示 2 鼠标悬停显示
            },
            {
              name: '级联',
              areaType: 1, // 表示内容区
              imgUrl: 'highComp/PapersUpload.svg',
              compType: 25,
              compId: createUnique(),
              compName: 'Cascade',
              propertyCompName: 'CascadeConfig',
              labelName: '级联',
              placeholder: '请选择数据',
              helpInfo: '',
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              singleStatus: 1,
              canShow: true,
              canReadonly: false,
              width: '50%',
              shouldRequired: false,
              submitType: 1, // 1 始终提交 2 仅显示时提交 3 始终不提交
              cascadeType: 1, // 级联类型 1 自定义 2 省市区
              cascadeDataSource: [
                {
                  name: '1级表',
                  relateColumn: {
                    id: '',
                    columnName: ''
                  },
                  tableInfo: {
                    id: '',
                    tableName: ''
                  },
                  showColumn: {
                    id: '',
                    columnName: ''
                  }
                },
                {
                  name: '2级表',
                  relateColumn: {
                    id: '',
                    columnName: ''
                  },
                  tableInfo: {
                    id: '',
                    tableName: ''
                  },
                  showColumn: {
                    id: '',
                    columnName: ''
                  }
                }
              ], // 级联数据源
              loadType: 1, // 下级加载方式 1 悬浮加载 2 点击加载
              storeType: 1, // 存储方式 1 多级拼接类型 2 仅末尾级字段
              enableSearch: false // 是否启用搜索
            },
            {
              name: '轮播图',
              areaType: 1,
              imgUrl: 'baseComp/DividingLine.svg',
              compType: 26,
              compId: createUnique(),
              compName: 'Carousel',
              propertyCompName: 'CarouselConfig',
              placeholder: '',
              helpInfo: '',
              width: '100%',
              heightMul: 2, // 高度倍数 1,2,3
              showType: 1, // 展现形式
              borderType: 1, // 边框样式
              indicatorType: 1, // 指示器样式
              imgArr: [], // 图片数组
              canShow: true,
              canReadonly: false
            },
            {
              name: '步骤条',
              areaType: 1,
              imgUrl: 'baseComp/DividingLine.svg',
              compType: 27,
              compId: createUnique(),
              compName: 'Steps',
              propertyCompName: 'StepsConfig',
              placeholder: '',
              helpInfo: '',
              width: '100%',
              canShow: true,
              canReadonly: false,
              dataSource: {
                relateName: '主表',
                tableName: '',
                columnName: '',
                columnTypeDict: 0,
                id: 0,
                alias: '',
                dictObj: null // 字典表数据
              },
              multiTable: {
                table: {
                  tableName: '',
                  alias: '',
                  id: ''
                },
                column: {
                  columnName: '',
                  id: '',
                  columnTypeDict: 0
                }
              }, // 数据表
              dataFrom: 1, // 数据来源
              relateDateId: '', // 关联组件id
              stepsArr: [] // 步骤集合数组
            }
          ]
        },
        {
          name: '查询组件',
          isClose: false,
          children: [
            {
              ...TextCom,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              canQuery: true
            },
            {
              ...SelectCom,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              canQuery: true
            },
            {
              ...DataOneBoxCom,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              canQuery: true
            },
            {
              ...DataMultiBoxCom,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              canQuery: true
            },
            {
              ...DateTimeCom,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              canQuery: true,
              timeInterval: true // 是否选择区间
            },
            {
              ...dateBox,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              canQuery: true
            },
            {
              ...ButtonCom,
              dragQuery: true, // 是否允许拖入查询区
              noDragForm: true, // 不能拖入表单区
              buttonType: 11, // 类型
              canQuery: true
            }
          ]
        },
        {
          name: '业务组件',
          isClose: false,
          children: [
            {
              name: '用户组件',
              dragCard: true,
              dragTable: true,
              showLabelTitle: true, // 是否显示分割线的标题
              areaType: 1,
              imgUrl: 'highComp/Webview.svg',
              compType: 28,
              compId: createUnique(),
              compName: 'UserComp',
              tableCompName: 'TableUserCompCol',
              propertyCompName: 'UserCompConfig',
              placeholder: '请输入用户',
              helpInfo: '',
              width: '100%',
              tableWidth: '0.1',
              singleStatus: 1,
              dropDownType: 2,
              dataSource: {
                relateName: '主表', // 关系名称
                tableName: '', //  表名
                columnName: '', // 字段名称
                columnTypeDict: 0, // 字段类型
                id: 0, // 字段id
                alias: '', // 别名
                dictObj: null // 字典表数据
              },
              multiTable: {
                table: {
                  tableName: 'sys_user',
                  alias: '',
                  id: ''
                },
                column: {
                  columnName: 'username',
                  id: '',
                  columnTypeDict: 2
                }
              }, // 多选字段来源
              enableTableSearch: false,
              shouldSearch: true, // 是否搜索
              shouldFav: true, // 是否启用收藏
              shouldInRole: true, // 是否启用按角色选择
              shouldInOrg: true, // 是否启用按组织选择
              shouldInPost: true, // 是否启用按职位选择
              canShow: true,
              canReadonly: false,
              shouldRequired: false,
              submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
            }
          ]
        }
      ],
      busiArr: [
        {
          name: '业务区域组件',
          isClose: false,
          children: [
            {
              name: '设备位置树',
              compType: 1004,
              propertyCompName: 'DevicePosTreeConfig',
              imgUrl: 'busiComp/DevicePosTree.svg',
              compId: createUnique(),
              compName: 'DevicePosTree',
              pageType: 2,
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: 'sys_device',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              positionFilter: {
                tableInfo: {
                  tableName: 'sys_position',
                  id: 0,
                  nameAlias: ''
                },
                filterTermType: 1, // 1 是普通 2是sql
                filterTermStr: '', // 普通字符串
                filterTermSql: '', // sql字符串
                termParams: '' // 过滤条件需要的组件参数id
              },
              deviceFilter: {
                tableInfo: {
                  tableName: 'sys_device',
                  id: 0,
                  nameAlias: ''
                },
                filterTermType: 1, // 1 是普通 2是sql
                filterTermStr: '', // 普通字符串
                filterTermSql: '', // sql字符串
                termParams: '' // 过滤条件需要的组件参数id
              },
              posAddPos: '', // 位置节点新增位子id
              posAddDevice: '', // 位置节点新增设备id
              deviceAddDevice: '', // 设备节点新增设备id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: true, // 是否是树区
              linkSymbol: '', // 链接符`
              showAdd: false, // 是否可以新增
              showDel: false, // 是否可以删除
              showTransfer: false // 是否可以移动
            },
            {
              name: '故障树',
              compType: 1005,
              propertyCompName: 'FaultTreeConfig', // 组件配置渲染名称
              imgUrl: 'busiComp/faultTree.svg', // 组件拖拽图标
              compId: createUnique(), // 组件id
              compName: 'FaultTree', // 真实页面组件渲染名称
              pageType: 2, // 1-新增，2-编辑，3-查看
              shouldTab: true,
              areaType: 1,
              showTitle: false, // 显示标题
              canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
              tableInfo: {
                tableName: 'device',
                id: 0,
                nameAlias: ''
              },
              relateTableArr: [],
              relateTableIndex: 0,
              children: [],
              filterTermType: 1, // 1 是普通 2是sql
              filterTermStr: '', // 普通字符串
              filterTermSql: '', // sql字符串
              termParams: '', // 过滤条件需要的组件参数id
              shouldInit: true, // 是否初始化
              needPermissions: true,
              reloadArea: [], // 要刷新的区域
              isTree: true, // 是否是树区
              linkSymbol: '' // 链接符
            },
            {
              name: '关联资料',
              compType: 1006,
              propertyCompName: 'RelatedDataConfig', // 组件配置渲染名称
              imgUrl: 'busiComp/RelatedData.svg', // 组件拖拽图标
              compId: createUnique(), // 组件id
              compName: 'RelatedData', // 真实页面组件渲染名称
              isTree: false,
              canChangeName: false, // 标记名字是否可以变更，用于组件树上名字的替换
              showSearch: true, // 是否显示搜索
              showRelateBtn: true, // 是否显示关联知识库
              showUploadBtn: true, // 是否显示上传本地文件
              showNewBtn: true, // 是否显示新建文件夹,
              relateDataComp: {
                compId: '',
                compPath: '',
                compType: '',
                tableName: ''
              }, // 关联资料的id组件
              relateBusiComp: {
                compId: '',
                compPath: '',
                compType: '',
                tableName: ''
              }, // 关联业务的id组件
              showType: 1, // 1 列表加宫格 2 列表 3 宫格,
              children: [],
              tableColumn: [
                {
                  column: 'RelateName',
                  show: true
                },
                {
                  column: 'RelateUserName',
                  show: true
                },
                {
                  column: 'RelateCreateTime',
                  show: true
                },

                {
                  column: 'RelateModifyTime',
                  show: true
                },
                {
                  column: 'RelateSize',
                  show: true
                },
                {
                  column: 'RelateType',
                  show: true
                }
              ], // 表格列控制
              showReplaceBtn: true, // 是否允许替换新版本
              showDeleteBtn: true, // 是否允许删除
              showPreview: true, // 是否允许预览
              showDownload: true // 是否允许下载
            }
          ]
        }
      ],
      showTree: true,
      btnAreaIds: [2]
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    nodeClick(data, v1) {
      // console.log(data);
      if (!data.compId) {
        v1.parent.data.areaType = data.areaType;
        data = v1.parent.data;

        if (v1.parent.parent.data.curCompId) {
          v1.parent.parent.data.curCompId = data.compId;
        }
      } else if (v1.parent.data.curCompId) {
        v1.parent.data.curCompId = data.compId;
      }
      if (data.compId) {
        window.location.hash = `#${data.compId}`;
      }
      if (
        (data.dataSource && data.dataSource.columnName === 'id') ||
        data.tableCompName === 'OperateCol'
      ) {
        return;
      }
      this.$bus.$emit('changeCurActiveObj', data);
      // this.$emit('update:activeObj', data);
    },
    filterNode(value, data, node) {
      const tempNode = this.findNode(node);
      if (tempNode && tempNode.parent.data.showTab === false) {
        if (
          tempNode.parent.data.curCompId &&
          tempNode.data.compId &&
          tempNode.parent.data.curCompId === tempNode.data.compId
        ) {
          return true;
        }
        return false;
      }

      return true;
    },
    findNode(node) {
      let tempNode = null;
      while (node.parent && !tempNode) {
        if (node.parent.data.showTab === false) {
          tempNode = node;
          break;
        }
        node = node.parent;
      }
      return tempNode;
    },
    getTreeName(data, node) {
      if (
        node.parent.data.curCompId &&
        data.compId &&
        node.parent.data.showTab === false &&
        node.parent.data.curCompId === data.compId
      ) {
        return `${data.name}(隐藏)`;
      }
      if (data.dataSource && data.dataSource.relateName) {
        return `${data.name}(${data.dataSource.relateName})`;
      }
      return data.name;
    },
    dragStart() {
      // console.log(11111);
    },
    dragMove(e) {
      // console.log(22222, e);
      const relateElement = e.relatedContext.element;
      const dragElement = e.draggedContext.element;
      const { component } = e.relatedContext;
      if (component.$attrs.dragType === 'comp') {
        return false;
      }
      // console.log(component, dragElement, relateElement);
      // 能否拖入表单去
      if (component.$attrs.isForm) {
        if (dragElement.noDragForm) {
          return false;
        }
        return true;
      }
      // 能否拖入查询区
      if (component.$attrs.isQuery) {
        if (dragElement.dragQuery) {
          return true;
        }
        return false;
      }
      // 能否拖入搜索框
      if (dragElement.canSearch) {
        if (component.$attrs.canSearch) {
          if (relateElement) {
            if (relateElement.areaType !== dragElement.areaType) {
              return false;
            }
          } else if (component.$attrs.areaType !== dragElement.areaType) {
            return false;
          }
          return true;
        }
        return false;
      }
      // 能否拖入卡片区
      if (component.$attrs.isCard) {
        if (dragElement.dragCard) {
          if (relateElement) {
            if (relateElement.areaType !== dragElement.areaType) {
              return false;
            }
          } else if (component.$attrs.areaType !== dragElement.areaType) {
            return false;
          }
          return true;
        }
        return false;
      }
      // 能否拖入树区
      if (component.$attrs.isTree) {
        if (dragElement.dragTree) {
          if (relateElement) {
            if (relateElement.areaType !== dragElement.areaType) {
              return false;
            }
          } else if (component.$attrs.areaType !== dragElement.areaType) {
            return false;
          }
          return true;
        }
        return false;
      }
      // 能否拖入表格区
      if (component.$attrs.isTable) {
        if (dragElement.dragTable) {
          if (relateElement) {
            if (relateElement.areaType !== dragElement.areaType) {
              return false;
            }
          } else if (component.$attrs.areaType !== dragElement.areaType) {
            return false;
          }
          return true;
        }
        return false;
      }
      // 侧边栏按钮区最多拖动2个
      // if (
      //   component &&
      //   component.$attrs.areaType === 3 &&
      //   component.$attrs.isSidebar &&
      //   component.$attrs.length >= 3
      // ) {
      //   return false;
      // }
      if (relateElement) {
        if (relateElement.areaType !== dragElement.areaType) {
          return false;
        }
      } else if (component.$attrs.areaType !== dragElement.areaType) {
        return false;
      }
    },
    dragEnd(e, index) {
      this.compArr[index].children[e.oldDraggableIndex].compId = createUnique();
    },
    dragAreaStart() {
      // console.log(11111);
    },
    dragAreaMove(e) {
      const relateElement = e.relatedContext.element;
      const dragElement = e.draggedContext.element;
      const { component } = e.relatedContext;
      if (component.$attrs.dragType === 'comp') {
        return false;
      }
      if (this.$route.query.isApp !== '1') {
        // pc 端
        if (!component.$attrs.isSidebar) {
          // 不是侧边 不是表单 不是表格 不是树表 不允许拖进
          if (![1000, 1001, 1006, 1008, 1009].includes(dragElement.compType)) {
            return false;
          }
        } else {
          if (![1002, 1003, 1004, 1005, 1007].includes(dragElement.compType)) {
            // 侧边 不是卡片跟树 不允许拖进
            return false;
          }
          if (relateElement) {
            // 只允许一个
            return false;
          }
        }
      } else if (![1000, 1002, 1003, 1004, 1006, 1007].includes(dragElement.compType)) {
        return false;
      }
    },
    dragAreaEnd(e, index, arr) {
      // console.log(33333, e);
      this.copyNew(arr, index, e.oldDraggableIndex);
    },
    // 创建一个新的初始化
    copyNew(data, index, oldIndex) {
      const obj = JSON.parse(JSON.stringify(data[index].children[oldIndex]));
      obj.compId = createUnique();
      obj.children = [];
      if (obj.posAddPos || obj.posAddDevice || obj.deviceAddDevice) {
        obj.posAddPos = '';
        obj.posAddDevice = '';
        obj.deviceAddDevice = '';
      }
      // eslint-disable-next-line no-debugger
      // debugger;
      data[index].children[oldIndex] = obj;
    }
  },

  watch: {
    configData: {
      handler() {
        this.showTree = false;
        this.$nextTick(() => {
          this.showTree = true;
          setTimeout(() => {
            this.$refs.configTree.filter();
          }, 0);
        });
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.configSidebar {
  height: 100%;
  width: 280px;
  overflow: hidden;
  &__tab {
    box-sizing: border-box;
    width: 100%;
    height: 46px;
    padding: 10px 10px 8px;
    display: flex;
    &--item {
      flex: 1;
      border: 1px solid #e9e9e9;
      color: #333333;
      cursor: pointer;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      &:not(:first-child) {
        margin-left: 1px;
      }
      &.active {
        background-color: $--color-primary !important;
        border-color: $--color-primary !important;
        color: #fff !important;
      }
    }
  }
  &__wrapper {
    height: calc(100% - 46px);
  }
  &__comp {
    &--group {
      h1 {
        position: relative;
        font-weight: 600;
        font-size: 13px;
        height: 40px;
        line-height: 40px;
        padding-left: 22px;
        cursor: pointer;
      }
    }
    &--compList {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
    }
    &--compItem {
      box-sizing: border-box;
      width: 80px;
      height: 80px;
      margin-left: 10px;
      margin-bottom: 10px;
      border: 1px solid #e9e9e9;
      cursor: pointer;
      &.featGhost {
        display: inline-block;
        box-sizing: border-box;
        width: 50%;
        height: 90px;
        border: 1px dashed $--color-primary;
        margin: 0;
        vertical-align: top;
        img,
        p {
          opacity: 0;
        }
      }
      &.btnBox.featGhost {
        width: 68px;
        height: 30px;
        margin-left: 10px;
      }
      &.isTable.featGhost {
        display: inline-block;
        width: 140px;
        height: 80px;
      }

      &:hover {
        background: #fafafa;
        border: 1px solid #e9e9e9;
      }
      img {
        display: block;
        margin: 14px auto 0;
        width: 30px;
      }
      p {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }
    }
  }
  &__tabArea {
    height: 100%;
    overflow: auto;
    width: 100%;
    padding-right: 20px;
  }
  ::v-deep {
    &.el-tree {
      overflow: auto;
      width: 280px;
      height: 100%;
      > .el-tree-node {
        /*设置横向滚动条*/
        min-width: 100%;
        display: inline-block;
      }
    }
  }
  &__tree {
    ::v-deep {
      .el-tree-node:focus > .el-tree-node__content {
        background-color: $--hover-color;
        border-left: 3px solid $--color-primary;
      }
      .el-tree-node__content {
        height: 36px;
        box-sizing: border-box;
        border-left: 3px solid transparent;
        .el-tree-node__expand-icon {
          margin-left: 10px;
        }
        & > div {
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
  &__treeItem {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
}
</style>
