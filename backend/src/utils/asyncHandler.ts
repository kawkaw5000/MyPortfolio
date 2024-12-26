import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (
    fn: (req: Request, res: Response) => Promise<Response>
  ) => {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res).catch(next);
    };
  };
  