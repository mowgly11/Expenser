import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export default {
  methods: ["get"],
  endpoint: "/auth/google/callback",
  middleware: passport.authenticate('google', { failureRedirect: '/login' }),
  Get: (req: Request, res: Response, next: NextFunction) => {
    res.status(200).redirect('/dashboard');
  }
};