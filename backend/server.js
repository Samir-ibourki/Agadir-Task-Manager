import express from "express";
import sequelize from "./src/config/database.js";
const app = express();
app.use(express.json());
const port = 3030;

import "./src/models/Users.js";
import "./src/models/Tasks.js";

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("databased synced successfully !");
  })
  .catch((err) => {
    console.log("Error databased", err);
  });

app.listen(port, () => {
  console.log(`server running in ${port}`);
});
