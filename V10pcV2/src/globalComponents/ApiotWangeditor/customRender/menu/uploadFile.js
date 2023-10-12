import { uploadUpdatePackage } from '@/api/appConfig';

class UploadFile {
  // JS 语法

  constructor() {
    this.title = '上传文件'; // 自定义菜单标题
    // this.iconSvg = '<svg>...</svg>' // 可选
    this.tag = 'button';
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue() {
    // JS 语法
    return '';
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive() {
    // JS 语法
    return false;
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled() {
    // JS 语法
    return false;
  }

  // 点击菜单时触发的函数
  exec(editor) {
    // JS 语法
    if (this.isDisabled(editor)) return;
    const file = document.createElement('input');
    file.type = 'file';
    file.addEventListener('change', async () => {
      console.log(file, file.files[0]);
      const formData = new FormData();
      formData.append('file', file.files[0]);
      const res = await uploadUpdatePackage(formData);
      console.log(res);
      const html = `<a
      href='${res}'
      target='_blank'
      data-slate-node='element'
      data-slate-inline='true'
    >
      <span data-slate-node='text'>
        <span data-slate-leaf='true'>
          <span data-slate-string='true'>${file.files[0].name}</span>
        </span>
      </span>
    </a>`;
      editor.dangerouslyInsertHtml(html);
      document.body.removeChild(file);
    });
    document.body.append(file);
    file.click();
    // editor.insertText(value); // value 即 this.value(editor) 的返回值
  }
}
const ApiotUploadFile = {
  key: 'ApiotUploadFile',
  factory() {
    return new UploadFile();
  },
};

export default ApiotUploadFile;
