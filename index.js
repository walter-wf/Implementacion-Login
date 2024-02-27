import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { __dirname } from "./path.js";
import { connectionToDB } from "./dao/db/dbConnection.js";

import { prodRouter } from "./routes/endpoints/products.routes.js";
import { homeRouter } from "./routes/view-routes/home.views.routes.js";
import { chatRouter } from "./routes/view-routes/chat.routes.js";
import { realTimeRouter } from "./routes/view-routes/realTimeProducts.routes.js";
import { ProductManager } from "./dao/db/controllers/products.controllers.js";
import { MessageManager } from "./dao/db/controllers/chat.controller.js";
import { prodViewsRouter } from "./routes/view-routes/products.views.routes.js";
import { cartRouter } from "./routes/endpoints/cart.routes.js";
import { cartViewsRouter } from "./routes/view-routes/cart.views.routes.js";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();
const messageManager = new MessageManager();

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

connectionToDB();

// ** Middlewares **
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para enviar el objeto io a las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ** Setting public **
app.use("/", express.static(path.join(__dirname, "/public")));

// ** Handlebars **
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// ** Socket **
io.on("connection", (socket) => {
  console.log("socket conectado");
  //* CHAT
  socket.on("loadChats", async () => {
    try {
      const messages = await messageManager.getMessages();
      socket.emit("showMessages", messages);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }
  });
  socket.on("newMessage", async (data) => {
    try {
      const newMessage = await messageManager.newMessage(data);
      io.emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
    }
  });

  //* RealTimeProducts
  socket.on("getProducts", async () => {
    try {
      const products = await productManager.getProducts({});
      console.log(products)
      socket.emit("prodsData", products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  });

  socket.on("newProduct", async (data) => {
    try {
      const newProduct = await productManager.createProduct(data);
      io.emit("newProduct", newProduct);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
  socket.on("removeProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      io.emit("productRemoved", productId);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  });
});

// ** Endpoints **
app.use("/api/products", prodRouter);
app.use("/api/carts", cartRouter);

// ** Routes con vistas **
app.use("/home", homeRouter);
app.use('/products', prodViewsRouter)
app.use('/carts', cartViewsRouter)
app.use("/chat", chatRouter);
app.use("/realtimeproducts", realTimeRouter);