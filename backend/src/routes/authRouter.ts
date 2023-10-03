import express from 'express';
import type { Request, Response } from 'express';
import * as LoginUserHandler from '../controllers/authController';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check } from 'express-validator';

import * as UserHandler from '../controllers/users.conroller';

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

            const user = await LoginUserHandler.loginUserHandler(email);
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
            console.log('register = ', request.body)
            const register = '555555555555';

            // const newCategory = await CategoryHandler.createCategoryHandler(request.body);
            return response.status(201).json(register);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);
