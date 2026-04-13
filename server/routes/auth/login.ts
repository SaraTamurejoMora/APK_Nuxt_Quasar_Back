export default defineEventHandler(async (event) => {
  await setUserSession(event, {
 
    user: {
      login: "atinux",
    },

    secure: {
      apiToken: "1234567890",
    },

    loggedInAt: new Date(),
  });
});
