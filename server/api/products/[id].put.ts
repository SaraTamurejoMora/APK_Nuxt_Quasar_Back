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

  const body = await readBody(event);

  const updated = await db
    .update(schema.products)
    .set({
      title: typeof body.title === "undefined" ? undefined : String(body.title),
      price: typeof body.price === "undefined" ? undefined : Number(body.price),
      description:
        typeof body.description === "undefined"
          ? undefined
          : body.description
          ? String(body.description)
          : null,
      collection: typeof body.collection === "undefined" ? undefined : String(body.collection),
      type: typeof body.type === "undefined" ? undefined : String(body.type),
      imageUrl: typeof body.imageUrl === "undefined" ? undefined : String(body.imageUrl)
    })
    .where(and(eq(schema.products.id, id), eq(schema.products.userId, userId)))
    .returning();

  if (!updated[0]) {
    throw createError({ statusCode: 404, statusMessage: "No existe o no es teu" });
  }

  return updated[0];
});