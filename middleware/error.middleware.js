// doing this so that we don't have to use try catch

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // optional

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn((req, res, next)).catch(next);
  };
};

// handle JWT Error

export const handleJWTError = () => {
  throw new ApiError("Invalid token. Please login again", 401);
};
