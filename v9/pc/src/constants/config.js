/**
 * @name: config
 * @author: DELL
 * @date: 2021/8/12 10:05
 * @description：config
 * @update: 2021/8/12 10:05
 */

module.exports = {
  PROJECT_NAME: '', // 项目
  globalCenter: {
    passwordValidity: {
      defaultValue: '0',
      list: [
        { value: '30', name: 'global.form.30days' },
        { value: '90', name: 'global.form.90days' },
        { value: '180', name: 'global.form.180days' },
        { value: '365', name: 'global.form.365days' },
        { value: '0', name: 'global.form.permanent' },
      ],
    },
    PasswordLevel: {
      defaultValue: '1',
      list: [
        { value: '1', name: 'validPwd.pattern1' },
        { value: '2', name: 'validPwd.pattern2' },
        { value: '3', name: 'validPwd.pattern3' },
      ],
    },
  },
};
