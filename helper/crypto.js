const CryptoJS = require("crypto-js");

function decrypt(encryptedData) {
  console.log(process.env.CRYPTO_SECRET);
  return JSON.parse(
    CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_SECRET).toString(
      CryptoJS.enc.Utf8
    )
  );
}

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_SECRET).toString();
}
module.exports = { encrypt, decrypt };
