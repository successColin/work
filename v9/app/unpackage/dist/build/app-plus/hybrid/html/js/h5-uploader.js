let mask = document.querySelector('.mask');
let fileDomAll = document.querySelectorAll('.file');
let tis = document.querySelector('.tis');
let progress = document.querySelector('.tis-progress');
let cancel = document.querySelector('.cancel-btn');
let loadingClass = document.querySelector('.loadingClass');

let createUpload = (file, url, key = 'file', header = {}, data = {}) => {
  console.log(`
	上传地址:${url}\n
	上传附件:${file.name} 附件大小:${file.size}\n
	请求头:${JSON.stringify(header)}\n
	业务参数:${JSON.stringify(data)}
	`);
  console.log('========================>', url);
  if (!url) {
    return;
  }
  tis.style.display = 'flex';

  let formData = new FormData();
  formData.append(key, file);

  for (let keys in data) {
    formData.append(keys, data[keys]);
  }

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  for (let keys in header) {
    console.log('============>' + keys + ':' + header[keys]);
    xhr.setRequestHeader(keys, header[keys]);
  }

  xhr.upload.addEventListener(
    'progress',
    function (event) {
      if (event.lengthComputable) {
        let percent = Math.ceil((event.loaded * 100) / event.total) + '%';
        progress.innerText = `努力上传中..${percent}`;
      }
    },
    false,
  );

  xhr.ontimeout = function () {
    // xhr请求超时事件处理
    progress.innerText = '请求超时';
    setTimeout(() => {
      tis.style.display = 'none';
      plus.webview.currentWebview().close();
    }, 1000);
  };

  xhr.onreadystatechange = (ev) => {
    if (xhr.readyState == 4) {
      console.log('===============>', xhr.responseText);
      if (xhr.status == 200) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          progress.innerText = '上传成功';
          const {
            displayFileName,
            fileLength,
            id,
            mainId,
            name,
            relationId,
            upload_percent,
            url: imgUrl,
          } = res.data[0];
          location.href = `callback?displayFileName=${escape(displayFileName)}
						&fileLength=${fileLength}&id=${id}
						&mainId=${mainId}&name=${name}&relationId=${relationId}
						&upload_percent=${upload_percent}&url=${imgUrl}&token=${data.token}`;
          setTimeout(() => {
            tis.style.display = 'none';
            plus.webview.currentWebview().close();
          }, 1000);
        } else {
          progress.innerText = res.msg;
        }
      } else {
        console.log('失败进来了', xhr.status);
        progress.innerText = '上传失败了';
        if (xhr.status == 0) {
          console.log(
            '请检查请求头Content-Type与服务端是否匹配，并确认服务端已正确开启跨域',
          );
        }
      }
      loadingClass.style.display = 'none';
      cancel.innerText = '取消';
    }
  };
  xhr.send(formData);

  cancel.addEventListener('click', () => {
    xhr.abort();
    plus.webview.currentWebview().close();
  });
};

mask.addEventListener('click', () => {
  plus.webview.currentWebview().close();
});

document.addEventListener('UniAppJSBridgeReady', () => {
  let { url, key, header, formData } = plus.webview.currentWebview();
  console.log(JSON.stringify(fileDomAll));
  fileDomAll.forEach((item) => {
    console.log(item);
    item.value = '';
    item.addEventListener(
      'change',
      (event) => {
        let file = item.files[0];
        // 默认限制文件小于10M,可自行修改
        if (file.size > 1024 * 1024 * 10) {
          plus.nativeUI.toast('单个文件请勿超过10M,请重新上传');
          return;
        }
        createUpload(file, url, key, header, formData);
      },
      false,
    );
  });
});
