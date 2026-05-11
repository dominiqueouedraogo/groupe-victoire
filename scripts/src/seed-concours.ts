import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { cyclesTable, subjectsTable } from "@workspace/db";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const CONCOURS_SEED = [
  { name: "ENS", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Pédagogie", "Histoire-Géographie"] },
  { name: "INFAS", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Biologie", "Chimie"] },
  { name: "INFS", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit Social", "Économie"] },
  { name: "EAUX_FORETS", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Sciences Naturelles", "Géographie"] },
  { name: "POLICE", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit", "Éducation Physique"] },
  { name: "GENDARMERIE", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Droit", "Instruction Civique"] },
  { name: "ARMEE", subjects: ["Culture Générale", "Français", "Mathématiques", "Anglais", "Histoire", "Géographie"] },
];

async function seed() {
  console.log("Seeding new concours...");

  for (const concours of CONCOURS_SEED) {
    const existing = await db.select().from(cyclesTable).where(eq(cyclesTable.name, concours.name));

    let cycleId: string;
    if (existing.length > 0) {
      cycleId = existing[0].id;
      console.log(`  Cycle already exists: ${concours.name} (${cycleId})`);
    } else {
      const [inserted] = await db.insert(cyclesTable).values({ name: concours.name }).returning();
      cycleId = inserted.id;
      console.log(`  Created cycle: ${concours.name} (${cycleId})`);
    }

    const existingSubjects = await db.select().from(subjectsTable).where(eq(subjectsTable.cycleId, cycleId));
    const existingNames = new Set(existingSubjects.map((s) => s.name));

    for (const subjectName of concours.subjects) {
      if (!existingNames.has(subjectName)) {
        await db.insert(subjectsTable).values({ name: subjectName, cycleId });
        console.log(`    + Subject: ${subjectName}`);
      } else {
        console.log(`    ~ Subject exists: ${subjectName}`);
      }
    }
  }

  console.log("Done seeding!");
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
