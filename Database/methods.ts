"use strict";

import schema from './schema.ts';
import type { DataBaseOutput, UserDescription, Report, Expense } from '../types/databaseTypes.ts';
import type { Document } from 'mongoose';

class DatabaseMethods {
    async getUser(id: any): Promise<DataBaseOutput | null> {
        const user: DataBaseOutput | null = await schema.findOne({ id });
        if (user) return user;
        else return null;
    }

    async makeUser(userProps: UserDescription): Promise<Document | boolean> {
        let user: Document;
        try {
            user = await schema.create({
                id: userProps.id,
                username: userProps.username,
                expenses: [],
                monthly_report: [],
            });

            await user.save();

            return user;
        } catch (e) {
            //console.log(e);
            return false;
        }

    }

    async delete(id: string, existingUser: DataBaseOutput | null = null): Promise<boolean> {
        let user: any;
        try {
            if (existingUser) user = existingUser;
            else user = await this.getUser(id);
            
            if (user) {
                await schema.deleteOne({ id });
            } else throw new Error("Invalid User");
            
        } catch (e) {
            //console.log(e);
            return false;
        }
        return true;
    }

    async updateUsername(id: string, username: string, existingUser: DataBaseOutput | null = null): Promise<boolean> {
        let user: any;
        try {
            if (existingUser) user = existingUser;
            else user = await this.getUser(id);

            if (user) {
                user.username = username;
            } else throw new Error("Invalid User");

            await user.save();
        } catch (err) {
            //console.log(err);
            return false;
        }

        return true;
    }

    async addExpense(id: string, expense: Expense, existingUser: DataBaseOutput | null = null): Promise<Document | boolean> {
        let user: any;
        try {
            if (existingUser) user = existingUser;
            else user = await this.getUser(id);

            if (user) {
                user.expenses.push(expense);
            } else throw new Error("Invalid User");

            await user.save();
        } catch (e) {
            //console.log(e);
            return false;
        }
        
        return user;
    }

    async addMonthlyReport(id: string, report: Report, existingUser: DataBaseOutput | null = null): Promise<boolean> {
        let user: any;
        try {
            if (existingUser) user = existingUser;
            else user = await this.getUser(id);

            if (user) {
                user.monthly_report.push(report);
            } else throw new Error("Invalid User");

            await user.save();
        } catch (e) {
            //console.log(e);
            return false;
        }

        return true;
    }

    async removeItemById(userId: string, id: string, type: "expense" | "report"): Promise<boolean> {
        let user: any;
        try {
            user = await this.getUser(userId);

            if (!user) throw new Error("Invalid User");

            switch(type){
                case "expense":
                    let foundExpense = user.expenses.findIndex((e: Report | Expense) => e.id === id);
                    if(foundExpense === -1) return false;
                    user.expenses.splice(foundExpense, 1);
                    break;
                case "report":
                    let foundReport = user.monthly_report.findIndex((e: Report | Expense) => e.id === id);
                    if(foundReport === -1) return false;
                    user.monthly_report.splice(foundReport, 1);
                    break;
                default:
                    return false;
            }

            await user.save();
        } catch (e) {
            console.log(e);
            return false;
        }

        return true;
    }

    async flushData(id: string, type: "expense" | "report"): Promise<boolean> {
        let user: any;
        try {
            user = await this.getUser(id);

            if (!user) throw new Error("Invalid User");

            switch(type){
                case "expense":
                    user.expenses = [];
                    break;
                case "report":
                    user.monthly_report = [];
                    break;
                default:
                    throw new Error("Invalid type");
            }

            await user.save();
        } catch (e) {
            //console.log(e);
            return false;
        }

        return true;
    }

}

export default new DatabaseMethods();