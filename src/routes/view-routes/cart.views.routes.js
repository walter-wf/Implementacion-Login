import { Router } from "express";
import { CartManager } from "../../dao/db/controllers/cart.controller.js";

const cartViewsRouter = Router();
const cartManager = new CartManager();

cartViewsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.getCartById(cid);


    // si no lo paso asi no puedo renderizar en handlebars :S
    const payload = cart.products.map((doc) => doc.toObject());

    console.log(cart);
    if (!cart) {
      return res.redirect("/error");
    }

    res.status(200).render("pages/carts", {
      js: "/cart.js",
      cart: payload,
      styles: "/styles",
      titulo: "Cart",
      error: null,
    });
  } catch (error) {
    console.error("Error de la  vista de carrito:", error);
    res.status(500).send("Error interno al renderizar vista de carrito");
  }
});

export { cartViewsRouter };
