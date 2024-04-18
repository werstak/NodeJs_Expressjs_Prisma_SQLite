import db from '../utils/db';
import { hashToken } from '../utils/hashToken'


/**
 * will be realized through the prisma
 * */

export const findUserByEmail = async (email: string): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            email: email,
        },
    });
};


export const findUserInfoByEmail = async (email: string): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            password: true,
            firstName: true,
            lastName: true,
            passwordResetToken: true

        },
    });
};


export const addRefreshTokenToWhitelist = async ({jti, refreshToken, userId}: any): Promise<any | null> => {
    return db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId: userId
        },
    });
}


export const findRefreshTokenById = async (id: any): Promise<any | null> => {
    return db.refreshToken.findUnique({
        where: {
            id,
        },
    });
}


export const deleteRefreshToken = async (id: any): Promise<any | null> => {
    return db.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true
        }
    });
}


export const revokeTokens = async (id: any): Promise<any | null> => {
    await db.refreshToken.delete({
        where: {
            id,
        },
    });
}


export const findPasswordResetToken = async (userId: number): Promise<any | null> => {
    return db.passwordResetToken.findMany({
        where: {
            userId: +userId,
        },
    });
}


export const deletePreviousPasswordResetTokens = async (): Promise<any | null> => {
    await db.passwordResetToken.deleteMany({});
}


export const addPasswordResetToken = async (convertPasswordResetToken: any, userId: any, expireTimeReset: any): Promise<any | null> => {
    return db.passwordResetToken.create({
        data: {
            resetToken: convertPasswordResetToken,
            userId,
            expireTime: expireTimeReset
        },
    });
}

export const changePasswordHandler = async (newPassword: any, userId: number): Promise<any> => {
    const {password} = newPassword;
    return db.user.update({
        where: {
            id: userId,
        },
        data: {
            password,
        }
    });
};
