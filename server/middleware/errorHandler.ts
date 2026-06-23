import { Request, Response, NextFunction } from 'express';


export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // Industry standard response formatting
  const response: any = {
    status,
    message: err.message || 'An unexpected error occurred',
  };

  // Provide stacks/details only in development environment
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
    response.error = err;
  }

  // Handle specific MongoDB/Mongoose or validation failures gracefully
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      status: 'fail',
      message: `Invalid format for research field: ${err.path}`,
    });
    return;
  }

  if (err.code === 11000) {
    res.status(400).json({
      status: 'fail',
      message: 'Duplicate database entry detected.',
    });
    return;
  }

  res.status(statusCode).json(response);
};
