"use strict";

import express from 'express';
import type { Express, Request, Response } from 'express';
import passport from 'passport';
import compression from 'compression';
import flash from 'express-flash';
import bodyParser from 'body-parser';
import session from 'express-session';
import methodOverride from 'method-override';
import config from './config.json';
import initialisePassport from "./passport.ts";
import MongooseInit from './Database/connection.ts';
import database from './Database/methods.ts';

new MongooseInit(config.MONGODB_URL).connect();

initialisePassport(passport,
    async (id: string) => await database.getUser(id)
);

const app: Express = express();

app.set("x-powered-by", false);

app.use(express.json());
app.use(express.static(__dirname + `/views`));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 730 }
}));
app.use(compression({
    etag: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get('/', async(req: Request, res: Response) => {
    //await database.makeUser({ id: "321", username: "alex" });

    //await database.delete("321");
    
    //await database.updateUsername("321", "brahim");

    //await database.addExpense("321", { item: "eyoo", price: 2, date: "12/13/2024", category: "Food", picture: null });

    //await database.removeItemByIndex("321", 0, 'expense');

    //await database.flushData("321", 'expense');

    //await database.addMonthlyReport("321", { date: "12/13/2024", total_spent: 200, imp_percentage: 10 });

    res.send("success");
});

app.listen(config.port, () => console.log("listening on port " + config.port));