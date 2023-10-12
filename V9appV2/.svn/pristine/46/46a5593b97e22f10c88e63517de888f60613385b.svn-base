/*
 * @Author: Shishans
 * @Date: 2020/03/31
 * @Desc: 枚举类型
*/
class EsEnum {
    constructor(arr) {
        let typeArr = [];

        if (!Array.isArray(arr)){
            throw 'arr is not an array!';
            return;
        }

        arr.map(element => {
            if(!element.code) {
                return;
            }
            // 保存code值组成的数组，方便A.getName(name)类型的调用
            typeArr.push(element.code);
            // 根据code生成不同属性值，以便A.B.name类型的调用
            this[element.code] = element;
        });
        
        // 保存源数组
        this.arr = arr; 
        this.typeArr = typeArr;
    }

    // 根据code得到对象
    valueOf(code) {
        return this.arr[this.typeArr.indexOf(code)];
    }
	// 根据name获取code值
	getCodeByName(name){
	    let prop = this.arr.find(item => item.name === name) || '';
		
		if (!prop){
		    // throw 'No enum constant'  + name;
		    return 'error';
		}else return prop.code;
	}
    // 根据code获取name值
    getNameByCode(code){
        let prop = this.valueOf(code);
        if (!prop){
            // throw 'No enum constant'  + code;
            return 'error';
        }else return prop.name;
    }

    // 返回源数组
    getValues() {
        return this.arr;
    }
}

export default EsEnum;