import { getFileList, selectList } from '@/api/menuConfig.js';

export default {
  state: {
    checkUsers: {},
    usersObj: {}, // 用户列表对象
    filesObj: {}, // 文件列表
  },
  mutations: {
    // 设置人员选择框中的选中人员
    setSelectUserCheck(state, { selectFlag, checkUsers }) {
      state.checkUsers[selectFlag] = checkUsers;
    },
    // 设置用户列表对象
    setUserObj(state, users) {
      users.forEach((user) => {
        const { id } = user;
        state.usersObj[id] = user;
      });
    },
    // 设置文件列表对象
    setFilesObj(state, files) {
      files.forEach((file) => {
        const { id } = file;
        state.filesObj[id] = file;
      });
    },
  },
  actions: {
    // 获取人员信息
    // users 为字符串，如有多个，以,隔开
    async get_userCenter_usersInfo({ commit, state }, users) {
      if (!users) return [];
      const { usersObj } = state;
      const userArry = users.split(',');
      console.log('usersObj==============');
      console.log(usersObj);

      let userList = [];
      const userParam = [];
      userArry.forEach((id) => {
        // 判断该用户是否存在用户列表对象中，如果不存在，需要请求用户信息，如果存在者返回用户信息
        const user = usersObj[id];
        if (user) userList.push(user);
        else userParam.push(id);
      });

      try {
        if (userParam.length > 0) {
          const params = {
            selectContent:
              'account,email,enabled,icon,id,memo,orgId,telephone,username,wechat',
            selectFrom: 'sys_user',
            selectWhere: `sys_user.id in (${userParam.join(',')})`,
          };
          const result = await selectList(params);
          if (result.length > 0) {
            userList = userList.concat(result);
            commit('setUserObj', result);
          }
        }
      } catch (error) {
        console.error(error);
      }

      return userList;
    },
    // 获取文件信息
    async get_userCenter_filesInfo({ commit, state }, files) {
      if (!files) return [];
      const { filesObj } = state;
      const filesArry = `${files}`.split(',');

      const fileObj = {};
      const fileParam = [];
      filesArry.forEach((id) => {
        if (!id) return;
        const file = filesObj[id];
        if (file) fileObj[id] = file;
        else {
          fileParam.push(id);
          fileObj[id] = '';
        }
      });

      try {
        if (fileParam.length > 0) {
          const result = await getFileList({ ids: fileParam.join(',') });
          console.log(result);
          if (result.length > 0) {
            result.forEach((file) => {
              const { id } = file;
              fileObj[id] = file;
            });
            commit('setFilesObj', result);
          }
        }
      } catch (error) {
        console.error(error);
      }

      const fileList = [];
      filesArry.forEach((id) => {
        const file = fileObj[id];
        if (file) fileList.push(file);
      });

      return fileList;
    },
  },
};
