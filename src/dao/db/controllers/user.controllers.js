import { UserSchema } from "../schemas/users.schema.js";

class UserManager {
  async newUser({ name, lastname, age, email, password }) {
    try {
      const newUser = await UserSchema.create({
        name,
        lastname,
        age,
        email,
        password,
      });

      return newUser;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export { UserManager };
