export default {
  methods: {
    chooseImage(opt) {
      return new Promise((resolve, reject) => {
        opt = {
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          ...opt,
        };
        uni.chooseImage({
          ...opt,
          success({ tempFiles }) {
            resolve(tempFiles);
          },
          fail(res) {
            reject(res);
          },
        });
      });
    },
    chooseVideo(opt) {
      return new Promise((resolve, reject) => {
        opt = {
          sourceType: ['album', 'camera'],
          ...opt,
        };
        uni.chooseVideo({
          ...opt,
          success(res) {
            const { tempFilePath, duration, size, height, width, tempFile } =
              res;
            const tempFiles = [
              {
                name: (tempFile && tempFile.name) || '',
                path: tempFilePath,
                size,
                type: (tempFile && tempFile.type) || '',
                width,
                height,
                duration,
                fileType: 'video',
              },
            ];
            resolve(tempFiles);
          },
          fail(res) {
            reject(res);
          },
        });
      });
    },
  },
};
