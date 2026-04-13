import { eq } from "drizzle-orm";
import * as schema from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Falten credencials",
    });
  }

  const db = useDb();

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Credencials incorrectes",
    });
  }

  if (!user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: "Aquest compte només pot entrar amb Github",
    });
  }

  const isValidPassword = await verifyPassword(user.password, password);

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: "Credencials incorrectes",
    });
  }

  const { password: _password, ...userWithoutPassword } = user;

  await setUserSession(event, {
    user: userWithoutPassword,
    loggedInAt: new Date(),
  });

  return userWithoutPassword;
});