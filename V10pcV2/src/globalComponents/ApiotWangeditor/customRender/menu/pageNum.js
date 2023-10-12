class PageNum {
  constructor() {
    this.title = '页码';
    this.tag = 'button';
    this.iconSvg =
      '<svg t="1663384287086" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1642" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M998.4 256v768H25.6V0h768v51.2h51.2v51.2h-51.2v102.4h102.4V153.6h51.2v51.2h51.2v51.2z m-204.8 0h-51.2V51.2H76.8v921.6h870.4V256h-153.6z m-136.5504 409.6H691.2v102.4h-42.6496L640 870.4h-102.4l8.5504-102.4h-102.4L435.2 870.4H332.8l8.5504-102.4H281.6v-102.4h68.2496l17.1008-204.8H332.8V358.4h42.6496L384 256h102.4l-8.5504 102.4h102.4L588.8 256h102.4l-8.5504 102.4H742.4v102.4h-68.2496zM469.3504 460.8l-17.1008 204.8h102.4l17.1008-204.8h-102.4zM844.8 102.4h51.2v51.2h-51.2V102.4z" fill="#484D55" p-id="1643"></path></svg>';
  }

  getValue() {
    return '页码';
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
      vartype: 'pageNum',
      children: [{ text: value }], // void node 需要有一个空 text
    };
    editor.insertNode(dataVal);
  }
}

// 当前时间
const pageNumConf = {
  key: 'pageNum', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new PageNum();
  },
};

export default pageNumConf;
