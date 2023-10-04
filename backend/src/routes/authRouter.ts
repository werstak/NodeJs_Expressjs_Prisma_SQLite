import express from 'express';
import type { Request, Response } from 'express';
import * as AuthUserHandler from '../controllers/authController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { check } from 'express-validator';

import * as UserHandler from '../controllers/users.conroller';
// import * as JWT  from '../utils/jwt';
import { generateTokens } from '../utils/jwt';

export const authRouter = express.Router();


const generateAccessToken = (id: any, email: any) => {
    const payload = {
        id,
        email
    }
    const secret = 'SECRET_KEY_RANDOM'

    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

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
            // console.log('111 Login = ', request.body)
            const {email, password} = request.body.loginUserData;

            if (!email || !password) {
                response.status(400);
                return response.status(400).json({message: `You must provide an email and a password`})
            }

            const user = await AuthUserHandler.findUserByEmail(email);
            console.log(111111111111, 'user', user)

            if (!user) {
                return response.status(400).json({message: `User ${email} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            console.log(22222222222222, 'validPassword', validPassword)

            if (!validPassword) {
                return response.status(400).json({message: `Incorrect password entered`})
            }

            const token = generateAccessToken(user.id, user.email)

            console.log(33333333, 'token', token)
            return response.status(201).json({token})

            // return response.status(201).json({user})

            // const newUser = await UserHandler.createUserHandler(user);
            // return response.status(201).json(newUser);


            // const newCategory = await CategoryHandler.createCategoryHandler(request.body);
            // const newCategory = await CategoryHandler.createCategoryHandler(request.body);
            // return response.status(201).json(user);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);

/**
 POST: Register
 */
authRouter.post(
    '/register',
    async (request: Request, response: Response) => {
        try {
            console.log(1111111, 'post register = ', request.body)

            const {email, password} = request.body.registerUserData;

            const user = request.body.registerUserData;
            const hashPassword = bcrypt.hashSync(user.password, 7);

            if (!email || !password) {
                return response.status(400).json({message: `You must provide an email and a password`})
            }


            const existingUser = await AuthUserHandler.findUserByEmail(email);
            console.log(2222222222222, 'existingUser', existingUser)

            if (existingUser) {
                return response.status(400).json({message: `Email already in use`})
            }

            user.password = hashPassword;
            const createdUser = await UserHandler.createUserHandler(user);
            const userId = createdUser.newUser.id;

            // const user = await createUserByEmailAndPassword({ email, password });
            // return response.status(201).json(newUser);

            const jti: any = uuidv4();
            const { accessToken, refreshToken } = generateTokens(createdUser.newUser, jti);

            // const { accessToken, refreshToken } = await JWT.generateTokens(newUser, jti);
            console.log(8888888, 'accessToken, refreshToken', accessToken, refreshToken)

            console.log(4545454545, 'createdUser', createdUser.newUser)
            console.log(5656565656, 'userId' , userId)

            await AuthUserHandler.addRefreshTokenToWhitelist({ jti, refreshToken, userId  });

            return response.status(201).json({
                accessToken,
                refreshToken
            });

        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);
