import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';
import database from "../../Database/methods.ts";
import type { Expense } from '../../types/databaseTypes.ts';

export default {
  methods: ["post"],
  endpoint: "/api/delete_expense",
  middleware: middleware.checkAuthenticated,
  Post: async function (req: Request, res: Response, next: NextFunction) {
    let user: any = req.user;
    const id: string = req.body.id;

    if (typeof id !== "string") return res.json({ status: 'failed', message: "invalid ID" });

    let removeExpense: boolean = await database.removeItemById(user._doc.id, id, "expense");

    if (!removeExpense) return res.json({ status: 'failed', message: "there was an error, try again." });

    return res.json({ status: 'ok', message: "successfully removed!" });
  }
};