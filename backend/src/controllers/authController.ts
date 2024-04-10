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


export const addRefreshTokenToWhitelist = async ({ jti, refreshToken, userId }: any): Promise<any | null> => {
    return db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId: userId
        },
    });
}


export const findRefreshTokenById = async (id: any): Promise<any | null> => {
    console.log(555, 'authController', 'findRefreshTokenById()', id)
    return db.refreshToken.findUnique({
        where: {
            id,
        },
    });
}


export const deleteRefreshToken = async (id: any): Promise<any | null> => {
    console.log(555, 'authController', 'deleteRefreshToken()', id)
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
    console.log(555, 'authController', 'revokeTokens()', id)
    await db.refreshToken.delete({
        where: {
            id,
        },
    });
}

export const findPasswordResetToken = async (id: number): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            id,
        },
        select: {
            passwordResetToken: true
        },
    });
};



export const deletePreviousPasswordResetTokens = async (id: number): Promise<any | null> => {
    console.log(555, 'authController', 'deletePasswordResetTokens()', id);

    // await db.passwordResetToken.delete({
    //     where: {
    //         userId: 165
    //     },
    // });

    // await db.passwordResetToken.deleteMany ({
    //     where: {
    //         userId: {
    //             contains: id,
    //         },
    //     },
    // });

    // await db.passwordResetToken.deleteMany ({
    //     where: {
    //         userId: id
    //     },
    // });

    await db.passwordResetToken.deleteMany ({
        where: {
            userId: id
        },
    });
}


export const addPasswordResetToken = async (convertPasswordResetToken: any, userId: any, expireTimeReset: any): Promise<any | null> => {
    console.log(555, 'authController', 'addPasswordResetToken()', convertPasswordResetToken, userId, "expireTimeReset", expireTimeReset)
    return db.passwordResetToken.create({
        data: {
            resetToken: convertPasswordResetToken,
            userId,
            expireTime: expireTimeReset
        },
    });
}



// export const revokeTokens = async (userId: any): Promise<any | null> => {
//     console.log(22, 'revokeTokens()', userId)
//     return db.refreshToken.updateMany({
//         where: {
//             userId
//         },
//         data: {
//             revoked: true
//         }
//     });
// }
