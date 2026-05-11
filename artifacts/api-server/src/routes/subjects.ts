import { Router, type IRouter } from "express";
import { db, subjectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListSubjectsResponse, ListSubjectsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/subjects", async (req, res): Promise<void> => {
  const parsed = ListSubjectsQueryParams.safeParse(req.query);
  const cycleId = parsed.success ? parsed.data.cycle_id : undefined;

  let query = db.select().from(subjectsTable);
  const rows = cycleId
    ? await db.select().from(subjectsTable).where(eq(subjectsTable.cycleId, cycleId))
    : await db.select().from(subjectsTable);

  void query;
  res.json(ListSubjectsResponse.parse(rows.map(s => ({
    id: s.id,
    name: s.name,
    cycle_id: s.cycleId ?? null,
  }))));
});

export default router;
