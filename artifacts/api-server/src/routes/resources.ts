import { Router, type IRouter } from "express";
import { db, resourcesTable } from "@workspace/db";
import { eq, and, ilike, type SQL } from "drizzle-orm";
import {
  ListResourcesQueryParams,
  ListResourcesResponse,
  CreateResourceBody,
  GetResourceParams,
  GetResourceResponse,
  DeleteResourceParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/resources", async (req, res): Promise<void> => {
  const parsed = ListResourcesQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};

  const conditions: SQL[] = [];
  if (params.subject_id) conditions.push(eq(resourcesTable.subjectId, params.subject_id));
  if (params.content_type) conditions.push(eq(resourcesTable.contentType, params.content_type));
  if (params.is_free != null) conditions.push(eq(resourcesTable.isFree, params.is_free));
  if (params.search) conditions.push(ilike(resourcesTable.title, `%${params.search}%`));

  const rows = conditions.length
    ? await db.select().from(resourcesTable).where(and(...conditions))
    : await db.select().from(resourcesTable);

  res.json(ListResourcesResponse.parse(rows.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description ?? null,
    content_type: r.contentType,
    file_url: r.fileUrl ?? null,
    thumbnail_url: r.thumbnailUrl ?? null,
    is_free: r.isFree,
    subject_id: r.subjectId ?? null,
    author_id: r.authorId ?? null,
    created_at: r.createdAt.toISOString(),
  }))));
});

router.post("/resources", async (req, res): Promise<void> => {
  const parsed = CreateResourceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const d = parsed.data;
  const [row] = await db.insert(resourcesTable).values({
    title: d.title,
    description: d.description ?? null,
    contentType: d.content_type,
    fileUrl: d.file_url ?? null,
    thumbnailUrl: d.thumbnail_url ?? null,
    isFree: d.is_free,
    subjectId: d.subject_id ?? null,
  }).returning();

  res.status(201).json(GetResourceResponse.parse({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    content_type: row.contentType,
    file_url: row.fileUrl ?? null,
    thumbnail_url: row.thumbnailUrl ?? null,
    is_free: row.isFree,
    subject_id: row.subjectId ?? null,
    author_id: row.authorId ?? null,
    created_at: row.createdAt.toISOString(),
  }));
});

router.get("/resources/:id", async (req, res): Promise<void> => {
  const params = GetResourceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(resourcesTable).where(eq(resourcesTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  res.json(GetResourceResponse.parse({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    content_type: row.contentType,
    file_url: row.fileUrl ?? null,
    thumbnail_url: row.thumbnailUrl ?? null,
    is_free: row.isFree,
    subject_id: row.subjectId ?? null,
    author_id: row.authorId ?? null,
    created_at: row.createdAt.toISOString(),
  }));
});

router.delete("/resources/:id", async (req, res): Promise<void> => {
  const params = DeleteResourceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.delete(resourcesTable).where(eq(resourcesTable.id, params.data.id)).returning();
  if (!row) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
