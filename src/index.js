import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoStore from "connect-mongo";

import path from "path";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { __dirname } from "./path.js";
import { connectionToDB } from "./dao/db/dbConnection.js";

import { prodRouter } from "./routes/endpoints/products.routes.js";
import { cartRouter, authRouter } from "./routes/endpoints/index.js";

import {
  homeViewsRouter,
  chatViewsRouter,
  cartViewsRouter,
  realTimeViewsRouter,
  prodViewsRouter,
  authViewsRouter,
} from "./routes/view-routes/index.js";

import { ProductManager } from "./dao/db/controllers/products.controllers.js";
import { MessageManager } from "./dao/db/controllers/chat.controller.js";

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
app.use(
  session({
    store: mongoStore.create({
      mongoUrl:
      "mongodb+srv://walterfranz:<password>@cluster0.3mc8zui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 1000,
    }),
    secret: "Maropli01",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para enviar el objeto io a las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware de autenticación
function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

// ** public **
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
      console.log(products);
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
app.use("/home", requireLogin, homeViewsRouter);
app.use("/products", requireLogin, prodViewsRouter);
app.use("/carts", requireLogin, cartViewsRouter);
app.use("/chat", requireLogin, chatViewsRouter);
app.use("/realtimeproducts", requireLogin, realTimeViewsRouter);

// Rutas de API
app.use("/api/products", requireLogin, prodRouter);
app.use("/api/carts", requireLogin, cartRouter);
app.use("/api/auth", authRouter);

// Rutas con vistas
app.use("/auth", authViewsRouter);
app.use("/home", homeViewsRouter);
app.use("/products", prodViewsRouter);
app.use("/carts", cartViewsRouter);
app.use("/chat", chatViewsRouter);
app.use("/realtimeproducts", realTimeViewsRouter);

app.use((req, res, next) => {
  res.status(404).render("pages/404", { layout: false });
});