import { Router } from "express";
import {
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protect);

router.route("/").get(getTask).put(updateTask);
router.route("/:id").delete(deleteTask);

export default router;
