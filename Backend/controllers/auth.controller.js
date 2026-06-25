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

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, company } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please add all fields");
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const user = User.create({ name, email, password, company });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: toClientUser(user),
  });
});
