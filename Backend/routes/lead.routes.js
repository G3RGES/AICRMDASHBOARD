import { Router } from "express";

import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller.js";
import { protect } from "../middleware/auth.middleware.js";
