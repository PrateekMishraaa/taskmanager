import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";
import UserModel from "../../models/auth/UserModel.js"; // Assuming users exist

// Create a task (No authentication)
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status, userId } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required!" });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({ message: "Description is required!" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required!" });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const task = new TaskModel({
    title,
    description,
    dueDate,
    priority,
    status,
    user: userId,
  });

  await task.save();

  // Ensure user.tasks is initialized before pushing
  if (!Array.isArray(user.tasks)) {
    user.tasks = []; // Initialize tasks array if undefined
  }
  
  user.tasks.push(task._id);
  await user.save();

  res.status(201).json(task);
});


// Get all tasks for a specific user
// Get all tasks for a specific user by route parameter
export const getTasks = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters

  if (!userId) {
    return res.status(400).json({ message: "User ID is required!" });
  }

  const user = await UserModel.findById(userId).populate("tasks");

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json({ length: user.tasks.length, tasks: user.tasks });
});

// Get a single task by ID
export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required!" });
  }

  const task = await TaskModel.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  res.status(200).json(task);
});

// Update a task
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status, completed } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required!" });
  }

  const task = await TaskModel.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.dueDate = dueDate ?? task.dueDate;
  task.priority = priority ?? task.priority;
  task.status = status ?? task.status;
  task.completed = completed ?? task.completed;

  await task.save();

  res.status(200).json(task);
});

// Delete a single task
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Task ID is required!" });
  }

  const task = await TaskModel.findById(id);

  if (!task) {
    return res.status(404).json({ message: "Task not found!" });
  }

  await TaskModel.findByIdAndDelete(id);

  res.status(200).json({ message: "Task deleted successfully!" });
});
