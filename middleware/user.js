const express = require("express");
const router = express.Router();
const { User } = require("../schema");
const CryptoJS = require("crypto-js");

const { decrypt } = require("../helper/crypto");
const { encrypt } = require("../helper/crypto");
const { generateToken } = require("./jwt");
const { verifyToken } = require("./jwt");

// decrypts the user information for login and register routes
router.use(async (req, res, next) => {
  req.body.data = decrypt(req.body.data);
  next();
});

//encrypts password for register use case only
router.use("/register", function (req, res, next) {
  req.body.data.password = encrypt(req.body.data.password);
  next();
});

router.post("/register", async function (req, res) {
  const user = req.body.data;
  try {
    const obj = await User.findOne({ email: user.email });
    if (obj) {
      res.status(200).json({ message: "User already exists" });
    } else {
      const newuser = User(user);
      await newuser.save();
      res.send({ message: "user created" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.post(
  "/login",
  async function (req, res, next) {
    const user = req.body.data;
    try {
      const obj = await User.findOne({ email: user.email });
      if (
        obj &&
        obj.email === user.email &&
        decrypt(obj.password) === user.password
      ) {
        req.user = obj;
        next();
      } else {
        res.status(404).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  },
  generateToken
);

module.exports = router;
