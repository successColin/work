const returnFloat = (number) => { // 金额加小数点，保留2位
  if (number === 'undefined' || number === 'null' || number === '' || typeof number === 'undefined') {
    return ''
  }
  let value = Math.round(parseFloat(number) * 100) / 100
  let xsd = value.toString().split('.')
  if (xsd.length === 1) {
    value = value.toString() + '.00'
    return value
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + '0'
    }
    return value
  }
}

/*
	大数字每3位添加逗号
	@method addCommas
	@param {Number} number 需要转换的数字
*/
const addCommas = (number) => {
  let newStr = ''
  let count = 0
  let str = ''
  if (number === 0 || number === '0') {
    return '0'
  }
  if (number) {
    str = number + ''
  } else {
    return ' '
  }
  if (str.indexOf('.') === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
    return str
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr // 逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
    return str
  }
}

const stringToDate = (dateString) => { // 字符串转Date类型
  if (DATE_REGEXP.test(dateString)) {
    let timestamp = dateString.replace(DATE_REGEXP, function($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
      let date = new Date($year, ($month - 1), $day, $hour || '00', $minute || '00', $second || '00', $milliscond || '00')
      return date.getTime()
    })
    let date = new Date()
    date.setTime(timestamp)
    return date
  }
  return null
}

export default {
	returnFloat,
	addCommas,
	stringToDate
}