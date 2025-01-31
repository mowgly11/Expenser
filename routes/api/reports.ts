import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';

export default {
  methods: ["post"],
  endpoint: "/api/reports",
  middleware: middleware.checkAuthenticated,
  Post: async function(req: Request, res: Response, next: NextFunction) {
    res.send("you are authenticated, id: ");
  }
};