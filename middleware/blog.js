const express = require("express");
const router = express.Router();
const { Blog } = require("../schema");
const { verifyToken } = require("../middleware/jwt");

router.use("/post", verifyToken); // verifies the token on POST

router.get("/all", async function (req, res) {
  const blogs = await Blog.find(
    {},
    { title: 1, description: 1, author: 1, slug: 1 }
  );
  res.status(200).json(blogs);
});

router.post("/post", async (req, res) => {
  const { hashtags, title, content, author ,user} = req.body;
  try {
    // description creation for blog post
    const contentWithoutHtml = content.replace(/<[^>]+>/g, "");
    const description = contentWithoutHtml.substring(0, 250);

    // slug creation
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    //blog post
    const newBlog = Blog({
      user,
      author,
      title,
      content,
      hashtags,
      description,
      slug,
    });
    await newBlog.save();
    res.status(201).json({ message: "New Blog Created" });
  } catch (error) {
    res.status(500).json({ error: "Error creating blog entry" });
  }
});

module.exports = router;
