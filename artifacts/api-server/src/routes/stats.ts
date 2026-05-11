import { Router, type IRouter } from "express";
import { db, profilesTable, resourcesTable, paymentsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { GetPlatformStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (req, res): Promise<void> => {
  const [totalUsersResult] = await db.select({ count: count() }).from(profilesTable);
  const [premiumResult] = await db.select({ count: count() }).from(profilesTable).where(eq(profilesTable.isPremium, true));
  const [candidatesResult] = await db.select({ count: count() }).from(profilesTable).where(eq(profilesTable.role, "candidate"));
  const [instructorsResult] = await db.select({ count: count() }).from(profilesTable).where(eq(profilesTable.role, "instructor"));
  const [resourcesResult] = await db.select({ count: count() }).from(resourcesTable);
  const [pendingResult] = await db.select({ count: count() }).from(paymentsTable).where(eq(paymentsTable.status, "pending"));

  res.json(GetPlatformStatsResponse.parse({
    total_users: Number(totalUsersResult?.count ?? 0),
    premium_users: Number(premiumResult?.count ?? 0),
    total_resources: Number(resourcesResult?.count ?? 0),
    total_candidates: Number(candidatesResult?.count ?? 0),
    total_instructors: Number(instructorsResult?.count ?? 0),
    pending_payments: Number(pendingResult?.count ?? 0),
  }));
});

export default router;
