import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pkg from "pg";

const { Pool } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function ensureSchema() {
  await pool.query(`
    create table if not exists tasks(
      id bigserial primary key,
      title text not null,
      done boolean not null default false,
      created_at timestamptz not null default now()
    );
  `);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "dist"))); // 构建后静态资源

// API
app.get("/api/health", (_req, res) => res.json({ ok: true, version: "0.97" }));

app.get("/api/tasks", async (_req, res) => {
  const { rows } = await pool.query("select id, title, done, created_at from tasks order by id desc");
  res.json(rows);
});
app.post("/api/tasks", async (req, res) => {
  const title = (req.body?.title || "").trim();
  if (!title) return res.status(400).json({ error: "title required" });
  const { rows } = await pool.query("insert into tasks(title) values($1) returning id, title, done, created_at", [title]);
  res.json(rows[0]);
});
app.patch("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  const done = !!req.body?.done;
  const { rows } = await pool.query("update tasks set done=$1 where id=$2 returning id, title, done, created_at", [done, id]);
  res.json(rows[0] || null);
});
app.delete("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  await pool.query("delete from tasks where id=$1", [id]);
  res.json({ ok: true });
});

app.get("*", (_req, res) => res.sendFile(join(__dirname, "dist", "index.html")));

ensureSchema().then(() => {
  app.listen(PORT, () => console.log(`GoQik v0.97 up on :${PORT}`));
});
