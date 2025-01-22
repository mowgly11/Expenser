import type { Request, Response, NextFunction } from 'express';
import middleware from '../../middleware/auth_middleware.ts';
import database from "../../Database/methods.ts";
import type { Expense } from '../../types/databaseTypes.ts';
import sanitize from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid';

const sanitizeItem = (item: string) => sanitize(item, {
  allowedTags: [], // Allow no HTML tags
  allowedAttributes: {}, // Allow no attributes
});

const categories = ["food", "clothing", "drinks", "bills", "transportation"];

export default {
  methods: ["post"],
  endpoint: "/add_expense",
  middleware: middleware.checkAuthenticated,
  Post: async function (req: Request, res: Response, next: NextFunction) {
    let user: any = req.user;
    const { item, price, amount, date, category }: Expense = req.body;

    let datePattern: RegExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    const sanitizedItem = sanitizeItem(item);

    if (typeof sanitizedItem !== 'string' || sanitizedItem.length > 50 || sanitizedItem.length < 3) return res.json({ status: 'failed', message: "item is larger than 50 chars or less than 3 chars." });
    if (typeof price !== 'number' || isNaN(price) || price < 0 || price > 9999999999) return res.json({ status: 'failed', message: "price must be a positive number." });
    if (typeof amount !== 'number' || isNaN(amount) || !Number.isInteger(amount) || amount < 0 || amount > 9999999999) return res.json({ status: 'failed', message: "amount must be a positive number." });
    if (datePattern.test(date) === false && date != null) return res.json({ status: 'failed', message: "Invalid date. Format should be yyyy-mm-dd" });
    if (categories.indexOf(category) === -1) return res.json({ status: 'failed', message: "Invalid category" });

    let added = await database.addExpense(
      user._doc.id,
      {
        id: uuidv4(),
        item,
        price,
        amount,
        date: date ?? getNewDate(),
        category
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