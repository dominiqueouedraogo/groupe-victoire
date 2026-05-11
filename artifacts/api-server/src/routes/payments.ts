import { Router, type IRouter } from "express";
import { db, paymentsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  ListPaymentsResponse,
  SubmitPaymentBody,
  ApprovePaymentParams,
  RejectPaymentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapPayment(p: typeof paymentsTable.$inferSelect) {
  return {
    id: p.id,
    user_id: p.userId,
    amount: Number(p.amount),
    method: p.method,
    transaction_name: p.transactionName ?? null,
    phone: p.phone ?? null,
    city: p.city ?? null,
    proof_url: p.proofUrl ?? null,
    status: p.status,
    created_at: p.createdAt.toISOString(),
  };
}

router.get("/payments", async (req, res): Promise<void> => {
  const rows = await db.select().from(paymentsTable).orderBy(desc(paymentsTable.createdAt));
  res.json(ListPaymentsResponse.parse(rows.map(mapPayment)));
});

router.post("/payments", async (req, res): Promise<void> => {
  const parsed = SubmitPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const d = parsed.data;
  // user_id must come from auth middleware; use a placeholder for now
  const userId = (req.headers["x-user-id"] as string) ?? "00000000-0000-0000-0000-000000000000";

  const [row] = await db.insert(paymentsTable).values({
    userId,
    amount: String(d.amount),
    method: d.method,
    transactionName: d.transaction_name ?? null,
    phone: d.phone ?? null,
    city: d.city ?? null,
    proofUrl: d.proof_url ?? null,
    status: "pending",
  }).returning();

  res.status(201).json(mapPayment(row));
});

router.patch("/payments/:id/approve", async (req, res): Promise<void> => {
  const params = ApprovePaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.update(paymentsTable)
    .set({ status: "approved" })
    .where(eq(paymentsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  res.json(mapPayment(row));
});

router.patch("/payments/:id/reject", async (req, res): Promise<void> => {
  const params = RejectPaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.update(paymentsTable)
    .set({ status: "rejected" })
    .where(eq(paymentsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  res.json(mapPayment(row));
});

export default router;
