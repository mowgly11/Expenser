import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";

export default {
  methods: ["get"],
  endpoint: "/auth/google/callback",
  middleware: passport.authenticate('google', { failureRedirect: '/login', session: false }),
  Get: (req: Request, res: Response, next: NextFunction) => {
    let user: Express.User | undefined = req.user;
    let token;
    if(user) {
       token = jwt.sign({...user}, "super-secret-key", { expiresIn: 1000 * 60 * 5 });

       res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false, // must change on production
        maxAge: 1000 * 60 * 10
       });
    }

    res.status(200).redirect('/dashboard');
  }
};