import { ApiError } from "../utils/ApiError.js";

//* 404 handler for unknown API requests
export const notFound = (req, res, next) => {
  const error = new ApiError(
    404,
    `Not Found - ${req.method} ${req.originalUrl}`,
  );
  next(error);
};
