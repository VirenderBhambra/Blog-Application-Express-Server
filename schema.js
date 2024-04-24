const mongoose = require("mongoose");
const { Schema } = mongoose;
const blogSchema = new Schema({
  title: String,
  description: String,
  content: String,
  author: String,
  user:String,
  description: String,
  slug: String,
  date: { type: Date, default: Date.now },
  hastags: String,
});

const Blog = mongoose.model("Blog", blogSchema);

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
});

const User = mongoose.model("User", userSchema);
module.exports = {
  Blog,
  User,
};
