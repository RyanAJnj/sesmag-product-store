import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../config/db.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (username, password) VALUES (${username}, ${hash})
    `;
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const users = await sql`
    SELECT * FROM users WHERE username = ${username}
  `;
  const user = users[0];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
});

export default router;
