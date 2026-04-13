import * as schema from "~~/server/db/schema";
import { useDb } from "~~/server/utils";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const userId = Number(session.user.id)
    if (!Number.isFinite(userId)) {
    throw createError({ statusCode: 401, statusMessage: "Sessió invàlida (id)" })
    }
  const db = useDb();

  const body = await readBody(event);


  if (!body?.title || !body?.collection || !body?.type) {
    throw createError({ statusCode: 400, statusMessage: "Falten camps obligatoris" });
  }

  const inserted = await db
    .insert(schema.products)
    .values({
      userId: userId,
      title: String(body.title),
      price: Number(body.price ?? 0),
      description: body.description ? String(body.description) : null,
      collection: String(body.collection),
      type: String(body.type),
      imageUrl: body.imageUrl ?? null,
      createdAt: Date.now(),
    })
    .returning();

  return inserted[0];
});