import { Router } from "express";
import {ProductManager} from '../../dao/db/controllers/products.controllers.js'

const homeRouter = Router();
const productManager = new ProductManager();

homeRouter.get("/", async (req, res) => {
  const prods = await productManager.getProducts({})

  try {
    res.status(200).render("pages/home", {
      js: "/home.js",
      styles: "/styles",
      titulo: "Home",
      products: prods,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("pages/home", {
      js: "/home.js",
      styles: "/styles",
      titulo: "Home",
      products: [],
      error: `Hubo un error: ${error}`,
    });
  }
});
export { homeRouter };