import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
      const stmt = db.prepare("INSERT INTO newsletter (email) VALUES (?)");
      stmt.run(email);
      res.json({ success: true, message: "Subscribed successfully!" });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ error: "Email already subscribed" });
      }
      res.status(500).json({ error: "Database error" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, company, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

    try {
      const stmt = db.prepare("INSERT INTO clients (name, email, company, message) VALUES (?, ?, ?, ?)");
      stmt.run(name, email, company, message);
      res.json({ success: true, message: "Registration successful!" });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ error: "Email already registered" });
      }
      res.status(500).json({ error: "Database error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
