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
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: ['profile', 'email'],
    }, async (_accessToken, _refreshToken, profile: Profile, done) => {
        let user = await getUserById(profile.id);
        
        if (user) return done(null, user);

        else {
            let make_user = await database.makeUser({
                id: profile.id,
                username: profile.name == null ? `john_doe_${Date.now()}`: profile.name.givenName.trim().split(" ").join("_").toLowerCase()
            });

            if(make_user === false) return done(null, false, { message: "An Error Just Occured, Try Again Later" });

            return done(null, make_user);
        }
    }));
}

export default initialisePassport;