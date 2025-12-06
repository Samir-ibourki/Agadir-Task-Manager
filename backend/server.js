import express from "express";
import sequelize from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/tasksRoutes.js";
const app = express();
app.use(express.json());
const port = 3030;

import "./src/models/Users.js";
import "./src/models/Tasks.js";
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur.";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
});
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
