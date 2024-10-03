const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

const checkIsAuthor = (req, res, next) => {
  if (!req.user || !req.user.isAuthor) {
    return res.status(403).json({ error: "Access denied. Authors only." });
  }
  next();
};

// Get all published posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { username: true } } },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Get all posts (published and unpublished)
router.get("/all", authMiddleware, checkIsAuthor, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { username: true } } },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { author: { select: { username: true } } },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

// Create a new post
router.post("/", authMiddleware, checkIsAuthor, async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: req.user.id,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
});

// Update a post
router.put("/:id", authMiddleware, checkIsAuthor, async (req, res) => {
  try {
    const { title, content, published } = req.body;
    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, published },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Delete a post
router.delete("/:id", authMiddleware, checkIsAuthor, async (req, res) => {
  try {
    await prisma.post.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

module.exports = router;
