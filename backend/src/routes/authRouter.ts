import express from 'express';
import type { Request, Response } from 'express';
import * as AuthUserHandler from '../controllers/authController';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { check } from 'express-validator';
import crypto from 'crypto';

import * as UserHandler from '../controllers/users.conroller';

import { generateTokens } from '../utils/jwt';
import { handlerEmailSending } from '../utils/sendEmail';
import { hashToken } from '../utils/hashToken';


export interface RefreshToken {
    userId: number
    jti: string
    iat: number
    exp: number
}


export const authRouter = express.Router();

const urlClient = process.env.BASE_URL_CLIENT as string;

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

            /** Chek existence User */
            const existingUser = await AuthUserHandler.findUserInfoByEmail(email);
            if (!existingUser) {
                return response.status(400).json({message: `User ${email} not found`})
            }
            console.log(1, '/verify_email  - existingUser', existingUser)

            const existingUserId: number = existingUser.id;
            const existingResetTokens = existingUser.passwordResetToken;

            // console.log(11, 'existingUserId', existingUserId);
            // console.log(111, 'existingResetTokens', existingResetTokens);

            /** Delete existing PasswordResetTokens */
            if (existingResetTokens.length) {
                // const existingResetTokenId: number = existingUser.passwordResetToken[0].id;
                // console.log(1111, 'existingResetTokenId', existingResetTokenId);
                await AuthUserHandler.deletePreviousPasswordResetTokens();
            }


            /** Generate PasswordResetToke */
            const generatedPasswordResetToken = crypto.randomBytes(32);
            if (!generatedPasswordResetToken) {
                return response.status(500).json({
                    message: 'An error occured. Please try again later.',
                    status: 'error',
                });
            }
            const convertPasswordResetToken = generatedPasswordResetToken.toString('hex');

            /** Setting the token expire (5 MINUTES) */
            const expireTimeReset = new Date(Date.now() + 2 * 60 * 1000);

            // const expireTimeToken = Date.now() + 1800000;
            // const expireTimeReset = Date.now() + 5 * 60 * 1000;

            // const validPassword = bcrypt.compareSync(password, existingUser.password)
            // console.log(4, 'expireTimeToken =', expireTimeToken);

            console.log(3, 'convertPasswordResetToken =', convertPasswordResetToken);
            console.log(4, 'expireTimeReset =', expireTimeReset);
            console.log(4, 'expireTimeReset =', expireTimeReset.getTime());
            console.log(4, 'expireTimeReset =', expireTimeReset.toISOString());

            /** Write the token to the database */
            await AuthUserHandler.addPasswordResetToken(convertPasswordResetToken, existingUserId, expireTimeReset.toISOString());

            /** Generate a link to reset the token */
            const resetLink = `${urlClient}/auth/reset-password?id=${existingUser.id}&token=${convertPasswordResetToken}`

            // const resetUrl = `${config.get<string>('http://localhost:4200')}/auth/reset-password/${resetToken}`;
            // const resetLink = `http://localhost:5000/reset?email=${user.email}?&hash=${hash}`
            // const link = `${urlClient}/password-reset/${user._id}/${token.token}`;

            /** SEND a link to reset your password by e-mail */
            // Set transporter options:
            const subject = 'Reset password!'
            const htmlContent = `<h2>Hi ${existingUser.firstName}</h2> <p>To set a new password, follow this link ${resetLink}</p>`
            const text = `To set a new password, follow this link ${resetLink}`

            // Start send E-MAIL
            await handlerEmailSending(existingUser, email, subject, htmlContent, text);

            return response.status(201).json({message: `Password reset link sent to your email account - ${email}`});

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
            console.log(7777, 'request.body', request.body)

            const {passwordResetToken} = request.body;
            if (!passwordResetToken) {
                return response.status(400).json({message: `You must provide a token to reset your password.`})
            }

            console.log(888, 'passwordResetToken', passwordResetToken)

            const userId: number = passwordResetToken.id;
            const currentPasswordResetToken = passwordResetToken.token;

            console.log(333, 'userId', userId)

            // 888 passwordResetToken {
            //     id: '165',
            //         token: '816c127f396f60ee5abc31604d4a1c080300c729c37ba7e0050b74e35f1cbe60'
            // }

            const existingPasswordResetToken = await AuthUserHandler.findPasswordResetToken(userId);
            console.log(444, 'existingValidPasswordResetToken', existingPasswordResetToken)

            // if (!expireTimePasswordResetToken.length) {
            //     return response.status(400).json({message: `User  not found`});
            // }

            const currentTime = new Date();
            const expireTimePasswordResetToken = existingPasswordResetToken[0].expireTime;

            console.log(123, 'currentTime', currentTime)
            console.log(456, 'expireTimePasswordResetToken', expireTimePasswordResetToken)

            if (expireTimePasswordResetToken.getTime() > currentTime.getTime()) {
                console.log('Available change password');
            } else {
                console.log('Not available change password');
            }






            // if (!expireTimePasswordResetToken.length) {
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

            return response.status(201).json({message: `Password reset page is available for another - ${10} minutes`});
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
