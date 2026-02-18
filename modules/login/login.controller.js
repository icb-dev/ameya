const jwt = require("jsonwebtoken");
const service = require("./login.service");
const { requireAuth } = require("../../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_MAX_AGE = process.env.JWT_EXPIRES_IN || "7d";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await service.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const valid = service.verifyPassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: TOKEN_MAX_AGE }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

/** Verify token and return current user (for frontend to check auth). */
exports.me = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

/** Change password (requires current password). */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await service.getUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (!service.verifyPassword(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    await service.updatePassword(req.user.id, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
};
