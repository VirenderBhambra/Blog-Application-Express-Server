const express = require("express");
const router = express.Router();
const { Blog } = require("../schema");
const { verifyToken } = require("../middleware/jwt");
const parseCookies = require("../helper/cookieParser");

router.get("/ften", async function (req, res) {
  try {
    const blogs = await Blog.find(
      {},
      { title: 1, description: 1, author: 1, slug: 1 }
    ).limit(10);
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/myBlogs", async function (req, res) {
  const userId = req.headers.user;
  const blog = await Blog.find(
    { user: userId },
    { title: 1, description: 1, author: 1, date: 1, hashtags: 1, slug: 1 }
  );
  res.status(200).json(blog);
});

router.get("/all", async function (req, res) {
  const blogs = await Blog.find(
    {},
    { title: 1, description: 1, author: 1, slug: 1 }
  );
  res.status(200).json(blogs);
});

router.get("/allSlug", async function (req, res) {
  const slugs = await Blog.find({}, { slug: 1 });
  res.status(200).json(slugs);
});

router.get("/s/:slug", async function (req, res) {
  const blog = await Blog.findOne(
    { slug: req.params.slug },
    { title: 1, content: 1, author: 1, date: 1, hashtags: 1 }
  );
  res.status(200).send(blog);
});

router.post("/post", verifyToken, async (req, res) => {
  const { hashtags, title, content, author, user } = req.body;
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

router.put("/post", verifyToken, async (req, res) => {
  const blog = req.body;
  try {
    const blogUpdate = await Blog.findOneAndUpdate(
      { _id: blog.blogID },
      {
        $set: {
          title: blog.data.title,
          content: blog.data.content,
          hashtags: blog.data.hashtags,
          description: blog.data.content.replace(/<[^>]+>/g, "").substring(0, 250),
        },
      },
      { new: true }
    );
    res.status(200).send("blogUpdate");
  } catch (error) {
    res.status(500).json({ error: "Error updating blog" });
  }
});
router.delete("/delete/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try{
    await Blog.findByIdAndDelete({_id: id});
    res.status(200).json({ message: "Blog deleted" });
  }
  catch(error) {
    res.send(500).json({ error: "Error deleting blog" });
  }
});
module.exports = router;
