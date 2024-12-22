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
        } catch (e) {
            //console.log(e);
            return false;
        }

        return user;
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

    async addExpense(id: string, expense: Expense, existingUser: DataBaseOutput | null = null): Promise<boolean> {
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
        
        return true;
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

    async removeItemByIndex(id: string, index: number, type: "expense" | "report"): Promise<boolean> {
        let user: any;
        try {
            user = await this.getUser(id);

            if (!user) throw new Error("Invalid User");

            switch(type){
                case "expense":
                    user.expenses.splice(index, 1);
                    break;
                case "report":
                    user.monthly_report.splice(index, 1);
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