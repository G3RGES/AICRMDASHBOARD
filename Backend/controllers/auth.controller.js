import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/User.js";

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

  const user = await User.create({ name, email, password, company });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: toClientUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please add all fields");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  // console.log("Found user:", user); //* DEBUG & TEST
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: toClientUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: toClientUser(req.user),
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, company, avatar, password } = req.body;
  const user = req.user;

  if (name !== undefined) user.name = name;
  if (company !== undefined) user.company = company;
  if (avatar !== undefined) user.avatar = avatar;
  if (password) user.password = password;

  await user.save();

  res.json({
    success: true,
    user: toClientUser(user),
  });
});
