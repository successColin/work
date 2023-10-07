/**
 * 加密
 */
import CryptoJS from 'crypto-js'
import md5 from 'js-md5'

const key = "31323334353637383930414243444546" //秘钥
const keyC = CryptoJS.enc.Hex.parse(key)
const iv = CryptoJS.enc.Hex.parse("31323334353637383930414243444546") 
const EncryptionPSW = (params,PasswrodEncrypted,rule = 'CryptoJS') =>{ 
	let encyParasms = {}
	if(PasswrodEncrypted === "0"){//不进行加密
		encyParasms = params
	}else{
		for(let key in params){
			let EncryptionValue = "",
					value = params[key]
			if(rule.toLocaleLowerCase() === "md5"){//md5加密
				EncryptionValue = md5(`${value}`).toUpperCase()
			}else {//aes加密
				const encValue = CryptoJS.AES.encrypt(value ,keyC,{
					iv:iv,
					mode: CryptoJS.mode.CBC,  
					padding: CryptoJS.pad.Pkcs7
				})
				EncryptionValue = encValue.ciphertext.toString()
			}
			encyParasms[key] = EncryptionValue
		}
	}
	
	return encyParasms
}

export default EncryptionPSW