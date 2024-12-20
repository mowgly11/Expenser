import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';

export default {
  methods: ["get"],
  endpoint: "/dashboard",
  middleware: middleware.checkAuthenticated,
  Get: async function (req: Request, res: Response, next: NextFunction) {
    let user: any = req.user;
    res.render("dashboard.ejs");
  }
};
