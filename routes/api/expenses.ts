import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';

export default {
  methods: ["get"],
  endpoint: "/expenses",
  middleware: middleware.checkAuthenticated,
  Get: async function(req: Request, res: Response, next: NextFunction) {
    res.send("you are authenticated, id: " + req.session.passport?.user);
  }
};