import { Lead } from "./../models/Lead.js";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";

export const getLeads = asyncHandler(async (req, res) => {
  const { status, priority, source, search } = req.query;

  const filter = { owner: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (source) filter.source = source;
  if (search) {
    const rx = new RegExp(search, "i");
    filter.$or = [{ name: rx }, { company: rx }, { email: rx }];
  }

  const leads = await Leads.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: leads.length, leads });
});

const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }
  res.json({ success: true, lead });
});

const createLead = asyncHandler(async (req, res) => {
  const lead = await Lead.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, lead });
});

const updateLead = asyncHandler(async (req, res) => {
  const { owner, ...updates } = req.body;

  const lead = Lead.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    updates,
    { new: true, runValidators: true },
  );
  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }
  res.json({ success: true, lead });
});

const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }
  res.json({ success: true, message: "Lead deleted" });
});
