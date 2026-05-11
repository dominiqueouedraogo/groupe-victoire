import { Router, type IRouter } from "express";
import { db, newsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListNewsResponse, CreateNewsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const rows = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
  res.json(ListNewsResponse.parse(rows.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    author_id: n.authorId ?? null,
    created_at: n.createdAt.toISOString(),
  }))));
});

router.post("/news", async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db.insert(newsTable).values({
    title: parsed.data.title,
    content: parsed.data.content,
  }).returning();

  res.status(201).json({
    id: row.id,
    title: row.title,
    content: row.content,
    author_id: row.authorId ?? null,
    created_at: row.createdAt.toISOString(),
  });
});

export default router;
