import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { aj } from './lib/arcjet.js';

import authroutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// 🔐 Optional: Arcjet protection, only outside dev
if (process.env.ARCJET_ENV !== 'development') {
  app.use(async (req, res, next) => {
    try {
      const decision = await aj.protect(req, { requested: 1 });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) return res.status(429).json({ message: 'Rate limit exceeded' });
        if (decision.reason.isBot()) return res.status(403).json({ message: 'Bot detected' });
        return res.status(403).json({ message: 'Forbidden' });
      }

      if (decision.results.some((r) => r.reason.isBot() && r.reason.isSpoofed())) {
        return res.status(403).json({ message: 'Spoofed bot detected' });
      }

      next();
    } catch (error) {
      console.error('Error in Arcjet middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}

// ✅ Routes
app.use('/api/auth', authroutes);
app.use('/api/products', productRoutes);

// 🧾 Registration route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (username, password) VALUES (${username}, ${hash})`;
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Username already exists' });
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 🛂 Login route with JWT
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (user.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user[0].id, username: user[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 🛠️ DB Setup
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Database connected and tables ensured');
  } catch (error) {
    console.error('Error initializing DB:', error);
  }
}

// 🚀 Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
