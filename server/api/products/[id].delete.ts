import { and, eq } from "drizzle-orm";
import * as schema from "~~/server/db/schema";
import { useDb } from "~~/server/utils";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
   const userId = Number(session.user.id)
    if (!Number.isFinite(userId)) {
    throw createError({ statusCode: 401, statusMessage: "Sessió invàlida (id)" })
    }
  const db = useDb();

  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: "ID invàlid" });
  }

  const deleted = await db
    .delete(schema.products)
    .where(and(eq(schema.products.id, id), eq(schema.products.userId, userId)))
    .returning();

  if (!deleted[0]) {
    throw createError({ statusCode: 404, statusMessage: "No existe o no es teu" });
  }

  return { ok: true };
});