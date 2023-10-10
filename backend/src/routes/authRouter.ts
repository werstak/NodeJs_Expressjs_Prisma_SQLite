import express from 'express';
import type { Request, Response } from 'express';
import * as AuthUserHandler from '../controllers/authController';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { check } from 'express-validator';

import * as UserHandler from '../controllers/users.conroller';
// import * as GenerateJWT  from '../utils/jwt';
import { generateTokens } from '../utils/jwt';
import { hashToken } from '../utils/hashToken';

export interface RefreshToken {
    userId: number
    jti: string
    iat: number
    exp: number
}


export const authRouter = express.Router();


/**
 POST: Register
 */
authRouter.post(
    '/register',
    async (request: Request, response: Response) => {
        try {
            const {email, password} = request.body.registerUserData;
            const user = request.body.registerUserData;
            const hashPassword = bcrypt.hashSync(user.password, 7);

            if (!email || !password) {
                return response.status(400).json({message: `You must provide an email and a password`})
            }

            const existingUser = await AuthUserHandler.findUserByEmail(email);
            if (existingUser) {
                return response.status(400).json({message: `Email already in use`})
            }

            user.password = hashPassword;
            const createdUser = await UserHandler.createUserHandler(user);
            const userId = createdUser.newUser.id;

            const jti: any = uuidv4();
            const {accessToken, refreshToken} = generateTokens(createdUser.newUser, jti);
            await AuthUserHandler.addRefreshTokenToWhitelist({jti, refreshToken, userId});

            return response.status(201).json({
                accessToken,
                refreshToken
            });

        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 POST: Login
 */
authRouter.post(
    '/login',
    // [
    //     check('username', 'Username cannot be empty').notEmpty(),
    //     check('password', 'The password must be more than 3 and less than 50 characters').isLength({min: 3, max: 50})
    // ],

    async (request: Request, response: Response) => {
        try {
            const {email, password} = request.body.loginUserData;
            // const {oldRefreshToken} = request.body.refreshToken;

            if (!email || !password) {
                return response.status(400).json({message: `You must provide an email and a password`})
            }
            const existingUser = await AuthUserHandler.findUserByEmail(email);
            const userId = existingUser.id;
            if (!existingUser) {
                return response.status(400).json({message: `User ${email} not found`})
            }

            const validPassword = bcrypt.compareSync(password, existingUser.password)
            if (!validPassword) {
                return response.status(400).json({message: `Incorrect password entered`})
            }




            // if (!oldRefreshToken) {
            //     return response.status(400).json({message: `Missing refresh token.`})
            // }
            // const payload: JwtPayload | any = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET as string);
            // const savedRefreshToken = await AuthUserHandler.findRefreshTokenById(payload.jti);
            //
            // if (!savedRefreshToken) {
            //     return response.status(401).json({message: `Unauthorized`})
            // }
            // await AuthUserHandler.revokeTokens(savedRefreshToken.id);



            const jti: any = uuidv4();
            const {accessToken, refreshToken} = generateTokens(existingUser, jti);
            const userInfo = {
                id: existingUser.id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                role: existingUser.role
            };
            await AuthUserHandler.addRefreshTokenToWhitelist({jti, refreshToken, userId});
            return response.status(201).json({
                userInfo,
                accessToken,
                refreshToken
            });
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 POST: RefreshToken
 */
authRouter.post(
    '/refreshToken',
    async (request: Request, response: Response) => {
        try {
            const {refreshToken} = request.body;

            if (!refreshToken) {
                return response.status(400).json({message: `Missing refresh token.`})
            }
            const payload: JwtPayload | any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
            const savedRefreshToken = await AuthUserHandler.findRefreshTokenById(payload.jti);

            if (!savedRefreshToken) {
                return response.status(401).json({message: `Unauthorized`})
            }

            const hashedToken = hashToken(refreshToken);
            if (hashedToken !== savedRefreshToken.hashedToken) {
                return response.status(401).json({message: `Unauthorized`})
            }

            const user = await UserHandler.findUserById(payload.userId);
            if (!user) {
                return response.status(401).json({message: `Unauthorized`})
            }

            await AuthUserHandler.revokeTokens(savedRefreshToken.id);
            // await AuthUserHandler.deleteRefreshToken(savedRefreshToken.id);
            const jti: any = uuidv4();
            const {accessToken, refreshToken: newRefreshToken} = generateTokens(user, jti);
            await AuthUserHandler.addRefreshTokenToWhitelist({jti, refreshToken: newRefreshToken, userId: user.id});

            return response.status(201).json({
                accessToken,
                refreshToken: newRefreshToken
            });


        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


authRouter.post(
    '/revokeRefreshTokens',
    async (request: Request, response: Response) => {
        try {
            console.log(222222, 'revokeRefreshTokens')
            const {refreshToken} = request.body;

            if (!refreshToken) {
                return response.status(400).json({message: `Missing refresh token.`})
            }
            const payload: JwtPayload | any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
            const savedRefreshToken = await AuthUserHandler.findRefreshTokenById(payload.jti);

            if (!savedRefreshToken) {
                return response.status(401).json({message: `Unauthorized`})
            }

            await AuthUserHandler.revokeTokens(savedRefreshToken.id);
            return response.status(201).json({message: `Tokens revoked for user`});
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


// authRouter.post(
//     '/revokeRefreshTokens',
//     async (request: Request, response: Response) => {
//         try {
//             console.log(222222, 'revokeRefreshTokens')
//             const {userId} = request.body;
//             await AuthUserHandler.revokeTokens(userId);
//             return response.status(201).json({message: `Tokens revoked for user with id #${userId}`});
//         } catch (error: any) {
//             return response.status(500).json(error.message);
//         }
//     }
// );
