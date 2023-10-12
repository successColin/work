/*
 * @Descripttion: 表单校验规则
 * @Author: ytx
 * @Date: 2021-04-20 13:45:31
 * @LastEditors: tjf
 * @LastEditTime: 2021-08-11 10:19:07
 */
import i18n from '@/i18n';
import { isValidCron } from 'cron-validator';

// cron表达式
export const validateComCron = (rule, value, callback) => {
  if (
    !isValidCron(value, {
      seconds: true,
      allowBlankDay: true,
      alias: true,
      allowSevenAsSunday: true,
    })
  ) {
    callback(new Error(i18n.t('expression.cronValid')));
  }
  callback();
};

// 手机号码
export const phoneNumber = (rule, value, callback) => {
  if (value === '') {
    callback(
      new Error(
        i18n.t('login.helloThePhoneNumberYouEnteredIsWrongPleaseEnterItAgain'),
      ),
    );
  } else {
    const regTel =
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (!regTel.test(value)) {
      callback(
        new Error(i18n.t('login.helloPleaseEnterTheCorrectPhoneNumber')),
      );
    }
    callback();
  }
};

// 邮箱
export const email = (rule, value, callback) => {
  if (value === '') {
    callback(new Error(i18n.t('login.helloPleaseEnterTheCorrectEmailAddress')));
  } else if (value !== '') {
    const checkEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!checkEmail.test(value)) {
      callback(
        new Error(i18n.t('login.helloPleaseEnterTheCorrectEmailAddress')),
      );
    } else {
      callback();
    }
  }
};

// 密码安全校验两种
export const securityCheckTwo =
  /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;

// 密码安全校验三种
export const securityCheckThree =
  /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/;

// 密码安全校验四种
export const securityCheckFour =
  /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[~!@#%_*])[a-zA-Z\d~!@#%_*]*$/;
