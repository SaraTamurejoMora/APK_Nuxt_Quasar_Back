import { and, asc, desc, eq, like, or } from "drizzle-orm";
import * as schema from "~~/server/db/schema";
import { useDb } from "~~/server/utils";

export default defineEventHandler(async (event) => {
  const db = useDb();
  const query = getQuery(event);

  const q = typeof query.q === "string" ? query.q.trim() : "";
  const type = typeof query.type === "string" ? query.type.trim() : "";
  const sort = typeof query.sort === "string" ? query.sort : "newest";

  const whereParts: any[] = [];

  if (type) whereParts.push(eq(schema.products.type, type));

  if (q) {
    const needle = `%${q}%`;
    whereParts.push(
      or(
        like(schema.products.title, needle),
        like(schema.products.description, needle),
        like(schema.products.collection, needle)
      )
    );
  }

  const where = whereParts.length ? and(...whereParts) : undefined;

  const orderBy =
    sort === "priceAsc"
      ? asc(schema.products.price)
      : sort === "priceDesc"
      ? desc(schema.products.price)
      : desc(schema.products.createdAt); // newest default

  return db.select().from(schema.products).where(where).orderBy(orderBy);
});