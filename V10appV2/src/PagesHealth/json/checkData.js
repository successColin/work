export const checkData = [{
  title: '故障工单',
  iconName: 'appIcon-guzhanggongdan',
  color: '#4689F5,#56CFFF'
}, {
  title: '计划/保养',
  iconName: 'appIcon-baoyang',
  color: '#00C078,#0DE694'
}, {
  title: '点巡检',
  iconName: 'appIcon-dianxunjian',
  color: '#FC6B24,#FA8C2E'
}, {
  title: '执行规范性',
  iconName: 'appIcon-zhihangguifan',
  color: '#4689F5,#56CFFF'
}];

export const checkDataBottom = [{
  title: '设备健康度',
  iconName: '#iconguzhangpinshuai',
  subTile: '异常设备占比'
}, {
  title: '设备停机时长',
  iconName: '#icontingjishichang',
  subTile: '设备总停机时间',
  iconPosition: 'zhongjian'
}, {
  title: '设备故障频率',
  iconName: '#iconjiankangdu',
  subTile: '故障频率',
  iconPosition: 'iconright'
}];

// 7中页面的模拟数据
export const downtimeDate = [{
  behavior: '手动创建',
  workname: '升降台螺丝断',
  state: '进行中',
  workKey: 'W1-000064',
  devKey: '3W3变壳线',
  devName: '208分钟',
  createTime: '2023-03-19',
  userName: '陈昔阳'
}, {
  behavior: '点检异常',
  workname: '转角阻尼坏',
  state: '进行中',
  workKey: 'SHHL_ZC-00000685',
  devKey: 'A车间电机故障',
  devName: '201分钟',
  createTime: '2023-03-20',
  userName: '赵卫星'
}, {
  behavior: '手动创建',
  workname: '手动盘拨码器坏',
  state: '进行中',
  workKey: 'SHHL_ZP-00000690',
  devKey: '3W3变壳线',
  devName: '208分钟',
  createTime: '2023-03-21',
  userName: '王智含'
}, {
  behavior: '点检异常',
  workname: '感应器常亮',
  state: '进行中',
  workKey: 'SHHL_ZC-00000692',
  devKey: 'A车间电机故障',
  devName: '201分钟',
  createTime: '2023-03-22',
  userName: '王成'
}, {
  behavior: '手动创建',
  workname: '真空泵修理',
  state: '进行中',
  workKey: 'SHHL_ZC-00000079',
  devKey: '3W3变壳线',
  devName: '208分钟',
  createTime: '2023-03-23',
  userName: '施春华'
}, {
  behavior: '点检异常',
  workname: '位置不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000659',
  devKey: 'A车间电机故障',
  devName: '201分钟',
  createTime: '2023-03-24',
  userName: '卢斌'
}, {
  behavior: '手动创建',
  workname: '上夹具开闭异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000660',
  devKey: '3W3变壳线',
  devName: '208分钟',
  createTime: '2023-03-25',
  userName: '王磊'
}, {
  behavior: '点检异常',
  workname: '转盘回转不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000661',
  devKey: 'A车间电机故障',
  devName: '201分钟',
  createTime: '2023-03-26',
  userName: '倪军刚'
}, {
  behavior: '手动创建',
  workname: '马达异响',
  state: '进行中',
  workKey: 'SHHL_ZC-00000662',
  devKey: '3W3变壳线',
  devName: '208分钟',
  createTime: '2023-03-27',
  userName: '姚全明'
}, {
  behavior: '点检异常',
  workname: '上园处升降机光电感异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000663',
  devKey: 'A车间电机故障',
  devName: '201分钟',
  createTime: '2023-03-19',
  userName: '曹建辉'
}];

export const enforceDate = [{
  behavior: '手动创建',
  workname: '升降台螺丝断',
  state: '进行中',
  workKey: 'W1-000064',
  devKey: '335-029',
  devName: '压缩机包装线及追加',
  createTime: '2023-03-19'
}, {
  behavior: '点检异常',
  workname: '转角阻尼坏',
  state: '进行中',
  workKey: 'SHHL_ZC-00000685',
  devKey: '335-102',
  devName: 'BSA总成环线',
  createTime: '2023-03-20'
}, {
  behavior: '手动创建',
  workname: '手动盘拨码器坏',
  state: '进行中',
  workKey: 'SHHL_ZP-00000690',
  devKey: 'DS-763-020',
  devName: '上壳盖压入机',
  createTime: '2023-03-21'
}, {
  behavior: '点检异常',
  workname: '感应器常亮',
  state: '进行中',
  workKey: 'SHHL_ZC-00000692',
  devKey: '7610-006',
  devName: 'A出荷自动塞胶机',
  createTime: '2023-03-22'
}, {
  behavior: '手动创建',
  workname: '真空泵修理',
  state: '进行中',
  workKey: 'SHHL_ZC-00000079',
  devKey: '582-126',
  devName: '抽真空装置',
  createTime: '2023-03-23'
}, {
  behavior: '点检异常',
  workname: '位置不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000659',
  devKey: '752-017',
  devName: 'ASD槽绝缘插入机',
  createTime: '2023-03-24'
}, {
  behavior: '手动创建',
  workname: '上夹具开闭异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000660',
  devKey: '724-075',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-25'
}, {
  behavior: '点检异常',
  workname: '转盘回转不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000661',
  devKey: '753-048',
  devName: 'ASD绕线机',
  createTime: '2023-03-26'
}, {
  behavior: '手动创建',
  workname: '马达异响',
  state: '进行中',
  workKey: 'SHHL_ZC-00000662',
  devKey: '767-019',
  devName: '真空净油机',
  createTime: '2023-03-27'
}, {
  behavior: '点检异常',
  workname: '上园处升降机光电感异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000663',
  devKey: '724-075ss',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-19'
}];

export const equHealthDate = [{
  behavior: '手动创建',
  workname: '升降台螺丝断',
  state: '进行中',
  workKey: 'W1-000064',
  devKey: '335-029',
  devName: '压缩机包装线及追加',
  createTime: '2023-03-19'
}, {
  behavior: '点检异常',
  workname: '转角阻尼坏',
  state: '进行中',
  workKey: 'SHHL_ZC-00000685',
  devKey: '335-102',
  devName: 'BSA总成环线',
  createTime: '2023-03-20'
}, {
  behavior: '手动创建',
  workname: '手动盘拨码器坏',
  state: '进行中',
  workKey: 'SHHL_ZP-00000690',
  devKey: 'DS-763-020',
  devName: '上壳盖压入机',
  createTime: '2023-03-21'
}, {
  behavior: '点检异常',
  workname: '感应器常亮',
  state: '进行中',
  workKey: 'SHHL_ZC-00000692',
  devKey: '7610-006',
  devName: 'A出荷自动塞胶机',
  createTime: '2023-03-22'
}, {
  behavior: '手动创建',
  workname: '真空泵修理',
  state: '进行中',
  workKey: 'SHHL_ZC-00000079',
  devKey: '582-126',
  devName: '抽真空装置',
  createTime: '2023-03-23'
}, {
  behavior: '点检异常',
  workname: '位置不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000659',
  devKey: '752-017',
  devName: 'ASD槽绝缘插入机',
  createTime: '2023-03-24'
}, {
  behavior: '手动创建',
  workname: '上夹具开闭异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000660',
  devKey: '724-075',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-25'
}, {
  behavior: '点检异常',
  workname: '转盘回转不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000661',
  devKey: '753-048',
  devName: 'ASD绕线机',
  createTime: '2023-03-26'
}, {
  behavior: '手动创建',
  workname: '马达异响',
  state: '进行中',
  workKey: 'SHHL_ZC-00000662',
  devKey: '767-019',
  devName: '真空净油机',
  createTime: '2023-03-27'
}, {
  behavior: '点检异常',
  workname: '上园处升降机光电感异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000663',
  devKey: '724-075ss',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-19'
}];

export const frequencyDate = [{
  behavior: '手动创建',
  workname: '升降台螺丝断',
  state: '进行中',
  workKey: 'W1-000064',
  devKey: '335-029',
  devName: '压缩机包装线及追加',
  createTime: '2023-03-19'
}, {
  behavior: '点检异常',
  workname: '转角阻尼坏',
  state: '进行中',
  workKey: 'SHHL_ZC-00000685',
  devKey: '335-102',
  devName: 'BSA总成环线',
  createTime: '2023-03-20'
}, {
  behavior: '手动创建',
  workname: '手动盘拨码器坏',
  state: '进行中',
  workKey: 'SHHL_ZP-00000690',
  devKey: 'DS-763-020',
  devName: '上壳盖压入机',
  createTime: '2023-03-21'
}, {
  behavior: '点检异常',
  workname: '感应器常亮',
  state: '进行中',
  workKey: 'SHHL_ZC-00000692',
  devKey: '7610-006',
  devName: 'A出荷自动塞胶机',
  createTime: '2023-03-22'
}, {
  behavior: '手动创建',
  workname: '真空泵修理',
  state: '进行中',
  workKey: 'SHHL_ZC-00000079',
  devKey: '582-126',
  devName: '抽真空装置',
  createTime: '2023-03-23'
}, {
  behavior: '点检异常',
  workname: '位置不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000659',
  devKey: '752-017',
  devName: 'ASD槽绝缘插入机',
  createTime: '2023-03-24'
}, {
  behavior: '手动创建',
  workname: '上夹具开闭异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000660',
  devKey: '724-075',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-25'
}, {
  behavior: '点检异常',
  workname: '转盘回转不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000661',
  devKey: '753-048',
  devName: 'ASD绕线机',
  createTime: '2023-03-26'
}, {
  behavior: '手动创建',
  workname: '马达异响',
  state: '进行中',
  workKey: 'SHHL_ZC-00000662',
  devKey: '767-019',
  devName: '真空净油机',
  createTime: '2023-03-27'
}, {
  behavior: '点检异常',
  workname: '上园处升降机光电感异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000663',
  devKey: '724-075ss',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-19'
}];

export const planKeepDate = [{
  behavior: '手动创建',
  workname: '升降台螺丝断',
  state: '进行中',
  workKey: 'W1-000064',
  devKey: '335-029',
  devName: '压缩机包装线及追加',
  createTime: '2023-03-19'
}, {
  behavior: '点检异常',
  workname: '转角阻尼坏',
  state: '进行中',
  workKey: 'SHHL_ZC-00000685',
  devKey: '335-102',
  devName: 'BSA总成环线',
  createTime: '2023-03-20'
}, {
  behavior: '手动创建',
  workname: '手动盘拨码器坏',
  state: '进行中',
  workKey: 'SHHL_ZP-00000690',
  devKey: 'DS-763-020',
  devName: '上壳盖压入机',
  createTime: '2023-03-21'
}, {
  behavior: '点检异常',
  workname: '感应器常亮',
  state: '进行中',
  workKey: 'SHHL_ZC-00000692',
  devKey: '7610-006',
  devName: 'A出荷自动塞胶机',
  createTime: '2023-03-22'
}, {
  behavior: '手动创建',
  workname: '真空泵修理',
  state: '进行中',
  workKey: 'SHHL_ZC-00000079',
  devKey: '582-126',
  devName: '抽真空装置',
  createTime: '2023-03-23'
}, {
  behavior: '点检异常',
  workname: '位置不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000659',
  devKey: '752-017',
  devName: 'ASD槽绝缘插入机',
  createTime: '2023-03-24'
}, {
  behavior: '手动创建',
  workname: '上夹具开闭异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000660',
  devKey: '724-075',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-25'
}, {
  behavior: '点检异常',
  workname: '转盘回转不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000661',
  devKey: '753-048',
  devName: 'ASD绕线机',
  createTime: '2023-03-26'
}, {
  behavior: '手动创建',
  workname: '马达异响',
  state: '进行中',
  workKey: 'SHHL_ZC-00000662',
  devKey: '767-019',
  devName: '真空净油机',
  createTime: '2023-03-27'
}, {
  behavior: '点检异常',
  workname: '上园处升降机光电感异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000663',
  devKey: '724-075ss',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-19'
}];

export const pointDate = [{
  name: '囊式车间折叠点检',
  checkTime: '2023-03-08',
  proportion: '3/5'
}, {
  name: '囊式车间完整性测试点检',
  checkTime: '2023-03-09',
  proportion: '0/10'
}, {
  name: '大流量折叠点检',
  checkTime: '2023-03-10',
  proportion: '14/60'
}, {
  name: '大流量完整性测试点检',
  checkTime: '2023-03-11',
  proportion: '20/60'
}, {
  name: 'PP车间折叠点检',
  checkTime: '2023-03-12',
  proportion: '10/10'
}, {
  name: '制药车间折叠点检',
  checkTime: '2023-03-12',
  proportion: '21/50'
}, {
  name: '制药车间加长点检',
  checkTime: '2023-03-13',
  proportion: '60/60'
}, {
  name: '半导体车间包装点检',
  checkTime: '2023-03-14',
  proportion: '20/20'
}, {
  name: '端封精度巡检',
  checkTime: '2023-03-15',
  proportion: '3/60'
}, {
  name: '如码垛机03日检查',
  checkTime: '2023-03-16',
  proportion: '39/60'
}];

export const troubleDate = [{
  behavior: '手动创建',
  workname: '升降台螺丝断',
  state: '进行中',
  workKey: 'W1-000064',
  devKey: '335-029',
  devName: '压缩机包装线及追加',
  createTime: '2023-03-19'
}, {
  behavior: '点检异常',
  workname: '转角阻尼坏',
  state: '进行中',
  workKey: 'SHHL_ZC-00000685',
  devKey: '335-102',
  devName: 'BSA总成环线',
  createTime: '2023-03-20'
}, {
  behavior: '手动创建',
  workname: '手动盘拨码器坏',
  state: '进行中',
  workKey: 'SHHL_ZP-00000690',
  devKey: 'DS-763-020',
  devName: '上壳盖压入机',
  createTime: '2023-03-21'
}, {
  behavior: '点检异常',
  workname: '感应器常亮',
  state: '进行中',
  workKey: 'SHHL_ZC-00000692',
  devKey: '7610-006',
  devName: 'A出荷自动塞胶机',
  createTime: '2023-03-22'
}, {
  behavior: '手动创建',
  workname: '真空泵修理',
  state: '进行中',
  workKey: 'SHHL_ZC-00000079',
  devKey: '582-126',
  devName: '抽真空装置',
  createTime: '2023-03-23'
}, {
  behavior: '点检异常',
  workname: '位置不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000659',
  devKey: '752-017',
  devName: 'ASD槽绝缘插入机',
  createTime: '2023-03-24'
}, {
  behavior: '手动创建',
  workname: '上夹具开闭异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000660',
  devKey: '724-075',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-25'
}, {
  behavior: '点检异常',
  workname: '转盘回转不良',
  state: '进行中',
  workKey: 'SHHL_RX-00000661',
  devKey: '753-048',
  devName: 'ASD绕线机',
  createTime: '2023-03-26'
}, {
  behavior: '手动创建',
  workname: '马达异响',
  state: '进行中',
  workKey: 'SHHL_ZC-00000662',
  devKey: '767-019',
  devName: '真空净油机',
  createTime: '2023-03-27'
}, {
  behavior: '点检异常',
  workname: '上园处升降机光电感异常',
  state: '进行中',
  workKey: 'SHHL_ZP-00000663',
  devKey: '724-075ss',
  devName: 'C上壳盖焊接机',
  createTime: '2023-03-19'
}];