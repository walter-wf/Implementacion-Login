import { Router } from "express";
const authViewsRouter = Router();

authViewsRouter.get("/login", async (req, res) => {
  res.status(200).render("pages/auth/login", {
    js: "/auth/login.js",
    styles: "/styles",
    titulo: "Iniciar sesión",
    error: null,
    layout: "auth",
  });
});

authViewsRouter.get("/profile", async (req, res) => {
  if (req.session.user) {
    const userInfo = req.session.user;

    res.status(200).render("pages/auth/profile", {
      js: "/auth/login.js",
      styles: "/styles",
      userInfo: userInfo,
      titulo: "Perfil",
      error: null,
      layout: "main",
    });
  } else {
    res.redirect("/auth/login");
  }
});

authViewsRouter.get("/register", async (req, res) => {
  res.status(200).render("pages/auth/register", {
    js: "/auth/register.js",
    styles: "/styles",
    titulo: "Registrarse",
    error: null,
    layout: "auth",
  });
});

export { authViewsRouter };