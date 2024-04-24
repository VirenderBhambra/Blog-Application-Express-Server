const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { Blog } = require("./schema");
const { User } = require("./schema");
const userRouter = require("./middleware/user");
const blogRouter = require("./middleware/blog");
const cookieParser = require("cookie-parser");
dotenv.config();

// const corsOptions = {
//   exposedHeaders: 'Authorization',
// };
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend origin
  methods: ['GET', 'POST'], // Allow only GET and POST requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specified headers
  exposedHeaders: ['Authorization'], // Expose Authorization header to frontend
  credentials: true,
}));
// Use cookie-parser middleware
app.use(cookieParser());

// Set up middleware to parse JSON bodies
app.use(express.json());


require("./middleware/dbConnect");

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
