const jwt = require("jsonwebtoken");

function generateToken(req, res, next) {
  const payload = {
    id: req.user._id,
    email: req.user.email,
  };
  const options = {
    expiresIn: "1h",
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  res.setHeader("Authorization", `Bearer ${token}`);
  res
    .status(200)
    .json({
      message: "Token generated",
      author: req.user.firstName + " " + req.user.lastName,
      user: req.user.email,
    });
}

const verifyToken = (req, res, next) => {
  // Get the token from the request headers or query string or cookie, etc.
  let token = req.headers.cookie.split(' ')[2];
  token = decodeURIComponent(token).split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token Login Again" });
  }
};

module.exports = { generateToken, verifyToken };
