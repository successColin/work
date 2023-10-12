class TimeMenu {
  constructor() {
    this.title = '当前时间';
    this.tag = 'button';
    this.iconSvg =
      '<svg t="1662426310521" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2526" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M512 170.666667A341.333333 341.333333 0 1 1 170.666667 512 341.333333 341.333333 0 0 1 512 170.666667m0-85.333334a426.666667 426.666667 0 1 0 426.666667 426.666667A426.666667 426.666667 0 0 0 512 85.333333z" p-id="2527"></path><path d="M648.746667 588.586667L554.666667 494.506667V277.333333a42.666667 42.666667 0 0 0-85.333334 0v234.666667a37.333333 37.333333 0 0 0 0 8.533333v2.346667a42.666667 42.666667 0 0 0 1.92 5.546667v1.706666a38.613333 38.613333 0 0 0 8.32 12.16l106.666667 106.666667A42.666667 42.666667 0 0 0 618.666667 661.333333a42.666667 42.666667 0 0 0 30.08-12.373333 42.666667 42.666667 0 0 0 0-60.373333z" p-id="2528"></path></svg>';
  }

  getValue() {
    return '当前时间';
  }

  isActive() {
    return false; // or true
  }

  isDisabled() {
    return false; // or true
  }

  exec(editor, value) {
    const dataVal = {
      type: 'messageVar',
      vartype: 'time',
      children: [{ text: value }], // void node 需要有一个空 text
    };
    editor.insertNode(dataVal);
  }
}

// 当前时间
const timeMenuConf = {
  key: 'timeMenu', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new TimeMenu();
  },
};

export default timeMenuConf;
