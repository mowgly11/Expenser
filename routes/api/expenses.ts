import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';
import database from '../../Database/methods.ts';

export default {
  methods: ["post"],
  endpoint: "/expenses",
  middleware: middleware.checkAuthenticated,
  Post: async function (req: Request, res: Response, next: NextFunction) {
    const amount: number = parseInt(req.body.amount);
    const start: number = parseInt(req.body.start);
    let user: any = req.user;

    if (!Number.isInteger(amount) || !Number.isInteger(start) || amount > 10 || amount < 0 || start < 0) return res.json({ status: 'failed', message: 'amount and start should be positive integers and of type number' });

    let data = await database.getUser(user._doc.id);

    return res.json({ status: 'ok', message: data?.expenses.slice(start, start + amount) });
  }
};