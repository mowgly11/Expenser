"use strict";

import express from 'express';
import type { Express, Request, Response } from 'express';
import passport from 'passport';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import config from './config.json';
import initialisePassport from "./passport.ts";
import MongooseInit from './Database/connection.ts';
import database from './Database/methods.ts';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';

new MongooseInit(config.MONGODB_URL).connect();

const app: Express = express();

app.set("x-powered-by", false);
app.set("view-engine", "ejs");

app.use(express.json());
app.use(express.static(__dirname + `/views`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(compression({
    etag: false
}));
app.use(passport.initialize());
app.use(methodOverride("_method"));

initialisePassport(passport,
    async (id: string) => await database.getUser(id)
);

const methodMap = new Map([
    ["get", { method: "get", callback: "Get" }],
    ["post", { method: "post", callback: "Post" }],
    ["delete", { method: "delete", callback: "Delete" }],
]);

const endpointsPath = path.join(__dirname, "routes");

const readEndpointsDirectory = (directoryPath: string, app: any, methodMap: any) => {
    const files = fs.readdirSync(directoryPath);

    files.forEach(async (file) => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) readEndpointsDirectory(filePath, app, methodMap);

        else if (stat.isFile() && file.endsWith(".ts")) {
            const module = await import(`file://${filePath}`);
            const { endpoint, methods, middleware } = module.default;

            methods.forEach((method: string) => {
                const { callback, method: httpMethod } = methodMap.get(method);
                if (typeof middleware === 'function') app[httpMethod](endpoint, middleware, module.default[callback]);
                else app[httpMethod](endpoint, module.default[callback]);
            });
        }
    });
};

readEndpointsDirectory(endpointsPath, app, methodMap);

app.listen(config.port, () => console.log("listening on port " + config.port));