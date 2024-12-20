import type { Request, Response, NextFunction } from "express";
import jwt, { type VerifyErrors, type JwtPayload } from "jsonwebtoken";

class Middleware {
    checkAuthenticated(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.auth_token;

        if (!token) return res.status(403).redirect("/login");

        jwt.verify(token, 'super-secret-key', (err: any, user: any) => {
            if (err) return res.status(403).redirect("/login");

            req.user = user;
            next();
        });
    }

    checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.auth_token;

        if (token) {
            jwt.verify(token, 'super-secret-key', (err: any) => {
                if (!err) return res.status(403).redirect("/dashboard");
                next();
            });
        } else next();
    }

}

export default new Middleware();