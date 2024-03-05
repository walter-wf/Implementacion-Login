import mongoose from "mongoose";

export const connectionToDB = () =>
  mongoose
    .connect(
      "mongodb+srv://walterfranz:<password>@cluster0.3mc8zui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log("BBDD Conectada exitosamente"))
    .catch(() => console.log("Hubo un error en la conexión con la BBDD"));
