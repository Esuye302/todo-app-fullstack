import query from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const registerUserService = async (userData) => {
  const { email, password } = userData;
  const existingUser = await query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (existingUser.length > 0) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  return { id: result.insertId, email };
};
const loginUserService = async (credentials) => {
  try {
    const { email, password } = credentials;
    const user = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (!user.length) {
      res.status(400).json({ message: "Invalid email or password" });
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid password" });
      throw new Error("Invalid password");
    }
    console.log(user[0].role);
    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export { registerUserService, loginUserService };
