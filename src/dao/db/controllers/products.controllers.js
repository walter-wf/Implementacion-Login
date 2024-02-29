import { ProductSchema } from "../schemas/products.schema.js";

class ProductManager {
  async createProduct({
    title,
    description,
    category,
    includes,
    thumbnail,
    price,
    code,
  }) {
    try {
      const prod = await ProductSchema.create({
        title,
        description,
        category,
        includes,
        thumbnail,
        price,
        code,
      });
      return prod;
    } catch (error) {
      return {
        msg: "Error al crear el producto",
        error: {
          statusCode: 500,
          message:
            "Ocurrió un error al crear el producto. Por favor, inténtalo de nuevo más tarde.",
        },
      };
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query }) {
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      };

      let filter = {};

      if (query) {
        filter = { category: query };
      }

      const prods = await ProductSchema.paginate(filter, options);
      const payload = prods.docs.map((doc) => doc.toObject());

      const response = {
        status: "success",
        payload: payload,
        totalPages: prods.totalPages,
        prevPage: prods.prevPage,
        nextPage: prods.nextPage,
        page: prods.page,
        hasPrevPage: prods.hasPrevPage,
        hasNextPage: prods.hasNextPage,
        prevLink: prods.hasPrevPage
          ? `/products?limit=${options.limit}&page=${prods.prevPage}&sort=${
              sort || ""
            }&query=${query || ""}`
          : null,
        nextLink: prods.hasNextPage
          ? `/products?limit=${options.limit}&page=${prods.nextPage}&sort=${
              sort || ""
            }&query=${query || ""}`
          : null,
      };

      return response;
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Error al obtener los productos",
        error,
      };
    }
  }

  async getProductById(id) {
    try {
      const prod = await ProductSchema.findById(id);
      if (!prod) {
        return {
          msg: `No se encontró el producto con el id ${id}`,
          error: {
            statusCode: 404,
            message: `No se encontró ningún producto con el ID especificado (${id}).`,
          },
        };
      }
      return { prod };
    } catch (error) {
      throw {
        statusCode: 500,
        message: `Error al obtener el producto con el id ${id}`,
        error,
      };
    }
  }

  async updateProduct(
    id,
    { title, description, category, includes, thumbnail, price, code }
  ) {
    try {
      const updatedProduct = await ProductSchema.findByIdAndUpdate(
        id,
        { title, description, category, includes, thumbnail, price, code },
        { new: true }
      );
      if (!updatedProduct) {
        return {
          msg: `No se encontró el producto con el id ${id}`,
          error: {
            statusCode: 404,
            message: `No se encontró ningún producto con el ID especificado (${id}).`,
          },
        };
      }
      return { msg: "Producto actualizado correctamente", updatedProduct };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        msg: `Error al actualizar el producto con el id ${id}`,
        error: {
          statusCode: 500,
          message: `Ocurrió un error al actualizar el producto. Por favor, inténtalo de nuevo más tarde.`,
        },
      };
    }
  }

  async deleteProduct(id) {
    try {
      const prod = await ProductSchema.findByIdAndDelete(id);
      if (!prod) {
        return {
          error: {
            statusCode: 404,
            message: `No se encontró ningún producto con el ID especificado (${id}).`,
          },
        };
      }
      return { msg: `Producto eliminado correctamente` };
    } catch (error) {
      return {
        msg: `Error al eliminar el producto con el id ${id}`,
        error: {
          statusCode: 500,
          message: `Ocurrió un error al eliminar el producto. Por favor, inténtalo de nuevo más tarde.`,
        },
      };
    }
  }
}

export { ProductManager };
