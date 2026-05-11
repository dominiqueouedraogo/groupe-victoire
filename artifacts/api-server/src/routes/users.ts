import { Router, type IRouter } from "express";
import { db, profilesTable } from "@workspace/db";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import {
  ListUsersQueryParams,
  ListUsersResponse,
  ToggleUserPremiumParams,
  ToggleUserPremiumBody,
  ToggleUserPremiumResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapProfile(p: typeof profilesTable.$inferSelect) {
  return {
    id: p.id,
    full_name: p.fullName ?? null,
    email: p.email,
    phone: p.phone ?? null,
    city: p.city ?? null,
    role: p.role,
    domain: p.domain ?? null,
    is_premium: p.isPremium,
    trial_access: p.trialAccess,
    premium_expiry_date: p.premiumExpiryDate ? p.premiumExpiryDate.toISOString() : null,
    created_at: p.createdAt.toISOString(),
  };
}

router.get("/users", async (req, res): Promise<void> => {
  const parsed = ListUsersQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : {};

  const conditions: SQL[] = [];
  if (params.role) conditions.push(eq(profilesTable.role, params.role));
  if (params.search) conditions.push(ilike(profilesTable.fullName, `%${params.search}%`));

  const rows = conditions.length
    ? await db.select().from(profilesTable).where(and(...conditions))
    : await db.select().from(profilesTable);

  res.json(ListUsersResponse.parse(rows.map(mapProfile)));
});

router.patch("/users/:id/toggle-premium", async (req, res): Promise<void> => {
  const params = ToggleUserPremiumParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ToggleUserPremiumBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const expiryDate = body.data.premium_expiry_date
    ? new Date(body.data.premium_expiry_date)
    : null;

  const [row] = await db.update(profilesTable)
    .set({
      isPremium: body.data.is_premium,
      premiumExpiryDate: expiryDate,
    })
    .where(eq(profilesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(ToggleUserPremiumResponse.parse(mapProfile(row)));
});

export default router;
