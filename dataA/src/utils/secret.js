/*
 * @Author: jwk
 * @Date:   2019-10-30 16:45:59
 * @Last Modified by: jwk
 * @Last Modified time: 2019-10-30 16:45:59
 * @Desc: 加密封装
 */

import CryptoJS from 'crypto-js'; // 导入加密模块
const key = CryptoJS.enc.Hex.parse('31323334353637383930414243444546');
const iv = CryptoJS.enc.Hex.parse('31323334353637383930414243444546');

/**
 * 加密方法
 * @param {String} word 需要加密的字符
 * @returns {String} 加密后的字符
 */
export function encrypt(word) {
  const encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString();
}

/**
 * 解密方法
 * @param {String} word 需要解密的字符
 * @returns {String} 解密后的字符
 */
export function decrypt(word) {
  let dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(word), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(dec);
}

export default {
  encrypt,
  decrypt
};

