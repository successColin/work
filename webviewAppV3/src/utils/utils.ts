import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Hex.parse('31323334353637383930414243444546');
const iv = CryptoJS.enc.Hex.parse('31323334353637383930414243444546');

// // 解密方法
export function Decrypt(word) {
  // const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  // const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  // const decrypt = CryptoJS.AES.decrypt(srcs, key,
  // { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  // const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  // return decryptedStr.toString();
  if (!word) return;
  const dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(word), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(dec);
}

// 加密方法
export function Encrypt(word) {
  if (!word) return;
  // const srcs = CryptoJS.enc.Utf8.parse(word);
  // console.log('CryptoJS.enc.Utf8.parse(word)', srcs);
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // return encrypted.ciphertext.toString().toUpperCase();
  return encrypted.ciphertext.toString();
}