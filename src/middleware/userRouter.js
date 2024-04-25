const express = require("express");
const router = express.Router();
const {User} = require("../schema");
const CryptoJS = require("crypto-js");

router.post("/", async (req, res) => {
  const encryptedData = req.body.encryptedData;
  const user = JSON.parse(
    CryptoJS.AES.decrypt(encryptedData, "secret_key").toString(
      CryptoJS.enc.Utf8
    )
  );

  try {
    const obj = await User.findOne({ email: user.email });
    if (obj &&
      obj.email === user.email &&
      JSON.parse(
        CryptoJS.AES.decrypt(obj.password, "secret_key").toString(
          CryptoJS.enc.Utf8
        )
      ) === user.password
    ) {
     
      res.status(200).json({ message: "ok" ,user:user});
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
