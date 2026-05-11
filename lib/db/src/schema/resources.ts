import { pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { subjectsTable } from "./subjects";
import { profilesTable } from "./profiles";

export const resourcesTable = pgTable("resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  contentType: text("content_type").notNull(), // lesson, annal, tip
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  isFree: boolean("is_free").notNull().default(false),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  authorId: uuid("author_id").references(() => profilesTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resourcesTable).omit({ id: true, createdAt: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resourcesTable.$inferSelect;
