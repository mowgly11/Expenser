import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';
import database from "../../Database/methods.ts";
import type { Expense } from '../../types/databaseTypes.ts';
import { categories } from '../../config.json';

export default {
  methods: ["post"],
  endpoint: "/add_expense",
  middleware: middleware.checkAuthenticated,
  Post: async function (req: Request, res: Response, next: NextFunction) {
    let user: any = req.user;
    const expenseDescription: Expense = req.body;

    let datePattern: RegExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if(expenseDescription.item.length > 50) return res.json({ status: 'failed', message: "item is too bigger than 50 chars." });
    if(isNaN(expenseDescription.price) || expenseDescription.price < 0) return res.json({ status: 'failed', message: "price must be a positive number." });
    if(datePattern.test(expenseDescription.date) === false && expenseDescription.date != null) return res.json({ status: 'failed', message: "Invalid date. Format should be yyyy-mm-dd" });
    if(categories.indexOf(expenseDescription.category) === -1) return res.json({ status: 'failed', message: "Invalid date. Format should be dd-mm-yyyy" });

    let added = await database.addExpense(
      user._doc.id,
      {
        item: expenseDescription.item,
        price: Number.isInteger(expenseDescription.price) ? expenseDescription.price : parseFloat(expenseDescription.price.toFixed(2)),
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

  return `${day}-${month}-${year}`;
}