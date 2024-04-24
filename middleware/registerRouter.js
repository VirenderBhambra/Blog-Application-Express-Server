const express = require("express");
const router = express.Router();
const {User} = require("../schema");
const CryptoJS = require("crypto-js");

router.post("/", async (req, res) => {
  try {
    const encryptedData = req.body.encryptedData;
    const user = JSON.parse(
      CryptoJS.AES.decrypt(encryptedData, "secret_key").toString(
        CryptoJS.enc.Utf8
      )
    );

    user.password = CryptoJS.AES.encrypt(
      JSON.stringify(user.password),
      "secret_key"
    ).toString();

    const obj = await User.findOne({ email: user.email });
    if (obj) {
      res.status(400).json({ error: "User already exists" });
    } else {
      const newuser = User(user);
      await newuser.save();
      res.send({ message: "user created" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
