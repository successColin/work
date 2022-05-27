import { postUploadHelp } from '@/api/helpCenter';

export default {
  props: {},

  data() {
    return {
      show: false,
      toolbarConfig: {
        toolbarKeys: [
          'headerSelect',
          '|',
          'bold',
          'underline',
          'italic',
          'color',
          'bgColor',
          '|',
          'fontSize',
          'fontFamily',
          'lineHeight',
          '|',
          'uploadImage',
          'uploadVideo',
          // '|',
          // 'emotion',
          {
            key: 'group-justify',
            title: '对齐',
            iconSvg: `
            <svg viewBox="0 0 1024 1024">
              <path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z">
              </path>
            </svg>
         `,
            menuKeys: [
              'justifyLeft',
              'justifyRight',
              'justifyCenter',
              'justifyJustify',
            ],
          },
          {
            key: 'group-indent',
            title: '缩进',
            iconSvg: `
            <svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>
          `,
            menuKeys: ['indent', 'delIndent'],
          },
          '|',
          {
            key: 'group-more-list',
            title: '格式',
            menuKeys: [
              'bulletedList',
              'numberedList',
              'through',
              'sup',
              'sub',
              'todo',
            ],
          },
          {
            key: 'group-more-style',
            title: '更多',
            menuKeys: [
              'insertTable',
              'insertLink',
              'code',
              'codeBlock',
              'divider',
              'blockquote',
              'clearStyle',
            ],
          },
          '|',
          'undo',
          'redo',
          'fullScreen',
        ],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            // 自定义上传图片
            async customUpload(file, insertFn) {
              const formData = new FormData();
              formData.append('file', file);
              const res = await postUploadHelp(formData);
              insertFn(res, '', res);
            },
          },
          uploadVideo: {
            // 自定义上传图片
            async customUpload(file, insertFn) {
              const formData = new FormData();
              formData.append('file', file);
              const res = await postUploadHelp(formData);
              insertFn(res, '', res);
            },
          },
        },
      },
    };
  },

  computed: {},
  created() {
    this.initConfig();
  },
  methods: {
    initConfig() {
      this.show = false;
      this.toolbarConfig = {
        ...this.toolbarConfig,
        ...this.extraToolbarConfig,
      };
      this.editorConfig = {
        ...this.editorConfig,
        ...this.extraEditorConfig,
      };
      console.log(this.toolbarConfig);
      this.show = true;
    },
  },
};
