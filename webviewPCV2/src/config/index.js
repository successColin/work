/*
 * @Author: cmk
 * @Date: 2021-04-16 17:54:03
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 09:54:00
 * @Des: 一些公共配置
 */
module.exports = {
  exportTips: [
    // 条件
    {
      content:
        '1、导入模板固定的前三列必须是设备位号、设备类型编码和设备分类编码；',
    },
    {
      content:
        '2、若设备位号、设备类型编码和设备分类编码填写错误，则该设备对应的技术参数将无法导入；',
    },
    { content: '3、支持多张工作表导入；' },
    { content: '4、若不小心关闭此界面，系统将在后台继续执行导入操作；' },
    { content: '5、技术参数导入比较耗时，请耐心等待；' },
  ],
  themeColor: '#4689F5', // 这个色号必须和主题色是一个颜色才行，要不然出来的css模板文件是空的,element-ui的默认主题色是#409EFF
  selectColorArr: [
    '#4689f5',
    '#C62127',
    '#EE5E5E',
    '#FAB71C',
    '#FC8256',
    '#34C7BE',
    '#10B98A',
    '#1CA6FF',
    '#A853F2',
    '#EF4373',
    '#708DB7',
  ],
  baseUrl: 'webview', // 全局设置地址包括打包后静态文件地址、路由地址。默认空特殊项目需要添加
  PREFIX: '/api', // 前缀
  VERSION: 'v1', // 版本号，默认为1，后续有其他接口版本号是其他值
  timeShortcuts: [
    {
      text: '今天',
      onClick(picker) {
        const t =
          new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24;
        const end = new Date(t - 1000);
        const start = new Date(t - 3600 * 1000 * 24 * 1);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '昨天',
      onClick(picker) {
        const t = new Date(new Date().toLocaleDateString()).getTime();
        const end = new Date(t - 1000);
        const start = new Date(t - 3600 * 1000 * 24 * 1);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '最近一周',
      onClick(picker) {
        const t =
          new Date(new Date().toLocaleDateString()).getTime() +
          3600 * 1000 * 24;
        const end = new Date(t - 1000);
        const start = new Date(t - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '最近一个月',
      onClick(picker) {
        // const t = new Date(new Date().toLocaleDateString()).getTime() + 3600 * 1000 * 24;
        // const end = new Date(t - 1000);
        // const start = new Date(t - 3600 * 1000 * 24 * 30);
        // picker.$emit('pick', [start, end]);
        const end = new Date();
        const year = end.getFullYear();
        const month = end.getMonth() + 1; // 0-11表示1-12月
        const day = end.getDate();
        const dateObj = {};
        dateObj.end = `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`;
        const endMonthDay = new Date(year, month, 0).getDate(); // 当前月的总天数
        if (month - 1 <= 0) {
          // 如果是1月，年数往前推一年<br>
          dateObj.start = `${year - 1}-${12}-${day}`;
        } else {
          const startMonthDay = new Date(
            year,
            parseInt(month, 10) - 1,
            0,
          ).getDate();
          if (startMonthDay < day) {
            // 1个月前所在月的总天数小于现在的天日期
            if (day < endMonthDay) {
              // 当前天日期小于当前月总天数
              dateObj.start = `${year}-${month - 1}-${
                startMonthDay - (endMonthDay - day)
              }`;
            } else {
              dateObj.start = `${year}-${month - 1}-${startMonthDay}`;
            }
          } else {
            dateObj.start = `${year}-${month - 1}-${day}`;
          }
        }
        const arr = dateObj.start.split('-');
        const allDay = new Date(arr[0], arr[1], 0).getDate();
        if (+arr[2] + 1 > allDay) {
          arr[1] = +arr[1] + 1;
          arr[2] = '01';
          if (arr[1] > 12) {
            arr[0] = +arr[0] - 1;
            arr[1] = '01';
          }
        } else {
          arr[2] = +arr[2] + 1;
        }
        const newStartTime = `${arr[0]}-${arr[1]
          .toString()
          .padStart(2, '0')}-${arr[2].toString().padStart(2, '0')}`;
        picker.$emit('pick', [
          `${newStartTime} 00:00:00`,
          `${dateObj.end} 23:59:59`,
        ]);
      },
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const year = end.getFullYear();
        const month = end.getMonth() + 1; // 0-11表示1-12月
        const day = end.getDate();
        const dateObj = {};
        dateObj.end = `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`;
        const endMonthDay = new Date(year, month, 0).getDate(); // 当前月的总天数
        if (month - 3 <= 0) {
          // 如果是1、2、3月，年数往前推一年
          // 3个月前所在月的总天数
          const start3MonthDay = new Date(
            year - 1,
            12 - (3 - parseInt(month, 10)),
            0,
          ).getDate();
          if (start3MonthDay < day) {
            // 3个月前所在月的总天数小于现在的天日期
            dateObj.start = `${year - 1}-${12 - (3 - month)}-${start3MonthDay}`;
          } else {
            dateObj.start = `${year - 1}-${12 - (3 - month)}-${day}`;
          }
        } else {
          // 3个月前所在月的总天数
          const start3MonthDay = new Date(
            year,
            parseInt(month, 10) - 3,
            0,
          ).getDate();
          if (start3MonthDay < day) {
            // 3个月前所在月的总天数小于现在的天日期
            if (day < endMonthDay) {
              // 当前天日期小于当前月总天数,2月份比较特殊的月份
              dateObj.start = `${year}-${month - 3}-${
                start3MonthDay - (endMonthDay - day)
              }`;
            } else {
              dateObj.start = `${year}-${month - 3}-${start3MonthDay}`;
            }
          } else {
            dateObj.start = `${year}-${month - 3}-${day}`;
          }
        }
        const arr = dateObj.start.split('-');
        const allDay = new Date(arr[0], arr[1], 0).getDate();
        if (+arr[2] + 1 > allDay) {
          arr[1] = +arr[1] + 1;
          arr[2] = '01';
          if (arr[1] > 12) {
            arr[0] = +arr[0] - 1;
            arr[1] = '01';
          }
        } else {
          arr[2] = +arr[2] + 1;
        }
        const newStartTime = `${arr[0]}-${arr[1]
          .toString()
          .padStart(2, '0')}-${arr[2].toString().padStart(2, '0')}`;
        picker.$emit('pick', [
          `${newStartTime} 00:00:00`,
          `${dateObj.end} 23:59:59`,
        ]);
      },
    },
    // {
    //   text: '大于当前时间',
    //   onClick(picker) {
    //     const end = new Date('2099/12/31 00:00:00');
    //     const start = new Date();
    //     picker.$emit('pick', [start, end]);
    //   },
    // },
    // {
    //   text: '小于当前时间',
    //   onClick(picker) {
    //     const end = new Date();
    //     const start = new Date('1900/01/01 00:00:00');
    //     picker.$emit('pick', [start, end]);
    //   },
    // },
  ],
};
