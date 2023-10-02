import express from 'express';
import type { Request, Response } from 'express';
import * as LoginUserHandler from '../controllers/authController';
import bcrypt from 'bcrypt';
export const authRouter = express.Router();

/**
 POST: Login
 */
authRouter.post(
    '/login',
    async (request: Request, response: Response) => {
        try {
            console.log('111 Login = ', request.body)

            const {email, password} = request.body.loginUserData;

            const user = await LoginUserHandler.loginUserHandler(email);
            console.log(88888888888, user)

            if (!user) {
                return response.status(400).json({message: `User ${email} not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            // const validPassword = bcrypt.compareSync(password, user.password)

            console.log(22222222222222, 'validPassword', validPassword)


            // const validPassword = bcrypt.compareSync(password, user.password)
            // if (!validPassword) {
            //     return response.status(400).json({message: `Incorrect password entered`})
            // }

            // const token = generateAccessToken(user._id, user.roles)

            // return response.json({token})


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
