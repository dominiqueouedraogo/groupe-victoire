import { Router, type IRouter } from "express";
import { db, cyclesTable } from "@workspace/db";
import { ListCyclesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/cycles", async (req, res): Promise<void> => {
  const cycles = await db.select().from(cyclesTable);
  res.json(ListCyclesResponse.parse(cycles.map(c => ({ id: c.id, name: c.name }))));
});

export default router;
