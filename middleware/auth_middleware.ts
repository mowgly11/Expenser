import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import database from '../Database/methods.ts';

class Middleware {
    checkAuthenticated(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.auth_token;

        if (!token) return res.status(403).redirect("/login");

        jwt.verify(token, 'super-secret-key', async (err: any, user: any) => {
            if (err) return res.status(403).redirect("/login");

            const userIsValid = await database.isValid(user._doc.id);

            if (userIsValid) req.user = user;
            else {
                res.clearCookie("auth_token");
                return res.redirect("/login");
            }
            
            next();
        });
    }

    checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.auth_token;

        if (token) {
            jwt.verify(token, 'super-secret-key', (err: any, user: any) => {
                if (!err) return res.status(403).redirect("/dashboard");
                
                next();
            });
        } else next();
    }

}

export default new Middleware();