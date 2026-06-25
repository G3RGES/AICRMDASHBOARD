import { ApiError } from "../utils/ApiError.js";

//* 404 handler for unknown API requests
export const notFound = (req, res, next) => {
  const error = new ApiError(
    404,
    `Not Found - ${req.method} ${req.originalUrl}`,
  );
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  //* Handle specific Mongoose errors
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  //* Handle duplicate key errors (e.g., unique constraint violations)
  if (err.code === 11000) {
    statusCode = 409;
    const failedField = Object.keys(err.keyValue || {})[0] || "unknown field";
    message = `Duplicate field value entered: ${failedField}`;
  }

  //* Handle validation errors (e.g., schema validation failures)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    console.error("💥", err);
  }

  //* Send the error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && statusCode === 500
      ? { stack: err.stack }
      : {}),
  });
};
