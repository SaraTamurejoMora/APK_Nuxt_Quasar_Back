import { eq } from "drizzle-orm";
import * as schema from "../../db/schema";


export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
    async onSuccess(event, { user }) {
          const cfg = useRuntimeConfig()
    console.log("OAUTH CONFIG (server):", cfg.oauth?.github)
    if (!user.email) {
      throw createError({
        statusCode: 500,
        statusMessage: "No s'ha proporcionat l'email del teu compte Github",
      });
    }

    const db = useDb();

    let existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, user.email),
    });

    if (!existingUser) {
      const result = await db
        .insert(schema.users)
        .values({
          email: user.email,
          login: user.login,
          name: user.name ?? user.login,     
          password: null,                    
        })
        .returning();

      existingUser = result.at(0);
    }

    if (!existingUser) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error d'autentificació Github",
      });
    }

    const { password, ...userWithoutPswd } = existingUser;

    await setUserSession(event, {
      user: userWithoutPswd,  
    });

    return sendRedirect(event, "http://localhost:9000/#/");
  },

  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "http://localhost:9000/#/login");
  },
})