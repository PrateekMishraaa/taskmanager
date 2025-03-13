import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
  // deleteAllTasks
} from "../controllers/task/taskController.js";

const router = express.Router();

router.post("/task/create", createTask);
router.get("/tasks", getTasks);
router.get("/task/:id", getTask);
router.patch("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);
// router.delete("/tasks/deleteAll", deleteAllTasks);

export default router;
