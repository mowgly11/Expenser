import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';
import database from "../../Database/methods.ts";
import type { Expense } from '../../types/databaseTypes.ts';

let cooldown: boolean = false;
let cooldownTime: number = 0;

export default {
  methods: ["post"],
  endpoint: "/api/delete_expense",
  middleware: middleware.checkAuthenticated,
  Post: async function (req: Request, res: Response, next: NextFunction) {
    if(cooldown) return res.json({ status: 'failed', message: "slow it down." });
    let user: any = req.user;
    const id: string = req.body.id;

    if (typeof id !== "string") return res.json({ status: 'failed', message: "invalid ID" });

    let removeExpense: boolean = await database.removeItemById(user._doc.id, id, "expense");

    if (!removeExpense) return res.json({ status: 'failed', message: "there was an error, try again." });

    cooldown = true;
    setTimeout(() => cooldown = false, cooldownTime);
    return res.json({ status: 'ok', message: "successfully removed!" });
  }
};