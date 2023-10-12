import { listData, updatePrintInfo } from '@/api/home';
import { useLoadingStore } from '@/store/loading';
import html2canvas from "html2canvas";
const loading = useLoadingStore();

export default function printMixin({ type, ids }) {

  // 放数据用
  let dataArr = reactive([]);
  let isShow = ref(false); // 是否显示弹出框
  let number = ref(1); // 打印张数
  let btn__loading__text = ref('生成中...');
  let btn__state = ref(false);
  
  const params = {
    ids,
    type,
  };

  // 请求接口获取数据
  const getTestData = async () => {
    loading.openLoading();
    const result: any = await listData(params);
    dataArr.push(...result);
    loading.closeLoading();
  };

  // 请求修改时间接口
  const changePrintInfo = async () => {
    const result: any = await updatePrintInfo(params);
  };

  // 按钮点击方法，修改时间
  const handleClick = () => {
    isShow.value = true
  };

  // 校验函数可以直接返回一段错误提示
  const validatorMessage = (val) => {
    const maximum = 20;
    if (val === '') { 
      return '值不能为空'
    }
    if (val > maximum) {
      return `值不能大于${maximum}`
    }
    if (val < 1) {
      return `值不能小于1`
    }
  };

  const handleCancel = () => { 
    resetFun();
  }

  const onSubmit = async () => {
    btn__state.value = true;
    const eleArr = document.getElementsByClassName('container__box');
    const base64List = [];
    for (let i = 0; i < eleArr.length; i += 1) {
      const ele = eleArr[i] as HTMLElement;
      await html2canvas(ele, {
        scale: 1.12,
      }).then(canvas => {
        // 转成图片，生成图片地址
        const imgUrl = canvas.toDataURL("image/png"); //可将 canvas 转为 base64 格式
        base64List.push(imgUrl);
        btn__loading__text.value = `生成中(${i + 1}/${eleArr.length})`
      })
    }
    console.log(base64List[0], btn__state.value)
    if (base64List.length !== 0 && btn__state.value) {
      changePrintInfo();
      // 给 给主包参数 只会app
      window.uni.postMessage({
        data: {
          isClickPrint: true, // 这是传的参数
          giveData: base64List,
          num: Number(number.value)
        }
      });
      resetFun();
    }
  };

  const resetFun = () => { 
    isShow.value = false;
    btn__state.value = false;
    btn__loading__text.value = '生成中...'
    number.value = 1
  }

  return {
    number,
    isShow,
    dataArr,
    btn__loading__text,
    btn__state,
		getTestData,
    handleClick,
    validatorMessage,
    onSubmit,
    handleCancel
	}
}