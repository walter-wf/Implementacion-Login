import { Router } from "express";
import { ProductManager } from "../../dao/db/controllers/products.controllers.js";

const prodViewsRouter = Router();
const productManager = new ProductManager();

prodViewsRouter.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const prods = await productManager.getProducts({ limit, page, sort, query });
console.log(prods)
  try {
    res.status(200).render("pages/products", {
      js: "/products.js",
      products: prods,
      styles: "/styles",
      titulo: "Productos",
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("pages/products", {
      js: "/products.js",
      styles: "/styles",
      titulo: "Productos",
      products: [],
      error: `Hubo un error: ${error}`,
    });
  }
});

export { prodViewsRouter };
