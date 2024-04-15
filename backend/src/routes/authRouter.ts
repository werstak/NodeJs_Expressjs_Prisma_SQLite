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

            /** Setting the token expire (10 MINUTES) */
            const lifeTime: number = 20;
            const expireTimeReset = new Date(Date.now() + lifeTime * 60 * 1000);

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
            console.log(1, 'request.body', request.body)
            const {passwordResetToken} = request.body;
            if (!passwordResetToken) {
                return response.status(400).json({message: `Missing password reset token.`})
            }

            /** Chek existence PasswordResetToken */
            const userId: number = passwordResetToken.id;
            const responseResetToken = passwordResetToken.token;
            const existingPasswordResetToken = await AuthUserHandler.findPasswordResetToken(userId);
            console.log(2, 'existingValidPasswordResetToken', existingPasswordResetToken)

            if (!existingPasswordResetToken.length) {
                return response.status(400).json({message: `Token not found`});
            }

            /** Checking the validity and expiration time of the PasswordResetToken */
            const currentTime = new Date();
            const expireResetToken = existingPasswordResetToken[0].resetToken;
            const expireResetTokenTime = existingPasswordResetToken[0].expireTime;

            // console.log(111, 'expireResetToken', expireResetToken)
            // console.log(111, 'responseResetToken', responseResetToken)

            if (responseResetToken !== expireResetToken) {
                return response.status(400).json({message: `Invalid or Expired Token!`});
            }

            console.log(123, 'currentTime', currentTime)
            console.log(456, 'expireResetTokenTime', expireResetTokenTime)

            if (expireResetTokenTime.getTime() < currentTime.getTime()) {
                return response.status(400).json({message: `Time to change password has expired. Submit a new request to change your password!`});
            }

            /** Calculating the remaining lifetime of a PasswordResetToken */
            const currentTimeMin = new Date(currentTime).getTime();
            const expireResetTokenTimeMin = new Date(expireResetTokenTime).getTime();
            const lifetimePasswordResetToken = Math.round((expireResetTokenTimeMin - currentTimeMin) / 60 / 1000);

            // console.log(987, 'currentTimeMin', currentTimeMin)
            // console.log(987, 'expireResetTokenTimeMin', expireResetTokenTimeMin)
            // console.log(987, 'lifetimePasswordResetToken', lifetimePasswordResetToken)

            return response.status(201).json({message: `Password reset page is available for another - (${lifetimePasswordResetToken}) minutes`});
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**
 POST: Change Password
 */
authRouter.put(
    '/change_password',
    async (request: Request, response: Response) => {

        try {
            console.log(1, 'request.body', request.body)
            const {password, passwordResetToken} = request.body;

            console.log(2, ' POST: Change Password', password, passwordResetToken);

            if (!passwordResetToken || !password) {
                return response.status(400).json({message: `Missing password or password reset token.`})
            }

            /** Chek existence PasswordResetToken */
            const userId: number = Number(passwordResetToken.id);
            const responseResetToken = passwordResetToken.token;
            const existingPasswordResetToken = await AuthUserHandler.findPasswordResetToken(userId);
            console.log(2, 'existingValidPasswordResetToken', existingPasswordResetToken)

            if (!existingPasswordResetToken.length) {
                return response.status(400).json({message: `Token not found`});
            }

            /** Checking the validity and expiration time of the PasswordResetToken */
            const currentTime = new Date();
            const expireResetToken = existingPasswordResetToken[0].resetToken;
            const expireResetTokenTime = existingPasswordResetToken[0].expireTime;

            // console.log(111, 'expireResetToken', expireResetToken)
            // console.log(111, 'responseResetToken', responseResetToken)

            if (responseResetToken !== expireResetToken) {
                return response.status(400).json({message: `Invalid or Expired Token!`});
            }

            // console.log(123, 'currentTime', currentTime)
            // console.log(456, 'expireResetTokenTime', expireResetTokenTime)

            if (expireResetTokenTime.getTime() < currentTime.getTime()) {
                return response.status(400).json({message: `Time to change password has expired. Submit a new request to change your password!`});
            }

            // /** Calculating the remaining lifetime of a PasswordResetToken */
            // const currentTimeMin = new Date(currentTime).getTime();
            // const expireResetTokenTimeMin = new Date(expireResetTokenTime).getTime();
            // const lifetimePasswordResetToken = Math.round((expireResetTokenTimeMin - currentTimeMin) / 60 / 1000);
            console.log(2323, 'request.body.password', request.body.password);

            const hashNewPassword = bcrypt.hashSync(request.body.password, 7);

            console.log(4545, 'hashPassword', hashNewPassword
            )
            const newUserPassword: any = {password: hashNewPassword};

            console.log(5656, newUserPassword)
            await AuthUserHandler.changePasswordHandler(newUserPassword, userId);

            // return response.status(200).json(updatedUserPassword);
            return response.status(201).json({message: `Password changed successfully!`});


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
