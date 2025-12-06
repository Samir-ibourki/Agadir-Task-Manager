import express from "express";
import {
  getTask,
  createtask,
  deleteTask,
  updateTask,
  markAsDone,
} from "../controllers/tasksController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.use(protect);

router.post("/", createtask);

router.get("/", getTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);
router.patch("/:id/done", markAsDone);

export default router;
