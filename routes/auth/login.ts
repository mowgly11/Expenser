import type { NextFunction, Request, Response } from 'express';
import middleware from '../../middleware/auth_middleware.ts';

export default {
  methods: ["get"],
  endpoint: "/login",
  middleware: middleware.checkNotAuthenticated,
  Get: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render("login.ejs")
  }
};