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


export const addRefreshTokenToWhitelist = async ({ jti, refreshToken, userId }: any): Promise<any | null> => {
    console.log(101010100, 'jti', jti)
    console.log(101010100, 'refreshToken', refreshToken)
    console.log(101010100, 'userId', userId)
    return db.refreshToken.create({
        data: {
            id: jti,
            // hashedToken: refreshToken,
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


export const revokeTokens = async (userId: any): Promise<any | null> => {
    return db.refreshToken.updateMany({
        where: {
            userId
        },
        data: {
            revoked: true
        }
    });
}
