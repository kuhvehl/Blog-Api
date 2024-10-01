const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, isAuthor: user.isAuthor },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;
