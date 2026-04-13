import { throwIfUserExists } from "~~/server/utils/registerUtils";


export default defineEventHandler(async (event) => {
    
    const { name, email, password } = await readBody(event);

    
    if (!name || !email || !password) {
        
        throw createError({ statusCode: 400, statusMessage: 'Falten camp per introduir :(' })

    }


    await throwIfUserExists(email);


    const newUser = await registerUser(name, email, password);

    const {password: repassword, ...userWithoutPassword} = newUser

    await setUserSession(event, {user: userWithoutPassword})

    return userWithoutPassword;
});
