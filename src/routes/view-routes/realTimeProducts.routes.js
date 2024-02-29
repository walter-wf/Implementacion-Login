import { Router } from "express";

const realTimeRouter = Router();

realTimeRouter.get("/", (req, res) => {
  const paginationInfo = 
  res.status(200).render("pages/realTimeProds", {
    js: "/realTimeProducts.js",
    styles: "/styles",
    titulo: "Listado de productos",
    error: null,
  });
});

export {realTimeRouter}