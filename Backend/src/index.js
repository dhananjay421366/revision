import express from "express";
import { connectDB } from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log(`App  is listening on PORT :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Faild to  connecting to MongoDB", error);
    throw error;
  });

{
  /*

()(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.error("Error", error);
      throw err;
    });

    app.listen(process.env.PORT, (req, res) => {
      console.log(`App  is listening on PORT :${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error", error);
    throw err;
  }
})();
*/
}
