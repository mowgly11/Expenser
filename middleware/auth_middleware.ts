import type { Request, Response, NextFunction } from "express";

class Middleware {
    checkAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (!req.isAuthenticated()) return res.status(401).redirect('/login');
        next();
    }

    checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) return res.status(401).redirect('/dashboard');
        next();
    }
}

export default new Middleware();