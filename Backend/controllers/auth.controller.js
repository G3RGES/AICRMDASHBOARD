import { User } from "../models/User";
import { asyncHandler } from "../utils/async_Handler";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/generateToken";

const toClientUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  avatar: user.avatar,
  createdAt: user.createdAt,
});
