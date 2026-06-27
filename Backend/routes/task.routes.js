import { Router } from "express";
import {
  getTask,
  updateTask,
  deleteTask,
  createTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.route("/").get(getTask).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
