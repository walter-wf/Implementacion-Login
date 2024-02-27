import { Router } from "express";
import { MessageManager } from "../../dao/db/controllers/chat.controller.js";

const chatRouter = Router();
const messageManager = new MessageManager()

chatRouter.get("/", (req, res) => {
  res.status(200).render("pages/chat", {
    js: "/chat.js",
    styles: "/styles",
    titulo: "Chat",
    error: null,
  });
});

chatRouter.post("/", async (req, res) => {
  const { email, message } = req.body;
  try {
    const newMessage = await messageManager.newMessage({ email, message });
    req.app.io.emit("newMessage", newMessage);

    res.status(200).send({ response: "Mensaje enviado", mensaje: newMessage });
  } catch (error) {
    res.status(400).send({ response: "Error", message: error });
  }
});

export {chatRouter};