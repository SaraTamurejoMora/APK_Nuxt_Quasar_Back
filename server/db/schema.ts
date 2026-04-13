import { sqliteTable, text, integer, real} from "drizzle-orm/sqlite-core";

// Tabla de usuarios
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull(),
  login: text("login").notNull(),
  password: text("password"),
});



export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  imageUrl: text("image_url"),
  title: text("title").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  collection: text("collection").notNull(),
  type: text("type").notNull(),

  createdAt: integer("created_at").notNull(),
});