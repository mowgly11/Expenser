import type { Expense } from "../types/databaseTypes";


class ReportCalculator {
    constructor(private expenses: Expense[]) {
        this.expenses = expenses;
    }

    mostExpensiveItem(): Expense {
        return this.expenses.sort((a, b) => b.price - a.price)[0];
    }

    cheapestItem(): Expense {
        return this.expenses.sort((a, b) => a.price - b.price)[0];
    }

    mostBoughtItem(): [string, number] {
        let Items: Map<string, number> = new Map();
        this.expenses.forEach((ex) => {
            ex.item = ex.item.toLowerCase();

            let findItem = Items.get(ex.item); // need to check if this is a dangerous approach

            if (findItem != null) Items.set(ex.item, findItem + ex.amount);

            else Items.set(ex.item, ex.amount);
        });

        return new Map([...Items.entries()].sort((a, b) => b[1] - a[1])).entries().next().value;
    }

    mostSpentOnCategory(): [string, number] {
        let Items: Map<string, number> = new Map();
        this.expenses.forEach((ex) => {
            let findItem = Items.get(ex.category); // need to check if this is a dangerous approach

            if (findItem != null) Items.set(ex.category, findItem + (ex.price * ex.amount));

            else Items.set(ex.category, ex.price);
        });

        return new Map([...Items.entries()].sort((a, b) => b[1] - a[1])).entries().next().value;
    }

    mostSpentOnDay(): [string, number] {
        let Items: Map<string, number> = new Map();
        this.expenses.forEach((ex) => {
            let findItem = Items.get(ex.date); // need to check if this is a dangerous approach

            if (findItem != null) Items.set(ex.date, findItem + (ex.price * ex.amount));

            else Items.set(ex.date, ex.price);
        });

        return new Map([...Items.entries()].sort((a, b) => b[1] - a[1])).entries().next().value;
    }
}

export default ReportCalculator;