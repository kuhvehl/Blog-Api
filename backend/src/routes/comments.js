const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all comments for a specific post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(req.params.postId) },
      include: { user: { select: { username: true } } },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Get a single comment
router.get("/:id", async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: { select: { username: true } } },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comment" });
  }
});

// Create a new comment (must be authenticated)
router.post("/post/:postId", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(req.params.postId),
        userId: req.user.id, // Assuming req.user.id is set after authentication
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Error creating comment" });
  }
});

// Update a comment (must be authenticated and the owner of the comment)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    // Check if the authenticated user is the owner of the comment
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { content },
    });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
});

// Delete a comment (must be authenticated and the owner of the comment)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Check if the authenticated user is the owner of the comment
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!req.user.isAuthor && comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
});

module.exports = router;
