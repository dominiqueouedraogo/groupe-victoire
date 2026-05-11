import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { profilesTable } from "./profiles";
import { cyclesTable } from "./cycles";

export const userCyclesTable = pgTable("user_cycles", {
  userId: uuid("user_id").notNull().references(() => profilesTable.id),
  cycleId: uuid("cycle_id").notNull().references(() => cyclesTable.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.cycleId] }),
}));
