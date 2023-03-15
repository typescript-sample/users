import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { ParamsDictionary, Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

interface User {
    id: string,
    username?: string,
    displayName?: null,
    email?: string,
    password?: string,
    successTime?: string,
    failTime?: string,
    failCount?: number,
    lockedUntilTime?: number,
    history?: any,
    iat?: number,
    exp: number
}

export const verify = (token: string, secret: string): Promise<User> => {
    return Promise.resolve(jwt.verify(token, secret) as User)
}

export class MiddlewareAuth {
    constructor(private secret: string) {
        this.auth = this.auth.bind(this);
    }
    auth(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>, next: NextFunction) {
        const token = req?.get("Authorization")?.replace("Bearer ", "")
        if (!token || token === "") {
            return res.status(403).send(`'Authorization' is required in http request header.'`);
        }
        try {
            let user = jwt.verify(token, this.secret) as User
            if (Date.now() >= user.exp * 1000) {
                return res.status(403).send("Token expired");
            }
            next()
        } catch (error) {
            return res.status(403).send("Invalid Authorization token");
        }

    }
}