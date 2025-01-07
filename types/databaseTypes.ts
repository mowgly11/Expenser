export type DataBaseOutput = {
    id: string,
    username: string,
    expenses: Array<Expense> | [],
    monthly_report: Array<Report> | []
}

export type Expense = {
    item: string,
    price: number,
    amount: number,
    date: string,
    category: string,
    picture: Buffer | null
}

export type Report = {
    date: string,
    total_spent: number,
    imp_percentage: number
}

export type UserDescription = {
    id: string,
    username: string
}