import type { NextFunction, Request, Response } from 'express';
import middleware from '../../middleware/auth_middleware.ts';

export default {
  methods: ["post"],
  endpoint: "/logout",
  middleware: middleware.checkAuthenticated,
  Post: (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('auth_token');
    res.redirect('/login');
  }
};