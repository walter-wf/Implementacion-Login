import CartModel from "../schemas/carts.schemas.js";

class CartManager {
  async createCart() {
    try {
      const newCart = await CartModel.create({});
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      
      return cart;
    } catch (error) {}
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      let cart = await CartModel.findById(cartId).populate("products.id_prod");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find((product) =>
        product.id_prod._id.equals(productId)
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id_prod: productId, quantity });
      }

      cart = await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      let cart = await CartModel.findById(cartId).populate("products.id_prod");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = cart.products.find((product) =>
        product.id_prod._id.equals(productId)
      );
      if (!product) {
        throw new Error("Producto no encontrado en el carrito");
      }

      product.quantity = quantity;
      cart = await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad: ${error.message}`);
    }
  }
  async deleteProductsFromCart(cartId) {
    try {
      let cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      if (cart.products.length === 0) {
        return { msg: "El carrito ya está vacío" };
      }
  
      cart.products = [];
      cart = await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar los productos del carrito: ${error.message}`);
    }
  }

  async deleteProductInCart(cartId, productId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        {
          $pull: { products: { id_prod: productId } },
        },
        { new: true }
      );

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      throw new Error(
        `Error al eliminar producto del carrito: ${error.message}`
      );
    }
  }
}

export { CartManager };
