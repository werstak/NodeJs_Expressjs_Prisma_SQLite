import express from 'express';
import type { Request, Response } from 'express';
import * as AuthUserHandler from '../controllers/authController';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { check } from 'express-validator';
import crypto from 'crypto';

import * as UserHandler from '../controllers/users.conroller';
// import * as GenerateJWT  from '../utils/jwt';
import { generateTokens } from '../utils/jwt';
import { hashToken } from '../utils/hashToken';
import { config } from 'dotenv';

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
            let userId = null;

            if (!existingUser) {
                return response.status(400).json({message: `User ${email} not found`})
            } else {
                userId = existingUser.id;
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
 GET: Valid Password
 */
authRouter.post(
    '/valid_password',
    async (request: Request, response: Response) => {

        try {
            const {email, password} = request.body.validPasswordData;

            if (!email || !password) {
                return response.status(400).json({message: `You must provide an email and a password`})
            }

            const existingUser = await AuthUserHandler.findUserByEmail(email);
            if (!existingUser) {
                return response.status(400).json({message: `User ${email} not found`})
            }

            const validPassword = bcrypt.compareSync(password, existingUser.password)
            if (!validPassword) {
                return response.status(201).json({
                    validPassword
                });
            } else if (validPassword) {
                return response.status(201).json({
                    validPassword
                });
            }
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 GET: Checking whether the Email exists in the database
 */
authRouter.post(
    '/verify_email',
    async (request: Request, response: Response) => {

        try {
            const {email} = request.body.verifyEmail;
            if (!email) {
                return response.status(400).json({message: `You must provide an email`})
            }
            const existingUserId = await AuthUserHandler.findUserIdByEmail(email);
            if (!existingUserId) {
                return response.status(400).json({message: `User ${email} not found`})
            } else {



                // TODO generateToken()
                // function which will generate a unique token with the help of the crypto package

                //   generate a random token for the client
                const generatedPasswordResetToken = crypto.randomBytes(32);

                //   check for error
                if (!generatedPasswordResetToken) {
                    return response.status(500).json({
                        message: "An error occured. Please try again later.",
                        status: "error",
                    });
                }
                //   converting the token to a hexstring

                console.log('generatedPasswordResetToken', generatedPasswordResetToken);
                const convertTokenToHexString = generatedPasswordResetToken.toString("hex");

                const expireTimeToken = Date.now() + 1800000;
                // 5 MINUTES
                // const expireTimeResetToken = Date.now() + 5 * 60 * 1000;
                const expireTimeResetToken = new Date(Date.now() + 5 * 60 * 1000);

                // const validPassword = bcrypt.compareSync(password, existingUser.password)

                console.log('convertTokenToHexString =', convertTokenToHexString);
                console.log('expireTimeToken =', expireTimeToken);

                console.log('existingUserId =', existingUserId);
                console.log('expireTimeResetToken =', expireTimeResetToken);

                // WRITE THE TOKEN TO THE DATABASE
                await AuthUserHandler.addPasswordResetToken({convertTokenToHexString, existingUserId, expireTimeResetToken});

                // GENERATE A LINK TO RESET THE TOKEN
                // const resetUrl = `${config.get<string>('http://localhost:4200')}/auth/reset-password/${resetToken}`;
                // const resetLink = `http://localhost:5000/reset?email=${user.email}?&hash=${hash}`



                // SEND A LINK TO RESET YOUR PASSWORD BY E-MAIL
                // await new Email(user, url).sendPasswordResetToken();



                return response.status(201).json({message: `Password reset link sent to your email account - ${email}`});
            }


        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 POST: Reset Password link
 */
authRouter.post(
    '/reset_password_link',
    async (request: Request, response: Response) => {

        try {
            // TODO isValidToken()
            console.log('request.body', request.body)

            // const {validToken} = request.body.isValidToken;
            // if (!validToken) {
            //     return response.status(400).json({message: `You must provide an validToken`})
            // }
            // const existingValidToken = await AuthUserHandler.findValidTokenById(validToken);
            // if (!existingValidToken) {
            //     return response.status(400).json({message: `User ${validToken} not found`})
            // } else {
            //
            //     // isValidToken()
            //     // function which will take token and id and compare it with saved token and userID
            //
            //
            //     return response.status(201).json({message: `Password reset link sent to your email account - ${email}`});
            // }





            //check for email and hash in query parameter
            // if (req.query && req.query.email && req.query.hash) {
            //     //find user with suh email address
            //     const user = await User.findOne({ email: req.query.email })
            //     //check if user object is not empty
            //     if (user) {
            //         //now check if hash is valid
            //         if (new User(user).verifyPasswordResetHash(req.query.hash)) {
            //             //save email to session
            //             req.session.email = req.query.email;
            //             //issue a password reset form
            //             return res.sendFile(__dirname + '/views/new_pass.html')
            //         } else {
            //             return res.status(400).json({
            //                 message: "You have provided an invalid reset link"
            //             })
            //         }
            //     } else {
            //         return res.status(400).json({
            //             message: "You have provided an invalid reset link"
            //         })
            //     }
            // } else {
            //     //if there are no query parameters, serve the normal request form
            //     return res.sendFile(__dirname + '/views/reset.html')
            // }


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
