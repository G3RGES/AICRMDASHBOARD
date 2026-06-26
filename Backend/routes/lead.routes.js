import { Router } from "express";

import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  reorderLeads,
} from "../controllers/lead.controller.js";
import { protect } from "../middleware/auth.middleware.js";
