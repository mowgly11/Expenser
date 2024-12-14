"use strict";

import type { PassportStatic } from 'passport';
import GoogleStrategy, { type Profile } from 'passport-google-oauth20';
import config from './config.json';
import database from './Database/methods.ts';
import type { DataBaseOutput } from './types/databaseTypes.ts';

function initialisePassport(passport: PassportStatic, getUserById: (id: string) => Promise<DataBaseOutput | null>) {
    passport.use(new GoogleStrategy.Strategy({
        clientID: config.client_id,
        clientSecret: config.client_secret,
        callbackURL: 'https://localhost:/auth/google/callback',
        scope: ['profile', 'email'],
    }, async (_accessToken, _refreshToken, profile: Profile, done) => {
        let user = await getUserById(profile.id);
        
        if (user) return done(null, profile);

        else {
            console.log(profile)
            /*let make_user = await database.makeUser({
                id: profile.id,
                username: profile.givenName
            });

            if(!make_user) return done(null, false, { message: "An Error Just Occured, Try Again Later" });*/

            return done(null, profile);
        }
    }));

    passport.serializeUser((user: any, done) => done(null, user.id));
    passport.deserializeUser((id: any, done) => {
        return done(null, getUserById(id));
    });
}

export default initialisePassport;