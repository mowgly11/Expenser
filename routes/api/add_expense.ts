import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';
import database from "../../Database/methods.ts";
import type { Expense } from '../../types/databaseTypes.ts';

export default {
  methods: ["post"],
  endpoint: "/add_expense",
  middleware: middleware.checkAuthenticated,
  Post: async function (req: Request, res: Response, next: NextFunction) {
    let user: any = req.user;
    const expenseDescription: Expense = req.body;

    if(expenseDescription.item.length > 50) return res.json({ status: 'failed', message: "item is too bigger than 50 chars." })
    if(isNaN(expenseDescription.price)) return res.json({ status: 'failed', message: "item is too bigger than 50 chars." })

    let added = await database.addExpense(
      user._doc.id,
      {
        item: expenseDescription.item,
        price: expenseDescription.price,
        date: expenseDescription.date ?? getNewDate(),
        category: expenseDescription.category,
        picture: expenseDescription.picture ?? null
      });

    if (!added) return res.json({ status: 'failed', message: "there was an error, try again." });
    return res.json({ status: 'ok', message: "successfully added!" });
  }
};

function getNewDate() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
}