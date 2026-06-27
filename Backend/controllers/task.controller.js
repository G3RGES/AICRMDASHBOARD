import { Task } from "./../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getTask = asyncHandler(async (req, res) => {
  const { status, priority, relatedLead } = req.query;
  const filter = { owner: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (relatedLead) filter.relatedLead = relatedLead;

  const task = await Task.find(filter)
    .sort({ status: 1, dueDate: 1, createdAt: -1 })
    .populate("relatedLead", "name company")
    .populate("relatedContact", "name company");

  res.status(200).json({ success: true, count: task.length, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { owner, ...updates } = req.body;

  if (updates.status === "Completed" && !updates.completedAt) {
    updates.completedAt = new Date();
  }
  if (updates.status && updates.status !== "Completed") {
    updates.completedAt = null;
  }

  const task = await Task.findOneAndUpdate(
    { owner: req.user._id, _id: req.params.id },
    updates,
    { new: true, runValidators: true },
  );
  if (!task) throw new ApiError("Task not found", 404);
  res.json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.json({ success: true, message: "Task deleted" });
});
