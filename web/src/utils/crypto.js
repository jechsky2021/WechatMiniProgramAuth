// AES 加密工具类
// 注意：在实际项目中，密钥和偏移量应该从环境变量或后端获取，而不是硬编码

// 导入 crypto-js 库（需要先安装：npm install crypto-js）
import CryptoJS from 'crypto-js';

const AES_KEY = '1234567890123456'; // 16位密钥
const AES_IV = '1234567890123456'; // 16位偏移量

// // AES加密
// export function aesEncrypt(text) {
//   const key = CryptoJS.enc.Utf8.parse(AES_KEY);
//   const iv = CryptoJS.enc.Utf8.parse(AES_IV);
//   const encrypted = CryptoJS.AES.encrypt(text, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   });
//   return encrypted.toString();
// }

export function aesEncrypt(text) {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB, // 使用ECB模式，不需要IV
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

// AES解密
export function aesDecrypt(ciphertext) {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.ECB, // 使用ECB模式，不需要IV
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// // AES解密
// export function aesDecrypt(ciphertext) {
//   const key = CryptoJS.enc.Utf8.parse(AES_KEY);
//   const iv = CryptoJS.enc.Utf8.parse(AES_IV);
//   const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// }

// // AES 加密工具类
// // 注意：在实际项目中，密钥和偏移量应该从环境变量或后端获取，而不是硬编码
// const AES_KEY = '1234567890123456'; // 16位密钥
// const AES_IV = '1234567890123456'; // 16位偏移量

// // 将字符串转换为UTF-8编码的字节数组
// function stringToBytes(str) {
//   const bytes = [];
//   for (let i = 0; i < str.length; i++) {
//     bytes.push(str.charCodeAt(i));
//   }
//   return bytes;
// }

// // 将字节数组转换为字符串
// function bytesToString(bytes) {
//   const str = [];
//   for (let i = 0; i < bytes.length; i++) {
//     str.push(String.fromCharCode(bytes[i]));
//   }
//   return str.join('');
// }

// // PKCS#7填充
// function pkcs7Padding(data, blockSize) {
//   const padding = blockSize - (data.length % blockSize);
//   const pad = new Array(padding).fill(padding);
//   return [...data, ...pad];
// }

// // PKCS#7去填充
// function pkcs7Unpadding(data) {
//   const padding = data[data.length - 1];
//   return data.slice(0, -padding);
// }

// // 异或运算
// function xor(bytes1, bytes2) {
//   const result = [];
//   for (let i = 0; i < bytes1.length; i++) {
//     result.push(bytes1[i] ^ bytes2[i]);
//   }
//   return result;
// }

// // 循环左移
// function rol(bytes, shift) {
//   const result = new Array(bytes.length);
//   for (let i = 0; i < bytes.length; i++) {
//     result[i] = (bytes[i] << shift) | (bytes[i] >>> (8 - shift));
//   }
//   return result;
// }

// // 生成轮密钥
// function generateRoundKeys(key) {
//   // 简化的轮密钥生成，实际AES算法更复杂
//   const roundKeys = [key];
//   for (let i = 1; i < 11; i++) {
//     const lastKey = roundKeys[i - 1];
//     const newKey = [];
//     for (let j = 0; j < 16; j++) {
//       newKey[j] = lastKey[j] ^ i;
//     }
//     roundKeys.push(newKey);
//   }
//   return roundKeys;
// }

// // AES加密（简化版，实际项目中建议使用成熟的加密库）
// export function aesEncrypt(text) {
//   // 由于实现完整的AES算法比较复杂，这里使用一个简化的版本
//   // 在实际项目中，建议使用 crypto-js 等成熟的加密库
//   const textBytes = stringToBytes(text);
//   const paddedBytes = pkcs7Padding(textBytes, 16);
//   const keyBytes = stringToBytes(AES_KEY);
//   const ivBytes = stringToBytes(AES_IV);
  
//   const roundKeys = generateRoundKeys(keyBytes);
//   let state = paddedBytes;
  
//   // 简化的加密过程
//   for (let i = 0; i < 10; i++) {
//     // 轮密钥加
//     state = xor(state, roundKeys[i]);
//     // 字节替换、行移位、列混合（简化实现）
//     state = state.map(byte => (byte + i) % 256);
//   }
  
//   // 最后一轮轮密钥加
//   state = xor(state, roundKeys[10]);
  
//   // 转换为Base64字符串
//   return btoa(bytesToString(state));
// }

// // AES解密（简化版）
// export function aesDecrypt(ciphertext) {
//   // 简化的解密过程，与加密过程对应
//   const cipherBytes = stringToBytes(atob(ciphertext));
//   const keyBytes = stringToBytes(AES_KEY);
//   const ivBytes = stringToBytes(AES_IV);
  
//   const roundKeys = generateRoundKeys(keyBytes);
//   let state = cipherBytes;
  
//   // 最后一轮轮密钥加
//   state = xor(state, roundKeys[10]);
  
//   // 简化的解密过程
//   for (let i = 9; i >= 0; i--) {
//     // 字节替换、行移位、列混合的逆操作（简化实现）
//     state = state.map(byte => (byte - i + 256) % 256);
//     // 轮密钥加
//     state = xor(state, roundKeys[i]);
//   }
  
//   // 去填充
//   const unpaddedBytes = pkcs7Unpadding(state);
  
//   return bytesToString(unpaddedBytes);
// }