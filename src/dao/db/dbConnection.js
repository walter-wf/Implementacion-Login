import mongoose from "mongoose";

export const connectionToDB = () =>
  mongoose
    .connect(
      "mongodb+srv://walterfranz:PPATlZpDvsijuMWD@cluster0.wbdeg65.mongodb.net/e-commerce"
    )
    .then(() => console.log("BBDD Conectada exitosamente"))
    .catch(() => console.log("Hubo un error en la conexión con la BBDD"));
