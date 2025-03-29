const CryptoJS = require("crypto-js");

exports.encryptData = (data, secret) => {
  return CryptoJS.AES.encrypt(data, secret).toString();
};

exports.decryptData = (ciphertext, secret) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};
