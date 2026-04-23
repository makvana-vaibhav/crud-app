const express = require("express");
const router = express.Router();
const { pool } = require("../db");

const isValidName = (name) => typeof name === "string" && name.trim().length > 0;

// Create user
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Name is required" });
    }

    const result = await pool.query(
      "INSERT INTO users(name) VALUES($1) RETURNING *",
      [name.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create user failed:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

// Get users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Load users failed:", error);
    res.status(500).json({ message: "Failed to load users" });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Name is required" });
    }

    const result = await pool.query(
      "UPDATE users SET name=$1 WHERE id=$2 RETURNING *",
      [name.trim(), req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update user failed:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete user failed:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;