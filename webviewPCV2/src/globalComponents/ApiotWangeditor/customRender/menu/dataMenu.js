class DateMenu {
  constructor() {
    this.title = '当前日期';
    this.tag = 'button';
    this.iconSvg =
      '<svg t="1662426359324" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3469" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M384 256h256V213.333333h85.333333v42.666667h128v554.666667H170.666667V256h128V213.333333h85.333333v42.666667z m384 85.333333H256v384h512V341.333333z m-341.333333 85.333334v85.333333H341.333333v-85.333333h85.333334z m128 0v85.333333h-85.333334v-85.333333h85.333334z m128 0v85.333333h-85.333334v-85.333333h85.333334z m-256 128v85.333333H341.333333v-85.333333h85.333334z m128 0v85.333333h-85.333334v-85.333333h85.333334z m128 0v85.333333h-85.333334v-85.333333h85.333334z" fill="#444444" p-id="3470"></path></svg>';
  }

  getValue() {
    return '当前日期';
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
      vartype: 'date',
      children: [{ text: value }], // void node 需要有一个空 text
    };
    editor.insertNode(dataVal);
  }
}

// 当前日期
const dataMenuConf = {
  key: 'dateMenu', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new DateMenu();
  },
};

export default dataMenuConf;
