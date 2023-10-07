/**
数据验证（表单验证）
来自 grace.hcoder.net 
作者 hcoder 深海

版权声明 : 
GraceUI 的版权约束是不能转售或者将 GraceUI 直接发布到公开渠道！
侵权必究，请遵守版权约定！
*/
//身份证验证
// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
function checkIDCard(idcode) {
  // 加权因子
  var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  var code = idcode + '';
  var last = idcode[17]; //最后一位

  var seventeen = code.substring(0, 17);

  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  var arr = seventeen.split('');
  var len = arr.length;
  var num = 0;
  for (var i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }

  // 获取余数
  var resisue = num % 11;
  var last_no = check_code[resisue];

  // 格式的正则
  // 正则思路
  /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
  var idcard_patter =
    /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

  // 判断格式是否正确
  var format = idcard_patter.test(idcode);

  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return last === last_no && format ? true : false;
}
module.exports = {
  error: '',
  $t: '',
  static_errorMsg: {},
  check: function (data, rule, $t) {
    this.$t = $t;
    this.static_errorMsg = {
      //系统报错信息
      wrong: this.$t ? this.$t('check-wrong') : '填写有误',
      nan: this.$t ? this.$t('check-nan') : '非数字',
      greaterThan: this.$t ? this.$t('check-greaterThan') : '不能大于',
      lessThan: this.$t ? this.$t('check-lessThan') : '不能小于',
      notNull: this.$t ? this.$t('check-notNull') : '不能为空',
    };
    for (var i = 0; i < rule.length; i++) {
      if (!rule[i]) continue;
      if (!rule[i].checkType && !rule[i].checkFunction) continue;
      if (!rule[i].name) continue;
      let checkTypeArray = rule[i].checkType.split(',');

      let params = {
        value: data[rule[i].name],
        errorMsg: rule[i].errorMsg,
        checkRule: rule[i].checkRule,
        label: rule[i].label,
      };
      let flag = true;
      const notnull = ['notnull', 'imgnotnull', 'notnullSelect'];
      for (let i = 0, len = checkTypeArray.length; i < len; i++) {
        params.checkType = checkTypeArray[i];
        if (notnull.indexOf(checkTypeArray[i]) === -1 && !params.value)
          continue;
        flag = this.checkrules(params);
        if (!flag) break;
      }
      if (rule[i].checkFunction) {
        //自定义方法
        flag = rule[i].checkFunction.call(this, params);
      }
      if (!flag) return false;
    }
    return true;
  },
  isNumber: function (checkVal) {
    checkVal = Number(checkVal);
    if (checkVal == NaN) {
      return false;
    }
    return true;
  },
  checkrules: function (params = {}) {
    let flag = true;

    switch (params.checkType) {
      case 'check.ipcode': //身份证
        if (!checkIDCard(params.value)) {
          this.error = params.label + this.static_errorMsg.wrong;
          flag = false;
        }
        break;
      case 'string':
        var reg = new RegExp('^.{' + params.checkRule + '}$');
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'int':
        var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + params.checkRule + '}$');
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
        break;
      case 'dateRange': //时间
        if (!params.checkRule) {
          flag = false;
          return false;
        }
        var minMax = params.checkRule.split(','),
          msg = params.errorMsg.split(',');

        let valueDate = new Date(params.value.replace(/-/g, '/')),
          startDate = new Date(minMax[0].replace(/-/g, '/')),
          endDate = new Date(minMax[1].replace(/-/g, '/'));

        if (!minMax[0] && minMax[1]) {
          if (valueDate > endDate) {
            this.error = msg[0] + this.static_errorMsg.greaterThan + msg[2];
            flag = false;
          }
        } else if (minMax[0] && !minMax[1]) {
          if (valueDate < startDate) {
            this.error = msg[0] + this.static_errorMsg.lessThan + msg[1];
            flag = false;
          }
        } else {
          if (valueDate < startDate || valueDate > endDate) {
            this.error =
              msg[0] +
              this.static_errorMsg.lessThan +
              msg[1] +
              ',' +
              this.static_errorMsg.greaterThan +
              msg[2];
            flag = false;
          }
        }
        break;
      case 'numberRange':
        var reg = /^-?[1-9][0-9]?$/;
        let valueData = Number(params.value);
        if (isNaN(valueData)) {
          this.error = this.static_errorMsg.nan;
          flag = false;
        }
        if (!params.checkRule) {
          flag = false;
          return false;
        }
        var minMax = params.checkRule.split(','),
          msg = params.errorMsg.split(',');

        let min = Number(minMax[0]),
          max = Number(minMax[1]);
        if (!minMax[0] && minMax[1]) {
          if (valueData > max) {
            this.error = msg[0] + this.static_errorMsg.greaterThan + msg[2];
            flag = false;
          }
        } else if (minMax[0] && !minMax[1]) {
          if (valueData < min) {
            this.error = msg[0] + this.static_errorMsg.lessThan + msg[1];
            flag = false;
          }
        } else {
          if (valueData < min || valueData > max) {
            this.error =
              msg[0] +
              this.static_errorMsg.lessThan +
              msg[1] +
              ',' +
              this.static_errorMsg.greaterThan +
              msg[2];
            flag = false;
          }
        }
        break;
      case 'betweenD':
        var reg = /^-?[1-9][0-9]?$/;
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
        }
        var minMax = params.checkRule.split(',');
        minMax[0] = Number(minMax[0]);
        minMax[1] = Number(minMax[1]);
        if (params.value > minMax[1] || params.value < minMax[0]) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'betweenF':
        var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
          return false;
        }
        var minMax = params.checkRule.split(',');
        minMax[0] = Number(minMax[0]);
        minMax[1] = Number(minMax[1]);
        if (params.value > minMax[1] || params.value < minMax[0]) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'same':
        if (params.value != params.checkRule) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'notsame':
        if (params.value == params.checkRule) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'email':
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'check.phoneno':
        var reg = /^1[3456789]\d{9}$/;
        if (!reg.test(params.value)) {
          this.error = (params.label || '') + this.static_errorMsg.wrong;
          flag = false;
        }
        break;
      case 'zipcode':
        var reg = /^[0-9]{6}$/;
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'reg':
        var reg = new RegExp(params.checkRule);
        if (!reg.test(params.value)) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'in':
        if (params.checkRule.indexOf(params.value) == -1) {
          this.error = params.errorMsg;
          flag = false;
        }
        break;
      case 'notnull':
        let value = params.value + '';
        if (params.value == null || value.length < 1) {
          this.error = params.label + this.static_errorMsg.notNull;
          flag = false;
        }
        break;
      case 'imgnotnull':
        if (params.value == null || params.value.length < 1) {
          this.error = params.label + this.static_errorMsg.notNull;
          flag = false;
        }
        break;
      case 'notnullSelect':
        if (params.value == null || params.value === 0 || !params.value) {
          this.error = params.label + this.static_errorMsg.notNull;
          flag = false;
        }
        break;
    }
    return flag;
  },
};
