/**
 * @name: .eslintrc.js
 * @author: DELL
 * @date: 2021/12/20 8:45
 * @description：.eslintrc.js
 * @update: 2021/12/20 8:45
 */
module.exports = {
  //一旦配置了root，ESlint停止在父级目录中查找配置文件
  root: true,
  //解析器
  // parser: "babel-eslint",
  //想要支持的JS语言选项
  parserOptions: {
    parser: "babel-eslint",
    //启用ES6语法支持(如果支持es6的全局变量{env: {es6: true}}，则默认启用ES6语法支持)
    //此处也可以使用年份命名的版本号：2015
    ecmaVersion: 2021,
    //默认为script
    sourceType: "module",
    //支持其他的语言特性
    ecmaFeatures: {
      //...
    }
  },
  //代码运行的环境，每个环境都会有一套预定义的全局对象，不同环境可以组合使用
  env: {
    es6: true,
    browser: true,
    jquery: true
  },
  //访问当前源文件中未定义的变量时，no-undef会报警告。
  //如果这些全局变量是合规的，可以在globals中配置，避免这些全局变量发出警告
  globals: {
    //配置给全局变量的布尔值，是用来控制该全局变量是否允许被重写
    test_param: true,
  },
//支持第三方插件的规则，插件以eslint-plugin-作为前缀，配置时该前缀可省略
//检查vue文件需要eslint-plugin-vue插件
  plugins: ["vue"],
//集成推荐的规则
  extends: ["eslint:recommended", "plugin:vue/essential"],
  //启用额外的规则或者覆盖默认的规则
  //规则级别分别：为"off"(0)关闭、"warn"(1)警告、"error"(2)错误--error触发时，程序退出
  rules: {
    //关闭“禁用console”规则
    "no-console": "off",
    //缩进不规范警告，要求缩进为2个空格，默认值为4个空格
    "indent": ["warn", 2, {
      //设置为1时强制switch语句中case的缩进为2个空格
      "SwitchCase": 1,
      //分别配置var、let和const的缩进
      "VariableDeclarator": {"var": 2, "let": 2, "const": 3}
    }],
    //定义字符串不规范错误，要求字符串使用双引号
    quotes: ["error", "single"],
    "space-before-function-paren": 0,  // 函数定义时括号前面要不要有空格
    "eol-last": 0,  // 文件以单一的换行符结束
    "no-extra-semi": 0, // 可以多余的冒号
    "semi": 0,  // 语句可以不需要分号结尾
    "eqeqeq": 0, // 必须使用全等
    "one-var": 0, // 连续声明
    "no-undef": 0, // 可以 有未定义的变量

    // 警告
    "no-extra-boolean-cast": 1, // 不必要的bool转换
    "no-extra-parens": 1, // 非必要的括号
    "no-empty": 1, // 块语句中的内容不能为空
    "no-use-before-define": [1, "nofunc"], // 未定义前不能使用
    "complexity": [1, 10], // 循环复杂度
    "no-unused-vars": 1, // 不能有声明后未被使用的变量或参数
    // // vue
    // "flow-vars/define-flow-type": 2,
    // "flow-vars/use-flow-type": 2,
    //
    // // react
    // "react/jsx-uses-react": 2,
    // "react/jsx-uses-vars": 2,

    // 错误
    "comma-dangle": [2, "never"], // 对象字面量项尾不能有逗号
    "no-debugger": 2, // 禁止使用debugger
    "no-constant-condition": 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    "no-dupe-args": 2, // 函数参数不能重复
    "no-dupe-keys": 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    "no-duplicate-case": 2, // switch中的case标签不能重复
    "no-empty-character-class": 2, // 正则表达式中的[]内容不能为空
    "no-invalid-regexp": 2, // 禁止无效的正则表达式
    "no-func-assign": 2, // 禁止重复的函数声明
    "valid-typeof": 2,  // 必须使用合法的typeof的值
    "no-unreachable": 2, // 不能有无法执行的代码
    "no-unexpected-multiline": 2, // 避免多行表达式
    "no-sparse-arrays": 2, // 禁止稀疏数组， [1,,2]
    "no-shadow-restricted-names": 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    "no-cond-assign": 2, // 禁止在条件表达式中使用赋值语句
    "no-native-reassign": 2, // 不能重写native对象

    // 代码风格
    "no-else-return": 1, // 如果if语句里面有return,后面不能跟else语句
    "no-multi-spaces": 1, // 不能用多余的空格
    "key-spacing": [1, {  // 对象字面量中冒号的前后空格
      "beforeColon": false,
      "afterColon": true
    }],
    "block-scoped-var": 2, // 块语句中使用var
    "consistent-return": 2, // return 后面是否允许省略
    "accessor-pairs": 2, // 在对象中使用getter/setter
    "dot-location": [2, "property"], // 对象访问符的位置，换行的时候在行首还是行尾
    "no-lone-blocks": 2, // 禁止不必要的嵌套块
    "no-labels": 2, // 禁止标签声明
    "no-extend-native": 2, // 禁止扩展native对象
    "no-floating-decimal": 2, // 禁止省略浮点数中的0 .5 3.
    "no-loop-func": 2, // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    "no-new-func": 2,  // 禁止使用new Function
    "no-self-compare": 2, // 不能比较自身
    "no-sequences": 2, // 禁止使用逗号运算符
    "no-throw-literal": 2, // 禁止抛出字面量错误 throw "error";
    "no-return-assign": [2, "always"], // return 语句中不能有赋值表达式
    "no-redeclare": [2, {   // 禁止重复声明变量
      "builtinGlobals": true
    }],
    "no-unused-expressions": [2, {  // 禁止无用的表达式
      "allowShortCircuit": true,
      "allowTernary": true
    }],
    "no-useless-call": 2, // 禁止不必要的call和apply
    "no-useless-concat": 2,
    "no-void": 2, // 禁用void操作符
    "no-with": 2, // 禁用with
    "space-infix-ops": 2, // 中缀操作符周围要不要有空格
    // "valid-jsdoc": [2, { // jsdoc规则
    //   "requireParamDescription": false,
    //   "requireReturnDescription": false
    // }],
    "no-warning-comments": [1, {  // 不能有警告备注
      "terms": ["todo", "fixme", "any other term"],
      "location": "anywhere"
    }],
    "curly": 1, // 必须使用 if(){} 中的{}
    // common js
    "no-duplicate-imports": 1
    //....
    //更多规则可查看http://eslint.cn/docs/rules/
  }
}
