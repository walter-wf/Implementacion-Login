import { Router } from "express";
import { UserManager } from "../../dao/db/controllers/user.controllers.js";

const authRouter = Router();
const userManager = new UserManager();

authRouter.post("/login", async (req, res) => {
  const {email, password} = req.body
  try {
    const user = await userManager.getUserByEmailAndPassword(email, password);
    if (user) {
      req.session.user = user;
      res.status(200).redirect("/auth/profile"); 
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    await userManager.newUser({
      first_name,
      last_name,
      age,
      email,
      password,
    });

    res.status(200).redirect("/products");
  } catch (error) {
    res.status(500).json(error);
  }
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      res.status(500).json({ error: "Error al cerrar sesión" });
    } else {
      res.status(200).redirect("/auth/login");
    }
  });
});


export { authRouter };