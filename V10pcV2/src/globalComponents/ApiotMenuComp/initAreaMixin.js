import { createUnique } from '@/utils/utils';

export default {
  props: {
    // 爹
    parent: {
      type: Object,
    },
    hasTriggerComp: {
      type: Object,
    },
  },
  data() {
    return {
      menuMain: null,
      loading: false,
      isActivated: false,
      notBtsChange: true, // 是否是按钮的变化
      backBtns: null,
      previewData: [
        {
          label: '一级 1',
          id: 1,
          children: [
            {
              label: '二级 1-1',
              id: 2,
              children: [
                {
                  label: '三级 1-1-1',
                  id: 3,
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          id: 4,
          children: [
            {
              label: '二级 2-1',
              id: 5,
              children: [
                {
                  label: '三级 2-1-1',
                  id: 6,
                },
              ],
            },
            {
              label: '二级 2-2',
              id: 7,
              children: [
                {
                  label: '三级 2-2-1',
                  id: 8,
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1',
                },
              ],
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1',
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    if (this.configData.needPermissions == null) {
      // this.configData.needPermissions = true;
      this.$set(this.configData, 'needPermissions', true);
    }
    if (this.configData.children.length === 0 && this.isConfig) {
      this.initArea();
    }
  },
  methods: {
    initArea() {
      const area = {
        name: '功能区',
        compId: createUnique(),
        form: {},
        rules: {},
        children: [],
        areaType: 1,
      };
      const idCompId = createUnique();
      const id = {
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
      };
      if (this.configData.compType !== 1008) {
        area.children.push(id);
        area.form[idCompId] = '';
      }

      // 如果是设备位置树，还需要加入设备位置区分字段
      if (this.configData.compType === 1004) {
        const dataTypeCompId = createUnique();
        area.children.push({
          areaType: 1,
          backName: 'label控件',
          canReadonly: false,
          canShow: true,
          compId: dataTypeCompId,
          compName: 'Label',
          compType: 15,
          dataSource: {
            alias: '',
            columnName: 'dataType',
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
          name: 'dataType',
          pane: { name: '', columnName: '', paramArr: [] },
          placeholder: '请选择数据',
          propertyCompName: 'LabelConfig',
          shouldRequired: true,
          showLabelTitle: true,
          showTreeText: false,
          singleStatus: 4,
          submitType: 1,
          width: '100%',
        });
        area.form[dataTypeCompId] = '';
        const positionCompId = createUnique();
        area.children.push({
          areaType: 1,
          backName: 'label控件',
          canReadonly: false,
          canShow: true,
          compId: positionCompId,
          compName: 'Label',
          compType: 15,
          dataSource: {
            alias: '',
            columnName: 'positionId',
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
          name: 'positionId',
          pane: { name: '', columnName: '', paramArr: [] },
          placeholder: '请选择数据',
          propertyCompName: 'LabelConfig',
          shouldRequired: true,
          showLabelTitle: true,
          showTreeText: false,
          singleStatus: 4,
          submitType: 1,
          width: '100%',
        });
        area.form[positionCompId] = '';
      }
      // 如果是故障三围树，还需要加入故障三围树区分字段
      if (this.configData.compType === 1005) {
        const dataTypeCompId = createUnique();
        area.children.push(
          {
            areaType: 1,
            backName: 'label控件',
            canReadonly: false,
            canShow: true,
            compId: createUnique(),
            compName: 'Label',
            compType: 15,
            dataSource: {
              alias: '',
              columnName: 'dataType',
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
            name: 'dataType',
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
          {
            areaType: 1,
            backName: 'label控件',
            canReadonly: false,
            canShow: true,
            compId: createUnique(),
            compName: 'Label',
            compType: 15,
            dataSource: {
              alias: '',
              columnName: 'keycode',
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
            name: 'keycode',
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
        );
        area.form[dataTypeCompId] = '';
      }
      // 多表树
      if (this.configData.compType === 1007) {
        const dataTypeCompId = createUnique();
        area.children.push({
          areaType: 1,
          backName: 'label控件',
          canReadonly: false,
          canShow: true,
          compId: dataTypeCompId,
          compName: 'Label',
          compType: 15,
          dataSource: {
            alias: '',
            columnName: 'dataType',
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
          name: 'dataType',
          pane: { name: '', columnName: '', paramArr: [] },
          placeholder: '请选择数据',
          propertyCompName: 'LabelConfig',
          shouldRequired: true,
          showLabelTitle: true,
          showTreeText: false,
          singleStatus: 4,
          submitType: 1,
          width: '100%',
        });
        area.form[dataTypeCompId] = '';
      }
      // 树组件插入搜索
      if (this.configData.isTree) {
        this.configData.children.unshift({
          areaType: 2,
          children: [
            {
              areaType: 2,
              canReadonly: false,
              canSearch: true,
              canShow: true,
              compId: createUnique(),
              compName: 'SearchCondition',
              compType: 16,
              dragCard: true,
              highCompArr: [],
              highStyle: 2,
              hisSearch: false,
              imgUrl: 'baseComp/SearchCondition.svg',
              name: '搜索框',
              placeholder: '请输入关键字搜索',
              propertyCompName: 'SearchConditionConfig',
              searchCompArr: [],
              shouldHigh: false,
            },
          ],
          compId: createUnique(),
          name: '按钮区',
          rightIndex: 0,
        });
        this.$nextTick(() => {
          this.configData.children[0].rightIndex = 1;
        });
      }

      this.configData.children.push(area);

      if (this.configData.compType === 1003 && this.isSidebar) {
        // 下面插入按钮区
        this.configData.children[1].children.unshift({
          name: '操作',
          compName: 'BtnsArea',
          compId: createUnique(),
          children: [],
          dataSource: {
            columnName: '',
          },
        });
      }
      if (this.configData.compType === 1007 && this.isSidebar) {
        // 下面插入按钮区
        this.configData.children[1].children.unshift({
          name: '操作',
          compName: 'BtnsArea',
          compId: createUnique(),
          children: [],
          dataSource: {
            columnName: '',
            tableName: '',
            alias: '',
          },
        });
        this.configData.children[1].children.unshift({
          name: '操作',
          compName: 'BtnsArea',
          compId: createUnique(),
          children: [],
          dataSource: {
            columnName: '',
            tableName: '',
            alias: '',
          },
        });
      }
    },
    // 按钮超过4个出现更多操作
    getMoreOperate() {
      this.notBtsChange = false;
      this.moreOperateArr = [];
      if (!this.getBtnsArr.children1) {
        this.getBtnsArr.children1 = this.getBtnsArr.children;
      } else {
        this.getBtnsArr.children = this.getBtnsArr.children1;
      }
      const arr = this.getBtnsArr.children.filter(
        (v) => v.canShow && v.showInput !== false,
      );
      const { length } = arr;
      const num = length - this.getBtnsArr.rightIndex - 4;
      if (num > 0) {
        if (num === 1) {
          this.moreOperateArr = arr;
        } else {
          this.moreOperateArr = arr.splice(4, num, {
            compName: 'MoreFormButton',
            compId: createUnique(),
          });
        }
        this.getBtnsArr.children = arr;
      }
      this.$nextTick(() => {
        this.notBtsChange = true;
      });
    },
  },
  watch: {
    'getBtnsArr.children': {
      handler() {
        if (this.notBtsChange && !this.isConfig && !this.isPreview) {
          this.$nextTick(() => {
            this.getMoreOperate();
          });
        }
      },
      deep: true,
    },
  },
};
