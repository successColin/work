/*
 * @Author: Shishans
 * @Date: 20200313
 * @Desc: 图片base64位上传，解决h5图片旋转问题（先转化为base64，然后h5转化为arrayBuffer判断是否有
 * 旋转，如果有旋转利用画布旋转回来，然后用canvasToTempFilePath再次保存为文件）
*/
// 获取jpg图片的exif的角度（在ios体现最明显）
// ArrayBuffer对象 Unicode码转字符串
function getStringFromCharCode(dataView, start, length) {
	var str = '';
	var i;
	for (i = start, length += start; i < length; i++) {
		str += String.fromCharCode(dataView.getUint8(i));
	}
	return str;
}
function getOrientation(arrayBuffer){
	var dataView = new DataView(arrayBuffer);
	var length = dataView.byteLength;
	var orientation;
	var exifIDCode;
	var tiffOffset;
	var firstIFDOffset;
	var littleEndian;
	var endianness;
	var app1Start;
	var ifdStart;
	var offset;
	var i;
	// Only handle JPEG image (start by 0xFFD8)
	if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
		offset = 2;
		while (offset < length) {
			if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
				app1Start = offset;
				break;
			}
			offset++;
		}
	}
	if (app1Start) {
		exifIDCode = app1Start + 4;
		tiffOffset = app1Start + 10;
		if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
			endianness = dataView.getUint16(tiffOffset);
			littleEndian = endianness === 0x4949;

			if (littleEndian || endianness === 0x4D4D /* bigEndian */ ) {
				if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
					firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

					if (firstIFDOffset >= 0x00000008) {
						ifdStart = tiffOffset + firstIFDOffset;
					}
				}
			}
		}
	}
	if (ifdStart) {
		length = dataView.getUint16(ifdStart, littleEndian);
		var standalone = window.navigator.standalone,
			userAgent = window.navigator.userAgent.toLowerCase(),
			safari = /safari/.test(userAgent),
			ios = /iphone|ipod|ipad/.test(userAgent);
	
		for (i = 0; i < length; i++) {
			offset = ifdStart + i * 12 + 2;
			if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */ ) {

				// 8 is the offset of the current tag's value
				offset += 8;

				// Get the original orientation value
				orientation = dataView.getUint16(offset, littleEndian);

				// Override the orientation with its default value for Safari (#120)
				// if (IS_SAFARI_OR_UIWEBVIEW) {
				//  dataView.setUint16(offset, 1, littleEndian);
				// }
				if (ios) {
					if (!standalone && safari) {
						dataView.setUint16(offset, 1, littleEndian);
					} else if (standalone && !safari) {
						//standalone
					} else if (!standalone && !safari) {
						dataView.setUint16(offset, 1, littleEndian);
					};
				} 
				break;
			}
		}
	}
	return orientation; 
}
//将图片转化为base64
//获取地址
function getLocalFilePath(path) {
    if (path.indexOf('_www') === 0 || path.indexOf('_doc') === 0 || path.indexOf('_documents') === 0 || path.indexOf('_downloads') === 0) {
        return path
    }
    if (path.indexOf('file://') === 0) {
        return path
    }
    if (path.indexOf('/storage/emulated/0/') === 0) {
        return path
    }
    if (path.indexOf('/') === 0) {
        var localFilePath = plus.io.convertAbsoluteFileSystem(path)
        if (localFilePath !== path) {
            return localFilePath
        } else {
            path = path.substr(1)
        }
    }
    return '_www/' + path
}
//path转化为base64
const URLTOBASE64 = (path) => {
	return new Promise(function(resolve, reject) {
	    if (typeof window === 'object' && 'document' in window) {
	        if (typeof FileReader === 'function') {
			// 	uni.request({
			// 		url: path,
			// 		method: 'GET',
			// 		responseType: 'arraybuffer',
			// 		success: (res)=> {
			// 			uni.showModal({
			// 				content:JSON.stringify(res),
			// 			})
			// 		}
			// 	});
			// }
	            var xhr = new XMLHttpRequest()
	            xhr.open('GET', path, true)
	            xhr.responseType = 'blob'
	            xhr.onload = function() {
					const _this = this
	                if (this.status === 200) {
	                    let fileReader = new FileReader()
	                    fileReader.onload = function(e) {
	                        resolve(e.target.result)
	                    }
	                    fileReader.onerror = reject
	                    fileReader.readAsDataURL(this.response)
	                }
	            }
	            xhr.onerror = reject
	            xhr.send()
	            return
	        }
	        var canvas = document.createElement('canvas')
	        var c2x = canvas.getContext('2d')
	        var img = new Image
	        img.onload = function() {
	            canvas.width = img.width
	            canvas.height = img.height
	            c2x.drawImage(img, 0, 0)
	            resolve(canvas.toDataURL())
				//转化为
	            canvas.height = canvas.width = 0
	        }
	        img.onerror = reject
	        img.src = path
	        return
	    }
	    if (typeof plus === 'object') {
	        plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), function(entry) {
	            entry.file(function(file) {
	                var fileReader = new plus.io.FileReader()
	                fileReader.onload = function(data) {
	                    resolve(data.target.result)
	                }
	                fileReader.onerror = function(error) {
	                    reject(error)
	                }
	                fileReader.readAsDataURL(file)
	            }, function(error) {
	                reject(error)
	            })
	        }, function(error) {
	            reject(error)
	        })
	        return
	    }
	    if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
	        wx.getFileSystemManager().readFile({
	            filePath: path,
	            encoding: 'base64',
	            success: function(res) {
	                resolve('data:image/png;base64,' + res.data)
	            },
	            fail: function(error) {
	                reject(error)
	            }
	        })
	        return
	    }
	    reject(new Error('not support'))
	})
}
//arraybuffer转化为base64
const arraybufferToBase64 = (buffer) => {
	let base64 = ""
	// #ifdef H5
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let len = bytes.byteLength, i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	base64 = window.btoa(binary);
	// #endif
	// #ifndef H5
	base64 = uni.arrayBufferToBase64(buffer);
	// #endif
	
	if(base64) base64 = 'data:image/jpeg;base64,' + base64
	return base64
}
//base64转化为arraybuffer
const base64ToArrayBuffer = (base64) => {
	base64 = base64.split(',')[1]
	base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
	var binary = atob(base64);
	var len = binary.length;
	var buffer = new ArrayBuffer(len);
	var view = new Uint8Array(buffer);
	for (var i = 0; i < len; i++) {
		view[i] = binary.charCodeAt(i);
	}
	return buffer;
}
// const base64ToArraybuffer = (base64) => {
	
// 	var type =base64.split(",")[0].match(/:(.*?);/)[1];//提取base64头的type如 'image/png'    
// 	var bytes=window.atob(base64.split(',')[1]);//去掉url的头，并转换为byte (atob:编码 btoa:解码)
	 
// 	//处理异常,将ascii码小于0的转换为大于0
// 	var ab = new ArrayBuffer(bytes.length);//通用的、固定长度(bytes.length)的原始二进制数据缓冲区对象
// 	for (var i = 0; i < bytes.length; i++) {
// 		ab[i] = bytes.charCodeAt(i);
// 	}
// 	let blob =  new Blob( [ab] , {type :type});
	
// 	return new Promise(function(resolve, reject) {
// 		var reader = new FileReader()
// 		reader.readAsArrayBuffer(blob)
// 		reader.onload = function(e) {
// 			resolve(e.target.result)
// 		}
// 	})
//    // return  new ArrayBuffer(bytes.length)
// }
//将base64转换为blob
const dataURLtoBlob = (dataurl) => { 
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
//将base64转换为file
export const dataURLToFile = (dataurl, fileName) => { 
	const theBlob = dataURLtoBlob(dataurl)
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
}
export const UPLOAD_URLTOBASE64 = async (urlArry) => {
	let arraybuffer = [],
		base64Array = [],
		orientationArray = []
	for(let i = 0;i<urlArry.length;i++){
		let base64 = await URLTOBASE64(urlArry[i])
		// #ifdef H5
		//base64转化为arraybuffer，判断图片是否经过旋转
		const buffer = base64ToArrayBuffer(base64)
		const orientation = getOrientation(buffer)
		orientationArray.push(orientation)
		// #endif
		base64Array.push(base64)
	}
	return {
		base64Array,
		orientationArray
	}
}
export const UPLOAD_URLTOBASE64_ONE  = URLTOBASE64
