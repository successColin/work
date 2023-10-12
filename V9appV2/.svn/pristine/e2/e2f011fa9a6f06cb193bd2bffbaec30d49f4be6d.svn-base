<template>
  <view class="tree-item">
    <view
      class="tree-item-text"
      :style="{ color: getTreeIconObj(treeItem, 'fontColor') }"
      @click="
        treeItemClick(
          treeItem.id,
          treeItem.isGroup,
          treeItem.childCount,
          treeItem.type
        )
      "
    >
      <block v-if="!isLoading"
        ><m-normal-icon
          v-if="treeItem.childCount || hasChild"
          class="tree-item-icon"
          :class="{ icontransform: open,close:!open}"
          icon="iconshushouqijiantou"
          :iconSize="16"
        ></m-normal-icon
      ></block>
      <image
        v-else
        :src="tailSpin"
        style="width: 25px; height: 25px"
        mode="aspectFill"
      ></image>
      <m-normal-icon
        v-if="treeItem.isGroup"
        class="tree-item-icon"
        :color="getTreeIconObj(treeItem, 'iconColor')"
        :icon="getTreeIconObj(treeItem, 'icon', 'common_icon_group')"
        :iconSize="34"
      ></m-normal-icon>
      <m-normal-icon
        v-else
        class="tree-item-icon"
        :color="getTreeIconObj(treeItem, 'iconColor')"
        :icon="getTreeIconObj(treeItem, 'icon')"
        :iconSize="34"
      ></m-normal-icon>
			<span class="text">
				<block v-if="showType == 1">{{ treeItem.name || '' }}</block>
				<block v-else-if="showType == 2">{{
					(treeItem.name || '') + '_' + (treeItem.keyCode || '')
				}}</block>
				<block v-else-if="showType == 3">{{
					(treeItem.keyCode || '') + '_' + (treeItem.name || '')
				}}</block>
				<block v-else-if="showType == 4">{{ treeItem.keyCode || '' }}</block>
			</span>
      <block v-if="!treeItem.isGroup">
        <view
          class="tree-item-check checked"
          :style="{ color: themeColorCode }"
          @tap.stop="treeItemSelect(treeItem)"
          v-if="
            checkedIds.findIndex(
              (checkId) => `${checkId}` === `${treeItem.id}`
            ) !== -1
          "
        >
          <m-normal-icon
            v-if="multiple"
            icon="checkbox_app"
            :iconSize="36"
          ></m-normal-icon>
          <m-normal-icon
            v-else
            icon="checkboxRadio_app"
            :iconSize="36"
          ></m-normal-icon>
        </view>
        <view
          class="tree-item-check"
          @tap.stop="treeItemSelect(treeItem)"
          v-else
        >
          <m-normal-icon
            v-if="multiple"
            icon="unCheckbox_app"
            :iconSize="36"
          ></m-normal-icon>
          <m-normal-icon
            v-else
            icon="unCheckboxRadio_app"
            :iconSize="36"
          ></m-normal-icon>
        </view>
      </block>
    </view>
    <view v-show="open" v-if="children.length > 0" class="tree-item-Child">
      <m-tree-item
        v-for="(item, index) in children"
        :multiple="multiple"
        :treeItem="item"
        :key="index"
        :showType="showType"
        :dataSource="dataSource"
        :elementMultiRelation="elementMultiRelation"
        :asyncNode="asyncNode"
        :groupDataSource="groupDataSource"
        :checkedIds="checkedIds"
        :elementId="elementId"
        :treeIcon="treeIcon"
        :level="level + 1"
        :treeIconConfig="treeIconConfig"
      >
      </m-tree-item>
    </view>
    <!-- <m-loading v-if="isLoading" class="animated"
			:class="[isLoading ? 'fadeIn':'fadeOut']"></m-loading> -->
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { treeApi } from '@/common/request/api.js';
import bus from '@/static/js/bus';
import tailSpin from '@/static/images/svg/tail-spin.svg';
export default {
  name: 'm-tree-item',
  props: {
    showType: {
      //显示类型 1-名称；2-名称+编码；3-编码+名称；4-编码
      type: Number,
      default: 1,
    },
    level: {
      //树的层级
      type: Number,
      default: 1,
    },
    elementId: [Number, String],
    elementMultiRelation: [Number, String],
    dataSource: String,
    groupDataSource: String,
    treeItem: Object,
    isLast: Number,
    page: Number,
    asyncNode: {
      //是否异步，默认false
      type: Boolean,
      default: false,
    },
    multiple: {
      //是否多选
      type: Boolean,
      default: false,
    },
    checkedIds: Array,
    checkedColumn: { type: String, default: 'id' }, //监测选中的字段
    openColumn: { type: String, default: '' }, //监测需要
    // alreadyCheckId:Number
    treeIcon: {
      type: String,
      default: '',
    },
    treeIconConfig: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      open: false,
      children: [],
      checked: false,
      isLoading: false,
      tailSpin: tailSpin,
    };
  },
  computed: {
    ...mapState(['themeColorCode']),
    ...mapState('Tree', ['ancestors']),
    hasChild() {
      return this.treeItem.children && this.treeItem.children.length;
    },
    openIsNot() {
      //是否需要自动打开
      if (this.treeItem[this.openColumn]) {
        return this.ancestors.indexOf(this.treeItem[this.openColumn]) !== -1;
      } else {
        return false;
      }
    },
    getTreeIconObj() {
      return function (v, currentType, treeIconGroup, treeIconChild) {
        let { iconInfo, type, isGroup } = v;

        let treeIconValueArr, currentArr;
        if (iconInfo) {
          treeIconValueArr = iconInfo.split(':');
        }
        if (treeIconValueArr) {
          const fieldName = treeIconValueArr[0];
          const fieldValue = treeIconValueArr[1];
          currentArr = this.treeIconConfig.find(
            (val) =>
              val.value === fieldValue &&
              val.columnName === fieldName &&
              val.tableName === type.toLowerCase()
          );
        }
        if (currentType === 'icon') {
          return currentArr && currentArr.iconName
            ? currentArr.iconName
            : isGroup
            ? treeIconGroup
            : treeIconChild;
        } else if (currentType === 'iconColor') {
          console.log(currentArr);
          return currentArr && currentArr.iconColor
            ? currentArr.iconColor
            : '#fab71c';
        } else if (currentType === 'fontColor') {
          return currentArr && currentArr.fontColor
            ? currentArr.fontColor
            : '#111';
        }
        return '';
      };
    },
  },
  watch: {
    openIsNot(newValue) {
      if (!newValue) return;
      const treeItem = this.treeItem;
      this.treeItemClick(
        treeItem.id,
        treeItem.isGroup,
        treeItem.childCount,
        treeItem.type
      );
    },
  },
  created() {
    this.children = this.treeItem.children || [];
  },
  mounted() {
    // if(this.level === 1){
    // 	this.treeItemClick(this.treeItem.id,this.treeItem.isGroup,this.treeItem.childCount,this.treeItem.type)
    // }
    const treeItem = this.treeItem;
    if (this.ancestors.indexOf(this.treeItem.nodeKey) !== -1) {
      this.treeItemClick(
        treeItem.id,
        treeItem.isGroup,
        treeItem.childCount,
        treeItem.type
      );
    }
    if (this.checkedIds.indexOf(treeItem[this.checkedColumn]) !== -1)
      this.treeItemSelect(treeItem, 'create');
  },
  methods: {
    async treeItemClick(id, isGroup, childCount, type) {
      if (this.asyncNode && this.children.length === 0 && childCount > 0) {
        await this.asyncTreeNode(id, isGroup, type);
      }
      this.children = this.treeItem.children || [];
      this.open = !this.open;
    },
    async asyncTreeNode(id, isGroup, type) {
      const _this = this;
      let elementMultiRelation = Number(this.elementMultiRelation);
      let type1 = 'D',
        params = {
          id: id || 0,
          group: 0,
          elementMultiRelation: elementMultiRelation,
          rootPath: this.treeItem.rootpath,
        };
      if (elementMultiRelation != 1) {
        params.dataSource = this.dataSource;
      } else {
        params.type = type;
        params.elementId = this.elementId;
      }
      if (isGroup) {
        (type1 = 'G'), (params.group = 1);
      }
      params.treeIcon = this.treeIcon;
      this.isLoading = true;
      await treeApi
        .currencyStandardSelectionBoxSingleTree(this, params, type1)
        .then((value) => {
          _this.treeItem.children = value;
          setTimeout(() => {
            _this.isLoading = false;
          }, 100);
        });
    },
    treeItemSelect(treeItem, type) {
      const children = this.children;
      if (type === 'create') {
        bus.$emit('treeCheckNode', {
          treeItem: treeItem,
          children: children,
        });
        return;
      }
      const checkedIdsIndex = this.checkedIds.findIndex(
        (item) => `${item}` === `${treeItem[this.checkedColumn]}`
      );
      if (checkedIdsIndex === -1) {
        bus.$emit('treeCheckNode', {
          treeItem: treeItem,
          children: children,
        });
      } else {
        bus.$emit('treeNoCheckNode', {
          treeItem: treeItem,
        });
      }
    },
  },
};
</script>

