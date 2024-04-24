const CryptoJS = require("crypto-js");

function decrypt(encryptedData) {
  return JSON.parse(
    CryptoJS.AES.decrypt(encryptedData, "secret_key").toString(
      CryptoJS.enc.Utf8
    )
  );
}

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), "secret_key").toString();
}
module.exports = { encrypt, decrypt };
