import { createUnique } from '@/utils/utils';

const configData = [
  {
    name: '全屏布局',
    compId: 'Po6AIK',
    imgUrl: 'FullScreen.svg',
    dictArr: [],
    menuObj: {},
    paneObj: {},
    selShowType: 1, // 数据选择面板类型 1 是列表 2 是树 3 是树加列表
    children: [
      {
        name: '区域1',
        compId: '2XyZLp',
        showTab: false,
        children: [
          {
            name: 'Tab1',
            compId: 'WXGBgF',
            children: [
              {
                name: 'Tab按钮区',
                compId: 'i6R6sP',
                showH1: true,
                appSort: 1,
                appStyle: 1,
                areaType: 2,
                children: [
                  {
                    name: '取消',
                    compId: '9174Ze',
                    imgUrl: 'baseComp/FormButton.svg',
                    canShow: true,
                    ruleArr: [],
                    areaType: 2,
                    compName: 'FormButton',
                    compType: 5,
                    helpInfo: '',
                    iconFont: 'iconfont-xinzeng',
                    isTabBtn: true,
                    iconColor: '#5A80ED',
                    buttonForm: 1,
                    buttonType: 5,
                    dialogName: 'PanelDialog',
                    afterSubmit: { html: '', type: 1 },
                    buttonStyle: '',
                    canReadonly: false,
                    dialogTitle: '',
                    refreshType: 2,
                    saveAreaArr: '',
                    beforeSubmit: { html: '', type: 1 },
                    submitEnable: false,
                    propertyCompName: 'FormButtonConfig',
                    tabId: 'WXGBgF',
                    btnTypesArr: [1, 2, 5, 6],
                  },
                  {
                    name: '确定',
                    compId: 'HptJIe',
                    imgUrl: 'baseComp/FormButton.svg',
                    canShow: true,
                    ruleArr: [],
                    areaType: 2,
                    compName: 'FormButton',
                    compType: 5,
                    helpInfo: '',
                    iconFont: 'iconfont-xinzeng',
                    isTabBtn: true,
                    iconColor: '#5A80ED',
                    buttonForm: 1,
                    buttonType: 6,
                    dialogName: 'PanelDialog',
                    afterSubmit: { html: '', type: 1 },
                    buttonStyle: 'primary',
                    canReadonly: false,
                    dialogTitle: '',
                    refreshType: 2,
                    saveAreaArr: '',
                    beforeSubmit: { html: '', type: 1 },
                    submitEnable: false,
                    propertyCompName: 'FormButtonConfig',
                    tabId: 'WXGBgF',
                    btnTypesArr: [1, 2, 5, 6],
                    backName: '按钮',
                    relateType: 1,
                  },
                ],
                compName: 'BtnsArea',
                rightIndex: 2,
                tabBtnArea: true,
                propertyCompName: 'BtnsAreaConfig',
              },
              {
                name: '表格',
                compType: 1001,
                propertyCompName: 'TableMainConfig',
                imgUrl: 'areaComp/TableMain.svg',
                compId: createUnique(),
                compName: 'TableMain',
                pageType: 2,
                shouldTab: true,
                areaType: 1,
                showTitle: false, // 显示标题
                canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
                tableInfo: {
                  tableName: '',
                  id: 0,
                  nameAlias: '',
                },
                relateTableArr: [],
                relateTableIndex: 0,
                children: [
                  {
                    name: '按钮区',
                    compId: '8tq194',
                    children: [
                      {
                        name: '搜索框',
                        canSearch: true,
                        areaType: 2,
                        dragCard: true,
                        imgUrl: 'baseComp/SearchCondition.svg',
                        compType: 16,
                        compId: 'QFGuC9',
                        compName: 'SearchCondition',
                        propertyCompName: 'SearchConditionConfig',
                        placeholder: '请输入关键字搜索',
                        searchCompArr: [],
                        shouldHigh: false,
                        highStyle: 2,
                        highCompArr: [],
                        hisSearch: false,
                        canShow: true,
                        canReadonly: false,
                      },
                    ],
                    areaType: 2,
                    rightIndex: 1,
                  },
                ],
                filterTermType: 1, // 1 是普通 2是sql
                filterTermStr: '', // 普通字符串
                filterTermSql: '', // sql字符串
                termParams: '', // 过滤条件需要的组件参数id
                shouldInit: true, // 是否初始化
                reloadArea: [], // 要刷新的区域
                required: false, // 是否必填
                showNum: true, // 是否显示序号
                selectType: 1, // 多选类型 0 无 1 是多选 2是单选
                canOperate: false, // 是否启用操作列
                operateWidth: '0.2', // 操作列宽度
                showLine: 5, // 显示行数
                lineEditable: false, // 是否启用行编辑
                fixedLeft: 0, // 左侧固定列
                fixedRight: 0, // 右侧固定列
                hasPagination: true, // 是否启用分页
                rowNum: 10, // 分页条数
                sortArr: [], // 排序数组
                sortStr: '', // 排序字符串
                // name: '配置树',
                // compType: 1003,
                // propertyCompName: 'TreeMainConfig',
                // imgUrl: 'areaComp/TreeMain.svg',
                // compId: createUnique(),
                // compName: 'TreeMain',
                isTree: false, // 是否是树区
                hasTreeIcon: false, // 是否有树区固定图标
                treeIcon: {
                  icon: '',
                  color: '',
                  imageUrl: '',
                }, // 树的固定图标
                linkSymbol: '', // 链接符
                hasCardIcon: false, // 是否启用组件字典图标
                iconId: '', // 组件字典图标来源的组件id
                iconColorId: '', // 组件字典图标颜色来源的组件id
                // name: '卡片',
                // compType: 1002,
                // propertyCompName: 'CardMainConfig',
                // imgUrl: 'areaComp/CardMain.svg',
                // compId: createUnique(),
                // compName: 'CardMain',
                relateType: 1, // 弹窗类型 1是面板 2是菜单
                dialogName: 'PanelDialog', // 弹窗风格
                dialogTitle: '', // 弹窗名称
                // hasCardIcon: false, // 是否有卡片图标
                // iconId: '', // 卡片图标来源的组件id
                // iconColorId: '', // 卡片图标颜色来源的组件id
              },
            ],
            tabBtnPos: 2,
            showTabBtn: true,
            canChangeName: true,
          },
        ],
        curCompId: 'WXGBgF',
        isSidebar: false,
        shouldTab: false,
        firstShowTabId: 'WXGBgF',
        propertyCompName: 'ContentConfig',
      },
    ],
    compName: 'FullScreen',
    codeRuleList: [],
    propertyCompName: 'PageLayout',
  },
];

const idCompId = createUnique();
const area = {
  name: '功能区',
  compId: createUnique(),
  form: {},
  rules: {},
  children: [
    {
      areaType: 1,
      backName: 'label控件',
      canReadonly: false,
      canShow: true,
      compId: idCompId,
      compName: 'Label',
      compType: 15,
      dataSource: {
        alias: '',
        columnName: 'id',
        columnTypeDict: 1,
        dictObj: null,
        mainColumnInfo: null,
        relateName: '主表',
        tableName: '',
      },
      labelNotChange: true,
      dragCard: true,
      enableDict: false,
      enableDictIcon: false,
      enableIcon: false,
      enableMultiColumn: false,
      font: { color: '#333333', size: 14, style: 1 },
      helpInfo: '',
      icon: { icon: '', color: '', imageUrl: '' },
      imgUrl: 'baseComp/Label.svg',
      labelBg: { color: '#ffffff', style: 0 },
      labelName: 'label',
      multiTable: {
        table: { tableName: '', id: '' },
        column: { columnName: '', id: '', columnTypeDict: 0 },
      },
      name: 'id',
      pane: { name: '', columnName: '', paramArr: [] },
      placeholder: '请选择数据',
      propertyCompName: 'LabelConfig',
      shouldRequired: true,
      showLabelTitle: true,
      showTreeText: false,
      singleStatus: 4,
      submitType: 1,
      width: '100%',
    },
  ],
  areaType: 1,
};
area.form[idCompId] = '';
configData[0].children[0].children[0].children[1].children.push(area);

export default configData;
