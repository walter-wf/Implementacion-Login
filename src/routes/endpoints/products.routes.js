import { Router } from "express";
import { ProductManager } from "../../dao/db/controllers/products.controllers.js";

const prodRouter = Router();
const productManager = new ProductManager();

// Get
prodRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const response = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get byId
prodRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await productManager.getProductById(id);
    if (!response.prod) {
      res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Post
prodRouter.post("/", async (req, res) => {
  const { title, description, category, includes, thumbnail, price, code } =
    req.body;

  try {
    const prod = await productManager.createProduct({
      title,
      description,
      category,
      includes,
      thumbnail,
      price,
      code,
    });
    res.status(200).json({ prod });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Put
prodRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category, includes, thumbnail, price, code } =
    req.body;

  try {
    const response = await productManager.updateProduct(id, {
      title,
      description,
      category,
      includes,
      thumbnail,
      price,
      code,
    });

    if (!response.error) {
      res.status(200).json(response);
    } else {
      const statusCode = response.error.statusCode || 500;
      res.status(statusCode).json(response);
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
});

// Delete
prodRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await productManager.deleteProduct(id);
    if (!response.error) {
      res.status(200).json(response);
    } else {
      const statusCode = response.error.statusCode || 500;
      res.status(statusCode).json(response);
    }
  } catch (error) {
    // Error interno del servidor
    res.status(500).json({
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
});

export { prodRouter };