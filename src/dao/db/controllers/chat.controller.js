import MessagesSchema from "../schemas/messages.schema.js";

class MessageManager {
  async newMessage({ email, message }) {
    try {
      const newMessage = await MessagesSchema.create({ email, message });
      return newMessage;
    } catch (error) {
      return {
        msg: "Error al crear el mensaje",
        error: {
          statusCode: 500,
          message:
            "Ocurrió un error al crear el mensaje. Por favor, inténtalo de nuevo más tarde.",
        },
      };
    }
  }
  async getMessages() {
    try {
      const allMessages = await MessagesSchema.find();
      return allMessages;
    } catch (error) {
      return {
        msg: "Error al obtenes los mensajes",
        error: {
          statusCode: 500,
          message:
            "Ocurrió un error al obtenes los mensajes. Por favor, inténtalo de nuevo más tarde.",
        },
      };
    }
  }
}

export { MessageManager };
