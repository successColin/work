// eslint-disable-next-line max-classes-per-file
class Print {
  // data 数据， num 重复打印多少次
  constructor(type, data, num) {
    this.type = type;
    this.data = data;
    this.num = num;
  }

  startPrint() {
    if (this.type === 'sun-mi') {
      console.log(11111);

      // 连接商米一体机
      // eslint-disable-next-line camelcase
      const sunmi_print = uni.requireNativePlugin('Sunmi-Print-Inner');
      console.log(2222);
      // 使用前连接打印机
      sunmi_print.connect((res) => {
        console.log(3333, res.connect);
        if (res.connect === 'hello') {
          sunmi_print.getPrinterStatus((result) => {
            console.log(4444, result.status);
            if (result.status === 'running') {
              // 打印机初始化
              sunmi_print.printInit();
              console.log('11===>', this.data.length);
              // 打印一张自检页
              // sunmi_print.printSelfCheck();
              sunmi_print.labelLocate();
              // 重复打印的次数
              for (let i = 0; i < this.num; i += 1) {
                // 图片
                console.log('22===>', i, this.data.length);
                this.data.forEach((v) => {
                  // 标签定位 在打印每张标签内容前使用此方法定位到标签起始位置，之后使用打印接口绘制标签内容
                  sunmi_print.labelLocate();
                  sunmi_print.printDividingline({
                    style: '4',
                    height: '10',
                  });
                  sunmi_print.printBitmap({
                    base64: v.slice(22),
                    align: 1,
                  });
                });
              }
              // 标准切纸 在绘制完标签内容后如果不需要继续打印标签时使用此方法，将标签自动推送到切纸口
              sunmi_print.labelOutput();
            } else {
              console.log('请检查设备');
              uni.showToast({
                title: '请检查设备',
                icon: 'error',
              });
            }
          });
        } else {
          uni.showToast({
            title: '请检查设备',
            icon: 'error',
          });
        }
      });
      // 使用后断开打印机
      // sunmi_print.disconnect();
    } else console.log('没有该打印设备');
  }
}

export default Print;
