export type DataBaseOutput = {
    id: string,
    username: string,
    expenses: Array<Expense> | [],
    monthly_report: Array<Report> | []
}

export type Expense = {
    id: string,
    item: string,
    price: number,
    amount: number,
    date: string,
    category: string,
}

export type Report = {
    id: string,
    date: string,
    total_spent: number,
    imp_percentage: number
}

export type UserDescription = {
    id: string,
    username: string
}